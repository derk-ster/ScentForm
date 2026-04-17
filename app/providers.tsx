"use client";

import { Suspense, type ReactNode } from "react";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      {children}
    </>
  );
}
