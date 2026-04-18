"use client";

import { usePathname } from "next/navigation";
import { MinimalSiteHeader } from "@/components/error/MinimalSiteHeader";
import { ReactErrorBoundary } from "@/components/error/ReactErrorBoundary";
import { SiteHeader } from "@/components/navigation/SiteHeader";

/**
 * Remounts the error boundary on route changes so a one-time header render
 * error does not stick for the whole session.
 */
export function SiteHeaderWithErrorBoundary() {
  const pathname = usePathname();
  return (
    <ReactErrorBoundary key={pathname} fallback={<MinimalSiteHeader />}>
      <SiteHeader />
    </ReactErrorBoundary>
  );
}
