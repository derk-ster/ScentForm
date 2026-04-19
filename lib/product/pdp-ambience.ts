import type { Product, ScentFamilyTag } from "@/types/catalog";
import { productUxByHandle } from "@/lib/data/product-ux";
import type { PdpSmellTintKey } from "@/types/shop-ux";

const VALID_TINTS = new Set<PdpSmellTintKey>([
  "fresh",
  "floral",
  "woody",
  "sweet",
  "luxury",
  "body",
  "home",
  "incense",
  "diffuser",
  "gifts",
  "neutral",
]);

const FAMILY_TO_TINT: Record<ScentFamilyTag, PdpSmellTintKey> = {
  fresh: "fresh",
  floral: "floral",
  woody: "woody",
  sweet: "sweet",
  luxury: "luxury",
};

/** When several families apply, pick the most characterful wash first. */
const FAMILY_PRIORITY: ScentFamilyTag[] = [
  "luxury",
  "woody",
  "sweet",
  "floral",
  "fresh",
];

function tintFromFamilies(families: ScentFamilyTag[]): PdpSmellTintKey | null {
  for (const f of FAMILY_PRIORITY) {
    if (families.includes(f)) return FAMILY_TO_TINT[f];
  }
  return null;
}

function tintFromCategory(product: Product): PdpSmellTintKey {
  switch (product.primaryCategory) {
    case "body":
      return "body";
    case "home":
      return "home";
    case "incense":
      return "incense";
    case "diffuser-machines":
    case "diffuser-oils":
      return "diffuser";
    case "gift-sets":
      return "gifts";
    default:
      return "neutral";
  }
}

/** Infer a smell wash from profile when `scentFamilies` is empty (fragrance SKUs). */
function tintFromProfile(product: Product): PdpSmellTintKey {
  const { sweetness, freshness, warmth } = product.profile;
  const max = Math.max(sweetness, freshness, warmth);
  if (max < 2.5) return "neutral";
  if (freshness >= max && freshness >= sweetness && freshness >= warmth) return "fresh";
  if (sweetness >= max && sweetness >= freshness && sweetness >= warmth) return "sweet";
  if (warmth >= max) return "woody";
  if (freshness > sweetness && freshness > warmth) return "fresh";
  if (sweetness > warmth) return "sweet";
  return "woody";
}

/**
 * Resolves which smell/category wash to paint behind PDP copy + emoji rain.
 * Uses fixed hues (not theme accent tokens) so the card reads the same for every accent.
 */
export function resolvePdpSmellTintKey(product: Product): PdpSmellTintKey {
  const row = productUxByHandle[product.handle];
  if (row?.pdpSmellTint && VALID_TINTS.has(row.pdpSmellTint)) {
    return row.pdpSmellTint;
  }

  const families = product.scentFamilies;
  if (families?.length) {
    const fromFam = tintFromFamilies(families);
    if (fromFam) return fromFam;
  }

  if (product.listingKind === "lifestyle") {
    return tintFromCategory(product);
  }

  if (product.listingKind === "fragrance") {
    return tintFromProfile(product);
  }

  return tintFromCategory(product);
}

/** Class applied with `pdp-product-box` on the card that contains `PdpEmojiRain`. */
export function getPdpProductBoxTintClass(product: Product): string {
  return `pdp-product-box--${resolvePdpSmellTintKey(product)}`;
}
