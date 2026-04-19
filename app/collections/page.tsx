import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { collections } from "@/lib/data/collections";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse ALLURA 7 collections — personal fragrance, body, home, incense, diffusers, and gifts.",
};

export default function CollectionsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-display text-3xl">Collections</h1>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <Link
            key={c.handle}
            href={`/collections/${c.handle}`}
            className="group overflow-hidden rounded-2xl border border-border/60 bg-card/40"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={c.heroImage}
                alt={c.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 33vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-xl text-stone-50">{c.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
