import { getCatalog } from "@/lib/data/catalog";

/** Stable slug for URL `ptype=` — matches `product.productTypeLabel`. */
export function slugifyProductTypeLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type ProductTypeFilterOption = {
  slug: string;
  label: string;
  count: number;
};

/** Distinct product types in the catalog for shop filters (sorted by label). */
export function getCatalogProductTypeFilterOptions(): ProductTypeFilterOption[] {
  const map = new Map<string, { label: string; count: number }>();
  for (const p of getCatalog()) {
    const label = p.productTypeLabel.trim();
    if (!label) continue;
    const slug = slugifyProductTypeLabel(label);
    const row = map.get(slug);
    if (row) row.count += 1;
    else map.set(slug, { label, count: 1 });
  }
  return Array.from(map.entries())
    .map(([slug, { label, count }]) => ({ slug, label, count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function validProductTypeSlugSet(): Set<string> {
  return new Set(getCatalogProductTypeFilterOptions().map((o) => o.slug));
}
