"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";

const occasions = [
  {
    id: "school-work",
    label: "School / work",
    hint: "Polished, low-drama presence",
  },
  {
    id: "casual-everyday",
    label: "Casual everyday",
    hint: "Easy signatures",
  },
  {
    id: "date-night",
    label: "Date night",
    hint: "Closer range, more character",
  },
  {
    id: "party",
    label: "Party",
    hint: "More trail, more energy",
  },
  {
    id: "gift",
    label: "Gift",
    hint: "Crowd-pleasing & wrap-ready",
  },
  {
    id: "vacation",
    label: "Vacation",
    hint: "Heat-friendly & breezy",
  },
  {
    id: "signature-scent",
    label: "Signature scent",
    hint: "Wear-it-everywhere anchors",
  },
] as const;

export function OccasionPickerSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <h2 className="font-display text-2xl sm:text-3xl">
          What are you wearing it for?
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Pick the moment — we&apos;ll narrow the catalog to fragrances tagged for that
          context.
        </p>
      </Reveal>
      <motion.div
        className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {occasions.map((o) => (
          <motion.div key={o.id} variants={fadeUp}>
            <Link
              href={`/shop?occasion=${o.id}#shop-catalog`}
              className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/35 px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card/60"
            >
              <span className="font-display text-lg">{o.label}</span>
              <span className="mt-1 text-xs text-muted-foreground">{o.hint}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
