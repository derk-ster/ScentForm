import { shopCategories } from "@/lib/data/categories";
import { collections } from "@/lib/data/collections";
import { concentrations } from "@/lib/data/concentrations";

export const megaShopCategories = shopCategories.map((c) => ({
  label: c.title,
  href: `/categories/${c.handle}`,
}));

export const megaCollections = collections.map((c) => ({
  label: c.title,
  href: `/collections/${c.handle}`,
}));

export const megaConcentrations = concentrations.map((c) => ({
  label: c.label,
  href: `/concentrations/${c.handle}`,
}));
