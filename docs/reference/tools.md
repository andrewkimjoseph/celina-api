# Tools

Generated from the Celina SDK catalog with the public read-only filter (`families: ["read"]`, no server keys, no Self sessions, no `estimate_*`). Re-run `npm run docs:tools` after bumping `@andrewkimjoseph/celina-sdk`.

Currently **48** tools. Live list: `GET /v1/tools`. Invoke with `POST /v1/<name>` using snake_case JSON keys.

## `get_network_status`

Get Network Status

Returns Celo mainnet chain ID, latest block, and gas price.

No input fields. Send `{}` or an empty JSON object.

## `get_block`

Get Block

Fetch a Celo mainnet block by number, hash, or latest.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `block_id` | string | yes | block id |
| `include_transactions` | boolean | no | include transactions |

## `get_latest_blocks`

Get Latest Blocks

Fetch the most recent blocks on Celo mainnet.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `count` | string | no | count |
| `offset` | string | no | offset |

## `get_transaction`

Get Transaction

Fetch a transaction and receipt by hash on Celo mainnet.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hash` | string | yes | hash |

## `verify_attribution_tag`

Verify Attribution Tag

Decode ERC-8021 (celina, app codes) attribution from a Celo mainnet tx calldata. Optionally pass tag to check for a specific code.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hash` | string | yes | Transaction hash (0x + 64 hex characters). |
| `tag` | string | no | Optional attribution code to match (e.g. celo_862c21dd97a7, MY_APP). Omit to decode all tags. |

## `check_attribution_tag`

Check Attribution Tag

List all ERC-8021 attribution tags on a Celo mainnet transaction in lowercase (same as erc8021.codes), or check whether a specific tag is present. Prefer this for "what tags are on this tx?"; use verify_attribution_tag for the raw layer.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hash` | string | yes | Transaction hash (0x + 64 hex characters). |
| `tag` | string | no | Optional attribution code to match (e.g. celo_862c21dd97a7, MY_APP). Omit to list all tags. |

## `get_account`

Get Account

Returns native CELO balance, nonce, and whether the address is a contract.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |

## `get_celo_account_registration`

Get Celo Account Registration

Whether an address is registered in the Celo Accounts contract (required before locking CELO).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |

## `get_celo_balances`

Get Celo Balances

Balances for named registry tokens on Celo mainnet. Default tokens: CELO + USDm. Reads on-chain balances for the given address only; GoodDollar connected-wallet identity is not resolved.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |
| `tokens` | array | no | tokens |

## `get_stablecoin_balances`

Get Stablecoin Balances

Scan fiat-pegged registry stablecoins (Mento *m, USDT, USDC, etc.) for an address in one call. Omits zero balances by default. Excludes GoodDollar (G$) and WETH — use get_token_balance or GoodDollar tools for those. Reads on-chain balances for the given address only; GoodDollar connected-wallet identity is not resolved.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |
| `stablecoins` | array | no | stablecoins |
| `include_zero` | boolean | no | include zero |

## `get_token_info`

Get Token Info

Registry token metadata (symbol, address, decimals). Does not read balances.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | yes | Celo mainnet token symbol (e.g. CELO, USDm, USDC, USDT) |

## `get_token_balance`

Get Token Balance

Balance for one registry token. Pass a symbol or known registry contract address. Reads on-chain balances for the given address only; GoodDollar connected-wallet identity is not resolved.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | yes | Celo mainnet token symbol (e.g. CELO, USDm, USDC, USDT) |
| `address` | string | yes | Wallet on Celo mainnet (0x address). |

## `get_gas_fee_data`

Get Gas Fee Data

Returns current gas fee data including EIP-1559 fees on mainnet.

No input fields. Send `{}` or an empty JSON object.

## `get_mento_fx_quote`

Get Mento FX Quote

Mento FX oracle quote for a token pair on mainnet. Read-only.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token_in` | string | yes | Input token symbol or address |
| `token_out` | string | yes | Output token symbol or address |
| `amount` | string | yes | Human-readable amount of token_in, e.g. 100 |
| `from` | string | no | Wallet on Celo mainnet. Omit to use the connected wallet or the configured MCP signer (CELO or Self agent). |

## `get_uniswap_quote`

Get Uniswap Quote

