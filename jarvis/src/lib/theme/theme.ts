/** Tema visual Jarvis — dark (default) | light. Persistido em localStorage. */

export type JarvisTheme = "dark" | "light";

export const THEME_STORAGE_KEY = "jarvis-theme";

export function isJarvisTheme(value: unknown): value is JarvisTheme {
  return value === "dark" || value === "light";
}

export function getStoredTheme(): JarvisTheme {
  if (typeof window === "undefined") return "dark";
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isJarvisTheme(raw)) return raw;
  } catch {
    // private mode / blocked storage
  }
  return "dark";
}

/** Aplica tema no <html> e dispara evento p/ consumidores (ex.: mermaid). */
export function applyTheme(theme: JarvisTheme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const color =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--jarvis-theme-color")
        .trim() || (theme === "light" ? "#f7f6f2" : "#181828");
    meta.setAttribute("content", color);
  }
  window.dispatchEvent(
    new CustomEvent("jarvis:theme", { detail: { theme } }),
  );
}

export function toggleTheme(current: JarvisTheme): JarvisTheme {
  const next: JarvisTheme = current === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
