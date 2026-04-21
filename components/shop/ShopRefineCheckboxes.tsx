"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { ProductGender, ScentFamilyTag } from "@/types/catalog";
import { SHOP_PRICE_BANDS } from "@/lib/shop/shop-url-filters";
import { cn } from "@/lib/utils/cn";

const SCENT_FAMILIES: { value: ScentFamilyTag; label: string }[] = [
  { value: "fresh", label: "Fresh" },
  { value: "woody", label: "Woody" },
  { value: "sweet", label: "Sweet" },
  { value: "floral", label: "Floral" },
  { value: "luxury", label: "Luxury" },
];

const GENDERS: { value: ProductGender; label: string }[] = [
  { value: "men", label: "Men’s / masculine" },
  { value: "women", label: "Women’s / feminine" },
  { value: "unisex", label: "Unisex" },
];

type CsvKey = "genders" | "families" | "prices";

function selectionSet(
  searchParams: URLSearchParams,
  key: CsvKey,
): Set<string> {
  const raw = searchParams.get(key);
  let parts = raw
    ? raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  if (!parts.length && key === "genders") {
    const g = searchParams.get("gender");
    if (g) parts = [g];
  }
  if (!parts.length && key === "families") {
    const f = searchParams.get("family");
    if (f) parts = [f];
  }
  return new Set(parts);
}

function checkboxRowClass(on: boolean) {
  return cn(
    "flex cursor-pointer items-start gap-3 rounded-lg border px-2.5 py-2 text-sm leading-snug transition",
    on
      ? "border-primary/50 bg-primary/10 text-foreground shadow-sm"
      : "border-border/40 bg-transparent text-foreground hover:border-border hover:bg-muted/30",
  );
}

type Props = {
  searchParams: URLSearchParams;
  pathname: string;
};

export function ShopRefineCheckboxes({ searchParams, pathname }: Props) {
  const router = useRouter();

  const pushParams = (next: URLSearchParams) => {
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const toggleCsv = (key: CsvKey, value: string, checked: boolean) => {
    const next = new URLSearchParams(searchParams.toString());
    const cur = selectionSet(searchParams, key);
    if (checked) cur.add(value);
    else cur.delete(value);
    if (key === "genders") next.delete("gender");
    if (key === "families") next.delete("family");
    if (cur.size === 0) next.delete(key);
    else next.set(key, Array.from(cur).sort().join(","));
    pushParams(next);
  };

  const clearRefinements = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("genders");
    next.delete("gender");
    next.delete("families");
    next.delete("family");
    next.delete("prices");
    pushParams(next);
  };

  const gendersSel = selectionSet(searchParams, "genders");
  const familiesSel = selectionSet(searchParams, "families");
  const pricesSel = selectionSet(searchParams, "prices");

  const hasRefine =
    gendersSel.size > 0 || familiesSel.size > 0 || pricesSel.size > 0;

  return (
    <div className="space-y-6 border-t border-border/50 pt-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Find the right item
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Selected rows are highlighted. Within each group we match{" "}
          <span className="text-foreground/80">any</span> choice; groups combine
          to narrow results.
        </p>
        {hasRefine ? (
          <button
            type="button"
            className="mt-3 text-left text-xs font-medium text-primary underline-offset-4 hover:underline"
            onClick={clearRefinements}
          >
            Clear refine-only filters
          </button>
        ) : null}
      </div>

      <div>
        <Label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Price range
        </Label>
        <div className="mt-3 space-y-2">
          {SHOP_PRICE_BANDS.map((b) => {
            const on = pricesSel.has(b.id);
            return (
              <label key={b.id} className={checkboxRowClass(on)}>
                <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-input bg-background">
                  <input
                    type="checkbox"
                    className="peer absolute inset-0 cursor-pointer opacity-0"
                    checked={on}
                    onChange={(e) => toggleCsv("prices", b.id, e.target.checked)}
                  />
                  <Check
                    className={cn(
                      "h-3 w-3 text-primary",
                      on ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden
                  />
                </span>
                <span className="pt-0.5">{b.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <Label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          What it smells like
        </Label>
        <div className="mt-3 space-y-2">
          {SCENT_FAMILIES.map((f) => {
            const on = familiesSel.has(f.value);
            return (
              <label key={f.value} className={checkboxRowClass(on)}>
                <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-input bg-background">
                  <input
                    type="checkbox"
                    className="peer absolute inset-0 cursor-pointer opacity-0"
                    checked={on}
                    onChange={(e) =>
                      toggleCsv("families", f.value, e.target.checked)
                    }
                  />
                  <Check
                    className={cn(
                      "h-3 w-3 text-primary",
                      on ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden
                  />
                </span>
                <span className="pt-0.5">{f.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <Label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Who is it for
        </Label>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          For fragrance SKUs only — body, home, and other categories stay in the
          list when you use this.
        </p>
        <div className="mt-3 space-y-2">
          {GENDERS.map((g) => {
            const on = gendersSel.has(g.value);
            return (
              <label key={g.value} className={checkboxRowClass(on)}>
                <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-input bg-background">
                  <input
                    type="checkbox"
                    className="peer absolute inset-0 cursor-pointer opacity-0"
                    checked={on}
                    onChange={(e) =>
                      toggleCsv("genders", g.value, e.target.checked)
                    }
                  />
                  <Check
                    className={cn(
                      "h-3 w-3 text-primary",
                      on ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden
                  />
                </span>
                <span className="pt-0.5">{g.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
