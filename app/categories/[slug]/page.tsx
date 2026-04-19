import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getShopCategory, shopCategories } from "@/lib/data/categories";
import { getProductsByPrimaryCategory } from "@/lib/data/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { groupProductsByTypeLabel } from "@/lib/shop/group-products";
import { CategoryQuizCta } from "@/components/categories/CategoryQuizCta";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return shopCategories.map((c) => ({ slug: c.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getShopCategory(params.slug);
  if (!cat) return { title: "Category" };
  return {
    title: cat.title,
    description: cat.intro,
  };
}

export default function CategoryPage({ params }: Props) {
  const cat = getShopCategory(params.slug);
  if (!cat) notFound();
  const products = getProductsByPrimaryCategory(cat.handle);
  const sections = groupProductsByTypeLabel(products, cat.handle);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <header className="max-w-3xl border-b border-border/50 pb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Category
        </p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">{cat.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {cat.intro}
        </p>
        {cat.chips?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {cat.chips.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className="rounded-full border border-border/70 bg-card/50 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        ) : null}
        <CategoryQuizCta products={products} category={cat.handle} />
      </header>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {products.length} {products.length === 1 ? "piece" : "pieces"} in this edit
        </p>
        <Link
          href={`/shop?category=${cat.handle}#shop-catalog`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Open in shop with filters →
        </Link>
      </div>

      <div className="space-y-14">
        {sections.map((section, idx) => (
          <section key={section.label} className={idx === 0 ? "mt-8" : "mt-2"}>
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/40 pb-4">
              <h2 className="font-display text-2xl tracking-tight text-foreground">
                {section.label}
              </h2>
              <p className="text-xs text-muted-foreground">
                {section.products.length}{" "}
                {section.products.length === 1 ? "piece" : "pieces"}
              </p>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.products.map((p) => (
                <ProductCard key={p.handle} product={p} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
