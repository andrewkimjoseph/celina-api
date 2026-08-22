# Deploy — Celina API (Cloudflare Workers)

Manual deploy guide for the read-only Celina API Worker. This repo does not auto-deploy from CI.

## Prerequisites

- [Cloudflare](https://dash.cloudflare.com) account
- Node.js ≥ 20
- Repo cloned: [andrewkimjoseph/celina-api](https://github.com/andrewkimjoseph/celina-api)

```bash
cd celina-api
npm install
npx wrangler login
```

## Environment variables

Set in the Cloudflare dashboard (**Workers & Pages → celina-api → Settings → Variables**) or via Wrangler.

| Variable | Required | Notes |
|----------|----------|-------|
| `CELO_RPC_URL` | Optional | Celo mainnet RPC (default: Forno) |
| `ETH_RPC_URL_MAINNET` | Optional | Ethereum RPC for ENS |

Do **not** set `CELO_PRIVATE_KEY` or `SELF_AGENT_PRIVATE_KEY`. This Worker is read-only.

**Local dev** — copy [`.env.example`](.env.example) to `.dev.vars`:

```bash
cp .env.example .dev.vars
```

Wrangler loads `.dev.vars` automatically for `npm run dev`.

**CLI (production):**

```bash
npx wrangler secret put CELO_RPC_URL          # if using a private RPC
npx wrangler vars put ETH_RPC_URL_MAINNET "https://ethereum.publicnode.com"
```

## Local dev

```bash
npm install
npm test
npm run dev
```

Default URL: `http://localhost:8788`

## Deploy

From the repo root:

```bash
npm run deploy
```

Or:

```bash
npx wrangler deploy
```

Wrangler uses [`wrangler.jsonc`](wrangler.jsonc): `main` → `src/index.ts`, `nodejs_compat` enabled.

After deploy, Wrangler prints a `*.workers.dev` URL.

## Custom domain

Suggested production host: **https://api.usecelina.xyz**

1. Open the Worker in the Cloudflare dashboard
2. **Settings → Domains & Routes → Add Custom Domain**
3. Enter `api.usecelina.xyz` (DNS must be on Cloudflare or add the CNAME Wrangler suggests)

## Smoke test

Replace the host with your `workers.dev` URL or custom domain:

```bash
curl -sS https://api.usecelina.xyz/health

curl -sS https://api.usecelina.xyz/v1/get_network_status \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Expected: `{ "ok": true, "service": "celina-api" }` and a JSON object with `chainId: 42220`.

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
