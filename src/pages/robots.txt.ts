import type { APIRoute } from "astro";
import { siteConfig } from "~/config/site";

const host = siteConfig.seo.siteUrl.replace(/^https?:\/\//, "");

// A crawler obeys only the most specific group that names it, so every group
// that should crawl the site must carry the full rule set. Pages hidden from
// search (/privacy, /terms) use a noindex meta tag instead of Disallow — a
// blocked page can still be indexed, because the crawler never sees the tag.
const getRobotsTxt = (sitemapURL: URL) => `# robots.txt for ${host}

User-agent: *
Allow: /

# AI search and assistant crawlers: explicitly allowed for citation visibility
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: meta-externalagent
User-agent: CCBot
User-agent: Bytespider
Allow: /

# SEO tools: throttled
User-agent: AhrefsBot
User-agent: SemrushBot
User-agent: MJ12bot
User-agent: DotBot
Allow: /
Crawl-delay: 10

# Aggressive scrapers: blocked
User-agent: MauiBot
User-agent: SiteSnagger
User-agent: WebCopier
User-agent: WebReaper
User-agent: HTTrack
Disallow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site ?? siteConfig.seo.siteUrl);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
