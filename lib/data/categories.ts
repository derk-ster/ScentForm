import type { PrimaryCategoryHandle } from "@/types/catalog";
import { linePhoto, linePhotoThumb } from "@/lib/data/media";

export type ShopCategory = {
  handle: PrimaryCategoryHandle;
  title: string;
  /** One line under the title on homepage cards. */
  line: string;
  /** Category landing intro. */
  intro: string;
  /** Optional chips on category page — keep sparse. */
  chips?: { label: string; href: string }[];
  accent: string;
  cardImage: string;
};

function cardImg(handle: string) {
  return linePhoto(`cat-${handle}`, 3);
}

export const shopCategories: ShopCategory[] = [
  {
    handle: "perfumes-colognes",
    title: "Perfumes & Colognes",
    line: "Signature personal fragrances — fresh, floral, woody, and niche compositions.",
    intro:
      "The ALLURA 7 fragrance wardrobe: colognes, eaux de parfum, and unisex icons with honest note pyramids and clear wear stories.",
    chips: [
      { label: "Best sellers", href: "/best-sellers" },
      { label: "New arrivals", href: "/new-arrivals" },
    ],
    accent: "from-violet-950/30 via-slate-900/15 to-background",
    cardImage: linePhotoThumb("perfumes-hero"),
  },
  {
    handle: "body",
    title: "Body Products",
    line: "Lotions, washes, oils, and mists — skin-forward formulas with premium scent.",
    intro:
      "Layer ALLURA 7 from shower to skin — body care designed to read polished close-up, never loud.",
    accent: "from-rose-950/20 via-stone-900/10 to-background",
    cardImage: cardImg("body"),
  },
  {
    handle: "home",
    title: "Home Products",
    line: "Candles, room sprays, reed diffusers, and wax melts for elevated spaces.",
    intro:
      "Home scent essentials that feel editorial — warm throws of wax, mist, and passive diffusion.",
    accent: "from-amber-900/25 via-stone-800/10 to-background",
    cardImage: cardImg("home"),
  },
  {
    handle: "incense",
    title: "Incense",
    line: "Sticks with clear burn profiles — short rituals, memorable smoke.",
    intro:
      "Incense edits for moments when you want the room to pivot — sandalwood, oud, jasmine, and resin blends.",
    accent: "from-orange-950/25 via-stone-900/10 to-background",
    cardImage: cardImg("incense"),
  },
  {
    handle: "diffuser-machines",
    title: "Diffuser Machines",
    line: "Ultrasonic diffusers engineered for coverage, silence, and modern form.",
    intro:
      "Hardware that disappears into the room — from compact desks to large living spaces.",
    accent: "from-black/88 via-zinc-950/75 to-zinc-950/20",
    cardImage: linePhoto("diffuser-machines-card", 29),
  },
  {
    handle: "diffuser-oils",
    title: "Diffuser Oils",
    line: "Mist-ready oils — hotel lobby polish, spa calm, and oud depth.",
    intro:
      "Concentrated oils tuned for ultrasonic diffusers — even dispersion, luxe blends, everyday refresh.",
    accent: "from-emerald-950/25 via-stone-900/10 to-background",
    cardImage: cardImg("diffuser-oils"),
  },
  {
    handle: "gift-sets",
    title: "Gift Sets",
    line: "Curated bundles — fragrance trios, home suites, and his & hers signatures.",
    intro:
      "Gift-ready ALLURA 7 sets with keepsake packaging — high-impact presents without guesswork.",
    accent: "from-fuchsia-950/20 via-amber-950/10 to-background",
    cardImage: cardImg("gift-sets"),
  },
];

export function getShopCategory(
  handle: string,
): ShopCategory | undefined {
  return shopCategories.find((c) => c.handle === handle);
}

export function isPrimaryCategoryHandle(
  h: string,
): h is PrimaryCategoryHandle {
  return shopCategories.some((c) => c.handle === h);
}
