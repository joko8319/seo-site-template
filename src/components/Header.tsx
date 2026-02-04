import Link from "next/link";
import Image from "next/image";
import { getSiteInfo } from "@/lib/seo-engine";

export async function Header() {
  const siteInfo = await getSiteInfo();
  const siteName = siteInfo.name;
  const logoUrl = siteInfo.logoUrl;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={siteName}
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <>
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {siteName.charAt(0)}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">{siteName}</span>
              </>
            )}
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/artikelen"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Artikelen
            </Link>
            <Link
              href="/onderwerpen"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Onderwerpen
            </Link>
            <Link
              href="/zoeken"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Zoeken"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>
          </nav>

          {/* Mobile menu button - can be expanded */}
          <button className="md:hidden p-2 text-gray-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
