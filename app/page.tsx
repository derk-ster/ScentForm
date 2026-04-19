import type { Metadata } from "next";
import { BrandStory } from "@/components/home/BrandStory";
import { EmailCaptureBand } from "@/components/home/EmailCaptureBand";
import { HeroSection } from "@/components/home/HeroSection";
import { ScentFinderQuiz } from "@/components/home/ScentFinderQuiz";
import { ShopByCategorySection } from "@/components/home/ShopByCategorySection";
import { TrustBar } from "@/components/home/TrustBar";

export const metadata: Metadata = {
  title: "Home",
  description:
    "ALLURA 7 — luxury personal fragrance, body care, home scent, and diffuser systems. Premium discovery, full pricing, and modern shopping.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ShopByCategorySection />
      <ScentFinderQuiz />
      <BrandStory />
      <EmailCaptureBand />
    </>
  );
}
