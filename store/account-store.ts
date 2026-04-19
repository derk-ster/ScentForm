"use client";

import { create } from "zustand";
import type { AccountSession } from "@/lib/account/types";
import * as account from "@/lib/account/account-service";

type AccountState = {
  session: AccountSession | null;
  hydrated: boolean;
  refresh: () => Promise<void>;
  setSession: (s: AccountSession | null) => void;
};

export const useAccountStore = create<AccountState>((set) => ({
  session: null,
  hydrated: false,
  refresh: async () => {
    const session = await account.getSession();
    set({ session, hydrated: true });
  },
  setSession: (session) => set({ session }),
}));
