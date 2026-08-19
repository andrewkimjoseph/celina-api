import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { getPublicReadToolNames } from "../src/catalog.js";

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
    const res = await app.request("/v1/tools/send_token");
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: string };
    expect(body.error).toContain("send_token");
  });

  it("POST unknown tool is 404", async () => {
    const res = await app.request("/v1/tools/send_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(404);
  });

  it("POST rejects invalid input", async () => {
    const res = await app.request("/v1/tools/get_token_balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error.length).toBeGreaterThan(0);
  });

  it("POST get_network_status returns chain data", async () => {
    const res = await app.request("/v1/tools/get_network_status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body).toBeTypeOf("object");
    expect(body).not.toHaveProperty("error");
  });
});
