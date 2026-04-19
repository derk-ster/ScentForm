import type { PrimaryCategoryHandle, Product } from "@/types/catalog";

export type ProductTypeSection = {
  label: string;
  products: Product[];
};

/** Body pillar — scan order matches client “shelf” story. */
const BODY_TYPE_ORDER: string[] = [
  "Body Wash",
  "Body Lotion",
  "Body Butter",
  "Body Oil",
  "Body Mist",
  "Hand Cream",
  "Deodorant Spray",
];

/** Personal fragrance — editorial order before alphabetical fallback. */
const PERFUME_TYPE_ORDER: string[] = [
  "Women's Perfume",
  "Men's Cologne",
  "Unisex Eau De Parfum",
  "Unisex Perfume",
  "Unisex Niche Scent",
];

function labelRank(
  primary: PrimaryCategoryHandle | undefined,
  label: string,
): number {
  if (primary === "body") {
    const i = BODY_TYPE_ORDER.indexOf(label);
    return i === -1 ? 999 : i;
  }
  if (primary === "perfumes-colognes") {
    const i = PERFUME_TYPE_ORDER.indexOf(label);
    return i === -1 ? 999 : i;
  }
  return 999;
}

/**
 * Groups products by `productTypeLabel` for category / shop / collection grids.
 */
export function groupProductsByTypeLabel(
  products: Product[],
  primaryCategory?: PrimaryCategoryHandle,
): ProductTypeSection[] {
  const map = new Map<string, Product[]>();
  for (const p of products) {
    const label = p.productTypeLabel?.trim() || "Other";
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(p);
  }

  const inferredPrimary =
    primaryCategory ??
    (products.length && products.every((x) => x.primaryCategory === products[0]!.primaryCategory)
      ? products[0]!.primaryCategory
      : undefined);

  const labels = Array.from(map.keys()).sort((a, b) => {
    const da = labelRank(inferredPrimary, a);
    const db = labelRank(inferredPrimary, b);
    if (da !== db) return da - db;
    return a.localeCompare(b);
  });

  return labels.map((label) => ({
    label,
    products: (map.get(label) ?? []).slice().sort((x, y) => x.title.localeCompare(y.title)),
  }));
}
