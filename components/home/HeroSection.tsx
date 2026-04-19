"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion/variants";

export function HeroSection() {
  return (
    <section className="relative -mt-16 overflow-hidden pb-16 pt-24 sm:pb-20 sm:pt-28">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-xl space-y-6"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <div className="inline-flex rounded-full border border-border/80 bg-card/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            ALLURA 7 — luxury fragrance lifestyle
          </div>
          <div>
            <h1 className="font-display text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-[3.25rem]">
              Modern luxury for skin, space, and air.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              A full premium catalog — perfumes, body, home, incense, diffusers, and
              oils — with clear pricing, elegant discovery, and a calm checkout path.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link href="/categories/perfumes-colognes">Personal scent</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-6">
              <Link href="/categories/home">Home scent</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="rounded-full text-muted-foreground">
              <Link href="/#scent-finder">Discovery guide</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
