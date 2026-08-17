"use client";

import type { VoiceOrbState } from "@/lib/voice/types";

type Props = {
  state: VoiceOrbState;
  onClick?: () => void;
  disabled?: boolean;
  /** false = só visual (div), sem botão — evita nested <button> em cards */
  interactive?: boolean;
};

/** Rótulos acessíveis em pt-BR por estado — descrevem a situação e a ação. */
const STATE_LABELS: Record<VoiceOrbState, string> = {
  idle: "Assistente de voz inativo. Toque para ativar.",
  standby: "Assistente em espera. Diga a palavra de ativação ou toque para falar.",
  armed: "Assistente pronto. Pode falar agora.",
  listening: "Ouvindo você falar.",
  processing: "Processando sua fala.",
  speaking: "Assistente respondendo. Toque para interromper.",
  interrupted: "Resposta interrompida.",
  error: "Erro no assistente de voz. Toque para tentar de novo.",
};

/**
 * Orbe de energia Foursys — visual em src/styles/orb.css.
 * As cores/intensidades por estado são resolvidas via [data-state];
 * aqui só entram as camadas e os efeitos condicionais (ping/ondas).
 */
export function VoiceOrb({
  state,
  onClick,
  disabled,
  interactive = true,
}: Props) {
  const layers = (
    <>
      <span aria-hidden="true" className="jarvis-orb__halo" />

      {/* anéis traseiros — passam por trás da esfera */}
      <span
        aria-hidden="true"
        className="jarvis-orb__ring jarvis-orb__ring--1"
      />
      <span
        aria-hidden="true"
        className="jarvis-orb__ring jarvis-orb__ring--3"
      />

      <span aria-hidden="true" className="jarvis-orb__body">
        <span className="jarvis-orb__plasma" />
        <span className="jarvis-orb__plasma jarvis-orb__plasma--b" />
        <span className="jarvis-orb__energy jarvis-orb__energy--orange" />
        <span className="jarvis-orb__energy jarvis-orb__energy--mint" />
        <span className="jarvis-orb__energy jarvis-orb__energy--red" />
        <span className="jarvis-orb__nucleus jarvis-orb__nucleus--a" />
        <span className="jarvis-orb__nucleus jarvis-orb__nucleus--b" />
        <span className="jarvis-orb__nucleus jarvis-orb__nucleus--c" />
        <span className="jarvis-orb__core" />
        <span className="jarvis-orb__shimmer" />
        <span className="jarvis-orb__sheen" />
      </span>

      {/* anéis frontais — cruzam na frente da esfera */}
      <span
        aria-hidden="true"
        className="jarvis-orb__ring jarvis-orb__ring--2"
      />
      <span
        aria-hidden="true"
        className="jarvis-orb__ring jarvis-orb__ring--4"
      />

      {state === "error" && (
        <span className="relative z-10 text-2xl font-semibold text-white/90">
          !
        </span>
      )}

      {(state === "listening" || state === "armed") && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 animate-ping rounded-full border ${
            state === "listening"
              ? "border-[var(--jarvis-accent)]/40"
              : "border-[var(--jarvis-accent-mint)]/40"
          }`}
        />
      )}

      {state === "processing" && (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-[-6px] animate-spin rounded-full border-2 border-transparent border-t-[var(--jarvis-accent-vanilla)]/80 border-r-[var(--jarvis-accent)]/50"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-pulse rounded-full bg-[var(--jarvis-accent)]/10"
          />
        </>
      )}

      {state === "speaking" && (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-jarvis-wave rounded-full border-2 border-[var(--jarvis-accent)]/50"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-jarvis-wave rounded-full border-2 border-[var(--jarvis-accent)]/40 [animation-delay:600ms]"
          />
        </>
      )}
    </>
  );

  const shell =
    "jarvis-orb relative flex h-[80px] w-[80px] items-center justify-center rounded-full transition-transform duration-300 md:h-[120px] md:w-[120px]";

  if (!interactive) {
    return (
      <div data-state={state} aria-hidden className={shell}>
        {layers}
      </div>
    );
  }

  return (
    <button
      type="button"
      data-state={state}
      onClick={onClick}
      disabled={disabled}
      aria-label={STATE_LABELS[state]}
      className={`${shell} hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jarvis-accent)] disabled:cursor-not-allowed`}
    >
      {layers}
    </button>
  );
}
