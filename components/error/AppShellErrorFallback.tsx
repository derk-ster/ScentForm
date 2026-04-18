/**
 * No hooks, no context — safe when the rest of the client tree failed.
 */
export function AppShellErrorFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center text-foreground">
      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
        Scentform
      </p>
      <h1 className="mt-4 max-w-md font-display text-3xl sm:text-4xl">
        Something broke while loading this page
      </h1>
      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        Try a full reload. If it keeps happening, go home and browse from there —
        your cart is saved in this browser when storage allows.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <a
          href="/"
          className="inline-flex h-11 min-w-[10rem] items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Back to home
        </a>
        <button
          type="button"
          className="inline-flex h-11 min-w-[10rem] items-center justify-center rounded-md border border-border bg-transparent px-6 text-sm font-medium hover:bg-accent/50"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
      </div>
    </div>
  );
}
