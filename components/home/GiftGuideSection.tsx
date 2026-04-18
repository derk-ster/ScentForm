"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";

const cards = [
  {
    id: "safe-blind-buys",
    title: "Safe blind buys",
    description: "Fresh, easy profiles that tend to land well as gifts.",
    href: "/shop?gift=safe-blind-buys#shop-catalog",
  },
  {
    id: "under-40",
    title: "Under $40 gifts",
    description: "Thoughtful bottles without overspending.",
    href: "/shop?gift=under-40#shop-catalog",
  },
  {
    id: "fresh-scents",
    title: "Fresh scents",
    description: "Clean openings that feel universally wearable.",
    href: "/shop?gift=fresh-scents#shop-catalog",
  },
  {
    id: "sweet-scents",
    title: "Sweet scents",
    description: "For giftees who love cozy gourmands and warmth.",
    href: "/shop?gift=sweet-scents#shop-catalog",
  },
  {
    id: "luxury",
    title: "Luxury picks",
    description: "When you want the unboxing to feel elevated.",
    href: "/shop?gift=luxury#shop-catalog",
  },
] as const;

export function GiftGuideSection() {
  return (
    <section className="border-y border-border/50 bg-card/15 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-2xl sm:text-3xl">Buying for someone else?</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Short paths for common gifting situations — no fragrance expertise required.
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
                className="flex h-full flex-col rounded-2xl border border-border/60 bg-background/30 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/35"
              >
                <span className="font-display text-lg">{c.title}</span>
                <span className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {c.description}
                </span>
                <span className="mt-4 text-[11px] font-medium uppercase tracking-wide text-primary">
                  Browse →
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
