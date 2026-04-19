"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { collections } from "@/lib/data/collections";
import { getCatalog } from "@/lib/data/catalog";
import { isPrimaryCategoryHandle, shopCategories } from "@/lib/data/categories";
import type { ProductGender, ScentFamilyTag } from "@/types/catalog";
import { filterProducts, type ShopFilters } from "@/lib/data/filters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SCENT_FAMILIES: { value: ScentFamilyTag; label: string }[] = [
  { value: "fresh", label: "Fresh" },
  { value: "woody", label: "Woody" },
  { value: "sweet", label: "Sweet" },
  { value: "floral", label: "Floral" },
  { value: "luxury", label: "Luxury" },
];

const GENDERS: { value: ProductGender; label: string }[] = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
];

function parseFilters(searchParams: URLSearchParams): ShopFilters {
  const mood = searchParams.get("mood");
  const note = searchParams.get("note");
  const collection = searchParams.get("collection");
  const q = searchParams.get("q");
  const sort = (searchParams.get("sort") as ShopFilters["sort"]) || "featured";
  const vibe = searchParams.get("vibe");
  const budget = searchParams.get("budget");
  const occasion = searchParams.get("occasion");
  const gift = searchParams.get("gift");
  const categoryRaw = searchParams.get("category");
  const category =
    categoryRaw && isPrimaryCategoryHandle(categoryRaw) ? categoryRaw : null;
  const genderRaw = searchParams.get("gender") as ProductGender | null;
  const gender =
    genderRaw === "men" || genderRaw === "women" || genderRaw === "unisex"
      ? genderRaw
      : null;
  const familyRaw = searchParams.get("family") as ScentFamilyTag | null;
  const scentFamily =
    familyRaw === "fresh" ||
    familyRaw === "woody" ||
    familyRaw === "sweet" ||
    familyRaw === "floral" ||
    familyRaw === "luxury"
      ? familyRaw
      : null;
  const curatedRaw = searchParams.get("curated");
  const curated =
    curatedRaw === "new" || curatedRaw === "bestseller" ? curatedRaw : null;
  return {
    mood,
    note,
    category,
    collection,
    q,
    sort: sort ?? "featured",
    vibe,
    budget,
    occasion,
    gift,
    gender,
    scentFamily,
    curated,
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

  const filterSections = (
    <>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Category
        </p>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            className="block w-full text-left text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setParam("category", null)}
          >
            All
          </button>
          {shopCategories.map((c) => (
            <button
              key={c.handle}
              type="button"
              className="block w-full text-left text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setParam("category", c.handle)}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>
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
          Spotlight
        </p>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            className="block w-full text-left text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setParam("curated", null)}
          >
            All products
          </button>
          <button
            type="button"
            className="block w-full text-left text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setParam("curated", "new")}
          >
            New arrivals
          </button>
          <button
            type="button"
            className="block w-full text-left text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setParam("curated", "bestseller")}
          >
            Best sellers
          </button>
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Gender
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground/80">
          Narrows personal fragrance; body & home stay visible.
        </p>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            className="block w-full text-left text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setParam("gender", null)}
          >
            Any
          </button>
          {GENDERS.map((g) => (
            <button
              key={g.value}
              type="button"
              className="block w-full text-left text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setParam("gender", g.value)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Scent family
        </p>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            className="block w-full text-left text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setParam("family", null)}
          >
            Any
          </button>
          {SCENT_FAMILIES.map((f) => (
            <button
              key={f.value}
              type="button"
              className="block w-full text-left text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setParam("family", f.value)}
            >
              {f.label}
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
    </>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 space-y-8">{filterSections}</div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl">Shop</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                {products.length} results
                {filters.category ? (
                  <span className="text-foreground/80">
                    {" "}
                    ·{" "}
                    {shopCategories.find((c) => c.handle === filters.category)
                      ?.title ?? ""}
                  </span>
                ) : null}
              </p>
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
                Clear filters or reset to browse the full ALLURA 7 catalog.
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
          <div className="space-y-8">{filterSections}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
