"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product/ProductCard";
import { searchCatalog } from "@/lib/data/catalog";
import { collections } from "@/lib/data/collections";

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initial);

  useEffect(() => {
    setQ(initial);
  }, [initial]);

  const products = useMemo(() => searchCatalog(q).slice(0, 24), [q]);

  const collectionMatches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return collections.slice(0, 8);
    return collections.filter((c) => c.title.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl">Search</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Keyboard-first preview of catalog matches.
      </p>
      <div className="mt-6 max-w-xl">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search fragrances, notes, moods…"
          aria-label="Search query"
        />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Products
          </h2>
          {products.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No matches — try a shorter query.
            </p>
          ) : (
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {products.map((p) => (
                <ProductCard key={p.handle} product={p} />
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Collections
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {collectionMatches.map((c) => (
              <Link
                key={c.handle}
                href={`/collections/${c.handle}`}
                className="rounded-full border border-border/70 bg-card/40 px-3 py-1 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
