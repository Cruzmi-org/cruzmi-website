# Plan de migration DNS — cruzmi.com (Wix → nouveau site)

> Rédigé le 2 novembre 2026 à partir des requêtes DNS publiques (résolveur 1.1.1.1) et du code de
> l'application. **Un inventaire public ne voit pas tout** : l'étape 1 (export de la zone Wix) reste
> indispensable avant toute modification.

## 0. Ce qu'il ne faut surtout pas casser

| Élément | Où c'est aujourd'hui | Risque si oublié |
|---|---|---|
| E-mails `@cruzmi.com` (contact@, support@, dpo@, legal@…) | MX → `mail.cruzmi.com` = 193.203.239.24 (`mail48.lwspanel.com`, LWS) | Plus aucun e-mail reçu |
| Vérification Google Search Console | TXT `google-site-verification=…` | Perte de l'accès Search Console |
| Domaine Brevo (formulaire de contact) | TXT `brevo-code`, CNAME `brevo1/brevo2._domainkey`, TXT `_dmarc` | Messages du formulaire en spam ou rejetés |
| Liens d'invitation de l'appli | `redirect.cruzmi.fr` (zone **cruzmi.fr**, pas cruzmi.com) | Liens d'invitation cassés |
| Anciennes URL Wix (stores, liens existants) | Gérées par `public/_redirects` du nouveau site | 404 depuis l'App Store (politique de confidentialité) |

## 1. Inventaire actuel

### cruzmi.com — DNS chez Wix (`ns4.wixdns.net`, `ns5.wixdns.net`), registrar LWS

| Nom | Type | Valeur | À recréer ? |
|---|---|---|---|
| `cruzmi.com` | A | 185.230.63.107, 185.230.63.171, 185.230.63.186 (Wix) | **Non** → remplacé (voir §3) |
| `www` | CNAME | `cdn3.wixdns.net` (Wix) | **Non** → `cruzmi-website.pages.dev` |
| `cruzmi.com` | MX | `10 mail.cruzmi.com` | **Oui, à l'identique** |
| `mail` | A | 193.203.239.24 | **Oui** |
| `smtp`, `imap`, `pop` | CNAME | `mail.cruzmi.com` | **Oui** |
| `cruzmi.com` | TXT | `google-site-verification=TLcPFkw3SrKn0v9SWFzDJXWstazbyn-LcDMC9XPPYiM` | **Oui** |
| `cruzmi.com` | TXT | `brevo-code:577adf056f6e8587be066fd6d49fd180` | **Oui** |
| `brevo1._domainkey` | CNAME | `b1.cruzmi-com.dkim.brevo.com` | **Oui** |
| `brevo2._domainkey` | CNAME | `b2.cruzmi-com.dkim.brevo.com` | **Oui** |
| `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` | **Oui** |
| `s1._domainkey` | CNAME | `s1._domainkey.cruzmi.com.s010.ascendbywix.com` (e-mails marketing Wix) | Non, sauf si Wix e-mailing est utilisé |

Constats :
- **Aucun enregistrement SPF** sur cruzmi.com (pas de `v=spf1`). Voir §6 (amélioration, hors migration).
- Pas de DKIM pour les boîtes LWS (`default._domainkey` absent). Voir §6.
- Pas d'enregistrement CAA, pas d'IPv6, pas de SRV autodiscover détectés.

### cruzmi.fr — DNS chez LWS (`ns9`–`ns12.lwsdns.com`) — **non concerné par la bascule**

| Nom | Type | Valeur | Rôle |
|---|---|---|---|
| `cruzmi.fr`, `www` | A / AAAA / CNAME | 91.216.107.201, 2a00:7ee0:1:0:3:2811:0:578 | Page de parking LWS → à rediriger (§5) |
| `redirect` | A | 109.199.115.17 | Liens universels de l'appli (nginx sur Coolify) — **ne pas toucher** |
| `supabase`, `studio`, `coolify`, `admin` | A | 109.199.115.17 | Serveur Coolify — ne pas toucher |
| `mail` / MX / SPF / `_dmarc` | | LWS | E-mails @cruzmi.fr — ne pas toucher |

### Liens universels de l'appli

