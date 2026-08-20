# Security — Celina API

Suggested production host: [https://api.usecelina.xyz](https://api.usecelina.xyz) (attach on the Cloudflare Worker).

## Deployment profile

This API is a **public, read-only** HTTP surface over the Celina SDK tool catalog:

- Chain reads, oracle/AMM quotes, governance/staking reads, GoodDollar identity/UBI reads, Self verify/lookup, AgentKarma
- **No server signing keys** — do not set `CELO_PRIVATE_KEY` or `SELF_AGENT_PRIVATE_KEY`
- **No fund movement** — `prepare_*`, `execute_*`, `estimate_*`, and `send_token` are not registered

## Authentication

**There is no API key.** CORS is open. The same model as [hosted MCP](https://mcp.usecelina.xyz): reads only, no secrets in the environment.

## What is exposed

| Exposure | Details |
|----------|---------|
| `GET /v1/tools` | Tool names, titles, descriptions, and input fields |
| `POST /v1/:name` | On-chain and HTTP reads via the SDK |
| Secrets | None |

## Abuse mitigations

- Cloudflare Workers CPU, duration, and concurrency limits
- RPC provider rate limits on `CELINA_RPC_URL`
- Read-only catalog — no token sends or signed writes

## Reporting

Report security concerns via [GitHub Issues](https://github.com/andrewkimjoseph/celina-api/issues) (or the [celina meta-repo](https://github.com/andrewkimjoseph/celina) if unsure which submodule owns the finding).
