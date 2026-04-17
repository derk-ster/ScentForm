import type { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { getBestSellers } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Best sellers",
  description: "The Scentform fragrances customers return to most often.",
};

export default function BestSellersPage() {
  const products = getBestSellers();
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl">Best sellers</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        A curated set of lines that consistently perform — great starting points
        if you are new to the house.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.handle} product={p} />
        ))}
      </div>
    </div>
  );
}
