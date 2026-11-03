# Captures d'écran de l'appli

Un dossier par langue de l'appli : `fr/`, `en/`, `es/`.

## Règles

- **Même nom de fichier** dans chaque dossier : `fr/budget.jpg`, `en/budget.jpg`, `es/budget.jpg`.
- Si une capture manque dans une langue, le site affiche **la version française** à la place : on peut donc compléter les dossiers `en/` et `es/` progressivement.
- Formats acceptés : `.jpg`, `.jpeg`, `.png`, `.webp`. Le site les optimise automatiquement (pas besoin de les compresser).
- **Téléphone uniquement** pour le moment (l'affichage tablette de l'appli n'est pas encore validé).
- iPhone ou Android, au choix : l'appli est identique sur les deux. Rester sur le même téléphone pour toute une série, afin que les captures se ressemblent (barre d'état, proportions).
- Données de démonstration : pas de vraies personnes sans leur accord (photos de profil, noms, photos de la galerie).
- Éviter les fenêtres du système (autorisations, partage…) dans le cadre.
- Après ajout d'une capture : commiter le fichier. Pour une capture **nouvelle** (nom qui n'existe pas encore), il faut aussi l'appeler depuis la page concernée.

## Noms des captures

Série Android (Samsung), données de démonstration « Croisière Antilles 2026 ».

| Nom | Écran | FR | EN | ES | Utilisée sur |
|---|---|---|---|---|---|
| `projects` | Liste des projets | ✓ | ✓ | | |
| `programme` | Programme du jour | ✓ | ✓ | | Fonctionnalités |
| `participants` | Participants | ✓ | ✓ | | Fonctionnalités |
| `budget` | Budget (les cordons de la bourse) | ✓ | ✓ | | Fonctionnalités |
| `expenses-breakdown` | Répartition des dépenses (graphique) | ✓ | ✓ | | |
| `expenses` | Liste des dépenses | ✓ | ✓ | | |
| `expense-form` | Ajout d'une dépense | ✓ | ✓ | | |
| `balance` | Équilibre des comptes | ✓ | ✓ | | |
| `reimbursements` | Remboursements proposés | ✓ | ✓ | | |
| `shopping` | Liste de courses | ✓ | ✓ | | Fonctionnalités |
| `meals` | Repas du jour | ✓ | ✓ | | Fonctionnalités |
| `gallery` | Galerie photos | ✓ | ✓ | | Fonctionnalités |
| `album-config` | Configuration d'un album | ✓ | | | |
| `album-list` | Albums du projet, avec les prix | ✓ | | | |
| `album-flipbook` | Aperçu d'un album (flipbook) | | ✓ | | |
| `resources` | Ressources (check-list, liens utiles) | ✓ | | | |
| `map-route` | Carte : parcours complet | ✓ | | | Fonctionnalités |
| `map-route-zoom` | Carte : parcours, zoom | ✓ | | | |
| `map-day` | Carte : programme du jour | ✓ | | | |

Les photos des albums imprimés ne sont pas des captures d'écran : elles sont dans `src/assets/photos/`.
