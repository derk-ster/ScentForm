import type { ScentMeterValues } from "@/types/shop-ux";
import { cn } from "@/lib/utils/cn";

const ROWS: { key: keyof ScentMeterValues; label: string }[] = [
  { key: "freshness", label: "Freshness" },
  { key: "sweetness", label: "Sweetness" },
  { key: "warmth", label: "Warmth" },
  { key: "projection", label: "Projection" },
  { key: "longevity", label: "Longevity" },
];

type Props = {
  meters: ScentMeterValues;
  className?: string;
  /** Tighter rows for product cards */
  compact?: boolean;
};

export function ScentMeterBars({ meters, className, compact }: Props) {
  return (
    <div
      className={cn("space-y-2", compact && "space-y-1.5", className)}
      aria-label="Scent profile"
    >
      {ROWS.map(({ key, label }) => {
        const v = meters[key];
        const pct = ((Math.min(5, Math.max(1, v)) - 1) / 4) * 100;
        return (
          <div key={key} className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
            <span
              className={cn(
                "text-muted-foreground",
                compact ? "text-[9px]" : "text-[10px]",
              )}
            >
              {label}
            </span>
            <div
              className={cn(
                "h-1 overflow-hidden rounded-full bg-border/60",
                compact ? "h-0.5" : "h-1",
              )}
            >
              <div
                className="h-full rounded-full bg-primary/80"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
