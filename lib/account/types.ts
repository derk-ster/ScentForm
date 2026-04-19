/**
 * Local-only account shapes. Replace `lib/account/account-service` internals
 * with API calls when a real backend exists — keep these types stable for UI.
 */
export type AccountSyncPreference = "device" | "account";

export type AccountSession = {
  email: string;
  displayName: string;
  /** Where saved products live — `null` until the post sign-in choice is made. */
  syncPreference: AccountSyncPreference | null;
  /** First visit after registration — show device vs account modal. */
  pendingSyncChoice?: boolean;
  /** ISO timestamp */
  signedInAt: string;
};

export type CartLineSnapshot = {
  productHandle: string;
  variantId: string;
  quantity: number;
  title: string;
  sizeLabel: string;
  priceCentsEach: number;
};

export type StoredOrder = {
  id: string;
  email: string;
  placedAt: string;
  totalCents: number;
  lines: CartLineSnapshot[];
};

export type UserRecord = {
  email: string;
  displayName: string;
  createdAt: string;
  /** Mirrors last explicit sync choice for returning sign-ins. */
  syncPreference: AccountSyncPreference | null;
  savedHandles: string[];
  orders: StoredOrder[];
  /** One-time welcome promo — shown until “used” at checkout */
  welcomePromoUsed: boolean;
};
