"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  concentrations,
  getConcentrationByHandle,
} from "@/lib/data/concentrations";
import { collections } from "@/lib/data/collections";
import { getCatalog } from "@/lib/data/catalog";
import type { ConcentrationHandle } from "@/types/catalog";
import { filterProducts, type ShopFilters } from "@/lib/data/filters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function parseFilters(searchParams: URLSearchParams): ShopFilters {
  const mood = searchParams.get("mood");
  const note = searchParams.get("note");
  const concentration = searchParams.get("concentration") as
    | ConcentrationHandle
    | null;
  const collection = searchParams.get("collection");
  const q = searchParams.get("q");
  const sort = (searchParams.get("sort") as ShopFilters["sort"]) || "featured";
  const vibe = searchParams.get("vibe");
  const budget = searchParams.get("budget");
  const occasion = searchParams.get("occasion");
  const gift = searchParams.get("gift");
  return {
    mood,
    note,
    concentration: concentration && getConcentrationByHandle(concentration)
      ? concentration
      : null,
    collection,
    q,
    sort: sort ?? "featured",
    vibe,
    budget,
    occasion,
    gift,
  };
}

export function ShopBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(
    () => parseFilters(searchParams),
    [searchParams],
  );

  const products = useMemo(() => {
    return filterProducts(getCatalog(), filters);
  }, [filters]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Collection
              </p>
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  className="block w-full text-left text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setParam("collection", null)}
                >
                  All
                </button>
                {collections.map((c) => (
                  <button
                    key={c.handle}
                    type="button"
                    className="block w-full text-left text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setParam("collection", c.handle)}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Concentration
              </p>
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  className="block w-full text-left text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setParam("concentration", null)}
                >
                  Any
                </button>
                {concentrations.map((c) => (
                  <button
                    key={c.handle}
                    type="button"
                    className="block w-full text-left text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setParam("concentration", c.handle)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
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
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl">Shop</h1>
              <p className="mt-1 text-xs text-muted-foreground">{products.length} results</p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {products.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-border/70 bg-card/30 p-10 text-center">
              <p className="font-display text-2xl">Nothing matches yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Clear filters, try a different vibe or budget from the homepage, or reset
                to browse everything.
              </p>
              <Button
                type="button"
                className="mt-6"
                onClick={() => router.push(pathname)}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div
              id="shop-catalog"
              className="mt-8 scroll-mt-28 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {products.map((p) => (
                <ProductCard key={p.handle} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Collection
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setParam("collection", null);
                    setMobileFiltersOpen(false);
                  }}
                >
                  All
                </Button>
                {collections.map((c) => (
                  <Button
                    key={c.handle}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setParam("collection", c.handle);
                      setMobileFiltersOpen(false);
                    }}
                  >
                    {c.title}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Concentration
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setParam("concentration", null);
                    setMobileFiltersOpen(false);
                  }}
                >
                  Any
                </Button>
                {concentrations.map((c) => (
                  <Button
                    key={c.handle}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setParam("concentration", c.handle);
                      setMobileFiltersOpen(false);
                    }}
                  >
                    {c.shortLabel}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
