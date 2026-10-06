import fs from 'fs';
import path from 'path';
import { validateConfig, type Config } from './builder';

let cachedConfig: Config | null = null;

export const loadConfig = (): Config => {
  if (cachedConfig) {
    return cachedConfig;
  }

  const configPath = path.resolve(process.cwd(), 'src/content/settings/site.json');

  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found at ${configPath}`);
  }

  const fileContents = fs.readFileSync(configPath, 'utf8');
  const siteData = JSON.parse(fileContents);

  // Transform site.json shape into the Config shape the integration expects
  const rawConfig = {
    site: {
      name: siteData.business?.name || 'Site',
      site: siteData.seo?.siteUrl || 'https://example.com',
      base: '/',
      trailingSlash: false,
    },
    metadata: {
      title: {
        default: siteData.seo?.defaultTitle || siteData.business?.name || 'Site',
        template: '%s',
      },
      description: siteData.seo?.defaultDescription || siteData.business?.description || '',
    },
  };

  cachedConfig = validateConfig(rawConfig);
  return cachedConfig;
};
