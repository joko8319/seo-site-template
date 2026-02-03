/**
 * SEO Engine API Client
 * Fetches content from your SEO Authority Engine
 */

const API_URL = process.env.SEO_ENGINE_API_URL || "https://seo-authority-engine.vercel.app";
const API_KEY = process.env.SEO_ENGINE_API_KEY || "";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  keywords?: string[];
  featuredImage?: string;
  publishedAt?: number;
  updatedAt?: number;
  clusterId?: string;
  cluster?: {
    id: string;
    hoofdonderwerp: string;
    pillarTitle?: string;
  };
}

interface Cluster {
  id: string;
  hoofdonderwerp: string;
  doelgroep: string;
  pillarTitle?: string;
  pillarDescription?: string;
  pillarSlug?: string;
  articleCount: number;
}

interface CustomAd {
  id: string;
  name: string;
  imageUrl: string;
  linkUrl: string;
  position: string;
}

interface SiteInfo {
  id: string;
  name: string;
  domain: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  primaryColor: string;
  // Advertising
  adsensePublisherId: string;
  adsEnabled: boolean;
  customAds: CustomAd[];
  // Stats
  articleCount: number;
  clusterCount: number;
}

async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}/api/public${endpoint}`, {
    headers: {
      "X-API-Key": API_KEY,
    },
    next: {
      revalidate: 60, // Cache for 60 seconds
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get all published articles
 */
export async function getArticles(options?: {
  limit?: number;
  offset?: number;
  clusterId?: string;
}): Promise<{ articles: Article[]; total: number; hasMore: boolean }> {
  const params = new URLSearchParams();
  if (options?.limit) params.set("limit", options.limit.toString());
  if (options?.offset) params.set("offset", options.offset.toString());
  if (options?.clusterId) params.set("cluster", options.clusterId);

  const query = params.toString();
  return fetchFromAPI(`/articles${query ? `?${query}` : ""}`);
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    return await fetchFromAPI(`/articles/${slug}`);
  } catch {
    return null;
  }
}

/**
 * Get all clusters
 */
export async function getClusters(): Promise<{ clusters: Cluster[] }> {
  return fetchFromAPI("/clusters");
}

/**
 * Get site information
 */
export async function getSiteInfo(): Promise<SiteInfo> {
  try {
    return await fetchFromAPI("/site");
  } catch {
    // Return defaults if API fails
    return {
      id: "",
      name: "Mijn Website",
      domain: "",
      description: "Welkom op mijn website",
      heroTitle: "Mijn Website",
      heroSubtitle: "Welkom op mijn website",
      contactEmail: "info@example.com",
      primaryColor: "blue",
      adsensePublisherId: "",
      adsEnabled: false,
      customAds: [],
      articleCount: 0,
      clusterCount: 0,
    };
  }
}

/**
 * Get all article slugs (for static generation)
 */
export async function getAllArticleSlugs(): Promise<string[]> {
  const { articles } = await getArticles({ limit: 1000 });
  return articles.map((article) => article.slug);
}
