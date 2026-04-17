"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils/money";
import { useCartStore } from "@/store/cart-store";
import type { Product, ProductVariant } from "@/types/catalog";
import { getBestSellers, getProductByHandle } from "@/lib/data/catalog";
import { ProductCard } from "@/components/product/ProductCard";

export function CartView() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const subtotal = useCartStore((s) => s.subtotalCents());

  const resolved: {
    line: (typeof lines)[number];
    product: Product;
    variant: ProductVariant;
  }[] = [];

  for (const line of lines) {
    const product = getProductByHandle(line.productHandle);
    if (!product) continue;
    const variant = product.variants.find((v) => v.id === line.variantId);
    if (!variant) continue;
    resolved.push({ line, product, variant });
  }

  const suggested = getBestSellers().slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl">Cart</h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Review items, then continue to checkout.
      </p>

      {resolved.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border/70 bg-card/30 p-10 text-center">
          <p className="font-display text-2xl">Your cart is empty</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Start with a best seller, or take the quick quiz on the homepage.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/shop">Shop all</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/#scent-finder">Find your scent</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {resolved.map(({ line, product, variant }) => (
              <div
                key={line.variantId}
                className="flex gap-4 rounded-2xl border border-border/70 bg-card/40 p-4"
              >
                <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-border/60">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/products/${product.handle}`}
                        className="font-medium hover:text-primary"
                      >
                        {product.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {variant.concentrationLabel} · {variant.sizeLabel}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${product.title}`}
                      onClick={() => removeLine(line.variantId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/40 p-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          setQuantity(line.variantId, line.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {line.quantity}
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full"
                        aria-label="Increase quantity"
                        onClick={() =>
                          setQuantity(line.variantId, line.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatMoney(
                        variant.priceCents * line.quantity,
                        variant.currencyCode,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-border/70 bg-card/40 p-6">
              <h2 className="font-display text-2xl">Summary</h2>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">
                  {formatMoney(subtotal, "USD")}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Taxes and shipping are calculated at checkout.
              </p>
              <Button asChild className="mt-6 w-full rounded-full">
                <Link href="/checkout">Continue to checkout</Link>
              </Button>
              <Button asChild variant="outline" className="mt-3 w-full rounded-full">
                <Link href="/shop">Keep shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <section className="mt-16">
        <h2 className="font-display text-2xl">Often bought together</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {suggested.map((p) => (
            <ProductCard key={`cart-suggest-${p.handle}`} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
