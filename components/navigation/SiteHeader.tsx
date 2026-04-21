"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { megaCollections, megaShopCategories } from "./nav-data";
import { useCartStore } from "@/store/cart-store";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { ThemeToggle } from "./ThemeToggle";
import { AccentPaletteMenu } from "./AccentPaletteMenu";
import { useCartFly } from "@/components/cart/CartFlyAnimationProvider";
import { Allura7Wordmark } from "@/components/brand/Allura7Wordmark";

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = useCartStore((s) => s.itemCount());
  const { setCartAnchor } = useCartFly();
  const pathname = usePathname();

  const smoothScrollTop = () => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  const onLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      smoothScrollTop();
    }
  };

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-transparent transition-colors duration-300",
          solid
            ? "border-border/60 bg-background/95 backdrop-blur-md"
            : "bg-background/80 backdrop-blur-sm",
        )}
      >
        <div className="mx-auto flex h-[64px] max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Allura7Wordmark
              href="/"
              onClick={onLogoClick}
              className="text-base sm:text-lg lg:text-xl"
            />
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <nav className="hidden min-w-0 shrink items-center gap-1 lg:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-1 px-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  Categories
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="max-h-72 w-56 overflow-y-auto">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Browse
                </DropdownMenuLabel>
                {megaShopCategories.map((c) => (
                  <DropdownMenuItem key={c.href} asChild>
                    <Link href={c.href}>{c.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-1 px-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  Shop lines
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="max-h-72 w-56 overflow-y-auto">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Thematic edits (not product types)
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/collections">View all</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {megaCollections.map((c) => (
                  <DropdownMenuItem key={c.href} asChild>
                    <Link href={c.href}>{c.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              type="button"
              variant="ghost"
              className="px-3 text-sm text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/discover">Discover</Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-1 px-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  Help
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link href="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/affiliate">Affiliate</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact">Contact</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
            <ThemeToggle />
            <AccentPaletteMenu />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" asChild aria-label="Account">
              <Link href="/account">
                <UserRound className="h-5 w-5" />
              </Link>
            </Button>
            <span ref={setCartAnchor} className="relative inline-flex shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative"
                asChild
                aria-label="Cart"
              >
                <Link href="/cart">
                  <ShoppingBag className="h-5 w-5" />
                  {count > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                      {count > 9 ? "9+" : count}
                    </span>
                  ) : null}
                </Link>
              </Button>
            </span>
          </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/70"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
              className="absolute right-0 top-0 flex h-full w-[min(360px,100%)] flex-col border-l border-border/70 bg-background shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <span className="text-sm font-medium">Menu</span>
                <div className="flex items-center gap-1">
                  <ThemeToggle />
                  <AccentPaletteMenu />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-3 text-sm">
                <Link
                  href="/discover"
                  className="block border-b border-border/40 py-3 font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Discover
                </Link>
                <details className="border-b border-border/40 py-2">
                  <summary className="cursor-pointer list-none py-2 font-medium [&::-webkit-details-marker]:hidden">
                    Categories
                  </summary>
                  <div className="max-h-52 space-y-1 overflow-y-auto pb-2 pl-2">
                    {megaShopCategories.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block py-1.5 text-muted-foreground"
                        onClick={() => setMobileOpen(false)}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </details>
                <details className="border-b border-border/40 py-2">
                  <summary className="cursor-pointer list-none py-2 font-medium [&::-webkit-details-marker]:hidden">
                    Shop lines
                  </summary>
                  <p className="pb-2 pl-2 text-[11px] leading-snug text-muted-foreground">
                    Curated stories — for format filters (lotion, EDP, etc.) use{" "}
                    <Link href="/shop" className="text-primary underline-offset-2 hover:underline">
                      Shop
                    </Link>
                    .
                  </p>
                  <div className="max-h-52 space-y-1 overflow-y-auto pb-2 pl-2">
                    <Link
                      href="/collections"
                      className="block py-1.5 text-muted-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      View all lines
                    </Link>
                    {megaCollections.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block py-1.5 text-muted-foreground"
                        onClick={() => setMobileOpen(false)}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </details>
                <details className="border-b border-border/40 py-2">
                  <summary className="cursor-pointer list-none py-2 font-medium [&::-webkit-details-marker]:hidden">
                    Help
                  </summary>
                  <div className="space-y-1 pb-2 pl-2">
                    <Link
                      href="/about"
                      className="block py-1.5 text-muted-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      href="/affiliate"
                      className="block py-1.5 text-muted-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      Affiliate
                    </Link>
                    <Link
                      href="/contact"
                      className="block py-1.5 text-muted-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      Contact
                    </Link>
                  </div>
                </details>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
