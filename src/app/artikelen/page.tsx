import { Metadata } from "next";
import { getArticles, getSiteInfo } from "@/lib/seo-engine";
import { ArticleCard } from "@/components/ArticleCard";
import { AdBanner } from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "Artikelen",
  description: "Bekijk al onze artikelen en blog posts.",
};

export default async function ArticlesPage() {
  const siteInfo = await getSiteInfo();
  let articles: any[] = [];
  let total = 0;

  try {
    const result = await getArticles({ limit: 50 });
    articles = result.articles;
    total = result.total;
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Ad */}
      {siteInfo.adsEnabled && (
        <div className="mb-8">
          <AdBanner
            position="header"
            pageType="articlesList"
            adsensePublisherId={siteInfo.adsensePublisherId}
            customAds={siteInfo.customAds}
          />
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Artikelen</h1>
        <p className="text-gray-600">
          {total > 0 ? `${total} artikelen` : "Nog geen artikelen"}
        </p>
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
              featuredImageAlt={article.featuredImageAlt}
              publishedAt={article.publishedAt}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <p className="text-gray-500 text-lg">Nog geen artikelen beschikbaar</p>
          <p className="text-sm text-gray-400 mt-2">
            Publiceer artikelen in je SEO Engine om ze hier te tonen.
          </p>
        </div>
      )}

      {/* Footer Ad */}
      {siteInfo.adsEnabled && (
        <div className="mt-12">
          <AdBanner
            position="footer"
            pageType="articlesList"
            adsensePublisherId={siteInfo.adsensePublisherId}
            customAds={siteInfo.customAds}
          />
        </div>
      )}
    </div>
  );
}
