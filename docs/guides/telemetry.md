# Telemetry (Amplitude)

Successful **read** `POST /v1/:name` invocations are reported through the bundled [Celina SDK](https://github.com/andrewkimjoseph/celina-sdk) to [celina-stats-api](https://api.stats.usecelina.xyz) `POST /telemetry`. That Worker holds the Amplitude write key and forwards one event. The daily export cron copies those events into the stats store.

The event name is the catalog tool name (for example `get_stablecoin_balances`, `verify_self_agent`).

## What is sent

- Event name (MCP / catalog tool name)
- A `device_id` identifying the caller (see below)
- A `user_id` set to the lowercase wallet `0x…` address when the tool is wallet-scoped (`address` / `wallet_address` / `from` in the JSON body)
- No tool arguments or private keys

This API is **read-only**. There are no `prepare_*` or write tools, so there is no write telemetry here. On-chain Celina attribution is a separate path (see the [SDK Telemetry guide](https://andrewkimjoseph.gitbook.io/celina-sdk/guides/telemetry)).

## Device id

Default `device_id` is `celina_api`.

Send optional `X-Celina-Client` to override it. The value is lowercased; any character outside `[a-z0-9_]` becomes `_`; length is capped at 40. Empty or invalid values fall back to `celina_api`.

This is how [celina-bot](https://github.com/andrewkimjoseph/celina-bot) appears as `celina_bot`.

```bash
curl -sS https://api.usecelina.xyz/v1/get_token_balance \
  -H 'Content-Type: application/json' \
  -H 'X-Celina-Client: my_app' \
  -d '{"address":"0xYourAddress","token":"USDm"}'
```

The Celina ecosystem device-id table (`celina-*` packages plus celeste-ai) lives in the [SDK Telemetry guide](https://andrewkimjoseph.gitbook.io/celina-sdk/guides/telemetry). Other HTTP clients should set `X-Celina-Client` rather than relying on the default.

## Delivery

Tracking is fire-and-forget so it does not add latency to the tool response. After each successful or failed `POST /v1/:name`, the Worker keeps the isolate alive with `waitUntil(drainCelinaAnalytics())`. If there is no ExecutionContext (tests, some local adapters), drain is awaited on the request path instead.

## Off-chain stats

Dashboard aggregates and the call list live on [celina-stats-api](https://api.stats.usecelina.xyz) (`GET /offchain/*`), computed from `amplitude_events` after the daily Amplitude export. This API does not query Supabase. Those reads require `Authorization: Bearer $STATS_READ_KEY`.

```bash
curl -sS https://api.stats.usecelina.xyz/offchain/daily \
  -H "Authorization: Bearer $STATS_READ_KEY"
```
