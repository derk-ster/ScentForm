"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion/variants";
import { getProductByHandle } from "@/lib/data/catalog";

export function HeroSection() {
  const latest =
    getProductByHandle("j-mystery") ?? getProductByHandle("valencia-cashmere");
  if (!latest) return null;
  const heroImage = latest.images[0];
  const blurb = latest.tagline ?? latest.subtitle ?? "";

  return (
    <section className="relative -mt-16 overflow-hidden pb-14 pt-24 sm:pb-16 sm:pt-28">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/40" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-end lg:px-8">
        <motion.div
          className="max-w-lg space-y-5"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <div className="inline-flex rounded-full border border-border/80 bg-card/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Latest
          </div>
          <div>
            <h1 className="font-display text-4xl leading-[1.05] text-balance sm:text-5xl">
              {latest.title}
            </h1>
            {blurb ? (
              <p className="mt-3 max-w-md text-sm text-muted-foreground">{blurb}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href={`/products/${latest.handle}`}>Shop</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/collections">Collections</Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          className="relative hidden w-full max-w-xs lg:block"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/60 bg-card/40">
            <Image
              src={latest.hoverImage ?? latest.images[1] ?? latest.images[0]}
              alt=""
              fill
              className="object-cover"
              sizes="320px"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
