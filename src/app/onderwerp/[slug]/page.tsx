import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClusters, getArticles, getSiteInfo } from "@/lib/seo-engine";
import { ArticleCard } from "@/components/ArticleCard";
import { BreadcrumbSchema } from "@/components/StructuredData";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all clusters with pillar pages
export async function generateStaticParams() {
  try {
    const { clusters } = await getClusters();
    return clusters
      .filter((cluster) => cluster.pillarSlug)
      .map((cluster) => ({ slug: cluster.pillarSlug }));
  } catch {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { clusters } = await getClusters();
  const siteInfo = await getSiteInfo();

  const cluster = clusters.find((c) => c.pillarSlug === slug);

  if (!cluster) {
    return {
      title: "Onderwerp niet gevonden",
    };
  }

  const baseUrl = siteInfo.domain ? `https://${siteInfo.domain}` : "http://localhost:3000";

  return {
    title: cluster.pillarTitle || cluster.hoofdonderwerp,
    description: cluster.pillarDescription || `Artikelen over ${cluster.hoofdonderwerp}`,
    alternates: {
      canonical: `${baseUrl}/onderwerp/${slug}`,
    },
    openGraph: {
      title: cluster.pillarTitle || cluster.hoofdonderwerp,
      description: cluster.pillarDescription || `Artikelen over ${cluster.hoofdonderwerp}`,
      type: "website",
      url: `${baseUrl}/onderwerp/${slug}`,
    },
  };
}

export default async function ClusterPage({ params }: Props) {
  const { slug } = await params;
  const [{ clusters }, siteInfo] = await Promise.all([
    getClusters(),
    getSiteInfo(),
  ]);

  const cluster = clusters.find((c) => c.pillarSlug === slug);

  if (!cluster) {
    notFound();
  }

  // Get articles for this cluster
  const { articles } = await getArticles({ clusterId: cluster.id, limit: 50 });

  const baseUrl = siteInfo.domain ? `https://${siteInfo.domain}` : "http://localhost:3000";

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: cluster.pillarTitle || cluster.hoofdonderwerp, url: `${baseUrl}/onderwerp/${slug}` },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{cluster.pillarTitle || cluster.hoofdonderwerp}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {cluster.pillarTitle || cluster.hoofdonderwerp}
          </h1>
          {cluster.pillarDescription && (
            <p className="text-xl text-gray-600 max-w-3xl">
              {cluster.pillarDescription}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            {cluster.articleCount} artikelen in dit onderwerp
          </p>
        </header>

        {/* Articles Grid */}
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
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">Nog geen artikelen in dit onderwerp</p>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/artikelen"
            className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Alle artikelen bekijken
          </Link>
        </div>
      </div>
    </>
  );
}
