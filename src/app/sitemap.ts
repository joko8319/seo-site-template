import { MetadataRoute } from "next";
import { getArticles } from "@/lib/seo-engine";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || "http://localhost:3000";

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
      priority: 0.8,
    },
  ];

  // Dynamic article pages
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const { articles } = await getArticles({ limit: 1000 });
    articlePages = articles.map((article) => ({
      url: `${baseUrl}/artikel/${article.slug}`,
      lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Failed to generate article sitemap:", error);
  }

  return [...staticPages, ...articlePages];
}
