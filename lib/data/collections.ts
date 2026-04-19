import type { Collection } from "@/types/catalog";
import { linePhoto, linePhotoThumb } from "@/lib/data/media";

function imagesFor(handle: string) {
  return {
    heroImage: linePhoto(handle, 4),
    thumbnailImage: linePhotoThumb(handle),
  };
}

/** Merchandising groups — each maps to `product.collectionHandle`. */
export const collections: Collection[] = [
  {
    handle: "a7-personal",
    title: "Personal fragrance",
    description:
      "Eau de parfum, cologne, and niche compositions — the ALLURA 7 signature wardrobe for skin.",
    moodLine: "Wear everywhere",
    ...imagesFor("a7-personal"),
    accent: "from-violet-950/30 via-slate-900/15 to-background",
  },
  {
    handle: "a7-body",
    title: "Body care",
    description:
      "Lotions, washes, oils, and mists that carry scent with intention — polished formulas, skin-first.",
    moodLine: "Ritual on skin",
    ...imagesFor("a7-body"),
    accent: "from-rose-950/20 via-stone-900/10 to-background",
  },
  {
    handle: "a7-home",
    title: "Home scent",
    description:
      "Candles, mists, wax melts, and reed diffusion — layer atmosphere without overpowering the room.",
    moodLine: "Rooms that linger",
    ...imagesFor("a7-home"),
    accent: "from-amber-900/25 via-stone-800/10 to-background",
  },
  {
    handle: "a7-incense",
    title: "Incense",
    description:
      "Sticks with disciplined smoke character — short sessions that shift the mood of a space.",
    moodLine: "Sculptural smoke",
    ...imagesFor("a7-incense"),
    accent: "from-orange-950/25 via-stone-900/10 to-background",
  },
  {
    handle: "a7-diffuser-hardware",
    title: "Diffuser machines",
    description:
      "Ultrasonic hardware tuned for mist quality, footprint, and calm presence in modern homes.",
    moodLine: "Quiet performance",
    ...imagesFor("a7-diffuser-hardware"),
    accent: "from-black/88 via-zinc-950/75 to-zinc-950/20",
  },
  {
    handle: "a7-diffuser-oils",
    title: "Diffuser oils",
    description:
      "Concentrated blends for cold mist — build a library of rooms, moods, and seasons.",
    moodLine: "Mist-ready blends",
    ...imagesFor("a7-diffuser-oils"),
    accent: "from-emerald-950/25 via-stone-900/10 to-background",
  },
  {
    handle: "a7-gifts",
    title: "Gift sets",
    description:
      "Curated bundles for gifting — fragrance trios, home suites, and his & hers signatures.",
    moodLine: "Ready to impress",
    ...imagesFor("a7-gifts"),
    accent: "from-fuchsia-950/20 via-amber-950/10 to-background",
  },
];

export function getCollectionByHandle(handle: string) {
  return collections.find((c) => c.handle === handle);
}
