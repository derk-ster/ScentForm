import type {
  PrimaryCategoryHandle,
  Product,
  ProductGender,
  ScentFamilyTag,
} from "@/types/catalog";
import {
  productMatchesBudgetBand,
  productMatchesGiftGuide,
  productMatchesOccasion,
  productMatchesVibe,
} from "@/lib/data/product-ux";
import { slugifyProductTypeLabel } from "@/lib/shop/product-type-options";

export type ShopFilters = {
  mood?: string | null;
  note?: string | null;
  category?: PrimaryCategoryHandle | null;
  collection?: string | null;
  q?: string | null;
  sort?: "featured" | "price-asc" | "price-desc" | "alpha";
  vibe?: string | null;
  budget?: string | null;
  occasion?: string | null;
  gift?: string | null;
  /** Legacy single-select URL (`gender=`) */
  gender?: ProductGender | null;
  /** Legacy single-select URL (`family=`) */
  scentFamily?: ScentFamilyTag | null;
  /** Multi-select (`genders=men,women`) */
  genders?: ProductGender[] | null;
  /** Multi-select (`families=fresh,woody`) */
  families?: ScentFamilyTag[] | null;
  /** Multi-select (`prices=under-40,40-80`) */
  priceBands?: string[] | null;
  /** Product format / concentration labels (`ptype=body-lotion,eau-de-parfum`) */
  productTypeSlugs?: string[] | null;
  curated?: "new" | "bestseller" | null;
};

function matchesMood(product: Product, mood: string) {
  const m = mood.toLowerCase();
  const blob = [
    ...product.profile.mood,
    product.description,
    product.title,
  ]
    .join(" ")
    .toLowerCase();
  if (m === "clean") return product.profile.freshness >= 4 || blob.includes("clean");
  if (m === "warm")
    return product.profile.warmth >= 4 || blob.includes("warm");
  if (m === "date")
    return (
      product.profile.intensity >= 3 ||
      blob.includes("night") ||
      blob.includes("evening")
    );
  if (m === "weekend")
    return blob.includes("weekend") || product.profile.freshness >= 3;
  return blob.includes(m);
}

function matchesNote(product: Product, note: string) {
  const n = note.toLowerCase();
  const notes = [...product.notes.top, ...product.notes.heart, ...product.notes.base]
    .join(" ")
    .toLowerCase();
  if (n === "citrus")
    return (
      notes.includes("bergamot") ||
      notes.includes("orange") ||
      notes.includes("grapefruit") ||
      notes.includes("lemon") ||
      notes.includes("citrus")
    );
  if (n === "woods")
    return (
      notes.includes("wood") ||
      notes.includes("cedar") ||
      notes.includes("sandal") ||
      notes.includes("guaiac") ||
      notes.includes("vetiver") ||
      notes.includes("oud")
    );
  if (n === "vanilla")
    return notes.includes("vanilla") || notes.includes("tonka") || notes.includes("resin");
  if (n === "aquatic")
    return (
      notes.includes("marine") ||
      notes.includes("salt") ||
      notes.includes("sea") ||
      product.title.toLowerCase().includes("ocean") ||
      product.title.toLowerCase().includes("coastal")
    );
  return notes.includes(n);
}

function matchesGender(product: Product, gender: ProductGender): boolean {
  if (product.primaryCategory !== "perfumes-colognes") return true;
  const g = product.gender;
  if (!g) return true;
  if (gender === "unisex") return g === "unisex";
  if (gender === "men") return g === "men" || g === "unisex";
  if (gender === "women") return g === "women" || g === "unisex";
  return false;
}

/** Tags used for “smells like” filtering — explicit families or profile inference. */
export function getProductSmellFamilies(product: Product): ScentFamilyTag[] {
  if (product.scentFamilies?.length) return product.scentFamilies;
  const { freshness, sweetness, warmth } = product.profile;
  const tags = new Set<ScentFamilyTag>();
  if (freshness >= 4) tags.add("fresh");
  if (sweetness >= 4) tags.add("sweet");
  if (warmth >= 4) tags.add("woody");
  if (freshness <= 2 && sweetness >= 3 && warmth <= 3) tags.add("floral");
  const min = Math.min(...product.variants.map((v) => v.priceCents));
  if (min >= 6000 || product.isSignature) tags.add("luxury");
  if (!tags.size) {
    const max = Math.max(freshness, sweetness, warmth);
    if (max === freshness) tags.add("fresh");
    else if (max === sweetness) tags.add("sweet");
    else tags.add("woody");
  }
  return Array.from(tags);
}

