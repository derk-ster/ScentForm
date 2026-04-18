"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Value = {
  /** Bottom-left minimized “10% off” chip is visible (mobile layout). */
  promoTeaserVisible: boolean;
  setPromoTeaserVisible: (visible: boolean) => void;
};

const PromoTeaserVisibilityContext = createContext<Value | null>(null);

export function PromoTeaserVisibilityProvider({ children }: { children: ReactNode }) {
  const [promoTeaserVisible, setPromoTeaserVisible] = useState(false);
  const value = useMemo(
    () => ({ promoTeaserVisible, setPromoTeaserVisible }),
    [promoTeaserVisible],
  );
  return (
    <PromoTeaserVisibilityContext.Provider value={value}>
      {children}
    </PromoTeaserVisibilityContext.Provider>
  );
}

export function usePromoTeaserVisibility() {
  const ctx = useContext(PromoTeaserVisibilityContext);
  return (
    ctx ?? {
      promoTeaserVisible: false,
      setPromoTeaserVisible: () => {},
    }
  );
}
