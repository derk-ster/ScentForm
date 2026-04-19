/**
 * Local prototype “account” layer — swap function bodies for `fetch('/api/…')`
 * when you add a backend. Cross-device sync is not possible until then.
 */
import type {
  AccountSession,
  AccountSyncPreference,
  StoredOrder,
  UserRecord,
} from "@/lib/account/types";

const SESSION_KEY = "scentform-account-session";
const USER_PREFIX = "scentform-user:";
const DEVICE_SAVED_KEY = "scentform-saved-handles-device";

export const ACCOUNT_WELCOME_PROMO_CODE = "A7WELCOME10";
export const ACCOUNT_WELCOME_DISCOUNT = 0.1;

function userKey(email: string) {
  return `${USER_PREFIX}${email.trim().toLowerCase()}`;
}

function readJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeUser(raw: UserRecord | null): UserRecord | null {
  if (!raw) return null;
  /* Legacy blobs without `syncPreference` — treat as account-backed saves. */
  if (raw.syncPreference === undefined) {
    return { ...raw, syncPreference: "account" };
  }
  return raw;
}

export async function getSession(): Promise<AccountSession | null> {
  if (typeof window === "undefined") return null;
  try {
    return readJson<AccountSession>(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

function readUser(email: string): UserRecord | null {
  if (typeof window === "undefined") return null;
  try {
    return normalizeUser(
      readJson<UserRecord>(localStorage.getItem(userKey(email))),
    );
  } catch {
    return null;
  }
}

function writeUser(record: UserRecord) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(userKey(record.email), JSON.stringify(record));
  } catch {
    /* quota */
  }
}

export async function signUp(
  email: string,
  displayName: string,
): Promise<AccountSession> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) throw new Error("Email required");
  const existing = readUser(normalized);
  if (existing) throw new Error("An account with this email already exists");
  const record: UserRecord = {
    email: normalized,
    displayName: displayName.trim() || "Member",
    createdAt: new Date().toISOString(),
    syncPreference: null,
    savedHandles: [],
    orders: [],
    welcomePromoUsed: false,
  };
  writeUser(record);
  const session: AccountSession = {
    email: normalized,
    displayName: record.displayName,
    syncPreference: null,
    pendingSyncChoice: true,
    signedInAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
  return session;
}

export async function signIn(email: string): Promise<AccountSession> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) throw new Error("Email required");
  const user = readUser(normalized);
  if (!user) throw new Error("No account found for that email");
  const pref = user.syncPreference === null ? "account" : user.syncPreference;
  const session: AccountSession = {
    email: normalized,
    displayName: user.displayName,
    syncPreference: pref,
    pendingSyncChoice: false,
    signedInAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
  return session;
}

export async function updateSyncPreference(
  pref: AccountSyncPreference,
): Promise<void> {
  const s = await getSession();
  if (!s || typeof window === "undefined") return;
  const next: AccountSession = {
    ...s,
    syncPreference: pref,
    pendingSyncChoice: false,
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  const u = readUser(s.email);
  if (u) writeUser({ ...u, syncPreference: pref });
}

export async function listSavedHandles(): Promise<string[]> {
  const s = await getSession();
  if (!s || s.syncPreference === null) return [];
  if (s.syncPreference === "device") {
    try {
      return readJson<string[]>(localStorage.getItem(DEVICE_SAVED_KEY)) ?? [];
    } catch {
      return [];
    }
  }
  const u = readUser(s.email);
  return u?.savedHandles ?? [];
}

export async function isSaved(handle: string): Promise<boolean> {
  const list = await listSavedHandles();
  return list.includes(handle);
}

export async function toggleSavedHandle(handle: string): Promise<boolean> {
  const s = await getSession();
  if (!s || s.syncPreference === null) return false;
  const list = await listSavedHandles();
  const nowSaved = !list.includes(handle);
  const next = nowSaved ? [...list, handle] : list.filter((h) => h !== handle);
  if (s.syncPreference === "device") {
    try {
      localStorage.setItem(DEVICE_SAVED_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    return nowSaved;
  }
  const u = readUser(s.email);
  if (!u) return false;
  writeUser({ ...u, savedHandles: next });
  return nowSaved;
}

export async function listOrders(): Promise<StoredOrder[]> {
  const s = await getSession();
  if (!s) return [];
  const u = readUser(s.email);
  return u?.orders ?? [];
}

export async function listGuestOrders(): Promise<StoredOrder[]> {
  if (typeof window === "undefined") return [];
  try {
    return readJson<StoredOrder[]>(localStorage.getItem("scentform-orders-guest")) ?? [];
  } catch {
    return [];
  }
}

export async function createOrder(order: StoredOrder): Promise<void> {
  const s = await getSession();
  if (!s) {
    try {
      const guest =
        readJson<StoredOrder[]>(localStorage.getItem("scentform-orders-guest")) ??
        [];
      guest.unshift(order);
      localStorage.setItem("scentform-orders-guest", JSON.stringify(guest));
    } catch {
      /* ignore */
    }
    return;
  }
  const u = readUser(s.email);
  if (!u) return;
  writeUser({ ...u, orders: [order, ...u.orders] });
}

export async function markWelcomePromoUsed(): Promise<void> {
  const s = await getSession();
  if (!s) return;
  const u = readUser(s.email);
  if (!u) return;
  writeUser({ ...u, welcomePromoUsed: true });
}

export async function getWelcomePromoEligible(): Promise<boolean> {
  const s = await getSession();
  if (!s) return false;
  const u = readUser(s.email);
  if (!u) return false;
  return !u.welcomePromoUsed;
}
