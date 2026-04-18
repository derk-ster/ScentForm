"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Remounts page content when the pathname changes so client-only libraries
 * (e.g. Framer Motion whileInView / layout) do not keep stale state after
 * soft navigation — avoids blank screens when returning home from shop.
 */
export function MainWithRouteKey({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <main key={pathname} className="pb-[5.75rem] sm:pb-0">
      {children}
    </main>
  );
}
