"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Something went wrong
      </p>
      <h1 className="mt-3 font-display text-3xl sm:text-4xl">
        We couldn&apos;t load this view
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        A client error occurred. You can try again or return to the homepage.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-[10px] text-muted-foreground/80">
          Ref: {error.digest}
        </p>
      ) : null}
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
