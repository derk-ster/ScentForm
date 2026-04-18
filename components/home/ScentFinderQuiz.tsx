"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Check, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { getCatalog, getDefaultVariant } from "@/lib/data/catalog";
import { formatMoney } from "@/lib/utils/money";
import type { Product, ProductVariant } from "@/types/catalog";
import { useCartStore } from "@/store/cart-store";
import { useCartFly } from "@/components/cart/CartFlyAnimationProvider";
import {
  minVariantPriceCents,
  pickCardBadges,
  quizExplainMatch,
  getProductUx,
} from "@/lib/data/product-ux";
import { ProductBadges } from "@/components/product/ProductBadges";

type VibeAnswer = "clean" | "warm" | "spiced" | "gourmand";
type BoldAnswer = "subtle" | "statement";
type BudgetAnswer = "value" | "core" | "splurge";
type OccasionAnswer = "daily" | "evening" | "special";
type SeasonAnswer = "warm" | "cool";

type Answers = {
  vibe: VibeAnswer;
  bold: BoldAnswer;
  budget: BudgetAnswer;
  occasion: OccasionAnswer;
  season: SeasonAnswer;
};

type Question = {
  id: keyof Answers;
  title: string;
  subtitle: string;
  options: { label: string; caption?: string; value: Answers[keyof Answers] }[];
  columns?: 2 | 3 | 4;
};

