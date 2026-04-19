import Image from "next/image";
import brandLogo from "../../Assets/Allura7Logo.png";

/**
 * Static fallback when the real header fails — no store, motion, or fly context.
 */
export function MinimalSiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-[64px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="flex min-w-0 items-center gap-2.5 text-foreground sm:gap-3"
          aria-label="ALLURA 7 home"
        >
          <Image
            src={brandLogo}
            alt=""
            width={brandLogo.width}
            height={brandLogo.height}
            priority
            className="h-8 w-auto max-h-8 max-w-[7.5rem] shrink-0 rounded-md object-contain sm:h-9 sm:max-h-9 sm:max-w-[8.5rem]"
            aria-hidden
          />
          <span className="font-display text-lg tracking-[0.12em] sm:text-xl">ALLURA 7</span>
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
