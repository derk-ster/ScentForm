/** Premium accent palettes — `data-accent` on `<html>`; persisted in localStorage. */
export const ACCENT_STORAGE_KEY = "scentform-accent";

/** Only non-default accents (default = no `data-accent`). */
export type AccentId = "moss" | "wine";

export const ACCENT_IDS: AccentId[] = ["moss", "wine"];

export const ACCENT_OPTIONS: { id: AccentId; label: string; hint: string }[] = [
  { id: "moss", label: "Sage moss", hint: "Quiet green-gray" },
  { id: "wine", label: "Dusty wine", hint: "Muted plum-brown" },
];

/**
 * Runs in `<head>` before paint so the first frame matches localStorage.
 * Keeps device choice stable across refresh (no flash of wrong accent).
 */
export const ACCENT_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(ACCENT_STORAGE_KEY)};var a=localStorage.getItem(k);if(a==="moss"||a==="wine"){document.documentElement.setAttribute("data-accent",a);}else{document.documentElement.removeAttribute("data-accent");if(a==="sand"){localStorage.removeItem(k);}}}catch(e){}})();`;

export function isAccentId(v: string | null): v is AccentId {
  return v === "moss" || v === "wine";
}

export function readStoredAccent(): AccentId | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACCENT_STORAGE_KEY);
    if (raw === "sand") {
      localStorage.removeItem(ACCENT_STORAGE_KEY);
      return null;
    }
    return isAccentId(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function writeStoredAccent(id: AccentId | null) {
  if (typeof window === "undefined") return;
  try {
    if (id) localStorage.setItem(ACCENT_STORAGE_KEY, id);
    else localStorage.removeItem(ACCENT_STORAGE_KEY);
  } catch {
    /* quota / private mode */
  }
}

export function applyAccentToDocument(id: AccentId | null) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  if (id) el.setAttribute("data-accent", id);
  else el.removeAttribute("data-accent");
}
