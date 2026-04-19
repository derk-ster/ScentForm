"use client";

import { useEffect } from "react";
import { useAccountStore } from "@/store/account-store";

export function AccountSessionHydrate() {
  const refresh = useAccountStore((s) => s.refresh);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return null;
}
