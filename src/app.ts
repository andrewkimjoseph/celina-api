import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ToolRuntime } from "@andrewkimjoseph/celina-sdk/tools";
import { getPublicReadTool, getPublicReadToolDefinitions } from "./catalog.js";
import type { ApiEnv } from "./env.js";
import { createApiRuntime } from "./runtime.js";
import { toJsonSafe } from "./serialize.js";
import { toolPublicMetadata } from "./tool-metadata.js";

type AppBindings = { Bindings: ApiEnv };

let cachedRuntime: ToolRuntime | undefined;
let cachedRuntimeKey: string | undefined;

function runtimeKey(env: ApiEnv): string {
  return `${env.CELINA_RPC_URL ?? ""}|${env.ETH_RPC_URL_MAINNET ?? ""}`;
}

function getRuntime(env: ApiEnv): ToolRuntime {
  const key = runtimeKey(env);
  if (!cachedRuntime || cachedRuntimeKey !== key) {
    cachedRuntime = createApiRuntime(env);
    cachedRuntimeKey = key;
  }
  return cachedRuntime;
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

    const runtime =
      options?.runtime ?? getRuntime({ ...options?.env, ...c.env });

    try {
      const result = await definition.handler(
        runtime,
        parsed.data as Record<string, unknown>,
      );
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
