import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:stasis_ai/coach/coach_config.dart';
import 'package:stasis_ai/coach/coach_context_fallback.dart';
import 'package:stasis_ai/coach/coach_engine.dart';
import 'package:stasis_ai/data/local_repository.dart';

class _FakeRepo implements LocalRepository {
  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() => SharedPreferences.setMockInitialValues({}));

  test(
    'fallback uses only fixed derived-view queries and bounded JSON',
    () async {
      final seen = <String>[];
      final value = await CoachContextFallback.build(
        runQuery: (sql) async {
          seen.add(sql);
          return '[{"ok":true}]';
        },
      );

      expect(seen, CoachContextFallback.queries);
      expect(seen.every((q) => q.contains(' v_')), isTrue);
      expect(
        seen.any((q) => q.contains('decoded_') || q.contains('raw_')),
        isFalse,
      );
      expect(
        utf8.encode(value).length,
        lessThanOrEqualTo(CoachContextFallback.maxContextBytes),
      );
    },
  );

  test('fallback refuses oversized context', () async {
    await expectLater(
      CoachContextFallback.build(
        runQuery: (_) async =>
            List.filled(CoachContextFallback.maxContextBytes, 'x').join(),
      ),
      throwsStateError,
    );
  });

  test(
    'engine fallback sends bounded context without tool definitions',
    () async {
      final config = CoachConfig();
      await config.save(
        baseUrl: 'https://llm.example.test/v1',
        model: 'small-local-model',
        contextFallback: true,
      );
      late Map<String, dynamic> sent;
      final client = MockClient((request) async {
        sent = jsonDecode(request.body) as Map<String, dynamic>;
        return http.Response(
          jsonEncode({
            'choices': [
              {
                'message': {'content': 'Bounded answer'},
              },
            ],
          }),
          200,
        );
      });
      final engine = CoachEngine(
        config: config,
        api: _FakeRepo(),
        httpClient: client,
        fallbackContextBuilder: () async => '{"daily":[]}',
      );
      final items = <CoachItem>[];

      await engine.send(
        'How am I doing?',
        onItem: items.add,
        onStatus: (_) {},
        confirm: (_) async => false,
      );

      expect(sent, isNot(contains('tools')));
      expect(sent['messages'].toString(), contains('{"daily":[]}'));
      expect(items.last.text, 'Bounded answer');
      engine.dispose();
    },
  );
}
