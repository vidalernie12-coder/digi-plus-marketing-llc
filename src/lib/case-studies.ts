// ============================================
// Case Studies — thin data layer
//
// This is the ONLY per-template data code. It just fetch()es the shared
// "case-studies" Edge Function, which queries Supabase server-side with the
// anon key (never shipped here) and returns this client's PUBLISHED studies.
//
//   GET <API>?client=<slug>
//   → { client: { id, slug, name, logo_url } | null, studies: CaseStudy[] }
//
// Config (optional, via .env):
//   PUBLIC_CLIENT_SLUG        which client's studies to show (default "ntv360")
//   PUBLIC_CASE_STUDIES_API   override the endpoint (defaults to the NTV360 fn)
// ============================================

const API =
  (import.meta.env.PUBLIC_CASE_STUDIES_API as string | undefined) ||
  "https://swluvugjmdeawawvisql.functions.supabase.co/case-studies";

const CLIENT_SLUG =
  (import.meta.env.PUBLIC_CLIENT_SLUG as string | undefined) || "ntv360";

/** One stat callout on the detail page, e.g. { value: "51.1%", label: "GBP Views" }. */
export interface Stat {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  client_id: string;

  slug: string;
  title: string;
  category: string | null;

  thumbnail_url: string | null;
  client_logo_url: string | null;
  hero_image_url: string | null;
  website_url: string | null;

  industry: string | null;
  challenge_summary: string | null;
  results_summary: string | null;

  stats: Stat[];

  about_business: string | null;
  challenge_body: string | null;
  solution_body: string | null;
  results_body: string | null;

  gallery: string[];

  published: boolean;
  sort_order: number;

  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  client: { id: string; slug: string; name: string; logo_url: string | null } | null;
  studies?: CaseStudy[];
  error?: string;
}

/** Fetch the full payload for a client once; callers derive what they need. */
async function fetchStudies(clientSlug = CLIENT_SLUG): Promise<CaseStudy[]> {
  const url = `${API}?client=${encodeURIComponent(clientSlug)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Case Studies API ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as ApiResponse;
  if (data.error) throw new Error(`Case Studies API: ${data.error}`);

  // Defensive normalize — the function already shapes these, but never trust
  // arrays to be present at the type boundary.
  return (data.studies ?? []).map((cs) => ({
    ...cs,
    stats: Array.isArray(cs.stats) ? cs.stats : [],
    gallery: Array.isArray(cs.gallery) ? cs.gallery : [],
  }));
}

/**
 * List published case studies, in the API's sort order.
 * Optional category filter (omit or pass "All" for no filter).
 */
export async function listCaseStudies(
  options: { category?: string } = {},
): Promise<CaseStudy[]> {
  const studies = await fetchStudies();
  const { category } = options;
  if (!category || category === "All") return studies;
  return studies.filter((cs) => cs.category === category);
}

/** Distinct, sorted category names across this client's published studies. */
export async function getCategories(): Promise<string[]> {
  const studies = await fetchStudies();
  const set = new Set<string>();
  for (const cs of studies) {
    if (cs.category && cs.category.trim()) set.add(cs.category.trim());
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Get one published case study by its slug (or null if not found). */
export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const studies = await fetchStudies();
  return studies.find((cs) => cs.slug === slug) ?? null;
}
