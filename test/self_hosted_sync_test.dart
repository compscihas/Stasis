import 'dart:typed_data';

import 'package:crypto/crypto.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:stasis_ai/self_hosted/self_hosted_sync.dart';

void main() {
  test('consent gates every upload', () {
    expect(
      SelfHostedSyncService.mayUpload(
        consented: false,
        baseUrl: 'https://sync.example',
      ),
      isFalse,
    );
    expect(
      SelfHostedSyncService.mayUpload(
        consented: true,
        baseUrl: 'https://sync.example',
      ),
      isTrue,
    );
    final settings = SelfHostedSyncSettings()
      ..baseUrl = 'https://sync.example'
      ..consented = false;
    final service = SelfHostedSyncService(
      settings,
      client: MockClient((_) async => http.Response('', 204)),
    );
    expect(
      () => service.uploadBytes(Uint8List(0), SelfHostedSyncScope.derived),
      throwsA(isA<SelfHostedSyncException>()),
    );
  });

  test('backend HTTP is private-only and opt-in', () {
    expect(
      SelfHostedSyncSettings.validateUrl(
        'http://10.0.0.2:8080',
        allowLocalHttp: true,
      ),
      isNull,
    );
    expect(
      SelfHostedSyncSettings.validateUrl(
        'http://10.0.0.2:8080',
        allowLocalHttp: false,
      ),
      isNotNull,
    );
    expect(
      SelfHostedSyncSettings.validateUrl(
        'http://sync.example',
        allowLocalHttp: true,
      ),
      isNotNull,
    );
  });

  test(
    'same body has stable idempotency key and authenticated contract',
    () async {
      final settings = SelfHostedSyncSettings()
        ..baseUrl = 'https://sync.example'
        ..consented = true
        ..apiToken = 'secret';
      final requests = <http.Request>[];
      final client = MockClient((request) async {
        requests.add(request);
        return http.Response('', 204);
      });
      final service = SelfHostedSyncService(settings, client: client);
      final body = Uint8List.fromList([1, 2, 3, 4]);

      await service.uploadBytes(body, SelfHostedSyncScope.derived);
      await service.uploadBytes(body, SelfHostedSyncScope.derived);

      final expected = sha256.convert(body).toString();
      expect(requests, hasLength(2));
      expect(requests[0].url.path, '/v1/sync/uploads');
      expect(requests[0].headers['idempotency-key'], expected);
      expect(requests[1].headers['idempotency-key'], expected);
      expect(requests[0].headers['authorization'], 'Bearer secret');
    },
  );
}
