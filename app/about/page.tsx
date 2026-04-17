import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "What Scentform stands for — materials, clarity, and wearability.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Brand
        </p>
        <h1 className="mt-2 font-display text-4xl">Built for the way people wear scent now</h1>
      </Reveal>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <Reveal delay={0.05}>
          <p>
            Scentform is a modern fragrance house focused on clarity: what is in
            the bottle, how it performs on skin and fabric, and which concentration
            fits your day. We would rather under-promise and over-deliver than
            decorate a label with vague mystique.
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
