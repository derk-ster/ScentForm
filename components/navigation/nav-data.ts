import { collections } from "@/lib/data/collections";
import { concentrations } from "@/lib/data/concentrations";

export const megaCollections = collections.map((c) => ({
  label: c.title,
  href: `/collections/${c.handle}`,
}));

export const megaConcentrations = concentrations.map((c) => ({
  label: c.label,
  href: `/concentrations/${c.handle}`,
}));
