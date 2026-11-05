# Nouveau site cruzmi.com — reste à faire

> État au 5 novembre 2026. Document destiné à l'équipe Cruzmi, en particulier à l'équipe en charge de l'appli.
> Cocher les cases au fil de l'eau (dans une PR) pour garder ce fichier à jour.

## Contexte en 30 secondes

- **Quoi** : nouveau site vitrine qui remplace le site Wix de www.cruzmi.com. Objectif : présenter Cruzmi et faire télécharger l'appli. Des lecteurs vont arriver d'un article dans un magazine de voile (FR + EN).
- **Où voir le site** : aperçu complet sur **https://develop.cruzmi-website.pages.dev** (non indexé par les moteurs de recherche). www.cruzmi.com est toujours servi par Wix.
- **Code** : dépôt `Cruzmi-org/cruzmi-website`, branche `develop`. Astro (site statique) + Tailwind + TypeScript, hébergé sur Cloudflare Pages (compte Cloudflare de l'équipe). Chaque push sur `develop` met à jour l'aperçu en 1 à 2 minutes.
- **Pages** (FR + EN) : accueil, fonctionnalités, qui sommes-nous, FAQ, contact, mentions légales, CGU, politique de confidentialité, page d'invitation (`/join/`), installation hors des pays des stores (`/fr/installer/`), page 404.
- **Formulaire de contact** : fonction Cloudflare → API Brevo → contact@cruzmi.com, avec anti-robot Cloudflare Turnstile. **Testé de bout en bout, il fonctionne.**
- **Documents liés** : [`docs/migration-dns.md`](migration-dns.md) (plan de bascule DNS) · [`README.md`](../README.md) (technique) · [`CLAUDE.md`](../CLAUDE.md) (brief initial et décisions).

## Vue d'ensemble

| # | Tâche | Qui | Bloquant pour la mise en ligne ? |
|---|---|---|---|
| A1 | Confirmer la valeur du secret `WEB_DOMAIN` | Équipe appli | Oui |
| A2 | Modifier nginx sur `redirect.cruzmi.fr` (page d'invitation) | Équipe appli | Non, mais très recommandé avant l'article |
| A3 | Vérifier l'URL de site Supabase Auth (`cruzmi.fr`) | Équipe appli | Oui |
| A4 | Répondre aux questions factuelles sur l'appli | Équipe appli | Oui |
| A5 | Mettre à jour les fiches App Store / Google Play | Équipe appli | Après la bascule |
| A6 | Libellé « Mes escapades » → « Mes projets » dans l'appli (FR) | Équipe appli | Non, mais nécessaire pour la capture « projets » |
| A7 | Ouvrir l'appli dans d'autres pays sur les stores (solution d'attente iOS en place, Android à prévoir) | Direction + équipe appli | Très recommandé avant l'article (lecteurs EN) |
| A8 | Activer le bouton « Se connecter » vers Cruzmi Studio | Équipe appli + Studio | Non (préparé, en sommeil) |
| B1 | Relire tous les textes | Direction + équipe | Oui |
| B2 | Fournir photos, badges officiels, captures EN | Direction | Oui pour les badges, conseillé pour le reste |
| C1 | Faire valider les pages légales | Juriste | Oui |
| C2 | Rédiger des CGV pour la vente d'albums | Juriste | Oui |
| D1 | Choisir l'hébergeur DNS de cruzmi.com | Direction + équipe appli | Oui |
| D2 | Fusion `develop` → `main`, puis bascule DNS | Équipe appli | — |
| D3 | Après la bascule : vérifications, Search Console, résiliation Wix | Équipe appli | — |
| E1 | Améliorations e-mail (SPF, DKIM, DMARC) | Équipe appli | Non |
| E2 | Hygiène des accès Cloudflare / GitHub | Équipe appli | Non |
| E3 | Adresses support@, dpo@ et legal@ inexistantes : textes passés sur contact@ (fait), adresses dédiées plus tard | Direction | Non |

---

## A. Équipe appli

### A1. Confirmer la valeur du secret `WEB_DOMAIN` — bloquant

L'appli construit ses liens universels (invitations) avec `WEB_DOMAIN` (`cruzmi-supabase/app.config.ts` → `applinks:${WEB_DOMAIN}`). En production, la valeur vient du secret GitHub `WEB_DOMAIN` (`deploy-stores.yml`, `eas-build-prod.yml`), que nous ne pouvons pas lire.

- Tout indique **`redirect.cruzmi.fr`** : c'est le seul domaine qui sert `/.well-known/apple-app-site-association` et `assetlinks.json` (`cruzmi.fr/.well-known/*` répond 404). Le `CLAUDE.md` de l'appli le documente aussi.
- **À faire** : confirmer, par exemple en partageant un lien d'invitation depuis l'appli de production et en regardant son domaine.
- **Pourquoi c'est important** : la bascule DNS de cruzmi.com n'a aucun impact si c'est `redirect.cruzmi.fr`. Si c'était `cruzmi.fr` ou `cruzmi.com`, il faudrait revoir le plan.

- [ ] Valeur confirmée : `……………………`

### A2. nginx sur `redirect.cruzmi.fr` : page d'accueil des invités

**Problème actuel** : un invité qui n'a pas encore l'appli et touche un lien d'invitation (`https://redirect.cruzmi.fr/join/<trip>/<membership>`) tombe sur une **page 404 nginx**.

**Ce qui existe déjà** : le site a une page « Vous êtes invité ! ». `/join/` choisit la langue, puis affiche `/fr/rejoindre/` ou `/en/join/`. Elle explique comment installer l'appli et créer un compte. Si elle reçoit `?path=/join/<trip>/<membership>`, elle affiche un bouton qui rouvre l'invitation dans l'appli une fois installée. Le lien est contrôlé : il ne peut pointer que vers `https://redirect.cruzmi.fr`.

**À faire dans nginx** (Coolify, serveur 109.199.115.17) :

```nginx
# Keep serving the universal-link files as today.
location /.well-known/ {
    default_type application/json;   # recommended for AASA (served as application/octet-stream today)
    # ... existing config ...
}

# Any other path = the app is not installed: send the visitor to the invitation page.
location / {
    return 302 https://www.cruzmi.com/join/?path=$uri;
}
```

- Utiliser une **302**, pas une 301, pour que les navigateurs ne mémorisent pas la redirection.
- **Avant la bascule DNS**, www.cruzmi.com est encore sur Wix : remplacer temporairement `https://www.cruzmi.com` par `https://develop.cruzmi-website.pages.dev` pour tester.
- **Tests** :
  - appli désinstallée, ouvrir un lien d'invitation → la page d'invitation s'affiche avec le bouton ;
  - appli installée → le lien ouvre toujours l'appli directement ;
  - `curl -I https://redirect.cruzmi.fr/.well-known/apple-app-site-association` → 200, `content-type: application/json`.

- [ ] nginx modifié et testé (iOS + Android)

### A3. URL de site Supabase Auth (`cruzmi.fr`) — bloquant

L'URL de site de Supabase Auth est `cruzmi.fr`, aujourd'hui une page de parking LWS. Le plan prévoit de rediriger `cruzmi.fr` et `www.cruzmi.fr` (et seulement eux, jamais `redirect.cruzmi.fr`) vers `https://www.cruzmi.com/fr/`.

- **À vérifier** : quels e-mails d'authentification renvoient vers cette URL (confirmation d'inscription, mot de passe oublié, lien magique…) et ce que voit l'utilisateur après la redirection.
- Si c'est gênant, changer l'URL de site, ou prévoir une page dédiée sur le nouveau site (à demander).

- [ ] Vérifié — décision : `……………………`

### A4. Questions factuelles sur l'appli — bloquant

Les textes du site décrivent ce que fait l'appli. Les réponses peuvent être notées directement dans les fichiers indiqués, ou transmises à la personne qui maintient le site.

| Question | Où c'est utilisé |
|---|---|
| ~~Tout est-il gratuit, sauf les albums photo ?~~ Réponse (2026-11-03) : oui. | FAQ `src/content/faq/fr.yaml` |
| ~~Dans quels pays l'appli est-elle disponible sur les stores ?~~ Réponse (2026-11-03) : France, Suisse, Belgique, Luxembourg. Voir A7. | FAQ |
| ~~Les projets ne sont-ils visibles **que** par leurs participants ?~~ Réponse (2026-11-03) : oui. | FAQ + politique de confidentialité |
| Quel service envoie les e-mails de l'appli (validation de compte, mot de passe) ? | Politique de confidentialité (sous-traitants) |
| Google Places et Unsplash : seuls des termes de recherche sont envoyés, sans données de compte ? | Politique de confidentialité |
| Y a-t-il un outil de statistiques ou de suivi d'erreurs dans l'appli ? (aucun trouvé dans les dépendances) | Politique de confidentialité |
| La localisation sert uniquement à afficher sa position sur la carte, sans enregistrement ni partage ? (constaté dans `use-user-location.ts`) | Politique de confidentialité |
| La fonction « démarches avant location / échanges client-loueur » pour les professionnels existe-t-elle encore ? | Page Qui sommes-nous `src/content/about/fr.yaml` |
| Les « contenus de destination » (infos pratiques, spots, culture) cités sur l'ancien site Wix existent-ils encore ? | Non repris pour l'instant |
| ~~Conservation des données : suppression après 2 ans d'inactivité (CGU §7.5) ou jamais ?~~ Réponse (2026-11-03) : pas de suppression automatique, seul le titulaire supprime son compte. CGU §7.5 à corriger (C1). | FAQ + CGU + politique |

- [ ] Réponses transmises

### A5. Fiches App Store et Google Play — après la bascule

- [ ] **URL de la politique de confidentialité** : remplacer `https://www.cruzmi.com/politique-de-confidentialité` par `https://www.cruzmi.com/fr/confidentialite/` (l'ancienne URL redirige déjà, mais autant pointer directement).
- [ ] **App Store Connect** : la fiche n'indique que « EN Anglais » comme langue, alors que l'appli existe en FR, EN et ES.
- [ ] Vérifier les autres liens des fiches (site, support) vers les nouvelles pages.


### A6. « Mes escapades » → « Mes projets » dans l'appli

Le site présente Cruzmi pour **tous les projets de groupe**, pas seulement les voyages. Or la liste des projets de l'appli s'intitule en français « Mes escapades » et « Mes escapades passées » (clés `pages.trips.myTrips` et `pages.trips.pastTrips` de `src/translations/fr.json`). La version anglaise dit déjà « My projects ».

- [ ] Remplacer par « Mes projets » et « Mes projets passés » (et vérifier l'espagnol).
- [ ] Ensuite, refaire la capture de la liste des projets avec un compte de démonstration contenant des projets **variés** (anniversaire, week-end de club, croisière, mariage…) et sans projet de test (« Projet New York 2027 Sans wizard »). Elle illustrera l'idée « tous vos projets au même endroit, en cours, à venir ou passés » sur le site.


### A7. Disponibilité de l'appli hors de France, Suisse, Belgique et Luxembourg

L'appli n'est aujourd'hui proposée sur l'App Store et Google Play **qu'en France, en Suisse, en Belgique et au Luxembourg**. Ailleurs, les badges et les QR codes du site mènent à une page « non disponible dans votre pays » (constaté le 3 novembre 2026 sur les liens anglais).

- **Impact** : les lecteurs de la version anglaise de l'article, et tout visiteur hors de ces 4 pays, ne peuvent pas télécharger Cruzmi. La version anglaise du site perd alors son intérêt.
- [ ] Décider des pays à ouvrir (au minimum ceux du lectorat du magazine) et les activer dans App Store Connect (Tarifs et disponibilité) et dans la Google Play Console (Production → Pays/régions).
- [ ] Vérifier que les albums photo peuvent être commandés et livrés dans ces pays.
- [ ] Ensuite, mettre à jour la FAQ « Puis-je utiliser Cruzmi en dehors de la France ? » et la mention sous les badges (`store.countries` dans `src/i18n/ui.ts`).

**Solution d'attente, en place sur le nouveau site depuis le 3 novembre 2026** : elle reprend les deux popups de l'accueil Wix (« Pour télécharger Cruzmi hors France, Belgique, Luxembourg, Suisse », logos Android et Apple), relus le 3 novembre 2026 :

- popup **iOS** : installer TestFlight, puis le lien public **`https://testflight.apple.com/join/JTRxvEcs`** (actif le 3 novembre 2026, bêta « Cruzmi ») ;
- popup **Android** : il renvoie seulement vers la page Google Play normale, qui affiche « non disponible dans votre pays » hors des 4 pays. **Il n'existe donc aucune solution Android aujourd'hui.**

Sur le nouveau site :

- sous chaque groupe de badges (accueil, bandeau de téléchargement, pied de page, page d'invitation) : « Sur les stores en France, Belgique, Suisse et Luxembourg. Ailleurs, voici comment installer Cruzmi → » ;
- ce lien mène à une page dédiée, **`/fr/installer/`** et **`/en/install/`**, indexée par les moteurs de recherche. Elle propose la procédure TestFlight en 3 étapes, avec un QR code pour ceux qui lisent sur ordinateur. La partie Android affiche « bientôt disponible » et un lien « Être prévenu » vers le formulaire de contact ;
- la FAQ « Puis-je utiliser Cruzmi en dehors de la France ? » mentionne TestFlight et renvoie vers cette page.

Reste à faire :

- [ ] **Android** : ouvrir une piste de **test ouvert** dans la Google Play Console (Tests → Test ouvert), disponible dans tous les pays (la disponibilité par pays d'une piste de test est indépendante de la production). Renseigner ensuite son lien d'inscription (`https://play.google.com/apps/testing/com.cruzmi.Cruzmi`) dans `altInstall.androidTesting` de `src/i18n/config.ts`. La page affichera alors automatiquement la procédure Android en 3 étapes et son QR code.
- [ ] **TestFlight** : une version TestFlight externe **expire au bout de 90 jours**. Garder en permanence une version récente dans le groupe public, sinon le lien n'installe plus rien. Vérifier aussi la limite de testeurs du lien public.
- [ ] Tester la procédure TestFlight depuis un compte Apple d'un pays non ouvert (par exemple Royaume-Uni ou États-Unis).
- [ ] Relire les textes : `src/content/install/fr.yaml` et `en.yaml`.
- [ ] Quand l'appli sera ouverte partout : supprimer la page, la mention sous les badges (`elsewhere` dans `src/components/StoreBadges.astro`) et `altInstall`.

### A8. Bouton « Se connecter » vers Cruzmi Studio — en sommeil

Objectif à terme : depuis le site, un bouton « Se connecter » donne accès à **Cruzmi Studio** (version web) :

- les **professionnels** partenaires accèdent à leur compte pro ;
- les **particuliers** accèdent à leur compte Cruzmi et retrouvent tous leurs projets et les fonctions de l'appli mobile.

Le bouton est **déjà prévu sur le site mais masqué** : en haut de chaque page, à côté du sélecteur de langue (et dans le menu mobile), en FR et en EN. Testé le 3 novembre 2026 : il s'affiche correctement une fois activé.

- [ ] Ouvrir Cruzmi Studio aux comptes particuliers (projets et fonctions équivalentes à l'appli mobile), en plus des comptes pro.
- [ ] Fournir l'adresse publique de connexion de Studio (par ex. `https://studio.cruzmi.com/login`).
- [ ] Activer le bouton : dans `src/lib/account.ts`, renseigner `url` et passer `enabled: true`.
- [ ] Ensuite seulement, en parler sur le site (FAQ « Puis-je utiliser Cruzmi sur ordinateur ? », page Qui sommes-nous pour l'offre pro). D'ici là, le site ne présente aucune fonction pro ni version web.

---

## B. Contenus — direction et équipe

### B1. Relire tous les textes — bloquant

Tous les textes sont des **brouillons** à valider. Pour les modifier, chaque fichier commence par une explication du format.

| Page | Fichier FR | Fichier EN |
|---|---|---|
| Accueil | `src/content/home/fr.yaml` | `…/en.yaml` |
| Fonctionnalités | `src/content/features/fr.yaml` | `…/en.yaml` |
| Qui sommes-nous | `src/content/about/fr.yaml` | `…/en.yaml` |
| FAQ | `src/content/faq/fr.yaml` | `…/en.yaml` |
| Contact | `src/content/contact/fr.yaml` | `…/en.yaml` |
| Invitation | `src/content/join/fr.yaml` | `…/en.yaml` |
| Pages légales | `src/content/legal/fr/*.md` | `src/content/legal/en/*.md` |
| Menus, boutons, pied de page | `src/i18n/ui.ts` | (même fichier) |

Points à trancher, marqués `TODO(team)` dans les fichiers :
- [ ] Les trois valeurs de la page Qui sommes-nous (« Ensemble, Simple, Mémorable ») ont été ajoutées : à garder ou non.
- [ ] Prénoms et rôles des fondateurs : à ajouter sur la page Qui sommes-nous **quand la photo définitive sera validée** (l'actuelle est provisoire ; une vraie photo des fondateurs en polos Cruzmi est envisagée).

Conventions : on **vouvoie** le visiteur (l'appli tutoie, le site non). En français, espace insécable avant `? ! : ;` (voir README).

### B2. Visuels

- [ ] **Badges officiels App Store / Google Play** (FR et EN) : les règles d'Apple et de Google l'imposent. Les boutons actuels sont provisoires (`src/components/StoreBadges.astro`).
- [ ] **Photos libres de droits** pour remplacer les encadrés « Photo à fournir » : visuel principal de l'accueil, 4 cas d'usage, photo des fondateurs. Les photos de la maquette semblent générées par IA : à éviter sans droits clairs.
- [ ] **Accord des personnes visibles** sur les captures de l'appli (Participants, Photos, albums imprimés).
- [ ] **Captures de l'appli en anglais** pour la page `/en/features/`, si l'appli peut s'afficher en anglais.
- [ ] **Image de partage** pour les réseaux sociaux (1200×630), à brancher dans `src/layouts/BaseLayout.astro`.

---

## C. Juridique — à faire valider par un professionnel du droit

Les textes ont été **mis en forme, pas validés juridiquement**. Tant qu'une page légale a `reviewed: false` dans son en-tête, elle affiche un bandeau « Projet de texte » et n'est pas indexée. Passer à `reviewed: true` une fois la page validée.

### C1. Pages légales

- [ ] **Mentions légales** (`src/content/legal/fr/legal.md`) : **téléphone de l'éditeur** obligatoire (LCEN art. 6 III), aujourd'hui « à compléter » ; vérifier les coordonnées des hébergeurs (Cloudflare pour le site, Contabo pour les données de l'appli).
- [ ] **CGU** (`terms.md`) : texte Wix du 06/10/2025 repris tel quel. Plusieurs points ne correspondent plus à l'appli (liste détaillée en tête du fichier) : messagerie interne et partage de localisation inexistants, abonnements et achats intégrés inexistants, cookies de mesure d'audience et bandeau inexistants, suppression de compte par e-mail alors que l'appli la propose dans les préférences, **§7.5 suppression après 2 ans d'inactivité à retirer** (décision 2026-11-03 : seul le titulaire supprime son compte, la FAQ le dit déjà).
- [ ] **Politique de confidentialité** (`privacy.md`) : document **nouveau** (il manquait, alors que les stores l'exigent). À valider : liste des sous-traitants, encadrement des transferts hors UE, durées de conservation proposées (messages de contact : 3 ans maximum ; journaux techniques : 12 mois), accords de sous-traitance signés.
- [ ] Après validation : passer `reviewed: true` dans les 6 fichiers (FR + EN) et mettre à jour la date `updated`.

### C2. Conditions générales de vente pour les albums — manquantes

Les albums photo sont vendus (PDF HD, impression Standard, édition Premium, paiement Stripe, impression par Flexilivre), mais **aucun document ne couvre la vente** : prix, livraison, droit de rétractation et son exception pour les produits personnalisés, réclamations, médiation de la consommation…

- [ ] CGV rédigées et validées → elles pourront être ajoutées au site comme une 4e page légale.

---

## D. Mise en ligne

### D1. Choisir l'hébergeur DNS de cruzmi.com — bloquant

Le DNS de cruzmi.com est aujourd'hui **chez Wix**, le domaine est enregistré chez LWS. Cloudflare Pages gère `www.cruzmi.com` avec n'importe quel DNS, mais **pas le domaine nu `cruzmi.com`**. Celui-ci doit être redirigé ailleurs, en HTTPS et en conservant le chemin (les anciennes URL comme `cruzmi.com/faq` doivent continuer de fonctionner).

- **Option A, DNS chez LWS** : possible seulement si LWS sait faire cette redirection en HTTPS.
- **Option B, DNS chez Cloudflare** (gratuit, recommandé) : redirection native. Le domaine reste enregistré chez LWS.

- [x] Option choisie le 3 novembre 2026 : **B, DNS chez Cloudflare**, bascule dès que possible (déroulé dans `docs/migration-dns.md` §2).

### D2. Fusion puis bascule

Prérequis : B1, B2 (badges), C1, C2 et D1 terminés ; A1 et A3 vérifiés.

- [x] PR #1 fusionnée le 3 novembre 2026. **À refaire à chaque lot de changements** : PR `develop` → `main` (merge commit) : https://github.com/Cruzmi-org/cruzmi-website/compare/main...develop. La production `cruzmi-website.pages.dev` se met à jour automatiquement.
- [x] Turnstile : `www.cruzmi.com` et `cruzmi.com` ajoutés le 4 novembre 2026. Vérifier que `www.cruzmi.com` figure dans les noms d'hôte du widget.
- [x] **Exporter la zone DNS complète depuis Wix** (fait le 3 novembre 2026) avant toute modification (l'inventaire public ne voit pas tout).
- [x] Zone Cloudflare active (3 novembre 2026), **www.cruzmi.com sert le nouveau site depuis le 4 novembre 2026**.
- [x] `cruzmi.com`, `fr.cruzmi.com` et `en.cruzmi.com` basculés le 5 novembre 2026 : règles de redirection Cloudflare (301 vers www, chemin conservé pour `cruzmi.com` ; `/fr/` et `/en/` pour les sous-domaines). Enregistrements proxifiés : les 3 A Wix de `cruzmi.com` (inutilisés, à remplacer par `A 192.0.2.1` à la résiliation de Wix) ; `fr` et `en` en `A 192.0.2.1`. Un CNAME vers `cdn3.wixdns.net` ne fonctionne pas : Wix étant lui-même sur Cloudflare, il répond à la place de nos règles.
- [x] Bascule pas à pas selon `docs/migration-dns.md` §3 à §5. Le point le plus sensible : recopier **à l'identique** le MX et les enregistrements `mail`, `smtp`, `imap` et `pop`, sinon contact@ ne reçoit plus rien.
- [x] Redirection `cruzmi.fr` + `www.cruzmi.fr` → `https://www.cruzmi.com/fr/` : faite le 5 novembre 2026 avec la redirection de domaine LWS (« 301 (Htaccess) », espace client → cruzmi.fr). Le chemin est conservé. LWS redirige vers `http://`, puis Cloudflare passe en HTTPS : une étape de plus, sans conséquence. `redirect.cruzmi.fr` et les autres sous-domaines ne sont pas touchés (vérifié).

**Garder Wix actif** pendant la bascule : c'est le retour arrière possible.

### D3. Après la bascule

- [ ] Vérifications de `docs/migration-dns.md` §6 (e-mails, formulaire et redirections Wix vérifiés le 4 novembre 2026 ; reste : liens des stores, lien d'invitation) : formulaire, redirections Wix, liens des stores, lien d'invitation.
- [ ] Google Search Console : propriété toujours vérifiée, soumettre `https://www.cruzmi.com/sitemap-index.xml`.
- [ ] Formulaire : les messages arrivaient en indésirables chez LWS (score 8,9, dû au « Répondre à » vers l'adresse du visiteur ; SPF, DKIM et DMARC passent). Solution : `no-reply@cruzmi.com` ajouté aux expéditeurs autorisés de contact@ dans le webmail LWS. À refaire si la boîte change.
- [ ] Après deux semaines sans incident, **résilier Wix**. Ensuite, dans Cloudflare : remplacer les 3 A Wix de `cruzmi.com` par un seul `A 192.0.2.1` (proxifié), et supprimer `s1._domainkey`, `s2._domainkey`, `sel1._domainkey` et `sg` (e-mails Wix).

---

## E. Améliorations et e-mails

### E1. Délivrabilité des e-mails @cruzmi.com — urgent

**Constat (4 novembre 2026)** : Gmail **refuse** les réponses envoyées depuis le webmail LWS (« 550 5.7.26 … sender is unauthenticated »). Les réponses passent depuis le smartphone de Bruno, qui envoie probablement par un autre serveur (Gmail). Ce n'est pas lié à la migration : le problème existait déjà avec Wix (rejet daté du 2 novembre 2026).

- [x] **SPF sur `cruzmi.com`** (ajouté le 4 novembre 2026 dans les zones Cloudflare et Wix ; réponse depuis le webmail LWS bien reçue sur Gmail) : TXT `v=spf1 a:mail.cruzmi.com ip4:193.203.239.24 include:lwspanel.com include:spf.brevo.com ~all`, à ajouter dans la zone Cloudflare (et dans la zone Wix tant que la propagation n'est pas terminée). Ne pas y ajouter `include:_spf.google.com` : on dépasserait la limite de 10 recherches DNS imposée par SPF.
- [ ] **DKIM LWS** : le serveur signe avec le sélecteur `dkim`, mais `dkim._domainkey.cruzmi.com` n'est pas publié. Récupérer la clé dans l'espace client LWS (e-mail → DKIM) et la publier en TXT dans la zone.
- [ ] **DMARC** : passer de `p=none` à `p=quarantine` une fois SPF et DKIM en place.

### E2. Hygiène des accès

- [ ] GitHub → Cruzmi-org → Settings → GitHub Apps → **Cloudflare Workers and Pages** : limiter l'accès au seul dépôt `cruzmi-website` (il voit aujourd'hui tous les dépôts de l'organisation).
- [ ] Cloudflare → Workers et Pages : supprimer le **Worker** `cruzmi-website` créé par erreur s'il existe encore. Garder uniquement le projet **Pages**.
- [ ] Inviter les membres de l'équipe sur le compte Cloudflare (Manage Account → Members) plutôt que de partager l'identifiant.

### E3. Adresses support@, dpo@ et legal@

L'offre LWS de cruzmi.com comprend **2 boîtes** : contact@cruzmi.com et bruno@cruzmi.com (constaté le 4 novembre 2026 dans l'espace client LWS ; l'offre permet aussi des « redirections simples »). Or les textes du site, repris des CGU Wix, affichent trois adresses **qui n'existent pas** : un message envoyé à l'une d'elles revient en erreur.

| Adresse | Où elle apparaît |
|---|---|
| `dpo@cruzmi.com` | Politique de confidentialité, CGU, mentions légales, FAQ, page Contact |
| `support@cruzmi.com` | CGU |
| `legal@cruzmi.com` | CGU, mentions légales |

- [x] **Décision du 4 novembre 2026** : l'offre LWS n'autorise qu'**un seul alias ou redirection**, déjà utilisé. Les textes du site (pages légales FR et EN, FAQ, page Contact) renvoient donc tous vers **contact@cruzmi.com**.
- [ ] Identifier l'alias ou la redirection LWS existant (« Alias & redirections : 1 / 1 », mais absent de la liste des boîtes).
- [ ] Plus tard, si l'on veut des adresses dédiées (`dpo@` est une bonne pratique RGPD) : passer à une offre e-mail LWS supérieure, ou déplacer les e-mails vers un service qui inclut les alias (Google Workspace, Zoho, Infomaniak…). Il n'est **pas nécessaire de transférer le domaine** : le registrar (LWS) et l'hébergement des e-mails sont indépendants. Une fois les adresses créées, les remettre dans les textes.
- [ ] Vérifier aussi les adresses affichées dans l'appli et sur les fiches des stores (adresse de support).

---

## Pour modifier le site

Le détail est dans le [README](../README.md). En résumé :

1. Node **24** : `.nvmrc` est fourni. Avec fnm : `fnm install 24`, puis le changement de version est automatique dans le dossier.
2. `npm install`, puis `npm run dev` → http://localhost:4321/fr/. Le formulaire de contact ne fonctionne pas en local ; tester sur l'aperçu.
3. Modifier les textes dans `src/content/…`, committer sur `develop` et pousser → l'aperçu se met à jour.
4. Avant de pousser : `npm run build` (contrôle des types + build) et `npm test` (tests de la fonction de contact).
5. Variables Cloudflare (Paramètres → Variables et secrets, **Production et Preview**) : `NODE_VERSION`, `BREVO_API_KEY`, `TURNSTILE_SECRET_KEY`, `PUBLIC_TURNSTILE_SITE_KEY`. Après toute modification, **relancer le déploiement** de la branche concernée.
