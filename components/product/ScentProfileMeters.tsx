import type { FragranceProfile } from "@/types/catalog";
import { cn } from "@/lib/utils/cn";

type Props = {
  profile: FragranceProfile;
  className?: string;
};

function Meter({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const pct = Math.min(100, Math.max(0, (value / 5) * 100));
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}/5</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/80">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-primary/40 via-primary to-amber-200/80",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ScentProfileMeters({ profile, className }: Props) {
  return (
    <div className={cn("space-y-4", className)}>
      <Meter label="Sweetness" value={profile.sweetness} />
      <Meter label="Freshness" value={profile.freshness} />
      <Meter label="Warmth" value={profile.warmth} />
      <Meter label="Intensity" value={profile.intensity} />
    </div>
  );
}
