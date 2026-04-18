import type {
  ConcentrationHandle,
  FragranceProfile,
  NotePyramid,
  Product,
  ProductClaims,
  ProductSpecifications,
  ProductVariant,
  ReviewSummary,
} from "@/types/catalog";
import { collections } from "./collections";
import { concentrations } from "./concentrations";

const currencyCode = "USD" as const;

const sizeSteps: Record<
  Exclude<ConcentrationHandle, "perfume-oil">,
  { label: string; ml: number; priceIndex: number }[]
> = {
  edt: [
    { label: "0.34 oz (10 ml)", ml: 10, priceIndex: 0 },
    { label: "1 oz (30 ml)", ml: 30, priceIndex: 1 },
    { label: "1.7 oz (50 ml)", ml: 50, priceIndex: 2 },
    { label: "3.4 oz (100 ml)", ml: 100, priceIndex: 3 },
  ],
  edp: [
    { label: "0.34 oz (10 ml)", ml: 10, priceIndex: 0 },
    { label: "1 oz (30 ml)", ml: 30, priceIndex: 1 },
    { label: "1.7 oz (50 ml)", ml: 50, priceIndex: 2 },
    { label: "3.4 oz (100 ml)", ml: 100, priceIndex: 3 },
  ],
  extrait: [
    { label: "0.34 oz (10 ml)", ml: 10, priceIndex: 0 },
    { label: "1 oz (30 ml)", ml: 30, priceIndex: 1 },
    { label: "1.7 oz (50 ml)", ml: 50, priceIndex: 2 },
    { label: "3.4 oz (100 ml)", ml: 100, priceIndex: 3 },
  ],
};

const oilSizes = [
  { label: "0.27 oz (8 ml)", ml: 8, priceIndex: 0 },
  { label: "1 oz (30 ml)", ml: 30, priceIndex: 1 },
];

type Tier = "entry" | "core" | "atelier";

const collectionTier: Record<string, Tier> = {
  billionaire: "entry",
  aura: "core",
  "bleu-marine": "core",
  "desert-rose": "core",
  dreamweaver: "core",
  "j-mystery": "atelier",
  "la-mer": "core",
  "lush-milk": "core",
  reverie: "core",
  "sweet-marshmallow": "core",
  "tobacco-vanilla": "core",
  "valencia-cashmere": "core",
  visionary: "core",
};

const basePriceTable: Record<
  Tier,
  Record<ConcentrationHandle, number[]>
> = {
  entry: {
    edt: [700, 1600, 2200, 3600],
    edp: [800, 1800, 3500, 3900],
    extrait: [1400, 3200, 5200, 7800],
    "perfume-oil": [2000, 6500],
  },
  core: {
    edt: [1600, 3600, 4500, 6300],
    edp: [1700, 3900, 4900, 6100],
    extrait: [3600, 6100, 7600, 11800],
    "perfume-oil": [2600, 8000],
  },
  atelier: {
    edt: [1800, 4000, 5200, 7200],
    edp: [2000, 4500, 5600, 7200],
    extrait: [4200, 7200, 9800, 14500],
    "perfume-oil": [3200, 9800],
  },
};

function buildVariants(
  productHandle: string,
  tier: Tier,
): ProductVariant[] {
  const variants: ProductVariant[] = [];
  for (const c of concentrations) {
    const table = basePriceTable[tier][c.handle];
    const sizes =
      c.handle === "perfume-oil"
        ? oilSizes
        : sizeSteps[c.handle as Exclude<ConcentrationHandle, "perfume-oil">];
    sizes.forEach((s, idx) => {
      const priceCents = table[s.priceIndex] ?? table[idx] ?? table[0];
      variants.push({
        id: `${productHandle}-${c.handle}-${s.ml}`,
        sku: `SF-${productHandle}-${c.shortLabel}-${s.ml}`.toUpperCase(),
        concentration: c.handle,
        concentrationLabel: c.label,
        sizeLabel: s.label,
        sizeMl: s.ml,
        priceCents,
        currencyCode,
        available: true,
      });
    });
  }
  return variants;
}

function hashPick<T>(seed: string, options: T[]): T {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  const idx = Math.abs(h) % options.length;
  return options[idx];
}

