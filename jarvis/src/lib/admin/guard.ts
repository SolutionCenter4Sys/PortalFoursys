import { createClient } from "@/lib/supabase/server";

/** Retorna o userId se o usuário logado for admin (profiles.is_admin), senão null. */
export async function getAdminUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  return (data as { is_admin?: boolean } | null)?.is_admin ? user.id : null;
}
