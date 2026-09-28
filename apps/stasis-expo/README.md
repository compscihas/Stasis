# Stasis AI — Expo migration

This is the React Native/Expo rewrite of Stasis AI. The Flutter app remains at
the repository root as the behavioral reference until every safety-critical
capability reaches parity.

## Current milestone

- Expo SDK 57, React Native 0.86, TypeScript and Expo Router
- Apple-style Today, Sleep, Heart, Workouts, and Profile previews
- native Liquid Glass for supported iOS controls, with translucent fallbacks on older iOS, web, and Android
- automatic light and dark appearances with adaptive navigation, glass, content surfaces, and splash screens
- native SF Symbols on iOS, spring press feedback, light haptics, and draggable form sheets
- SQLite schema foundation with WAL and an exclusive commit-before-ACK seam
- authenticated Stasis Coach chat through the tailnet-only backend
- secure local AI-token storage and private-network URL validation
- local symptom/normal check-ins with illness-signal feedback calibration
- `react-native-ble-plx` configured for an EAS development build
- BLE history offload intentionally disabled until protocol fixtures pass

All displayed sensor values are visibly marked as preview data. User-entered
symptom check-ins are real local records, clearly separated from preview sensor
values. The migration never substitutes preview values into the durable
database or presents them as sensor measurements.

Illness Watch stores one editable check-in per local calendar day in SQLite.
It records explicit normal days as well as symptoms, severity, approximate
onset, optional measured temperature/test status, confounders, and a note. The
local calibration policy abstains until it has both validated wearable detector
outputs and enough matched labels; the Expo migration does not fabricate an
illness signal from preview values.

Coach sends typed chat messages to the configured OpenAI-compatible endpoint.
It does not attach preview metrics, sensor history, or health records. Enter the
server token on the iPhone under Profile → Coach server; it is stored in iOS
SecureStore rather than SQLite or source control.

## Run the UI from Windows

```powershell
npm install
npx expo start
```

The visual shell can open in Expo Go. BLE is unavailable there because Expo Go
does not contain the custom native module.

## Build for a physical iPhone

```powershell
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios --profile development
```

Install the resulting development build on the registered iPhone, then run:

```powershell
npm run dev
```

An Apple Developer membership and registered device are required for a physical
iPhone development build. Replace `com.mycompany.stasisai` with a bundle ID you
control before configuring signing.

## Verification

```powershell
npm run typecheck
npm test
npm run doctor
```

See [CAPABILITY_MATRIX.md](CAPABILITY_MATRIX.md) before enabling any native
feature or removing the Flutter implementation.