function pyramidFor(handle: string): NotePyramid {
  const tops = [
    ["Calabrian Bergamot", "Citron", "Pink Pepper"],
    ["Grapefruit", "Mint", "Blood Mandarin"],
    ["Neroli", "Lemon", "Basil"],
    ["Bergamot", "Black Currant", "Apple"],
  ];
  const hearts = [
    ["Jasmine", "Geranium", "Nutmeg"],
    ["Cinnamon", "Nigerian Ginger", "Tunisian Neroli"],
    ["Rose", "Freesia", "Peony"],
    ["Saffron", "Leather", "Cedar"],
  ];
  const bases = [
    ["Ambroxan", "Vetiver", "White Musk"],
    ["Guaiac Wood", "Tonka Bean", "Vanilla"],
    ["Patchouli", "Oakmoss", "Labdanum"],
    ["Amberwood", "Musk", "Olibanum"],
  ];
  return {
    top: hashPick(handle, tops),
    heart: hashPick(handle + "h", hearts),
    base: hashPick(handle + "b", bases),
  };
}

function profileFor(handle: string): FragranceProfile {
  return {
    mood: [
      hashPick(handle + "m1", ["Crisp", "Warm", "Spiced", "Airy"]),
      hashPick(handle + "m2", ["Evening", "All-day", "Weekend"]),
    ],
    sweetness: (Math.abs(handle.length * 7) % 5) + 1,
    freshness: (Math.abs(handle.length * 3) % 5) + 1,
    warmth: (Math.abs(handle.length * 5) % 5) + 1,
    intensity: (Math.abs(handle.length * 11) % 5) + 1,
    occasions: hashPick(handle + "o", [
      ["Office", "Date night"],
      ["Travel", "Daily signature"],
      ["Weekend", "Special events"],
    ]),
  };
}

function defaultSpecs(
  concentrationLabel: string,
  sizeLabel: string,
): ProductSpecifications {
  return {
    concentrationLabel,
    concentrationRange: "Varies by selection",
    longevity: "Varies by concentration — see concentration guide.",
    sillage: "Varies by concentration — EDT stays closer; extrait projects more.",
    volume: sizeLabel,
    packagingMaterials: "Glass bottle, aluminum sprayer, plastic cap",
    countryOfOrigin: "United States",
    containsAlcohol: concentrationLabel !== "Perfume Oils",
  };
}

function defaultClaims(): ProductClaims {
  return {
    crueltyFree: true,
    phthalateFree: true,
    parabenFree: true,
    dyeFree: true,
    recyclablePackaging: true,
    madeInUSA: true,
  };
}

function valenciaCashmereProduct(): Product {
  const handle = "valencia-cashmere";
  const col = collections.find((c) => c.handle === handle)!;
  const tier = collectionTier[handle] ?? "core";
  const variants = buildVariants(handle, tier).map((v) => {
    const overrides: Partial<Record<string, number>> = {
      "edt-50": 4500,
      "edp-50": 4900,
      "extrait-50": 7600,
      "edt-10": 1000,
    };
    const key = `${v.concentration}-${v.sizeMl}`;
    const cents = overrides[key] ?? v.priceCents;
    return { ...v, priceCents: cents };
  });
  const specs = defaultSpecs("Eau de Toilette", "1.7 oz (50 ml)");
  specs.concentrationRange = "5–15% (EDT example)";
  specs.longevity = "3–5 hours (EDT)";
  specs.sillage = "Light to moderate (EDT)";
  specs.weight = "6.3 oz (179 g)";
  specs.dimensions = "1.65 x 1.65 x 4.17 in (42 x 42 x 106 mm)";

  return {
    id: "valencia-cashmere",
    handle,
    title: "Valencia Cashmere",
    subtitle: "Golden citrus, smooth woods",
    collectionHandle: handle,
    collectionTitle: col.title,
    tagline: "Golden Citrus, Bold Depth",
    description:
      "Valencia Cashmere is a bright opening of citrus wrapped in smooth, airy warmth — energizing up top, refined underneath. It reads clean and modern without feeling sterile: a confident daily scent with an understated trail.",
    notes: {
      top: ["Calabrian Bergamot", "Citron", "Sicilian Orange"],
      heart: ["Ceylon Cinnamon", "Nigerian Ginger", "Tunisian Neroli"],
      base: ["Ambroxan", "Chinese Black Tea", "Guaiac Wood", "Olibanum"],
    },
    profile: {
      mood: ["Radiant", "Polished", "All-day"],
      sweetness: 2,
      freshness: 4,
      warmth: 3,
      intensity: 3,
      occasions: ["Workweek", "Warm weather", "First impressions"],
    },
    specifications: specs,
    claims: defaultClaims(),
    variants,
    images: [col.heroImage, col.thumbnailImage, collections[3].heroImage],
    hoverImage: col.thumbnailImage,
    featured: true,
    isNew: false,
    giftable: true,
    hasTravelSizes: true,
    relatedHandles: ["visionary", "la-mer", "bleu-marine"],
  };
}

