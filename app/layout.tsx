import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MainWithRouteKey } from "@/components/layout/MainWithRouteKey";
import { SiteHeaderWithErrorBoundary } from "@/components/layout/SiteHeaderWithErrorBoundary";
import { Providers } from "./providers";
import { PromoTeaserVisibilityProvider } from "@/components/marketing/PromoTeaserVisibility";
import { SubscribePromoPopup } from "@/components/marketing/SubscribePromoPopup";
import { StickyScentFinder } from "@/components/navigation/StickyScentFinder";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scentform.com"),
  title: {
    default: "Scentform | Signature perfumes & colognes",
    template: "%s · Scentform",
  },
  description:
    "Modern niche-leaning fragrances with multiple concentrations and sizes — built for real wear, not shelf candy.",
  openGraph: {
    title: "Scentform",
    description:
      "Premium fragrance storefront — collections, concentrations, and honest product detail.",
    type: "website",
    locale: "en_US",
    siteName: "Scentform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scentform",
    description:
      "Premium fragrance storefront — collections, concentrations, and honest product detail.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${cormorant.variable} min-h-screen font-sans`}
      >
        <Providers>
          <PromoTeaserVisibilityProvider>
            <SubscribePromoPopup />
            <StickyScentFinder />
          </PromoTeaserVisibilityProvider>
          <div className="relative min-h-screen">
            <SiteHeaderWithErrorBoundary />
            <MainWithRouteKey>{children}</MainWithRouteKey>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
