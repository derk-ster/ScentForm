/**
 * Per-product shopping UX: badges, scent meters, vibe/budget/occasion tags.
 * Catalog `profile` powers fallbacks when a handle is not mapped here.
 */
import type { Product } from "@/types/catalog";
import type { ProductUxMeta, ShoppingBadgeId } from "@/types/shop-ux";

export type { ShoppingBadgeId, ProductUxMeta, ScentMeterValues } from "@/types/shop-ux";

/** Optional overrides — most ALLURA 7 products use `fallbackUx` from catalog profiles. */
export const productUxByHandle: Record<string, ProductUxMeta> = {};

function clampMeter(n: number): number {
  return Math.min(5, Math.max(1, Math.round(n)));
}

function fallbackUx(product: Product): ProductUxMeta {
  const p = product.profile;
  return {
    badges: [],
    meters: {
      freshness: clampMeter(p.freshness),
      sweetness: clampMeter(p.sweetness),
      warmth: clampMeter(p.warmth),
      projection: clampMeter(p.intensity),
      longevity: clampMeter((p.intensity + p.warmth) / 2),
    },
    vibes: [],
    occasions: [],
    budgetBands: [],
    bestFor:
      product.tagline ??
      product.subtitle ??
      product.description.slice(0, 120) +
        (product.description.length > 120 ? "…" : ""),
  };
}

export function getProductUx(product: Product): ProductUxMeta {
  const row = productUxByHandle[product.handle];
  if (row) return row;
  return fallbackUx(product);
}

export function minVariantPriceCents(product: Product): number {
  return Math.min(...product.variants.map((v) => v.priceCents));
}

export function productMatchesBudgetBand(
  product: Product,
  band: string,
): boolean {
  const ux = getProductUx(product);
  const min = minVariantPriceCents(product);
  const d = min / 100;

  if (ux.budgetBands.includes(band)) return true;

  if (band === "under-20") return d < 20;
  if (band === "20-40") return d >= 20 && d < 40;
  if (band === "40-60") return d >= 40 && d <= 60;
  if (band === "premium-picks") return d > 60 || Boolean(product.isSignature);
  if (band === "best-value")
    return ux.budgetBands.includes("best-value") || Boolean(product.isBestSeller);

  return false;
}

export function productMatchesVibe(product: Product, vibe: string): boolean {
  return getProductUx(product).vibes.includes(vibe);
}

export function productMatchesOccasion(product: Product, occasion: string): boolean {
  return getProductUx(product).occasions.includes(occasion);
}

export function productMatchesGiftGuide(product: Product, gift: string): boolean {
  const ux = getProductUx(product);
  const min = minVariantPriceCents(product);
  const hay = [
    product.title,
    product.description,
    ...ux.badges,
    ...ux.vibes,
    product.primaryCategory,
  ]
    .join(" ")
    .toLowerCase();

  switch (gift) {
    case "safe-blind-buys":
      return (
        product.primaryCategory === "gift-sets" ||
        Boolean(product.isBestSeller) ||
        hay.includes("clean")
      );
    case "under-40":
      return min < 4000;
    case "fresh-scents":
      return Boolean(product.scentFamilies?.includes("fresh"));
    case "sweet-scents":
      return Boolean(product.scentFamilies?.includes("sweet"));
    case "luxury":
      return Boolean(product.scentFamilies?.includes("luxury")) || min >= 6000;
    default:
      return false;
  }
}

export function pickCardBadges(product: Product, max = 4): ShoppingBadgeId[] {
  const ux = getProductUx(product);
  const list: ShoppingBadgeId[] = [...ux.badges];
  if (product.isBestSeller && !list.includes("best-seller")) {
    list.unshift("best-seller");
  }
  if (product.isSignature && !list.includes("luxury-feel")) {
    list.push("luxury-feel");
  }
  if (product.limitedEdition && !list.includes("date-night")) {
    list.push("date-night");
  }
  return list.slice(0, max);
}

export function quizExplainMatch(
  product: Product,
  answers: {
    vibe: string;
    bold: string;
    budget: string;
    occasion: string;
    season: string;
  },
): string {
  const ux = getProductUx(product);
  const bits: string[] = [];
  if (answers.vibe === "clean" && ux.meters.freshness >= 4)
    bits.push("fresh profile");
  if (answers.vibe === "warm" && ux.meters.warmth >= 4)
    bits.push("warmth in the dry-down");
  if (answers.vibe === "gourmand" && ux.meters.sweetness >= 4)
    bits.push("sweeter side of the catalog");
  if (answers.vibe === "spiced" && ux.meters.warmth >= 4)
    bits.push("depth for spiced moods");
  if (answers.bold === "subtle" && ux.meters.projection <= 3)
    bits.push("stays closer to the skin");
  if (answers.bold === "statement" && ux.meters.projection >= 4)
    bits.push("more presence in the room");
  if (answers.budget === "value" && minVariantPriceCents(product) < 4000)
    bits.push("fits a value budget");
  if (answers.budget === "splurge" && minVariantPriceCents(product) >= 5500)
    bits.push("room for a splurge-tier pick");
  if (answers.occasion === "evening" && product.profile.intensity >= 4)
    bits.push("evening-ready character");
  if (answers.season === "warm" && ux.meters.freshness >= 4)
    bits.push("heat-friendly lift");
  if (bits.length === 0) return ux.bestFor;
  return `Matched for ${bits.slice(0, 3).join(", ")}.`;
}
