import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/seo-engine";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all articles
export async function generateStaticParams() {
  try {
    const slugs = await getAllArticleSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel niet gevonden",
    };
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    keywords: article.keywords?.join(", "),
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      type: "article",
      publishedTime: article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : undefined,
      images: article.featuredImage ? [article.featuredImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("nl-NL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/artikelen" className="hover:text-gray-700">
              Artikelen
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 truncate max-w-[200px]">{article.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-8">
        {formattedDate && (
          <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed">
            {article.excerpt}
          </p>
        )}
      </header>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="relative aspect-video mb-8 rounded-xl overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      {article.content && (
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      )}

      {/* Tags/Keywords */}
      {article.keywords && article.keywords.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Gerelateerde onderwerpen
          </h2>
          <div className="flex flex-wrap gap-2">
            {article.keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
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
          Terug naar artikelen
        </Link>
      </div>
    </article>
  );
}
