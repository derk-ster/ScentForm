import type { ConcentrationMeta } from "@/types/catalog";

export const concentrations: ConcentrationMeta[] = [
  {
    handle: "edt",
    label: "Eau de Toilette",
    shortLabel: "EDT",
    description: "Lighter wear. Stays closer to skin.",
    intensity: 2,
    longevityNote: "~3–5 hr",
    sillageNote: "Light–moderate",
    vibe: "Daytime, heat",
    typicalOilPercent: "5–15%",
    accentColor: "hsl(210 35% 62%)",
  },
  {
    handle: "edp",
    label: "Eau de Parfum",
    shortLabel: "EDP",
    description: "Richer than EDT. Most people’s default.",
    intensity: 3,
    longevityNote: "~6–8+ hr",
    sillageNote: "Moderate",
    vibe: "Daily / night",
    typicalOilPercent: "15–20%",
    accentColor: "hsl(280 28% 68%)",
  },
  {
    handle: "extrait",
    label: "Extrait de Parfum",
    shortLabel: "Extrait",
    description: "Dense, long-lasting. Use sparingly.",
    intensity: 5,
    longevityNote: "10+ hr",
    sillageNote: "Stronger trail",
    vibe: "Cold / events",
    typicalOilPercent: "20%+",
    accentColor: "hsl(32 42% 58%)",
  },
  {
    handle: "perfume-oil",
    label: "Perfume Oils",
    shortLabel: "Oils",
    description: "No alcohol. Intimate, close to skin.",
    intensity: 2,
    longevityNote: "Close wear",
    sillageNote: "Soft",
    vibe: "Travel / office",
    typicalOilPercent: "Oil base",
    accentColor: "hsl(160 18% 55%)",
  },
];

export function getConcentrationByHandle(handle: string) {
  return concentrations.find((c) => c.handle === handle);
}
