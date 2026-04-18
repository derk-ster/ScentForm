"use client";

import type { ReactNode } from "react";
import { AppShellErrorFallback } from "@/components/error/AppShellErrorFallback";
import { ReactErrorBoundary } from "@/components/error/ReactErrorBoundary";

/**
 * Catches render errors anywhere under Providers (promo, nav, pages, footer).
 * Nested route `error.tsx` files still handle segment-specific recovery when applicable.
 */
export function AppShellErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary fallback={<AppShellErrorFallback />}>
      {children}
    </ReactErrorBoundary>
  );
}
