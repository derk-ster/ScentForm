"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Check, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import {
  getCatalog,
  getDefaultVariant,
  getProductsForHomeScent,
  getNewArrivals,
} from "@/lib/data/catalog";
import { formatMoney } from "@/lib/utils/money";
import type { PrimaryCategoryHandle, Product, ProductVariant } from "@/types/catalog";
import { useCartStore } from "@/store/cart-store";
import { useCartFly } from "@/components/cart/CartFlyAnimationProvider";
import {
  minVariantPriceCents,
  pickCardBadges,
  quizExplainMatch,
  getProductUx,
} from "@/lib/data/product-ux";
import { ProductBadges } from "@/components/product/ProductBadges";

type ShopForAnswer = "body" | "home" | "gift" | "new";
type MoodAnswer = "clean" | "warm" | "spiced" | "gourmand";
type PresenceAnswer = "soft" | "balanced" | "bold";
type BudgetAnswer = "value" | "core" | "splurge";
type PriorityAnswer = "everyday" | "evening" | "statement" | "surprise";

export type DiscoveryAnswers = {
  shopFor: ShopForAnswer;
  mood: MoodAnswer;
  presence: PresenceAnswer;
  budget: BudgetAnswer;
  priority: PriorityAnswer;
};

type DiscoveryStepId = keyof DiscoveryAnswers;

const STEP_ORDER: DiscoveryStepId[] = [
  "shopFor",
  "mood",
  "presence",
  "budget",
  "priority",
];

type StepDef = {
  id: DiscoveryStepId;
  title: string;
  subtitle: string;
  columns: 2 | 3 | 4;
  options: {
    label: string;
    caption?: string;
    value:
      | ShopForAnswer
      | MoodAnswer
      | PresenceAnswer
      | BudgetAnswer
      | PriorityAnswer;
  }[];
};

const DISCOVERY_STEPS: StepDef[] = [
  {
    id: "shopFor",
    title: "What are you shopping for?",
    subtitle: "We’ll tune the next four questions to this lane.",
    columns: 2,
    options: [
      { label: "For your body", caption: "Fragrance & care", value: "body" },
      { label: "For your home", caption: "Mist, wax, incense, diffusers", value: "home" },
      { label: "For a gift", caption: "Mix of categories", value: "gift" },
      { label: "Something new", caption: "Arrivals & highlights", value: "new" },
    ],
  },
  {
    id: "mood",
    title: "Which mood fits best?",
    subtitle: "Skin, space, or gift — same directional language.",
    columns: 2,
    options: [
      { label: "Clean & crisp", caption: "Citrus, air, lift", value: "clean" },
      { label: "Warm & resinous", caption: "Amber, woods, wrap", value: "warm" },
      { label: "Spiced & textured", caption: "Pepper, tea, smoke", value: "spiced" },
      { label: "Soft gourmand", caption: "Vanilla, fig, comfort", value: "gourmand" },
    ],
  },
  {
    id: "presence",
    title: "How much presence do you want?",
    subtitle: "Close to skin, balanced, or fills the room.",
    columns: 3,
    options: [
      { label: "Soft & close", caption: "Intimate radius", value: "soft" },
      { label: "Balanced", caption: "Clear but polite", value: "balanced" },
      { label: "Bold", caption: "Statement throw", value: "bold" },
    ],
  },
  {
    id: "budget",
    title: "Budget comfort zone",
    subtitle: "We’ll keep the trio near this lane.",
    columns: 3,
    options: [
      { label: "Under $40", caption: "Smart tests", value: "value" },
      { label: "$40 – $60", caption: "Core buys", value: "core" },
      { label: "$60+", caption: "Room for splurge", value: "splurge" },
    ],
  },
  {
    id: "priority",
    title: "What matters most right now?",
    subtitle: "One last nudge before we show three picks.",
    columns: 2,
    options: [
      { label: "Everyday rhythm", caption: "Reach-for staples", value: "everyday" },
      { label: "After hours", caption: "Evenings & occasions", value: "evening" },
      { label: "Statement & space", caption: "Presence in the room", value: "statement" },
      { label: "Surprise me", caption: "Newness & editor energy", value: "surprise" },
    ],
  },
];

