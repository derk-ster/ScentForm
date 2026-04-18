/**
 * Per-product shopping UX: badges, scent meters, vibe/budget/occasion tags.
 * Edit values here — catalog `profile` is separate and used by quiz/filters as fallback only.
 */
import type { Product } from "@/types/catalog";
import type { ProductUxMeta, ShoppingBadgeId } from "@/types/shop-ux";

export type { ShoppingBadgeId, ProductUxMeta, ScentMeterValues } from "@/types/shop-ux";

const M = {
  aura: {
    badges: ["fresh", "daily-wear", "best-seller", "gift-pick"] as ShoppingBadgeId[],
    meters: { freshness: 4, sweetness: 2, warmth: 3, projection: 3, longevity: 3 },
    vibes: ["fresh-clean", "everyday-wear", "luxury-feel"],
    occasions: ["school-work", "casual-everyday", "signature-scent"],
    budgetBands: ["20-40", "40-60", "best-value"],
    bestFor: "Polished days when you want woods without heaviness.",
  },
  billionaire: {
    badges: ["fresh", "budget-pick", "daily-wear", "best-seller"],
    meters: { freshness: 5, sweetness: 2, warmth: 3, projection: 4, longevity: 3 },
    vibes: ["fresh-clean", "everyday-wear"],
    occasions: ["school-work", "casual-everyday", "gift"],
    budgetBands: ["under-20", "20-40", "best-value"],
    bestFor: "Sharp citrus confidence on a smart budget.",
  },
  "bleu-marine": {
    badges: ["fresh", "long-lasting", "daily-wear", "gift-pick"],
    meters: { freshness: 5, sweetness: 1, warmth: 2, projection: 3, longevity: 4 },
    vibes: ["fresh-clean", "everyday-wear"],
    occasions: ["school-work", "vacation", "casual-everyday"],
    budgetBands: ["20-40", "40-60"],
    bestFor: "Cool, mineral clarity — office-safe and heat-friendly.",
  },
  "desert-rose": {
    badges: ["warm", "sweet", "date-night", "luxury-feel"],
    meters: { freshness: 2, sweetness: 4, warmth: 4, projection: 4, longevity: 4 },
    vibes: ["sweet-warm", "date-night", "luxury-feel"],
    occasions: ["date-night", "party", "gift"],
    budgetBands: ["40-60", "premium-picks"],
    bestFor: "Sunset florals that feel dressed up, not loud.",
  },
  dreamweaver: {
    badges: ["sweet", "warm", "date-night", "gift-pick"],
    meters: { freshness: 2, sweetness: 4, warmth: 4, projection: 3, longevity: 4 },
    vibes: ["sweet-warm", "date-night", "dark-mysterious"],
    occasions: ["date-night", "party", "casual-everyday"],
    budgetBands: ["20-40", "40-60"],
    bestFor: "Soft musk-gourmand for close-distance evenings.",
  },
  "j-mystery": {
    badges: ["warm", "luxury-feel", "date-night", "best-seller"],
    meters: { freshness: 2, sweetness: 3, warmth: 5, projection: 5, longevity: 5 },
    vibes: ["dark-mysterious", "luxury-feel", "date-night"],
    occasions: ["date-night", "party", "signature-scent"],
    budgetBands: ["40-60", "premium-picks"],
    bestFor: "After-dark depth when you want the room to notice.",
  },
  "la-mer": {
    badges: ["fresh", "daily-wear", "gift-pick", "long-lasting"],
    meters: { freshness: 5, sweetness: 1, warmth: 2, projection: 2, longevity: 3 },
    vibes: ["fresh-clean", "everyday-wear"],
    occasions: ["school-work", "vacation", "casual-everyday"],
    budgetBands: ["20-40", "40-60"],
    bestFor: "Sheer coastal minimal — effortless and clean.",
  },
  "lush-milk": {
    badges: ["sweet", "daily-wear", "gift-pick", "fresh"],
    meters: { freshness: 3, sweetness: 3, warmth: 3, projection: 2, longevity: 3 },
    vibes: ["sweet-warm", "everyday-wear", "fresh-clean"],
    occasions: ["casual-everyday", "gift", "school-work"],
    budgetBands: ["20-40", "40-60"],
    bestFor: "Skin-close comfort that reads soft, not sugary.",
  },
  reverie: {
    badges: ["fresh", "daily-wear", "gift-pick", "sweet"],
    meters: { freshness: 3, sweetness: 3, warmth: 3, projection: 3, longevity: 3 },
    vibes: ["fresh-clean", "everyday-wear", "luxury-feel"],
    occasions: ["school-work", "casual-everyday", "gift"],
    budgetBands: ["20-40", "40-60"],
    bestFor: "Powdery florals with a modern, lifted finish.",
  },
  "sweet-marshmallow": {
    badges: ["sweet", "warm", "date-night", "gift-pick"],
    meters: { freshness: 2, sweetness: 5, warmth: 4, projection: 4, longevity: 4 },
    vibes: ["sweet-warm", "date-night"],
    occasions: ["date-night", "party", "gift"],
    budgetBands: ["20-40", "40-60"],
    bestFor: "Playful gourmand warmth for nights out.",
  },
  "tobacco-vanilla": {
    badges: ["warm", "sweet", "date-night", "long-lasting"],
    meters: { freshness: 1, sweetness: 3, warmth: 5, projection: 4, longevity: 5 },
    vibes: ["dark-mysterious", "sweet-warm", "date-night"],
    occasions: ["date-night", "party", "signature-scent"],
    budgetBands: ["40-60", "premium-picks"],
    bestFor: "Resinous evening warmth with serious staying power.",
  },
  "valencia-cashmere": {
    badges: ["fresh", "daily-wear", "best-seller", "gift-pick"],
    meters: { freshness: 4, sweetness: 2, warmth: 3, projection: 3, longevity: 3 },
    vibes: ["fresh-clean", "everyday-wear", "luxury-feel", "date-night"],
    occasions: ["school-work", "casual-everyday", "date-night", "gift"],
    budgetBands: ["20-40", "40-60", "best-value"],
    bestFor: "Radiant citrus-woods that works from desk to dinner.",
  },
  visionary: {
    badges: ["fresh", "luxury-feel", "daily-wear", "long-lasting"],
    meters: { freshness: 4, sweetness: 2, warmth: 3, projection: 3, longevity: 4 },
    vibes: ["fresh-clean", "luxury-feel", "everyday-wear"],
    occasions: ["school-work", "signature-scent", "casual-everyday"],
    budgetBands: ["40-60", "premium-picks"],
    bestFor: "Cool green aromatics — refined and quietly confident.",
  },
} as const satisfies Record<string, ProductUxMeta>;

