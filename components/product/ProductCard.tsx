"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Product } from "@/types/catalog";
import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/utils/money";
import { getDefaultVariant } from "@/lib/data/catalog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: Props) {
  const reduceMotion = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);
  const addLine = useCartStore((s) => s.addLine);
  const defaultVariant = getDefaultVariant(product);
  const image =
    hovered && product.hoverImage ? product.hoverImage : product.images[0];
  const fromPrice = Math.min(...product.variants.map((v) => v.priceCents));

  return (
    <motion.article
      layout={!reduceMotion}
      className={cn(
        "group overflow-hidden rounded-2xl border border-border/60 bg-card/50 transition hover:border-border",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/products/${product.handle}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
          <Image
            src={image}
            alt={`${product.title}`}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
            className={cn(
              "object-cover transition duration-500 ease-out",
              hovered ? "scale-[1.02]" : "scale-100",
            )}
            priority={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            {product.isNew ? (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                New
              </span>
            ) : null}
          </div>
        </div>
        <div className="space-y-2 px-4 pb-3 pt-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {product.collectionTitle}
          </p>
          <h3 className="font-display text-lg leading-snug">{product.title}</h3>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-3 border-t border-border/50 px-4 py-3">
        <p className="text-sm font-semibold tabular-nums">
          {formatMoney(fromPrice, "USD")}
        </p>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-9 w-9 rounded-full"
          aria-label={`Add ${product.title}`}
          onClick={() =>
            addLine({ product, variant: defaultVariant, quantity: 1 })
          }
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </motion.article>
  );
}