function budgetMatchesCents(budget: BudgetAnswer, cents: number) {
  const d = cents / 100;
  if (budget === "value") return d < 40;
  if (budget === "core") return d >= 40 && d <= 60;
  return d > 55;
}

type Scored = { p: Product; score: number; ref: ProductVariant };

function personalCatalog(): Product[] {
  return getCatalog().filter(
    (p) =>
      p.primaryCategory === "perfumes-colognes" ||
      p.primaryCategory === "body",
  );
}

const HOME_PRIMARY: PrimaryCategoryHandle[] = [
  "home",
  "incense",
  "diffuser-machines",
  "diffuser-oils",
];

function poolFor(a: DiscoveryAnswers): Product[] {
  switch (a.shopFor) {
    case "body":
      return personalCatalog();
    case "home":
      return getProductsForHomeScent();
    case "gift":
      return getCatalog().filter((p) => p.giftable);
    case "new":
      return dedupeProducts([
        ...getNewArrivals(),
        ...getCatalog().filter((p) => p.featured),
      ]);
    default:
      return getCatalog();
  }
}

function dedupeProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of products) {
    if (seen.has(p.handle)) continue;
    seen.add(p.handle);
    out.push(p);
  }
  return out;
}

function scoreDiscovery(a: DiscoveryAnswers): Scored[] {
  const pool = poolFor(a);
  return pool
    .map((p) => {
      let score = 0;
      const hay = [
        ...p.notes.top,
        ...p.notes.heart,
        ...p.notes.base,
        p.title,
        p.description,
      ]
        .join(" ")
        .toLowerCase();
      const ux = getProductUx(p);

      if (a.mood === "clean" && p.profile.freshness >= 4) score += 3;
      if (a.mood === "warm" && p.profile.warmth >= 4) score += 3;
      if (
        a.mood === "spiced" &&
        /tobacco|pepper|cinnamon|ginger|saffron|leather|smoke|resin/.test(hay)
      )
        score += 3;
      if (
        a.mood === "gourmand" &&
        /vanilla|tonka|marshmallow|caramel|milk|fig|sweet/.test(hay)
      )
        score += 3;

      if (a.presence === "soft" && p.profile.intensity <= 3) score += 2;
      if (
        a.presence === "balanced" &&
        p.profile.intensity >= 2 &&
        p.profile.intensity <= 4
      )
        score += 2;
      if (a.presence === "bold" && p.profile.intensity >= 4) score += 3;

      const ref = getDefaultVariant(p);
      if (budgetMatchesCents(a.budget, ref.priceCents)) score += 2;

      if (a.priority === "everyday") {
        if (
          ux.occasions.includes("casual-everyday") ||
          ux.occasions.includes("school-work")
        )
          score += 2;
        if (p.profile.intensity <= 3) score += 1;
      }
      if (a.priority === "evening") {
        if (ux.badges.includes("date-night") || ux.occasions.includes("date-night"))
          score += 2;
        if (p.profile.intensity >= 3) score += 1;
      }
      if (a.priority === "statement") {
        if (p.profile.intensity >= 4) score += 2;
        if (
          HOME_PRIMARY.includes(p.primaryCategory) &&
          (p.primaryCategory === "diffuser-machines" ||
            p.primaryCategory === "incense" ||
            p.productTypeLabel.toLowerCase().includes("candle"))
        )
          score += 2;
        if (ux.badges.includes("luxury-feel")) score += 1;
      }
      if (a.priority === "surprise") {
        if (p.isNew) score += 3;
        if (p.featured) score += 1;
      }

      if (a.shopFor === "gift" && ux.badges.includes("gift-pick")) score += 1;
      if (a.shopFor === "new" && (p.isNew || p.featured)) score += 1;

      return { p, score, ref };
    })
    .sort((a, b) => b.score - a.score);
}

