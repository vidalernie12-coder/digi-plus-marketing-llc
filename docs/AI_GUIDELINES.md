# AI Content Management Guidelines

This document explains how to update content on this Astro website. Follow these guidelines when making changes.

---

## 📁 Project Structure

```
/
├── src/
│   ├── config.yaml              ← Edit site-wide settings here
│   ├── navigation.ts            ← Edit navigation structure here
│   ├── content/                 ← Edit page content here
│   │   ├── solutions/
│   │   │   ├── foundational/
│   │   │   │   ├── website-design.mdx
│   │   │   │   ├── google-business-profile.mdx
│   │   │   │   ├── social-media-management.mdx
│   │   │   │   └── design-services.mdx
│   │   │   └── lead-gen/
│   │   │       ├── social-media-advertising.mdx
│   │   │       └── pay-per-click.mdx
│   │   └── indoor-billboards/
│   │       ├── become-a-venue-partner.mdx
│   │       ├── locations.mdx
│   │       └── screen-advertising.mdx
│   └── pages/
│       └── index.astro          ← Edit homepage here
└── docs/
    └── AI_GUIDELINES.md         ← This file
```

---

## 🎯 Common Tasks

### 1. Update Site Settings (Name, URL, SEO)

**File:** `src/config.yaml`

```yaml
site:
  name: Your Brand # Change brand name
  site: "https://yourdomain.com" # Change website URL
  trailingSlash: false

metadata:
  title:
    default: Your Brand # Default page title
    template: "%s — Your Brand" # Title template (%s = page name)
  description: "Your site description for SEO"

  openGraph:
    site_name: Your Brand
    images:
      - url: "~/assets/images/default.png"
        width: 1200
        height: 628

  twitter:
    handle: "@yourbrand"
    site: "@yourbrand"
```

**What updates automatically:**

- All page titles
- Meta descriptions
- Open Graph tags
- Twitter cards
- Canonical URLs

---

### 2. Add/Edit Service Pages

**Location:** `src/content/solutions/foundational/` or `src/content/solutions/lead-gen/`

**Example:** Add a new foundational service

1. Create file: `src/content/solutions/foundational/email-marketing.mdx`

```mdx
---
title: "Email Marketing Services"
description: "Engage your audience with targeted email campaigns"
category: "foundational"
order: 5
ctaText: "Get Started"
ctaLink: "/contact"
---

## Email Marketing That Converts

Your content here...

### Our Approach

- Strategy development
- Campaign creation
- Performance tracking
```

2. The page automatically appears at: `/solutions/foundational/email-marketing`
3. Navigation updates automatically

**Frontmatter Fields:**

- `title` (required) - Page title
- `description` (required) - SEO description
- `category` (required) - Either "foundational" or "lead-gen"
- `order` (optional) - Sort order in navigation (lower = first)
- `ctaText` (optional) - Call-to-action button text
- `ctaLink` (optional) - Call-to-action button URL
- `image` (optional) - Featured image path

---

### 3. Add/Edit Indoor Billboard Pages

**Location:** `src/content/indoor-billboards/`

**Example:** Add a new billboard page

```mdx
---
title: "Premium Locations"
description: "Our billboard locations in high-traffic areas"
order: 4
---

## Premium Billboard Locations

Content here...
```

URL: `/indoor-billboards/premium-locations`

---

### 4. Update Homepage

**File:** `src/pages/index.astro`

Edit the Hero, Features, and CallToAction sections:

```astro
<Hero
  tagline="Marketing Excellence"
  title="Your New Title Here"
  subtitle="Your new subtitle"
  actions={[
    { text: 'Get Started', href: '/solutions', variant: 'primary' },
  ]}
/>

<Features
  title="Why Choose Us"
  features={[
    {
      title: 'Feature Name',
      description: 'Feature description',
      icon: '🎨',
    },
    // Add more features...
  ]}
/>
```

---

### 5. Update Navigation

**File:** `src/navigation.ts`

The navigation auto-populates from content, but you can customize structure:

```ts
export const headerData = {
  links: [
    {
      text: "Home",
      href: getPermalink("/"),
    },
    {
      text: "Indoor Billboards",
      href: getPermalink("/indoor-billboards"),
      links: "auto", // Auto-populated from content
    },
    {
      text: "Solutions",
      href: getPermalink("/solutions"),
      links: [
        {
          text: "Foundational",
          href: getPermalink("/solutions/foundational"),
          links: "auto", // Auto-populated
        },
        {
          text: "Lead Gen",
          href: getPermalink("/solutions/lead-gen"),
          links: "auto", // Auto-populated
        },
      ],
    },
  ],
  actions: [{ text: "Get in Touch", href: getPermalink("/contact") }],
};
```

**Footer links:**

```ts
export const footerData = {
  links: [
    {
      title: "Solutions",
      links: [
        {
          text: "Foundational Services",
          href: getPermalink("/solutions/foundational"),
        },
        { text: "Lead Generation", href: getPermalink("/solutions/lead-gen") },
      ],
    },
    // Add more sections...
  ],
  socialLinks: [
    { ariaLabel: "X", icon: "tabler:brand-x", href: "#" },
    { ariaLabel: "Instagram", icon: "tabler:brand-instagram", href: "#" },
  ],
};
```

---

## ✍️ Content Writing Guidelines

### MDX Formatting

```mdx
---
title: "Page Title"
description: "SEO description"
---

# Main Heading (H1)

Paragraph text here.

## Section Heading (H2)

### Subsection (H3)

- Bullet point
- Another point

**Bold text**
_Italic text_

[Link text](https://example.com)
```

### SEO Best Practices

1. **Title**: 50-60 characters
2. **Description**: 150-160 characters
3. **Headings**: Use H2 for main sections, H3 for subsections
4. **Keywords**: Include naturally in content
5. **Links**: Use descriptive anchor text

---

## 🚫 What NOT to Change

**Do not modify these files unless you know what you're doing:**

- `src/content/config.ts` - Content collection schemas
- `src/layouts/*.astro` - Layout templates
- `src/components/widgets/*.astro` - UI components
- `src/utils/*.ts` - Utility functions
- `vendor/` - Config integration
- `astro.config.mjs` - Astro configuration
- `package.json` - Dependencies

---

## 📝 Quick Reference

### Add New Service Page

1. Create MDX file in `src/content/solutions/foundational/` or `lead-gen/`
2. Add frontmatter (title, description, category, order)
3. Write content in Markdown
4. Save - navigation updates automatically

### Update Site Info

1. Edit `src/config.yaml`
2. Change name, URL, description, social handles
3. Save - updates everywhere automatically

### Update Homepage

1. Edit `src/pages/index.astro`
2. Modify Hero, Features, CallToAction props
3. Save

### Update Navigation

1. Edit `src/navigation.ts`
2. Modify headerData or footerData
3. Save

---

## 🔍 Testing Changes

After making changes:

1. Check the page renders correctly
2. Verify navigation links work
3. Test on mobile view
4. Check SEO meta tags in browser inspector

---

## 📞 Need Help?

If you encounter issues:

1. Check this guide first
2. Verify file paths are correct
3. Ensure frontmatter syntax is valid
4. Check for typos in YAML/MDX files
