"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { collections } from "@/lib/data/collections";
import { staggerContainer, fadeUp } from "@/lib/motion/variants";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedCollections() {
  const featured = collections.slice(0, 6);
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal className="flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl sm:text-3xl">Collections</h2>
        <Link
          href="/collections"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          All
        </Link>
      </Reveal>

      <motion.div
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {featured.map((c) => (
          <motion.div key={c.handle} variants={fadeUp}>
            <Link
              href={`/collections/${c.handle}`}
              className="group block overflow-hidden rounded-2xl border border-border/60 bg-card/40"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={c.heroImage}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-display text-xl text-stone-50">{c.title}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
