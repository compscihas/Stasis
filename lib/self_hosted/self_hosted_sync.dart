import 'dart:convert';
import 'dart:io';
import 'package:crypto/crypto.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../data/db.dart';

enum SelfHostedSyncScope { derived, fullDatabase }

class SelfHostedSyncSettings extends ChangeNotifier {
  static const buildBaseUrl = String.fromEnvironment(
    'STASIS_BACKEND_URL',
    defaultValue: '',
  );
  static const _urlKey = 'stasis_sync_url';
  static const _consentKey = 'stasis_sync_consent';
  static const _scopeKey = 'stasis_sync_scope';
  static const _allowHttpKey = 'stasis_sync_allow_local_http';
  static const _tokenKey = 'stasis_sync_api_token';

  final FlutterSecureStorage _secure;
  SelfHostedSyncSettings({FlutterSecureStorage? secure})
    : _secure = secure ?? const FlutterSecureStorage();

  String baseUrl = buildBaseUrl;
  String? apiToken;
  bool consented = false;
  bool allowLocalHttp = false;
  SelfHostedSyncScope scope = SelfHostedSyncScope.derived;

  Future<void> load() async {
    final p = await SharedPreferences.getInstance();
    baseUrl = p.getString(_urlKey) ?? buildBaseUrl;
    consented = p.getBool(_consentKey) ?? false;
    allowLocalHttp = p.getBool(_allowHttpKey) ?? false;
    scope = SelfHostedSyncScope.values.firstWhere(
      (v) => v.name == p.getString(_scopeKey),
      orElse: () => SelfHostedSyncScope.derived,
    );
    try {
      apiToken = await _secure.read(key: _tokenKey);
    } catch (_) {
      apiToken = null;
    }
    notifyListeners();
  }

  Future<void> save({
    required String url,
    required String token,
    required bool consent,
    required bool localHttp,
    required SelfHostedSyncScope uploadScope,
  }) async {
    final error = validateUrl(url, allowLocalHttp: localHttp);
    if (error != null && url.trim().isNotEmpty) throw ArgumentError(error);
    final p = await SharedPreferences.getInstance();
    baseUrl = url.trim().replaceFirst(RegExp(r'/+$'), '');
    apiToken = token.trim().isEmpty ? null : token.trim();
    consented = consent;
    allowLocalHttp = localHttp;
    scope = uploadScope;
    await p.setString(_urlKey, baseUrl);
    await p.setBool(_consentKey, consented);
    await p.setBool(_allowHttpKey, allowLocalHttp);
    await p.setString(_scopeKey, scope.name);
    if (apiToken == null) {
      await _secure.delete(key: _tokenKey);
    } else {
      await _secure.write(key: _tokenKey, value: apiToken);
    }
    notifyListeners();
  }

  static String? validateUrl(String value, {required bool allowLocalHttp}) {
    final u = Uri.tryParse(value.trim());
    if (u == null || !u.hasScheme || u.host.isEmpty) {
      return 'Enter a complete backend URL.';
    }
    if (u.scheme == 'https') return null;
    if (u.scheme != 'http') return 'Only HTTP and HTTPS are supported.';
    if (!allowLocalHttp) {
      return 'HTTP requires explicit local-development permission.';
    }
    final h = u.host.toLowerCase();
    if (h == 'localhost' || h == '::1') return null;
    final parts = h.split('.').map(int.tryParse).toList();
    if (parts.length != 4 || parts.any((v) => v == null)) {
      return 'HTTP is restricted to private-network addresses.';
    }
    final a = parts[0]!;
    final b = parts[1]!;
    final private =
        a == 10 ||
        a == 127 ||
        (a == 192 && b == 168) ||
        (a == 172 && b >= 16 && b <= 31) ||
        (a == 169 && b == 254);
    return private ? null : 'HTTP is restricted to private-network addresses.';
  }
}

class SelfHostedSyncException implements Exception {
  final String message;
  SelfHostedSyncException(this.message);
  @override
  String toString() => message;
}

/// Optional mirror uploader. SQLite remains the source of truth; failures are
/// queued and never affect BLE sync, ACK ordering, analytics, or normal UI.
class SelfHostedSyncService {
  static const _pendingKey = 'stasis_sync_pending';
  static const _statusKey = 'stasis_sync_status';
  static const int maxDerivedBytes = 2 * 1024 * 1024;

  final SelfHostedSyncSettings settings;
  final http.Client _client;
  final Future<File> Function()? _outboxFileOverride;

  SelfHostedSyncService(
    this.settings, {
    http.Client? client,
    Future<File> Function()? outboxFile,
  }) : _client = client ?? http.Client(),
       _outboxFileOverride = outboxFile;

  static bool mayUpload({required bool consented, required String baseUrl}) =>
      consented && baseUrl.trim().isNotEmpty;

