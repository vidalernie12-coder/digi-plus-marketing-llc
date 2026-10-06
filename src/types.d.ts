export interface NavigationLink {
  text: string;
  href: string;
  links?: NavigationLink[];
}

export interface SEO {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface MetaData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}
