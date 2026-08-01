import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

void main() {
  test('package and native bundle defaults are Stasis-owned placeholders', () {
    final pubspec = File('pubspec.yaml').readAsStringSync();
    final android = File('android/app/build.gradle.kts').readAsStringSync();
    final signing = File(
      'ios/Config/Signing.defaults.xcconfig',
    ).readAsStringSync();
    final plist = File('ios/Runner/Info.plist').readAsStringSync();

    expect(pubspec, contains('name: stasis_ai'));
    expect(android, contains('applicationId = "com.mycompany.stasisai"'));
    expect(signing, contains('APP_BUNDLE_IDENTIFIER = com.mycompany.stasisai'));
    expect(
      signing,
      contains('APP_GROUP_IDENTIFIER = group.com.mycompany.stasisai'),
    );
    expect(plist, contains('<string>Stasis AI</string>'));
  });

  test('original cloud endpoints have no configured defaults', () {
    final env = File('.env.example').readAsStringSync();
    final companion = File(
      'lib/cloud/companion_client.dart',
    ).readAsStringSync();
    final backend = File('lib/cloud/backend_client.dart').readAsStringSync();

    expect(env, isNot(contains('COMPANION_URL=')));
    expect(env, isNot(matches(RegExp(r'^BACKEND_URL=', multiLine: true))));
    expect(companion, contains("defaultValue: ''"));
    expect(companion, contains('legacyTransportEnabled = false'));
    expect(backend, contains("defaultValue: ''"));
  });
}
