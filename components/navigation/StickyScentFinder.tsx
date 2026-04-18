"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const hiddenPaths = new Set(["/cart", "/checkout"]);

export function StickyScentFinder() {
  const pathname = usePathname();
  if (hiddenPaths.has(pathname)) return null;

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed z-[45] hidden sm:block",
          "bottom-8 right-6",
        )}
      >
        <Button
          asChild
          size="lg"
          className="pointer-events-auto rounded-full px-5 shadow-lg shadow-black/30"
        >
          <Link href="/#scent-finder" className="gap-2">
            <Sparkles className="h-4 w-4" aria-hidden />
            Find my scent
          </Link>
        </Button>
      </div>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[45] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <Button
          asChild
          className="pointer-events-auto mx-auto flex w-full max-w-md rounded-full shadow-lg shadow-black/30"
        >
          <Link href="/#scent-finder" className="gap-2">
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
            Find my scent
          </Link>
        </Button>
      </div>
    </>
  );
}
