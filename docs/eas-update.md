# Mettre à jour l'appli à distance avec EAS Update

> Rédigé le 7 novembre 2026. **Pas encore utilisé** : pour l'instant, les corrections passent par une nouvelle version sur les stores.
> Ce document concerne le dépôt de l'appli (`Cruzmi-org/cruzmi-supabase`). Il est rangé ici en attendant d'être déplacé là-bas.

## À quoi ça sert

Une appli Expo a deux couches :

- **la partie native** (accès à l'appareil photo, aux notifications, modules natifs, icône, permissions…) : elle ne change qu'avec une nouvelle version publiée sur les stores ;
- **la partie JavaScript** (écrans, logique, **textes et traductions**) : EAS Update peut la remplacer à distance, **sans validation d'Apple ni de Google**.

**Cas d'usage typiques** : corriger un texte ou une traduction (`src/translations/*.json`), un bug d'affichage, une règle de calcul.

**Pas possible avec EAS Update** : ajouter ou mettre à jour une bibliothèque native, changer `app.config.ts` (permissions, domaines associés, icône…), changer le SDK Expo. Pour tout ça, il faut une version sur les stores.

## Ce qui est déjà en place dans l'appli

| Élément | Où | Effet |
|---|---|---|
| `expo-updates` installé et activé en production | `package.json`, `app.config.ts` (`updates.enabled: APP_ENV === 'production'`) | Les versions des stores interrogent `u.expo.dev` à chaque lancement |
| Canal `production` | `eas.json`, profil `production` | Les versions des stores n'écoutent que ce canal. Les versions de test (`preview`, `staging`) écoutent `staging` |
| `runtimeVersion: { policy: 'appVersion' }` | `app.config.ts` | Une mise à jour n'est reçue que par les installations qui ont **le même numéro de version** (`version` de `package.json`) |
| `fallbackToCacheTimeout: 0` | `app.config.ts` | L'appli démarre sans attendre : la mise à jour est téléchargée en arrière-plan et appliquée **au lancement suivant** |

En pratique, la plupart des utilisateurs reçoivent la mise à jour en un ou deux jours, selon la fréquence à laquelle ils ouvrent l'appli.

## Le piège à éviter : les réglages de production

Une mise à jour **embarque les réglages présents au moment où elle est créée** : adresse et clés Supabase, `SECRET_KEY`, `WEB_DOMAIN`, numéro de version…

- Les versions des stores sont construites par GitHub Actions (`.github/workflows/deploy-stores.yml`) avec `APP_ENV=production`, `EXPO_NO_DOTENV=1`, les secrets GitHub `SECRET_KEY` et `WEB_DOMAIN`, et les variables d'environnement EAS `production` (pour Supabase…).
- Le fichier `.env` d'un poste de développement contient d'autres valeurs (développement ou test).

**Une mise à jour lancée depuis un poste pourrait donc envoyer à tous les utilisateurs une appli branchée sur la mauvaise base de données ou le mauvais domaine.** Règle : **toujours passer par le workflow GitHub ci-dessous**, jamais par `eas update` sur un poste pour le canal `production`.

## Le workflow GitHub à ajouter (une seule fois)

Fichier à créer dans le dépôt de l'appli : `.github/workflows/eas-update.yml`. Il reprend les mêmes réglages que `deploy-stores.yml` et se lance **à la main** (onglet Actions → « EAS Update » → Run workflow).

```yaml
name: EAS Update

on:
  workflow_dispatch:
    inputs:
      channel:
        description: 'Canal (staging pour tester, production pour les utilisateurs des stores)'
        required: true
        default: staging
        type: choice
        options: [staging, production]
      message:
        description: 'Description courte de la mise à jour'
        required: true
        type: string

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: 🏗 Setup repo
        uses: actions/checkout@v7

      - name: 📦 Setup Node + PNPM + install deps
        uses: ./.github/actions/setup-node-pnpm-install

      - name: 🏗 Setup EAS
        uses: expo/expo-github-action@v9
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: 🧪 Run quality checks
        run: pnpm check-all

      - name: 🚀 Publish update
        run: >
          eas update
          --channel ${{ inputs.channel }}
          --environment ${{ inputs.channel == 'production' && 'production' || 'preview' }}
          --message "${{ inputs.message }}"
          --non-interactive
        env:
          APP_ENV: ${{ inputs.channel == 'production' && 'production' || 'staging' }}
          EXPO_NO_DOTENV: 1
          SECRET_KEY: ${{ secrets.SECRET_KEY }}
          WEB_DOMAIN: ${{ secrets.WEB_DOMAIN }}
```

**À vérifier par l'équipe appli avant le premier usage** (je n'ai pas pu le tester) :

- le nom des environnements de variables EAS (`production`, `preview`…) sur expo.dev → projet → *Environment variables*, et que `--environment` les charge bien ;
- que les secrets `SECRET_KEY` et `WEB_DOMAIN` sont les bons pour le canal `staging` (sinon prévoir des secrets dédiés au test) ;
- que les versions `staging` ont bien `updates.enabled` : aujourd'hui `app.config.ts` ne l'active qu'en production. Pour tester sur `staging`, il faut l'activer aussi pour `APP_ENV === 'staging'`, ce qui suppose **une nouvelle version de test** (changement natif).

## Procédure, une fois le workflow en place

1. **Partir du bon code** : la branche doit avoir **le même numéro de version** (`package.json` → `version`) que la version actuellement sur les stores, sinon personne ne recevra la mise à jour. Ne pas monter la version pour une mise à jour à distance.
2. **Vérifier que le changement est seulement JavaScript** (textes, écrans, logique). En cas de doute, faire une version stores.
3. Fusionner la correction (PR → `develop` → `main`, comme d'habitude). **Attention** : un push sur `main` déclenche aussi `deploy-stores.yml` (nouvelle version stores). Si on veut *uniquement* la mise à jour à distance, lancer le workflow EAS Update depuis `develop` ou une branche dédiée, ou adapter le déclencheur de `deploy-stores.yml`.
4. **Tester sur `staging`** : lancer « EAS Update » avec le canal `staging`, ouvrir deux fois l'appli de test sur un téléphone et vérifier la correction.
5. **Publier en `production`** : relancer le workflow avec le canal `production`.
6. Suivre l'adoption sur expo.dev → projet → *Updates*.

## Retour arrière

Si une mise à jour pose problème :

- republier la mise à jour précédente, ou revenir à la version embarquée dans l'appli des stores : `eas update:rollback`, ou depuis expo.dev → *Updates* ;
- les utilisateurs reçoivent le retour arrière au lancement suivant (ou au deuxième, comme pour une mise à jour).

## Premier cas d'usage envisagé

Texte du message d'invitation (`memberships.inviteMessage`, FR / EN / ES). L'ancien texte contient trois liens (Google Play, App Store, invitation) et WhatsApp n'affiche la carte d'aperçu que du **premier** lien. Le nouveau texte ne garde que le lien d'invitation (« Rejoins-moi sur le projet *…* dans Cruzmi 👉 lien »). Décision du 7 novembre 2026 : livré par une version stores, comme d'habitude.
