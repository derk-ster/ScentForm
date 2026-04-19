"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { usePromoTeaserVisibility } from "@/components/marketing/PromoTeaserVisibility";

const hiddenPaths = new Set(["/cart", "/checkout"]);
const SESSION_DISMISS_KEY = "allura7-find-scent-bar-dismissed";

export function StickyScentFinder() {
  const pathname = usePathname();
  const { promoTeaserVisible } = usePromoTeaserVisibility();
  const [barDismissedSession, setBarDismissedSession] = React.useState(false);

  React.useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_DISMISS_KEY) === "1") {
        setBarDismissedSession(true);
      }
    } catch {
      /* private mode */
    }
  }, []);

  const dismissFullBar = () => {
    try {
      sessionStorage.setItem(SESSION_DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setBarDismissedSession(true);
  };

  if (hiddenPaths.has(pathname)) return null;

  /** Mobile: pill on the right when the 10% teaser is visible; full-width bar otherwise (unless dismissed for this session). */
  const mobileCompact = promoTeaserVisible;
  const mobileShowFullBar = !promoTeaserVisible && !barDismissedSession;

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed z-[45] hidden sm:block",
          "bottom-8 right-6",
        )}
      >
        <Button
          asChild
          size="lg"
          className="pointer-events-auto rounded-full px-5 shadow-lg shadow-black/30"
        >
          <Link href="/#scent-finder" className="gap-2">
            <Sparkles className="h-4 w-4" aria-hidden />
            Discovery guide
          </Link>
        </Button>
      </div>

      {mobileCompact ? (
        <div
          className={cn(
            "pointer-events-none fixed bottom-4 right-4 z-[55] sm:hidden",
            "pb-[max(0.25rem,env(safe-area-inset-bottom))]",
          )}
        >
          <Button
            asChild
            size="lg"
            className="pointer-events-auto rounded-full px-5 shadow-lg shadow-black/30"
          >
            <Link href="/#scent-finder" className="gap-2">
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
              Discovery guide
            </Link>
          </Button>
        </div>
      ) : mobileShowFullBar ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[45] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
          <div className="pointer-events-auto mx-auto flex w-full max-w-md items-center gap-1 rounded-full border border-border/60 bg-background/95 py-1 pl-1 pr-0.5 shadow-lg shadow-black/30 backdrop-blur-md">
            <Button
              asChild
              variant="ghost"
              className="h-11 flex-1 justify-center gap-2 rounded-full px-3 font-medium hover:bg-transparent"
            >
              <Link href="/#scent-finder" className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
                Discovery guide
              </Link>
            </Button>
            <button
              type="button"
              onClick={dismissFullBar}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Hide Discovery guide for this visit"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
