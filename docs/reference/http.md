# HTTP

Base URL: see [Base URL](../getting-started/base-url.md).

| Method | Path | Success body |
|--------|------|----------------|
| GET | `/` | `{ ok, service, read_only }` |
| GET | `/health` | `{ ok: true, service: "celina-api" }` |
| GET | `/v1/tools` | `{ count, tools: [{ name, title, description, inputs }] }` |
| GET | `/v1/tools/:name` | One tool object |
| POST | `/v1/tools/:name` | Tool result (JSON-safe; `bigint` values become strings) |

`:name` is the catalog tool name (`get_network_status`, not a REST resource id).

Unknown `:name` → **404**. Validation errors → **400**. Execution failures → **502**. See [Errors](../getting-started/errors.md).
