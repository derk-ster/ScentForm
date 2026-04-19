"use client";

import { useLayoutEffect } from "react";
import { applyAccentToDocument, readStoredAccent } from "@/lib/theme/accent";

/** Re-applies saved accent after hydration (bootstrap script already set `html` on refresh). */
export function AccentHydrate() {
  useLayoutEffect(() => {
    applyAccentToDocument(readStoredAccent());
  }, []);
  return null;
}
