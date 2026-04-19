import type { Product } from "@/types/catalog";

/**
 * Subtle PDP-only background modifier (paired with `.pdp-shell-bg` in globals).
 * Keeps chroma low — editorial wash, not a new “theme”.
 */
export function getPdpAmbienceModifier(product: Product): string {
  if (product.primaryCategory === "perfumes-colognes") {
    if (product.gender === "women") return "pdp-shell--women";
    if (product.gender === "men") return "pdp-shell--men";
    return "pdp-shell--unisex";
  }
  if (product.primaryCategory === "body") return "pdp-shell--body";
  if (product.primaryCategory === "home") return "pdp-shell--home";
  if (product.primaryCategory === "incense") return "pdp-shell--incense";
  if (
    product.primaryCategory === "diffuser-machines" ||
    product.primaryCategory === "diffuser-oils"
  ) {
    return "pdp-shell--diffuser";
  }
  if (product.primaryCategory === "gift-sets") return "pdp-shell--gifts";
  return "pdp-shell--default";
}
