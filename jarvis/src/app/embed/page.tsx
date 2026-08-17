"use client";

import { AppVoiceClient } from "@/components/AppVoiceClient";

/**
 * /embed — Jarvis original no iframe do Portal (STT/TTS cloud, mesmo /app).
 * Fundo transparente: CSS `html:has([data-jarvis-embed])`.
 */
export default function EmbedPage() {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-transparent">
      <AppVoiceClient variant="embed" />
    </div>
  );
}
