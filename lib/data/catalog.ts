import type {
  ConcentrationHandle,
  PrimaryCategoryHandle,
  Product,
  ProductVariant,
  ReviewSummary,
} from "@/types/catalog";
import { ALLURA_PRODUCTS } from "@/lib/data/allura-products";

let cached: Product[] | null = null;

export function buildCatalog(): Product[] {
  return [...ALLURA_PRODUCTS];
}

export function getCatalog(): Product[] {
  if (!cached) cached = buildCatalog();
  return cached;
}

export function getProductByHandle(handle: string): Product | undefined {
  return getCatalog().find((p) => p.handle === handle);
}

export function getProductsByCollection(handle: string): Product[] {
  return getCatalog().filter((p) => p.collectionHandle === handle);
}

export function getSkuCountForCollection(handle: string): number {
  return getProductsByCollection(handle).reduce(
    (acc, p) => acc + p.variants.length,
    0,
  );
}

/** Concentration guide — personal fragrances are offered as EDP in this catalog. */
export function getProductsByConcentration(
  concentration: ConcentrationHandle,
): Product[] {
  const fragrances = getCatalog().filter((p) => p.listingKind === "fragrance");
  if (concentration === "edp") {
    return fragrances.filter((p) =>
      p.variants.some((v) => v.concentration === "edp"),
    );
  }
  return [];
}

export function getProductsByPrimaryCategory(
  slug: PrimaryCategoryHandle,
): Product[] {
  return getCatalog().filter((p) => p.primaryCategory === slug);
}

const HOME_PRIMARY: PrimaryCategoryHandle[] = [
  "home",
  "incense",
  "diffuser-machines",
  "diffuser-oils",
];

export function getProductsForHomeScent(): Product[] {
  return getCatalog().filter((p) => HOME_PRIMARY.includes(p.primaryCategory));
}

export function getProductsForPersonalScent(): Product[] {
  return getCatalog().filter(
    (p) =>
      p.primaryCategory === "perfumes-colognes" ||
      p.primaryCategory === "body",
  );
}

export function getGiftWorthyProducts(): Product[] {
  return getCatalog().filter((p) => p.giftable);
}

export function getSignatureFragrances(): Product[] {
  const cat = getCatalog();
  const sig = cat.filter(
    (p) =>
      p.primaryCategory === "perfumes-colognes" &&
      (p.isSignature || p.featured),
  );
  if (sig.length >= 4) return sig.slice(0, 8);
  const rest = cat.filter(
    (p) => p.primaryCategory === "perfumes-colognes" && !sig.includes(p),
  );
  return [...sig, ...rest].slice(0, 8);
}

export function getHomeScentEssentials(): Product[] {
  const order = [
    "midnight-lounge-candle",
    "cashmere-nights-candle",
    "allura-white-tea-reed-diffuser",
    "diffuser-oil-hotel-lobby",
    "vanilla-sand-room-spray",
    "ocean-breeze-candle",
    "diffuser-oil-fresh-laundry",
    "sandal-temple-sticks",
  ];
  const cat = getCatalog();
  return order
    .map((h) => cat.find((p) => p.handle === h))
    .filter(Boolean) as Product[];
}

export function getGiftSetRails(): Product[] {
  return getCatalog().filter((p) => p.primaryCategory === "gift-sets");
}

export function getStarterPicks(): Product[] {
  const cat = getCatalog();
  const order = [
    "midnight-oud",
    "velvet-bloom",
    "coastal-bleu",
    "diffuser-oil-hotel-lobby",
    "allura-smart-diffuser-pro",
    "midnight-lounge-candle",
    "gift-signature-fragrance-trio",
  ];
  return order
    .map((h) => cat.find((p) => p.handle === h))
    .filter(Boolean) as Product[];
}

export function getFeaturedProducts(): Product[] {
  const cat = getCatalog();
  return cat.filter((p) => p.featured || p.isSignature).slice(0, 8);
}

export function getBestSellers(): Product[] {
  const cat = getCatalog();
  const tagged = cat.filter((p) => p.isBestSeller);
  if (tagged.length >= 8) return tagged.slice(0, 12);
  const rest = cat.filter((p) => !p.isBestSeller);
  return [...tagged, ...rest].slice(0, 12);
}

export function getNewArrivals(): Product[] {
  const cat = getCatalog();
  const fresh = cat.filter((p) => p.isNew);
  const rest = cat.filter((p) => !p.isNew);
  return [...fresh, ...rest].slice(0, 12);
}

export function searchCatalog(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getCatalog().filter((p) => {
    const blob = [
      p.title,
      p.collectionTitle,
      p.categoryTitle,
      p.productTypeLabel,
      p.primaryCategory,
      p.brand,
      p.description,
      p.gender,
      ...(p.scentFamilies ?? []),
      ...p.profile.mood,
      ...p.notes.top,
      ...p.notes.heart,
      ...p.notes.base,
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(q);
  });
}

export function getDefaultVariant(product: Product): ProductVariant {
  const preferred =
    product.variants.find((v) => v.concentration === "edp" && v.sizeMl === 50) ??
    product.variants[0];
  if (!preferred) {
    throw new Error(`getDefaultVariant: product "${product.handle}" has no variants`);
  }
  return preferred;
}

function hashNumber(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getReviewSummary(handle: string): ReviewSummary {
  const h = hashNumber(handle);
  const average = 4.5 + (h % 50) / 100;
  const count = 80 + (h % 420);
  return { average, count, verified: true };
}