function pickTripleFromPool(sorted: Scored[]): {
  best: Scored;
  budgetPick: Scored;
  premiumPick: Scored;
} | null {
  const scored = sorted;
  const best = scored[0];
  if (!best) return null;

  const valuePool = scored
    .filter((s) => minVariantPriceCents(s.p) < 4000)
    .sort((a, b) => b.score - a.score);
  let budgetPick =
    valuePool.find((s) => s.p.handle !== best.p.handle) ?? valuePool[0] ?? scored[1] ?? best;

  const premiumPool = scored
    .filter(
      (s) =>
        minVariantPriceCents(s.p) >= 5200 ||
        getProductUx(s.p).badges.includes("luxury-feel"),
    )
    .sort((a, b) => b.score - a.score);
  let premiumPick =
    premiumPool.find(
      (s) => s.p.handle !== best.p.handle && s.p.handle !== budgetPick.p.handle,
    ) ??
    premiumPool.find((s) => s.p.handle !== budgetPick.p.handle) ??
    premiumPool[0] ??
    scored.find(
      (s) => s.p.handle !== best.p.handle && s.p.handle !== budgetPick.p.handle,
    ) ??
    scored[Math.min(2, scored.length - 1)];

  if (premiumPick.p.handle === budgetPick.p.handle) {
    premiumPick =
      scored.find(
        (s) => s.p.handle !== best.p.handle && s.p.handle !== budgetPick.p.handle,
      ) ?? premiumPick;
  }

  return { best, budgetPick, premiumPick };
}

function pickDiscoveryTriple(a: DiscoveryAnswers) {
  return pickTripleFromPool(scoreDiscovery(a));
}

function firstMissingIndex(answers: Partial<DiscoveryAnswers>): number {
  for (let i = 0; i < STEP_ORDER.length; i += 1) {
    const k = STEP_ORDER[i];
    if (answers[k] === undefined) return i;
  }
  return STEP_ORDER.length;
}

function discoveryCaption(entry: Scored, a: DiscoveryAnswers): string {
  if (a.shopFor === "body") {
    return quizExplainMatch(entry.p, {
      vibe: a.mood,
      bold: a.presence === "bold" ? "statement" : "subtle",
      budget: a.budget,
      occasion: a.priority === "evening" ? "evening" : "daily",
      season: "warm",
    });
  }

  const ux = getProductUx(entry.p);
  const pLabel =
    a.priority === "everyday"
      ? "Everyday"
      : a.priority === "evening"
        ? "After hours"
        : a.priority === "statement"
          ? "Statement"
          : "Fresh mix";
  return `${pLabel} · ${ux.bestFor}`;
}

function QuizResultCard({
  label,
  entry,
  why,
}: {
  label: string;
  entry: Scored;
  why: string;
}) {
  const { playFrom } = useCartFly();
  const reduceMotion = useReducedMotion();
  const addLine = useCartStore((s) => s.addLine);
  const badges = pickCardBadges(entry.p, 3);

  return (
    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
        {label}
      </p>
      <div className="mt-3 flex gap-3">
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted/20">
          <Image
            src={entry.p.images[0]}
            alt=""
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="font-display text-lg leading-tight">{entry.p.title}</p>
          <p className="text-xs text-muted-foreground">
            From{" "}
            <span className="font-medium text-foreground">
              {formatMoney(entry.ref.priceCents, entry.ref.currencyCode)}
            </span>
            {" · "}
            {entry.ref.sizeLabel}
          </p>
          <ProductBadges badges={badges} />
          <p className="text-[11px] leading-relaxed text-muted-foreground">{why}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground/80">
            {entry.p.productTypeLabel} · {entry.p.categoryTitle}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <motion.div
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          className="inline-flex"
        >
          <Button
            type="button"
            size="sm"
            onClick={(e) => {
              playFrom(e.currentTarget);
              addLine({ product: entry.p, variant: entry.ref, quantity: 1 });
            }}
          >
            Add to cart
          </Button>
        </motion.div>
        <Button asChild size="sm" variant="outline">
          <Link href={`/products/${entry.p.handle}`}>View product</Link>
        </Button>
      </div>
    </div>
  );
}

