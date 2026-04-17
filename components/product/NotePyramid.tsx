import type { NotePyramid as NotePyramidType } from "@/types/catalog";
import { cn } from "@/lib/utils/cn";

type Props = {
  notes: NotePyramidType;
  className?: string;
};

export function NotePyramid({ notes, className }: Props) {
  const rows: { label: string; items: string[]; tone: string }[] = [
    { label: "Top", items: notes.top, tone: "from-sky-300/25 to-transparent" },
    {
      label: "Heart",
      items: notes.heart,
      tone: "from-fuchsia-300/20 to-transparent",
    },
    {
      label: "Base",
      items: notes.base,
      tone: "from-amber-200/20 to-transparent",
    },
  ];

  return (
    <div className={cn("grid gap-4 lg:grid-cols-3", className)}>
      {rows.map((row) => (
        <div
          key={row.label}
          className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-4"
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-gradient-to-b opacity-70",
              row.tone,
            )}
          />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {row.label}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {row.items.map((n) => (
                <li key={n}>
                  <span className="inline-flex rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-stone-100 backdrop-blur">
                    {n}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
