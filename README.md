# Stasis AI

Stasis AI is a private, local-first Flutter companion for WHOOP 4.0 hardware. It connects directly over BLE, commits history to on-device SQLite before acknowledging the band, derives analytics locally, and can use a self-hosted OpenAI-compatible LLM. It is not affiliated with WHOOP, Inc.

This repository is a branded fork of the MIT-licensed OpenStrap Edge project. Protocol and analytics dependency/package names remain unchanged for compatibility and attribution.

## Local-first architecture

The on-device `openstrap.db` SQLite database remains the source of truth. BLE sync, background capture, analytics, widgets, Live Activities, Apple Health/Health Connect, and the normal UI do not depend on a server. Database/schema names and historical migrations are intentionally preserved.

Optional network paths are:

- your configured LLM at `STASIS_LLM_BASE_URL` or the in-app AI Coach settings;
- your configured mirror at `STASIS_BACKEND_URL` or Profile → Self-hosted mirror;
- Firebase diagnostics only after you add your own Firebase project, build with `STASIS_FIREBASE_ENABLED=true`, and the user opts in.

The original project’s backend and companion URLs have no defaults and are not configured by the Stasis template.

## Quick start

```bash
flutter pub get
flutter run --dart-define-from-file=.env
```

Copy `.env.example` to `.env`. API keys and bearer tokens are entered in-app and stored with `flutter_secure_storage`; do not place secrets in committed files.
Set `STASIS_PRIVACY_URL` to the public HTTPS copy of your privacy policy before TestFlight review.

## Self-hosted LLM

Stasis AI calls `POST {baseUrl}/chat/completions` with the OpenAI chat-completions contract. A typical base is `http://192.168.1.50:8000/v1`. The model name, optional API key, timeout, local-HTTP permission, and bounded-context fallback are configurable in AI Coach settings.

Tool mode preserves the original safety model: a read-only SQLite connection, allow-listed derived `v_*` views, SQL/DML/DDL guards, row/query caps, and SQLite b-tree validation. Writes proposed by tools still require explicit confirmation. Fallback mode sends a bounded JSON summary produced from fixed derived-view queries and exposes no database handle or write tools.

See [Self-hosted LLM setup](guides/SELF_HOSTED_LLM.md).

## Optional self-hosted mirror

Profile → Self-hosted mirror is off by default. The user must configure a URL, select derived views or the full database, explicitly consent, and tap Sync now. Failed uploads remain in a durable on-device outbox. Repeated requests carry a SHA-256 `Idempotency-Key`, allowing servers to return the prior result without duplicate rows.

See [backend API contract](guides/SELF_HOSTED_BACKEND_API.md) and [privacy policy](PRIVACY.md).

## Package identity and TestFlight

Public defaults use:

- Flutter package: `stasis_ai`
- Android application ID: `com.mycompany.stasisai`
- iOS app: `com.mycompany.stasisai`
- widget/Live Activity extension: `com.mycompany.stasisai.widget`
- Watch app: `com.mycompany.stasisai.watchkitapp`
- App Group: `group.com.mycompany.stasisai`
- URL scheme: `stasisai`

Replace `mycompany` with an identifier you control. Copy `ios/Config/Signing.xcconfig.example` to the gitignored `Signing.xcconfig`, set your Apple Team ID and identifiers, and follow [TestFlight setup](guides/TESTFLIGHT.md).

## Verification

```bash
dart format lib test
flutter analyze
flutter test
flutter build apk --dart-define-from-file=.env
# macOS only:
flutter build ipa --release --dart-define-from-file=.env
```

No secrets, signing certificates, provisioning profiles, or private Firebase files belong in this repository.

## Compatibility names intentionally retained

`openstrap_protocol`, `openstrap_analytics`, `openstrap.db`, schema/table/view names, migration identifiers, method-channel names, and native source/type names such as `OpenStrapWidget` remain where changing them could break stored data, protocol behavior, Flutter/native communication, WidgetKit state, or dependency imports. See [migration notes](guides/MIGRATION_FROM_OPENSTRAP.md).

## Rights and attribution

Stasis-specific original contributions are not released under the MIT License.
No permission to copy, modify, or redistribute those contributions is granted
unless separately agreed in writing. Portions inherited from OpenStrap Edge
remain subject to their original MIT terms; see
[Third-Party Notices](THIRD_PARTY_NOTICES.md). Original OpenStrap copyright and
protocol/research attribution are preserved.
