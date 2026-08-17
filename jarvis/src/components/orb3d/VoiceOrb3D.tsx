"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import type { VoiceOrbState } from "@/lib/voice/types";
import { VoiceOrb } from "@/components/VoiceOrb";

const OrbCanvas = dynamic(
  () => import("@/components/orb3d/OrbCanvas").then((m) => m.OrbCanvas),
  { ssr: false, loading: () => null },
);

/** Rótulos acessíveis (iguais ao orb 2D). */
export const ORB_STATE_LABELS: Record<VoiceOrbState, string> = {
  idle: "Assistente de voz inativo. Toque para ativar.",
  standby: "Assistente em espera. Diga a palavra de ativação ou toque para falar.",
  armed: "Assistente pronto. Pode falar agora.",
  listening: "Ouvindo você falar.",
  processing: "Processando sua fala.",
  speaking: "Assistente respondendo. Toque para interromper.",
  interrupted: "Resposta interrompida.",
  error: "Erro no assistente de voz. Toque para tentar de novo.",
};

export const ORB_STATES: VoiceOrbState[] = [
  "idle",
  "standby",
  "armed",
  "listening",
  "processing",
  "speaking",
  "interrupted",
  "error",
];

type Props = {
  state: VoiceOrbState;
  onClick?: () => void;
  disabled?: boolean;
  /** 0–1 volume do TTS (opcional) */
  audioLevel?: number;
  /** tamanho do canvas / hit area */
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** força 2D (testes / fallback) */
  force2d?: boolean;
  /**
   * false = só visual (div), sem botão — use quando o clique está no card pai
   * (ex.: grid do showcase). Default true.
   */
  interactive?: boolean;
  /** hero = showcase profissional; app = runtime /app */
  quality?: "hero" | "app";
  /** OrbitControls — arrastar para ver volume 3D */
  controls?: boolean;
};

const SIZE_PX = { sm: 96, md: 120, lg: 160, xl: 200 } as const;

/**
 * Orb 3D Foursys com fallback automático para o VoiceOrb 2D
 * se WebGL não estiver disponível.
 */
export function VoiceOrb3D({
  state,
  onClick,
  disabled,
  audioLevel = 0,
  size = "md",
  className = "",
  force2d = false,
  interactive = true,
  quality = "app",
  controls = false,
}: Props) {
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const px = SIZE_PX[size];

  useEffect(() => {
    if (force2d) {
      setWebglOk(false);
      return;
    }
    try {
      const c = document.createElement("canvas");
      const gl =
        c.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
        c.getContext("webgl", { failIfMajorPerformanceCaveat: false });
      setWebglOk(Boolean(gl));
    } catch {
      setWebglOk(false);
    }
  }, [force2d]);

  if (webglOk === false) {
    return (
      <VoiceOrb
        state={state}
        onClick={onClick}
        disabled={disabled}
        interactive={interactive}
      />
    );
  }

  if (webglOk === null) {
    return (
      <div
        style={{ width: px, height: px }}
        className={`relative ${className}`}
        aria-hidden
      />
    );
  }

  const canvas = (
    <Suspense fallback={null}>
      <OrbCanvas
        state={state}
        audioLevel={audioLevel}
        quality={quality}
        controls={controls}
      />
    </Suspense>
  );

  // Com orbit controls, NÃO usar <button> — captura o drag
  if (!interactive || controls) {
    return (
      <div
        data-state={state}
        role={onClick && !controls ? "button" : undefined}
        tabIndex={onClick && !controls ? 0 : undefined}
        onClick={controls ? undefined : onClick}
        onKeyDown={
          onClick && !controls
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") onClick();
              }
            : undefined
        }
        aria-label={controls ? undefined : ORB_STATE_LABELS[state]}
        className={`relative flex items-center justify-center ${className}`}
        style={{ width: px, height: px }}
      >
        {canvas}
      </div>
    );
  }

  return (
    <button
      type="button"
      data-state={state}
      onClick={onClick}
      disabled={disabled}
      aria-label={ORB_STATE_LABELS[state]}
      className={`relative flex items-center justify-center rounded-full transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--jarvis-accent)] disabled:cursor-not-allowed ${className}`}
      style={{ width: px, height: px }}
    >
      {canvas}
    </button>
  );
}
