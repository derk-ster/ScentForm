/**
 * Static fallback when the real header fails — no store, motion, or fly context.
 */
export function MinimalSiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-[64px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="font-display text-lg tracking-[0.12em] text-foreground sm:text-xl"
        >
          SCENTFORM
        </a>
        <a
          href="/cart"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Cart
        </a>
      </div>
    </header>
  );
}
