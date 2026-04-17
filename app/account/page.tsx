import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in to manage your Scentform account, orders, and addresses.",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl">Account</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Sign in to view your orders, manage addresses, and track subscription
        preferences.
      </p>
      <div className="mt-8 rounded-3xl border border-border/70 bg-card/40 p-8">
        <p className="text-sm text-muted-foreground">
          What you can do here:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Passwordless email sign-in</li>
          <li>Order history and shipment tracking</li>
          <li>Saved addresses and subscription preferences</li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/account/orders">View orders</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Need help?</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
