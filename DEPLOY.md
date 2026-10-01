# Deploy — Celina API (Cloudflare Workers)

Deploy with the Wrangler CLI. [`wrangler.jsonc`](wrangler.jsonc) pins `account_id` to the CELINA Cloudflare account, so `wrangler deploy` and `wrangler secret put` target that account.

```bash
npx wrangler deploy
```

If Wrangler reports an authentication or account error, delete `node_modules/.cache/wrangler/wrangler-account.json` in this repo and retry. That file can keep a previous login's account after you switch accounts.

## Prerequisites

- [Cloudflare](https://dash.cloudflare.com) account that should own `celina-api`
- Node.js ≥ 20 (local tests / `wrangler dev` only)
- Repo: [andrewkimjoseph/celina-api](https://github.com/andrewkimjoseph/celina-api)

```bash
cd celina-api
npm install
cp .env.example .dev.vars   # local only
npm test
npm run dev                 # optional — http://localhost:8788
```

## Environment variables

Set with Wrangler (`npx wrangler secret put NAME`), reading the value from `.dev.vars` or `.env.local`. Do not commit those files.

| Variable | Required | Notes |
|----------|----------|-------|
| `CELO_RPC_URL` | Optional | Celo mainnet RPC (default: Forno) |
| `ETH_RPC_URL_MAINNET` | Optional | Ethereum RPC for ENS |

Do **not** set `CELO_PRIVATE_KEY` or `SELF_AGENT_PRIVATE_KEY`. This Worker is read-only.

Wrangler loads `.dev.vars` automatically for `npm run dev`.

## Custom domain

Suggested production host: **https://api.usecelina.xyz**

Attach `api.usecelina.xyz` as a custom domain on the Worker (dashboard: Settings → Domains & Routes), or add a `routes` entry with `"custom_domain": true` in [`wrangler.jsonc`](wrangler.jsonc) and deploy.

## Smoke test

```bash
curl -sS https://api.usecelina.xyz/health

curl -sS https://api.usecelina.xyz/v1/get_network_status \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Expected: `{ "ok": true, "service": "celina-api", "checks": { "celoRpc": true, "ethRpc": true } }` (HTTP 503 when a configured RPC check fails) and a JSON object with `chainId: 42220`. Off-chain dashboard smoke tests live on celina-stats-api (`GET /offchain/daily` with `Authorization: Bearer $STATS_READ_KEY`).

## Invoke tools (reminder)

- `GET /v1/:name` — tool **metadata** (name, description, inputs)
- `POST /v1/:name` — run the tool and get chain data

Example:

```bash
curl -sS https://api.usecelina.xyz/v1/get_latest_blocks \
  -H 'Content-Type: application/json' \
  -d '{"count":"5"}'
```

## Troubleshooting

- **Worker fails to start after deploy** — ensure `@andrewkimjoseph/celina-sdk` is ≥ 0.25.7 (Worker-safe bundles; no `createRequire`).
- **502 on tool calls** — check RPC URL and Cloudflare Worker logs (Observability).
- **Bundle size** — large SDK deps; stay on published npm SDK, not `file:` links.
