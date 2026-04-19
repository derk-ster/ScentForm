import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopBrowser } from "@/components/shop/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full ALLURA 7 catalog — filter by category, collection, scent family, gender, new arrivals, best sellers, and price.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm text-muted-foreground">Loading shop…</div>}>
      <ShopBrowser />
    </Suspense>
  );
}
