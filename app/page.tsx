import type { Metadata } from "next";
import { AffiliateCta } from "@/components/home/AffiliateCta";
import { BrandStory } from "@/components/home/BrandStory";
import { ConcentrationShowcase } from "@/components/home/ConcentrationShowcase";
import { DiscoverySection } from "@/components/home/DiscoverySection";
import { EmailCaptureBand } from "@/components/home/EmailCaptureBand";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductRails } from "@/components/home/ProductRails";
import { ScentFinderQuiz } from "@/components/home/ScentFinderQuiz";
import { TrustBar } from "@/components/home/TrustBar";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover Scentform fragrances — collections, concentrations, and honest product detail for confident online shopping.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturedCollections />
      <ConcentrationShowcase />
      <ProductRails />
      <DiscoverySection />
      <ScentFinderQuiz />
      <BrandStory />
      <EmailCaptureBand />
      <AffiliateCta />
    </>
  );
}
