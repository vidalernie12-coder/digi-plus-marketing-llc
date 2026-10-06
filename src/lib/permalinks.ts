import { trim } from './utils';
import { siteConfig } from '~/config/site';

const SITE_URL = siteConfig.seo.siteUrl;
const BASE_PATHNAME = '/';
const TRAILING_SLASH = false;

export const trimSlash = (s: string) => trim(trim(s, '/'));

const createPath = (...params: string[]) => {
  const paths = params
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
  return '/' + paths + (TRAILING_SLASH && paths ? '/' : '');
};

export const cleanSlug = (text = '') =>
  trimSlash(text)
    .split('/')
    .map((slug) => slug.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase())
    .join('/');

export const BLOG_BASE = cleanSlug('blog');
export const CATEGORY_BASE = cleanSlug('category');
export const TAG_BASE = cleanSlug('tag');

export const POST_PERMALINK_PATTERN = trimSlash(`${BLOG_BASE}/%slug%`);

/** Get canonical URL */
export const getCanonical = (path = ''): string | URL => {
  const url = String(new URL(path, SITE_URL));
  if (!TRAILING_SLASH && path && url.endsWith('/')) {
    return url.slice(0, -1);
  } else if (TRAILING_SLASH && path && !url.endsWith('/')) {
    return url + '/';
  }
  return url;
};

/** Get permalink for different content types */
export const getPermalink = (slug = '', type = 'page'): string => {
  // Handle external links and anchors
  if (
    slug.startsWith('https://') ||
    slug.startsWith('http://') ||
    slug.startsWith('://') ||
    slug.startsWith('#') ||
    slug.startsWith('javascript:')
  ) {
    return slug;
  }

  let permalink: string;

  switch (type) {
    case 'home':
      permalink = getHomePermalink();
      break;

    case 'blog':
      permalink = getBlogPermalink();
      break;

    case 'asset':
      permalink = getAsset(slug);
      break;

    case 'category':
      permalink = createPath(CATEGORY_BASE, trimSlash(slug));
      break;

    case 'tag':
      permalink = createPath(TAG_BASE, trimSlash(slug));
      break;

    case 'post':
      permalink = createPath(trimSlash(slug));
      break;

    case 'page':
    default:
      permalink = createPath(slug);
      break;
  }

  return definitivePermalink(permalink);
};

/** Get home page permalink */
export const getHomePermalink = (): string => getPermalink('/');

/** Get blog permalink */
export const getBlogPermalink = (): string => getPermalink(BLOG_BASE);

/** Get asset path */
export const getAsset = (path: string): string =>
  '/' +
  [BASE_PATHNAME, path]
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');

/** Add base pathname to permalink */
const definitivePermalink = (permalink: string): string => createPath(BASE_PATHNAME, permalink);

/** Apply getPermalink to menu objects recursively */
export const applyGetPermalinks = (menu: any = {}): any => {
  if (Array.isArray(menu)) {
    return menu.map((item) => applyGetPermalinks(item));
  } else if (typeof menu === 'object' && menu !== null) {
    const obj: any = {};
    for (const key in menu) {
      if (key === 'href') {
        if (typeof menu[key] === 'string') {
          obj[key] = getPermalink(menu[key]);
        } else if (typeof menu[key] === 'object') {
          if (menu[key].type === 'home') {
            obj[key] = getHomePermalink();
          } else if (menu[key].type === 'blog') {
            obj[key] = getBlogPermalink();
          } else if (menu[key].type === 'asset') {
            obj[key] = getAsset(menu[key].url);
          } else if (menu[key].url) {
            obj[key] = getPermalink(menu[key].url, menu[key].type);
          }
        }
      } else {
        obj[key] = applyGetPermalinks(menu[key]);
      }
    }
    return obj;
  }
  return menu;
};
