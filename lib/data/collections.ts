import type { Collection } from "@/types/catalog";
import { linePhoto, linePhotoThumb } from "@/lib/data/media";

function imagesFor(handle: string) {
  return {
    heroImage: linePhoto(handle),
    thumbnailImage: linePhotoThumb(handle),
  };
}

export const collections: Collection[] = [
  {
    handle: "aura",
    title: "Aura",
    description: "Bright woods, easy polish.",
    moodLine: "Clean radiance",
    ...imagesFor("aura"),
    accent: "from-violet-500/25 to-fuchsia-500/10",
  },
  {
    handle: "billionaire",
    title: "Billionaire",
    description: "Citrus up front, warm woods underneath.",
    moodLine: "Sharp & confident",
    ...imagesFor("billionaire"),
    accent: "from-amber-500/20 to-yellow-500/5",
  },
  {
    handle: "bleu-marine",
    title: "Bleu Marine",
    description: "Cool air, mineral clarity.",
    moodLine: "Aquatic, tailored",
    ...imagesFor("bleu-marine"),
    accent: "from-sky-500/15 to-cyan-500/5",
  },
  {
    handle: "desert-rose",
    title: "Desert Rose",
    description: "Spiced florals, warm skin.",
    moodLine: "Sunset florals",
    ...imagesFor("desert-rose"),
    accent: "from-rose-400/20 to-orange-900/10",
  },
  {
    handle: "dreamweaver",
    title: "Dreamweaver",
    description: "Soft musks, quiet gourmand.",
    moodLine: "Night-out cozy",
    ...imagesFor("dreamweaver"),
    accent: "from-indigo-500/20 to-purple-500/10",
  },
  {
    handle: "j-mystery",
    title: "J Mystery",
    description: "Dark fruit, polished woods.",
    moodLine: "After-dark",
    ...imagesFor("j-mystery"),
    accent: "from-fuchsia-500/15 to-slate-900/30",
  },
  {
    handle: "la-mer",
    title: "La Mer",
    description: "Sheer citrus, sea breeze.",
    moodLine: "Coastal minimal",
    ...imagesFor("la-mer"),
    accent: "from-teal-500/15 to-blue-900/10",
  },
  {
    handle: "lush-milk",
    title: "Lush Milk",
    description: "Creamy skin scent.",
    moodLine: "Soft comfort",
    ...imagesFor("lush-milk"),
    accent: "from-stone-200/10 to-amber-100/5",
  },
  {
    handle: "reverie",
    title: "Reverie",
    description: "Powdery florals, modern lift.",
    moodLine: "Soft focus",
    ...imagesFor("reverie"),
    accent: "from-pink-300/15 to-violet-600/10",
  },
  {
    handle: "sweet-marshmallow",
    title: "Sweet Marshmallow",
    description: "Playful sweet, musk balance.",
    moodLine: "Gourmand nights",
    ...imagesFor("sweet-marshmallow"),
    accent: "from-pink-400/20 to-amber-200/10",
  },
  {
    handle: "tobacco-vanilla",
    title: "Tobacco & Vanilla",
    description: "Resin, smoke, vanilla warmth.",
    moodLine: "Evening warmth",
    ...imagesFor("tobacco-vanilla"),
    accent: "from-amber-900/25 to-orange-700/10",
  },
  {
    handle: "valencia-cashmere",
    title: "Valencia Cashmere",
    description: "Citrus sparkle, soft dry-down.",
    moodLine: "Radiant daily",
    ...imagesFor("valencia-cashmere"),
    accent: "from-orange-300/15 to-stone-500/10",
  },
  {
    handle: "visionary",
    title: "Visionary",
    description: "Green aromatics, cool woods.",
    moodLine: "Modern fougère",
    ...imagesFor("visionary"),
    accent: "from-emerald-500/15 to-slate-700/10",
  },
];

export function getCollectionByHandle(handle: string) {
  return collections.find((c) => c.handle === handle);
}
