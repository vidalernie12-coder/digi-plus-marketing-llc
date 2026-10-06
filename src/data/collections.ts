// Helper to provide collection-like data from JSON files
// Replaces getCollection("solutions") and getCollection("indoor-billboards")
import { localizeData } from "~/config/site";

// Solutions imports
import designServicesData from "~/data/pages/design-services.json";
import googleBusinessProfileData from "~/data/pages/google-business-profile.json";
import socialMediaManagementData from "~/data/pages/social-media-management.json";
import websiteDesignData from "~/data/pages/website-design.json";
import payPerClickData from "~/data/pages/pay-per-click.json";
import socialMediaAdvertisingData from "~/data/pages/social-media-advertising.json";
import connectedTvData from "~/data/pages/connected-tv.json";
import displayGeofencingData from "~/data/pages/display-geofencing.json";
import streamingAudioData from "~/data/pages/streaming-audio.json";

// Indoor billboards imports
import becomeAVenuePartnerData from "~/data/pages/become-a-venue-partner.json";
import billboardLocationsData from "~/data/pages/billboard-locations.json";
import screenAdvertisingData from "~/data/pages/screen-advertising.json";

function toEntry(slug: string, data: any) {
  return { slug, data: localizeData(data) };
}

export function getSolutionsData() {
  return [
    toEntry("foundational/design-services", designServicesData),
    toEntry("foundational/google-business-profile", googleBusinessProfileData),
    toEntry("foundational/social-media-management", socialMediaManagementData),
    toEntry("foundational/website-design", websiteDesignData),
    toEntry("lead-gen/pay-per-click", payPerClickData),
    toEntry("lead-gen/social-media-advertising", socialMediaAdvertisingData),
    toEntry("branding-awareness/connected-tv", connectedTvData),
    toEntry("branding-awareness/display-geofencing", displayGeofencingData),
    toEntry("branding-awareness/streaming-audio", streamingAudioData),
  ];
}

export function getIndoorBillboardsData() {
  return [
    toEntry("become-a-venue-partner", becomeAVenuePartnerData),
    toEntry("locations", billboardLocationsData),
    toEntry("screen-advertising", screenAdvertisingData),
  ];
}
