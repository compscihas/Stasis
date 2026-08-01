# Stasis AI privacy

Effective 1 August 2026.

Stasis AI is local-first. WHOOP records, derived health metrics, profile data, journals, workout routes, AI chat history, and settings are stored on the phone. The existing SQLite database is the primary source of truth. BLE synchronization, analytics, and normal app use work without an account or server.

## When data leaves the phone

Nothing is uploaded to a Stasis server by default.

The optional self-hosted mirror sends data only after the user configures a backend, chooses a scope, gives explicit health-data consent, and initiates synchronization. “Derived” sends bounded daily/session/journal views and excludes raw sensor tables and GPS routes. “Full database” sends a compressed SQLite snapshot and may contain raw and sensitive health records. Failed requests remain queued locally for retry; idempotency keys prevent duplicate ingestion when a request is repeated.

The AI Coach sends the user’s prompt and either model-requested results from approved derived views or a bounded fallback JSON summary to the configured LLM. It never gives the model a database handle. Raw sensor tables and GPS routes are denied. Proposed journal, workout, period, or step-goal writes require confirmation in tool mode.

## Credentials and transport

LLM API keys and backend bearer tokens are stored in the platform Keychain/Keystore through secure storage. Base URLs, model names, consent, and non-secret options are stored in local preferences. No credential is hardcoded.

Production endpoints should use authenticated HTTPS with a valid certificate. Plain HTTP can be explicitly enabled only for loopback/private-network development hosts; traffic is then unencrypted on that network. The mobile manifests permit cleartext so IP-based lab endpoints can function, while app-level validation blocks public HTTP for the LLM and mirror. A VPN such as WireGuard/Tailscale or HTTPS reverse proxy is preferred.

## Diagnostics and original infrastructure

Firebase Analytics, Crashlytics, and Performance collection are disabled at native startup. They remain unavailable unless the developer supplies their own Firebase configuration and the user opts in. The Stasis build template does not configure the original OpenStrap backend, companion service, telemetry, crash, OTA, or health-data endpoints. No health data, telemetry, or crash data is intentionally sent to original infrastructure.

Apple Health/Health Connect exports occur only after platform permission. Map tiles may be fetched while viewing routes; route coordinates are not included in derived mirror or LLM context.

Deleting the app normally deletes its local app data, subject to platform backup/keychain behavior. Server-side deletion and retention are controlled by the self-hosted operator and should implement the API contract’s deletion endpoint and retention policy.
