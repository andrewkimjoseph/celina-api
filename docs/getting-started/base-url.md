# Base URL

Production (after you attach the domain on the Cloudflare Worker):

```text
https://api.usecelina.xyz
```

Until that domain is live, use your `*.workers.dev` URL from `wrangler deploy`.

## Local

```bash
npm install
npm run dev
```

`wrangler dev` serves the Hono Worker (typically `http://localhost:8788`). Optional `.dev.vars`:

```bash
CELO_RPC_URL=https://forno.celo.org
ETH_RPC_URL_MAINNET=https://ethereum.publicnode.com
```

Do not set signing keys.

See [DEPLOY.md](../../DEPLOY.md) for production deploy steps.
