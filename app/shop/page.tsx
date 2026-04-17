import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopBrowser } from "@/components/shop/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop all fragrances",
  description:
    "Browse the full Scentform catalog with filters for collection, concentration, and more.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-10 text-sm text-muted-foreground">Loading shop…</div>}>
      <ShopBrowser />
    </Suspense>
  );
}
