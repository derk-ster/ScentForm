"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Critical error
          </p>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl">
            ALLURA 7 hit a problem
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            The page shell failed to render. Reload or go home to continue.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              onClick={() => reset()}
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border/80 bg-transparent px-5 text-sm font-medium hover:bg-accent/40"
            >
              Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
