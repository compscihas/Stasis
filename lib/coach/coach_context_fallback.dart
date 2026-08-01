import 'dart:convert';

import 'coach_db.dart';

/// Builds a small, deterministic context for local models that do not reliably
/// implement tool calling. Every query still passes through CoachDb's read-only,
/// allow-listed-view and structural b-tree checks. Raw sensor and GPS tables are
/// never available to this path.
class CoachContextFallback {
  static const int maxContextBytes = 48 * 1024;

  static const List<String> queries = [
    'SELECT * FROM v_daily ORDER BY date DESC LIMIT 14',
    'SELECT * FROM v_sessions ORDER BY start_ts DESC LIMIT 10',
    'SELECT * FROM v_insights ORDER BY created_at DESC LIMIT 14',
  ];

  static Future<String> build({
    Future<String> Function(String sql)? runQuery,
  }) async {
    final run = runQuery ?? CoachDb.runCoachSql;
    final sections = <Map<String, Object?>>[];
    for (final sql in queries) {
      sections.add({'query': sql, 'result': await run(sql)});
    }
    final encoded = jsonEncode({
      'source': 'bounded_on_device_derived_views',
      'write_access': false,
      'sections': sections,
    });
    if (encoded.length > maxContextBytes) {
      throw StateError(
        'Bounded coach context exceeded $maxContextBytes bytes.',
      );
    }
    return encoded;
  }
}
