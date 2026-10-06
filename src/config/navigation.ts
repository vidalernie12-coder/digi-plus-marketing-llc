// ===========================================
// NAVIGATION CONFIGURATION
// Reads from src/content/settings/navbar.json
//            src/content/settings/footer.json
// ===========================================

import navbarJson from '../content/settings/navbar.json';
import footerJson from '../content/settings/footer.json';

// --- Types ---

export interface NavItem {
  title: string
  description?: string
  href: string
  icon?: string
  thumbnail?: string
}

export interface NavLink {
  type: 'link'
  title: string
  href: string
}

export interface NavDropdown {
  type: 'dropdown'
  title: string
  href?: string
  items: NavItem[]
}

export interface NavMegaMenu {
  type: 'megamenu'
  title: string
  href?: string
  sections: {
    label: string
    items: NavItem[]
  }[]
  featured?: {
    title: string
    description: string
    href: string
    thumbnail?: string
  }[]
}

export type DynamicNavItem = NavLink | NavDropdown | NavMegaMenu

// --- Build navItems from JSON ---

function parseNavItems(raw: any[]): DynamicNavItem[] {
  return raw.map(item => {
    if (item.type === 'link') {
      return { type: 'link' as const, title: item.title, href: item.href }
    }
    if (item.type === 'dropdown') {
      return {
        type: 'dropdown' as const,
        title: item.title,
        href: item.href,
        items: (item.items || []) as NavItem[],
      }
    }
    if (item.type === 'megamenu') {
      return {
        type: 'megamenu' as const,
        title: item.title,
        href: item.href,
        sections: (item.sections || []).map((s: any) => ({
          label: s.label,
          items: s.items as NavItem[],
        })),
        featured: (item.featured || []).map((f: any) => ({
          title: f.title,
          description: f.description ?? '',
          href: f.href,
          thumbnail: f.thumbnail,
        })),
      }
    }
    return { type: 'link' as const, title: 'Unknown', href: '#' }
  })
}

export const navItems: DynamicNavItem[] = parseNavItems(navbarJson.navItems ?? [])

// CTA Button
const defaultCtaButton = { text: "Contact Us", href: "/contact-us" }
const rawCtaButton = navbarJson.ctaButton ?? defaultCtaButton
export const ctaButton = {
  text: rawCtaButton.text ?? defaultCtaButton.text,
  href: rawCtaButton.href ?? defaultCtaButton.href,
}

// --- Footer config ---

export interface FooterLinksColumn {
  type: 'links'
  title: string
  links: { label: string; href: string; child?: boolean; hasChildren?: boolean }[]
}

export interface FooterAccordionColumn {
  type: 'accordion'
  title: string
  href?: string
  sections: {
    label: string
    items: { label: string; href: string }[]
  }[]
}

export interface FooterContactColumn {
  type: 'contact'
  title: string
}

export type FooterColumn = FooterLinksColumn | FooterAccordionColumn | FooterContactColumn

const defaultFooter = {
  description: "Premium marketing solutions for your business.",
  columns: [] as FooterColumn[],
  bottomLinks: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
}

export const footerConfig = {
  description: footerJson.description ?? defaultFooter.description,
  columns: (footerJson.columns ?? defaultFooter.columns) as FooterColumn[],
  bottomLinks: footerJson.bottomLinks ?? defaultFooter.bottomLinks,
}
