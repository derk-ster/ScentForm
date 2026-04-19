"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { PrimaryCategoryHandle, Product } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { filterProducts, type ShopFilters } from "@/lib/data/filters";
import { getDefaultVariant } from "@/lib/data/catalog";
import { formatMoney } from "@/lib/utils/money";

type QuizVariant = "body" | "perfume" | "generic";

type Props = {
  seedProducts: Product[];
  scope: "category" | "shop" | "collection";
  category?: PrimaryCategoryHandle | null;
  collectionHandle?: string | null;
  /** Short CTA, e.g. “Match me” */
  triggerLabel?: string;
  className?: string;
};

function inferVariant(
  category: PrimaryCategoryHandle | null | undefined,
  seed: Product[],
): QuizVariant {
  if (category === "body") return "body";
  if (category === "perfumes-colognes") return "perfume";
  if (seed.length) {
    const first = seed[0]!.primaryCategory;
    if (seed.every((p) => p.primaryCategory === first)) {
      if (first === "body") return "body";
      if (first === "perfumes-colognes") return "perfume";
    }
  }
  return "generic";
}

function buildShopHref(filters: ShopFilters): string {
  const p = new URLSearchParams();
  if (filters.category) p.set("category", filters.category);
  if (filters.collection) p.set("collection", filters.collection);
  if (filters.gender) p.set("gender", filters.gender);
  if (filters.scentFamily) p.set("family", filters.scentFamily);
  if (filters.mood) p.set("mood", filters.mood);
  if (filters.note) p.set("note", filters.note);
  if (filters.budget) p.set("budget", filters.budget);
  if (filters.q) p.set("q", filters.q);
  p.set("sort", filters.sort ?? "featured");
  const qs = p.toString();
  return qs ? `/shop?${qs}#shop-catalog` : "/shop#shop-catalog";
}

