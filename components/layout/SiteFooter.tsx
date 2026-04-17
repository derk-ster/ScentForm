import Link from "next/link";
import { Instagram } from "lucide-react";
import { collections } from "@/lib/data/collections";
import { policyLinks } from "@/lib/data/policies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-card/20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-xl tracking-[0.12em]">SCENTFORM</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Fragrances made to wear.
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
                    Collections
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
            {collections.slice(0, 6).map((c) => (
              <Link key={c.handle} href={`/collections/${c.handle}`} className="hover:text-foreground">
                {c.title}
              </Link>
            ))}
            <Link href="/collections" className="hover:text-foreground">
              More…
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 hover:text-foreground"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <span className="text-xs">© {new Date().getFullYear()} Scentform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
