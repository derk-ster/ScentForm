import type { ConcentrationHandle, Product } from "@/types/catalog";

export type ShopFilters = {
  mood?: string | null;
  note?: string | null;
  concentration?: ConcentrationHandle | null;
  collection?: string | null;
  q?: string | null;
  sort?: "featured" | "price-asc" | "price-desc" | "alpha";
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
      notes.includes("vetiver")
    );
  if (n === "vanilla")
    return notes.includes("vanilla") || notes.includes("tonka") || notes.includes("resin");
  if (n === "aquatic")
    return (
      notes.includes("marine") ||
      notes.includes("salt") ||
      product.title.toLowerCase().includes("mer") ||
      product.title.toLowerCase().includes("marine")
    );
  return notes.includes(n);
}

export function filterProducts(products: Product[], filters: ShopFilters) {
  let out = [...products];

  if (filters.collection) {
    out = out.filter((p) => p.collectionHandle === filters.collection);
  }

  if (filters.concentration) {
    out = out.filter((p) =>
      p.variants.some((v) => v.concentration === filters.concentration),
    );
  }

  if (filters.mood) {
    const mood = filters.mood;
    out = out.filter((p) => matchesMood(p, mood));
  }

  if (filters.note) {
    const note = filters.note;
    out = out.filter((p) => matchesNote(p, note));
  }

  if (filters.q) {
    const q = filters.q.toLowerCase();
    out = out.filter((p) => {
      const blob = [
        p.title,
        p.collectionTitle,
        p.description,
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
    out.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return out;
}
