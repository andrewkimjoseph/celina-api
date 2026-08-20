# Naming

Tool names and body keys are **exactly** the SDK/MCP catalog: lowercase snake_case.

| Use this | Not this |
|----------|----------|
| `get_actionable_governance_proposals` | `getActionableGovernanceProposals` |
| `get_stablecoin_balances` | `getStablecoinBalances` |
| `proposal_id` | `proposalId` |

`GET /v1/tools` returns those names. Paths are `/v1/<name>` with no alias map.
