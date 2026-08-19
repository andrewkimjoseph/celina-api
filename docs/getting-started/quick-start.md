# Quick start

All tool names and JSON keys are **snake_case**, matching MCP.

## Health

```bash
curl -sS https://api.usecelina.xyz/health
```

```json
{ "ok": true, "service": "celina-api" }
```

## List tools

```bash
curl -sS https://api.usecelina.xyz/v1/tools
```

## Invoke a tool

```bash
curl -sS https://api.usecelina.xyz/v1/tools/get_stablecoin_balances \
  -H 'Content-Type: application/json' \
  -d '{"address":"0xYourAddress"}'
```

Network status (no wallet):

```bash
curl -sS https://api.usecelina.xyz/v1/tools/get_network_status \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Governance (name is not camelCase):

```bash
curl -sS https://api.usecelina.xyz/v1/tools/get_actionable_governance_proposals \
  -H 'Content-Type: application/json' \
  -d '{}'
```
