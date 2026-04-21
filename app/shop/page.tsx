import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopBrowser } from "@/components/shop/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full ALLURA 7 catalog — filter by category, product type (format), scent, gender, spotlight, and price. Shop lines (thematic edits) live under Shop lines in the nav.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm text-muted-foreground">Loading shop…</div>}>
      <ShopBrowser />
    </Suspense>
  );
}
