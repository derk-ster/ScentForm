export type SmellsLike = {
  name: string;
  brand: string;
  note: string;
};

/**
 * Optional resemblance hints for PDPs — keyed by product handle.
 * ALLURA 7 is an independent house; any entries are shopper guidance only.
 */
export const smellsLikeByHandle: Record<string, SmellsLike> = {
  // Personal fragrance — aligned with note pyramids & common “dupe” language
  "midnight-oud": {
    brand: "Tom Ford",
    name: "Oud Wood",
    note: "Warm saffron, rose, and dry oud-amber woods in the same lane.",
  },
  "coastal-bleu": {
    brand: "Giorgio Armani",
    name: "Acqua di Giò",
    note: "Marine citrus, aromatic herbs, and clean musk-wood dry-down.",
  },
  "velvet-bloom": {
    brand: "Viktor & Rolf",
    name: "Flowerbomb",
    note: "Sweet florals (pear, jasmine, peony) melting into creamy vanilla woods.",
  },
  "noir-ember": {
    brand: "Viktor & Rolf",
    name: "Spicebomb",
    note: "Pepper-spice, leather, and amber-patchouli warmth.",
  },
  "golden-aura": {
    brand: "Maison Francis Kurkdjian",
    name: "Grand Soir",
    note: "Honeyed warmth, resinous amber, and smooth vanilla-tonka radiance.",
  },
  "arctic-rush": {
    brand: "Davidoff",
    name: "Cool Water",
    note: "Iced citrus, green freshness, and a clean musk-cedar finish.",
  },
  "rouge-desire": {
    brand: "Maison Francis Kurkdjian",
    name: "Baccarat Rouge 540",
    note: "Jammy red fruit, saffron rose, and warm amber-resin depth.",
  },
  "urban-legend": {
    brand: "Chanel",
    name: "Bleu de Chanel",
    note: "Citrus top, aromatic cardamom, vetiver spine, creamy woods.",
  },
  "silk-garden": {
    brand: "Chloé",
    name: "Chloé Eau de Parfum",
    note: "Airy peony and magnolia with dewy greens and soft clean musk.",
  },
  "infinite-night": {
    brand: "Tom Ford",
    name: "Noir Extreme",
    note: "Resinous spice, creamy vanilla, and smoldering woods (incense-forward).",
  },

  // Body — same scent families as the closest mass-loved references
  "velvet-shea-lotion": {
    brand: "Laura Mercier",
    name: "Ambre Vanillé",
    note: "Warm vanilla, almond, and skin-hugging amber (body-care mood).",
  },
  "citrus-burst-body-wash": {
    brand: "Jo Malone London",
    name: "Grapefruit",
    note: "Punchy grapefruit and aromatic herbs with a clean musk dry-down.",
  },
  "midnight-oud-body-oil": {
    brand: "Tom Ford",
    name: "Oud Wood",
    note: "Rose-oud and amber resin — built to layer with woody orientals.",
  },
  "rose-silk-hand-cream": {
    brand: "Diptyque",
    name: "Eau Rose",
    note: "Fresh-petal rose with a light musk base (desk-friendly floral).",
  },
  "fresh-linen-body-mist": {
    brand: "Maison Margiela",
    name: "Replica Lazy Sunday Morning",
    note: "Clean cotton, soft aldehydes, and pillowy white musk.",
  },
  "coconut-cashmere-butter": {
    brand: "Sol de Janeiro",
    name: "Brazilian Bum Bum Cream",
    note: "Warm coconut, pistachio-caramel gourmand, and creamy woods.",
  },
  "noir-ember-deodorant-spray": {
    brand: "Viktor & Rolf",
    name: "Spicebomb",
    note: "Pepper-leather-amber in a sheer body format (same family as Noir Ember).",
  },

  // Home — parallels people know from candles, diffusers, and colognes
  "midnight-lounge-candle": {
    brand: "Maison Margiela",
    name: "Replica By the Fireplace",
    note: "Smoky woods, chestnut-vanilla warmth, and low-light coziness.",
  },
  "ocean-breeze-candle": {
    brand: "Jo Malone London",
    name: "Wood Sage & Sea Salt",
    note: "Sea salt breeze, mineral air, and pale driftwood.",
  },
  "vanilla-sand-room-spray": {
    brand: "Bath & Body Works",
    name: "Warm Vanilla Sugar",
    note: "Creamy vanilla, soft sandalwood, and cozy musk (room-spray energy).",
  },
  "allura-white-tea-reed-diffuser": {
    brand: "Bvlgari",
    name: "Eau Parfumée au Thé Blanc",
    note: "White tea, soft citrus, and clean blonde woods — hotel-spa calm.",
  },
  "cozy-cabin-wax-melt": {
    brand: "Thymes",
    name: "Frasier Fir",
    note: "Cedar-forward forest greens with clove spice and toasted vanilla.",
  },
  "cashmere-nights-candle": {
    brand: "Narciso Rodriguez",
    name: "for Her",
    note: "Powdery iris, creamy musk, and soft sandalwood-vanilla warmth.",
  },
  "citrus-zen-room-mist": {
    brand: "Jo Malone London",
    name: "Lime Basil & Mandarin",
    note: "Zesty citrus, aromatic herbs, and a clean woody base.",
  },

  // Incense & diffuser oils (same “what does this remind me of?” guidance)
  "sandal-temple-sticks": {
    brand: "Diptyque",
    name: "Tam Dao",
    note: "Creamy sandalwood, soft amber, and meditative wood smoke.",
  },
  "vanilla-resin-sticks": {
    brand: "Yves Saint Laurent",
    name: "Black Opium",
    note: "Vanilla coffee warmth with resinous benzoin depth (smoke-sweet).",
  },
  "lavender-calm-sticks": {
    brand: "L'Occitane",
    name: "Lavender Eau de Cologne",
    note: "High-altitude lavender, herbal sage, and clean musk.",
  },
  "oud-reserve-incense": {
    brand: "Amouage",
    name: "Interlude Man",
    note: "Dense oud, rose, and saffron resin — bold smoke trail.",
  },
  "jasmine-bloom-incense": {
    brand: "Serge Lutens",
    name: "A La Nuit",
    note: "Indolic jasmine and orange blossom with airy white musk.",
  },
  "diffuser-oil-hotel-lobby": {
    brand: "Bvlgari",
    name: "Eau Parfumée au Thé Blanc",
    note: "Sparkling tea, citrus peel, and blonde woods — polished lobby calm.",
  },
  "diffuser-oil-ocean-escape": {
    brand: "Giorgio Armani",
    name: "Acqua di Giò",
    note: "Sea salt, marine air, and sheer citrus over pale woods.",
  },
  "diffuser-oil-arabian-oud": {
    brand: "Tom Ford",
    name: "Oud Wood",
    note: "Saffron-rose oud and warm amber — Middle Eastern luxury lane.",
  },
  "diffuser-oil-vanilla-cashmere": {
    brand: "Kayali",
    name: "Vanilla | 28",
    note: "Vanilla bean, sandalwood, and cashmeran musk (cozy gourmand mist).",
  },
  "diffuser-oil-white-tea-luxury": {
    brand: "Bvlgari",
    name: "Eau Parfumée au Thé Blanc",
    note: "White tea, neroli sparkle, and freesia over clean musk.",
  },
  "diffuser-oil-citrus-energy": {
    brand: "Dolce & Gabbana",
    name: "Light Blue",
    note: "Sicilian citrus, ginger zest, and sun-washed woods.",
  },
  "diffuser-oil-midnight-noir": {
    brand: "Viktor & Rolf",
    name: "Spicebomb Extreme",
    note: "Black pepper heat, smoky incense, and vanilla-patchouli depth.",
  },
  "diffuser-oil-fresh-laundry": {
    brand: "Maison Margiela",
    name: "Replica Lazy Sunday Morning",
    note: "Cotton-linen aldehydes and soft white musk (line-dried linen).",
  },
  "diffuser-oil-spa-retreat": {
    brand: "Molton Brown",
    name: "Re-charge Black Pepper",
    note: "Eucalyptus-mint lift with aromatic herbs and dry cedar base.",
  },
  "diffuser-oil-rosewood-amber": {
    brand: "Tom Ford",
    name: "Noir Extreme",
    note: "Rosewood spice, amber resin, and creamy vanilla dry-down.",
  },
};

export function getSmellsLike(handle: string): SmellsLike | undefined {
  return smellsLikeByHandle[handle];
}
