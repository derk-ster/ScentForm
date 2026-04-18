import type { ShoppingBadgeId } from "@/types/shop-ux";
import { BADGE_LABELS } from "@/lib/labels/shop-ux-labels";
import { cn } from "@/lib/utils/cn";

type Props = {
  badges: ShoppingBadgeId[];
  className?: string;
  size?: "sm" | "xs";
};

export function ProductBadges({ badges, className, size = "xs" }: Props) {
  if (badges.length === 0) return null;
  return (
    <ul
      className={cn("flex flex-wrap gap-1.5", className)}
      aria-label="Product highlights"
    >
      {badges.map((id) => (
        <li key={id}>
          <span
            className={cn(
              "inline-block rounded-full border border-border/70 bg-background/50 font-medium uppercase tracking-wide text-muted-foreground",
              size === "xs"
                ? "px-2 py-0.5 text-[9px]"
                : "px-2.5 py-1 text-[10px]",
            )}
          >
            {BADGE_LABELS[id]}
          </span>
        </li>
      ))}
    </ul>
  );
}
