import type { ApiEnv } from "./env.js";

export function supabaseConfig(env: ApiEnv) {
  const url = env.SUPABASE_URL?.trim();
  const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return { url: url.replace(/\/+$/, ""), key };
}

export async function sbFetch(
  env: ApiEnv,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const { url, key } = supabaseConfig(env);
  return fetch(`${url}${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

export async function sbRpc<T>(
  env: ApiEnv,
  name: string,
  body: Record<string, unknown>,
): Promise<T> {
  const res = await sbFetch(env, `/rest/v1/rpc/${name}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(
      `Supabase rpc ${name} ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
  return (await res.json()) as T;
}
