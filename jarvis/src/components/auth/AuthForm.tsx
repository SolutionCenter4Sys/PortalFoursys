"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { JarvisLogo, PoweredByFoursys } from "@/components/JarvisLogo";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { MicrosoftButton } from "@/components/auth/MicrosoftButton";
import { mapAuthError } from "@/lib/auth/errors";
import {
  RESEND_SUCCESS_MESSAGE,
  useAuthRedirectNotice,
  type AuthRedirectNotice,
} from "@/lib/auth/redirect-errors";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { authCallbackUrl } from "@/lib/supabase/config";

type AuthFormProps = {
  mode: "login" | "signup";
};

function AuthNotice({ notice }: { notice: AuthRedirectNotice }) {
  const styles = {
    link_expired:
      "border-[var(--jarvis-accent-vanilla)]/30 bg-[var(--jarvis-accent-vanilla)]/10 text-[var(--jarvis-accent-vanilla)]",
    callback_error:
      "border-[var(--jarvis-accent-vanilla)]/30 bg-[var(--jarvis-accent-vanilla)]/10 text-[var(--jarvis-accent-vanilla)]",
    confirmed:
      "border-[var(--jarvis-accent-mint)]/30 bg-[var(--jarvis-accent-mint)]/10 text-[var(--jarvis-accent-mint)]",
    generic:
      "border-[var(--jarvis-border-strong)] bg-[var(--jarvis-hover)] text-[var(--jarvis-fg-muted)]",
  };

  return (
    <div className={`rounded-xl border p-4 text-sm ${styles[notice.kind]}`}>
      <p className="font-semibold">{notice.title}</p>
      <p className="mt-1 text-xs leading-relaxed opacity-90">{notice.detail}</p>
    </div>
  );
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/app";
  const redirectNotice = useAuthRedirectNotice();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);

  // Redireciona imediatamente se já há sessão válida
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(next);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (redirectNotice?.showResend) {
      setNeedsEmailConfirm(true);
    }
  }, [redirectNotice]);

  const isSignup = mode === "signup";

  async function handleResendConfirmation() {
    if (!email.trim()) {
      setError("Informe seu e-mail para reenviar a confirmação.");
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: {
        emailRedirectTo: authCallbackUrl("signup"),
      },
    });
    setLoading(false);
    if (resendError) {
      setError(mapAuthError(resendError, "resend"));
      return;
    }
    setInfo(RESEND_SUCCESS_MESSAGE);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    if (!redirectNotice?.showResend) {
      setNeedsEmailConfirm(false);
    }

    if (!isSupabaseConfigured()) {
      setError("Configure NEXT_PUBLIC_SUPABASE_URL e ANON_KEY em .env.local");
      setLoading(false);
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    if (isSignup) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: authCallbackUrl("signup"),
        },
      });

      if (signUpError) {
        setError(mapAuthError(signUpError, "signup"));
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push("/onboarding");
        router.refresh();
        return;
      }

      setInfo(
        `Conta criada! Enviamos um link para ${email.trim()} (válido ~24h). Confirme antes de entrar.`,
      );
      setNeedsEmailConfirm(true);
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      const msg = mapAuthError(signInError, "login");
      setError(msg);
      if (
        signInError.message.toLowerCase().includes("email not confirmed")
      ) {
        setNeedsEmailConfirm(true);
      }
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <JarvisLogo className="text-2xl" />
        <h1 className="mt-3 text-xl font-medium text-[var(--jarvis-fg)]">
          {isSignup ? "Criar sua conta" : "Bem-vindo de volta"}
        </h1>
      </div>

      <div className="space-y-4 rounded-2xl border border-[var(--jarvis-border)] bg-[var(--jarvis-hover)] p-6">
        {redirectNotice && <AuthNotice notice={redirectNotice} />}

        <GoogleButton
          mode={mode}
          label={isSignup ? "Continuar com Google" : "Entrar com Google"}
        />
        <MicrosoftButton
          mode={mode}
          label={isSignup ? "Continuar com Microsoft" : "Entrar com Microsoft"}
        />
        <p className="text-center text-[11px] text-[var(--jarvis-fg-subtle)]">
          OAuth precisa estar habilitado no Supabase (Providers → Google / Azure).
        </p>

        <div className="flex items-center gap-3 text-xs text-[var(--jarvis-fg-subtle)]">
          <div className="h-px flex-1 bg-[var(--jarvis-hover-strong)]" />
          ou e-mail
          <div className="h-px flex-1 bg-[var(--jarvis-hover-strong)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-[var(--jarvis-fg-muted)]">
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--jarvis-border)] bg-[var(--jarvis-bg)] px-3 py-2 text-[var(--jarvis-fg)] outline-none focus:border-[var(--jarvis-accent)]"
              required
              autoComplete="email"
            />
          </label>

          <label className="block text-sm text-[var(--jarvis-fg-muted)]">
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--jarvis-border)] bg-[var(--jarvis-bg)] px-3 py-2 text-[var(--jarvis-fg)] outline-none focus:border-[var(--jarvis-accent)]"
              required
              minLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </label>

          {isSignup && (
            <label className="block text-sm text-[var(--jarvis-fg-muted)]">
              Confirmar senha
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--jarvis-border)] bg-[var(--jarvis-bg)] px-3 py-2 text-[var(--jarvis-fg)] outline-none focus:border-[var(--jarvis-accent)]"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </label>
          )}

          {!isSignup && (
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[var(--jarvis-accent)] hover:text-[var(--jarvis-accent-hover)]"
              >
                Esqueci a senha
              </Link>
            </div>
          )}

          {info && <p className="text-sm text-emerald-400">{info}</p>}
          {error && <p className="text-sm text-[var(--jarvis-danger-fg)]">{error}</p>}

          {needsEmailConfirm && (
            <button
              type="button"
              onClick={() => void handleResendConfirmation()}
              disabled={loading}
              className="w-full rounded-xl border border-[var(--jarvis-accent)]/30 py-2 text-sm text-[var(--jarvis-accent-hover)] hover:bg-[var(--jarvis-accent)]/10"
            >
              Reenviar e-mail de confirmação
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--jarvis-accent)] py-3 text-sm font-semibold text-white transition hover:bg-[var(--jarvis-accent-hover)] disabled:opacity-50"
          >
            {loading
              ? "Aguarde…"
              : isSignup
                ? "Criar conta →"
                : "Entrar →"}
          </button>
        </form>

        {isSignup && (
          <p className="text-center text-xs text-[var(--jarvis-fg-subtle)]">
            Ao criar, você concorda com os Termos e Privacidade.
          </p>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-[var(--jarvis-fg-muted)]">
        {isSignup ? (
          <>
            Já tem conta?{" "}
            <Link href="/auth/login" className="text-[var(--jarvis-accent)] hover:text-[var(--jarvis-accent-hover)]">
              Entrar
            </Link>
          </>
        ) : (
          <>
            Não tem conta?{" "}
            <Link href="/auth/signup" className="text-[var(--jarvis-accent)] hover:text-[var(--jarvis-accent-hover)]">
              Criar agora
            </Link>
          </>
        )}
      </p>

      <p className="mt-8 text-center">
        <PoweredByFoursys />
      </p>
    </div>
  );
}
