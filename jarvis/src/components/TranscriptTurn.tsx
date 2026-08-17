"use client";

import { memo, useEffect, useRef, useState, type ReactNode } from "react";

import { CitationBadge } from "@/components/CitationBadge";
import { FeedbackButtons } from "@/components/FeedbackButtons";
import { MarkdownLite } from "@/components/MarkdownLite";
import type { TurnMessage } from "@/lib/voice/types";

/** Um turno de conversa: mensagem do usuário + resposta(s) do assistente. */
export type Turn = {
  /** índice sequencial no array de turnos */
  id: number;
  /** índice da 1ª mensagem deste turno em `messages` flat */
  startIndex: number;
  messages: TurnMessage[];
};

export type TurnActions = {
  onCopyAnswer?: (text: string) => void;
  onDeleteTurn?: (startIndex: number, length: number) => void;
  onResendTurn?: (startIndex: number, length: number, newQuestion: string) => void;
  /** desativa editar/reenviar/excluir enquanto o orb processa (não durante speaking) */
  disabled?: boolean;
};

function formatTime(ts?: number): string | null {
  if (!ts) return null;
  return new Date(ts).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function summarize(turn: Turn): { label: string; text: string } {
  const first = turn.messages[0];
  const text = first.content.replace(/\s+/g, " ").trim();
  return {
    label: first.role === "user" ? "Você" : "Jarvis",
    text: text.length > 64 ? `${text.slice(0, 61)}…` : text,
  };
}

function IconBtn({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
        danger
          ? "text-[var(--jarvis-fg-subtle)] hover:bg-[var(--jarvis-danger-bg)] hover:text-[var(--jarvis-danger-fg)]"
          : "text-[var(--jarvis-fg-subtle)] hover:bg-[var(--jarvis-hover)] hover:text-[var(--jarvis-accent-hover)]"
      }`}
    >
      {children}
    </button>
  );
}

const iconCls = "h-3.5 w-3.5";

function IconCopy({ check }: { check?: boolean }) {
  if (check) {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className={iconCls} aria-hidden>
        <path d="M3.5 8.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className={iconCls} aria-hidden>
      <rect x="5.5" y="5.5" width="7" height="7" rx="1.2" />
      <path d="M3.5 10.5V3.5h7" strokeLinecap="round" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className={iconCls} aria-hidden>
      <path d="M11.5 2.5l2 2L5.5 12.5H3.5v-2L11.5 2.5z" strokeLinejoin="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className={iconCls} aria-hidden>
      <path d="M3.5 5h9M6.5 5V3.5h3V5M5.5 5v7.5h5V5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className={iconCls} aria-hidden>
      <path d="M3.5 8.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className={iconCls} aria-hidden>
      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
    </svg>
  );
}

function Bubbles({
  turn,
  sessionId,
  actions,
}: {
  turn: Turn;
  sessionId?: string | null;
  actions?: TurnActions;
}) {
  const question = turn.messages.find((m) => m.role === "user")?.content ?? "";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(question);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const busy = Boolean(actions?.disabled);

  useEffect(() => {
    if (!editing) return;
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [editing]);

  useEffect(() => {
    if (busy && editing) {
      setEditing(false);
      setDraft(question);
      setConfirmDelete(false);
    }
  }, [busy, editing, question]);

  const assistantMsg = [...turn.messages]
    .reverse()
    .find((m) => m.role === "assistant");

  function submitResend() {
    const next = draft.trim();
    if (!next || !actions?.onResendTurn || busy) return;
    setEditing(false);
    actions.onResendTurn(turn.startIndex, turn.messages.length, next);
  }

  return (
    <div className="flex flex-col gap-2">
      {turn.messages.map((msg, i) => {
        const time = formatTime(msg.timestamp);
        const showFeedback =
          msg.role === "assistant" && !msg.interrupted && msg.content.length > 0;
        const isUserEdit = editing && msg.role === "user";
        const isLastAssistant =
          msg.role === "assistant" && i === turn.messages.length - 1;

        return (
          <div key={`${msg.role}-${i}`} className="group flex flex-col gap-2">
            {isUserEdit ? (
              <div className="ml-auto flex w-full max-w-[92%] flex-col gap-2 rounded-2xl border border-[var(--jarvis-accent)]/40 bg-[var(--jarvis-accent)]/10 p-3">
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.preventDefault();
                      setEditing(false);
                      setDraft(question);
                      return;
                    }
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      submitResend();
                    }
                  }}
                  rows={3}
                  className="w-full resize-y rounded-lg border border-[var(--jarvis-border)] bg-[var(--jarvis-bg)] px-3 py-2 text-sm text-[var(--jarvis-fg)] outline-none focus:border-[var(--jarvis-accent)]"
                  aria-label="Editar pergunta"
                />
                <p className="text-[10px] text-[var(--jarvis-fg-subtle)]">
                  Ctrl+Enter (⌘+Enter) envia · Esc cancela
                </p>
                <div className="flex flex-wrap justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setDraft(question);
                    }}
                    className="rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide text-[var(--jarvis-fg-subtle)] uppercase hover:bg-[var(--jarvis-hover)] hover:text-[var(--jarvis-accent-hover)]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={!draft.trim() || busy}
                    onClick={() => submitResend()}
                    className="rounded-md bg-[var(--jarvis-accent)] px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase disabled:opacity-40"
                  >
                    Enviar de novo
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "ml-auto bg-[var(--jarvis-accent)]/15 text-[var(--jarvis-fg)]"
                    : "mr-auto bg-[var(--jarvis-bg-elevated)] text-[var(--jarvis-fg)]"
                } ${msg.interrupted ? "opacity-60" : ""}`}
              >
                {msg.role === "assistant" ? (
                  <MarkdownLite text={msg.content} />
                ) : (
                  msg.content
                )}
                {msg.interrupted && (
                  <span className="ml-2 inline-block rounded-full bg-[var(--jarvis-accent)]/20 px-1.5 py-0.5 align-baseline text-[9px] font-medium tracking-wide text-[var(--jarvis-accent-hover)]">
                    interrompido
                  </span>
                )}
                {time && (
                  <span className="ml-2 inline-block align-baseline text-[10px] tabular-nums text-[var(--jarvis-fg-subtle)] opacity-0 transition-opacity select-none group-hover:opacity-100">
                    {time}
                  </span>
                )}
              </div>
            )}

            {/* editar / excluir — só na pergunta do usuário */}
            {!editing &&
              msg.role === "user" &&
              (actions?.onResendTurn || actions?.onDeleteTurn) && (
                <div className="ml-auto flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                  {actions?.onResendTurn && (
                    <IconBtn
                      label={busy ? "Aguarda o turno atual" : "Editar e reenviar"}
                      onClick={() => {
                        if (busy) return;
                        setDraft(msg.content);
                        setEditing(true);
                        setConfirmDelete(false);
                      }}
                    >
                      <IconPencil />
                    </IconBtn>
                  )}
                  {actions?.onDeleteTurn &&
                    (confirmDelete ? (
                      <>
                        <IconBtn
                          label="Confirmar exclusão"
                          danger
                          onClick={() => {
                            if (busy) return;
                            setConfirmDelete(false);
                            actions.onDeleteTurn?.(
                              turn.startIndex,
                              turn.messages.length,
                            );
                          }}
                        >
                          <IconCheck />
                        </IconBtn>
                        <IconBtn
                          label="Cancelar exclusão"
                          onClick={() => setConfirmDelete(false)}
                        >
                          <IconX />
                        </IconBtn>
                      </>
                    ) : (
                      <IconBtn
                        label={busy ? "Aguarda o turno atual" : "Excluir"}
                        danger
                        onClick={() => {
                          if (busy) return;
                          setConfirmDelete(true);
                        }}
                      >
                        <IconTrash />
                      </IconBtn>
                    ))}
                </div>
              )}

            {msg.role === "assistant" &&
              msg.memoriesSaved &&
              msg.memoriesSaved.length > 0 && (
                <span className="mr-auto inline-flex w-fit items-center gap-1 rounded-full border border-[var(--jarvis-accent-mint)]/30 bg-[var(--jarvis-accent-mint)]/15 px-2 py-0.5 text-[10px] font-medium text-[var(--jarvis-accent-mint)]">
                  Memória atualizada
                </span>
              )}
            {msg.role === "assistant" &&
              msg.tasksChanged &&
              msg.tasksChanged.length > 0 && (
                <span className="mr-auto inline-flex w-fit items-center gap-1 rounded-full border border-[var(--jarvis-accent)]/30 bg-[var(--jarvis-accent)]/15 px-2 py-0.5 text-[10px] font-medium text-[var(--jarvis-accent-hover)]">
                  Tarefas atualizadas
                </span>
              )}
            {msg.role === "assistant" &&
              msg.citations &&
              msg.citations.length > 0 && (
                <CitationBadge citations={msg.citations} />
              )}

            {/* feedback + copiar — só na resposta do Jarvis */}
            {isLastAssistant &&
              (showFeedback || (assistantMsg && actions?.onCopyAnswer)) && (
                <div className="mt-1 flex flex-wrap items-center gap-0.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                  {showFeedback && (
                    <FeedbackButtons
                      question={question}
                      answer={msg.content}
                      sessionId={sessionId}
                      compact
                    />
                  )}
                  {assistantMsg && actions?.onCopyAnswer && (
                    <IconBtn
                      label={copied ? "Copiado" : "Copiar"}
                      onClick={() => {
                        actions.onCopyAnswer?.(assistantMsg.content);
                        setCopied(true);
                        window.setTimeout(() => setCopied(false), 1500);
                      }}
                    >
                      <IconCopy check={copied} />
                    </IconBtn>
                  )}
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
}

