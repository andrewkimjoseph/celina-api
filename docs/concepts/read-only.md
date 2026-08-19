# Read-only

Celina API registers SDK tools with:

```ts
filterToolDefinitions(ALL_TOOL_DEFINITIONS, {
  surface: "mcp",
  families: ["read"],
  serverKeyToolsEnabled: false,
  selfSessionToolsEnabled: false,
  estimateToolsEnabled: false,
});
```

That omits:

- `send_token`, `execute_*`, `prepare_*`, `estimate_*`
- `get_wallet_address` (no server wallet)
- Self registration/session and key-backed tools
- `get_gooddollar_face_verification_link` (requires a signing key)

Wallet-scoped reads need an explicit `address`, `wallet_address`, or `from`. There is no “session signer.”

For unsigned transaction payloads, use [hosted MCP](https://mcp.usecelina.xyz) prepare tools or the SDK in your own app. For signed writes, use local [celina-mcp](https://github.com/andrewkimjoseph/celina-mcp) with your key.
