// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.cruzmi.com',
  trailingSlash: 'always',
  i18n: {
    // Ready for 'es' later: add it here and in src/i18n/ui.ts.
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR', en: 'en' } },
      // Invitation landing pages are noindex: keep them out of the sitemap.
      filter: (page) => !/\/(join|rejoindre)\/$/.test(page),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
