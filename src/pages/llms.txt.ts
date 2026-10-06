import type { APIRoute } from "astro";
import { siteConfig } from "~/config/site";
import arvadaData from "~/data/locations/arvada.json";
import auroraData from "~/data/locations/aurora.json";
import centennialData from "~/data/locations/centennial.json";
import lakewoodData from "~/data/locations/lakewood.json";

const locations = [arvadaData, auroraData, centennialData, lakewoodData]
  .map((d: any) => d.location)
  .filter(Boolean) as string[];

const body = () => `# ${siteConfig.business.name} - Digital Marketing & Indoor Billboard Advertising

> Digital marketing agency specializing in indoor billboard advertising and full-service marketing for ${siteConfig.location.stateFull} businesses.

## About Us

${siteConfig.business.name} is a full-service digital marketing agency based in ${siteConfig.location.city}, ${siteConfig.location.stateFull}. We help local businesses grow through indoor billboard advertising and full-service digital marketing.

## Services

### Indoor Billboard Advertising
- Screen Advertising: Hyper-local digital screens in high-traffic venues — [/indoor-billboards/screen-advertising](${siteConfig.seo.siteUrl}/indoor-billboards/screen-advertising)
- Venue Network Locations: See where ads appear — [/indoor-billboards/locations](${siteConfig.seo.siteUrl}/indoor-billboards/locations)
- Become a Venue Partner: Host a billboard in your business — [/indoor-billboards/become-a-venue-partner](${siteConfig.seo.siteUrl}/indoor-billboards/become-a-venue-partner)

### Foundational Marketing Services
- Website Design & Development: SEO-friendly, mobile-ready sites — [/solutions/foundational/website-design](${siteConfig.seo.siteUrl}/solutions/foundational/website-design)
- Google Business Profile Management: Local search optimization — [/solutions/foundational/google-business-profile](${siteConfig.seo.siteUrl}/solutions/foundational/google-business-profile)
- Social Media Management: Strategic content and engagement — [/solutions/foundational/social-media-management](${siteConfig.seo.siteUrl}/solutions/foundational/social-media-management)
- Design Services: Professional graphic design — [/solutions/foundational/design-services](${siteConfig.seo.siteUrl}/solutions/foundational/design-services)

### Lead Generation Services
- Pay-Per-Click Advertising: Google Ads that drive conversions — [/solutions/lead-gen/pay-per-click](${siteConfig.seo.siteUrl}/solutions/lead-gen/pay-per-click)
- Social Media Advertising: Targeted ads on Facebook, Instagram, LinkedIn — [/solutions/lead-gen/social-media-advertising](${siteConfig.seo.siteUrl}/solutions/lead-gen/social-media-advertising)

### Branding & Awareness Services
- Connected TV & OTT Ads: Non-skippable streaming TV ads — [/solutions/branding-awareness/connected-tv](${siteConfig.seo.siteUrl}/solutions/branding-awareness/connected-tv)
- Display Advertising & Geofencing: Location-targeted digital ads — [/solutions/branding-awareness/display-geofencing](${siteConfig.seo.siteUrl}/solutions/branding-awareness/display-geofencing)
- Streaming Audio Ads: Podcast and music streaming advertising — [/solutions/branding-awareness/streaming-audio](${siteConfig.seo.siteUrl}/solutions/branding-awareness/streaming-audio)

## Service Areas

We serve businesses throughout ${siteConfig.location.stateFull}, including:
${locations.map((c) => `- [${c}, ${siteConfig.location.state}](${siteConfig.seo.siteUrl}/locations/${c.toLowerCase()})`).join("\n")}

## Key Pages

- [Home](${siteConfig.seo.siteUrl}/) — overview
- [About Us](${siteConfig.seo.siteUrl}/about-us) — team and approach
- [All Solutions](${siteConfig.seo.siteUrl}/solutions) — full service catalog
- [Contact](${siteConfig.seo.siteUrl}/contact-us) — request a consultation

## Contact Information

- Website: ${siteConfig.seo.siteUrl}
- Email: ${siteConfig.contact.email}
- Phone: ${siteConfig.contact.phoneFormatted}
- Location: ${siteConfig.location.fullAddress}
- Service Type: B2B Marketing Services
`;

export const GET: APIRoute = () => {
  return new Response(body(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