Uniswap v4 AMM quote for a token pair on Celo mainnet.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token_in` | string | yes | Celo mainnet token symbol (e.g. CELO, USDm, USDC, USDT) |
| `token_out` | string | yes | Celo mainnet token symbol (e.g. CELO, USDm, USDC, USDT) |
| `amount` | string | yes | Human-readable amount of token_in |
| `from` | string | no | Wallet on Celo mainnet. Omit to use the connected wallet or the configured MCP signer (CELO or Self agent). |

## `get_aave_balances`

Get Aave Balances

Read supplied Aave V3 balances (aToken holdings) on Celo in underlying token units including accrued interest. Each balance has formatted (human-readable, e.g. "0.000002") and raw (atomic units — do not quote raw to users). Supported: USDT, WETH, USDm, USDC, CELO, EURm. Omit address to use the session wallet when CELO_PRIVATE_KEY is set.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |
| `tokens` | array | no | tokens |
| `include_zero` | boolean | no | include zero |

## `resolve_ens`

Resolve ENS

Resolve a Celo or Ethereum ENS name to an address. Defaults to Celo coin record with Ethereum fallback.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | ENS name, e.g. celina.eth or andrewkimjoseph.celo.eth |
| `chain` | string | no | chain |

## `get_gooddollar_whitelisting_info`

Get GoodDollar Whitelisting Info

Check GoodDollar IdentityV4 whitelist status for a wallet. Connected wallets resolve to their verified root; returns isWhitelisted, whitelistedRoot, and checkedAddress.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |

## `get_gooddollar_identity_link`

Get GoodDollar Identity Link

How a wallet links to GoodDollar IdentityV4: whitelisted root, connected-to root, and live whitelist status.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |

## `get_gooddollar_ubi_entitlement`

Get GoodDollar UBI Entitlement

Daily GoodDollar UBI claim eligibility: whitelist root, claimable G$, already claimed. Nested identity.isWhitelisted reflects the resolved root.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |

## `get_gooddollar_reserve_quote`

Get GoodDollar Reserve Quote

GoodDollar reserve quote for G$ ↔ USDm on Celo (MentoBroker bonding curve). Use amount_side "out" when the user names the amount they want to receive (e.g. "get 0.6 USDm"). Uses the literal signing wallet address for balances; does not resolve GoodDollar identity roots.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token_in` | string | yes | GoodDollar or G$ |
| `token_out` | string | yes | USDm or cUSD |
| `amount` | string | yes | Human-readable amount; paired with amount_side (in = spend, out = receive) |
| `amount_side` | string | no | 'in': amount is token_in spend (default). 'out': amount is desired token_out receive amount. |
| `from` | string | no | Wallet on Celo mainnet. Omit to use the connected wallet or the configured MCP signer (CELO or Self agent). |

## `get_governance_proposals`

Get Governance Proposals

Returns Celo governance proposals with pagination. Set include_metadata=false for faster responses.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `include_inactive` | string | yes | include inactive |
| `include_metadata` | string | yes | include metadata |
| `page` | string | no | page |
| `page_size` | string | no | page size |
| `offset` | string | no | offset |
| `limit` | string | no | limit |

## `get_proposal_details`

Get Proposal Details

Returns detailed information about a Celo governance proposal.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `proposal_id` | string | yes | proposal id |

## `get_locked_celo_balance`

Get Locked CELO Balance

Locked CELO balances and governance voting power for an address.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |

## `get_pending_withdrawals`

Get Pending Withdrawals

Pending LockedGold withdrawals with maturity timestamps for an address.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |

## `get_votable_proposals`

Get Votable Proposals

Governance proposals currently in Referendum with dequeue index for voting.

No input fields. Send `{}` or an empty JSON object.

## `get_queued_proposals`

Get Queued Proposals

Governance proposals currently in Queue with upvote weight. Fast on-chain read — use get_proposal_details for CGP title and markdown.

No input fields. Send `{}` or an empty JSON object.

## `get_actionable_governance_proposals`

Get Actionable Governance Proposals

Queued and Referendum proposals you can act on now (upvote or vote). Fast on-chain read — use get_proposal_details on a proposal_id before governing.

No input fields. Send `{}` or an empty JSON object.

## `get_governance_votes`

Get Governance Votes

Referendum votes and queue upvotes cast by an address on Celo governance.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |
| `proposal_id` | string | no | proposal id |

## `check_humanness`

Check Humanness

Check whether an address passes humanness on Self Agent ID or GoodDollar IdentityV4. Pass if either rail succeeds.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |

## `get_staking_balances`

Get Staking Balances

Active and pending staking votes for an address by validator group.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |

## `get_activatable_stakes`

Get Activatable Stakes

Validator groups where pending stakes can be activated for an address.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |

## `get_validator_groups`

Get Validator Groups

Paginated validator groups with votes, capacity, and member counts.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | string | no | page |
| `page_size` | string | no | page size |
| `offset` | string | no | offset |
| `limit` | string | no | limit |

## `get_validator_group_details`

Get Validator Group Details

Detailed information about a validator group including members.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `group_address` | string | yes | group address |

## `get_total_staking_info`

Get Total Staking Info

