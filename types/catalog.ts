export type ConcentrationHandle = "edt" | "edp" | "extrait" | "perfume-oil";

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
