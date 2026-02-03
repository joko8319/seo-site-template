import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSiteInfo } from "@/lib/seo-engine";
import { AdBanner, AdSenseScript } from "@/components/AdBanner";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteInfo();

  return {
    title: {
      default: siteInfo.name,
      template: `%s | ${siteInfo.name}`,
    },
    description: siteInfo.description,
    metadataBase: new URL(siteInfo.domain ? `https://${siteInfo.domain}` : "http://localhost:3000"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteInfo = await getSiteInfo();

  return (
    <html lang="nl">
      <head>
        {siteInfo.adsEnabled && siteInfo.adsensePublisherId && (
          <AdSenseScript publisherId={siteInfo.adsensePublisherId} />
        )}
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />

        {/* Header Ad */}
        {siteInfo.adsEnabled && (
          <div className="max-w-6xl mx-auto px-4 py-2 w-full">
            <AdBanner
              position="header"
              adsensePublisherId={siteInfo.adsensePublisherId}
              customAds={siteInfo.customAds}
            />
          </div>
        )}

        <main className="flex-1">{children}</main>

        {/* Footer Ad */}
        {siteInfo.adsEnabled && (
          <div className="max-w-6xl mx-auto px-4 py-4 w-full">
            <AdBanner
              position="footer"
              adsensePublisherId={siteInfo.adsensePublisherId}
              customAds={siteInfo.customAds}
            />
          </div>
        )}

        <Footer />
      </body>
    </html>
  );
}
