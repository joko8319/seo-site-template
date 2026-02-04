import { MetadataRoute } from "next";
import { getSiteInfo } from "@/lib/seo-engine";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteInfo = await getSiteInfo();
  const baseUrl = siteInfo.domain ? `https://${siteInfo.domain}` : "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
