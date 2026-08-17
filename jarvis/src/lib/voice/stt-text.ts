/** STT lixo: silêncio, timestamp, placeholder. */
export function isUsableSttText(raw: string | null | undefined): boolean {
  const s = (raw ?? "").trim();
  if (s.length < 2) return false;
  if (/^\d{1,2}:\d{2}([.:]\d{1,3})?$/.test(s)) return false;
  if (/^\[(silence|blank|inaudible|music|música|silêncio)\]$/i.test(s)) return false;
  if (/^(silence|inaudible|\(inaudible\)|\(silence\))$/i.test(s)) return false;
  return true;
}

export function normalizeAudioMime(mime: string): string {
  const base = mime.split(";")[0]?.trim().toLowerCase() || "audio/wav";
  if (base === "audio/x-wav" || base === "audio/wave") return "audio/wav";
  return base;
}
