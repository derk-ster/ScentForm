"use client";

import { Suspense, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CartFlyAnimationProvider } from "@/components/cart/CartFlyAnimationProvider";
import { CartRehydrate } from "@/components/layout/CartRehydrate";
import { AppShellErrorBoundary } from "@/components/layout/AppShellErrorBoundary";
import { AccentHydrate } from "@/components/layout/AccentHydrate";
import { AccountSessionHydrate } from "@/components/layout/AccountSessionHydrate";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="scentform-theme"
    >
      <AccentHydrate />
      <AccountSessionHydrate />
      <CartFlyAnimationProvider>
        <CartRehydrate />
        <AppShellErrorBoundary>
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
          {children}
        </AppShellErrorBoundary>
      </CartFlyAnimationProvider>
    </ThemeProvider>
  );
}
