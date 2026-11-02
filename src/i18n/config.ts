export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const htmlLang: Record<Locale, string> = { fr: 'fr-FR', en: 'en' };

/** Localized slugs. Each page file passes its key so the language switcher and hreflang can find its twin. */
export const routes = {
  home: { fr: '', en: '' },
  features: { fr: 'fonctionnalites', en: 'features' },
  about: { fr: 'qui-sommes-nous', en: 'about' },
  faq: { fr: 'faq', en: 'faq' },
  contact: { fr: 'contact', en: 'contact' },
  legal: { fr: 'mentions-legales', en: 'legal-notice' },
  terms: { fr: 'cgu', en: 'terms' },
  privacy: { fr: 'confidentialite', en: 'privacy' },
} as const satisfies Record<string, Record<Locale, string>>;
export type RouteKey = keyof typeof routes;

export function path(locale: Locale, key: RouteKey, hash?: string): string {
  const slug = routes[key][locale];
  return `/${locale}/${slug ? `${slug}/` : ''}${hash ? `#${hash}` : ''}`;
}

export const stores = {
  ios: { fr: 'https://apps.apple.com/fr/app/cruzmi/id6683313752', en: 'https://apps.apple.com/app/id6683313752' },
  android: {
    fr: 'https://play.google.com/store/apps/details?id=com.cruzmi.Cruzmi&hl=fr',
    en: 'https://play.google.com/store/apps/details?id=com.cruzmi.Cruzmi&hl=en',
  },
} as const;
