import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { getPublicReadToolNames } from "../src/catalog.js";
import {
  DEFAULT_ANALYTICS_DEVICE_ID,
  sanitizeClientDeviceId,
} from "../src/runtime.js";

const excluded = [
  "send_token",
  "get_wallet_address",
  "register_self_agent",
  "check_self_registration",
  "get_self_identity",
  "sign_self_request",
  "execute_mento_fx",
  "prepare_mento_fx",
  "estimate_send",
  "get_gooddollar_face_verification_link",
] as const;

describe("public read catalog", () => {
  it("omits writes, prepares, estimates, and server-key tools", () => {
    const names = getPublicReadToolNames();
    expect(names.length).toBeGreaterThan(20);
    for (const name of excluded) {
      expect(names).not.toContain(name);
    }
    expect(names).toContain("get_network_status");
    expect(names).toContain("get_actionable_governance_proposals");
    expect(names).toContain("get_mento_fx_quote");
    expect(names.every((name) => !name.startsWith("estimate_"))).toBe(true);
    expect(names.every((name) => !name.startsWith("prepare_"))).toBe(true);
    expect(names.every((name) => !name.startsWith("execute_"))).toBe(true);
  });
});

describe("HTTP surface", () => {
  const app = createApp();

  it("GET /health", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      ok: true,
      service: "celina-api",
    });
  });

  it("GET /v1/tools lists snake_case names only", async () => {
    const res = await app.request("/v1/tools");
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      count: number;
      tools: Array<{ name: string }>;
    };
    const names = getPublicReadToolNames();
    expect(body.count).toBe(names.length);
    expect(body.tools.map((tool) => tool.name)).toEqual(names);
    expect(body.tools.some((tool) => tool.name === "getActionableGovernanceProposals")).toBe(
      false,
    );
  });

  it("GET unknown tool is 404", async () => {
    const res = await app.request("/v1/send_token");
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: string };
    expect(body.error).toContain("send_token");
  });

  it("POST unknown tool is 404", async () => {
    const res = await app.request("/v1/send_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(404);
  });

  it("POST rejects invalid input", async () => {
    const res = await app.request("/v1/get_token_balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error.length).toBeGreaterThan(0);
  });

  it("POST get_network_status returns chain data", async () => {
    const res = await app.request("/v1/get_network_status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body).toBeTypeOf("object");
    expect(body).not.toHaveProperty("error");
  });

  it("POST get_network_status accepts X-Celina-Client", async () => {
    const res = await app.request("/v1/get_network_status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Celina-Client": "celina_bot",
      },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body).toBeTypeOf("object");
    expect(body).not.toHaveProperty("error");
  });
});

