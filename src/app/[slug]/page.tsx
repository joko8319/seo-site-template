import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getAllArticleSlugs, getSiteInfo, getRelatedArticles } from "@/lib/seo-engine";
import { AdBanner } from "@/components/AdBanner";
import { ArticleSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { ReadingTime } from "@/components/ReadingTime";
import { SocialShare } from "@/components/SocialShare";
import { RelatedArticles } from "@/components/RelatedArticles";
import { TableOfContents, addHeadingIds } from "@/components/TableOfContents";
import { AuthorBox } from "@/components/AuthorBox";

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
  const [article, siteInfo] = await Promise.all([
    getArticleBySlug(slug),
    getSiteInfo(),
  ]);

  if (!article) {
    return {
      title: "Artikel niet gevonden",
    };
  }

  const baseUrl = siteInfo.domain ? `https://${siteInfo.domain}` : "http://localhost:3000";
  const articleUrl = `${baseUrl}/${slug}`;

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    keywords: article.keywords?.join(", "),
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      type: "article",
      url: articleUrl,
      siteName: siteInfo.name,
      locale: "nl_NL",
      publishedTime: article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : undefined,
      modifiedTime: article.updatedAt
        ? new Date(article.updatedAt).toISOString()
        : undefined,
      images: article.featuredImage ? [{
        url: article.featuredImage,
        alt: article.featuredImageAlt || article.title,
      }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: article.featuredImage ? [article.featuredImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, siteInfo] = await Promise.all([
    getArticleBySlug(slug),
    getSiteInfo(),
  ]);

  if (!article) {
    notFound();
  }

  // Fetch related articles
  const relatedArticles = await getRelatedArticles(slug, article.clusterId);

  const baseUrl = siteInfo.domain ? `https://${siteInfo.domain}` : "http://localhost:3000";
  const articleUrl = `${baseUrl}/${slug}`;

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("nl-NL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const formattedUpdatedDate = article.updatedAt && article.updatedAt !== article.publishedAt
    ? new Date(article.updatedAt).toLocaleDateString("nl-NL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Add IDs to headings for table of contents
  const contentWithIds = article.content ? addHeadingIds(article.content) : "";

  return (
    <>
      {/* Structured Data */}
      <ArticleSchema
        title={article.title}
        description={article.metaDescription || article.excerpt}
        url={articleUrl}
        imageUrl={article.featuredImage}
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
        authorName={siteInfo.authorName || undefined}
        siteName={siteInfo.name}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: baseUrl },
          { name: "Artikelen", url: `${baseUrl}/artikelen` },
          { name: article.title, url: articleUrl },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <article className="flex-1 min-w-0">
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
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-3">
          {formattedDate && <span>Gepubliceerd: {formattedDate}</span>}
          {formattedUpdatedDate && (
            <>
              <span>•</span>
              <span>Bijgewerkt: {formattedUpdatedDate}</span>
            </>
          )}
          {(formattedDate || formattedUpdatedDate) && article.content && <span>•</span>}
          {article.content && <ReadingTime content={article.content} />}
        </div>
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
            alt={article.featuredImageAlt || article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Table of Contents */}
      {contentWithIds && (
        <TableOfContents content={contentWithIds} className="mb-8" />
      )}

      {/* Content */}
      {contentWithIds && (
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />
      )}

      {/* Ad after content */}
      {siteInfo.adsEnabled && (
        <div className="my-8">
          <AdBanner
            position="content"
            pageType="article"
            adsensePublisherId={siteInfo.adsensePublisherId}
            customAds={siteInfo.customAds}
            className="max-w-2xl mx-auto"
          />
        </div>
      )}

      {/* Social Share */}
      <SocialShare
        url={articleUrl}
        title={article.title}
        description={article.excerpt}
        className="mt-8 pt-8 border-t border-gray-200"
      />

      {/* Author Box */}
      {siteInfo.authorName && (
        <AuthorBox
          name={siteInfo.authorName}
          bio={siteInfo.authorBio}
          image={siteInfo.authorImage}
          socialLinks={siteInfo.authorSocialLinks}
          className="mt-8"
        />
      )}

      {/* Tags/Keywords */}
      {article.keywords && article.keywords.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200">
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

      {/* Related Articles */}
      <RelatedArticles articles={relatedArticles} currentSlug={slug} />

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

        {/* Sidebar */}
        {siteInfo.adsEnabled && (
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <AdBanner
                position="sidebar"
                pageType="article"
                adsensePublisherId={siteInfo.adsensePublisherId}
                customAds={siteInfo.customAds}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
    </>
  );
}
