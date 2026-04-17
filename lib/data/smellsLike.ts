export type SmellsLike = {
  name: string;
  brand: string;
  note: string;
};

/**
 * Each entry maps a Scentform product handle to a well-known commercial
 * fragrance whose scent profile sits in the same neighborhood. These are
 * resemblance notes for shoppers — not licensed duplications or
 * endorsements. Matches are chosen from the product's notes + mood, not
 * just the name.
 */
export const smellsLikeByHandle: Record<string, SmellsLike> = {
  "valencia-cashmere": {
    name: "Sauvage",
    brand: "Dior",
    note: "Bergamot lift over an ambroxan-deep dry-down.",
  },
  billionaire: {
    name: "1 Million",
    brand: "Paco Rabanne",
    note: "Sharp citrus opening into a warm, spiced woody core.",
  },
  aura: {
    name: "Wood Sage & Sea Salt",
    brand: "Jo Malone London",
    note: "Bright, mineral-polished woods with a clean halo.",
  },
  "bleu-marine": {
    name: "Pour Homme",
    brand: "Versace",
    note: "Cool, tailored marine freshness with mineral clarity.",
  },
  "desert-rose": {
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    note: "Spiced amber-rose warmth glowing on skin.",
  },
  dreamweaver: {
    name: "Replica By the Fireplace",
    brand: "Maison Margiela",
    note: "Soft musks and cozy gourmand smoke.",
  },
  "j-mystery": {
    name: "Aventus",
    brand: "Creed",
    note: "Dark fruit layered over polished smoky woods.",
  },
  "la-mer": {
    name: "Acqua di Giò",
    brand: "Giorgio Armani",
    note: "Sheer citrus and salt-air transparency.",
  },
  "lush-milk": {
    name: "Vanilla 28",
    brand: "Kayali",
    note: "Creamy milk-vanilla skin scent.",
  },
  reverie: {
    name: "Eau de Parfum",
    brand: "Chloé",
    note: "Powdery modern rose florals with a soft lift.",
  },
  "sweet-marshmallow": {
    name: "Cloud",
    brand: "Ariana Grande",
    note: "Playful marshmallow gourmand with clean musk.",
  },
  "tobacco-vanilla": {
    name: "Tobacco Vanille",
    brand: "Tom Ford",
    note: "Resinous tobacco smoke wrapped in vanilla.",
  },
  visionary: {
    name: "Y Eau de Parfum",
    brand: "Yves Saint Laurent",
    note: "Modern fresh fougère with cool, green woods.",
  },
};

export function getSmellsLike(handle: string): SmellsLike | undefined {
  return smellsLikeByHandle[handle];
}
