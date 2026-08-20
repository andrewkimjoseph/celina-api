# Invoke a tool

1. Find the name in `GET /v1/tools` or [Tools](../reference/tools.md).
2. `POST /v1/<name>` with `Content-Type: application/json`.
3. Body must be a JSON **object**. Use `{}` when the tool has no inputs.

```bash
curl -sS https://api.usecelina.xyz/v1/get_token_balance \
  -H 'Content-Type: application/json' \
  -d '{"address":"0xYourAddress","token":"USDm"}'
```

## CORS

Browser `fetch` from any origin is allowed.

## Contract reads

`call_contract_function` expects the ABI and arguments as defined by the SDK schema (snake_case keys). Pass the ABI JSON in the body — do not put it on the query string.

## Quotes

Mento, Uniswap, and GoodDollar reserve quote tools do not require a wallet. Do not send `from` unless the schema asks for it.