export function ContextMatchQuiz({
  seedProducts,
  scope,
  category = null,
  collectionHandle = null,
  triggerLabel = "Match me",
  className,
}: Props) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const variant = useMemo(
    () => inferVariant(category, seedProducts),
    [category, seedProducts],
  );

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [a1, setA1] = useState<string | null>(null);
  const [a2, setA2] = useState<string | null>(null);
  const [a3, setA3] = useState<string | null>(null);

  const reset = () => {
    setStep(0);
    setA1(null);
    setA2(null);
    setA3(null);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  const baseFilters = useMemo((): ShopFilters => {
    return {
      sort: "featured",
      category: category ?? null,
      collection: collectionHandle ?? null,
    };
  }, [category, collectionHandle]);

  const resolvedFilters = useMemo((): ShopFilters => {
    const f: ShopFilters = { ...baseFilters };
    if (variant === "perfume") {
      if (a1 === "men" || a1 === "women" || a1 === "unisex") f.gender = a1;
      if (
        a2 === "fresh" ||
        a2 === "woody" ||
        a2 === "sweet" ||
        a2 === "floral" ||
        a2 === "luxury"
      ) {
        f.scentFamily = a2;
      }
      if (a3 === "value") f.budget = "under-20";
      else if (a3 === "core") f.budget = "20-40";
      else if (a3 === "splurge") f.budget = "premium-picks";
    } else if (variant === "body") {
      if (a1 === "wash") f.q = "wash";
      else if (a1 === "lotion") f.q = "lotion";
      else if (a1 === "mist") f.q = "mist";
      else if (a1 === "butter-oil") f.q = "butter";
      if (a2 === "warm") f.mood = "warm";
      else if (a2 === "clean") f.mood = "clean";
      if (a3 === "value") f.budget = "under-20";
      else if (a3 === "core") f.budget = "20-40";
      else if (a3 === "splurge") f.budget = "premium-picks";
    } else {
      if (a1 === "warm") f.mood = "warm";
      else if (a1 === "clean") f.mood = "clean";
      if (a2 === "woods") f.note = "woods";
      else if (a2 === "citrus") f.note = "citrus";
      else if (a2 === "vanilla") f.note = "vanilla";
      if (a3 === "value") f.budget = "under-20";
      else if (a3 === "core") f.budget = "20-40";
      else if (a3 === "splurge") f.budget = "premium-picks";
    }
    return f;
  }, [baseFilters, variant, a1, a2, a3]);

  const matches = useMemo(() => {
    if (step < 3) return [];
    let out = filterProducts(seedProducts, resolvedFilters);
    if (out.length === 0) {
      const loose: ShopFilters = { ...baseFilters, sort: "featured" };
      if (variant === "perfume" && a1) loose.gender = a1 as ShopFilters["gender"];
      if (variant === "body" && a1) loose.q = a1 === "butter-oil" ? "oil" : a1;
      if (variant === "generic" && a1) loose.mood = a1 as "warm" | "clean";
      out = filterProducts(seedProducts, loose);
    }
    if (out.length === 0) out = seedProducts.slice(0, 6);
    return out.slice(0, 6);
  }, [step, seedProducts, resolvedFilters, baseFilters, variant, a1]);

  const top = matches[0];
  const shopHref = buildShopHref(resolvedFilters);

  const step1 =
    variant === "perfume"
      ? {
          title: "Who is it for?",
          options: [
            { id: "women", label: "Women" },
            { id: "men", label: "Men" },
            { id: "unisex", label: "Unisex" },
          ],
        }
      : variant === "body"
        ? {
            title: "What format?",
            options: [
              { id: "wash", label: "Wash & gel" },
              { id: "lotion", label: "Lotions" },
              { id: "mist", label: "Mists" },
              { id: "butter-oil", label: "Butters & oils" },
            ],
          }
        : {
            title: "Which direction?",
            options: [
              { id: "clean", label: "Clean & lifted" },
              { id: "warm", label: "Warm & wrapped" },
            ],
          };

  const step2 =
    variant === "perfume"
      ? {
          title: "Scent family?",
          options: [
            { id: "fresh", label: "Fresh" },
            { id: "woody", label: "Woody" },
            { id: "floral", label: "Floral" },
            { id: "sweet", label: "Sweet" },
            { id: "luxury", label: "Luxury" },
          ],
        }
      : variant === "body"
        ? {
            title: "Skin feel?",
            options: [
              { id: "clean", label: "Crisp & airy" },
              { id: "warm", label: "Rich & cocooning" },
            ],
          }
        : {
            title: "Lead note?",
            options: [
              { id: "woods", label: "Woods & resin" },
              { id: "citrus", label: "Citrus & lift" },
              { id: "vanilla", label: "Vanilla warmth" },
            ],
          };

  const step3 = {
    title: "Budget?",
    options: [
      { id: "value", label: "Value picks" },
      { id: "core", label: "Core edit" },
      { id: "splurge", label: "Splurge-worthy" },
    ],
  };

  const pick = (value: string) => {
    if (step === 0) setA1(value);
    else if (step === 1) setA2(value);
    else if (step === 2) setA3(value);
    if (step < 2) setStep((s) => s + 1);
    else if (step === 2) setStep(3);
  };

  if (seedProducts.length === 0) return null;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={className}
        onClick={() => setOpen(true)}
      >
        <Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden />
        {triggerLabel}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md gap-0 overflow-hidden p-0 sm:max-w-md">
          <DialogHeader className="border-b border-border/60 px-5 py-4 text-left">
            <DialogTitle className="font-display text-xl">
              {step < 3 ? "Quick match" : "Your edit"}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              {scope === "category"
                ? "Three taps — tuned to this category."
                : scope === "collection"
                  ? "Three taps — tuned to this collection."
                  : "Three taps — tuned to your filters."}
            </p>
          </DialogHeader>

          <div className="px-5 py-4">
            <AnimatePresence mode="wait" initial={false}>
              {step === 0 ? (
                <motion.div
                  key="s1"
                  initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <p className="text-sm font-medium">{step1.title}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {step1.options.map((o) => (
                      <Button
                        key={o.id}
                        type="button"
                        variant="outline"
                        className="h-auto min-h-[44px] justify-center px-3 py-2 text-sm"
                        onClick={() => pick(o.id)}
                      >
                        {o.label}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              ) : null}

              {step === 1 ? (
                <motion.div
                  key="s2"
                  initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <p className="text-sm font-medium">{step2.title}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {step2.options.map((o) => (
                      <Button
                        key={o.id}
                        type="button"
                        variant="outline"
                        className="h-auto min-h-[44px] justify-center px-3 py-2 text-sm"
                        onClick={() => pick(o.id)}
                      >
                        {o.label}
                      </Button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => setStep(0)}
                  >
                    Back
                  </Button>
                </motion.div>
              ) : null}

              {step === 2 ? (
                <motion.div
                  key="s3"
                  initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <p className="text-sm font-medium">{step3.title}</p>
                  <div className="grid gap-2">
                    {step3.options.map((o) => (
                      <Button
                        key={o.id}
                        type="button"
                        variant="outline"
                        className="h-auto min-h-[44px] justify-center px-3 py-2 text-sm"
                        onClick={() => pick(o.id)}
                      >
                        {o.label}
                      </Button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                </motion.div>
              ) : null}

              {step === 3 ? (
                <motion.div
                  key="done"
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {top ? (
                    <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Top pick
                      </p>
                      <p className="mt-1 font-display text-lg">{top.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        From {formatMoney(
                          getDefaultVariant(top).priceCents,
                          getDefaultVariant(top).currencyCode,
                        )}
                      </p>
                      <Button type="button" className="mt-3 w-full rounded-full" asChild>
                        <Link href={`/products/${top.handle}`} onClick={() => setOpen(false)}>
                          View product
                        </Link>
                      </Button>
                    </div>
                  ) : null}

                  {matches.length > 1 ? (
                    <div className="grid max-h-48 gap-2 overflow-y-auto pr-1">
                      {matches.slice(1, 4).map((p) => (
                        <Link
                          key={p.handle}
                          href={`/products/${p.handle}`}
                          className="truncate rounded-lg border border-border/50 bg-background/40 px-3 py-2 text-sm hover:border-primary/40"
                          onClick={() => setOpen(false)}
                        >
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      className="flex-1 rounded-full"
                      onClick={() => {
                        setOpen(false);
                        router.push(shopHref);
                      }}
                    >
                      View in shop
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 rounded-full"
                      onClick={reset}
                    >
                      Start over
                    </Button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
