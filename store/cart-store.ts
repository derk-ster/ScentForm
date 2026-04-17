"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addLine: ({ product, variant, quantity = 1 }) => {
        set((state) => {
          const existing = state.lines.find((l) => l.variantId === variant.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.variantId === variant.id
                  ? { ...l, quantity: l.quantity + quantity }
                  : l,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
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
        set((state) => ({
          lines: state.lines.map((l) =>
            l.variantId === variantId ? { ...l, quantity } : l,
          ),
        }));
      },
      removeLine: (variantId) => {
        set((state) => ({
          lines: state.lines.filter((l) => l.variantId !== variantId),
        }));
      },
      clear: () => set({ lines: [] }),
      itemCount: () =>
        get().lines.reduce((acc, l) => acc + l.quantity, 0),
      subtotalCents: () =>
        get().lines.reduce((acc, line) => {
          const product =
            getProductByHandle(line.productHandle) ??
            getCatalog().find((p) => p.handle === line.productHandle);
          if (!product) return acc;
          const variant = findVariant(product, line.variantId);
          if (!variant) return acc;
          return acc + variant.priceCents * line.quantity;
        }, 0),
    }),
    { name: "scentform-cart" },
  ),
);
