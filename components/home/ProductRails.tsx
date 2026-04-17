"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { getBestSellers, getNewArrivals } from "@/lib/data/catalog";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";
import { Reveal } from "@/components/ui/Reveal";

export function ProductRails() {
  const best = getBestSellers().slice(0, 4);
  const newest = getNewArrivals().slice(0, 4);

  return (
    <section className="mx-auto max-w-6xl space-y-12 px-4 py-14 sm:px-6 lg:px-8">
      <div>
        <Reveal className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl sm:text-3xl">Best sellers</h2>
          <Link
            href="/best-sellers"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            All
          </Link>
        </Reveal>
        <motion.div
          className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {best.map((p) => (
            <motion.div key={p.handle} variants={fadeUp}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div>
        <Reveal className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl sm:text-3xl">New</h2>
          <Link
            href="/new-arrivals"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            All
          </Link>
        </Reveal>
        <motion.div
          className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {newest.map((p) => (
            <motion.div key={`${p.handle}-new`} variants={fadeUp}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
