"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/catalog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils/money";
import { getDefaultVariant } from "@/lib/data/catalog";
import { getProductUx, pickCardBadges } from "@/lib/data/product-ux";
import { motion, useReducedMotion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { useCartFly } from "@/components/cart/CartFlyAnimationProvider";
import { ProductBadges } from "@/components/product/ProductBadges";
import { ScentMeterBars } from "@/components/product/ScentMeterBars";

type Props = {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductQuickView({ product, open, onOpenChange }: Props) {
  const { playFrom } = useCartFly();
  const reduceMotion = useReducedMotion();
  const addLine = useCartStore((s) => s.addLine);
  const ux = getProductUx(product);
  const badges = pickCardBadges(product, 4);
  const defaultVariant = getDefaultVariant(product);
  const fromPrice = Math.min(...product.variants.map((v) => v.priceCents));

  const sizeOptions = Array.from(
    new Map(
      product.variants.map((v) => [
        `${v.concentrationLabel} · ${v.sizeLabel}`,
        v,
      ]),
    ).values(),
  ).slice(0, 6);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92dvh,calc(100svh-1rem))] w-[min(100%,calc(100vw-1rem))] max-w-lg gap-0 overflow-y-auto border-border/80 bg-card p-0 sm:rounded-xl">
        <div className="grid gap-0 sm:grid-cols-[min(220px,42%)_1fr] sm:gap-0">
          <div className="relative aspect-[3/4] w-full bg-muted/30 sm:aspect-auto sm:min-h-[280px]">
            <Image
              src={product.images[0]}
              alt=""
              fill
              className="object-cover sm:rounded-l-xl"
              sizes="(min-width: 640px) 220px, 100vw"
            />
          </div>
          <div className="flex flex-col gap-3 p-5 sm:p-6">
            <DialogHeader className="space-y-1 text-left">
              <DialogDescription className="sr-only">
                Quick view for {product.title}. {product.description.slice(0, 160)}
              </DialogDescription>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {product.collectionTitle}
              </p>
              <DialogTitle className="font-display text-xl leading-snug sm:text-2xl">
                {product.title}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm font-semibold tabular-nums">
              From {formatMoney(fromPrice, "USD")}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
              {product.description}
            </p>
            <ProductBadges badges={badges} size="sm" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Best for
              </p>
              <p className="mt-1 text-sm text-foreground">{ux.bestFor}</p>
            </div>
            <ScentMeterBars meters={ux.meters} compact />
            {sizeOptions.length > 0 ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Popular sizes
                </p>
                <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                  {sizeOptions.map((v) => (
                    <li key={v.id}>
                      {v.concentrationLabel} · {v.sizeLabel} ·{" "}
                      {formatMoney(v.priceCents, v.currencyCode)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
              <motion.div
                className="w-full sm:flex-1"
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                <Button
                  type="button"
                  className="w-full"
                  onClick={(e) => {
                    playFrom(e.currentTarget);
                    addLine({ product, variant: defaultVariant, quantity: 1 });
                    onOpenChange(false);
                  }}
                >
                  Add to cart
                </Button>
              </motion.div>
              <Button asChild variant="outline" className="w-full sm:flex-1">
                <Link href={`/products/${product.handle}`}>View full product</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
