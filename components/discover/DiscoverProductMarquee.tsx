"use client";

import type { Product } from "@/types/catalog";
import { ProductCard } from "@/components/product/ProductCard";

type Props = {
  products: Product[];
  title?: string;
  subtitle?: string;
};

function uniqueByHandle(products: Product[], max: number): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of products) {
    if (seen.has(p.handle)) continue;
    seen.add(p.handle);
    out.push(p);
    if (out.length >= max) break;
  }
  return out;
}

/** Horizontal loop (same motion pattern as `TrustBar`) for product cards. */
export function DiscoverProductMarquee({
  products,
  title = "Spotlight picks",
  subtitle = "Best sellers and new arrivals — scrolls slowly like the trust strip on the home page.",
}: Props) {
  const base = uniqueByHandle(products, 10);
  if (base.length === 0) return null;
  const segment = [...base, ...base, ...base];

  return (
    <section className="border-y border-border/50 bg-card/25 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div
        className="trust-marquee relative mt-6 w-full overflow-hidden"
        aria-label="Spotlight products carousel"
      >
        <div className="trust-marquee-inner flex w-max items-stretch">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-stretch gap-5 px-4 sm:gap-6 sm:px-6"
              aria-hidden={dup === 1 || undefined}
            >
              {segment.map((p, idx) => (
                <div
                  key={`${dup}-${p.handle}-${idx}`}
                  className="w-[min(88vw,260px)] shrink-0 sm:w-[280px]"
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
