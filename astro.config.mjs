// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import vercel from "@astrojs/vercel";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { readingTimeRemarkPlugin } from "./src/lib/frontmatter";
import configIntegration from "./vendor/integration/index";
import icon from "astro-icon";
import { readFileSync } from "fs";
import { resolve } from "path";

const siteJsonAbsolute = resolve("./src/content/settings/site.json");
const siteData = JSON.parse(readFileSync(siteJsonAbsolute, "utf-8"));

/** @param {string | undefined | null} u */
function normalizeUrl(u) {
  if (!u) return null;
  const t = String(u).trim();
  if (!t) return null;
  const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  return withProto.replace(/\/+$/, "");
}

const SETTINGS_URL = normalizeUrl(siteData.seo?.siteUrl);
const PLACEHOLDER =
  !SETTINGS_URL ||
  /example\.com$/.test(SETTINGS_URL) ||
  /\.vercel\.app$/.test(SETTINGS_URL);

const SITE_URL =
  normalizeUrl(process.env.PUBLIC_SITE_URL) ||
  normalizeUrl(process.env.SITE_URL) ||
  (PLACEHOLDER
    ? normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
      normalizeUrl(process.env.VERCEL_URL) ||
      SETTINGS_URL
    : SETTINGS_URL) ||
  "https://example.com";

// https://astro.build/config
export default defineConfig({
  // Adapter enables on-demand (server-rendered) pages — used by the case-studies
  // routes (prerender=false) so admin edits appear without a rebuild. All other
  // pages stay static (output defaults to 'static').
  adapter: vercel(),
  site: SITE_URL,
  // Canonical URLs have no trailing slash. "never" also makes Vercel 308
  // "/x/" -> "/x", so old WordPress links like "/design/" reach the 301s below.
  trailingSlash: "never",
  // 301s from the previous WordPress site (dgplusnj.com) so old links and
  // search rankings carry over to the new routes.
  redirects: {
    "/venue-partner": "/indoor-billboards/become-a-venue-partner",
    "/host": "/indoor-billboards/become-a-venue-partner",
    "/screen-advertising": "/indoor-billboards/screen-advertising",
    "/website-design": "/solutions/foundational/website-design",
    "/google-business-profile": "/solutions/foundational/google-business-profile",
    "/social-media-management": "/solutions/foundational/social-media-management",
    "/design": "/solutions/foundational/design-services",
    "/social-media-ads": "/solutions/lead-gen/social-media-advertising",
    "/pay-per-click-ppc": "/solutions/lead-gen/pay-per-click",
    "/ppc-pay-per-click": "/solutions/lead-gen/pay-per-click",
    "/connected-tv-ott-ads": "/solutions/branding-awareness/connected-tv",
    "/geofencing": "/solutions/branding-awareness/display-geofencing",
    "/streaming-audio": "/solutions/branding-awareness/streaming-audio",
    "/pre-roll-advertising": "/solutions/branding-awareness/pre-roll-ads",
    "/youtube-ads": "/solutions/branding-awareness/youtube-advertising",
    "/privacy-policy": "/privacy",
  },
  integrations: [
    mdx(),
    icon(),
    sitemap({
      filter: (page) => !page.includes("/privacy") && !page.includes("/terms"),
    }),
    configIntegration(),
  ],
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Poppins",
      cssVariable: "--font-poppins",
      fallbacks: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/Poppins-Regular.ttf"],
            weight: 400,
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/Poppins-SemiBold.ttf"],
            weight: 600,
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/Poppins-Bold.ttf"],
            weight: 700,
            style: "normal",
          },
        ],
      },
    },
  ],
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "~": "/src",
      },
    },
    build: {
      cssMinify: true,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },
  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
  },
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
});
