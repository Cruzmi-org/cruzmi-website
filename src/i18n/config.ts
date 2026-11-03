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
  join: { fr: 'rejoindre', en: 'join' },
  install: { fr: 'installer', en: 'install' },
} as const satisfies Record<string, Record<Locale, string>>;
export type RouteKey = keyof typeof routes;

export function path(locale: Locale, key: RouteKey, hash?: string): string {
  const slug = routes[key][locale];
  return `/${locale}/${slug ? `${slug}/` : ''}${hash ? `#${hash}` : ''}`;
}

/**
 * Universal links of the mobile app (AASA / assetlinks served there by nginx on Coolify).
 * Invitation links look like https://redirect.cruzmi.fr/join/<tripId>/<membershipId>.
 */
export const APP_LINK_ORIGIN = 'https://redirect.cruzmi.fr';
/** App link paths accepted by the join page (?path=…): safe characters only, no "//". */
export const APP_LINK_PATH_RE = /^\/(?!\/)[A-Za-z0-9_\-/]{1,200}$/;

export const stores = {
  ios: { fr: 'https://apps.apple.com/fr/app/cruzmi/id6683313752', en: 'https://apps.apple.com/app/id6683313752' },
  android: {
    fr: 'https://play.google.com/store/apps/details?id=com.cruzmi.Cruzmi&hl=fr',
    en: 'https://play.google.com/store/apps/details?id=com.cruzmi.Cruzmi&hl=en',
  },
} as const;

/**
 * Install routes for visitors outside the store countries (France, Belgium, Switzerland, Luxembourg),
 * shown on the install page (docs/reste-a-faire.md A7). Remove once the app is open everywhere.
 * - iOS: public TestFlight link (same one as the old Wix "Disponibilité iOS" popup, active on 2026-11-03).
 *   External TestFlight builds expire after 90 days: keep a recent build in the public group.
 * - Android: no working route yet (the Wix popup only linked to the regular Play Store page, which is
 *   "not available in your country" abroad). Fill with the Google Play open-testing opt-in URL
 *   (https://play.google.com/apps/testing/com.cruzmi.Cruzmi) once that track is open in all countries.
 */
export const altInstall = {
  testflightApp: 'https://apps.apple.com/app/testflight/id899247664',
  testflightJoin: 'https://testflight.apple.com/join/JTRxvEcs',
  // TODO(team): Google Play open-testing opt-in URL. Empty = the page shows a "coming soon" message.
  androidTesting: '',
} as const;