export const productUxByHandle: Record<string, ProductUxMeta> = M;

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
    bestFor: product.tagline ?? product.subtitle ?? "A versatile pick from the catalog.",
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

/** Budget URL segments → product matches via `budgetBands` or price rules. */
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
  if (band === "premium-picks") return d > 60 || ux.badges.includes("luxury-feel");
  if (band === "best-value")
    return ux.budgetBands.includes("best-value") || ux.badges.includes("budget-pick");

  return false;
}

export function productMatchesVibe(product: Product, vibe: string): boolean {
  return getProductUx(product).vibes.includes(vibe);
}

export function productMatchesOccasion(product: Product, occasion: string): boolean {
  return getProductUx(product).occasions.includes(occasion);
}

/** Gift guide deep links — `?gift=` on /shop */
export function productMatchesGiftGuide(product: Product, gift: string): boolean {
  const ux = getProductUx(product);
  const min = minVariantPriceCents(product);
  const hay = [
    product.title,
    product.description,
    ...ux.badges,
    ...ux.vibes,
  ]
    .join(" ")
    .toLowerCase();

  switch (gift) {
    case "safe-blind-buys":
      return (
        ux.badges.includes("gift-pick") &&
        (ux.badges.includes("fresh") || ux.badges.includes("daily-wear"))
      );
    case "under-40":
      return min < 4000;
    case "fresh-scents":
      return ux.badges.includes("fresh") || ux.vibes.includes("fresh-clean");
    case "sweet-scents":
      return ux.badges.includes("sweet") || ux.vibes.includes("sweet-warm");
    case "luxury":
      return ux.badges.includes("luxury-feel") || min >= 6000;
    default:
      return false;
  }
}

/** Up to `max` badges (target 2–4 in product data). */
export function pickCardBadges(product: Product, max = 4): ShoppingBadgeId[] {
  const ux = getProductUx(product);
  const list = [...ux.badges];
  if (product.featured && !list.includes("best-seller")) {
    list.unshift("best-seller");
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
  if (answers.vibe === "gourmand" && ux.badges.includes("sweet"))
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
  if (answers.occasion === "evening" && ux.badges.includes("date-night"))
    bits.push("evening-ready character");
  if (answers.season === "warm" && ux.meters.freshness >= 4)
    bits.push("heat-friendly lift");
  if (bits.length === 0) return ux.bestFor;
  return `Matched for ${bits.slice(0, 3).join(", ")}.`;
}