export function ScentFinderQuiz() {
  const [answers, setAnswers] = useState<Partial<DiscoveryAnswers>>({});

  const idx = firstMissingIndex(answers);
  const complete = STEP_ORDER.every((k) => answers[k] !== undefined);
  const current = idx < DISCOVERY_STEPS.length ? DISCOVERY_STEPS[idx] : null;

  const triple = useMemo(() => {
    if (!complete) return null;
    try {
      return pickDiscoveryTriple(answers as DiscoveryAnswers);
    } catch {
      return null;
    }
  }, [answers, complete]);

  const progressPct = complete ? 100 : Math.round((idx / STEP_ORDER.length) * 100);

  const colsClass =
    current?.columns === 4
      ? "grid-cols-2 sm:grid-cols-4"
      : current?.columns === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-2";

  const reset = () => setAnswers({});

  const goBack = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      for (let i = STEP_ORDER.length - 1; i >= 0; i -= 1) {
        const k = STEP_ORDER[i];
        if (next[k] !== undefined) {
          delete next[k];
          return next;
        }
      }
      return next;
    });
  };

  const fullAnswers = answers as DiscoveryAnswers;

  return (
    <section
      id="scent-finder"
      className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <Reveal className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/60 via-card/30 to-background/20 p-6 shadow-lg sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Discovery guide
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              Five questions. Three picks.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Body, home, gifts, or newness first — then mood, presence, budget, and
              priority. Same premium match logic, one straight line.
            </p>
          </div>

          <div className="w-full max-w-xl lg:max-w-2xl">
            <div className="rounded-2xl border border-border/60 bg-background/50 p-5 shadow-inner backdrop-blur">
              <div className="mb-4">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span>
                    {triple ? "Your lineup" : `Question ${Math.min(idx + 1, 5)} / 5`}
                  </span>
                  <span>{progressPct}%</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border/60">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={false}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {complete && !triple ? (
                  <motion.div
                    key="no-triple"
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground"
                  >
                    We couldn&apos;t build picks from the catalog just now. Please refresh
                    the page or try again later.
                  </motion.div>
                ) : triple && complete ? (
                  <motion.div
                    key="result"
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 text-xs text-primary">
                      <Check className="h-3.5 w-3.5" />
                      Curated from your five answers
                    </div>
                    <QuizResultCard
                      label="Best match"
                      entry={triple.best}
                      why={discoveryCaption(triple.best, fullAnswers)}
                    />
                    <QuizResultCard
                      label="Budget pick"
                      entry={triple.budgetPick}
                      why={discoveryCaption(triple.budgetPick, fullAnswers)}
                    />
                    <QuizResultCard
                      label="Premium option"
                      entry={triple.premiumPick}
                      why={discoveryCaption(triple.premiumPick, fullAnswers)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={reset}
                    >
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                      Start over
                    </Button>
                  </motion.div>
                ) : current ? (
                  <motion.div
                    key={current.id}
                    initial={false}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="font-display text-lg">{current.title}</p>
                    <p className="text-xs text-muted-foreground">{current.subtitle}</p>
                    <div className={`mt-4 grid gap-2 ${colsClass}`}>
                      {current.options.map((opt) => (
                        <button
                          key={String(opt.value)}
                          type="button"
                          onClick={() => {
                            setAnswers((prev) => ({
                              ...prev,
                              [current.id]: opt.value,
                            }));
                          }}
                          className="group flex flex-col items-start rounded-xl border border-border/60 bg-background/40 px-3 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-background/80"
                        >
                          <span className="text-sm font-medium text-foreground">
                            {opt.label}
                          </span>
                          {opt.caption ? (
                            <span className="mt-0.5 text-[11px] text-muted-foreground">
                              {opt.caption}
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={goBack}
                        disabled={idx === 0 && Object.keys(answers).length === 0}
                        className="h-8 px-2 text-xs disabled:opacity-40"
                      >
                        <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={reset}
                        className="h-8 px-2 text-xs text-muted-foreground"
                      >
                        <RotateCcw className="mr-1 h-3.5 w-3.5" />
                        Reset
                      </Button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
