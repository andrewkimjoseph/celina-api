# HTTP

Base URL: see [Base URL](../getting-started/base-url.md).

| Method | Path | Success body |
|--------|------|----------------|
| GET | `/` | `{ ok, service, read_only }` |
| GET | `/health` | `{ ok, service: "celina-api", checks: { celoRpc, ethRpc } }` — **503** if the Celo RPC check fails. A failed Ethereum check stays in `checks.ethRpc` and still returns 200 |
| GET | `/v1/tools` | `{ count, tools: [{ name, title, description, inputs }] }` |
| GET | `/v1/:name` | One tool object |
| POST | `/v1/:name` | Tool result (JSON-safe; `bigint` values become strings) |

`:name` is the catalog tool name (`get_network_status`, not a REST resource id).

Unknown `:name` → **404**. Validation errors → **400**. Execution failures → **502**. See [Errors](../getting-started/errors.md).

Off-chain dashboard reads are on [celina-stats-api](https://api.stats.usecelina.xyz) (`GET /offchain/*`), not this API. See [Telemetry](../guides/telemetry.md#off-chain-stats).

## Headers

| Header | Purpose |
|--------|---------|
| `Content-Type` | `application/json` on `POST /v1/:name` |
| `X-Celina-Client` | Optional telemetry `device_id` override (sanitized; default `celina_api`). See [Telemetry](../guides/telemetry.md). |
