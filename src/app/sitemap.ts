import { MetadataRoute } from "next";
import { getArticles, getClusters, getSiteInfo } from "@/lib/seo-engine";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteInfo = await getSiteInfo();
  const baseUrl = siteInfo.domain ? `https://${siteInfo.domain}` : "http://localhost:3000";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/artikelen`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/onderwerpen`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Get all articles
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const { articles } = await getArticles({ limit: 1000 });
    articlePages = articles.map((article) => ({
      url: `${baseUrl}/artikel/${article.slug}`,
      lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to fetch articles for sitemap:", error);
  }

  // Get all clusters (if they have pillar pages)
  let clusterPages: MetadataRoute.Sitemap = [];
  try {
    const { clusters } = await getClusters();
    clusterPages = clusters
      .filter((cluster) => cluster.pillarSlug)
      .map((cluster) => ({
        url: `${baseUrl}/onderwerp/${cluster.pillarSlug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
  } catch (error) {
    console.error("Failed to fetch clusters for sitemap:", error);
  }

  return [...staticPages, ...clusterPages, ...articlePages];
}
