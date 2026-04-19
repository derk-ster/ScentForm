"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import type { Collection } from "@/types/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getProductsByCollection, getSkuCountForCollection } from "@/lib/data/catalog";
import { filterProducts, type ShopFilters } from "@/lib/data/filters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PrimaryCategoryHandle } from "@/types/catalog";
import { groupProductsByTypeLabel } from "@/lib/shop/group-products";
import { ContextMatchQuiz } from "@/components/shop/ContextMatchQuiz";

type Props = {
  collection: Collection;
};

function parseFilters(searchParams: URLSearchParams): ShopFilters {
  const sort = (searchParams.get("sort") as ShopFilters["sort"]) || "featured";
  return {
    sort: sort ?? "featured",
  };
}

export function CollectionBrowser({ collection }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(
    () => ({ ...parseFilters(searchParams), collection: collection.handle }),
    [searchParams, collection.handle],
  );

  const products = useMemo(() => {
    return filterProducts(getProductsByCollection(collection.handle), filters);
  }, [collection.handle, filters]);

  const skuCount = getSkuCountForCollection(collection.handle);

  const dominantPrimary = useMemo((): PrimaryCategoryHandle | undefined => {
    if (products.length === 0) return undefined;
    const counts = new Map<PrimaryCategoryHandle, number>();
    for (const p of products) {
      counts.set(p.primaryCategory, (counts.get(p.primaryCategory) ?? 0) + 1);
    }
    let best: PrimaryCategoryHandle | undefined;
    let n = 0;
    for (const [k, v] of Array.from(counts.entries())) {
      if (v > n) {
        n = v;
        best = k;
      }
    }
    return best;
  }, [products]);

  const collectionSections = useMemo(
    () => groupProductsByTypeLabel(products, dominantPrimary),
    [products, dominantPrimary],
  );

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const sortControl = (
    <div>
      <Label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Sort
      </Label>
      <select
        className="mt-3 w-full rounded-md border border-border/80 bg-card/60 px-3 py-2 text-sm"
        value={filters.sort ?? "featured"}
        onChange={(e) => setParam("sort", e.target.value)}
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price, low to high</option>
        <option value="price-desc">Price, high to low</option>
        <option value="alpha">Alphabetically, A–Z</option>
      </select>
    </div>
  );

  return (
    <div>
      <div className="relative border-b border-border/60">
        <div className="relative h-[240px] w-full overflow-hidden sm:h-[280px]">
          <Image
            src={collection.heroImage}
            alt={`${collection.title} hero`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl sm:text-4xl">{collection.title}</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              {collection.description}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{skuCount} SKUs</p>
            {products.length > 0 ? (
              <div className="mt-4">
                <ContextMatchQuiz
                  seedProducts={products}
                  scope="collection"
                  collectionHandle={collection.handle}
                  triggerLabel="Find a fit"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-24 space-y-6">{sortControl}</div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{products.length} items</p>
              <Button
                type="button"
                variant="outline"
                className="lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </div>

            {products.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-border/70 bg-card/30 p-10 text-center">
                <p className="font-display text-2xl">No matches</p>
                <Button
                  type="button"
                  className="mt-6"
                  onClick={() => router.push(pathname)}
                >
                  Reset
                </Button>
              </div>
            ) : (
              <div className="mt-8 space-y-12">
                {collectionSections.map((section) => (
                  <section key={section.label}>
                    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/40 pb-3">
                      <h2 className="font-display text-xl tracking-tight sm:text-2xl">
                        {section.label}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {section.products.length} items
                      </p>
                    </div>
                    <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {section.products.map((p) => (
                        <ProductCard key={p.handle} product={p} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sort</DialogTitle>
          </DialogHeader>
          {sortControl}
        </DialogContent>
      </Dialog>
    </div>
  );
}
