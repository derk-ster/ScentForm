import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "What ALLURA 7 stands for — materials, clarity, and luxury wearability.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Brand
        </p>
        <h1 className="mt-2 font-display text-4xl">ALLURA 7 — luxury you can navigate</h1>
      </Reveal>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <Reveal delay={0.05}>
          <p>
            ALLURA 7 is a modern luxury fragrance and home-scent house focused on
            clarity: what is in the bottle or vessel, how it performs on skin and in
            a room, and how each piece fits a real routine. We prefer honest detail
            and confident restraint over vague mystique.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p>
            Collections are designed as complete ideas — not endless flankers.
            Each line is available across concentrations so you can choose
            longevity and projection without changing the story you fell for.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p>
            When you shop here, you should leave with enough information to decide
            confidently — even online, where you cannot smell before you buy.
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.05} className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/shop">Shop the catalog</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Talk to support</Link>
        </Button>
      </Reveal>
    </div>
  );
}
