# Migration from the original app

Stasis AI uses new Android/iOS application identifiers, so the OS installs it as a separate app. It cannot automatically read another app sandbox.

Export the original app’s SQLite database from its Data section, then import it in Stasis AI. The `openstrap.db` filename, schema, tables, versioned analytics rows, and migration identifiers are intentionally unchanged so the existing additive migration ladder can safely open/import compatible data. Pair the WHOOP band again because Bluetooth association and secure preferences are app-scoped.

AI keys, Firebase configuration, consent choices, notification permission, HealthKit/Health Connect grants, widgets, Live Activities, Watch installation, and background permissions do not migrate; configure them again. The self-hosted mirror starts disabled and does not infer consent from legacy health-contribution settings.

Protocol and analytics Dart package names, method-channel names, native source/type names, and historical identifiers remain as compatibility internals. They are not user-facing branding.
