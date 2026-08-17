"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { JarvisLogo } from "@/components/JarvisLogo";
import { ScrollToBottomFab } from "@/components/ScrollToBottomFab";
import {
  TranscriptTurn,
  type Turn,
  type TurnActions,
} from "@/components/TranscriptTurn";
import type { TurnMessage } from "@/lib/voice/types";

type Props = {
  messages: TurnMessage[];
  /** true enquanto o Jarvis processa o turno — mostra os 3 pontos */
  streaming?: boolean;
  /** conversa ativa — repassado ao feedback dos turnos */
  sessionId?: string | null;
  actions?: TurnActions;
};

/** últimos N turnos ficam expandidos por padrão */
const RECENT_TURNS = 3;
/** distância (px) do fim para considerar "no fim" */
const BOTTOM_THRESHOLD = 40;

/** Agrupa mensagens consecutivas em turnos (user abre turno; assistant anexa). */
function groupTurns(messages: TurnMessage[]): Turn[] {
  const turns: Turn[] = [];
  messages.forEach((msg, index) => {
    const last = turns[turns.length - 1];
    if (msg.role === "user" || !last) {
      turns.push({ id: turns.length, startIndex: index, messages: [msg] });
    } else {
      last.messages.push(msg);
    }
  });
  return turns;
}

export function TranscriptPanel({
  messages,
  streaming = false,
  sessionId,
  actions,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const [atBottom, setAtBottom] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // recomputa só quando as mensagens mudam — não a cada re-render (tick de health)
  const turns = useMemo(() => groupTurns(messages), [messages]);
  const collapsedCount = Math.max(0, turns.length - RECENT_TURNS);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth && !reduced ? "smooth" : "auto",
    });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const near =
      el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_THRESHOLD;
    atBottomRef.current = near;
    setAtBottom(near);
  }, []);

  // acompanha o texto crescendo no streaming (length não muda, só o conteúdo)
  const lastContent = messages[messages.length - 1]?.content ?? "";

  // Auto-scroll só se o usuário já estava no fim — não interrompe leitura do histórico
  useEffect(() => {
    if (atBottomRef.current) scrollToBottom();
  }, [messages.length, lastContent, streaming, scrollToBottom]);

  return (
    <div className="flex h-[min(280px,38vh)] flex-col rounded-2xl border border-[var(--jarvis-border)] bg-[var(--jarvis-hover)] backdrop-blur md:h-[min(420px,45vh)] lg:h-full">
      {/* header fixo do painel: sessão ativa + ver conversa completa */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--jarvis-border)] px-3 py-2 md:px-4">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-[var(--jarvis-fg-muted)] uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--jarvis-accent-mint)] motion-safe:animate-pulse" />
          Sessão ativa
          {turns.length > 0 && (
            <span className="text-[var(--jarvis-fg-subtle)] normal-case">
              · {turns.length} {turns.length === 1 ? "turno" : "turnos"}
            </span>
          )}
        </span>
        {collapsedCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="text-[10px] font-semibold text-[var(--jarvis-fg-muted)] transition-colors hover:text-[var(--jarvis-accent-hover)]"
          >
            {showAll
              ? "Recolher turnos antigos"
              : `Ver conversa completa (${turns.length} turnos)`}
          </button>
        )}
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="scrollbar-invisible flex h-full flex-col gap-3 overflow-y-auto p-2.5 md:p-4"
        >
          {messages.length === 0 && !streaming && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
              <JarvisLogo className="text-xl opacity-90" />
              <p className="max-w-xs text-sm text-[var(--jarvis-fg-muted)]">
                Diga &quot;Olá Jarvis&quot; ou toque no orb para começar.
                Perguntas sobre Foursys, PortalFoursys ou Jarvis ativam RAG e
                widgets.
              </p>
            </div>
          )}
          {turns.map((turn, i) => (
            <TranscriptTurn
              key={turn.id}
              turn={turn}
              defaultExpanded={i >= turns.length - RECENT_TURNS}
              forceExpanded={showAll}
              sessionId={sessionId}
              actions={actions}
            />
          ))}
          {streaming && (
            <div className="mr-auto flex animate-fade-up items-center gap-1.5 rounded-2xl bg-[var(--jarvis-bg-elevated)] px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-jarvis-typing rounded-full bg-[var(--jarvis-fg-muted)]"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          )}
        </div>

        <ScrollToBottomFab
          visible={!atBottom && !streaming}
          onClick={() => {
            atBottomRef.current = true;
            setAtBottom(true);
            scrollToBottom();
          }}
        />
      </div>
    </div>
  );
}