export function buildCatalog(): Product[] {
  const special = valenciaCashmereProduct();
  const rest = collections
    .filter((c) => c.handle !== "valencia-cashmere")
    .map((c) => {
      const tier = collectionTier[c.handle] ?? "core";
      const handle = c.handle;
      const notes = pyramidFor(handle);
      const profile = profileFor(handle);
      return {
        id: handle,
        handle,
        title: c.title,
        subtitle: c.moodLine,
        collectionHandle: handle,
        collectionTitle: c.title,
        description: c.description,
        notes,
        profile,
        specifications: defaultSpecs("Eau de Parfum", "1.7 oz (50 ml)"),
        claims: defaultClaims(),
        variants: buildVariants(handle, tier),
        images: [c.heroImage, c.thumbnailImage],
        hoverImage: c.thumbnailImage,
        featured: handle === "j-mystery",
        isNew: handle === "j-mystery",
        giftable: true,
        hasTravelSizes: true,
        relatedHandles: collections
          .filter((x) => x.handle !== handle)
          .slice(0, 3)
          .map((x) => x.handle),
      } satisfies Product;
    });
  return [special, ...rest];
}

let cached: Product[] | null = null;

export function getCatalog(): Product[] {
  if (!cached) cached = buildCatalog();
  return cached;
}

export function getProductByHandle(handle: string): Product | undefined {
  return getCatalog().find((p) => p.handle === handle);
}

export function getProductsByCollection(handle: string): Product[] {
  return getCatalog().filter((p) => p.collectionHandle === handle);
}

export function getSkuCountForCollection(handle: string): number {
  return getProductsByCollection(handle).reduce(
    (acc, p) => acc + p.variants.length,
    0,
  );
}

export function getProductsByConcentration(
  concentration: ConcentrationHandle,
): Product[] {
  return getCatalog().filter((p) =>
    p.variants.some((v) => v.concentration === concentration),
  );
}

export function getFeaturedProducts(): Product[] {
  const cat = getCatalog();
  return cat.filter((p) => p.featured || p.isNew).slice(0, 8);
}

export function getBestSellers(): Product[] {
  const cat = getCatalog();
  const order = [
    "valencia-cashmere",
    "tobacco-vanilla",
    "billionaire",
    "aura",
    "bleu-marine",
    "j-mystery",
    "desert-rose",
    "visionary",
  ];
  return order
    .map((h) => cat.find((p) => p.handle === h))
    .filter(Boolean) as Product[];
}

export function getNewArrivals(): Product[] {
  const cat = getCatalog();
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of cat) {
    if (!p.isNew) continue;
    if (seen.has(p.handle)) continue;
    seen.add(p.handle);
    out.push(p);
  }
  for (const p of cat) {
    if (p.isNew) continue;
    if (seen.has(p.handle)) continue;
    seen.add(p.handle);
    out.push(p);
    if (out.length >= 8) break;
  }
  return out;
}

export function searchCatalog(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getCatalog().filter((p) => {
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

export function getDefaultVariant(product: Product): ProductVariant {
  const preferred =
    product.variants.find(
      (v) => v.concentration === "edt" && v.sizeMl === 50,
    ) ??
    product.variants.find((v) => v.concentration === "edp" && v.sizeMl === 50) ??
    product.variants[0];
  if (!preferred) {
    throw new Error(`getDefaultVariant: product "${product.handle}" has no variants`);
  }
  return preferred;
}

export function getReviewSummary(_handle: string): ReviewSummary {
  return { average: 5, count: 5, verified: true };
}
