# Expo migration capability matrix

| Capability | Expo foundation | Status | Release gate |
|---|---|---|---|
| Primary UI and navigation | Expo Router | Preview implemented | Visual/device QA |
| Local SQLite | `expo-sqlite` | Schema and settings foundation | Port v25 migrations and DB parity fixtures |
| BLE connection | `react-native-ble-plx` | Native module configured | Real-band connection tests |
| History offload | Native BLE + protocol port | Hard-disabled | Byte-for-byte fixtures and commit-before-ACK tests |
| Analytics | TypeScript/WASM/native port | Not started | Match every Flutter golden vector; never fabricate |
| Illness Watch | SQLite check-ins + detector feedback seam | Symptom reporting and conservative calibration implemented; signals absent | Port Flutter illness/anomaly goldens before alerts |
| Background BLE | iOS central background mode | Configured only | Restoration and ownership race tests |
| Background derivation | `expo-background-task` | Dependency configured | iOS budget/termination tests |
| Apple Health | custom development-build module | Not started | Permission and idempotent export tests |
| Notifications | `expo-notifications` | Dependency configured | Dedupe, quiet-hour, and permission tests |
| AI Coach | SecureStore + authenticated fetch | General chat connected; no health context | SQL guard and bounded-context parity before metric access |
| Self-hosted mirror | fetch + durable SQLite outbox | Not started | consent, retry, and idempotency tests |
| Widgets/Live Activities | Expo Modules / native extension | Not started | App Group and timeline tests |
| watchOS companion | native Xcode target | Not started | WatchConnectivity and complication tests |

## Non-negotiable migration rules

1. Never ACK band history until raw rows and the exact cursor token commit in one
   durable transaction.
2. Never expose a partially ported history path to a real band.
3. Missing metric input remains absent; preview data stays isolated from storage.
4. Preserve local calendar-day semantics and DST-safe boundaries.
5. Keep raw and decoded data until the corresponding day is fully derived.
6. Use an EAS development build for native features; Expo Go is UI preview only.
