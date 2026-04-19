export type ConcentrationHandle = "edt" | "edp" | "extrait" | "perfume-oil";

/** Top-level shop categories — homepage cards and `/categories/[slug]`. */
export type PrimaryCategoryHandle =
  | "home"
  | "body"
  | "perfumes-colognes"
  | "incense"
  | "diffuser-machines"
  | "diffuser-oils"
  | "gift-sets";

/** PDP / shop filters — personal fragrances only when set. */
export type ProductGender = "men" | "women" | "unisex";

/** Merchandising filters — perfumes carry full set; others may omit. */
export type ScentFamilyTag =
  | "fresh"
  | "woody"
  | "sweet"
  | "floral"
  | "luxury";

/** Fragrance PDPs keep concentration + profile; lifestyle SKUs use simpler cards/PDP chrome. */
export type ProductListingKind = "fragrance" | "lifestyle";

export type ConcentrationMeta = {
  handle: ConcentrationHandle;
  label: string;
  shortLabel: string;
  description: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  longevityNote: string;
  sillageNote: string;
  vibe: string;
  typicalOilPercent: string;
  accentColor: string;
};

export type NotePyramid = {
  top: string[];
  heart: string[];
  base: string[];
};

export type FragranceProfile = {
  mood: string[];
  sweetness: number;
  freshness: number;
  warmth: number;
  intensity: number;
  occasions: string[];
};

export type ProductSpecifications = {
  concentrationLabel: string;
  concentrationRange?: string;
  longevity: string;
  sillage: string;
  volume: string;
  weight?: string;
  dimensions?: string;
  packagingMaterials?: string;
  countryOfOrigin?: string;
  containsAlcohol?: boolean;
};

export type ProductClaims = {
  crueltyFree?: boolean;
  phthalateFree?: boolean;
  parabenFree?: boolean;
  dyeFree?: boolean;
  recyclablePackaging?: boolean;
  madeInUSA?: boolean;
};

export type ReviewSummary = {
  average: number;
  count: number;
  verified?: boolean;
};

export type ProductVariant = {
  id: string;
  sku: string;
  concentration: ConcentrationHandle;
  concentrationLabel: string;
  sizeLabel: string;
  sizeMl: number;
  priceCents: number;
  currencyCode: "USD";
  available: boolean;
  imageUrl?: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  subtitle?: string;
  collectionHandle: string;
  collectionTitle: string;
  /** Browse pillar — shown on cards and filters. */
  primaryCategory: PrimaryCategoryHandle;
  /** Short label for product kind (e.g. “Ultrasonic diffuser”, “Eau de Parfum”). */
  productTypeLabel: string;
  /** Mirrors primary category display title for quick scanning. */
  categoryTitle: string;
  listingKind: ProductListingKind;
  /** Optional house or partner brand — omit when it adds noise. */
  brand?: string;
  description: string;
  tagline?: string;
  notes: NotePyramid;
  profile: FragranceProfile;
  specifications: ProductSpecifications;
  claims: ProductClaims;
  variants: ProductVariant[];
  images: string[];
  hoverImage?: string;
  featured?: boolean;
  isNew?: boolean;
  /** Curated high-velocity picks for rails and filters. */
  isBestSeller?: boolean;
  /** House icons — shown on cards when set. */
  isSignature?: boolean;
  limitedEdition?: boolean;
  gender?: ProductGender;
  /** Fresh / woody / sweet / floral / luxury — shop filters. */
  scentFamilies?: ScentFamilyTag[];
  giftable?: boolean;
  hasTravelSizes?: boolean;
  relatedHandles?: string[];
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  moodLine: string;
  heroImage: string;
  thumbnailImage: string;
  accent: string;
};

export type PolicyLink = {
  title: string;
  href: string;
  description?: string;
};
