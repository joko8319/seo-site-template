import { getArticles, getSiteInfo } from "@/lib/seo-engine";

export async function GET() {
  const siteInfo = await getSiteInfo();
  const { articles } = await getArticles({ limit: 50 });

  const baseUrl = siteInfo.domain ? `https://${siteInfo.domain}` : "http://localhost:3000";

  const rssItems = articles
    .map((article) => {
      const pubDate = article.publishedAt
        ? new Date(article.publishedAt).toUTCString()
        : new Date().toUTCString();

      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${article.slug}</guid>
      <description><![CDATA[${article.excerpt || article.title}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${article.featuredImage ? `<enclosure url="${article.featuredImage}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${siteInfo.name}]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${siteInfo.description}]]></description>
    <language>nl</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