  Future<String?> status() async =>
      (await SharedPreferences.getInstance()).getString(_statusKey);

  Future<void> enqueueAndUpload() async {
    if (!mayUpload(consented: settings.consented, baseUrl: settings.baseUrl)) {
      throw SelfHostedSyncException(
        'Enable consent and configure a backend before uploading health data.',
      );
    }
    final error = SelfHostedSyncSettings.validateUrl(
      settings.baseUrl,
      allowLocalHttp: settings.allowLocalHttp,
    );
    if (error != null) throw SelfHostedSyncException(error);

    final payload = settings.scope == SelfHostedSyncScope.fullDatabase
        ? await _fullDatabasePayload()
        : await _derivedPayload();
    final file = await _outboxFile();
    await file.writeAsBytes(payload, flush: true);
    final p = await SharedPreferences.getInstance();
    await p.setString(_pendingKey, settings.scope.name);
    await p.setString(_statusKey, 'Queued ${payload.length} bytes');
    await retryPending();
  }

  Future<bool> retryPending() async {
    if (!mayUpload(consented: settings.consented, baseUrl: settings.baseUrl)) {
      return false;
    }
    final p = await SharedPreferences.getInstance();
    final scope = p.getString(_pendingKey);
    final file = await _outboxFile();
    if (scope == null || !await file.exists()) return false;
    final bytes = await file.readAsBytes();
    final key = sha256.convert(bytes).toString();
    try {
      final response = await uploadBytes(
        bytes,
        SelfHostedSyncScope.values.firstWhere((v) => v.name == scope),
      );
      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw SelfHostedSyncException(
          'Backend returned HTTP ${response.statusCode}. Upload remains queued.',
        );
      }
      await file.delete();
      await p.remove(_pendingKey);
      await p.setString(
        _statusKey,
        'Uploaded successfully (${key.substring(0, 12)})',
      );
      return true;
    } catch (e) {
      await p.setString(_statusKey, 'Upload failed; queued for retry: $e');
      rethrow;
    }
  }

  /// Network seam kept public for contract tests and backend implementors.
  /// The same compressed body always produces the same idempotency key.
  @visibleForTesting
  Future<http.Response> uploadBytes(
    Uint8List bytes,
    SelfHostedSyncScope scope,
  ) {
    if (!mayUpload(consented: settings.consented, baseUrl: settings.baseUrl)) {
      throw SelfHostedSyncException('Upload is not configured or consented.');
    }
    final urlError = SelfHostedSyncSettings.validateUrl(
      settings.baseUrl,
      allowLocalHttp: settings.allowLocalHttp,
    );
    if (urlError != null) throw SelfHostedSyncException(urlError);
    final key = sha256.convert(bytes).toString();
    return _client
        .post(
          Uri.parse('${settings.baseUrl}/v1/sync/uploads'),
          headers: {
            'content-type': scope == SelfHostedSyncScope.fullDatabase
                ? 'application/vnd.sqlite3+gzip'
                : 'application/json+gzip',
            'content-encoding': 'gzip',
            'idempotency-key': key,
            'x-stasis-sync-scope': scope.name,
            if (settings.apiToken?.isNotEmpty == true)
              'authorization': 'Bearer ${settings.apiToken}',
          },
          body: bytes,
        )
        .timeout(const Duration(seconds: 60));
  }

  Future<Uint8List> _derivedPayload() async {
    final db = await LocalDb.instance;
    final data = <String, Object?>{
      'schema': 'stasis.derived.v1',
      'created_at': DateTime.now().toUtc().toIso8601String(),
      'daily': await db.rawQuery(
        'SELECT * FROM v_daily ORDER BY date DESC LIMIT 366',
      ),
      'sessions': await db.rawQuery(
        'SELECT * FROM v_sessions ORDER BY start_ts DESC LIMIT 500',
      ),
      'insights': await db.rawQuery(
        'SELECT * FROM v_insights ORDER BY created_at DESC LIMIT 366',
      ),
    };
    final raw = utf8.encode(jsonEncode(data));
    if (raw.length > maxDerivedBytes) {
      throw SelfHostedSyncException(
        'Derived upload exceeds the 2 MB safety limit.',
      );
    }
    return Uint8List.fromList(gzip.encode(raw));
  }

  Future<Uint8List> _fullDatabasePayload() async {
    final path = await LocalDb.exportCopy();
    final file = File(path);
    try {
      return Uint8List.fromList(gzip.encode(await file.readAsBytes()));
    } finally {
      if (await file.exists()) await file.delete();
    }
  }

  Future<File> _outboxFile() async {
    if (_outboxFileOverride != null) return _outboxFileOverride();
    final dir = await getApplicationSupportDirectory();
    return File('${dir.path}${Platform.pathSeparator}stasis_sync_outbox.bin');
  }

  void close() => _client.close();
}
