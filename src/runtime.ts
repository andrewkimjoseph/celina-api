import { createCelinaClient, DEFAULT_RPC_URL } from "@andrewkimjoseph/celina-sdk";
import type { ToolRuntime, WalletInput } from "@andrewkimjoseph/celina-sdk/tools";
import type { ApiEnv } from "./env.js";

/** Telemetry `device_id` when `X-Celina-Client` is absent or invalid. */
export const DEFAULT_ANALYTICS_DEVICE_ID = "celina_api";

const MAX_DEVICE_ID_LENGTH = 40;

/**
 * Sanitize a caller-supplied telemetry device id.
 * Lowercases, maps non `[a-z0-9_]` to `_`, caps length, falls back to `celina_api`.
 */
export function sanitizeClientDeviceId(raw?: string | null): string {
  if (raw == null) {
    return DEFAULT_ANALYTICS_DEVICE_ID;
  }
  const sanitized = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, MAX_DEVICE_ID_LENGTH)
    .replace(/_+$/g, "");
  return sanitized.length > 0 ? sanitized : DEFAULT_ANALYTICS_DEVICE_ID;
}

function unavailableSelf(): never {
  throw new Error("This Self tool is not available on the read-only Celina API.");
}

function resolveWallet(input?: WalletInput): `0x${string}` {
  const explicit = input?.address ?? input?.wallet_address ?? input?.from;
  if (explicit) {
    return explicit as `0x${string}`;
  }
  throw new Error(
    "Pass an explicit address, wallet_address, or from. This API has no server wallet.",
  );
}

export function createApiRuntime(
  env: ApiEnv = {},
  analyticsDeviceId: string = DEFAULT_ANALYTICS_DEVICE_ID,
): ToolRuntime {
  const celina = createCelinaClient({
    rpcUrl: env.CELO_RPC_URL || DEFAULT_RPC_URL,
    ethRpcUrl: env.ETH_RPC_URL_MAINNET,
    analyticsEnabled: true,
    analyticsDeviceId: sanitizeClientDeviceId(analyticsDeviceId),
  });

  return {
    celina,
    resolveWallet,
    executors: {
      self: {
        verifyAgent: (args) =>
          celina.self.verifyAgent({
            agentAddress: args.agent_address as `0x${string}`,
            requireAge: args.require_age as 0 | 18 | 21 | undefined,
            requireOfac: args.require_ofac as boolean | undefined,
            requireSelfProvider: args.require_self_provider as boolean | undefined,
          }),
        lookupAgent: (agentId) => celina.self.lookupAgent(agentId),
        verifyRequest: (args) =>
          celina.self.verifyRequest({
            agentSignature: args.agent_signature as `0x${string}`,
            agentTimestamp: args.agent_timestamp as string,
            method: args.method as string,
            path: (args.request_path ?? args.path) as string,
            body: args.body as string | undefined,
            keytype: args.keytype as string | undefined,
            agentKey: args.agent_key as `0x${string}` | undefined,
          }),
        registerAgent: unavailableSelf,
        checkRegistration: unavailableSelf,
        getIdentity: unavailableSelf,
        refreshProof: unavailableSelf,
        deregisterAgent: unavailableSelf,
        signRequest: unavailableSelf,
        authenticatedFetch: unavailableSelf,
      },
    },
  };
}
