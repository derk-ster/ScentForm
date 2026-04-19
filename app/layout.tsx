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
import { ACCENT_BOOTSTRAP_SCRIPT } from "@/lib/theme/accent";

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
  metadataBase: new URL("https://allura7.com"),
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png", sizes: "180x180" }],
  },
  title: {
    default: "ALLURA 7 | Luxury fragrance & home scent",
    template: "%s · ALLURA 7",
  },
  description:
    "ALLURA 7 — luxury perfumes, body care, home scent, incense, ultrasonic diffusers, and oils. Premium shopping, full pricing, and refined discovery.",
  openGraph: {
    title: "ALLURA 7",
    description:
      "Luxury fragrance lifestyle — personal scent, body rituals, and home atmosphere with modern ecommerce clarity.",
    type: "website",
    locale: "en_US",
    siteName: "ALLURA 7",
  },
  twitter: {
    card: "summary_large_image",
    title: "ALLURA 7",
    description:
      "Luxury perfumes, body, home, incense, and diffusers — ALLURA 7 premium catalog and shopping experience.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: ACCENT_BOOTSTRAP_SCRIPT }}
        />
      </head>
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
