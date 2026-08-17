import { createClient } from "@/lib/supabase/server";
import { isVoiceAuthRequired } from "@/lib/supabase/config";

import { currentUsageMonth, FREE_MONTHLY_MINUTES } from "./period";

export class AuthRequiredError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "AuthRequiredError";
  }
}

export class UsageLimitError extends Error {
  constructor() {
    super("Limite mensal do plano Free atingido");
    this.name = "UsageLimitError";
  }
}

export type UsageSnapshot = {
  planId: "free" | "pro" | string;
  planName: string;
  limitMinutes: number | null;
  minutesUsed: number;
  minutesRemaining: number | null;
  periodMonth: string;
};

export async function getAuthenticatedUserId(): Promise<string | null> {
  if (!isSupabaseConfiguredSafe()) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

function isSupabaseConfiguredSafe(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function requireAuthenticatedUserId(): Promise<string> {
  const userId = await getAuthenticatedUserId();
  if (!userId) throw new AuthRequiredError();
  return userId;
}

/** User id opcional — null ok quando voz anônima (embed / VOICE_DEV_MODE). */
export async function resolveVoiceUserId(): Promise<string | null> {
  const userId = await getAuthenticatedUserId();
  if (isVoiceAuthRequired() && !userId) throw new AuthRequiredError();
  return userId;
}

export async function getUsageSnapshot(userId: string): Promise<UsageSnapshot> {
  const supabase = await createClient();
  const periodMonth = currentUsageMonth();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("user_id", userId)
    .maybeSingle();

  const planId = sub?.plan_id ?? "free";

  const { data: planRow } = await supabase
    .from("plans")
    .select("id, name, monthly_minutes")
    .eq("id", planId)
    .maybeSingle();

  const planName = planRow?.name ?? "Free";
  const limitMinutes =
    planRow?.monthly_minutes ?? (planId === "pro" ? null : FREE_MONTHLY_MINUTES);

  const { data: usage } = await supabase
    .from("usage_logs")
    .select("minutes_used")
    .eq("user_id", userId)
    .eq("period_month", periodMonth)
    .maybeSingle();

  const minutesUsed = Number(usage?.minutes_used ?? 0);
  const minutesRemaining =
    limitMinutes === null
      ? null
      : Math.max(0, Math.round((limitMinutes - minutesUsed) * 10) / 10);

  return {
    planId,
    planName,
    limitMinutes,
    minutesUsed,
    minutesRemaining,
    periodMonth,
  };
}

export async function assertVoiceAllowed(userId: string): Promise<UsageSnapshot> {
  // Dev/POC bypass — desativa limite de minutos sem consultar o banco
  if (process.env.USAGE_LIMIT_DISABLED === "true") {
    return {
      planId: "free",
      planName: "Free",
      limitMinutes: null,
      minutesUsed: 0,
      minutesRemaining: null,
      periodMonth: currentUsageMonth(),
    };
  }
  const snapshot = await getUsageSnapshot(userId);
  if (snapshot.planId === "pro") return snapshot;
  if (snapshot.minutesRemaining !== null && snapshot.minutesRemaining <= 0) {
    throw new UsageLimitError();
  }
  return snapshot;
}

export async function recordVoiceMinutes(
  userId: string,
  seconds: number,
): Promise<void> {
  if (seconds <= 0) return;
  const supabase = await createClient();
  const periodMonth = currentUsageMonth();
  const deltaMinutes = Math.max(seconds / 60, 0.05);

  const { data: existing } = await supabase
    .from("usage_logs")
    .select("id, minutes_used")
    .eq("user_id", userId)
    .eq("period_month", periodMonth)
    .maybeSingle();

  if (existing?.id) {
    const next = Number(existing.minutes_used) + deltaMinutes;
    await supabase
      .from("usage_logs")
      .update({ minutes_used: next, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    return;
  }

  await supabase.from("usage_logs").insert({
    user_id: userId,
    period_month: periodMonth,
    minutes_used: deltaMinutes,
  });
}

export async function startVoiceSession(userId: string): Promise<string> {
  const supabase = await createClient();
  const snapshot = await getUsageSnapshot(userId);

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      user_id: userId,
      plan_id: snapshot.planId,
      voice_mode: "oss_turn",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Falha ao iniciar sessão");
  }

  return data.id;
}

export async function endVoiceSession(
  userId: string,
  sessionId: string,
  durationSeconds: number,
): Promise<void> {
  const supabase = await createClient();
  const endedAt = new Date().toISOString();

  await supabase
    .from("sessions")
    .update({
      ended_at: endedAt,
      duration_seconds: Math.max(0, Math.round(durationSeconds)),
    })
    .eq("id", sessionId)
    .eq("user_id", userId);

  await recordVoiceMinutes(userId, durationSeconds);
}
