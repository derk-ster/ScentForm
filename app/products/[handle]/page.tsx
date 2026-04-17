import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { ProductPageView } from "@/components/product/ProductPageView";
import { getCatalog, getDefaultVariant, getProductByHandle } from "@/lib/data/catalog";

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
      title: `${product.title} · Scentform`,
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
    brand: { "@type": "Brand", name: "Scentform" },
    offers: {
      "@type": "Offer",
      url: `https://scentform.com/products/${product.handle}`,
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
      <ProductPageView product={product} />
    </>
  );
}
