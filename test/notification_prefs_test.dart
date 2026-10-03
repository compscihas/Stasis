import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:stasis_ai/notify/notification_prefs.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('morning check-in defaults to enabled at 8:00 AM', () async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await NotificationPrefs.load();
    expect(prefs.morningCheckinEnabled, isTrue);
    expect(prefs.morningCheckinHour, 8);
    expect(prefs.morningCheckinMinute, 0);
  });

  test('morning check-in preference and time persist', () async {
    SharedPreferences.setMockInitialValues({});
    final prefs = (await NotificationPrefs.load()).copyWith(
      morningCheckinEnabled: false,
      morningCheckinHour: 7,
      morningCheckinMinute: 30,
    );
    await prefs.save();
    final loaded = await NotificationPrefs.load();
    expect(loaded.morningCheckinEnabled, isFalse);
    expect(loaded.morningCheckinHour, 7);
    expect(loaded.morningCheckinMinute, 30);
  });
}