function matchesScentFamily(product: Product, family: ScentFamilyTag): boolean {
  return getProductSmellFamilies(product).includes(family);
}

function minVariantPriceCents(product: Product): number {
  return Math.min(...product.variants.map((v) => v.priceCents));
}

function matchesPriceBand(product: Product, band: string): boolean {
  const m = minVariantPriceCents(product);
  if (band === "under-40") return m < 4000;
  if (band === "40-80") return m >= 4000 && m < 8000;
  if (band === "80-plus") return m >= 8000;
  return false;
}

export function filterProducts(products: Product[], filters: ShopFilters) {
  let out = [...products];

  if (filters.collection) {
    out = out.filter((p) => p.collectionHandle === filters.collection);
  }

  if (filters.productTypeSlugs?.length) {
    const wanted = new Set(filters.productTypeSlugs);
    out = out.filter((p) =>
      wanted.has(slugifyProductTypeLabel(p.productTypeLabel)),
    );
  }

  if (filters.category) {
    out = out.filter((p) => p.primaryCategory === filters.category);
  }

  const genderList: ProductGender[] | null =
    filters.genders && filters.genders.length > 0
      ? filters.genders
      : filters.gender
        ? [filters.gender]
        : null;
  if (genderList?.length) {
    out = out.filter((p) => genderList.some((g) => matchesGender(p, g)));
  }

  const familyList: ScentFamilyTag[] | null =
    filters.families && filters.families.length > 0
      ? filters.families
      : filters.scentFamily
        ? [filters.scentFamily]
        : null;
  if (familyList?.length) {
    out = out.filter((p) => familyList.some((f) => matchesScentFamily(p, f)));
  }

  if (filters.priceBands?.length) {
    const bands = filters.priceBands;
    out = out.filter((p) => bands.some((b) => matchesPriceBand(p, b)));
  }

  if (filters.curated === "new") {
    out = out.filter((p) => p.isNew);
  } else if (filters.curated === "bestseller") {
    out = out.filter((p) => p.isBestSeller);
  }

  if (filters.mood) {
    const mood = filters.mood;
    out = out.filter((p) => matchesMood(p, mood));
  }

  if (filters.note) {
    const note = filters.note;
    out = out.filter((p) => matchesNote(p, note));
  }

  if (filters.vibe) {
    const vibe = filters.vibe;
    out = out.filter((p) => productMatchesVibe(p, vibe));
  }

  if (filters.budget) {
    const budget = filters.budget;
    out = out.filter((p) => productMatchesBudgetBand(p, budget));
  }

  if (filters.occasion) {
    const occasion = filters.occasion;
    out = out.filter((p) => productMatchesOccasion(p, occasion));
  }

  if (filters.gift) {
    const gift = filters.gift;
    out = out.filter((p) => productMatchesGiftGuide(p, gift));
  }

  if (filters.q) {
    const q = filters.q.toLowerCase();
    out = out.filter((p) => {
      const blob = [
        p.title,
        p.collectionTitle,
        p.categoryTitle,
        p.productTypeLabel,
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

  if (filters.sort === "price-asc") {
    out.sort(
      (a, b) =>
        Math.min(...a.variants.map((v) => v.priceCents)) -
        Math.min(...b.variants.map((v) => v.priceCents)),
    );
  } else if (filters.sort === "price-desc") {
    out.sort(
      (a, b) =>
        Math.min(...b.variants.map((v) => v.priceCents)) -
        Math.min(...a.variants.map((v) => v.priceCents)),
    );
  } else if (filters.sort === "alpha") {
    out.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    out.sort((a, b) => {
      const score = (p: Product) =>
        Number(p.isBestSeller) * 4 +
        Number(p.isSignature) * 3 +
        Number(p.featured) * 2 +
        Number(p.isNew);
      return score(b) - score(a);
    });
  }

  return out;
}
