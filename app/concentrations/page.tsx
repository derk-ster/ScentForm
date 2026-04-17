import type { Metadata } from "next";
import Link from "next/link";
import { concentrations } from "@/lib/data/concentrations";
import { Reveal } from "@/components/ui/Reveal";
import { ConcentrationMatcher } from "@/components/concentration/ConcentrationMatcher";

export const metadata: Metadata = {
  title: "Concentrations",
  description:
    "Learn how EDT, EDP, Extrait, and perfume oils wear — then shop each concentration across Scentform lines.",
};

export default function ConcentrationsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="font-display text-3xl">Concentrations</h1>
      </Reveal>

      <div className="mt-8">
        <ConcentrationMatcher />
      </div>

      <Reveal className="mt-14">
        <h2 className="font-display text-2xl">Explore each wear level</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Dive into details — longevity, sillage, and which lines are available.
        </p>
      </Reveal>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {concentrations.map((c, i) => (
          <Reveal key={c.handle} delay={i * 0.05}>
            <Link
              href={`/concentrations/${c.handle}`}
              className="group block rounded-2xl border border-border/60 bg-card/40 p-5 transition hover:-translate-y-0.5 hover:border-border hover:shadow-md"
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {c.shortLabel}
              </p>
              <h2 className="mt-1 font-display text-xl">{c.label}</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {c.description}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
