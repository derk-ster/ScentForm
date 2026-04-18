"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gift, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { useCartStore } from "@/store/cart-store";

const CLAIMED_KEY = "scentform-subscribe-10-off-claimed";
const CLOSE_FOREVER_KEY = "scentform-promo-close-forever";

export function SubscribePromoPopup() {
  const pathname = usePathname();
  const lines = useCartStore((s) => s.lines);

  const [hydrated, setHydrated] = React.useState(false);
  const [claimed, setClaimed] = React.useState(false);
  const [closeForeverPref, setCloseForeverPref] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [minimized, setMinimized] = React.useState(false);
  /** X on bottom teaser only — until full page refresh */
  const [teaserSessionDismissed, setTeaserSessionDismissed] =
    React.useState(false);
  const closeReasonRef = React.useRef<"submit" | "user">("user");
  const payFunnelPromoOpenedRef = React.useRef(false);

  const inPayFunnel =
    pathname === "/checkout" || pathname === "/cart";

  React.useEffect(() => {
    setHydrated(true);
    try {
      if (localStorage.getItem(CLAIMED_KEY)) {
        setClaimed(true);
        return;
      }
    } catch {
      /* private mode */
    }

    let forever = false;
    try {
      forever = !!localStorage.getItem(CLOSE_FOREVER_KEY);
      setCloseForeverPref(forever);
    } catch {
      /* ignore */
    }

    if (!forever) {
      /* Defer so first paint shows page content before modal + scroll lock */
      const id = window.requestAnimationFrame(() => setDialogOpen(true));
      return () => window.cancelAnimationFrame(id);
    }
  }, []);

  React.useEffect(() => {
    if (!inPayFunnel) {
      payFunnelPromoOpenedRef.current = false;
    }
  }, [inPayFunnel]);

  React.useEffect(() => {
    if (!hydrated || claimed) return;
    if (!closeForeverPref) return;
    if (!inPayFunnel) return;
    if (lines.length === 0) return;
    if (payFunnelPromoOpenedRef.current) return;

    payFunnelPromoOpenedRef.current = true;
    setTeaserSessionDismissed(false);
    setMinimized(false);
    setDialogOpen(true);
  }, [hydrated, claimed, closeForeverPref, inPayFunnel, lines.length]);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDialogOpen(true);
      return;
    }

    setDialogOpen(false);

    if (closeReasonRef.current === "submit") {
      closeReasonRef.current = "user";
      setMinimized(false);
      return;
    }

    setMinimized(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    closeReasonRef.current = "submit";
    try {
      localStorage.setItem(CLAIMED_KEY, "1");
    } catch {
      /* ignore */
    }
    setClaimed(true);
    setDialogOpen(false);
    setMinimized(false);
    setTeaserSessionDismissed(false);
  };

  const reopenFromTeaser = () => {
    setTeaserSessionDismissed(false);
    setMinimized(false);
    setDialogOpen(true);
  };

  /** Same as before: X on teaser — hidden until refresh, no localStorage */
  const dismissTeaserWithX = () => {
    setMinimized(false);
    setDialogOpen(false);
    setTeaserSessionDismissed(true);
  };

  const closeForever = () => {
    try {
      localStorage.setItem(CLOSE_FOREVER_KEY, "1");
    } catch {
      /* ignore */
    }
    setCloseForeverPref(true);
    setMinimized(false);
    setDialogOpen(false);
    setTeaserSessionDismissed(false);
  };

  if (!hydrated || claimed) {
    return null;
  }

  const hideAfterTeaserX =
    teaserSessionDismissed && !dialogOpen && !minimized;

  const hideCloseForeverOnSite =
    closeForeverPref && !inPayFunnel && !dialogOpen && !minimized;

  if (hideAfterTeaserX || hideCloseForeverOnSite) {
    return null;
  }

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className={cn(
            "left-[50%] top-[50%] max-h-[min(90dvh,calc(100svh-2rem))] w-[min(100%,calc(100vw-1.5rem))] max-w-[min(420px,calc(100vw-1.5rem))] translate-x-[-50%] translate-y-[-50%]",
            "gap-0 overflow-y-auto border-border/80 bg-card p-5 sm:rounded-xl sm:p-6",
          )}
        >
          <DialogHeader className="space-y-2 pb-1 text-center sm:text-center">
            <DialogTitle className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
              Unlock 10% Off
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground sm:text-base">
              {"Subscribe for news & updates."}
            </DialogDescription>
          </DialogHeader>

          <p className="pb-4 pt-2 text-center text-sm font-medium text-foreground">
            Get a 10% coupon immediately!
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="promo-first-name">First name</Label>
              <Input
                id="promo-first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                placeholder="First name"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <Label htmlFor="promo-email">Email</Label>
              <Input
                id="promo-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email"
              />
            </div>
            <Button type="submit" className="mt-1 w-full">
              Submit
            </Button>
          </form>

          <p className="pt-4 text-center text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
            By signing up, you agree to receive marketing emails. View our{" "}
            <Link
              href="/policies/privacy-policy"
              className="text-primary underline-offset-2 hover:underline"
            >
              privacy policy
            </Link>{" "}
            and{" "}
            <Link
              href="/policies/terms-of-service"
              className="text-primary underline-offset-2 hover:underline"
            >
              terms of service
            </Link>{" "}
            for more info.
          </p>
        </DialogContent>
      </Dialog>

      {minimized && !dialogOpen && (
        <div
          role="region"
          aria-label="Newsletter discount offer"
          className={cn(
            "fixed bottom-4 left-4 z-[60] flex w-[min(18rem,calc(100vw-2rem))] flex-col gap-2 rounded-xl border border-border/80 bg-card/95 p-3 shadow-lg shadow-black/40 backdrop-blur-md",
            "animate-in fade-in slide-in-from-bottom-4 duration-300",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Gift className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold leading-tight">
                  Unlock 10% off
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Subscribe in one tap.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissTeaserWithX}
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close offer completely"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-1.5 sm:flex-row">
            <Button
              type="button"
              size="sm"
              className="w-full sm:flex-1"
              onClick={reopenFromTeaser}
            >
              Subscribe
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-foreground sm:w-auto"
              onClick={closeForever}
            >
              Close forever
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
