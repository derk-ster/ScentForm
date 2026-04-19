"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, Sparkles, ZoomIn } from "lucide-react";
import type { ConcentrationHandle, Product, ProductVariant } from "@/types/catalog";
import { NotePyramid } from "@/components/product/NotePyramid";
import { ScentProfileMeters } from "@/components/product/ScentProfileMeters";
import { ProductCard } from "@/components/product/ProductCard";
import { ImageLightbox } from "@/components/product/ImageLightbox";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils/money";
import {
  getDefaultVariant,
  getProductByHandle,
  getReviewSummary,
} from "@/lib/data/catalog";
import { useCartStore } from "@/store/cart-store";
import { useCartFly } from "@/components/cart/CartFlyAnimationProvider";
import { concentrations } from "@/lib/data/concentrations";
import { getSmellsLike } from "@/lib/data/smellsLike";
import { getPdpEmojis } from "@/lib/data/product-ux";
import { PdpEmojiRain } from "@/components/product/PdpEmojiRain";
import { SaveProductHeart } from "@/components/account/SaveProductHeart";

type Props = {
  product: Product;
};

function variantsForConcentration(product: Product, c: ConcentrationHandle) {
  return product.variants.filter((v) => v.concentration === c);
}

export function ProductPageView({ product }: Props) {
  const isLifestyle = product.listingKind === "lifestyle";
  const router = useRouter();
  const { playFrom } = useCartFly();
  const reduceMotion = useReducedMotion();
  const addLine = useCartStore((s) => s.addLine);
  const clearCart = useCartStore((s) => s.clear);
  const defaultVariant = useMemo(() => getDefaultVariant(product), [product]);
  const [concentration, setConcentration] = useState<ConcentrationHandle>(
    defaultVariant.concentration,
  );
  const [variant, setVariant] = useState<ProductVariant>(defaultVariant);
  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const sizes = useMemo(
    () => variantsForConcentration(product, concentration),
    [product, concentration],
  );

  /**
   * Soft navigation reuses this component — reset so we never pair a new product
   * with the last product's variant (invalid ids / inconsistent state / FM glitches).
   */
  useEffect(() => {
    const v0 = getDefaultVariant(product);
    setConcentration(v0.concentration);
    setVariant(v0);
    setQty(1);
    setImageIndex(0);
    setLightboxOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when product identity (handle) changes
  }, [product.handle]);

  useEffect(() => {
    const still = sizes.find((v) => v.id === variant.id);
    if (!still) {
      const next = sizes[0];
      if (next) setVariant(next);
    }
  }, [concentration, sizes, variant.id]);

  const review = getReviewSummary(product.handle);
  const related =
    product.relatedHandles
      ?.map((h) => getProductByHandle(h))
      .filter(Boolean) as Product[] | undefined;

  const activeImage = product.images[imageIndex] ?? product.images[0];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/40">
            <button
              type="button"
              className="group relative block aspect-[3/4] w-full"
              onClick={() => setLightboxOpen(true)}
              aria-label="Open image zoom"
            >
              <Image
                src={activeImage}
                alt={`${product.title} product`}
                fill
                priority
                className="object-cover transition duration-700 group-hover:scale-[1.02]"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs text-stone-100 backdrop-blur">
                <ZoomIn className="h-3.5 w-3.5" />
                Zoom
              </div>
            </button>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {product.images.map((src, idx) => (
              <button
                key={src}
                type="button"
                onClick={() => setImageIndex(idx)}
                className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border ${
                  idx === imageIndex
                    ? "border-primary/70"
                    : "border-border/60"
                }`}
                aria-label={`Show image ${idx + 1}`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/40 p-6 sm:p-8">
            <PdpEmojiRain emojis={getPdpEmojis(product)} seed={product.handle} />
            <div className="relative z-[2]">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {product.productTypeLabel}
              <span className="mx-2 text-border">·</span>
              {product.categoryTitle}
              {product.brand ? (
                <>
                  <span className="mx-2 text-border">·</span>
                  {product.brand}
                </>
              ) : null}
            </p>
            <div className="mt-2 flex items-start justify-between gap-3">
              <h1 className="font-display text-4xl leading-tight">{product.title}</h1>
              <SaveProductHeart handle={product.handle} size="md" className="shrink-0" />
            </div>
            {product.tagline ? (
              <p className="mt-2 text-sm text-primary">{product.tagline}</p>
            ) : null}
            <p className="mt-3 text-xs text-muted-foreground">
              {review.average.toFixed(1)}★ · {review.count} reviews
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {(() => {
              const dupe = getSmellsLike(product.handle);
              if (!dupe) return null;
              return (
                <div className="mt-5 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/95 via-amber-50/60 to-amber-100/40 px-4 py-3.5 shadow-sm dark:border-amber-900/50 dark:from-amber-950/35 dark:via-amber-950/20 dark:to-amber-950/10">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-900/90 dark:text-amber-200/90">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    Smells like
                  </div>
                  <p className="mt-2 text-sm leading-snug text-amber-950/95 dark:text-amber-50/95">
                    <span className="font-medium text-amber-950 dark:text-amber-50">
                      {dupe.brand} {dupe.name}
                    </span>
                    <span className="text-amber-900/75 dark:text-amber-100/70">
                      {" "}
                      · {dupe.note}
                    </span>
                  </p>
                  <p className="mt-2 text-[10px] leading-relaxed text-amber-900/55 dark:text-amber-200/50">
                    Scent resemblance only — ALLURA 7 is not affiliated with{" "}
                    {dupe.brand}.
                  </p>
                </div>
              );
            })()}

            <div className="mt-8 space-y-4">
              {!isLifestyle ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Concentration
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {concentrations.map((c) => {
                      const exists = product.variants.some(
                        (v) => v.concentration === c.handle,
                      );
                      if (!exists) return null;
                      return (
                        <Button
                          key={c.handle}
                          type="button"
                          size="sm"
                          variant={
                            concentration === c.handle ? "default" : "outline"
                          }
                          onClick={() => setConcentration(c.handle)}
                        >
                          {c.shortLabel}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              {sizes.length > 1 ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {isLifestyle ? "Choose an option" : "Size"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sizes.map((v) => (
                      <Button
                        key={v.id}
                        type="button"
                        size="sm"
                        variant={variant.id === v.id ? "default" : "outline"}
                        onClick={() => setVariant(v)}
                      >
                        {v.sizeLabel}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="mt-1 font-display text-3xl">
                  {formatMoney(variant.priceCents, variant.currencyCode)}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/40 p-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-sm">{qty}</span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <motion.div
                className="flex-1"
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                <Button
                  type="button"
                  className="w-full rounded-full"
                  onClick={(e) => {
                    playFrom(e.currentTarget);
                    addLine({ product, variant, quantity: qty });
                  }}
                >
                  Add to cart
                </Button>
              </motion.div>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => {
                  clearCart();
                  addLine({ product, variant, quantity: qty });
                  router.push("/checkout");
                }}
              >
                Checkout
              </Button>
            </div>

            <div className="mt-6 grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-background/30 p-3">
                <p className="text-[11px] uppercase tracking-wide text-foreground/80">
                  Shipping
                </p>
                <p className="mt-1">Confirmed at checkout.</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/30 p-3">
                <p className="text-[11px] uppercase tracking-wide text-foreground/80">
                  Returns
                </p>
                <p className="mt-1">See refund policy.</p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-14 space-y-4">
        <h2 className="font-display text-2xl">
          {isLifestyle ? "Character notes" : "Notes"}
        </h2>
        <NotePyramid notes={product.notes} />
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl">
            {isLifestyle ? "At a glance" : "Profile"}
          </h2>
          <div className="mt-6">
            {isLifestyle ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.subtitle ?? product.tagline ?? product.description}
              </p>
            ) : (
              <ScentProfileMeters profile={product.profile} />
            )}
          </div>
          {!isLifestyle ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.profile.occasions.map((o) => (
                <span
                  key={o}
                  className="rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs text-muted-foreground"
                >
                  {o}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="rounded-3xl border border-border/70 bg-card/40 p-6">
          <h3 className="font-display text-2xl">Specifications</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-6 border-b border-border/40 pb-3">
              <dt className="text-muted-foreground">
                {isLifestyle ? "Format" : "Concentration"}
              </dt>
              <dd>{variant.concentrationLabel}</dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-border/40 pb-3">
              <dt className="text-muted-foreground">Volume</dt>
              <dd>{variant.sizeLabel}</dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-border/40 pb-3">
              <dt className="text-muted-foreground">Longevity</dt>
              <dd>{product.specifications.longevity}</dd>
            </div>
            <div className="flex justify-between gap-6 border-b border-border/40 pb-3">
              <dt className="text-muted-foreground">Sillage</dt>
              <dd>{product.specifications.sillage}</dd>
            </div>
            {product.specifications.countryOfOrigin ? (
              <div className="flex justify-between gap-6 border-b border-border/40 pb-3">
                <dt className="text-muted-foreground">Origin</dt>
                <dd>{product.specifications.countryOfOrigin}</dd>
              </div>
            ) : null}
            {product.specifications.packagingMaterials ? (
              <div className="flex justify-between gap-6">
                <dt className="text-muted-foreground">Packaging</dt>
                <dd className="text-right">
                  {product.specifications.packagingMaterials}
                </dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {product.claims.crueltyFree ? (
              <span className="rounded-full border border-border/60 px-2 py-1">
                Cruelty-free
              </span>
            ) : null}
            {product.claims.phthalateFree ? (
              <span className="rounded-full border border-border/60 px-2 py-1">
                Phthalate-free
              </span>
            ) : null}
            {product.claims.parabenFree ? (
              <span className="rounded-full border border-border/60 px-2 py-1">
                Paraben-free
              </span>
            ) : null}
            {product.claims.dyeFree ? (
              <span className="rounded-full border border-border/60 px-2 py-1">
                Dye-free
              </span>
            ) : null}
            {product.claims.recyclablePackaging ? (
              <span className="rounded-full border border-border/60 px-2 py-1">
                Recyclable packaging
              </span>
            ) : null}
            {product.claims.madeInUSA ? (
              <span className="rounded-full border border-border/60 px-2 py-1">
                Made in USA
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {related?.length ? (
        <section className="mt-16">
          <h2 className="font-display text-3xl">You may also like</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      <ImageLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        src={activeImage}
        alt={`${product.title} enlarged`}
        title={`${product.title} image`}
      />
    </div>
  );
}
