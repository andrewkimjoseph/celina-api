<p align="center">
  <img src="https://raw.githubusercontent.com/andrewkimjoseph/celina-sdk/main/assets/celina-banner.png" alt="Celina — Give your LLM a wallet on Celo">
</p>

# Celina API

Public **read-only** HTTP API for [Celina SDK](https://github.com/andrewkimjoseph/celina-sdk) tools on Celo mainnet. Same snake_case catalog as MCP (`get_actionable_governance_proposals`), no server keys, no `prepare_*` / `execute_*` / `estimate_*`.

**Full docs:** [celina-api on GitBook](https://andrewkimjoseph.gitbook.io/celina-api)

- [Quick start](docs/getting-started/quick-start.md)
- [HTTP reference](docs/reference/http.md)
- [Tool list](docs/reference/tools.md)
- [Read-only surface](docs/concepts/read-only.md)

Suggested production host (you attach this when deploying Pages): `https://api.usecelina.xyz`

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | `{ ok, service: "celina-api" }` |
| GET | `/v1/tools` | List tools |
| GET | `/v1/tools/:name` | One tool metadata |
| POST | `/v1/tools/:name` | Invoke a read tool |

Example:

```bash
curl -sS https://api.usecelina.xyz/v1/tools/get_stablecoin_balances \
  -H 'Content-Type: application/json' \
  -d '{"address":"0xYourAddress"}'
```

## Local dev

```bash
npm install
cp .env.example .dev.vars   # optional RPC overrides
npm test
npm run dev                 # wrangler pages dev
```

Requires Node.js ≥ 20. Depends on published `@andrewkimjoseph/celina-sdk` (exact version) — no `file:` links.

## Deploy (manual Cloudflare Pages)

This repo does not deploy itself. In the Cloudflare dashboard:

1. Create a **Pages** project from `andrewkimjoseph/celina-api` (or upload).
2. Enable **Node.js compatibility** (`nodejs_compat`) — `wrangler.jsonc` already sets `compatibility_flags` and `pages_build_output_dir`.
3. Optional variables: `CELINA_RPC_URL`, `ETH_RPC_URL_MAINNET`.
4. Do **not** set `CELO_PRIVATE_KEY` or `SELF_AGENT_PRIVATE_KEY`.
5. Attach a custom domain (for example `api.usecelina.xyz`).

CLI equivalent (run yourself): connect the GitHub repo in the dashboard, or `npx wrangler pages deploy` from this directory.

A local `npm run build:functions` compile succeeded (~1.8 MB uncompressed Worker bundle, under the typical Pages/Workers size limit).

## Docs for GitBook

Source is [`docs/`](docs/). After catalog/SDK bumps:

```bash
npm run docs:tools
```

Then connect Git Sync — see [GitBook setup](docs/GITBOOK_SETUP.md).
