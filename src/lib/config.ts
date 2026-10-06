// ============================================
// GLOBAL SITE CONFIGURATION
// Reads from src/content/settings/site.json via siteConfig
// ============================================

import { siteConfig } from "../config/site";

export const SITE_NAME = siteConfig.business.name;
export const SITE_URL = siteConfig.seo.siteUrl;
export const SITE_DESCRIPTION = siteConfig.seo.defaultDescription;

// JSON metadata.title is authoritative — no auto-append of siteName.
// Falls back to defaultTitle when no per-page title supplied.
export function getPageTitle(pageTitle?: string): string {
  return pageTitle || siteConfig.seo.defaultTitle;
}

export default siteConfig;
