"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function scrollTopInstant() {
  try {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } catch {
    /* rare browser / scroll-lock edge cases during route transitions */
  }
}

export function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevRouteKey = useRef<string | null>(null);

  const routeKey = `${pathname}?${searchParams?.toString() ?? ""}`;

  useLayoutEffect(() => {
    const prev = prevRouteKey.current;
    prevRouteKey.current = routeKey;

    if (prev === null) {
      return;
    }

    const prevPath = prev.split("?")[0];
    const nextPath = routeKey.split("?")[0];

    if (prevPath !== nextPath) {
      scrollTopInstant();
    }
  }, [routeKey, pathname, searchParams]);

  return null;
}
