import Link from "next/link";
import { Instagram, Twitter, Youtube } from "lucide-react";
import { collections } from "@/lib/data/collections";
import { policyLinks } from "@/lib/data/policies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Allura7Wordmark } from "@/components/brand/Allura7Wordmark";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const socialIconClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-card/20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Allura7Wordmark className="text-xl" />
            <p className="mt-2 text-sm text-muted-foreground">
              Luxury fragrance lifestyle — skin, space, and air.
            </p>
            <form className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor="footer-email">
                Email
              </label>
              <Input
                id="footer-email"
                type="email"
                required
                placeholder="Email"
                className="sm:max-w-[220px]"
              />
              <Button type="submit" size="sm">
                Join
              </Button>
            </form>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 lg:max-w-lg">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Shop
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/shop" className="text-muted-foreground hover:text-foreground">
                    All
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best-sellers"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Best sellers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/new-arrivals"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    New
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Shop lines
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Help
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/affiliate"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Affiliate
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Account
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Legal
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {policyLinks.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border/50 pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {collections.slice(0, 5).map((c) => (
              <Link key={c.handle} href={`/collections/${c.handle}`} className="hover:text-foreground">
                {c.title}
              </Link>
            ))}
            <Link href="/collections" className="hover:text-foreground">
              More…
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <a
                href="https://x.com/allura7"
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
                aria-label="ALLURA 7 on X"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://www.tiktok.com/@allura7"
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
                aria-label="ALLURA 7 on TikTok"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.youtube.com/@allura7"
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
                aria-label="ALLURA 7 on YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/allura7official"
                target="_blank"
                rel="noopener noreferrer"
                className={socialIconClass}
                aria-label="ALLURA 7 on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
            <span className="text-xs">© {new Date().getFullYear()} ALLURA 7</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
