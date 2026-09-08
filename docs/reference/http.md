# HTTP

Base URL: see [Base URL](../getting-started/base-url.md).

| Method | Path | Success body |
|--------|------|----------------|
| GET | `/` | `{ ok, service, read_only }` |
| GET | `/health` | `{ ok: true, service: "celina-api" }` |
| GET | `/v1/tools` | `{ count, tools: [{ name, title, description, inputs }] }` |
| GET | `/v1/:name` | One tool object |
| POST | `/v1/:name` | Tool result (JSON-safe; `bigint` values become strings) |

`:name` is the catalog tool name (`get_network_status`, not a REST resource id).

Unknown `:name` → **404**. Validation errors → **400**. Execution failures → **502**. See [Errors](../getting-started/errors.md).

## Headers

| Header | Purpose |
|--------|---------|
| `Content-Type` | `application/json` on `POST /v1/:name` |
| `X-Celina-Client` | Optional telemetry `device_id` override (sanitized; default `celina_api`). See [Telemetry](../guides/telemetry.md). |
