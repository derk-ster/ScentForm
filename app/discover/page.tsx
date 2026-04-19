import type { Metadata } from "next";
import {
  getBestSellers,
  getNewArrivals,
  getProductsByPrimaryCategory,
  getProductsForHomeScent,
} from "@/lib/data/catalog";
import type { Product } from "@/types/catalog";
import { DiscoverPageClient } from "@/components/discover/DiscoverPageClient";

export const metadata: Metadata = {
  title: "Discovery guide",
  description:
    "Match body care, home scent, or colognes in three quick quizzes — ALLURA 7 discovery guide.",
};

function mergeSpotlight(best: Product[], newest: Product[], limit: number): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of [...best, ...newest]) {
    if (seen.has(p.handle)) continue;
    seen.add(p.handle);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

export default function DiscoverPage() {
  const best = getBestSellers();
  const newest = getNewArrivals();
  const spotlight = mergeSpotlight(best, newest, 12);
  const bodyProducts = getProductsByPrimaryCategory("body");
  const homeProducts = getProductsForHomeScent();
  const perfumeProducts = getProductsByPrimaryCategory("perfumes-colognes");

  return (
    <DiscoverPageClient
      spotlightProducts={spotlight}
      bodyProducts={bodyProducts}
      homeProducts={homeProducts}
      perfumeProducts={perfumeProducts}
    />
  );
}
