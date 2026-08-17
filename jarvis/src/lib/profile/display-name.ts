import { createClient } from "@/lib/supabase/server";

/** Nome preferido do perfil (voz / UI). null se vazio ou curto demais. */
export async function getUserDisplayName(
  userId: string,
): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();
  const name = (data?.display_name ?? "").trim().replace(/\s+/g, " ");
  return name.length >= 2 ? name.slice(0, 60) : null;
}
