"use client";

import Image from "next/image";
import Link from "next/link";
import type { ConcentrationMeta } from "@/types/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { getProductsByConcentration } from "@/lib/data/catalog";
import { collections } from "@/lib/data/collections";

type Props = {
  concentration: ConcentrationMeta;
};

export function ConcentrationView({ concentration }: Props) {
  const products = getProductsByConcentration(concentration.handle);
  const hero = collections[3]?.heroImage ?? collections[0]!.heroImage;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0">
          <Image
            src={hero}
            alt="Atmospheric fragrance still life"
            fill
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl">{concentration.label}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            {concentration.description}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            <span className="text-foreground/90">Wear</span>{" "}
            {concentration.longevityNote} · <span className="text-foreground/90">Trail</span>{" "}
            {concentration.sillageNote} · <span className="text-foreground/90">Best</span>{" "}
            {concentration.vibe}
          </p>
          <div className="mt-6">
            <Link
              href="/concentrations"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← All
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl">Shop {concentration.shortLabel}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{products.length} lines</p>
          </div>
          <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground">
            Full shop
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
