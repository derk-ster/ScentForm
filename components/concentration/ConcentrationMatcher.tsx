"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import {
  concentrations,
  getConcentrationByHandle,
} from "@/lib/data/concentrations";
import type { ConcentrationHandle } from "@/types/catalog";

type WhenAnswer = "day" | "evening" | "cold-events" | "intimate";
type StrengthAnswer = "soft" | "balanced" | "bold";
type BudgetAnswer = "value" | "core" | "splurge";
type AlcoholAnswer = "ok" | "avoid";

type Answers = {
  when: WhenAnswer;
  strength: StrengthAnswer;
  budget: BudgetAnswer;
  alcohol: AlcoholAnswer;
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
    id: "when",
    title: "When will you wear it?",
    subtitle: "This matters more than you'd think.",
    columns: 2,
    options: [
      { label: "Daytime", caption: "Office, warm weather", value: "day" },
      { label: "Evening", caption: "Dinner, dates", value: "evening" },
      { label: "Cold events", caption: "Nights out, winter", value: "cold-events" },
      { label: "Intimate", caption: "Close wear, travel", value: "intimate" },
    ],
  },
  {
    id: "strength",
    title: "How strong should it read?",
    subtitle: "Your ideal projection.",
    columns: 3,
    options: [
      { label: "Soft", caption: "Skin scent", value: "soft" },
      { label: "Balanced", caption: "Room-friendly", value: "balanced" },
      { label: "Bold", caption: "Leaves a trail", value: "bold" },
    ],
  },
  {
    id: "budget",
    title: "Budget comfort zone",
    subtitle: "Pairs you to wear level that fits.",
    columns: 3,
    options: [
      { label: "Under $40", caption: "EDT territory", value: "value" },
      { label: "$40 – $70", caption: "EDP sweet spot", value: "core" },
      { label: "$70+", caption: "Extrait / oil", value: "splurge" },
    ],
  },
  {
    id: "alcohol",
    title: "Alcohol preference",
    subtitle: "Some folks prefer oil bases.",
    columns: 2,
    options: [
      { label: "Alcohol is fine", caption: "Spray & go", value: "ok" },
      { label: "Alcohol-free", caption: "Oil only", value: "avoid" },
    ],
  },
];

function pickConcentration(a: Answers): ConcentrationHandle {
  const scores: Record<ConcentrationHandle, number> = {
    edt: 0,
    edp: 0,
    extrait: 0,
    "perfume-oil": 0,
  };

  if (a.alcohol === "avoid") {
    scores["perfume-oil"] += 10;
  }

  if (a.when === "day") scores.edt += 3;
  if (a.when === "evening") scores.edp += 3;
  if (a.when === "cold-events") scores.extrait += 3;
  if (a.when === "intimate") {
    scores["perfume-oil"] += 3;
    scores.edt += 1;
  }

  if (a.strength === "soft") {
    scores.edt += 2;
    scores["perfume-oil"] += 2;
  }
  if (a.strength === "balanced") scores.edp += 3;
  if (a.strength === "bold") scores.extrait += 3;

  if (a.budget === "value") scores.edt += 2;
  if (a.budget === "core") scores.edp += 2;
  if (a.budget === "splurge") {
    scores.extrait += 2;
    scores["perfume-oil"] += 1;
  }

  let best: ConcentrationHandle = "edp";
  let bestScore = -Infinity;
  (Object.keys(scores) as ConcentrationHandle[]).forEach((key) => {
    if (scores[key] > bestScore) {
      bestScore = scores[key];
      best = key;
    }
  });
  return best;
}

export function ConcentrationMatcher() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});

  const complete = questions.every((q) => answers[q.id] !== undefined);
  const result = useMemo(() => {
    if (!complete) return null;
    const handle = pickConcentration(answers as Answers);
    return getConcentrationByHandle(handle);
  }, [answers, complete]);

  const q = questions[step];
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
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    setStep((s) => Math.min(s + 1, questions.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <Reveal className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/60 via-card/30 to-background/20 p-6 shadow-lg sm:p-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Wear-level match
          </p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl">
            Find your concentration
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            EDT, EDP, Extrait, or oil? Answer four quick questions and we&apos;ll
            steer you to the right strength — so a scent you love fits the way
            you actually wear it.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {concentrations.map((c) => (
              <span
                key={c.handle}
                className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-[10px] uppercase tracking-wide text-muted-foreground"
              >
                {c.shortLabel}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border/60 bg-background/50 p-5 shadow-inner backdrop-blur">
            <div className="mb-4">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>
                  {result ? "Result" : `${step + 1} / ${questions.length}`}
                </span>
                <span>{progressPct}%</span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border/60">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={false}
                  animate={{ width: `${result ? 100 : progressPct}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key={q.id + step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display text-lg">{q.title}</p>
                  <p className="text-xs text-muted-foreground">{q.subtitle}</p>
                  <div className={`mt-4 grid gap-2 ${colsClass}`}>
                    {q.options.map((opt) => {
                      const selected = answers[q.id] === opt.value;
                      return (
                        <button
                          key={opt.value as string}
                          type="button"
                          onClick={() => handlePick(opt.value)}
                          className={`flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-background/80 ${
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
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <Check className="h-3.5 w-3.5" />
                    Best fit for you
                  </div>
                  <p className="mt-2 font-display text-2xl">{result.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {result.shortLabel} · {result.longevityNote} ·{" "}
                    {result.sillageNote}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {result.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href={`/concentrations/${result.handle}`}>
                        Shop {result.shortLabel}
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={reset}
                    >
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                      Retake
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
