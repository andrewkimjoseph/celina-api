import type { ApiEnv } from "./env.js";
import { sbFetch, sbRpc } from "./supabase.js";

export const OFFCHAIN_LOOKBACK_DAYS = 90;

export type OffchainDayCount = {
  day: string;
  count: number;
};

export type OffchainToolCount = {
  event: string;
  count: number;
};

type RpcDayRow = { day: string; count: number | string };
type RpcToolRow = { event: string; count: number | string };

export function sinceDay(now = new Date()): string {
  const since = new Date(now.getTime());
  since.setUTCDate(since.getUTCDate() - OFFCHAIN_LOOKBACK_DAYS);
  return since.toISOString().slice(0, 10);
}

function asCount(value: number | string | null | undefined): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function asDay(value: string): string {
  return value.slice(0, 10);
}

export async function readOffchainDaily(
  env: ApiEnv,
): Promise<{ rows: OffchainDayCount[]; total: number }> {
  const rows = (
    await sbRpc<RpcDayRow[]>(env, "offchain_daily", {
      since_day: sinceDay(),
    })
  ).map((row) => ({ day: asDay(row.day), count: asCount(row.count) }));
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  return { rows, total };
}

export async function readOffchainWallets(
  env: ApiEnv,
): Promise<{ daily: OffchainDayCount[]; total: number }> {
  const since_day = sinceDay();
  const [dailyRows, total] = await Promise.all([
    sbRpc<RpcDayRow[]>(env, "offchain_wallets_daily", { since_day }),
    sbRpc<number | string | null>(env, "offchain_wallets_total", { since_day }),
  ]);
  return {
    daily: dailyRows.map((row) => ({
      day: asDay(row.day),
      count: asCount(row.count),
    })),
    total: asCount(total),
  };
}

export async function readOffchainTools(
  env: ApiEnv,
): Promise<{ rows: OffchainToolCount[] }> {
  const rows = (
    await sbRpc<RpcToolRow[]>(env, "offchain_tools", {
      since_day: sinceDay(),
    })
  ).map((row) => ({ event: row.event, count: asCount(row.count) }));
  return { rows };
}

export async function readOffchainDevices(
  env: ApiEnv,
): Promise<{ uniqueDevices: number }> {
  const uniqueDevices = await sbRpc<number | string | null>(
    env,
    "offchain_devices",
    { since_day: sinceDay() },
  );
  return { uniqueDevices: asCount(uniqueDevices) };
}

export async function readOffchainSync(
  env: ApiEnv,
): Promise<{ lastSyncedAt: string | null }> {
  const res = await sbFetch(
    env,
    "/rest/v1/amplitude_sync_state?select=last_synced_at&id=eq.1",
  );
  if (!res.ok) {
    throw new Error(
      `Supabase read amplitude_sync_state ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
  const rows = (await res.json()) as Array<{ last_synced_at: string | null }>;
  return { lastSyncedAt: rows[0]?.last_synced_at ?? null };
}

export function offchainErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
