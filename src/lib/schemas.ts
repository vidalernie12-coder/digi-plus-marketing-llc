// ============================================
// SCHEMA FACTORIES (JSON-LD)
// One <script> per entity. No @graph wrapper.
// ============================================

import { siteConfig } from "~/config/site";

const siteUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");
const sameAs = Object.values(siteConfig.social).filter(Boolean) as string[];

function absoluteUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${p}`;
}

function absoluteImage(path?: string) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return absoluteUrl(path);
}

// ─── Primary LocalBusiness (physical presence) ──────────────────────────────
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.business.name,
    description: siteConfig.business.description,
    url: siteUrl,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.state,
      addressCountry: "US",
    },
    priceRange: "$",
    areaServed: { "@type": "City", name: siteConfig.location.city },
    sameAs,
  };
}

// ─── Brand / Organization (web entity, publisher target) ────────────────────
export function brandOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.business.name,
    alternateName: siteConfig.seo.siteName,
    url: siteUrl,
    logo: absoluteImage(siteConfig.logo.src),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: ["en"],
    },
    sameAs,
  };
}

// ─── WebSite ─────────────────────────────────────────────────────────────────
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    name: siteConfig.business.name,
    url: siteUrl,
    publisher: { "@type": "Organization", name: siteConfig.business.name, url: siteUrl },
  };
}

// ─── WebPage ─────────────────────────────────────────────────────────────────
export function webPageSchema(opts: {
  url: string;
  name: string;
  description?: string;
  image?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(opts.url)}#webpage`,
    url: absoluteUrl(opts.url),
    name: opts.name,
    description: opts.description,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: siteConfig.business.name,
    },
    inLanguage: "en-US",
    publisher: { "@type": "Organization", name: siteConfig.business.name, url: siteUrl },
  };
  if (opts.image) schema.primaryImageOfPage = { "@type": "ImageObject", url: absoluteImage(opts.image) };
  return schema;
}

// ─── Breadcrumb ──────────────────────────────────────────────────────────────
export function breadcrumbSchema(items: Array<{ name: string; url?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: absoluteUrl(item.url) } : {}),
    })),
  };
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  if (!faqs?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer.replace(/<[^>]*>/g, ""),
      },
    })),
  };
}

// ─── Service (per solution/billboard slug) ──────────────────────────────────
export function serviceSchema(opts: {
  name: string;
  description?: string;
  url: string;
  serviceType?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.url),
    ...(opts.serviceType && { serviceType: opts.serviceType }),
    provider: {
      "@type": "Organization",
      name: siteConfig.business.name,
      url: siteUrl,
    },
    areaServed: { "@type": "City", name: siteConfig.location.city },
    ...(opts.image && { image: absoluteImage(opts.image) }),
  };
}

// ─── LocalBusiness scoped to a city (per location page) ─────────────────────
export function localBusinessForCity(opts: {
  city: string;
  url: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${absoluteUrl(opts.url)}#localbusiness`,
    name: `${siteConfig.business.name} – ${opts.city}`,
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.business.name,
      url: siteUrl,
    },
    url: absoluteUrl(opts.url),
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    description:
      opts.description ||
      `Digital marketing services in ${opts.city}, ${siteConfig.location.stateFull}.`,
    address: {
      "@type": "PostalAddress",
      addressLocality: opts.city,
      addressRegion: siteConfig.location.state,
      addressCountry: "US",
    },
    areaServed: { "@type": "City", name: opts.city },
    sameAs,
  };
}
