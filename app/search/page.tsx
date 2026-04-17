import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageClient } from "@/components/search/SearchPageClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Scentform catalog.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-sm text-muted-foreground">Loading…</div>}
    >
      <SearchPageClient />
    </Suspense>
  );
}
