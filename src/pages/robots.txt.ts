import type { APIRoute } from "astro";
import { siteConfig } from "~/config/site";

const host = siteConfig.seo.siteUrl.replace(/^https?:\/\//, "");

const getRobotsTxt = (sitemapURL: URL) => `# robots.txt for ${host}
# Optimized for SEO + AI crawler discoverability

User-agent: *
Allow: /
Disallow: /privacy
Disallow: /terms
Disallow: /admin/
Disallow: /api/
Disallow: /_astro/

Allow: /*.css
Allow: /*.js
Allow: /*.svg
Allow: /*.webp
Allow: /*.avif

Sitemap: ${sitemapURL.href}

# Major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /
Crawl-delay: 0

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# AI / LLM crawlers — explicit allow for citation visibility
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: Bytespider
Allow: /

# SEO tools — throttle
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

User-agent: MJ12bot
Crawl-delay: 10

User-agent: DotBot
Crawl-delay: 10

# Block aggressive scrapers
User-agent: MauiBot
Disallow: /

User-agent: SiteSnagger
Disallow: /

User-agent: WebCopier
Disallow: /

User-agent: WebReaper
Disallow: /

User-agent: HTTrack
Disallow: /
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site ?? siteConfig.seo.siteUrl);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
