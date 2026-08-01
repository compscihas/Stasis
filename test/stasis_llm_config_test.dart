import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:stasis_ai/coach/coach_config.dart';
import 'package:stasis_ai/coach/coach_engine.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() => SharedPreferences.setMockInitialValues({}));

  test('accepts private HTTP and HTTPS but rejects public plaintext', () {
    expect(
      CoachConfig.validateBaseUrl(
        'http://192.168.1.50:8000/v1',
        allowLocalHttp: true,
      ),
      isNull,
    );
    expect(
      CoachConfig.validateBaseUrl(
        'https://llm.example.com/v1',
        allowLocalHttp: false,
      ),
      isNull,
    );
    expect(
      CoachConfig.validateBaseUrl(
        'http://llm.example.com/v1',
        allowLocalHttp: true,
      ),
      isNotNull,
    );
  });

  test(
    'posts to the configured OpenAI-compatible endpoint without a key',
    () async {
      final config = CoachConfig();
      await config.save(
        baseUrl: 'https://llm.example.test/v1/',
        model: 'local-model',
        timeoutSeconds: 15,
      );
      late http.Request request;
      final client = MockClient((r) async {
        request = r;
        return http.Response(
          jsonEncode({
            'choices': [
              {
                'message': {'content': 'ok'},
              },
            ],
          }),
          200,
        );
      });

      final result = await CoachEngine.postChat(config, {
        'model': 'local-model',
        'messages': [
          {'role': 'user', 'content': 'hello'},
        ],
      }, client: client);

      expect(
        request.url.toString(),
        'https://llm.example.test/v1/chat/completions',
      );
      expect(request.headers, isNot(contains('authorization')));
      expect(config.timeoutSeconds, 15);
      expect(result['content'], 'ok');
    },
  );

  test('request-size ceiling fails before a network call', () async {
    final config = CoachConfig();
    var called = false;
    final client = MockClient((_) async {
      called = true;
      return http.Response('{}', 200);
    });

    await expectLater(
      CoachEngine.postChat(config, {
        'model': 'local-model',
        'messages': [
          {
            'role': 'user',
            'content': List.filled(
              CoachEngine.kMaxRequestBytes + 1,
              'x',
            ).join(),
          },
        ],
      }, client: client),
      throwsA(isA<CoachException>()),
    );
    expect(called, isFalse);
  });
}
