"use client";

import { Suspense, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      storageKey="scentform-theme"
    >
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      {children}
    </ThemeProvider>
  );
}
