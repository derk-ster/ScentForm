import type { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { getNewArrivals } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "New arrivals",
  description: "The newest Scentform releases and restocks.",
};

export default function NewArrivalsPage() {
  const products = getNewArrivals();
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl">New arrivals</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Fresh drops and returning favorites — newest releases first.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.handle} product={p} />
        ))}
      </div>
    </div>
  );
}
