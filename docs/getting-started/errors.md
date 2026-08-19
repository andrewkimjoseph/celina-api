# Errors

Every error body is JSON:

```json
{ "error": "human-readable message" }
```

| Status | When |
|--------|------|
| 400 | Invalid JSON, Zod validation failure, missing required wallet address |
| 404 | Unknown tool name (including writes that exist in MCP but not here) |
| 502 | RPC or upstream failure while executing a valid read |

CORS is allowed from any origin. There is no `401`/`403` — the API is public and read-only.
