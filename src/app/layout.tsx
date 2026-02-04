import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSiteInfo } from "@/lib/seo-engine";

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
    icons: siteInfo.faviconUrl ? {
      icon: siteInfo.faviconUrl,
      apple: siteInfo.faviconUrl,
    } : undefined,
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
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Google AdSense Script */}
        {siteInfo.adsEnabled && siteInfo.adsensePublisherId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteInfo.adsensePublisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