const questions: Question[] = [
  {
    id: "vibe",
    title: "Pick a mood",
    subtitle: "Which direction sounds right today?",
    columns: 2,
    options: [
      { label: "Clean", caption: "Citrus, airy", value: "clean" },
      { label: "Warm", caption: "Amber, woods", value: "warm" },
      { label: "Spiced", caption: "Tobacco, pepper", value: "spiced" },
      { label: "Gourmand", caption: "Vanilla, sweet", value: "gourmand" },
    ],
  },
  {
    id: "bold",
    title: "How loud do you wear it?",
    subtitle: "Signature projection.",
    columns: 2,
    options: [
      { label: "Soft", caption: "Skin scent", value: "subtle" },
      { label: "Bold", caption: "Leaves a trail", value: "statement" },
    ],
  },
  {
    id: "budget",
    title: "Budget comfort zone",
    subtitle: "We'll price-match your pick.",
    columns: 3,
    options: [
      { label: "Under $40", caption: "Smart pick", value: "value" },
      { label: "$40 – $60", caption: "Everyday core", value: "core" },
      { label: "$60+", caption: "Splurge", value: "splurge" },
    ],
  },
  {
    id: "occasion",
    title: "When will you wear it most?",
    subtitle: "We'll tune for the moment.",
    columns: 3,
    options: [
      { label: "Daily", caption: "Work, errands", value: "daily" },
      { label: "Evening", caption: "Dinner, dates", value: "evening" },
      { label: "Special", caption: "Events, nights out", value: "special" },
    ],
  },
  {
    id: "season",
    title: "Season you're dressing for",
    subtitle: "Same fragrance wears differently in heat.",
    columns: 2,
    options: [
      { label: "Warm weather", caption: "Spring / summer", value: "warm" },
      { label: "Cool weather", caption: "Fall / winter", value: "cool" },
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

function scoreCatalog(answers: Answers): Scored[] {
  const catalog = getCatalog();
  const scored = catalog.map((p) => {
    let score = 0;
    const hay = [
      ...p.notes.top,
      ...p.notes.heart,
      ...p.notes.base,
      p.title,
    ]
      .join(" ")
      .toLowerCase();

    if (answers.vibe === "clean" && p.profile.freshness >= 4) score += 3;
    if (answers.vibe === "warm" && p.profile.warmth >= 4) score += 3;
    if (
      answers.vibe === "spiced" &&
      /tobacco|pepper|cinnamon|ginger|saffron|leather/.test(hay)
    )
      score += 3;
    if (
      answers.vibe === "gourmand" &&
      /vanilla|tonka|marshmallow|caramel|milk/.test(hay)
    )
      score += 3;

    if (answers.bold === "subtle" && p.profile.intensity <= 3) score += 2;
    if (answers.bold === "statement" && p.profile.intensity >= 4) score += 2;

    const ref = getDefaultVariant(p);
    if (budgetMatchesCents(answers.budget, ref.priceCents)) score += 2;

    if (answers.occasion === "daily" && p.profile.intensity <= 3) score += 1;
    if (answers.occasion === "evening" && p.profile.intensity >= 3) score += 1;
    if (answers.occasion === "special" && p.profile.intensity >= 4) score += 2;

    if (answers.season === "warm" && p.profile.freshness >= 4) score += 1;
    if (answers.season === "cool" && p.profile.warmth >= 4) score += 1;

    return { p, score, ref };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

/** Three slots: best scoring match, value lane, premium lane — tweak scoring in scoreCatalog only. */
function pickQuizTriple(answers: Answers): {
  best: Scored;
  budgetPick: Scored;
  premiumPick: Scored;
} | null {
  const scored = scoreCatalog(answers);
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

function QuizResultCard({
  label,
  entry,
  answers,
}: {
  label: string;
  entry: Scored;
  answers: Answers;
}) {
  const { playFrom } = useCartFly();
  const reduceMotion = useReducedMotion();
  const addLine = useCartStore((s) => s.addLine);
  const why = quizExplainMatch(entry.p, answers);
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
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});

  const complete = questions.every((q) => answers[q.id] !== undefined);
  const triple = useMemo(() => {
    if (!complete) return null;
    try {
      return pickQuizTriple(answers as Answers);
    } catch {
      return null;
    }
  }, [answers, complete]);

  const safeStep = Math.min(
    Math.max(0, step),
    Math.max(0, questions.length - 1),
  );
  const q = questions[safeStep];
  const colsClass =
    q?.columns === 4
      ? "grid-cols-2 sm:grid-cols-4"
      : q?.columns === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-2";

  const progressPct = Math.round(
    (Object.keys(answers).length / questions.length) * 100,
  );

  const handlePick = (value: Answers[keyof Answers]) => {
    if (!q) return;
    setAnswers((prev) => {
      const next = { ...prev, [q.id]: value } as Partial<Answers>;
      return next;
    });
    setStep((s) => Math.min(s + 1, questions.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <section
      id="scent-finder"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <Reveal className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/60 via-card/30 to-background/20 p-6 shadow-lg sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Quick match
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              Five taps. Three picks.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Tell us your mood, budget, and when you&apos;ll wear it — we&apos;ll suggest a
              best match, a budget-friendly option, and a richer premium pick.
            </p>
          </div>

          <div className="w-full max-w-xl lg:max-w-2xl">
            <div className="rounded-2xl border border-border/60 bg-background/50 p-5 shadow-inner backdrop-blur">
              <div className="mb-4">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  <span>
                    {triple ? "Your lineup" : `${step + 1} / ${questions.length}`}
                  </span>
                  <span>{progressPct}%</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border/60">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={false}
                    animate={{ width: `${triple ? 100 : progressPct}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {complete && !triple ? (
                  <motion.div
                    key="no-triple"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-xl border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground"
                  >
                    We couldn&apos;t build picks from the catalog just now. Please refresh
                    the page or try again later.
                  </motion.div>
                ) : !triple && q ? (
                  <motion.div
                    key={q.id + step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="font-display text-lg">{q.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {q.subtitle}
                    </p>
                    <div className={`mt-4 grid gap-2 ${colsClass}`}>
                      {q.options.map((opt) => {
                        const selected = answers[q.id] === opt.value;
                        return (
                          <button
                            key={opt.value as string}
                            type="button"
                            onClick={() => handlePick(opt.value)}
                            className={`group flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-background/80 ${
                              selected
                                ? "border-primary bg-primary/10"
                                : "border-border/60 bg-background/40"
                            }`}
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
                        );
                      })}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={goBack}
                        disabled={step === 0}
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
                ) : triple ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 text-xs text-primary">
                      <Check className="h-3.5 w-3.5" />
                      Curated from your answers
                    </div>
                    <QuizResultCard
                      label="Best match"
                      entry={triple.best}
                      answers={answers as Answers}
                    />
                    <QuizResultCard
                      label="Budget pick"
                      entry={triple.budgetPick}
                      answers={answers as Answers}
                    />
                    <QuizResultCard
                      label="Premium / stronger pick"
                      entry={triple.premiumPick}
                      answers={answers as Answers}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={reset}
                    >
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                      Retake quiz
                    </Button>
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
