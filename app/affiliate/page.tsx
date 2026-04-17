import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Affiliate program",
  description:
    "Join the Scentform affiliate program — earn commission while sharing fragrances you already love.",
};

export default function AffiliatePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Creators
      </p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">
        Affiliate program — 15% commission
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Share Scentform with your audience and earn on qualifying purchases. We
        handle tracking, assets, and payouts — you focus on the content.
      </p>

      <div className="mt-10 grid gap-6 rounded-3xl border border-border/70 bg-card/40 p-8 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl">What you get</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Clean tracking links and reporting</li>
            <li>Product imagery sized for social</li>
            <li>Commission aligned with published program terms</li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl">Who it fits</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Reviewers, editors, stylists, and short-form creators who already talk
            about scent with nuance — not spammy coupon farms.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/contact">Apply to join</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Ask a question</Link>
        </Button>
      </div>
    </div>
  );
}
