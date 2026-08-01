# Stasis AI self-hosted backend API

Base URL is configured with `STASIS_BACKEND_URL` or in-app. SQLite remains authoritative; this API is an optional mirror.

## Upload

`POST /v1/sync/uploads`

Headers:

- `Authorization: Bearer …` when configured
- `Idempotency-Key: <sha256-of-compressed-body>` (required)
- `X-Stasis-Sync-Scope: derived|fullDatabase`
- `Content-Encoding: gzip`
- `Content-Type: application/json+gzip` for derived or `application/vnd.sqlite3+gzip` for full

Return `200`, `201`, or `204` after durable ingestion. The server must atomically store the idempotency key with the result and return the original success for repeats. For derived payloads, upsert natural/versioned keys (`day_id + algo_version`, session ID, journal date/ID) inside a transaction. Never append blindly.

Recommended response:

```json
{"upload_id":"...","idempotency_key":"...","accepted":true}
```

Use `401/403` for authentication, `409` only for an idempotency-key/body mismatch, `413` for size limits, and `422` for schema errors. Rate-limit by authenticated installation.

## Derived schema

The decompressed object has `schema: stasis.derived.v1`, `created_at`, `daily`, `sessions`, and `insights`. It contains derived views only and excludes raw sensor/GPS tables. Reject unknown schema versions rather than guessing.

## Operations and security

Terminate TLS, authenticate every production upload, encrypt storage/backups, define retention and deletion, avoid request-body logging, and expose health/metrics without logging payloads. A deployment should also offer authenticated status and deletion endpoints such as `GET /v1/sync/status` and `DELETE /v1/sync/data`.
