import { Metadata } from "next";
import { getArticles, getSiteInfo } from "@/lib/seo-engine";
import { ArticleCard } from "@/components/ArticleCard";
import { SearchBar } from "@/components/SearchBar";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Zoekresultaten voor "${q}"` : "Zoeken",
    robots: {
      index: false, // Don't index search pages
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  // Get all articles and filter client-side (simple approach)
  let articles: any[] = [];
  let total = 0;

  if (query) {
    try {
      const result = await getArticles({ limit: 100 });
      const lowerQuery = query.toLowerCase();

      // Filter articles that match the query
      articles = result.articles.filter((article) => {
        const titleMatch = article.title?.toLowerCase().includes(lowerQuery);
        const excerptMatch = article.excerpt?.toLowerCase().includes(lowerQuery);
        const keywordsMatch = article.keywords?.some((k: string) =>
          k.toLowerCase().includes(lowerQuery)
        );
        return titleMatch || excerptMatch || keywordsMatch;
      });

      total = articles.length;
    } catch (error) {
      console.error("Failed to search articles:", error);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Zoeken</h1>
        <SearchBar className="max-w-xl" placeholder="Zoek in artikelen..." />
      </div>

      {query && (
        <p className="text-gray-600 mb-6">
          {total > 0
            ? `${total} resultaten voor "${query}"`
            : `Geen resultaten voor "${query}"`}
        </p>
      )}

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
      ) : query ? (
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-gray-500 text-lg">Geen artikelen gevonden</p>
          <p className="text-sm text-gray-400 mt-2">
            Probeer een andere zoekterm
          </p>
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-gray-500 text-lg">Voer een zoekterm in</p>
        </div>
      )}
    </div>
  );
}
