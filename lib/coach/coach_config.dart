// CoachConfig — local, BYOK settings for the AI coach. The API key is stored in
// the platform keychain/keystore (flutter_secure_storage); base URL + model in
// SharedPreferences. NOTHING here ever touches our backend — the key stays on the
// device and the app calls the OpenAI-compatible provider directly.

import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CoachConfig extends ChangeNotifier {
  static const _kBaseUrl = 'coach_base_url';
  static const _kModel = 'coach_model';
  static const _kKey = 'coach_api_key'; // secure storage
  static const _kTimeout = 'coach_timeout_seconds';
  static const _kAllowLocalHttp = 'coach_allow_local_http';
  static const _kFallback = 'coach_context_fallback';

  static const String defaultBaseUrl = String.fromEnvironment(
    'STASIS_LLM_BASE_URL',
    defaultValue: 'http://192.168.1.50:8000/v1',
  );
  static const String defaultModel = String.fromEnvironment(
    'STASIS_LLM_MODEL',
    defaultValue: '',
  );

  final FlutterSecureStorage _secure = const FlutterSecureStorage();

  String _baseUrl = defaultBaseUrl;
  String _model = defaultModel;
  String? _key; // cached in-memory after load
  int _timeoutSeconds = 120;
  bool _allowLocalHttp = true;
  bool _contextFallback = false;

  String get baseUrl => _baseUrl;
  String get model => _model;
  String? get apiKey => _key;
  int get timeoutSeconds => _timeoutSeconds;
  bool get allowLocalHttp => _allowLocalHttp;
  bool get contextFallback => _contextFallback;
  bool get hasKey => _key != null && _key!.isNotEmpty;
  bool get configured => _baseUrl.isNotEmpty && _model.isNotEmpty;

  /// Normalised base, no trailing slash.
  String get apiBase {
    var b = _baseUrl.trim();
    while (b.endsWith('/')) {
      b = b.substring(0, b.length - 1);
    }
    return b;
  }

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    _baseUrl = prefs.getString(_kBaseUrl) ?? defaultBaseUrl;
    _model = prefs.getString(_kModel) ?? defaultModel;
    _timeoutSeconds = prefs.getInt(_kTimeout) ?? 120;
    _allowLocalHttp = prefs.getBool(_kAllowLocalHttp) ?? true;
    _contextFallback = prefs.getBool(_kFallback) ?? false;
    try {
      _key = await _secure.read(key: _kKey);
    } catch (_) {
      _key = null;
    }
    notifyListeners();
  }

  Future<void> save({
    String? baseUrl,
    String? model,
    String? apiKey,
    int? timeoutSeconds,
    bool? allowLocalHttp,
    bool? contextFallback,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    if (baseUrl != null) {
      _baseUrl = baseUrl.trim().isEmpty ? defaultBaseUrl : baseUrl.trim();
      await prefs.setString(_kBaseUrl, _baseUrl);
    }
    if (model != null) {
      _model = model.trim();
      await prefs.setString(_kModel, _model);
    }
    if (timeoutSeconds != null) {
      _timeoutSeconds = timeoutSeconds.clamp(5, 300).toInt();
      await prefs.setInt(_kTimeout, _timeoutSeconds);
    }
    if (allowLocalHttp != null) {
      _allowLocalHttp = allowLocalHttp;
      await prefs.setBool(_kAllowLocalHttp, allowLocalHttp);
    }
    if (contextFallback != null) {
      _contextFallback = contextFallback;
      await prefs.setBool(_kFallback, contextFallback);
    }
    if (apiKey != null) {
      final k = apiKey.trim();
      _key = k.isEmpty ? null : k;
      if (k.isEmpty) {
        await _secure.delete(key: _kKey);
      } else {
        await _secure.write(key: _kKey, value: k);
      }
    }
    notifyListeners();
  }

  /// Validates a provider URL before any health context can leave the phone.
  /// Plain HTTP is allowed only for loopback/private-LAN hosts and only when the
  /// user explicitly keeps local HTTP enabled. Production endpoints use HTTPS.
  static String? validateBaseUrl(String value, {required bool allowLocalHttp}) {
    final uri = Uri.tryParse(value.trim());
    if (uri == null || !uri.hasScheme || uri.host.isEmpty) {
      return 'Enter a complete provider URL, including http:// or https://.';
    }
    if (uri.scheme == 'https') return null;
    if (uri.scheme != 'http') {
      return 'Only HTTP and HTTPS endpoints are supported.';
    }
    if (!allowLocalHttp) return 'Local HTTP is disabled. Use HTTPS.';
    if (!_isPrivateHost(uri.host)) {
      return 'Plain HTTP is restricted to loopback or private-network hosts.';
    }
    return null;
  }

  static bool _isPrivateHost(String host) {
    final h = host.toLowerCase();
    if (h == 'localhost' || h == '::1') return true;
    final p = h.split('.').map(int.tryParse).toList();
    if (p.length != 4 || p.any((v) => v == null)) return false;
    final a = p[0]!;
    final b = p[1]!;
    return a == 10 ||
        a == 127 ||
        (a == 192 && b == 168) ||
        (a == 172 && b >= 16 && b <= 31) ||
        (a == 169 && b == 254);
  }
}
