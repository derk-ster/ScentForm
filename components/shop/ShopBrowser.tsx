"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getCatalog } from "@/lib/data/catalog";
import { shopCategories } from "@/lib/data/categories";
import { filterProducts } from "@/lib/data/filters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { groupProductsByTypeLabel } from "@/lib/shop/group-products";
import { parseShopFiltersFromSearchParams } from "@/lib/shop/shop-url-filters";
import { getCatalogProductTypeFilterOptions } from "@/lib/shop/product-type-options";
import { ContextMatchQuiz } from "@/components/shop/ContextMatchQuiz";
import { ShopRefineCheckboxes } from "@/components/shop/ShopRefineCheckboxes";
import { cn } from "@/lib/utils/cn";

export function ShopBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(
    () => parseShopFiltersFromSearchParams(searchParams),
    [searchParams],
  );

  const products = useMemo(() => {
    return filterProducts(getCatalog(), filters);
  }, [filters]);

  const groupedSections = useMemo(() => {
    if (!filters.category) return null;
    return groupProductsByTypeLabel(products, filters.category);
  }, [products, filters.category]);

  const productTypeOptions = useMemo(
    () => getCatalogProductTypeFilterOptions(),
    [],
  );

  const ptypeSelection = useMemo(() => {
    const raw = searchParams.get("ptype");
    return new Set(
      raw
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? [],
    );
  }, [searchParams]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}?${next.toString()}`);
  };

  const togglePtype = useCallback(
    (slug: string) => {
      const next = new URLSearchParams(searchParams.toString());
      const cur = new Set(
        (next.get("ptype") ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      );
      if (cur.has(slug)) cur.delete(slug);
      else cur.add(slug);
      if (cur.size === 0) next.delete("ptype");
      else next.set("ptype", Array.from(cur).sort().join(","));
      router.push(`${pathname}?${next.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const resetAllFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const filterLinkClass = (active: boolean) =>
    cn(
      "block w-full rounded-lg border px-3 py-2 text-left text-sm transition",
      active
        ? "border-primary/55 bg-primary/12 font-medium text-foreground shadow-sm"
        : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-muted/40 hover:text-foreground",
    );

  const hasAnyShopFilters = searchParams.toString().length > 0;

  const filterSections = (
    <>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Category
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          Where it lives in the store — body, home, personal scent, and more.
        </p>
        <div className="mt-3 space-y-1.5">
          <button
            type="button"
            className={filterLinkClass(!filters.category)}
            onClick={() => setParam("category", null)}
          >
            All categories
          </button>
          {shopCategories.map((c) => (
            <button
              key={c.handle}
              type="button"
              className={filterLinkClass(filters.category === c.handle)}
              onClick={() => setParam("category", c.handle)}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Product type
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          Format and concentration — eau de parfum, body lotion, candle, etc.
          (Not the same as{" "}
          <a
            href="/collections"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            shop lines
          </a>
          .)
        </p>
        <div className="mt-3 max-h-64 space-y-1.5 overflow-y-auto pr-1">
          <button
            type="button"
            className={filterLinkClass(ptypeSelection.size === 0)}
            onClick={() => setParam("ptype", null)}
          >
            All types
          </button>
          {productTypeOptions.map((o) => (
            <button
              key={o.slug}
              type="button"
              className={filterLinkClass(ptypeSelection.has(o.slug))}
              onClick={() => togglePtype(o.slug)}
            >
              <span className="block">{o.label}</span>
              <span className="mt-0.5 block text-[10px] font-normal text-muted-foreground">
                {o.count} {o.count === 1 ? "SKU" : "SKUs"}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Spotlight
        </p>
        <div className="mt-3 space-y-1.5">
          <button
            type="button"
            className={filterLinkClass(!filters.curated)}
            onClick={() => setParam("curated", null)}
          >
            All products
          </button>
          <button
            type="button"
            className={filterLinkClass(filters.curated === "new")}
            onClick={() => setParam("curated", "new")}
          >
            New arrivals
          </button>
          <button
            type="button"
            className={filterLinkClass(filters.curated === "bestseller")}
            onClick={() => setParam("curated", "bestseller")}
          >
            Best sellers
          </button>
        </div>
      </div>
      <div>
        <Label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Sort
        </Label>
        <select
          className={cn(
            "mt-3 w-full rounded-md border bg-card/60 px-3 py-2 text-sm transition",
            filters.sort && filters.sort !== "featured"
              ? "border-primary/50 ring-1 ring-primary/20"
              : "border-border/80",
          )}
          value={filters.sort ?? "featured"}
          onChange={(e) => setParam("sort", e.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price, low to high</option>
          <option value="price-desc">Price, high to low</option>
          <option value="alpha">Alphabetically, A–Z</option>
        </select>
      </div>
      <ShopRefineCheckboxes searchParams={searchParams} pathname={pathname} />
    </>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-24 space-y-8">
            {hasAnyShopFilters ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-dashed"
                onClick={resetAllFilters}
              >
                Reset all filters
              </Button>
            ) : null}
            {filterSections}
            {products.length > 0 ? (
              <div className="border-t border-border/50 pt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Stuck browsing?
                </p>
                <div className="mt-3">
                  <ContextMatchQuiz
                    seedProducts={products}
                    scope="shop"
                    category={filters.category}
                    collectionHandle={filters.collection}
                    triggerLabel="Find a fit"
                    className="w-full"
                  />
                </div>
              </div>
            ) : null}
          </div>
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
            <div className="flex flex-wrap items-center gap-2">
              {hasAnyShopFilters ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="hidden border-dashed sm:inline-flex"
                  onClick={resetAllFilters}
                >
                  Reset all
                </Button>
              ) : null}
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
          </div>

          {products.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-border/70 bg-card/30 p-10 text-center">
              <p className="font-display text-2xl">Nothing matches yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Clear filters or reset to browse the full ALLURA 7 catalog.
              </p>
              <Button type="button" className="mt-6" onClick={resetAllFilters}>
                Reset all filters
              </Button>
            </div>
          ) : groupedSections ? (
            <div id="shop-catalog" className="mt-8 scroll-mt-28 space-y-12">
              {groupedSections.map((section) => (
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
          <div className="space-y-8">
            {hasAnyShopFilters ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-dashed"
                onClick={() => {
                  resetAllFilters();
                  setMobileFiltersOpen(false);
                }}
              >
                Reset all filters
              </Button>
            ) : null}
            {filterSections}
            {products.length > 0 ? (
              <div className="border-t border-border/50 pt-4">
                <ContextMatchQuiz
                  seedProducts={products}
                  scope="shop"
                  category={filters.category}
                  collectionHandle={filters.collection}
                  triggerLabel="Find a fit"
                  className="w-full"
                />
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
