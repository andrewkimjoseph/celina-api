# Base URL

Production (after you attach the domain on Cloudflare Pages):

```text
https://api.usecelina.xyz
```

Until that domain is live, use your Pages `*.pages.dev` URL.

## Local

```bash
npm install
npm run dev
```

`wrangler pages dev` serves the Hono app (typically `http://localhost:8788`). Optional `.dev.vars`:

```bash
CELINA_RPC_URL=https://forno.celo.org
ETH_RPC_URL_MAINNET=https://ethereum.publicnode.com
```

Do not set signing keys.
