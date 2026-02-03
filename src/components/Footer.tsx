import Link from "next/link";
import { getSiteInfo } from "@/lib/seo-engine";

export async function Footer() {
  const siteInfo = await getSiteInfo();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {siteInfo.name.charAt(0)}
                </span>
              </div>
              <span className="font-semibold text-white">{siteInfo.name}</span>
            </div>
            <p className="text-sm">
              {siteInfo.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Snelle Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/artikelen" className="text-sm hover:text-white transition-colors">
                  Artikelen
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>{siteInfo.contactEmail}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} {siteInfo.name}. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
}
