"use client";

import { useEffect, useState } from "react";

export type AuthRedirectNotice = {
  kind: "link_expired" | "callback_error" | "confirmed" | "generic";
  title: string;
  detail: string;
  showResend: boolean;
};

const LINK_EXPIRED: AuthRedirectNotice = {
  kind: "link_expired",
  title: "Link de confirmação expirado",
  detail:
    "Esse link não vale mais (válido ~24h). Links antigos param de funcionar quando você pede um novo. Use “Reenviar e-mail de confirmação”, abra só o e-mail mais recente e depois entre com e-mail e senha.",
  showResend: true,
};

const CALLBACK_ERROR: AuthRedirectNotice = {
  kind: "callback_error",
  title: "Não foi possível concluir pelo link",
  detail:
    "O link pode ter expirado ou já ter sido usado. Reenvie a confirmação ou entre com e-mail e senha se a conta já estiver ativa.",
  showResend: true,
};

const CONFIRMED: AuthRedirectNotice = {
  kind: "confirmed",
  title: "E-mail confirmado",
  detail: "Conta ativa. Entre com seu e-mail e senha abaixo.",
  showResend: false,
};

function noticeFromHash(hashParams: URLSearchParams): AuthRedirectNotice | null {
  const code = hashParams.get("error_code") ?? hashParams.get("error");

  if (code === "otp_expired") return LINK_EXPIRED;

  if (code === "access_denied" || code === "invalid_request") {
    return {
      kind: "link_expired",
      title: "Link inválido ou expirado",
      detail:
        "Não foi possível confirmar com esse link. Peça um novo e-mail e use apenas o link mais recente.",
      showResend: true,
    };
  }

  const description = hashParams.get("error_description");
  if (description?.toLowerCase().includes("expired")) {
    return LINK_EXPIRED;
  }

  return null;
}

function noticeFromQuery(params: URLSearchParams): AuthRedirectNotice | null {
  if (params.get("confirmed") === "1") return CONFIRMED;
  if (params.get("expired") === "1" || params.get("error") === "link_expired") {
    return LINK_EXPIRED;
  }
  if (params.get("error") === "auth_callback") return CALLBACK_ERROR;
  return null;
}

/** Lê avisos do hash (#error=…) e query (?error=…) após redirect Supabase. */
export function useAuthRedirectNotice(): AuthRedirectNotice | null {
  const [notice, setNotice] = useState<AuthRedirectNotice | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = noticeFromQuery(params);

    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;

    const fromHash = hash
      ? noticeFromHash(new URLSearchParams(hash))
      : null;

    setNotice(fromHash ?? fromQuery);

    // Limpa hash/query de erro da URL (evita mensagem fantasma ao recarregar)
    if (fromHash || params.get("error") || params.get("expired")) {
      const clean = new URL(window.location.href);
      clean.hash = "";
      clean.searchParams.delete("error");
      clean.searchParams.delete("expired");
      clean.searchParams.delete("reason");
      window.history.replaceState({}, "", clean.pathname + clean.search);
    }
  }, []);

  return notice;
}

export const RESEND_SUCCESS_MESSAGE =
  "Novo link enviado. Válido ~24h — use só este e-mail (links anteriores expiram). Verifique spam e clique no link mais recente.";