Network-wide staking participation metrics.

No input fields. Send `{}` or an empty JSON object.

## `get_delegation_info`

Get Delegation Info

Governance vote delegation info from LockedGold for an address.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Wallet on Celo mainnet (0x address). |

## `get_stake_eligibility`

Get Stake Eligibility

Check whether a stake would succeed before execute_stake. Validates Election.canReceiveVotes (group headroom), non-voting locked CELO balance, and Celo account registration. If canStake is false, read reasons — common failure is 'Group cannot receive votes' when a group is at capacity.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `group_address` | string | yes | group address |
| `amount` | string | yes | CELO amount to stake (human-readable, from locked balance) |
| `address` | string | yes | Wallet on Celo mainnet (0x address). |

## `get_governance_delegates`

Get Governance Delegates

Curated Celo Mondo governance delegate directory (name, address, interests, description). Use when the user asks who to delegate to — not an on-chain registry; any address can receive delegation. Optionally includes LockedGold stats (voting power, total delegated to them). Then call execute_delegate_power with a chosen delegatee address.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `search` | string | no | Filter by name, address, interests, or description |
| `limit` | string | no | limit |
| `offset` | number | no | offset |
| `include_stats` | boolean | no | Include on-chain LockedGold stats (default true) |

## `get_governance_delegate_details`

Get Governance Delegate Details

Look up a governance delegate by address — Celo Mondo profile (if listed) plus on-chain LockedGold stats.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | address |

## `get_nft_info`

Get NFT Info

NFT token information including metadata for ERC-721 or ERC-1155.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contract_address` | string | yes | contract address |
| `token_id` | string | yes | NFT token ID (decimal string) |

## `get_nft_balance`

Get NFT Balance

NFT balance for an address. Token ID required for ERC-1155.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contract_address` | string | yes | contract address |
| `address` | string | yes | Wallet on Celo mainnet (0x address). |
| `token_id` | string | no | NFT token ID (decimal string) |

## `call_contract_function`

Call Contract Function

Calls a read-only contract function. Requires caller-supplied ABI JSON.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contract_address` | string | yes | contract address |
| `function_name` | string | yes | function name |
| `abi` | array | yes | Contract ABI as a JSON array |
| `function_args` | array | no | function args |
| `from_address` | string | yes | Wallet on Celo mainnet (0x address). |

## `verify_self_agent`

Verify Self Agent

Verify whether an agent address is backed by a real human on Self Agent ID (Celo mainnet). Defaults to requiring age 18+ and OFAC-clear credentials; pass require_age: 0 or require_ofac: false to relax.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent_address` | string | yes | agent address |
| `require_age` | string | yes | require age |
| `require_ofac` | string | yes | require ofac |
| `require_self_provider` | string | yes | require self provider |

## `lookup_self_agent`

Look Up Self Agent

Look up a Self Agent ID by numeric on-chain ID. Returns credentials with ofac_clear (all OFAC checks passed) and ofac_checks — a labeled array where clear: true means not on that sanctions list.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent_id` | string | yes | agent id |

## `verify_self_request`

Verify Self Agent Request

Verify incoming HTTP request headers signed by a Self Agent (not file system access).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent_signature` | string | yes | agent signature |
| `agent_timestamp` | string | yes | agent timestamp |
| `method` | string | yes | method |
| `request_path` | string | yes | request path |
| `body` | string | yes | body |
| `keytype` | string | yes | keytype |
| `agent_key` | string | yes | agent key |

## `get_agentkarma_reputation`

Get AgentKarma Reputation

Read AgentKarma Provider + Consumer reputation for a Celo agent wallet (read-only, agentkarma.io). Optional trust context — never routes, signs, or holds custody.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Celo 0x address of the agent/counterparty to look up. |
| `face` | string | yes | Karma face to read: provider, consumer, or both (default). |

## `get_agentkarma_celo_agent`

Get AgentKarma Celo Agent

Resolve a Celo ERC-8004 agent (identity + reputation) by numeric agent ID via AgentKarma (read-only).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent_id` | string | yes | ERC-8004 agent ID on Celo. |

## `check_agentkarma_counterparty`

Check AgentKarma Counterparty

Evaluate a Celo counterparty against a local AgentKarma trust policy (min score, receipt-backed). Returns an explainable allow/deny decision plus the snapshot it read. Read-only — never routes, signs, or holds custody.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `address` | string | yes | Celo 0x address of the agent/counterparty to look up. |
| `face` | string | yes | Face to score the decision on (default provider). |
| `min_score` | string | yes | Reject when the face score is below this (0–100). |
| `require_receipt_backed` | string | yes | Require at least one Tier-1 receipt-backed signal on the face. |