describe("sanitizeClientDeviceId", () => {
  it("defaults when absent or empty", () => {
    expect(sanitizeClientDeviceId(undefined)).toBe(DEFAULT_ANALYTICS_DEVICE_ID);
    expect(sanitizeClientDeviceId(null)).toBe(DEFAULT_ANALYTICS_DEVICE_ID);
    expect(sanitizeClientDeviceId("")).toBe(DEFAULT_ANALYTICS_DEVICE_ID);
    expect(sanitizeClientDeviceId("   ")).toBe(DEFAULT_ANALYTICS_DEVICE_ID);
    expect(sanitizeClientDeviceId("---")).toBe(DEFAULT_ANALYTICS_DEVICE_ID);
  });

  it("keeps underscore-style ids and maps hyphens", () => {
    expect(sanitizeClientDeviceId("celina_bot")).toBe("celina_bot");
    expect(sanitizeClientDeviceId("celina-bot")).toBe("celina_bot");
    expect(sanitizeClientDeviceId("Celina_Bot")).toBe("celina_bot");
  });

  it("caps length at 40 characters", () => {
    expect(sanitizeClientDeviceId("a".repeat(50))).toBe("a".repeat(40));
  });
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const supabaseEnv = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test-key",
};

describe("GET /offchain/*", () => {
  const app = createApp({ env: supabaseEnv });

  it("GET /offchain/daily aggregates rows", async () => {
    const fetchMock = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      expect(init?.method).toBe("POST");
      if (url.endsWith("/rest/v1/rpc/offchain_daily")) {
        const body = JSON.parse(String(init?.body ?? "{}")) as { since_day: string };
        expect(body.since_day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        return jsonResponse([
          { day: "2026-09-01", count: 2 },
          { day: "2026-09-02", count: 3 },
        ]);
      }
      if (url.endsWith("/rest/v1/rpc/offchain_total")) {
        return jsonResponse(12);
      }
      throw new Error(`unexpected fetch ${url}`);
    };
    const original = globalThis.fetch;
    globalThis.fetch = fetchMock as typeof fetch;
    try {
      const res = await app.request("/offchain/daily");
      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toEqual({
        rows: [
          { day: "2026-09-01", count: 2 },
          { day: "2026-09-02", count: 3 },
        ],
        total: 12,
      });
    } finally {
      globalThis.fetch = original;
    }
  });

  it("GET /offchain/wallets returns daily and total", async () => {
    const fetchMock = async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/rest/v1/rpc/offchain_wallets_daily")) {
        return jsonResponse([{ day: "2026-09-01", count: 1 }]);
      }
      if (url.endsWith("/rest/v1/rpc/offchain_wallets_total")) {
        return jsonResponse(4);
      }
      throw new Error(`unexpected fetch ${url}`);
    };
    const original = globalThis.fetch;
    globalThis.fetch = fetchMock as typeof fetch;
    try {
      const res = await app.request("/offchain/wallets");
      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toEqual({
        daily: [{ day: "2026-09-01", count: 1 }],
        total: 4,
      });
    } finally {
      globalThis.fetch = original;
    }
  });

  it("GET /offchain/tools returns per-event counts", async () => {
    const fetchMock = async (input: RequestInfo | URL) => {
      expect(String(input)).toBe(
        "https://example.supabase.co/rest/v1/rpc/offchain_tools",
      );
      return jsonResponse([{ event: "get_network_status", count: 9 }]);
    };
    const original = globalThis.fetch;
    globalThis.fetch = fetchMock as typeof fetch;
    try {
      const res = await app.request("/offchain/tools");
      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toEqual({
        rows: [{ event: "get_network_status", count: 9 }],
      });
    } finally {
      globalThis.fetch = original;
    }
  });

  it("GET /offchain/devices returns uniqueDevices", async () => {
    const fetchMock = async (input: RequestInfo | URL) => {
      expect(String(input)).toBe(
        "https://example.supabase.co/rest/v1/rpc/offchain_devices",
      );
      return jsonResponse(22);
    };
    const original = globalThis.fetch;
    globalThis.fetch = fetchMock as typeof fetch;
    try {
      const res = await app.request("/offchain/devices");
      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toEqual({ uniqueDevices: 22 });
    } finally {
      globalThis.fetch = original;
    }
  });

  it("GET /offchain/sync returns lastSyncedAt", async () => {
    const fetchMock = async (input: RequestInfo | URL) => {
      expect(String(input)).toContain(
        "/rest/v1/amplitude_sync_state?select=last_synced_at&id=eq.1",
      );
      return jsonResponse([{ last_synced_at: "2026-09-08T00:00:00.000Z" }]);
    };
    const original = globalThis.fetch;
    globalThis.fetch = fetchMock as typeof fetch;
    try {
      const res = await app.request("/offchain/sync");
      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toEqual({
        lastSyncedAt: "2026-09-08T00:00:00.000Z",
      });
    } finally {
      globalThis.fetch = original;
    }
  });

  it("GET /offchain/daily is 502 when Supabase is not configured", async () => {
    const bare = createApp();
    const res = await bare.request("/offchain/daily");
    expect(res.status).toBe(502);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/SUPABASE_/);
  });
});
