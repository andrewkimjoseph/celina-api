<p align="center">
  <img src="https://raw.githubusercontent.com/andrewkimjoseph/celina-sdk/main/assets/celina-banner.png" alt="Celina — Give your LLM a wallet on Celo">
</p>

# Celina API

Public **read-only** HTTP API for [Celina SDK](https://github.com/andrewkimjoseph/celina-sdk) tools on Celo mainnet. Same snake_case catalog as MCP (`get_actionable_governance_proposals`), no server keys, no `prepare_*` / `execute_*` / `estimate_*`.

Deployed as a **Cloudflare Worker** (Hono + `wrangler`).

**Full docs:** [celina-api on GitBook](https://andrewkimjoseph.gitbook.io/celina-api)

- [Quick start](docs/getting-started/quick-start.md)
- [HTTP reference](docs/reference/http.md)
- [Tool list](docs/reference/tools.md)
- [Read-only surface](docs/concepts/read-only.md)
- [Deploy](DEPLOY.md)

Suggested production host: `https://api.usecelina.xyz`

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | `{ ok, service: "celina-api" }` |
| GET | `/v1/tools` | List tools |
| GET | `/v1/:name` | One tool metadata |
| POST | `/v1/:name` | Invoke a read tool |

`GET` returns schema; `POST` runs the tool. Example:

```bash
curl -sS https://api.usecelina.xyz/v1/get_stablecoin_balances \
  -H 'Content-Type: application/json' \
  -d '{"address":"0xYourAddress"}'
```

## Local dev

```bash
npm install
cp .env.example .dev.vars   # optional RPC overrides
npm test
npm run dev                 # wrangler dev → http://localhost:8788
```

Requires Node.js ≥ 20. Depends on published `@andrewkimjoseph/celina-sdk` (exact version) — no `file:` links.

## Deploy

Manual Cloudflare Workers deploy — see **[DEPLOY.md](DEPLOY.md)** for `wrangler login`, variables, custom domain, and smoke tests.

```bash
npm run deploy
```

## Docs for GitBook

Source is [`docs/`](docs/). After catalog/SDK bumps:

```bash
npm run docs:tools
```

Then connect Git Sync — see [GitBook setup](docs/GITBOOK_SETUP.md).
