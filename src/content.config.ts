import { z, defineCollection } from "astro:content";

// Reusable metadata schema for SEO
const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),
      canonical: z.string().url().optional(),
      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),
      description: z.string().optional(),
      keywords: z.string().optional(),
      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),
      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

// Solutions collection (website design, social media, etc.)
const solutions = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["foundational", "lead-gen", "branding-awareness"]),
    order: z.number().optional(),
    icon: z.string().optional(),
    thumbnail: z.string().optional(),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    image: z.string().optional(),
    sections: z
      .array(
        z.object({
          section: z.string(),
          title: z.string(),
          description: z.string().optional(),
          eyebrow: z.string().optional(),
          image: z.string().optional(),
          videoUrl: z.string().optional(),
          videoPosition: z.string().optional(),
          poster: z.string().optional(),
          autoplay: z.boolean().optional(),
          muted: z.boolean().optional(),
          loop: z.boolean().optional(),
          controls: z.boolean().optional(),
          background: z.string().optional(),
          imagePosition: z.string().optional(),
          order: z.number().optional(),
          ctaText: z.string().optional(),
          ctaLink: z.string().optional(),
          keyPoints: z.array(z.string()).optional(),
          faqs: z
            .array(
              z.object({
                question: z.string(),
                answer: z.string(),
              })
            )
            .optional(),
          features: z
            .array(
              z.object({
                title: z.string(),
                description: z.string(),
                image: z.string().optional(),
                icon: z.string().optional(),
              })
            )
            .optional(),
          isCarousel: z.boolean().optional(),
          itemsPerSlide: z.number().optional(),
          carouselAutoplay: z.boolean().optional(),
          carouselAutoplayDelay: z.number().optional(),
          skills: z
            .array(
              z.object({
                title: z.string(),
                description: z.string().optional(),
                background: z.string().optional(),
                image: z.string().optional(),
              })
            )
            .optional(),
          networks: z
            .array(
              z.object({
                title: z.string(),
                brands: z.array(
                  z.object({
                    name: z.string(),
                    logo: z.string(),
                  })
                ),
              })
            )
            .optional(),
          formFields: z
            .array(
              z.object({
                id: z.string(),
                name: z.string(),
                label: z.string(),
                type: z.enum([
                  "text",
                  "email",
                  "tel",
                  "number",
                  "textarea",
                  "select",
                  "checkbox",
                  "radio",
                ]),
                placeholder: z.string().optional(),
                required: z.boolean().optional(),
                options: z.array(z.string()).optional(),
                rows: z.number().optional(),
                pattern: z.string().optional(),
                helpText: z.string().optional(),
                width: z.enum(["full", "half"]).optional(),
              })
            )
            .optional(),
          submitText: z.string().optional(),
          submitAction: z.string().optional(),
          locations: z
            .array(
              z.union([
                z.string(),
                z.object({
                  name: z.string(),
                  url: z.string().optional(),
                }),
              ])
            )
            .optional(),
          mapUrl: z.string().optional(),
          viewMode: z.enum(["half", "full"]).optional(),
        })
      )
      .optional(),
    metadata: metadataDefinition(),
  }),
});

// Indoor Billboards collection
const indoorBillboards = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
    icon: z.string().optional(),
    thumbnail: z.string().optional(),
    image: z.string().optional(),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    sections: z
      .array(
        z.object({
          section: z.string(),
          title: z.string(),
          description: z.string().optional(),
          eyebrow: z.string().optional(),
          image: z.string().optional(),
          videoUrl: z.string().optional(),
          videoPosition: z.string().optional(),
          poster: z.string().optional(),
          autoplay: z.boolean().optional(),
          muted: z.boolean().optional(),
          loop: z.boolean().optional(),
          controls: z.boolean().optional(),
          background: z.string().optional(),
          imagePosition: z.string().optional(),
          order: z.number().optional(),
          ctaText: z.string().optional(),
          ctaLink: z.string().optional(),
          keyPoints: z.array(z.string()).optional(),
          faqs: z
            .array(
              z.object({
                question: z.string(),
                answer: z.string(),
              })
            )
            .optional(),
          features: z
            .array(
              z.object({
                title: z.string(),
                description: z.string(),
                image: z.string().optional(),
                icon: z.string().optional(),
              })
            )
            .optional(),
          isCarousel: z.boolean().optional(),
          itemsPerSlide: z.number().optional(),
          carouselAutoplay: z.boolean().optional(),
          carouselAutoplayDelay: z.number().optional(),
          skills: z
            .array(
              z.object({
                title: z.string(),
                description: z.string().optional(),
                background: z.string().optional(),
                image: z.string().optional(),
              })
            )
            .optional(),
          networks: z
            .array(
              z.object({
                title: z.string(),
                brands: z.array(
                  z.object({
                    name: z.string(),
                    logo: z.string(),
                  })
                ),
              })
            )
            .optional(),
          formFields: z
            .array(
              z.object({
                id: z.string(),
                name: z.string(),
                label: z.string(),
                type: z.enum([
                  "text",
                  "email",
                  "tel",
                  "number",
                  "textarea",
                  "select",
                  "checkbox",
                  "radio",
                ]),
                placeholder: z.string().optional(),
                required: z.boolean().optional(),
                options: z.array(z.string()).optional(),
                rows: z.number().optional(),
                pattern: z.string().optional(),
                helpText: z.string().optional(),
                width: z.enum(["full", "half"]).optional(),
              })
            )
            .optional(),
          submitText: z.string().optional(),
          submitAction: z.string().optional(),
          locations: z
            .array(
              z.union([
                z.string(),
                z.object({
                  name: z.string(),
                  url: z.string().optional(),
                }),
              ])
            )
            .optional(),
          mapUrl: z.string().optional(),
          viewMode: z.enum(["half", "full"]).optional(),
        })
      )
      .optional(),
    metadata: metadataDefinition(),
  }),
});

// A section entry in the new discriminant/value format. The `value` payload
// varies per discriminant, so it's kept permissive (passthrough) — the shared
// SectionRenderer normalizes fields before handing them to each component.
const sectionEntry = () =>
  z.object({
    discriminant: z.string(),
    value: z.record(z.string(), z.any()).optional(),
    order: z.number().optional(),
  });

// A single legal clause (used by privacy / terms pages).
const legalSection = () =>
  z.object({
    title: z.string(),
    content: z.string(),
  });

// Pages collection (for homepage and other pages)
const pages = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string().optional(),
    sections: z.array(sectionEntry()).optional(),
    legalSections: z.array(legalSection()).optional(),
    metadata: metadataDefinition(),
  }),
});

// Locations collection
const locations = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // New JSON uses `city`; older data used `location`. Accept either.
    city: z.string().optional(),
    location: z.string().optional(),
    keywords: z.string().optional(),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    sections: z.array(sectionEntry()).optional(),
    metadata: metadataDefinition(),
  }),
});

export const collections = {
  solutions,
  "indoor-billboards": indoorBillboards,
  pages,
  locations,
};
