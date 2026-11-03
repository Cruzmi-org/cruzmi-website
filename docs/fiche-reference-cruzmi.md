# Fiche de référence Cruzmi

> Ce que fait **réellement** l'application, établi à partir de son code (dépôt `cruzmi-supabase`, version **2.0.4**, branche `develop`) le 3 novembre 2026.
> Cette fiche sert de base à tous les textes du site, au référencement et à la visibilité dans les IA : on n'écrit sur le site que ce qui figure ici comme disponible.
> Les points marqués **[à confirmer]** sont à valider par l'équipe appli.

## 1. En une phrase

Cruzmi est une application mobile collaborative (iPhone, iPad, Android) qui réunit dans un espace commun tout ce dont un groupe a besoin pour préparer, vivre et garder en mémoire un projet partagé : programme jour par jour, carte, dépenses et remboursements, repas, courses, ressources, participants et photos, jusqu'à l'album photo imprimé.

## 2. Identité et accès

| Élément | Réalité dans l'appli |
|---|---|
| Plateformes | iOS (iPhone et iPad) et Android. Pas de version web pour les utilisateurs. |
| Langues | Français, anglais, espagnol. |
| Pays | Téléchargeable uniquement en **France, Suisse, Belgique et Luxembourg** (au 3 novembre 2026, voir `reste-a-faire.md` A7). L'appli s'utilise ensuite partout. [à confirmer : usage à l'étranger une fois installée] |
| Prix | Application gratuite, sans abonnement ni achat intégré trouvé dans le code. **Seuls les albums photo sont payants** (voir §6). [à confirmer] |
| Compte | E-mail et mot de passe, ou connexion avec **Google** ou **Apple**. |
| Limite | **10 projets** par utilisateur « en version bêta » (message affiché dans l'appli). |
| Suppression de compte | Depuis l'appli (Profil, Mon compte). Les données personnelles sont effacées ; les contributions (suggestions, activités, courses, repas) restent visibles sous le nom « Ancien membre ». |
| Hors connexion | Les informations déjà chargées restent consultables sans réseau ; une connexion est nécessaire pour ajouter du contenu et recevoir les mises à jour des autres. |
| Temps réel | Les ajouts des autres participants apparaissent en direct (dépenses, repas, photos, albums…). |

## 3. Comment fonctionne un projet

1. **Création** : un assistant pose quelques questions (nom, dates, destination, projet à un seul lieu ou itinérant, étapes, hébergements, trajets aller et retour, budget). On peut aussi passer l'assistant et tout remplir plus tard.
2. **Modules à la carte** : le créateur active seulement ce qui est utile (Dépenses, Repas, Courses, Ressources, Photos) et peut changer d'avis à tout moment.
3. **Invitation** : un lien d'invitation, envoyé par le canal de son choix (SMS, WhatsApp, e-mail…). L'invité installe l'appli, crée son compte et rejoint le projet.
4. **Rôles** : le créateur du projet en est le propriétaire (il gère les paramètres et peut supprimer le projet) ; les autres sont membres et **contribuent tous** : activités, suggestions, dépenses, repas, courses, photos.
5. **Visibilité** : un projet n'est visible que par ses participants. [à confirmer]

Principe d'interface : chaque élément (étape, hébergement, activité, participant, dépense, repas) est un « badge » cliquable. Une aide contextuelle est accessible dans les pages principales.

## 4. Fonctionnalités disponibles

### Programme (cœur de l'appli)
- Programme **jour par jour** : étape du jour, hébergement, activités avec horaires et lieux.
- Saisie rapide : l'étape et l'hébergement se reportent automatiquement sur les jours suivants tant qu'ils ne changent pas.
- **Suggestions** : une réserve d'idées proposées par les participants, à ajouter au programme d'un simple geste.
- Activités déplaçables et duplicables d'un jour à l'autre ; alerte en cas de chevauchement horaire.
- Ajout d'un lieu par recherche, en pointant la carte, ou en collant un **lien Google Maps**.
- **Roadmap** : vue récapitulative du projet, partageable en **PDF**.

### Carte
- Toutes les étapes, hébergements, activités et suggestions localisés sur une carte (plan, satellite, hybride), jour par jour ou en vue globale.
- Le moyen de transport entre les étapes (voiture, train, avion, bus, vélo, à pied, camping-car, bateau, **voilier**, bateau à moteur…) et la distance approximative de chaque trajet.
- **Import de traces GPX** ; tracés de navigation modifiables pour les trajets en bateau.
- Chaque participant peut afficher ses propres trajets aller et retour (visibles par lui seul).

### Dépenses et remboursements
- Budget prévisionnel du groupe et budget personnel de chacun, avec suivi « budget / dépenses ».
- Saisie des dépenses par catégorie ; chacun enregistre ce qu'il paie.
- Répartition équitable : **coefficient de pondération** par participant (ajustable dépense par dépense), **groupes** (couple, famille, équipe) qui règlent leurs comptes ensemble, prise en compte des **dates de présence** de chacun.
- Une dépense peut être offerte (« cadeau ») sans peser sur les comptes communs.
- **Calcul automatique de qui rembourse qui**, en limitant le nombre de remboursements (les groupes le réduisent encore).
- Export **Excel** des dépenses.
- Devises : EUR, USD, GBP, CHF (devise préférée dans le profil). [à confirmer : une même dépense peut-elle être saisie dans une autre devise ?]

### Repas
- Repas planifiés jour par jour : fait maison ou au restaurant, avec menu ou informations utiles.
- Ajout du repas au programme de la journée ; suggestions de repas par les participants ; vue d'ensemble du séjour.

### Courses
- Une liste commune où chacun ajoute des articles ; les achats sont cochés et visibles en direct.
- Export **Excel**, remise à zéro de la liste, duplication vers un autre projet à venir.

### Ressources
- **Check-list** commune (« passeport à jour, adaptateur… ») et **liens utiles**.
- **Biens personnels** qu'un participant met à disposition (maison, bateau, camping-car, véhicule, équipement), avec photos et instructions ; il les garde dans son profil et les réutilise d'un projet à l'autre.
- **Biens externes** (location, charter, hébergement réservé) avec références de réservation, liens et documents, accessibles à tous.

### Participants
- Fiche de chaque participant : informations qu'il choisit de partager (contact, bio, réseaux sociaux), dates de présence (présence partielle indiquée).
- **Tableau des participants** partageable (utile pour une liste d'embarquement ou d'inscription).

### Photos et souvenirs
- **Galerie commune** : chacun partage ses photos, classées jour par jour, avec descriptions.
- Réorganisation des photos d'une journée ; enregistrement des photos sur son téléphone.

### Albums photo
- **Album généré automatiquement** à partir des photos partagées en moins d'une minute (minimum 10 photos ; 3 albums au plus par projet).
- Personnalisation : thème (Anniversaire, Campagne, Famille, Fête, Mer, Montagne, Ville), format (A4, A5, carré 30 × 30 ou 21 × 21, portrait ou paysage), photo de couverture, page de synthèse du projet en option. Les descriptions des journées enrichissent l'album.
- Aperçu animé en « flipbook » avant commande.
- Les albums générés sont conservés 15 jours, puis supprimés (on peut en relancer un).

## 5. Ce qui distingue Cruzmi

Arguments vérifiés dans le code, à privilégier sur le site :

1. **Du premier échange à l'album imprimé** : la même appli couvre la préparation, le déroulement et les souvenirs ; peu d'applis de groupe vont jusqu'au livre photo.
2. **Des comptes vraiment équitables** : pondération, groupes, dates de présence, cadeaux. Plus fin qu'un simple partage à parts égales.
3. **Tout le monde contribue** : chaque participant peut ajouter activités, suggestions, dépenses, repas, courses et photos, pas seulement l'organisateur.
4. **Modulable** : on n'active que ce qui sert au projet.
5. **Les biens partagés** : mettre à disposition sa maison, son bateau ou son camping-car, avec les consignes, et les réutiliser d'un projet à l'autre.
6. **Pensé aussi pour la mer** : trajets en voilier, tracés de navigation, import GPX (utile pour le public du magazine, sans en faire le cœur du message).

## 6. Offre payante : albums photo

| Finition | Description | Prix |
|---|---|---|
| PDF HD | Fichier haute définition à télécharger et partager, disponible 2 jours après paiement | **5 € TTC** (déduit si l'album imprimé est commandé ensuite dans ce délai) |
| Standard | Album imprimé, couverture rigide | Calculé selon le format et le nombre de pages, affiché TTC dans l'appli |
| Premium | Ouverture à plat (180°), papier de qualité supérieure, 120 pages au plus | Idem, plus cher que Standard |

- Paiement par carte (Stripe). Impression en France par **Flexilivre** (papier issu de forêts gérées durablement, imprimerie Imprim'Vert, entreprise neutre en carbone).
- Livraison à l'adresse choisie, plusieurs exemplaires possibles, suivi de commande et du colis, facture téléchargeable. Frais de douane possibles hors UE (Suisse, Canada…).
- Pour le site, un prix d'appel « à partir de … € » serait utile. [à confirmer : prix d'un album standard type]

## 7. Annoncé dans l'appli mais pas encore disponible

À **ne pas présenter comme disponible** sur le site (on peut éventuellement les citer comme « bientôt ») :

- Partage de **documents** (billets, pièces d'identité) dans le profil et les ressources.
- **Sondages** dans un projet.
- **Notifications** (générales et par projet).
- Page **Explorer** (découvrir des destinations).
- Aperçu complet d'un projet.

Par ailleurs, le code ne contient **ni messagerie interne, ni partage de position en direct** : ne pas les mentionner (les CGU actuelles les citent à tort, voir `reste-a-faire.md` C1).

## 8. Pour quels projets ? (point d'attention pour le positionnement)

L'appli est structurée autour d'un projet **daté, sur une ou plusieurs journées, dans un ou plusieurs lieux** : programme jour par jour, étapes, hébergements, trajets, repas. Son vocabulaire interne reste marqué par le voyage (« Mes escapades », « destination », « séjour »).

Elle convient donc très bien à :
- voyages, croisières, road-trips, week-ends entre amis ou en famille ;
- événements sur une ou plusieurs journées : anniversaire, mariage, cousinade, fête ;
- sorties, stages, compétitions et séjours de clubs et d'associations ;
- tout projet collectif qui se déroule à des dates précises avec un programme, des dépenses partagées et des photos.

Elle convient moins bien, aujourd'hui, à un projet sans dates ni lieu, qui s'étale sur des mois (un chantier, une tournée longue, un projet de quartier) : il n'y a pas de gestion de tâches à assigner, d'échéances ni de messagerie.

**Recommandation** : garder le positionnement large « tous vos projets de groupe », mais l'illustrer par des projets qui ont des dates, un programme et un lieu. Plusieurs exemples du site actuel sont à revoir sous cet angle (« un chantier, une tournée, un projet entre voisins » dans les cas d'usage de l'accueil). Une évolution des libellés de l'appli (« Mes escapades » → « Mes projets ») renforcerait la cohérence avec le site.

## 9. Écarts relevés sur le site en construction

| Page | Texte actuel | Constat |
|---|---|---|
| Accueil, cas d'usage | « Un chantier, une tournée, un projet entre voisins » | Peu adapté à l'appli actuelle (voir §8). |
| Fonctionnalités, Participants | « Un organisateur et des membres, chacun dans son rôle » | Exact (propriétaire / membres). |
| Fonctionnalités, Album | « Une impression haute définition livrée chez vous » | Exact ; ajouter la finition Premium et le PDF HD à 5 €. |
| FAQ | Mode hors-ligne | Exact. |
| FAQ, Données | « Visibles que par leurs participants » | À confirmer (A4). |
| Absent du site | Pondération, groupes, cadeaux ; biens partagés ; carte GPX et voilier ; roadmap PDF ; export Excel ; connexion Google / Apple ; limite de 10 projets | À intégrer selon les priorités. |

## 10. Questions encore ouvertes pour l'équipe appli

- La limite de 10 projets et la mention « bêta » sont-elles toujours d'actualité ?
- Prix d'un album standard type (pour un « à partir de »).
- Multi-devises sur une même dépense ?
- Pays de disponibilité sur les stores.
- Calendrier prévu pour documents, sondages et notifications.
- Les questions de `reste-a-faire.md` §A4 restent valables.
