"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { Bath, Home, SprayCan } from "lucide-react";
import type { PrimaryCategoryHandle, Product } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { ContextMatchQuiz } from "@/components/shop/ContextMatchQuiz";
import { DiscoverProductMarquee } from "@/components/discover/DiscoverProductMarquee";
import { Allura7Wordmark } from "@/components/brand/Allura7Wordmark";

type Props = {
  spotlightProducts: Product[];
  bodyProducts: Product[];
  homeProducts: Product[];
  perfumeProducts: Product[];
};

function QuizLane({
  title,
  description,
  icon: Icon,
  products,
  category,
  triggerLabel,
}: {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  products: Product[];
  category: PrimaryCategoryHandle | null;
  triggerLabel: string;
}) {
  if (products.length === 0) return null;
  return (
    <div className="rounded-3xl border border-border/60 bg-card/40 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background/50">
          <Icon className="h-5 w-5 text-primary" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-2xl">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          <div className="mt-5">
            <ContextMatchQuiz
              seedProducts={products}
              scope="shop"
              category={category}
              triggerLabel={triggerLabel}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiscoverPageClient({
  spotlightProducts,
  bodyProducts,
  homeProducts,
  perfumeProducts,
}: Props) {
  return (
    <div className="pb-20">
      <header className="border-b border-border/50 bg-card/20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <Allura7Wordmark className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground" />
          </div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Discovery guide</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Three quick match flows for body, home, and colognes & perfumes — each tuned to
            that part of the catalog. Then browse spotlight picks in the carousel below.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/shop">Shop all</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/best-sellers">Best sellers</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/new-arrivals">New arrivals</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <QuizLane
          icon={Bath}
          title="Body care match"
          description="Lotions, washes, mists, and oils — three taps to narrow what fits your ritual."
          products={bodyProducts}
          category="body"
          triggerLabel="Match body care"
        />
        <QuizLane
          icon={Home}
          title="Home & space match"
          description="Candles, room scent, incense, and diffuser oils — find a direction for your rooms."
          products={homeProducts}
          category={null}
          triggerLabel="Match home scent"
        />
        <QuizLane
          icon={SprayCan}
          title="Colognes & perfumes match"
          description="Men’s, women’s, and unisex picks — mood, family, and budget in three steps."
          products={perfumeProducts}
          category="perfumes-colognes"
          triggerLabel="Match fragrance"
        />
      </div>

      <DiscoverProductMarquee products={spotlightProducts} />

      <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          Ready to browse everything?{" "}
          <Link href="/shop" className="text-primary underline-offset-4 hover:underline">
            Open the shop
          </Link>{" "}
          with filters, or jump to{" "}
          <Link href="/best-sellers" className="text-primary underline-offset-4 hover:underline">
            best sellers
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