- Les builds de production prennent `WEB_DOMAIN` dans un secret GitHub (`deploy-stores.yml`, `eas-build-prod.yml`) ; la documentation de l'appli et le serveur indiquent **`redirect.cruzmi.fr`**.
- `https://redirect.cruzmi.fr/.well-known/apple-app-site-association` et `assetlinks.json` répondent bien (200).
- `https://cruzmi.fr/.well-known/…` répond 404 : si le secret valait `cruzmi.fr`, les liens universels seraient déjà cassés.
- **Conséquence** : la migration de cruzmi.com n'a aucun impact sur les liens d'invitation, et la redirection de cruzmi.fr (§5) ne doit concerner que `cruzmi.fr` et `www.cruzmi.fr`, jamais `redirect.cruzmi.fr`.
- ⚠️ À confirmer : valeur du secret GitHub `WEB_DOMAIN` (par exemple en partageant un lien d'invitation depuis l'appli en production).

## 2. Décision à prendre : où héberger le DNS de cruzmi.com ?

Cloudflare Pages accepte `www.cruzmi.com` avec un DNS externe (simple CNAME), mais **pas le domaine nu `cruzmi.com`** : il faut une redirection `cruzmi.com → https://www.cruzmi.com` assurée ailleurs, **en HTTPS** et **en conservant le chemin** (pour les anciennes URL Wix comme `cruzmi.com/faq`).

| | Option A — DNS chez LWS (décision initiale) | Option B — DNS chez Cloudflare (gratuit) |
|---|---|---|
| `www.cruzmi.com` | CNAME vers `cruzmi-website.pages.dev` | Domaine personnalisé Pages, configuré automatiquement |
| `cruzmi.com` (domaine nu) | Redirection via l'hébergement LWS (A vers LWS + `.htaccess` + certificat SSL) — **à vérifier que l'offre LWS le permet en HTTPS** | Règle de redirection Cloudflare, HTTPS inclus |
| E-mails | Enregistrements recréés chez LWS | Enregistrements recréés chez Cloudflare (non proxifiés) |
| Interfaces à gérer | LWS (registrar + DNS) + Cloudflare (site) | LWS (registrar seulement) + Cloudflare (DNS + site) |

**Recommandation : option B**, sauf si LWS confirme une redirection HTTPS du domaine nu qui conserve le chemin. Le domaine reste enregistré chez LWS dans les deux cas ; seule la gestion de la zone change.

## 3. Prérequis avant la bascule

- [ ] Site validé sur l'aperçu Cloudflare (`develop`), textes relus, pages légales validées (`reviewed: true`).
- [ ] `develop` fusionné dans `main` (PR), déploiement de production OK sur `cruzmi-website.pages.dev`.
- [ ] Formulaire de contact testé de bout en bout (message reçu sur contact@).
- [ ] Turnstile : hostname `www.cruzmi.com` ajouté au widget.
- [ ] Option A ou B choisie (§2) ; pour A, redirection HTTPS du domaine nu confirmée par LWS.
- [ ] Wix **toujours actif** (il sert de retour arrière pendant la propagation).

## 4. Bascule pas à pas

1. **Exporter la zone Wix** : Wix → Domaines → cruzmi.com → Gérer les enregistrements DNS. Faire une capture complète et la comparer au tableau §1 ; tout enregistrement inconnu doit être compris avant de continuer.
2. **Préparer la nouvelle zone** (LWS ou Cloudflare) avec **tous** les enregistrements « Oui » du §1, à l'identique. Pour Cloudflare : nuage **gris** (DNS only) sur `mail`, `smtp`, `imap`, `pop`.
3. **Ajouter les enregistrements du site** :
   - `www` CNAME `cruzmi-website.pages.dev` ;
   - domaine nu : selon l'option (A : enregistrement A vers l'hébergement LWS + `.htaccess` ; B : enregistrement proxifié + règle de redirection `cruzmi.com/*` → `https://www.cruzmi.com/${1}`, code 301).
4. **Cloudflare Pages** → projet → Custom domains → ajouter `www.cruzmi.com` (et `cruzmi.com` en option B).
5. **Choisir un moment calme** (semaine, matin) et vérifier que personne n'attend un e-mail critique.
6. **Changer les serveurs de noms** chez LWS (registrar de cruzmi.com) : remplacer `ns4/ns5.wixdns.net` par ceux de LWS ou de Cloudflare.
7. **Propagation** : jusqu'à 24–48 h (TTL actuel des NS : environ 23 h). Pendant ce temps, certains visiteurs voient encore Wix — sans gravité tant que Wix reste actif. Les e-mails continuent d'arriver puisque les deux zones pointent vers le même serveur.

