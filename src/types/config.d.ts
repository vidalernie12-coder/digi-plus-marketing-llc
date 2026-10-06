declare module 'virtual:config' {
  export interface Config {
    site: {
      name: string;
      site: string;
      base: string;
      trailingSlash: boolean;
    };
    metadata: {
      title: {
        default: string;
        template: string;
      };
      description: string;
      robots?: {
        index: boolean;
        follow: boolean;
      };
      openGraph?: {
        site_name?: string;
        images?: Array<{
          url: string;
          width?: number;
          height?: number;
        }>;
        type: string;
      };
      twitter?: {
        handle?: string;
        site?: string;
        cardType: string;
      };
    };
    i18n?: {
      language: string;
      textDirection: 'ltr' | 'rtl';
    };
    ui?: {
      theme: 'system' | 'light' | 'dark' | 'light:only' | 'dark:only';
    };
  }

  const config: Config;
  export default config;
}
