import type { MouseEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type Props = {
  className?: string;
  /** Omit or pass `null` to render a non-link span (still shows hover underline). */
  href?: string | null;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  "aria-label"?: string;
};

/**
 * “ALLURA 7” logotype with an accent-colored underline that grows left → right on hover.
 */
export function Allura7Wordmark({
  className,
  href = "/",
  onClick,
  "aria-label": ariaLabel = "ALLURA 7 home",
}: Props) {
  const line = (
    <span
      className={cn(
        "pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-primary",
        "transition-transform duration-500 ease-out will-change-transform",
        "group-hover:scale-x-100",
        "motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:group-hover:scale-x-100",
      )}
      aria-hidden
    />
  );

  const textClasses = cn(
    "group relative inline-block pb-0.5 font-display tracking-[0.12em] text-foreground",
    "transition-opacity hover:opacity-90",
    className,
  );

  if (href == null) {
    return (
      <span className={textClasses}>
        ALLURA 7
        {line}
      </span>
    );
  }

  return (
    <Link href={href} onClick={onClick} aria-label={ariaLabel} className={textClasses}>
      ALLURA 7
      {line}
    </Link>
  );
}
