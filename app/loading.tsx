/** Shown while the home segment streams — avoids a blank or error flash during cold compile. */
export default function RootLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4">
      <div className="h-1 w-32 overflow-hidden rounded-full bg-border">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-primary/60" />
      </div>
      <p className="text-sm text-muted-foreground">Loading storefront…</p>
    </div>
  );
}
