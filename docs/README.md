# Introduction

<div align="center"><img src="https://raw.githubusercontent.com/andrewkimjoseph/celina-sdk/main/assets/celina-banner.png" alt="Celina — Give your LLM a wallet on Celo"></div>

## Celina API

Public **read-only** REST API for Celo mainnet. It invokes the same Celina SDK **read** tools used by MCP — snake_case names like `get_actionable_governance_proposals` — without a private key on the server.

| Layer | Role |
|-------|------|
| **SDK** | Chain logic and tool catalog (`@andrewkimjoseph/celina-sdk/tools`) |
| **MCP** | Cursor / Claude tools (stdio writes or [hosted MCP](https://mcp.usecelina.xyz)) |
| **Celina API** (this product) | `GET`/`POST /v1/:name` — reads and quotes only |

Hosted MCP still exposes `prepare_*`. This HTTP API does **not**. There is no API key.

### What you can call

Token balances, network/blocks/txs, Mento/Uniswap/GoodDollar quotes, governance and staking reads, ENS, NFTs, generic contract reads, humanness, Self verify/lookup, AgentKarma.

Wallet-scoped tools need an explicit `address` / `wallet_address` / `from` in the JSON body.

See [Quick start](getting-started/quick-start.md) and the generated [tool list](reference/tools.md).
