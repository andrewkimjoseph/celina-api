# Deploy — Celina API (Cloudflare Workers)

Git-connected Cloudflare Workers Builds deploy this repo. Do **not** run `wrangler deploy` / `wrangler secret put` from a machine whose Wrangler CLI is tied to a different Cloudflare account.

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

Set in the Cloudflare dashboard (**Workers & Pages → celina-api → Settings → Variables and Secrets**).

| Variable | Required | Notes |
|----------|----------|-------|
| `CELO_RPC_URL` | Optional | Celo mainnet RPC (default: Forno) |
| `ETH_RPC_URL_MAINNET` | Optional | Ethereum RPC for ENS |

Do **not** set `CELO_PRIVATE_KEY` or `SELF_AGENT_PRIVATE_KEY`. This Worker is read-only.

Wrangler loads `.dev.vars` automatically for `npm run dev`.

## Custom domain

Suggested production host: **https://api.usecelina.xyz**

1. Open the Worker in the Cloudflare dashboard
2. **Settings → Domains & Routes → Add Custom Domain**
3. Enter `api.usecelina.xyz`

## Smoke test

```bash
curl -sS https://api.usecelina.xyz/health

curl -sS https://api.usecelina.xyz/v1/get_network_status \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Expected: `{ "ok": true, "service": "celina-api" }` and a JSON object with `chainId: 42220`. Off-chain dashboard smoke tests live on celina-stats-api (`GET /offchain/daily` with `Authorization: Bearer $STATS_READ_KEY`).

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
