import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSiteInfo } from "@/lib/seo-engine";
import { OrganizationSchema, WebSiteSchema } from "@/components/StructuredData";
import { Analytics, GTMNoScript } from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await getSiteInfo();
  const baseUrl = siteInfo.domain ? `https://${siteInfo.domain}` : "http://localhost:3000";

  return {
    title: {
      default: siteInfo.name,
      template: `%s | ${siteInfo.name}`,
    },
    description: siteInfo.description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
      types: {
        "application/rss+xml": `${baseUrl}/feed.xml`,
      },
    },
    openGraph: {
      type: "website",
      locale: "nl_NL",
      siteName: siteInfo.name,
      title: siteInfo.name,
      description: siteInfo.description,
      url: baseUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: siteInfo.name,
      description: siteInfo.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
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
  const baseUrl = siteInfo.domain ? `https://${siteInfo.domain}` : "http://localhost:3000";

  return (
    <html lang="nl">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Google Tag Manager (noscript) */}
        <GTMNoScript googleTagManagerId={siteInfo.googleTagManagerId || undefined} />

        {/* Analytics */}
        <Analytics
          googleAnalyticsId={siteInfo.googleAnalyticsId || undefined}
          googleTagManagerId={siteInfo.googleTagManagerId || undefined}
        />

        {/* Structured Data */}
        <OrganizationSchema
          name={siteInfo.name}
          url={baseUrl}
          logo={siteInfo.logoUrl || undefined}
          description={siteInfo.description}
        />
        <WebSiteSchema
          name={siteInfo.name}
          url={baseUrl}
          description={siteInfo.description}
        />

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
