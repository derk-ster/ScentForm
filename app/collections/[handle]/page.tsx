import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CollectionBrowser } from "@/components/collection/CollectionBrowser";
import { collections, getCollectionByHandle } from "@/lib/data/collections";

type Props = { params: { handle: string } };

export function generateStaticParams() {
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = getCollectionByHandle(params.handle);
  if (!collection) return { title: "Collection" };
  return {
    title: `${collection.title} collection`,
    description: collection.description,
    openGraph: { title: `${collection.title} · Scentform` },
  };
}

export default function CollectionPage({ params }: Props) {
  const collection = getCollectionByHandle(params.handle);
  if (!collection) notFound();

  return (
    <Suspense
      fallback={<div className="p-10 text-sm text-muted-foreground">Loading…</div>}
    >
      <CollectionBrowser collection={collection} />
    </Suspense>
  );
}
