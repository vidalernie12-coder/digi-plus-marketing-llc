# Global Branding Guide

## 🎨 How to Change Your Brand Name Globally

To change your brand name across the entire website, edit **ONE file**:

### `src/config.yaml`

```yaml
site:
  name: Dealer Template 1 # ← Change this to your brand name
  site: "https://yourdomain.com" # ← Change this to your website URL

metadata:
  title:
    default: Dealer Template 1 # ← Change this (used for homepage title)
    template: "%s — Dealer Template 1" # ← Change this (used for all other pages)
  description: "Your description here" # ← Change this (default SEO description)
```

## 📍 Where the Brand Name Appears

When you change `site.name`, it automatically updates in:

1. **Header** - Logo/brand name in navigation
2. **Footer** - "Made by [Brand]" and copyright text
3. **Page Titles** - Browser tab titles (e.g., "Website Design — Your Brand")
4. **Meta Tags** - SEO and social media sharing

## ✅ Example

**Before:**

```yaml
site:
  name: Dealer Template 1
```

**After:**

```yaml
site:
  name: NTXIDB
```

**Result:**

- Header: "NTXIDB"
- Footer: "Made by NTXIDB · All rights reserved."
- Page Title: "Website Design — NTXIDB"

## 🔄 Other Global Settings in config.yaml

### Site URL

```yaml
site:
  site: "https://yourdomain.com"
```

Used for canonical URLs and social media sharing.

### Site Description

```yaml
metadata:
  description: "Your description"
```

Default meta description for SEO.

### Social Media

```yaml
metadata:
  twitter:
    handle: "@yourbrand"
    site: "@yourbrand"
```

## 📝 Notes

- Changes take effect after restarting dev server
- For production, run `npm run build` after changes
- All page titles automatically use the format: `Page Name — Brand Name`

## 🎯 Quick Checklist

- [ ] Update `site.name` in `src/config.yaml`
- [ ] Update `site.site` (URL) in `src/config.yaml`
- [ ] Update `metadata.title.default` in `src/config.yaml`
- [ ] Update `metadata.title.template` in `src/config.yaml`
- [ ] Update `metadata.description` in `src/config.yaml`
- [ ] Update social media handles (optional)
- [ ] Update logo/favicon in `public/` folder (optional)
- [ ] Restart dev server: `npm run dev`
- [ ] Run `npm run build` to verify changes

That's it! Your brand is now updated everywhere. 🎉

## 🔧 Technical Details

The system works by:

1. `src/config.yaml` - Single source of truth for all settings
2. `src/utils/config.ts` - Reads YAML and exports constants
3. All components import from `config.ts` - Automatic updates everywhere

This means you only edit YAML, and everything else updates automatically!
