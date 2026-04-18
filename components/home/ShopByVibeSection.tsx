"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";
import { cn } from "@/lib/utils/cn";

const vibes = [
  {
    id: "fresh-clean",
    title: "Fresh & clean",
    description: "Crisp, easy-to-wear scents made for daily use.",
    accent: "border-teal-500/20 bg-gradient-to-br from-teal-950/30 to-card/80",
  },
  {
    id: "sweet-warm",
    title: "Sweet & warm",
    description: "Smooth, inviting fragrances with sweeter notes.",
    accent: "border-amber-500/20 bg-gradient-to-br from-amber-950/25 to-card/80",
  },
  {
    id: "dark-mysterious",
    title: "Dark & mysterious",
    description: "Deeper scents with a stronger evening feel.",
    accent: "border-violet-500/15 bg-gradient-to-br from-violet-950/35 to-card/80",
  },
  {
    id: "luxury-feel",
    title: "Luxury feel",
    description: "Polished scents that feel expensive and refined.",
    accent: "border-primary/25 bg-gradient-to-br from-primary/10 to-card/80",
  },
  {
    id: "date-night",
    title: "Date night",
    description: "Confident fragrances made for nights out.",
    accent: "border-rose-500/15 bg-gradient-to-br from-rose-950/25 to-card/80",
  },
  {
    id: "everyday-wear",
    title: "Everyday wear",
    description: "Safe, versatile picks that work anywhere.",
    accent: "border-border/80 bg-gradient-to-br from-muted/30 to-card/80",
  },
] as const;

export function ShopByVibeSection() {
  return (
    <section className="border-y border-border/50 bg-card/15 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Start with a mood
          </p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl">Shop by vibe</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Each card opens the catalog filtered to that feeling — quick to scan, easy
            to refine on the shop page.
          </p>
        </Reveal>
        <motion.div
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {vibes.map((v) => (
            <motion.div key={v.id} variants={fadeUp}>
              <Link
                href={`/shop?vibe=${v.id}#shop-catalog`}
                className={cn(
                  "flex h-full min-h-[140px] flex-col rounded-2xl border p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20",
                  v.accent,
                )}
              >
                <span className="font-display text-xl tracking-tight">{v.title}</span>
                <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </span>
                <span className="mt-auto pt-4 text-[11px] font-medium uppercase tracking-wide text-primary">
                  Shop this vibe →
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
