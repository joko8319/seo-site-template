import { getArticles } from "@/lib/seo-engine";
import { ArticleCard } from "@/components/ArticleCard";
import Link from "next/link";

export default async function HomePage() {
  const siteName = process.env.SITE_NAME || "My Site";
  const siteDescription = process.env.SITE_DESCRIPTION || "Welcome to my site";

  // Fetch latest articles
  let articles: any[] = [];
  try {
    const result = await getArticles({ limit: 6 });
    articles = result.articles;
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {siteName}
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mb-8">
            {siteDescription}
          </p>
          <Link
            href="/artikelen"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Bekijk alle artikelen
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Laatste artikelen
          </h2>
          <Link
            href="/artikelen"
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Bekijk alle →
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                excerpt={article.excerpt}
                featuredImage={article.featuredImage}
                publishedAt={article.publishedAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">
              Nog geen artikelen beschikbaar.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Publiceer artikelen in je SEO Engine om ze hier te tonen.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
