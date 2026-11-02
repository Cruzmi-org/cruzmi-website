import type { Locale } from './config';

/** Short UI strings shared by all pages. Long page content lives in src/content/. */
export const ui = {
  fr: {
    'meta.siteName': 'Cruzmi',
    'meta.defaultDescription':
      "Cruzmi, l'application collaborative pour organiser, partager et faire avancer vos projets de groupe : voyages, croisières, événements, associations…",
    'a11y.skip': 'Aller au contenu',
    'a11y.home': "Cruzmi — page d'accueil",
    'a11y.menu': 'Menu',
    'a11y.mainNav': 'Navigation principale',
    'a11y.language': 'Langue',
    'a11y.onThisPage': 'Sur cette page',
    'alt.screenshot': "Capture d'écran de l'application Cruzmi :",
    'nav.audiences': "À qui s'adresse Cruzmi",
    'nav.howItWorks': 'Comment ça marche',
    'nav.features': 'Fonctionnalités',
    'nav.about': 'Qui sommes-nous',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'cta.download': 'Télécharger Cruzmi',
    'store.ios.small': 'Télécharger dans',
    'store.ios.big': "l'App Store",
    'store.android.small': 'Disponible sur',
    'store.android.big': 'Google Play',
    'footer.tagline': 'Tous vos projets de groupe prennent vie.',
    'footer.legal': 'Mentions légales',
    'footer.terms': "Conditions générales d'utilisation",
    'footer.privacy': 'Politique de confidentialité',
    'placeholder.photo': 'Photo à fournir',
  },
  en: {
    'meta.siteName': 'Cruzmi',
    'meta.defaultDescription':
      'Cruzmi, the collaborative app to organise, share and move your group projects forward: trips, sailing cruises, events, clubs…',
    'a11y.skip': 'Skip to content',
    'a11y.home': 'Cruzmi — home page',
    'a11y.menu': 'Menu',
    'a11y.mainNav': 'Main navigation',
    'a11y.language': 'Language',
    'a11y.onThisPage': 'On this page',
    'alt.screenshot': 'Cruzmi app screenshot:',
    'nav.audiences': 'Who is Cruzmi for',
    'nav.howItWorks': 'How it works',
    'nav.features': 'Features',
    'nav.about': 'About us',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'cta.download': 'Download Cruzmi',
    'store.ios.small': 'Download on the',
    'store.ios.big': 'App Store',
    'store.android.small': 'Get it on',
    'store.android.big': 'Google Play',
    'footer.tagline': 'All your group projects come to life.',
    'footer.legal': 'Legal notice',
    'footer.terms': 'Terms of use',
    'footer.privacy': 'Privacy policy',
    'placeholder.photo': 'Photo to be supplied',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['fr'];
export const t = (locale: Locale) => (key: UiKey) => ui[locale][key];
