"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { shopCategories } from "@/lib/data/categories";
import { Reveal } from "@/components/ui/Reveal";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";

export function ShopByCategorySection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal className="max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Shop by category
        </p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">
          Personal scent and scent for the room — the ALLURA 7 system.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Seven pillars — personal scent, body, home, incense, machines, oils,
          and gifts. Each opens a full edit so you scan quickly, then deepen.
        </p>
      </Reveal>

      <motion.div
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {shopCategories.map((cat) => (
          <motion.div key={cat.handle} variants={fadeUp}>
            <Link
              href={`/categories/${cat.handle}`}
              className="group block overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-black/20"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={cat.cardImage}
                  alt=""
                  fill
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${cat.accent} to-transparent`}
                />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="font-display text-xl text-balance text-white drop-shadow-sm sm:text-2xl">
                    {cat.title}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/85 sm:text-sm">
                    {cat.line}
                  </p>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary opacity-0 transition group-hover:opacity-100">
                    View products →
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <Reveal className="mt-14 max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Continue exploring
        </p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">
          Spotlights, signatures, and gift-ready picks
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Fresh drops, proven bestsellers, and tight edits for personal scent, home,
          and gifting.
        </p>
      </Reveal>

      <div className="mt-8 space-y-4">
        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div variants={fadeUp}>
            <Link
              href="/new-arrivals"
              className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card/30 p-6 transition hover:border-primary/40 hover:bg-card/50 sm:min-h-[140px]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                Curated
              </p>
              <div>
                <h3 className="font-display text-xl text-foreground">New arrivals</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Latest drops across fragrance, body, and home.
                </p>
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition group-hover:text-foreground">
                Explore →
              </p>
            </Link>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link
              href="/best-sellers"
              className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card/30 p-6 transition hover:border-primary/40 hover:bg-card/50 sm:min-h-[140px]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                Curated
              </p>
              <div>
                <h3 className="font-display text-xl text-foreground">Best sellers</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  The pieces guests and regulars reach for first.
                </p>
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition group-hover:text-foreground">
                Explore →
              </p>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div variants={fadeUp}>
            <Link
              href="/categories/perfumes-colognes"
              className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card/30 p-6 transition hover:border-primary/40 hover:bg-card/50 sm:min-h-[140px]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                Curated
              </p>
              <div>
                <h3 className="font-display text-xl text-foreground">Signature fragrances</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  House icons and everyday signatures — personal scent.
                </p>
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition group-hover:text-foreground">
                Explore →
              </p>
            </Link>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link
              href="/categories/home"
              className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card/30 p-6 transition hover:border-primary/40 hover:bg-card/50 sm:min-h-[140px]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                Curated
              </p>
              <div>
                <h3 className="font-display text-xl text-foreground">Home scent essentials</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Candles, mists, and diffusion for rooms that linger.
                </p>
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition group-hover:text-foreground">
                Explore →
              </p>
            </Link>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link
              href="/categories/gift-sets"
              className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card/30 p-6 transition hover:border-primary/40 hover:bg-card/50 sm:min-h-[140px]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                Curated
              </p>
              <div>
                <h3 className="font-display text-xl text-foreground">Gift sets</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Bundles ready to gift — fragrance, home, and ritual.
                </p>
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition group-hover:text-foreground">
                Explore →
              </p>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
