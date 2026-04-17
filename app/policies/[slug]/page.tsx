import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { policyLinks } from "@/lib/data/policies";

type Props = { params: { slug: string } };

const bodies: Record<string, string[]> = {
  "terms-of-service": [
    "These terms govern your use of the Scentform website and the purchases made through it.",
    "Product descriptions, pricing, and availability may change as inventory updates. Taxes and shipping are calculated at checkout.",
    "By placing an order you agree to the terms listed here. If anything is unclear, reach out via the contact page before purchasing.",
  ],
  "privacy-policy": [
    "Scentform collects information necessary to fulfill orders, prevent fraud, and improve the shopping experience.",
    "Marketing emails are sent only when you opt in. You can unsubscribe from any marketing message.",
    "We do not sell personal information. Processors we use for payments, shipping, and analytics are covered by contract and applicable data protection laws.",
  ],
  "refund-policy": [
    "Unopened items can be returned within 30 days of delivery for a refund to the original payment method.",
    "Fragrance products may have hygiene-related restrictions depending on jurisdiction — opened bottles are non-returnable unless defective.",
    "To start a return, contact support through the contact page with your order number.",
  ],
  "shipping-policy": [
    "Orders ship from the United States. Carriers and service levels are selected at checkout.",
    "Delivery estimates are not guaranteed and may vary during peak seasons or weather events.",
  ],
};

export function generateStaticParams() {
  return policyLinks.map((p) => {
    const slug = p.href.split("/").pop()!;
    return { slug };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const policy = policyLinks.find((p) => p.href.endsWith(params.slug));
  if (!policy) return { title: "Policy" };
  return {
    title: policy.title,
    description: policy.description,
  };
}

export default function PolicyPage({ params }: Props) {
  const policy = policyLinks.find((p) => p.href.endsWith(params.slug));
  if (!policy) notFound();
  const paragraphs = bodies[params.slug];
  if (!paragraphs) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Policy
      </p>
      <h1 className="mt-2 font-display text-4xl">{policy.title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  );
}
