"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ACCOUNT_WELCOME_PROMO_CODE,
  getWelcomePromoEligible,
} from "@/lib/account/account-service";
import * as account from "@/lib/account/account-service";
import { useAccountStore } from "@/store/account-store";
import { getProductByHandle } from "@/lib/data/catalog";
import { ProductCard } from "@/components/product/ProductCard";

export function AccountHomeClient() {
  const session = useAccountStore((s) => s.session);
  const hydrated = useAccountStore((s) => s.hydrated);
  const refresh = useAccountStore((s) => s.refresh);
  const [welcome, setWelcome] = useState(false);
  const [handles, setHandles] = useState<string[]>([]);

  useEffect(() => {
    if (!hydrated || !session?.syncPreference) {
      setWelcome(false);
      setHandles([]);
      return;
    }
    void getWelcomePromoEligible().then(setWelcome);
    void account.listSavedHandles().then(setHandles);
  }, [session, hydrated]);

  const signOut = async () => {
    await account.signOut();
    await refresh();
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl">Account</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in to save products, track orders in this browser, and unlock your
          welcome discount. Cross-device sync requires a backend — this build is
          a working UI prototype with local storage only.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link href="/account/register">Create account</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/account/sign-in">Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  const savedProducts = handles
    .map((h) => getProductByHandle(h))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Hi, {session.displayName}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{session.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Saved products:{" "}
            {session.syncPreference === "device"
              ? "This device (local storage)"
              : session.syncPreference === "account"
                ? "Account bucket (local demo)"
                : "Choose a save location (dialog)"}
          </p>
        </div>
        <Button type="button" variant="outline" className="rounded-full" onClick={() => void signOut()}>
          Sign out
        </Button>
      </div>

      {welcome ? (
        <div className="mt-8 rounded-2xl border border-primary/30 bg-card/50 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Welcome gift
          </p>
          <p className="mt-2 font-display text-2xl">10% off once</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Use at checkout (separate from the email list offer):{" "}
            <span className="font-mono text-foreground">{ACCOUNT_WELCOME_PROMO_CODE}</span>
          </p>
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/account/orders">Orders</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/shop">Shop</Link>
        </Button>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Saved products</h2>
        {savedProducts.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Tap the heart on a product card or product page when you&apos;re signed
            in and have completed the save-location step.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {savedProducts.map((p) =>
              p ? <ProductCard key={p.handle} product={p} /> : null,
            )}
          </div>
        )}
      </section>
    </div>
  );
}
