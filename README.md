<p align="center">
  <img src="https://raw.githubusercontent.com/andrewkimjoseph/celina/main/assets/celina-banner.svg" alt="Celina — Give your LLM a wallet on Celo">
</p>

# Celina API

Celina is a third-party, open-source stack that gives an LLM read, prepare, and execute access to Celo mainnet through an SDK, an MCP server, and a REST API. This is the REST API — public and **read-only**, for [Celina SDK](https://github.com/andrewkimjoseph/celina-sdk) tools on Celo mainnet. Same snake_case catalog as MCP (`get_actionable_governance_proposals`), no server keys, no `prepare_*` / `execute_*` / `estimate_*`.

Deployed as a **Cloudflare Worker** (Hono + `wrangler`).

**Full docs:** [celina-api on GitBook](https://andrewkimjoseph.gitbook.io/celina-api)

- [Quick start](docs/getting-started/quick-start.md)
- [HTTP reference](docs/reference/http.md)
- [Telemetry](docs/guides/telemetry.md)
- [Tool list](docs/reference/tools.md)
- [Read-only surface](docs/concepts/read-only.md)
- [Deploy](DEPLOY.md)

Suggested production host: `https://api.usecelina.xyz`

## Telemetry

Read invocations report usage to [celina-stats-api](https://api.stats.usecelina.xyz) via the SDK (`POST /events`). Default `device_id` is `celina_api`. Pass `X-Celina-Client` to override it (sanitized, max 40 characters) — this is how celina-bot appears as `celina_bot`. Off-chain dashboard aggregates are `GET /offchain/*` (computed here from `amplitude_events`). See [Telemetry](docs/guides/telemetry.md).

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | `{ ok, service: "celina-api" }` |
| GET | `/offchain/daily` | `{ rows: [{ day, count }], total }` — event counts (90 days) |
| GET | `/offchain/wallets` | `{ daily: [{ day, count }], total }` — distinct `0x` wallets (90 days) |
| GET | `/offchain/tools` | `{ rows: [{ event, count }] }` — per-tool counts (90 days) |
| GET | `/offchain/devices` | `{ uniqueDevices }` — distinct `device_id` (90 days) |
| GET | `/offchain/sync` | `{ lastSyncedAt }` — Amplitude export cursor |
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

Git-connected Cloudflare Workers Builds — see **[DEPLOY.md](DEPLOY.md)** for dashboard variables, custom domain, and smoke tests. Do not `wrangler deploy` from a different Cloudflare account.

## Docs for GitBook

Source is [`docs/`](docs/). After catalog/SDK bumps:

```bash
npm run docs:tools
```

Then connect Git Sync — see [GitBook setup](docs/GITBOOK_SETUP.md).
