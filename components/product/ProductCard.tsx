"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Plus } from "lucide-react";
import type { Product } from "@/types/catalog";
import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/utils/money";
import { getDefaultVariant } from "@/lib/data/catalog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { pickCardBadges, getProductUx } from "@/lib/data/product-ux";
import { ProductBadges } from "@/components/product/ProductBadges";
import { ScentMeterBars } from "@/components/product/ScentMeterBars";
import { ProductQuickView } from "@/components/product/ProductQuickView";
import { useCartFly } from "@/components/cart/CartFlyAnimationProvider";

type Props = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: Props) {
  const reduceMotion = usePrefersReducedMotion();
  const { playFrom } = useCartFly();
  const addToCartRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const addLine = useCartStore((s) => s.addLine);
  const defaultVariant = getDefaultVariant(product);
  const ux = getProductUx(product);
  const image =
    hovered && product.hoverImage ? product.hoverImage : product.images[0];
  const fromPrice = Math.min(...product.variants.map((v) => v.priceCents));
  const badges = pickCardBadges(product, 4);

  return (
    <>
      <motion.article
        className={cn(
          "group overflow-hidden rounded-2xl border border-border/60 bg-card/50 transition hover:border-border",
          className,
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
          <Link
            href={`/products/${product.handle}`}
            className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            aria-label={`View ${product.title}`}
          >
            <span className="sr-only">View product</span>
          </Link>
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
            className={cn(
              "object-cover transition duration-500 ease-out",
              hovered ? "scale-[1.02]" : "scale-100",
            )}
            priority={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
            {product.isNew ? (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                New
              </span>
            ) : null}
          </div>
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between gap-2">
            <div className="pointer-events-auto max-w-[70%]">
              <ProductBadges badges={badges} />
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="pointer-events-auto h-8 shrink-0 gap-1 rounded-full px-2.5 text-[11px]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickOpen(true);
              }}
            >
              <Eye className="h-3.5 w-3.5" aria-hidden />
              Quick view
            </Button>
          </div>
        </div>
        <div className="space-y-2 px-4 pb-2 pt-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {product.collectionTitle}
          </p>
          <Link
            href={`/products/${product.handle}`}
            className="block font-display text-lg leading-snug text-foreground hover:text-primary"
          >
            {product.title}
          </Link>
          <ScentMeterBars meters={ux.meters} compact className="pt-1" />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border/50 px-4 py-3">
          <p className="text-sm font-semibold tabular-nums">
            {formatMoney(fromPrice, "USD")}
          </p>
          <motion.span
            className="inline-flex shrink-0 rounded-full"
            whileTap={reduceMotion ? undefined : { scale: 0.88 }}
          >
            <Button
              ref={addToCartRef}
              type="button"
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full"
              aria-label={`Add ${product.title} to cart`}
              onClick={() => {
                playFrom(addToCartRef.current);
                addLine({ product, variant: defaultVariant, quantity: 1 });
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </motion.span>
        </div>
      </motion.article>
      <ProductQuickView
        product={product}
        open={quickOpen}
        onOpenChange={setQuickOpen}
      />
    </>
  );
}
