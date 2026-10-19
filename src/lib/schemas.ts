// ============================================
// SCHEMA FACTORIES (JSON-LD)
// One <script> per entity. No @graph wrapper — entities reference each other
// by @id, which Google resolves across scripts on the same page.
// ============================================

import { siteConfig } from "~/config/site";
import bloomfieldData from "~/data/locations/bloomfield.json";
import montclairData from "~/data/locations/montclair.json";
import veronaData from "~/data/locations/verona.json";

const siteUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");
const socialLinks = Object.values(siteConfig.social).filter(Boolean) as string[];
// Omit sameAs entirely when no social profiles are set (an empty array is flagged).
const sameAs = socialLinks.length ? { sameAs: socialLinks } : {};

const ORGANIZATION_ID = `${siteUrl}#organization`;
const BUSINESS_ID = `${siteUrl}#localbusiness`;
const WEBSITE_ID = `${siteUrl}#website`;

// Cities with a location page — the business's service area.
const serviceCities = [bloomfieldData, montclairData, veronaData]
  .map((d: any) => d.city || d.location)
  .filter(Boolean) as string[];
const areaServed = serviceCities.map((name) => ({ "@type": "City", name }));

function absoluteUrl(path: string) {
  // Canonical URLs have no trailing slash, so the home page is the bare origin.
  if (path === "/" || path === "") return siteUrl;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${p}`;
}

function absoluteImage(path?: string) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return absoluteUrl(path);
}

// Google expects an international format, e.g. +1-973-941-6773.
function internationalPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const national = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (national.length !== 10) return phone;
  return `+1-${national.slice(0, 3)}-${national.slice(3, 6)}-${national.slice(6)}`;
}

const telephone = internationalPhone(siteConfig.contact.phone);

// ─── Primary LocalBusiness (physical presence) ──────────────────────────────
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: siteConfig.business.name,
    description: siteConfig.business.description,
    url: siteUrl,
    image: absoluteImage(siteConfig.logo.src),
    logo: absoluteImage(siteConfig.logo.src),
    telephone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.location.address,
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.state,
      postalCode: siteConfig.location.postalCode,
      addressCountry: "US",
    },
    priceRange: "$",
    areaServed,
    parentOrganization: { "@id": ORGANIZATION_ID },
    ...sameAs,
  };
}

// ─── Brand / Organization (web entity, publisher target) ────────────────────
export function brandOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.business.name,
    alternateName: siteConfig.seo.siteName,
    url: siteUrl,
    logo: absoluteImage(siteConfig.logo.src),
    contactPoint: {
      "@type": "ContactPoint",
      telephone,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: ["en"],
    },
    ...sameAs,
  };
}

// ─── WebSite ─────────────────────────────────────────────────────────────────
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.business.name,
    url: siteUrl,
    publisher: { "@id": ORGANIZATION_ID },
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
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en-US",
    publisher: { "@id": ORGANIZATION_ID },
  };
  if (opts.image) schema.primaryImageOfPage = { "@type": "ImageObject", url: absoluteImage(opts.image) };
  return schema;
}

// ─── Breadcrumb ──────────────────────────────────────────────────────────────
export function breadcrumbSchema(items: Array<{ name: string; url?: string }>) {
  // Google requires an `item` URL on every crumb except the last. Visual crumbs
  // with no landing page (e.g. "Foundational") are skipped here.
  const linked = items.filter((item, i) => item.url || i === items.length - 1);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: linked.map((item, i) => ({
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
    provider: { "@id": BUSINESS_ID },
    areaServed,
    ...(opts.image && { image: absoluteImage(opts.image) }),
  };
}

// ─── Service scoped to a city (per location page) ───────────────────────────
// A Service with areaServed, not a second LocalBusiness: Google expects
// LocalBusiness only for real physical locations, and the only office is the
// primary LocalBusiness above.
export function cityServiceSchema(opts: {
  city: string;
  url: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(opts.url)}#service`,
    name: `Digital Marketing in ${opts.city}, ${siteConfig.location.state}`,
    url: absoluteUrl(opts.url),
    description:
      opts.description ||
      `Digital marketing services in ${opts.city}, ${siteConfig.location.stateFull}.`,
    provider: { "@id": BUSINESS_ID },
    areaServed: {
      "@type": "City",
      name: opts.city,
      containedInPlace: { "@type": "State", name: siteConfig.location.stateFull },
    },
  };
}
