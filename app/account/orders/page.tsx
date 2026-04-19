import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Orders",
  description: "View your ALLURA 7 order history.",
};

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl">Orders</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your recent orders will appear here once you&apos;ve placed one.
      </p>
      <div className="mt-8 rounded-3xl border border-dashed border-border/70 bg-card/30 p-10 text-center">
        <p className="text-sm text-muted-foreground">No orders yet.</p>
        <Link
          href="/shop"
          className="mt-4 inline-block text-sm text-primary hover:text-primary/80"
        >
          Browse the catalog →
        </Link>
        <div className="mt-6">
          <Link
            href="/account"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to account
          </Link>
        </div>
      </div>
    </div>
  );
}
