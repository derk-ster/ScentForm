"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product, ProductVariant } from "@/types/catalog";
import { getCatalog, getProductByHandle } from "@/lib/data/catalog";

export type CartLine = {
  productHandle: string;
  variantId: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  addLine: (input: {
    product: Product;
    variant: ProductVariant;
    quantity?: number;
  }) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  clear: () => void;
  itemCount: () => number;
  subtotalCents: () => number;
};

function findVariant(product: Product, variantId: string) {
  return product.variants.find((v) => v.id === variantId);
}

const cartPersistStorage = createJSONStorage(() => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  const { localStorage } = window;
  return {
    getItem: (name) => {
      try {
        return localStorage.getItem(name);
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        localStorage.setItem(name, value);
      } catch {
        /* quota / private mode — in-memory cart still works for the session */
      }
    },
    removeItem: (name) => {
      try {
        localStorage.removeItem(name);
      } catch {
        /* ignore */
      }
    },
  };
});

function normalizeLines(lines: unknown): CartLine[] {
  if (!Array.isArray(lines)) return [];
  return lines.filter(
    (l): l is CartLine =>
      !!l &&
      typeof l === "object" &&
      typeof (l as CartLine).productHandle === "string" &&
      typeof (l as CartLine).variantId === "string" &&
      typeof (l as CartLine).quantity === "number",
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addLine: ({ product, variant, quantity = 1 }) => {
        set((state) => {
          const lines = normalizeLines(state.lines);
          const existing = lines.find((l) => l.variantId === variant.id);
          if (existing) {
            return {
              lines: lines.map((l) =>
                l.variantId === variant.id
                  ? { ...l, quantity: l.quantity + quantity }
                  : l,
              ),
            };
          }
          return {
            lines: [
              ...lines,
              {
                productHandle: product.handle,
                variantId: variant.id,
                quantity,
              },
            ],
          };
        });
      },
      setQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeLine(variantId);
          return;
        }
        set((state) => {
          const lines = normalizeLines(state.lines);
          return {
            lines: lines.map((l) =>
              l.variantId === variantId ? { ...l, quantity } : l,
            ),
          };
        });
      },
      removeLine: (variantId) => {
        set((state) => ({
          lines: normalizeLines(state.lines).filter(
            (l) => l.variantId !== variantId,
          ),
        }));
      },
      clear: () => set({ lines: [] }),
      itemCount: () => {
        const lines = normalizeLines(get().lines);
        return lines.reduce((acc, l) => acc + l.quantity, 0);
      },
      subtotalCents: () => {
        const lines = normalizeLines(get().lines);
        return lines.reduce((acc, line) => {
          const product =
            getProductByHandle(line.productHandle) ??
            getCatalog().find((p) => p.handle === line.productHandle);
          if (!product) return acc;
          const variant = findVariant(product, line.variantId);
          if (!variant) return acc;
          return acc + variant.priceCents * line.quantity;
        }, 0);
      },
    }),
    {
      name: "scentform-cart",
      storage: cartPersistStorage,
      partialize: (state) => ({ lines: state.lines }),
      merge: (persistedState, currentState) => {
        const p = persistedState as Partial<Pick<CartState, "lines">> | undefined;
        const mergedLines = normalizeLines(
          p?.lines !== undefined ? p.lines : currentState.lines,
        );
        return { ...currentState, lines: mergedLines };
      },
      skipHydration: true,
    },
  ),
);
