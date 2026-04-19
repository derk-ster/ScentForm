import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { ProductPageView } from "@/components/product/ProductPageView";
import { getCatalog, getDefaultVariant, getProductByHandle } from "@/lib/data/catalog";
import { getPdpAmbienceModifier } from "@/lib/product/pdp-ambience";
import { cn } from "@/lib/utils/cn";

type Props = { params: { handle: string } };

export function generateStaticParams() {
  return getCatalog().map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductByHandle(params.handle);
  if (!product) return { title: "Product" };
  const v = getDefaultVariant(product);
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: `${product.title} · ALLURA 7`,
      description: product.description,
      images: product.images,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: product.images,
    },
    other: {
      "product:price:amount": String(v.priceCents / 100),
      "product:price:currency": v.currencyCode,
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductByHandle(params.handle);
  if (!product) notFound();
  const v = getDefaultVariant(product);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "ALLURA 7" },
    offers: {
      "@type": "Offer",
      url: `https://allura7.com/products/${product.handle}`,
      priceCurrency: v.currencyCode,
      price: String(v.priceCents / 100),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <Script
        id={`ldjson-product-${product.handle}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={cn("pdp-shell", getPdpAmbienceModifier(product))}>
        <div className="pdp-shell-bg" aria-hidden />
        <div className="pdp-shell-inner">
          <ProductPageView product={product} />
        </div>
      </div>
    </>
  );
}
