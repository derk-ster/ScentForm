"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

/**
 * With `persist.skipHydration`, storage is merged after mount so the first
 * client paint matches SSR and we avoid hydration mismatches from localStorage.
 */
export function CartRehydrate() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);
  return null;
}
