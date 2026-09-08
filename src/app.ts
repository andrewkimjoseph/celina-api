import { Hono } from "hono";
import { cors } from "hono/cors";
import { drainCelinaAnalytics } from "@andrewkimjoseph/celina-sdk";
import type { ToolRuntime } from "@andrewkimjoseph/celina-sdk/tools";
import { getPublicReadTool, getPublicReadToolDefinitions } from "./catalog.js";
import type { ApiEnv } from "./env.js";
import {
  offchainErrorMessage,
  readOffchainDaily,
  readOffchainDevices,
  readOffchainSync,
  readOffchainTools,
  readOffchainWallets,
} from "./offchain.js";
import { createApiRuntime, sanitizeClientDeviceId } from "./runtime.js";
import { toJsonSafe } from "./serialize.js";
import { toolPublicMetadata } from "./tool-metadata.js";

type AppBindings = { Bindings: ApiEnv };

const runtimes = new Map<string, ToolRuntime>();

function runtimeKey(env: ApiEnv, analyticsDeviceId: string): string {
  return `${env.CELO_RPC_URL ?? ""}|${env.ETH_RPC_URL_MAINNET ?? ""}|${analyticsDeviceId}`;
}

function getRuntime(env: ApiEnv, analyticsDeviceId: string): ToolRuntime {
  const key = runtimeKey(env, analyticsDeviceId);
  const cached = runtimes.get(key);
  if (cached) {
    return cached;
  }
  const created = createApiRuntime(env, analyticsDeviceId);
  runtimes.set(key, created);
  return created;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatZodError(error: {
  issues: Array<{ path: (string | number)[]; message: string }>;
}): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
      return `${path}${issue.message}`;
    })
    .join("; ");
}

export function createApp(options?: {
  runtime?: ToolRuntime;
  env?: ApiEnv;
}): Hono<AppBindings> {
  const app = new Hono<AppBindings>();

  const envFor = (c: { env: ApiEnv }): ApiEnv => ({
    ...options?.env,
    ...c.env,
  });

  app.use("*", cors());

  app.get("/", (c) =>
    c.json({
      ok: true,
      service: "celina-api",
      read_only: true,
    }),
  );

  app.get("/health", (c) =>
    c.json({
      ok: true,
      service: "celina-api",
    }),
  );

  app.get("/offchain/daily", async (c) => {
    try {
      return c.json(await readOffchainDaily(envFor(c)));
    } catch (error) {
      return c.json({ error: offchainErrorMessage(error) }, 502);
    }
  });

  app.get("/offchain/wallets", async (c) => {
    try {
      return c.json(await readOffchainWallets(envFor(c)));
    } catch (error) {
      return c.json({ error: offchainErrorMessage(error) }, 502);
    }
  });

  app.get("/offchain/tools", async (c) => {
    try {
      return c.json(await readOffchainTools(envFor(c)));
    } catch (error) {
      return c.json({ error: offchainErrorMessage(error) }, 502);
    }
  });

  app.get("/offchain/devices", async (c) => {
    try {
      return c.json(await readOffchainDevices(envFor(c)));
    } catch (error) {
      return c.json({ error: offchainErrorMessage(error) }, 502);
    }
  });

  app.get("/offchain/sync", async (c) => {
    try {
      return c.json(await readOffchainSync(envFor(c)));
    } catch (error) {
      return c.json({ error: offchainErrorMessage(error) }, 502);
    }
  });

  app.get("/v1/tools", (c) => {
    const tools = getPublicReadToolDefinitions().map(toolPublicMetadata);
    return c.json({ count: tools.length, tools });
  });

  app.get("/v1/:name", (c) => {
    const definition = getPublicReadTool(c.req.param("name"));
    if (!definition) {
      return c.json({ error: `Unknown tool: ${c.req.param("name")}` }, 404);
    }
    return c.json(toolPublicMetadata(definition));
  });

  app.post("/v1/:name", async (c) => {
    const name = c.req.param("name");
    const definition = getPublicReadTool(name);
    if (!definition) {
      return c.json({ error: `Unknown tool: ${name}` }, 404);
    }

    let body: unknown = {};
    const contentType = c.req.header("content-type") ?? "";
    if (contentType.includes("application/json")) {
      try {
        body = await c.req.json();
      } catch {
        return c.json({ error: "Invalid JSON body" }, 400);
      }
    } else {
      const text = await c.req.text();
      if (text.trim()) {
        try {
          body = JSON.parse(text);
        } catch {
          return c.json({ error: "Invalid JSON body" }, 400);
        }
      }
    }

    if (body === null || body === undefined) {
      body = {};
    }
    if (!isRecord(body)) {
      return c.json({ error: "JSON body must be an object" }, 400);
    }

    const parsed = definition.inputSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        { error: formatZodError(parsed.error) },
        400,
      );
    }

    const analyticsDeviceId = sanitizeClientDeviceId(
      c.req.header("x-celina-client"),
    );
    const runtime =
      options?.runtime ??
      getRuntime(envFor(c), analyticsDeviceId);

    try {
      const result = await definition.handler(
        runtime,
        parsed.data as Record<string, unknown>,
      );
      try {
        c.executionCtx.waitUntil(drainCelinaAnalytics());
      } catch {
        // app.request() in tests has no Worker ExecutionContext
      }
      return c.json(toJsonSafe(result));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const clientError =
        /pass an explicit|invalid|required|must be|unknown token|not found|no wallet/i.test(
          message,
        );
      return c.json({ error: message }, clientError ? 400 : 502);
    }
  });

  return app;
}

export const app = createApp();
