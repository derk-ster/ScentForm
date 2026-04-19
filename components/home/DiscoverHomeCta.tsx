import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Replaces the in-page scent finder — full flows live on `/discover`. */
export function DiscoverHomeCta() {
  return (
    <section className="border-y border-border/50 bg-card/25">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Find your lane
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Discovery guide</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Three short quizzes for body care, home scent, and colognes — plus a spotlight
            carousel. Same calm ALLURA 7 edit, on its own page.
          </p>
          <Button asChild className="mt-8 rounded-full px-8">
            <Link href="/discover">Open discovery guide</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
