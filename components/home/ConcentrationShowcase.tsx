"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { concentrations } from "@/lib/data/concentrations";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";
import { Reveal } from "@/components/ui/Reveal";

/** Beginner copy per concentration — edit with product/marketing. */
const beginnerGuideByHandle: Record<string, string> = {
  edt: "Lighter and easy to wear daily — a softer trail that refreshes through the day.",
  edp: "Stronger and longer lasting than EDT — the everyday sweet spot for presence and polish.",
  extrait:
    "The strongest and most premium option — rich, concentrated, and built to linger.",
  "perfume-oil":
    "Compact, close to the skin, and travel-friendly — intimate projection with a refined feel.",
};

export function ConcentrationShowcase() {
  return (
    <section className="border-y border-border/50 bg-card/20 py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">Choosing a concentration</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              A quick primer on strength and wear — each card links to the full guide for that
              type.
            </p>
          </div>
          <Link
            href="/concentrations"
            className="shrink-0 text-sm text-muted-foreground hover:text-foreground"
          >
            All concentrations
          </Link>
        </Reveal>

        <motion.div
          className="mt-8 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {concentrations.map((c) => (
            <motion.div key={c.handle} variants={fadeUp}>
              <Link
                href={`/concentrations/${c.handle}`}
                className="flex flex-col rounded-2xl border border-border/60 bg-card/40 p-4 transition hover:border-primary/35 hover:bg-card/55 sm:p-5"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {c.shortLabel}
                </span>
                <span className="mt-2 font-display text-lg leading-snug">{c.label}</span>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.description}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground/95">
                  {beginnerGuideByHandle[c.handle] ?? ""}
                </p>
                <span className="mt-4 border-t border-border/50 pt-3 text-xs font-medium text-primary">
                  Read full guide →
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
