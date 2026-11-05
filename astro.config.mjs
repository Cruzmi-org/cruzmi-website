// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';

// Legal pages are noindex until reviewed (`reviewed: false` in their front matter): keep them out of
// the sitemap too, so Search Console does not report "submitted URL marked noindex".
const legalSlugs = {
  fr: { legal: 'mentions-legales', terms: 'cgu', privacy: 'confidentialite' },
  en: { legal: 'legal-notice', terms: 'terms', privacy: 'privacy' },
};
const unreviewedLegalPaths = Object.entries(legalSlugs).flatMap(([locale, pages]) =>
  Object.entries(pages)
    .filter(([page]) => {
      const md = readFileSync(new URL(`./src/content/legal/${locale}/${page}.md`, import.meta.url), 'utf8');
      return !/^reviewed:\s*true\s*$/m.test(md);
    })
    .map(([, slug]) => `/${locale}/${slug}/`),
);

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
      // Noindex pages stay out of the sitemap: invitation landing pages and unreviewed legal pages.
      filter: (page) =>
        !/\/(join|rejoindre)\/$/.test(page) && !unreviewedLegalPaths.some((p) => page.endsWith(p)),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
