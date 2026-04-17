import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConcentrationView } from "@/components/concentration/ConcentrationView";
import { concentrations, getConcentrationByHandle } from "@/lib/data/concentrations";

type Props = { params: { handle: string } };

export function generateStaticParams() {
  return concentrations.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getConcentrationByHandle(params.handle);
  if (!c) return { title: "Concentration" };
  return {
    title: `${c.label} fragrances`,
    description: c.description,
  };
}

export default function ConcentrationPage({ params }: Props) {
  const c = getConcentrationByHandle(params.handle);
  if (!c) notFound();
  return <ConcentrationView concentration={c} />;
}
