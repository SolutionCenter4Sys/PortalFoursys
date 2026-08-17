import type { AuthError } from "@supabase/supabase-js";

export type AuthErrorContext = "login" | "signup" | "resend";

/** Mapeia erros Supabase Auth para mensagens claras em pt-BR. */
export function mapAuthError(
  error: AuthError | null,
  context: AuthErrorContext = "login",
): string {
  if (!error) return "Erro desconhecido. Tente novamente.";

  const code = error.message.toLowerCase();
  const status = error.status;

  if (
    code.includes("email not confirmed") ||
    code.includes("email_not_confirmed")
  ) {
    if (context === "login") {
      return "Conta ainda não confirmada. Se um link antigo falhou, clique em “Reenviar e-mail de confirmação” e abra só o e-mail mais recente.";
    }
    return "Confirme o e-mail antes de entrar. Verifique spam ou reenvie a confirmação.";
  }

  if (
    code.includes("invalid login credentials") ||
    code.includes("invalid_credentials")
  ) {
    return "E-mail ou senha incorretos. Se a conta é nova, confirme o e-mail antes de entrar.";
  }

  if (code.includes("user already registered")) {
    return "Este e-mail já está cadastrado. Tente entrar ou recuperar a senha.";
  }

  if (code.includes("password should be at least")) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }

  if (code.includes("signup is disabled")) {
    return "Cadastro por e-mail desabilitado no Supabase. Contate o administrador.";
  }

  if (status === 429 || code.includes("rate limit")) {
    return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
  }

  return error.message;
}
