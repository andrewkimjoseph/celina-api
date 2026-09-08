# HTTP

Base URL: see [Base URL](../getting-started/base-url.md).

| Method | Path | Success body |
|--------|------|----------------|
| GET | `/` | `{ ok, service, read_only }` |
| GET | `/health` | `{ ok: true, service: "celina-api" }` |
| GET | `/offchain/daily` | `{ rows: [{ day, count }], total }` — `rows` last 90 days; `total` all-time |
| GET | `/offchain/wallets` | `{ daily: [{ day, count }], total }` |
| GET | `/offchain/tools` | `{ rows: [{ event, count }] }` |
| GET | `/offchain/devices` | `{ uniqueDevices }` |
| GET | `/offchain/sync` | `{ lastSyncedAt }` |
| GET | `/v1/tools` | `{ count, tools: [{ name, title, description, inputs }] }` |
| GET | `/v1/:name` | One tool object |
| POST | `/v1/:name` | Tool result (JSON-safe; `bigint` values become strings) |

`:name` is the catalog tool name (`get_network_status`, not a REST resource id).

Unknown `:name` → **404**. Validation errors → **400**. Execution failures (including off-chain stats when Supabase is unavailable) → **502**. See [Errors](../getting-started/errors.md).

`GET /offchain/*` aggregates ingested read-telemetry. Daily rows, wallets, tools, and devices use the last **90 days**; `/offchain/daily` `total` is all-time. They are not tool invocations — see [Telemetry](../guides/telemetry.md#off-chain-stats).

## Headers

| Header | Purpose |
|--------|---------|
| `Content-Type` | `application/json` on `POST /v1/:name` |
| `X-Celina-Client` | Optional telemetry `device_id` override (sanitized; default `celina_api`). See [Telemetry](../guides/telemetry.md). |
