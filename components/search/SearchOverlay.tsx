"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { searchCatalog } from "@/lib/data/catalog";
import { collections } from "@/lib/data/collections";
import { cn } from "@/lib/utils/cn";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchOverlay({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const products = useMemo(() => searchCatalog(q).slice(0, 8), [q]);

  const collectionMatches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return collections.slice(0, 8);
    return collections.filter((c) => c.title.toLowerCase().includes(s));
  }, [q]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-border/80 bg-background p-0">
        <DialogHeader className="border-b border-border/60 px-4 py-3 text-left">
          <DialogTitle className="font-display text-xl">Search</DialogTitle>
          <DialogDescription className="sr-only">
            Search products and collections
          </DialogDescription>
        </DialogHeader>
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Name, note, collection…"
              className="pl-10"
              aria-label="Search catalog"
              onKeyDown={(e) => {
                if (e.key === "Enter" && products[0]) {
                  router.push(`/products/${products[0].handle}`);
                  onOpenChange(false);
                }
              }}
            />
          </div>
        </div>
        <div className="max-h-[50vh] space-y-5 overflow-y-auto px-4 pb-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Products
            </p>
            <div className="mt-2 space-y-1">
              {products.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {q.trim() ? "No matches." : "Type to search."}
                </p>
              ) : (
                products.map((p) => (
                  <Link
                    key={p.handle}
                    href={`/products/${p.handle}`}
                    className={cn(
                      "block rounded-lg border border-transparent px-2 py-2 text-sm hover:border-border hover:bg-card/60",
                    )}
                    onClick={() => onOpenChange(false)}
                  >
                    <span className="font-medium">{p.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {p.collectionTitle}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Collections
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {collectionMatches.map((c) => (
                <Link
                  key={c.handle}
                  href={`/collections/${c.handle}`}
                  className="rounded-full border border-border/60 px-2.5 py-1 text-xs text-muted-foreground hover:border-border hover:text-foreground"
                  onClick={() => onOpenChange(false)}
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
