# CLAUDE.md — Cruzmi website (brief, 2026-11-02)

New marketing website replacing the Wix site at www.cruzmi.com. Goal: convey Cruzmi's image and
purpose and make visitors download the app. Readers will soon arrive from a sailing magazine article
(FR + EN), so the full site must be ready, polished and fast. No sailing-specific pages for now.

The project owner (pilot) is the user (CEO side); colleague Bruno did the Wix inventory below.
Claude writes all the texts (FR + EN); the team reviews them.

## Decisions (validated)

- **Stack**: Astro (static), Tailwind, TypeScript. Separate repo `Cruzmi-org/cruzmi-website`.
- **Hosting**: Cloudflare Pages (free, global CDN, absorbs traffic peaks, PR previews). DNS stays at LWS.
- **URLs**: single site on `www.cruzmi.com` with `/fr/` and `/en/` (structure ready for `/es/` later,
  the app exists in FR/EN/ES). `cruzmi.fr` → 301 to `https://www.cruzmi.com/fr/`. `hreflang` tags.
  Old Wix URLs → 301 to the new ones (see inventory).
- **Scope**: full site in one go (no reduced V1, no magazine landing page for now).
- **Font**: Darker Grotesque (same as the app and Studio). Cruzmi blue palette as in the mockup.
- **Content editing**: Markdown files in the repo for now (structure compatible with adding a CMS later).
- **Photos**: not provided yet → use clearly marked placeholders; the mockup photos look AI-generated,
  real images must have usage rights. App screenshots are available (see Assets).

## Positioning (from the team's mockup — important)

Cruzmi = collaborative app for **group projects**, not only travel: "Tous vos projets de groupe prennent
vie avec Cruzmi !". Use cases carousel: Voyages et croisières · Événements et fêtes · Activités et
associations · Projets personnels et collectifs. Four pillars: **Collaborer** (impliquer tous les
participants) · **Organiser** (centraliser les informations et les actions) · **Coordonner** (suivre le
programme et les étapes) · **Partager** (réunir les contenus et les souvenirs). Tagline idea:
"Et si vous faisiez de votre prochain projet une belle aventure collective ?"

Mockup: `docs/maquette-accueil.jpg` — header with logo, nav (À qui s'adresse
Cruzmi · Comment ça marche · Fonctionnalités · Qui sommes-nous · FAQ), sticky "Télécharger Cruzmi"
button (smart: App Store on iOS, Play Store on Android), hero with both store badges, pillars band,
use-case carousel.

## Planned pages (each in FR and EN)

| Page | Notes |
|---|---|
| Home | Mockup + "À qui s'adresse" + "Comment ça marche" (avant / pendant / après) sections |
| Fonctionnalités | Illustrated with app screenshots |
| Qui sommes-nous | Founders' story (group of friends) + CRUZMI SAS, pro target (loueurs) |
| FAQ | From Wix, corrected; add photo albums ordering |
| Contact | Form → contact@cruzmi.com (mechanism to choose) |
| Mentions légales · CGU · Politique de confidentialité | 3 separate pages; privacy policy must be CREATED (missing today, required by the stores). Legal texts must be reviewed by a competent person — Claude formats, does not validate legally. |

## Wix inventory (by Bruno's session)

Pages: `/` (home: 4 features, "Pourquoi Cruzmi", audiences, "Comment ça marche" avant/pendant/après,
3 quotes, store badges) · `/what-we-do` (À propos, CRUZMI SAS, pro target) · `/copie-de-a-propos`
(Qui sommes-nous) · `/faq` (6 Q&A) · `/contact` (form: prénom, nom, email, message) ·
`/mentions-légales` · `/politique-de-confidentialité` (actually contains the CGU, updated 06/10/2025).
Only Wix feature to replace: contact form. Members area enabled but empty (drop). No analytics; a
Google Search Console verification exists (keep it). Site is FR only. Logo/images hosted on Wix.

Issues to fix: missing privacy policy; host contradiction (mentions: Wix / CGU: Contabo GmbH); data
retention contradiction (FAQ: never deleted / CGU §7.5: deleted after 2 years of inactivity); draft-like
FAQ #1 ("Non ce n'est pas normal… disponible depuis janvier 2026"); cut sentence about availability
outside France; typo "des application grand public"; no update date on mentions légales; Google Play
link points to a search instead of the app page; nav items without anchors; accented / leftover URLs.

## Migration constraints (do not break)

- **DNS of cruzmi.com is at Wix** (ns4/ns5.wixdns.net); registrar is LWS. Before leaving Wix, recreate
  ALL records at LWS — especially **MX (mail.cruzmi.com)**: contact@ (LWS mailboxes: contact@ and bruno@ only; support@, dpo@, legal@ do not exist yet, see docs/reste-a-faire.md E3) must keep
  working. Keep the Search Console TXT record.
- **Universal links**: mobile app uses `applinks:${WEB_DOMAIN}` (cruzmi-supabase/app.config.ts).
  Checked 2026-11-02: AASA/assetlinks are served by `redirect.cruzmi.fr` (nginx on Coolify, zone
  cruzmi.fr at LWS); `cruzmi.fr/.well-known/*` is 404. So the cruzmi.com switch does not affect them;
  the cruzmi.fr redirect must only cover the apex and www. Prod value of the `WEB_DOMAIN` GitHub
  secret still to be confirmed. Full DNS inventory and runbook: `docs/migration-dns.md`.
- Supabase Auth Site URL is `cruzmi.fr` (currently an LWS parking page): the new redirect fixes it;
  check auth emails still land somewhere sensible.
- Store listings / app may link to the Wix legal pages: keep 301s from the old URLs.
- Process: build on a test URL (Cloudflare Pages preview) while Wix stays online; then DNS switch;
  cancel Wix only after validation.

## Assets

- Logo: `../cruzmi-backoffice/public/images/brand/Logo+nom-Cruzmi.svg`
- App screenshots: `../Ecrans appli pour Stores/` (Bienvenue, Budget, Programme, Repas, Participants,
  Photos, cartes trajet, albums imprimés, iPad variants)
- Brand font usage reference: `../cruzmi-backoffice/lib/fonts.ts` (Darker Grotesque 400/600/700)

## Conventions

- UI texts in FR/EN; code, comments, commits in English. Tailwind classes only. Accessible, mobile-first.
- `gh` CLI is not installed: give the user GitHub compare URLs for PRs. Release flow: `develop` →
  PR → `main` with merge commits.

## Next steps

1. Create the Astro project + repo (user creates the empty repo in **Cruzmi-org**).
2. Site map, layout, design tokens; draft FR + EN texts for review.
3. Cloudflare Pages setup (preview), then DNS migration plan (records inventory first).