type Props = {
  turn: Turn;
  defaultExpanded: boolean;
  forceExpanded: boolean;
  sessionId?: string | null;
  actions?: TurnActions;
};

/**
 * Turnos recentes: bolhas diretas. Turnos antigos: accordion compacto.
 */
export const TranscriptTurn = memo(function TranscriptTurn({
  turn,
  defaultExpanded,
  forceExpanded,
  sessionId,
  actions,
}: Props) {
  const [open, setOpen] = useState(false);

  if (defaultExpanded || forceExpanded) {
    return (
      <div className="group animate-fade-up">
        <Bubbles turn={turn} sessionId={sessionId} actions={actions} />
      </div>
    );
  }

  const { label, text } = summarize(turn);
  const time = formatTime(turn.messages[0]?.timestamp);

  return (
    <div className="group">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-xl border border-[var(--jarvis-border)] bg-[var(--jarvis-hover)] px-3 py-2 text-left text-xs text-[var(--jarvis-fg-muted)] transition-colors hover:border-[var(--jarvis-accent)]/30 hover:text-[var(--jarvis-accent-hover)]"
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
        >
          <path
            d="M2 1l4 3-4 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="min-w-0 flex-1 truncate">
          {label}: {text}
        </span>
        {time && (
          <span className="shrink-0 text-[10px] tabular-nums text-[var(--jarvis-fg-subtle)]">
            {time}
          </span>
        )}
      </button>
      {open && (
        <div className="mt-2 animate-fade-up">
          <Bubbles turn={turn} sessionId={sessionId} actions={actions} />
        </div>
      )}
    </div>
  );
});
