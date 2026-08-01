# TestFlight deployment

## Apple identifiers

Create these in Apple Developer Certificates, Identifiers & Profiles, replacing `com.mycompany`:

1. App ID `com.mycompany.stasisai` with Bluetooth background use, HealthKit, App Groups, notifications, and Background Modes as applicable.
2. Widget/Live Activity App ID `com.mycompany.stasisai.widget` with App Groups.
3. Watch App ID `com.mycompany.stasisai.watchkitapp` with the same App Group where supported.
4. App Group `group.com.mycompany.stasisai`, assigned to all relevant targets.

Create the matching App Store Connect app using the Runner bundle ID. Do not reuse the original project’s identifiers or TestFlight record.

## Local signing configuration

Copy `ios/Config/Signing.xcconfig.example` to `ios/Config/Signing.xcconfig` and set `APPLE_DEVELOPMENT_TEAM` plus identifiers you own. The local file is gitignored. Open `ios/Runner.xcworkspace` on macOS and verify Signing & Capabilities for Runner, the widget/Live Activity extension, and Watch target. Select your team and automatic signing, or supply your own provisioning profiles outside the repository.

Keep the app, widget, and Watch marketing version/build number aligned. `pubspec.yaml` uses `version: X.Y.Z+N`; native extension values in `project.pbxproj` currently require manual alignment before release.

## Permissions and capabilities

Confirm the Runner entitlements include App Groups and HealthKit; extension/watch entitlements include the same App Group. Keep `bluetooth-central`, `processing`, `fetch`, and workout `location` background modes. Review all Stasis AI Bluetooth, HealthKit, location, notification, and photo-library descriptions in `Info.plist` against enabled features.

## Archive and upload

```bash
flutter clean
flutter pub get
flutter build ipa --release --build-name 1.0.0 --build-number 1 --dart-define-from-file=.env

# Or create the Xcode archive explicitly after flutter pub get:
xcodebuild -workspace ios/Runner.xcworkspace -scheme Runner \
  -configuration Release -destination 'generic/platform=iOS' \
  -archivePath build/ios/archive/StasisAI.xcarchive archive
```

Alternatively choose Any iOS Device (arm64) in Xcode, Product → Archive, validate in Organizer, then Distribute App → App Store Connect → Upload. Resolve signing/capability warnings with your own Apple account. In App Store Connect, complete privacy/nutrition labels, encryption/export-compliance answers, screenshots, TestFlight test information, and add internal testers. This repository cannot sign or upload without your credentials.
