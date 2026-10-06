// ===========================================
// SITE CONFIGURATION
// Reads from src/content/settings/site.json
// ===========================================

import siteData from "../content/settings/site.json";

const defaults = {
  business: {
    name: "Digi Plus Marketing",
    fullName: "Digi Plus Marketing LLC",
    tagline: "Helping Bloomfield Businesses Get Noticed On Screens and Online",
    description:
      "Bloomfield, NJ marketing agency offering indoor digital billboards, website design, SEO, PPC, and social media management for businesses in Bloomfield, Montclair, and Verona.",
  },
  location: {
    city: "Bloomfield",
    state: "NJ",
    stateFull: "New Jersey",
    address: "41 Pulaski St",
    fullAddress: "41 Pulaski St, Bloomfield, NJ 07003",
    postalCode: "07003",
  },
  contact: {
    email: "ernievidal@dgplusnj.com",
    phone: "9739416773",
    phoneFormatted: "(973) 941-6773",
  },
  colors: {
    primary: "#0d3b3b",
    secondary: "#14b8a6",
    tertiary: "#082323",
    quaternary: "#ffffff",
  },
  logo: {
    src: "/logo/digi-plus-marketing.svg",
    whiteSrc: "/logo/digi-plus-marketing-white.svg",
    alt: "Digi Plus Marketing logo",
  },
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: "",
  },
  seo: {
    siteName: "Digi Plus Marketing",
    defaultTitle: "Digi Plus Marketing | Digital Signage & Marketing in Bloomfield, NJ",
    defaultDescription:
      "Bloomfield, NJ marketing agency offering indoor digital billboards, website design, SEO, PPC, and social media management for businesses in Bloomfield, Montclair, and Verona.",
    keywords: "Bloomfield NJ marketing agency, digital marketing Bloomfield, indoor billboards New Jersey, website design, SEO, PPC",
    siteUrl: "https://dgplusnj.com",
    ogImage: "/og-image.png",
    twitterHandle: "",
  },
  analytics: { googleAnalyticsId: "" },
};

// ─── URL Resolution Chain (Vercel-aware) ─────────────────────────────────────
function normalizeUrl(u: string | undefined | null): string | null {
  if (!u) return null;
  const t = String(u).trim();
  if (!t) return null;
  const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  return withProto.replace(/\/+$/, "");
}

const env = import.meta.env as Record<string, string | undefined>;
const SETTINGS_URL = normalizeUrl(siteData.seo?.siteUrl) ?? normalizeUrl(defaults.seo.siteUrl);
const PLACEHOLDER =
  !SETTINGS_URL ||
  /example\.com$/.test(SETTINGS_URL) ||
  /\.vercel\.app$/.test(SETTINGS_URL);

const RESOLVED_SITE_URL =
  normalizeUrl(env.PUBLIC_SITE_URL) ||
  normalizeUrl(env.SITE_URL) ||
  (PLACEHOLDER
    ? normalizeUrl(env.VERCEL_PROJECT_PRODUCTION_URL) ||
      normalizeUrl(env.VERCEL_URL) ||
      SETTINGS_URL
    : SETTINGS_URL) ||
  "https://example.com";

export const siteConfig = {
  business: {
    name: siteData.business?.name || defaults.business.name,
    fullName: siteData.business?.fullName || defaults.business.fullName,
    tagline: siteData.business?.tagline || defaults.business.tagline,
    description: siteData.business?.description || defaults.business.description,
  },

  location: {
    city: siteData.location?.city || defaults.location.city,
    state: siteData.location?.state || defaults.location.state,
    stateFull:
      (siteData.location as { stateFull?: string })?.stateFull ||
      defaults.location.stateFull,
    address: siteData.location?.address || defaults.location.address,
    fullAddress: siteData.location?.fullAddress || defaults.location.fullAddress,
    postalCode:
      (siteData.location as { postalCode?: string })?.postalCode ||
      defaults.location.postalCode,
  },

  contact: {
    email: siteData.contact?.email || defaults.contact.email,
    phone: siteData.contact?.phone || defaults.contact.phone,
    phoneFormatted: siteData.contact?.phoneFormatted || defaults.contact.phoneFormatted,
  },

  colors: {
    primary: siteData.colors?.primary || defaults.colors.primary,
    secondary: siteData.colors?.secondary || defaults.colors.secondary,
    tertiary: siteData.colors?.tertiary || defaults.colors.tertiary,
    quaternary: siteData.colors?.quaternary || defaults.colors.quaternary,
  },

  logo: {
    src: siteData.logo?.src || defaults.logo.src,
    whiteSrc:
      (siteData.logo as { whiteSrc?: string })?.whiteSrc ||
      siteData.logo?.src ||
      defaults.logo.whiteSrc,
    alt: siteData.logo?.alt || defaults.logo.alt,
  },

  social: {
    facebook: siteData.social?.facebook || "",
    instagram: siteData.social?.instagram || "",
    linkedin: siteData.social?.linkedin || "",
    twitter: siteData.social?.twitter || "",
    youtube: siteData.social?.youtube || "",
  },

  seo: {
    siteName: siteData.seo?.siteName || defaults.seo.siteName,
    defaultTitle: siteData.seo?.defaultTitle || defaults.seo.defaultTitle,
    defaultDescription:
      siteData.seo?.defaultDescription || defaults.seo.defaultDescription,
    keywords: siteData.seo?.keywords || defaults.seo.keywords,
    siteUrl: RESOLVED_SITE_URL,
    ogImage: siteData.seo?.ogImage || defaults.seo.ogImage,
    twitterHandle: siteData.seo?.twitterHandle || defaults.seo.twitterHandle,
  },

  analytics: {
    googleAnalyticsId: siteData.analytics?.googleAnalyticsId || "",
  },
};

// ─── Token Replacement Helpers ──────────────────────────────────────────────
export function getLocationText(text: string) {
  return text
    .replaceAll("{city}", siteConfig.location.city)
    .replaceAll("{state}", siteConfig.location.state)
    .replaceAll("{stateFull}", siteConfig.location.stateFull)
    .replaceAll("{fullAddress}", siteConfig.location.fullAddress)
    .replaceAll("{business}", siteConfig.business.name)
    .replaceAll("{email}", siteConfig.contact.email)
    .replaceAll("{phone}", siteConfig.contact.phone)
    .replaceAll("{phoneFormatted}", siteConfig.contact.phoneFormatted);
}

// Recursively replace tokens in all string values of an object/array
export function localizeData<T>(data: T): T {
  if (typeof data === "string") return getLocationText(data) as T;
  if (Array.isArray(data)) return data.map((item) => localizeData(item)) as T;
  if (data !== null && typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = localizeData(value);
    }
    return result as T;
  }
  return data;
}

// Localize metadata block with optional extra tokens (e.g. {location})
export function localizeMetadata(
  meta: any,
  extras: Record<string, string> = {}
) {
  if (!meta) return meta;
  const apply = (s: string | undefined) => {
    if (!s) return s;
    let out = getLocationText(s);
    for (const [k, v] of Object.entries(extras)) {
      out = out.replaceAll(`{${k}}`, v);
    }
    return out;
  };
  return {
    ...meta,
    title: apply(meta.title),
    description: apply(meta.description),
    keywords: apply(meta.keywords),
  };
}
