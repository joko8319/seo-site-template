import Link from "next/link";
import Image from "next/image";

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  publishedAt?: number;
}

export function ArticleCard({
  title,
  slug,
  excerpt,
  featuredImage,
  featuredImageAlt,
  publishedAt,
}: ArticleCardProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("nl-NL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {featuredImage && (
        <Link href={`/${slug}`}>
          <div className="relative aspect-video">
            <Image
              src={featuredImage}
              alt={featuredImageAlt || title}
              fill
              className="object-cover"
            />
          </div>
        </Link>
      )}
      <div className="p-6">
        {formattedDate && (
          <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
        )}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          <Link href={`/${slug}`} className="hover:text-primary-600 transition-colors">
            {title}
          </Link>
        </h2>
        {excerpt && (
          <p className="text-gray-600 line-clamp-3">{excerpt}</p>
        )}
        <Link
          href={`/${slug}`}
          className="inline-flex items-center gap-1 mt-4 text-primary-600 font-medium hover:gap-2 transition-all"
        >
          Lees meer
          <svg
            className="w-4 h-4"
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
    </article>
  );
}