## 5. Redirection de cruzmi.fr (indépendante, après la mise en ligne)

Sur l'hébergement LWS de cruzmi.fr (qui a déjà un certificat HTTPS valide), un `.htaccess` :

```apache
RewriteEngine On
RewriteRule ^ https://www.cruzmi.com/fr/ [R=301,L]
```

- Ne concerne que `cruzmi.fr` et `www.cruzmi.fr` ; `redirect`, `supabase`, `studio`, `coolify`, `admin` ont leurs propres enregistrements A et ne sont pas affectés.
- **Supabase Auth** : l'URL de site est `cruzmi.fr`. Vérifier quels e-mails d'authentification y renvoient (confirmation, réinitialisation du mot de passe) et que la redirection vers la page d'accueil reste acceptable ; sinon, changer l'URL de site.

## 6. Vérifications après bascule

```sh
nslookup -type=NS cruzmi.com 1.1.1.1      # nouveaux serveurs de noms
nslookup -type=MX cruzmi.com 1.1.1.1      # 10 mail.cruzmi.com
nslookup -type=TXT cruzmi.com 1.1.1.1     # google-site-verification + brevo-code
curl -I https://www.cruzmi.com/fr/        # 200, servi par Cloudflare
curl -I https://cruzmi.com/faq            # 301 → https://www.cruzmi.com/faq → 301 → /fr/faq/
curl -I "https://www.cruzmi.com/politique-de-confidentialit%C3%A9"   # 301 → /fr/confidentialite/
```

- [ ] Envoyer et recevoir un e-mail sur contact@, support@, dpo@ et legal@ (depuis une adresse externe).
- [ ] Formulaire de contact : un vrai envoi reçu.
- [ ] Brevo : domaine toujours « authentifié ».
- [ ] Search Console : propriété toujours vérifiée ; soumettre `https://www.cruzmi.com/sitemap-index.xml`.
- [ ] Liens de l'App Store et du Play Store vers les pages légales : OK.
- [ ] Lien d'invitation de l'appli : ouvre toujours l'appli.

**Retour arrière** : remettre `ns4.wixdns.net` / `ns5.wixdns.net` chez LWS (possible tant que Wix est actif).

**Après deux semaines sans incident** : résilier l'abonnement Wix, supprimer `s1._domainkey` s'il a été recopié.

## 7. Améliorations recommandées (hors migration, à faire séparément)

1. **SPF pour cruzmi.com** : aucun enregistrement aujourd'hui, ce qui pénalise la délivrabilité des e-mails envoyés depuis @cruzmi.com. Proposition à valider avec la documentation LWS : `v=spf1 mx a:mailphp.lws-hosting.com include:spf.brevo.com ~all`.
2. **DKIM pour les boîtes LWS** : à activer dans le panneau LWS si l'offre le permet.
3. **DMARC** : passer de `p=none` à `p=quarantine` une fois SPF et DKIM en place et les rapports propres.
4. **Liens d'invitation sans l'appli** : `https://redirect.cruzmi.fr/join/…` renvoie aujourd'hui une **404 nginx** aux invités qui n'ont pas encore l'appli. La page d'accueil des invités existe sur le nouveau site : `/join/` choisit la langue puis affiche `/fr/rejoindre/` ou `/en/join/`. Si elle reçoit `?path=/join/<trip>/<membership>`, elle propose un bouton qui rouvre l'invitation dans l'appli une fois celle-ci installée. Reste à ajouter dans nginx sur `redirect.cruzmi.fr` (équipe appli) :

   ```nginx
   # Keep serving the universal-link files as today.
   location /.well-known/ {
       default_type application/json;   # recommended for AASA (served as octet-stream today)
       # ... existing config ...
   }

   # Any other path = the app is not installed: send the visitor to the invitation page.
   location / {
       return 302 https://www.cruzmi.com/join/?path=$uri;
   }
   ```

   Utiliser une **302** (et non 301) pour que les navigateurs ne mémorisent pas la redirection. Tant que www.cruzmi.com n'a pas basculé, tester avec l'URL d'aperçu Cloudflare à la place de `https://www.cruzmi.com`.
5. **AASA** : `apple-app-site-association` est servi en `application/octet-stream` ; `application/json` est recommandé (voir la configuration nginx ci-dessus).
