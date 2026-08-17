"use client";

/**
 * FAB laranja "ir para o fim" — aparece dentro do transcript
 * quando o usuário rolou para cima.
 */
export function ScrollToBottomFab({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ir para o fim da conversa"
      className="absolute right-3 bottom-3 z-10 flex h-9 w-9 animate-fade-up items-center justify-center rounded-full bg-[var(--jarvis-accent)] text-white shadow-[var(--jarvis-shadow-glow)] transition-colors hover:bg-[var(--jarvis-accent-hover)]"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 2v10M3 8l4 4 4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
