import type { AstroIntegration } from 'astro';
import { loadConfig } from './config/load-config';

export default function configIntegration(): AstroIntegration {
  const config = loadConfig();

  return {
    name: 'config-integration',
    hooks: {
      'astro:config:setup': ({ updateConfig, injectScript }) => {
        // Make config available as virtual module
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'vite-plugin-config',
                resolveId(id) {
                  if (id === 'virtual:config') {
                    return '\0virtual:config';
                  }
                },
                load(id) {
                  if (id === '\0virtual:config') {
                    return `export default ${JSON.stringify(config, null, 2)}`;
                  }
                },
              },
            ],
          },
        });
      },
    },
  };
}
