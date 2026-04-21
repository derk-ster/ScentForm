import { isPrimaryCategoryHandle } from "@/lib/data/categories";
import type { ShopFilters } from "@/lib/data/filters";
import type { ProductGender, ScentFamilyTag } from "@/types/catalog";
import { validProductTypeSlugSet } from "@/lib/shop/product-type-options";

const GENDER_SET = new Set<ProductGender>(["men", "women", "unisex"]);
const FAMILY_SET = new Set<ScentFamilyTag>([
  "fresh",
  "woody",
  "sweet",
  "floral",
  "luxury",
]);
const PRICE_SET = new Set<string>(["under-40", "40-80", "80-plus"]);

export const SHOP_PRICE_BANDS: { id: string; label: string }[] = [
  { id: "under-40", label: "Under $40" },
  { id: "40-80", label: "$40 – $80" },
  { id: "80-plus", label: "$80 & up" },
];

function parseCsv<T extends string>(
  raw: string | null,
  valid: Set<T>,
): T[] | null {
  if (!raw?.trim()) return null;
  const out: T[] = [];
  for (const part of raw.split(",")) {
    const t = part.trim() as T;
    if (valid.has(t)) out.push(t);
  }
  return out.length ? out : null;
}

/**
 * Reads `/shop` (and collection) query params into `ShopFilters`.
 * Supports multi-select: `genders=men,women`, `families=fresh,woody`, `prices=under-40,40-80`.
 */
export function parseShopFiltersFromSearchParams(
  searchParams: URLSearchParams,
): ShopFilters {
  const mood = searchParams.get("mood");
  const note = searchParams.get("note");
  const collection = searchParams.get("collection");
  const q = searchParams.get("q");
  const sort = (searchParams.get("sort") as ShopFilters["sort"]) || "featured";
  const vibe = searchParams.get("vibe");
  const budget = searchParams.get("budget");
  const occasion = searchParams.get("occasion");
  const gift = searchParams.get("gift");
  const categoryRaw = searchParams.get("category");
  const category =
    categoryRaw && isPrimaryCategoryHandle(categoryRaw) ? categoryRaw : null;
  const genderRaw = searchParams.get("gender") as ProductGender | null;
  const gender =
    genderRaw === "men" || genderRaw === "women" || genderRaw === "unisex"
      ? genderRaw
      : null;
  const familyRaw = searchParams.get("family") as ScentFamilyTag | null;
  const scentFamily =
    familyRaw === "fresh" ||
    familyRaw === "woody" ||
    familyRaw === "sweet" ||
    familyRaw === "floral" ||
    familyRaw === "luxury"
      ? familyRaw
      : null;
  const curatedRaw = searchParams.get("curated");
  const curated =
    curatedRaw === "new" || curatedRaw === "bestseller" ? curatedRaw : null;

  const gendersCsv = parseCsv(searchParams.get("genders"), GENDER_SET);
  const familiesCsv = parseCsv(searchParams.get("families"), FAMILY_SET);
  const priceBands = parseCsv(searchParams.get("prices"), PRICE_SET);

  const ptypeRaw = searchParams.get("ptype");
  const productTypeSlugs = (() => {
    if (!ptypeRaw?.trim()) return null;
    const valid = validProductTypeSlugSet();
    const out: string[] = [];
    for (const part of ptypeRaw.split(",")) {
      const s = part.trim();
      if (valid.has(s)) out.push(s);
    }
    return out.length ? out : null;
  })();

  return {
    mood,
    note,
    category,
    collection,
    q,
    sort: sort ?? "featured",
    vibe,
    budget,
    occasion,
    gift,
    gender,
    scentFamily,
    genders: gendersCsv,
    families: familiesCsv,
    priceBands,
    productTypeSlugs,
    curated,
  };
}
