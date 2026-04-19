/** Editable badge keys — map per product in `lib/data/product-ux.ts`. */
export type ShoppingBadgeId =
  | "fresh"
  | "sweet"
  | "warm"
  | "date-night"
  | "daily-wear"
  | "long-lasting"
  | "budget-pick"
  | "best-seller"
  | "gift-pick"
  | "luxury-feel";

/** PDP detail-card wash — fixed hues in CSS, independent of header accent. */
export type PdpSmellTintKey =
  | "fresh"
  | "floral"
  | "woody"
  | "sweet"
  | "luxury"
  | "body"
  | "home"
  | "incense"
  | "diffuser"
  | "gifts"
  | "neutral";

/** 1–5 scale for horizontal profile bars (fragrance guide, not gamified). */
export type ScentMeterValues = {
  freshness: number;
  sweetness: number;
  warmth: number;
  projection: number;
  longevity: number;
};

/** Per-product UX — edit in `lib/data/product-ux.ts` only. */
export type ProductUxMeta = {
  badges: ShoppingBadgeId[];
  meters: ScentMeterValues;
  /** `ShopByVibe` / URL `?vibe=` keys this product belongs to */
  vibes: string[];
  /** `OccasionPicker` / URL `?occasion=` keys */
  occasions: string[];
  /** `ShopByBudget` / URL `?budget=` keys */
  budgetBands: string[];
  /** One line for quick view / quiz copy */
  bestFor: string;
  /** Optional PDP hero emojis — see `getPdpEmojis` fallbacks when unset. */
  pdpEmojis?: string[];
  /** Optional wash on the PDP info card (emoji area) — overrides automatic smell tint. */
  pdpSmellTint?: PdpSmellTintKey;
};
