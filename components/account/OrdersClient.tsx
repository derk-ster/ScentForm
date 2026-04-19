"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/utils/money";
import * as account from "@/lib/account/account-service";
import type { StoredOrder } from "@/lib/account/types";
import { useAccountStore } from "@/store/account-store";

export function OrdersClient() {
  const session = useAccountStore((s) => s.session);
  const hydrated = useAccountStore((s) => s.hydrated);
  const [rows, setRows] = useState<StoredOrder[]>([]);

  useEffect(() => {
    if (!hydrated) return;
    void (async () => {
      if (session) {
        setRows(await account.listOrders());
      } else {
        setRows(await account.listGuestOrders());
      }
    })();
  }, [session, hydrated]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl">Orders</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {session
          ? "Orders placed while signed in with this email in this browser."
          : "Guest checkout orders stored on this device only."}{" "}
        <Link href="/account" className="text-primary hover:underline">
          Account home
        </Link>
      </p>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-border/70 bg-card/30 p-10 text-center">
          <p className="text-sm text-muted-foreground">No orders yet.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block text-sm text-primary hover:text-primary/80"
          >
            Browse the catalog →
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((o) => (
            <li
              key={o.id}
              className="rounded-2xl border border-border/60 bg-card/40 p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-mono text-sm">{o.id}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(o.placedAt).toLocaleString()}
                </p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{o.email}</p>
              <p className="mt-3 font-display text-xl">
                {formatMoney(o.totalCents, "USD")}
              </p>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                {o.lines.map((l) => (
                  <li key={`${o.id}-${l.variantId}`}>
                    {l.quantity}× {l.title} · {l.sizeLabel}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
