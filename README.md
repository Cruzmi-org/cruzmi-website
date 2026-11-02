# cruzmi-website

Marketing site for [Cruzmi](https://www.cruzmi.com) — Astro (static) + Tailwind CSS 4 + TypeScript,
hosted on Cloudflare Pages.

## Develop

Requires Node ≥ 22.12 (see `.nvmrc`).

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check + static build into dist/
npm run preview
```

## Structure

| Path | Role |
|---|---|
| `src/i18n/config.ts` | Locales, localized slugs (`routes`), store links |
| `src/i18n/ui.ts` | Short UI strings (nav, buttons, footer) per locale |
| `src/content/<page>/<locale>.yaml` | Page copy — edit texts here |
| `src/layouts/BaseLayout.astro` | `<head>` (SEO, hreflang), header, footer |
| `src/components/` | Header, footer, store badges, smart download button… |
| `src/pages/fr/`, `src/pages/en/` | Thin route files, one per page and locale |
| `public/_redirects` | 301s from the old Wix URLs (Cloudflare Pages) |

Adding a language (e.g. `es`): add it to `astro.config.mjs`, `src/i18n/config.ts`, `src/i18n/ui.ts`,
then add `src/content/*/es.yaml` and `src/pages/es/`.

Photos: `PhotoPlaceholder` marks every spot waiting for a real, rights-cleared image.

## Contact form

`src/components/ContactPage.astro` posts to `functions/api/contact.ts` (Cloudflare Pages Function),
which validates the input (`src/lib/contact.ts`), checks Cloudflare Turnstile, then sends the
message through the Brevo API to `contact@cruzmi.com` with the visitor as reply-to.
`npm test` runs the function against mocked Turnstile/Brevo endpoints.

Cloudflare Pages settings (Settings > Variables and secrets):

| Name | Type | Value |
|---|---|---|
| `BREVO_API_KEY` | secret | Brevo API key (v3) |
| `TURNSTILE_SECRET_KEY` | secret | Turnstile widget secret key |
| `PUBLIC_TURNSTILE_SITE_KEY` | build variable | Turnstile widget site key (falls back to Cloudflare's test key) |
| `CONTACT_TO` | optional | default `contact@cruzmi.com` |
| `CONTACT_FROM` | optional | default `no-reply@cruzmi.com` (domain must be authenticated in Brevo) |

`npm run dev` does not run Pages Functions: test the form end-to-end on a Cloudflare preview.

## Conventions

French typography: use a narrow no-break space (U+202F) before `? ! : ;` and inside `« »` so
punctuation never wraps alone onto a new line.
