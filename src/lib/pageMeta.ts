// ============================================
// buildPageMeta: metadata + extraSchemas in one call
// ============================================

import { localizeMetadata } from "~/config/site";
import { faqSchema, serviceSchema, localBusinessForCity } from "~/lib/schemas";

type AnyPage = {
  title?: string;
  description?: string;
  keywords?: string;
  metadata?: { title?: string; description?: string; keywords?: string };
  sections?: Array<{
    section?: string;
    discriminant?: string;
    faqs?: any[];
    value?: { faqs?: any[]; [k: string]: any };
    [k: string]: any;
  }>;
};

export interface PageMetaOptions {
  service?: { url: string; name?: string; description?: string; serviceType?: string };
  city?: { city: string; url: string; description?: string };
  extras?: Record<string, string>;
}

export function buildPageMeta(pageData: AnyPage, opts: PageMetaOptions = {}) {
  const rawMeta = pageData.metadata ?? {};
  const metadata = localizeMetadata(
    {
      title: rawMeta.title || pageData.title,
      description: rawMeta.description || pageData.description,
      keywords: rawMeta.keywords || pageData.keywords,
    },
    opts.extras ?? {}
  );

  const extraSchemas: any[] = [];

  // FAQ section auto-detect (supports both the flat legacy shape and the new
  // discriminant/value shape).
  const faqSection = pageData.sections?.find(
    (s) =>
      s?.section === "FAQs" ||
      s?.section === "FAQ" ||
      s?.discriminant === "faq" ||
      s?.discriminant === "faqs"
  );
  const faqList = faqSection?.faqs || faqSection?.value?.faqs;
  if (faqList?.length) {
    const f = faqSchema(faqList);
    if (f) extraSchemas.push(f);
  }

  if (opts.service) {
    extraSchemas.push(
      serviceSchema({
        name: opts.service.name || metadata.title || pageData.title || "",
        description: opts.service.description || metadata.description || pageData.description,
        url: opts.service.url,
        serviceType: opts.service.serviceType,
      })
    );
  }

  if (opts.city) {
    extraSchemas.push(
      localBusinessForCity({
        city: opts.city.city,
        url: opts.city.url,
        description: opts.city.description || metadata.description,
      })
    );
  }

  return { metadata, extraSchemas };
}
