"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ProductRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[products/[handle]/error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Product page
      </p>
      <h1 className="mt-3 font-display text-3xl sm:text-4xl">
        This product view failed to load
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        You can try again or return to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Button asChild variant="outline">
          <a href="/">Back to home</a>
        </Button>
      </div>
    </div>
  );
}
