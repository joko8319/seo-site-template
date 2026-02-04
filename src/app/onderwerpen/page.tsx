import { Metadata } from "next";
import Link from "next/link";
import { getClusters, getSiteInfo } from "@/lib/seo-engine";

export const metadata: Metadata = {
  title: "Onderwerpen",
  description: "Bekijk alle onderwerpen en categorieën.",
};

export default async function TopicsPage() {
  const [{ clusters }, siteInfo] = await Promise.all([
    getClusters(),
    getSiteInfo(),
  ]);

  // Filter clusters that have pillar pages
  const topics = clusters.filter((c) => c.pillarSlug);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Onderwerpen</h1>
        <p className="text-gray-600">
          Ontdek onze content per onderwerp
        </p>
      </div>

      {topics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/onderwerp/${topic.pillarSlug}`}
              className="group"
            >
              <article className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                  {topic.pillarTitle || topic.hoofdonderwerp}
                </h2>
                {topic.pillarDescription && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {topic.pillarDescription}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {topic.articleCount} artikelen
                  </span>
                  <span className="text-primary-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Bekijken
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </article>
            </Link>
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-gray-500 text-lg">Nog geen onderwerpen beschikbaar</p>
        </div>
      )}
    </div>
  );
}
