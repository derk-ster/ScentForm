"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { concentrations } from "@/lib/data/concentrations";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";
import { Reveal } from "@/components/ui/Reveal";

export function ConcentrationShowcase() {
  return (
    <section className="border-y border-border/50 bg-card/20 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl sm:text-3xl">Concentration</h2>
          <Link
            href="/concentrations"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Guide
          </Link>
        </Reveal>

        <motion.div
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {concentrations.map((c) => (
            <motion.div key={c.handle} variants={fadeUp}>
              <Link
                href={`/concentrations/${c.handle}`}
                className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/40 p-4 transition hover:border-border"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {c.shortLabel}
                </span>
                <span className="mt-2 font-display text-lg">{c.label}</span>
                <span className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {c.description}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
