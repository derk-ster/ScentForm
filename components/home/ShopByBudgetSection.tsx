"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";

const cards = [
  {
    id: "under-20",
    title: "Under $20",
    description: "Entry sizes and smart picks to try without commitment.",
    href: "/shop?budget=under-20#shop-catalog",
  },
  {
    id: "20-40",
    title: "$20 – $40",
    description: "The sweet spot for everyday bottles and gifts.",
    href: "/shop?budget=20-40#shop-catalog",
  },
  {
    id: "40-60",
    title: "$40 – $60",
    description: "Core collection pricing with more presence and finish.",
    href: "/shop?budget=40-60#shop-catalog",
  },
  {
    id: "premium-picks",
    title: "Premium picks",
    description: "Heavier concentrations and statement silhouettes.",
    href: "/shop?budget=premium-picks#shop-catalog",
  },
  {
    id: "best-value",
    title: "Best value",
    description: "Crowd favorites that punch above their price.",
    href: "/shop?budget=best-value#shop-catalog",
  },
] as const;

export function ShopByBudgetSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Shop smarter
        </p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">Shop by budget</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Choose a lane first — we&apos;ll show fragrances that fit, without digging
          through filters.
        </p>
      </Reveal>
      <motion.div
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {cards.map((c) => (
          <motion.div key={c.id} variants={fadeUp}>
            <Link
              href={c.href}
              className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/40 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/70"
            >
              <span className="font-display text-lg">{c.title}</span>
              <span className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {c.description}
              </span>
              <span className="mt-4 text-[11px] font-medium uppercase tracking-wide text-primary">
                View matches →
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
