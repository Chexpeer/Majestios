# MajestiOS — arborescence et dépendances de référence

Version : 2026-11-01  
Branche de travail : `refonte-architecture-dossiers-charte-majestios-2026-11-01`  
Objet : document de référence pour nettoyer le dépôt sans casser les pages, les interactions ni le build.

## Nouvelle architecture thématique — branche de refonte du 01/11/2026

Cette branche introduit une arborescence de **dix dossiers fonctionnels** sous `dossiers/`, décrite dans `DOSSIERS-MAJESTIOS.md`. Le bâtiment de la page d’accueil utilise ces dix thèmes ; le rez-de-chaussée reste « Accueil MajestiOS ».

Il faut distinguer deux éléments :
- **Immeuble de l’accueil : dix étages thématiques** — Marchés publics, Marchés privés, Veille économique, Prospection active, Développement commercial, Accompagnement aux appels d’offres, Salon virtuel, Espace entreprises, CRM et Business Intelligence.
- **Immeuble interactif : dix étages thématiques** — interface unique de navigation de l’accueil, avec ses accès cliquables vers les dossiers métier.

Les dix dossiers fonctionnels sont des dossiers d’organisation du projet. Les fichiers HTML restent à la racine pour préserver les routes relatives et le build statique. Les migrations de nom de page doivent être réalisées uniquement après audit des liens entrants, du build et des tests, avec une redirection de compatibilité si nécessaire. Les anciens noms de pages peuvent donc subsister derrière les libellés de navigation harmonisés.

Le moteur de recherche avancé est repris depuis la branche de référence et doit conserver ses critères, ses sources, ses destinations et ses garde-fous. La charte de cette refonte reste sombre, bleu nuit et or, avec des contrastes lisibles et une adaptation mobile. Cette branche ne doit pas être promue en production avant vérification du build, des liens, des filtres et des interactions.

## 1. Structure obligatoire de la page d’accueil

`index.html` contient uniquement :
1. la barre de navigation principale composée exactement de : Accueil, Développement commercial, Salon virtuel, Nous rejoindre, Espace membre et FAQ ;
2. l’immeuble interactif intégré directement à la page ;
3. le moteur de recherche avancé (mot-clé, catégorie, type de marché, localisation).

Ne doivent pas apparaître sur l’accueil : liste d’appels d’offres, annonces fictives en cartes, répertoire séparé des bâtiments, raccourcis redondants, blocs explicatifs, formulaires permanents, pied de page ou sections répétitives. Exception validée : un bandeau horizontal très discret et très lent peut rester en haut de page, uniquement comme flux de démonstration explicitement identifié comme fictif. Il ne doit jamais laisser croire que des annonces réelles défilent ; les résultats réels sont recherchés à la demande.

L’immeuble interactif doit rester visible directement sur l’accueil. Il constitue l’interface de navigation principale et ne doit pas devenir une rubrique de navigation séparée.

## 2. Pages du site

### Showroom virtuel — pilier commercial
Le showroom virtuel est une offre transversale de présentation et de mise en relation, distincte de la veille des marchés. L’immeuble interactif sert de porte d’entrée vers les dossiers MajestiOS ; chaque entreprise pourra disposer d’un showroom présentant ses savoir-faire, réalisations, capacités, références, certifications et possibilités de coopération. Le parcours cible est : Découverte → Visite → Compréhension → Confiance → Contact → Relation commerciale.

- **Showroom Essentiel** : fiche enrichie, activité, photos, coordonnées et liens utiles (offre à définir).
- **Showroom Immersif** : visite des locaux, vidéos, démonstrations, projets commentés et visite guidée (évolution à concevoir).
- **Modes de découverte** : « Street View » pour le parcours au sol, « Navigation aérienne » pour la vue en surplomb et « Carte interactive » pour la lecture cartographique. Les libellés restent descriptifs et neutres, sans marque de véhicule ni appareil précis. La disponibilité de chaque mode dépend du fonctionnement effectif de la scène et de ses solutions de secours.
- **Showroom augmenté par l’IA** : présentation, réponses aux questions et suggestions de partenaires à envisager ultérieurement ; les décisions restent humaines.

La page actuellement rattachée à la navigation « Salon virtuel » porte cette orientation showroom tout en conservant la dimension d’espace collectif d’exposition. Aucune tarification ni disponibilité n’est promise avant validation.




### Personnalisation différée des pages par rubrique

**Statut : prévue, non activée.** Après stabilisation générale du site, chaque rubrique pourra recevoir une identité visuelle légère et cohérente avec son sujet : couleur d’accent, pictogramme ou filigrane discret, variantes de cartes et ajustements limités de présentation.

Préparation attendue avant activation :
- définir une configuration centralisée par identifiant de rubrique ;
- s’appuyer sur les styles et gabarits partagés, sans créer une copie spécifique de chaque page ;
- prévoir un interrupteur global, désactivé par défaut, et une possibilité de retour au style commun ;
- vérifier les contrastes, la lisibilité, l’accessibilité clavier, le responsive mobile, les liens et les formulaires ;
- préserver la distinction entre identité visuelle et état réel des sources/connecteurs.

**Aucun changement visuel n’est à appliquer pendant le chantier de stabilisation.** L’activation sera une étape ultérieure, après validation explicite et tests anti-régression.

### Pages communes
- `index.html` — accueil de référence.
- `nous-rejoindre.html` — contributions et coopérations.
- `espace-membre.html` — parcours personnel de démonstration, sans compte réel.
- `faq.html` — explications et limites actuelles.
- L’ancienne expérience 3D autonome à douze bâtiments est obsolète. L’interface de référence est désormais l’immeuble interactif de l’accueil, à dix étages. Les fichiers et routes de cette ancienne expérience sont retirés ; seule une redirection de compatibilité conserve l’ancienne URL.

### Douze pages métier correspondant aux bâtiments
1. Marchés publics — `marches-publics.html`
2. Marchés privés — `marches-prives.html`
3. Développement commercial — `developpement-commercial.html`
4. Prospection active — `prospection-active.html`
5. Intelligence économique — `intelligence-economique.html`
6. Réseaux et synergies — `reseaux-synergies.html`
7. Veille des marchés — `veille-marches.html`
8. Accompagnement aux appels d’offres — `accompagnement-appels-offres.html`
9. Sous-traitance — `sous-traitance.html`
10. Salons et séminaires — `salons-seminaires.html`
11. Veille BODACC — `bodacc-veille-entreprises.html`
12. Suivi commercial — `suivi-commercial.html`

Chaque bâtiment doit pointer vers sa propre page métier. Les destinations sont centralisées dans `catalogue-majestios.js`.

**État réel de la profondeur de navigation (mise à jour du 31/10/2026).** La sélection d’un bâtiment affiche désormais trois niveaux navigables : la rubrique principale, un premier parcours associé et un second parcours associé. Les douze bâtiments ont chacun deux destinations complémentaires vers des pages HTML existantes ; le panneau est visible aussi sur l’accueil, et les liens disposent d’un état de focus clavier. Ces parcours sont des liens contextuels vers des pages métier existantes : ils ne constituent pas encore douze arborescences indépendantes avec des pages enfant dédiées. Ne pas présenter la profondeur dossier/sous-dossier/page comme totalement achevée avant la création éventuelle de pages enfant spécifiques.


### Préqualification des entreprises — nouveau parcours
- `qualification-entreprises.html` — formulaire interne de préqualification par codes APE/NAF et départements, accessible depuis `accompagnement-appels-offres.html`.
- `company-targeting-page.js` — orchestration du formulaire et affichage des candidats.
- `company-targeting.js` — adaptateur prototype de l’API publique Recherche d’Entreprises, normalisation, dédoublonnage et score indicatif.
- `tests/company-targeting.test.cjs` — tests dédiés de la brique de ciblage.
- `styles.css` — composants visuels de la page ; `build.js` doit déclarer la page et les scripts.

Cette page est un prototype de préqualification : les codes APE/NAF doivent être validés par un opérateur ; les scores ne prouvent pas une capacité technique ; les résultats ne sont pas enregistrés dans un CRM et aucune campagne n’est envoyée. Les tests ciblés simulés ont été effectués dans la session, mais le test Node dédié, le build complet et la validation de l’appel réel API dans le navigateur restent à effectuer avant de déclarer le parcours opérationnel.

### Pages de catégories de recherche
- `categorie-services-numeriques.html`
- `categorie-travaux-amenagement.html`
- `categorie-conseil-etudes.html`
- `categorie-batiment.html`
- `categorie-renovation.html`
- `categorie-electricite.html`
- `categorie-plomberie-chauffage.html`
- `categorie-maintenance.html`

Ces pages sont des destinations de filtres, distinctes des douze pages métier. Les liens de retour vers le moteur doivent utiliser `index.html#recherche-avancee` (et non l’ancienne ancre `#flux-ao`).

## 3. Ressources et dépendances

Les fichiers HTML restent à la racine du dépôt pour préserver les liens relatifs du site statique. L’arborescence ci-dessous est une arborescence fonctionnelle (pages communes, métiers, catégories), pas une consigne de déplacer immédiatement les fichiers dans des répertoires physiques.

- `styles.css` — styles généraux et composants communs.
- `app.js` — navigation et comportement du moteur de recherche.
- `catalogue-majestios.js` — correspondance des douze bâtiments avec les pages métier.
- L’immeuble interactif est rendu directement par `index.html` et son script intégré ; il ne dépend pas de l’ancienne scène 3D autonome.
- `rubriques-immersives.css`, `rubriques-immersives.js` — présentation et interactions des pages immersives.
- `schema-majestios.svg` — ancien schéma SVG non utilisé par le build courant ; le conserver jusqu’à une vérification complète des références avant suppression.
- `build.js` — prépare `dist/` à partir de la liste des ressources déclarées.
- `verify-site.js` — contrôle structure, ancres, pages et destinations.
- `.github/workflows/verify-site.yml` — exécute les contrôles automatiques.
- `vercel.json` — configuration de publication.
- `README.md` — résumé opérationnel du prototype.
- `CAHIER-DES-CHARGES-MAITRE-MAJESTIOS.md` — référence centrale pour la vision produit, les décisions, le périmètre fonctionnel, les extensions et les critères de réussite.
- `ARBORESCENCE-MAJESTIOS.md` — inventaire et règles de dépendances.
- `schemas/opportunite.schema.json` — contrat de données normalisé des annonces.
- `MODELE-DONNEES-APPELS-OFFRES.md` — règles de provenance, catégories, filtrage et intégration des sources.

## 4. Règles de nettoyage du dépôt

1. Conserver les deux documents de référence : `README.md` et ce fichier.
2. Ne pas supprimer une page métier ou catégorie uniquement parce qu’elle n’apparaît pas sur l’accueil : elle peut être une destination d’un bâtiment, d’un filtre ou d’un lien interne.
3. Ne pas supprimer une ressource tant que les références dans les HTML, JS, CSS, `build.js`, `verify-site.js` et le workflow n’ont pas été retirées ou migrées.
4. Les fichiers visuellement anciens ne sont pas forcément inutilisés. Vérifier leurs références avant toute suppression.
5. Retirer les fonctions redondantes de l’accueil sans supprimer les fonctions requises dans leurs pages dédiées.
6. Ne pas considérer les exemples de résultats ou formulaires de démonstration comme des services connectés.

## Pages de résultats et taxonomie de recherche

### Catégories publiques
Les huit catégories publiques possèdent des pages dédiées :
- `categorie-services-numeriques.html`
- `categorie-travaux-amenagement.html`
- `categorie-conseil-etudes.html`
- `categorie-batiment.html`
- `categorie-renovation.html`
- `categorie-electricite.html`
- `categorie-plomberie-chauffage.html`
- `categorie-maintenance.html`

### Catégories privées
Le sélecteur privé regroupe neuf catégories, réparties par état de connexion :
- **BODACC, moteur connecté** : `bodacc-creations`, `bodacc-cessions`, `bodacc-modifications`, `bodacc-procedures`, `bodacc-radiations`.
- **Sources à connecter** : `immobilier`, `emploi`, `sous-traitance-offres`, `sous-traitance-recherche`.

Les cinq catégories BODACC interrogent la source légale et filtrent les signaux par famille. Immobilier, emploi et sous-traitance doivent afficher un message explicite « source non connectée » et ne pas produire de résultats BODACC hors sujet.

### Règle de destination effective
Le formulaire conserve les paramètres `q` (mots-clés), `categorie`, `marche` et `zone`. Une catégorie publique active peut ouvrir sa page `categorie-*.html`. Les recherches privées, les catégories non connectées et les recherches transversales aboutissent actuellement à `resultats-recherche.html`, qui doit appliquer le type de marché et la catégorie transmis. Ne pas confondre une page métier de présentation avec une page de résultats filtrés.

## 5. Recherche avancée : sources, filtres et limites

Le parcours cible est **Type → Source → Catégorie → Page de résultats → Qualification commerciale/CRM**. Le type de marché doit être choisi avant la catégorie, et détermine les catégories proposées :
- **Public** : BOAMP et huit catégories métier publiques.
- **Privé** : BODACC (cinq familles de signaux), immobilier professionnel, emploi, offres de sous-traitance et recherche de sous-traitants/partenaires ; les quatre dernières familles restent à connecter.
- **Tous types** : recherche parallèle BOAMP + BODACC, résultats séparés par source, cinq cartes maximum par source et dix cartes maximum au total.

Les connecteurs BOAMP et BODACC sont interrogés à la demande depuis le navigateur. Les recherches privées BODACC sont des signaux d’entreprise publiés, pas des appels d’offres. Le moteur n’est pas encore un CRM : historique persistant, déduplication, qualification enregistrée, suivi des interactions et automatisation commerciale restent à développer.

Le filtre régional BOAMP traduit les régions en codes départementaux et vérifie le département de prestation ou celui de l’acheteur. Le filtre BODACC utilise son champ régional ; « Outre-mer » est refusé tant qu’une correspondance fiable n’est pas validée. Les catégories non connectées et les erreurs de source ne doivent jamais afficher de résultats inventés. Toute évolution de la taxonomie doit rester cohérente entre `app.js`, `opportunity-search.js`, les pages de résultats, les tests et cette documentation.

## 6. Critères de validation avant publication

- L’accueil ne contient que navigation, immeuble interactif et moteur de recherche avancé.
- La navigation principale contient uniquement : Accueil, Développement commercial, Salon virtuel, Nous rejoindre, Espace membre et FAQ. Aucun lien « Immeuble interactif », « Panorama » ou « Opportunités » n’y apparaît.
- Les douze bâtiments ont douze destinations métier distinctes.
- Les filtres et pages de catégories restent accessibles.
- Les ressources locales existent et les liens internes ne sont pas cassés.
- `node build.js` puis `node verify-site.js` se terminent sans erreur.
- L’immeuble interactif et ses dix étages sont vérifiés dans un navigateur, y compris sur mobile.
- La prévisualisation correspond au commit contrôlé avant toute mise en production.

Ce document décrit les exigences et dépendances du prototype ; il ne prétend pas que les intégrations métier sont déjà opérationnelles.


## 7. Extension de l'arborescence — informations stratégiques

Cette arborescence prépare les futures rubriques sans les annoncer comme déjà développées. Elle est logique et modulaire : les fichiers restent à la racine tant qu'une migration physique n'a pas été auditée.

### Développement commercial — veille et qualification
- Marchés publics (BOAMP).
- Événements d'entreprises et annonces commerciales (BODACC).
- Prospection active et qualification de prospects.
- Sous-traitance et partenaires.
- Veille économique et sectorielle.
- Analyse territoriale.
- Transmission et cession d'entreprises.
- Suivi des entreprises et établissements.

### Emploi — dossier autonome
- Déposer une offre d'emploi.
- Veille d'offres issues de sources autorisées.
- Validation, dédoublonnage, dates et expiration.
- Analyse des compétences recherchées et signaux sectoriels.
- Candidature via Nous rejoindre avec dépôt sécurisé de CV.

État actuel du moteur : « Emploi et recrutement » figure bien dans le sélecteur des catégories privées afin de préparer l’extension de la taxonomie, mais sa source n’est pas connectée. Tant que le connecteur et le parcours dédié ne sont pas validés, cette sélection doit afficher clairement que la source n’est pas disponible et ne doit lancer aucune recherche BODACC ni présenter de fausses offres d’emploi. Cette présence dans le sélecteur ne signifie pas qu’un moteur d’emploi opérationnel est livré. La veille emploi réelle reste interne et distincte du bandeau horizontal de l’accueil, qui demeure exclusivement fictif et ne diffuse aucune offre réelle.

### Immobilier professionnel et foncier d'entreprise — dossier autonome futur
- Signaux de cessation/transfert et établissements potentiellement libérés.
- Transactions : murs, fonds de commerce, droit au bail et cessions d'actifs traités séparément.
- Projets de construction/aménagement issus de données autorisées.
- Vérification de disponibilité, propriété/mandat et lien vers la source.
- Mise en relation avec agents immobiliers d'entreprise, gestionnaires et investisseurs, selon le contexte et les autorisations applicables.

Garde-fou : cessation, liquidation ou cession ne prouve pas que les locaux sont disponibles à la vente ou à la location. La disponibilité doit être confirmée séparément.

### Socle commun de veille stratégique
1. Sources et droits de réutilisation.
2. Collecte et conservation de la provenance.
3. Normalisation des entreprises, établissements, lieux, dates et catégories.
4. Contrôle qualité, dédoublonnage et fraîcheur.
5. Détection des signaux et distinction fait/hypothèse.
6. Qualification humaine et file de validation.
7. CRM : tâches, interactions, opportunités, historique.
8. Analyses territoriales et sectorielles, méthode et limites explicites.
9. Bandeau horizontal de l’accueil réservé à une démonstration fictive, sans diffusion d’annonces réelles.
10. Sécurité, contrôle d'accès, conservation et suppression des données.

### Cartographie des pistes à évaluer
- Marchés publics et résultats/attributions vérifiés.
- Créations, transferts, modifications et radiations d'entreprises.
- Ventes, cessions et procédures collectives.
- Projets de construction et d'aménagement.
- Sous-traitance potentielle après attribution, à confirmer.
- Besoins possibles des nouvelles entreprises.
- Évolutions des clients/partenaires suivis dans le CRM.
- Annonces d'emploi comme signaux sectoriels, sans moteur d'emploi.
- Signaux immobiliers professionnels.
- Tendances géographiques et sectorielles fondées sur des données sourcées.

### Règle de dépendance
Toute nouvelle page ou ressource doit être déclarée dans le build, contrôlée par verify-site, reliée depuis une destination explicite et testée. Ne pas refondre l’immeuble interactif ni changer la navigation principale ou le moteur commercial sans lot dédié et tests anti-régression.


## Dossier Emploi — veille interne, sans moteur public sur l'accueil

Le dossier **Emploi** est séparé des catégories du moteur principal d'opportunités commerciales. Il couvre deux usages distincts :

- **Veille interne discrète** : collecte planifiée de ressources d'emploi autorisées, normalisation des métiers et compétences, détection de tendances et qualification de signaux utiles au développement commercial.
- **Nous rejoindre** : parcours candidat pour proposer un profil ou un CV, avec traitement sécurisé, accès restreint, politique de conservation et suppression. Tant que le stockage et le traitement côté serveur ne sont pas connectés, ne pas afficher une confirmation laissant croire qu'un CV a été reçu.

Ressources à évaluer dans le cahier des charges : France Travail (API Offres d'emploi sous réserve d'accès confirmé, API Marché du travail, ROME 4.0, événements), La Bonne Alternance, APEC, Cadremploi, agentCo, HelloWork, Indeed, Welcome to the Jungle, LinkedIn, Choisir le service public et plateformes sectorielles. Les noms constituent un inventaire de sources candidates, pas une déclaration d'accès technique ou de droits de réutilisation.

Le bandeau horizontal de l’accueil reste exclusivement un flux de démonstration fictif, lent et discret : il ne doit jamais diffuser de signaux emploi ni d’annonces réelles. La veille emploi demeure interne et distincte des filtres BOAMP/BODACC. Toute évolution vers une diffusion réelle exigerait une décision distincte et un emplacement séparé.

### Règle de navigation
Le dossier Emploi peut être accessible depuis la rubrique « Nous rejoindre » pour le parcours candidat ou depuis une rubrique interne dédiée lorsque les modules seront implémentés. Il ne devient pas une nouvelle catégorie du moteur commercial principal. La création d'une page publique dédiée et son inclusion dans build.js exigent un lot ultérieur avec tests des liens, formulaires, confidentialité et anti-régression.


## Exigence transversale — ciblage d'entreprises et accompagnement aux appels d'offres

Sous « Développement commercial » et le dossier « Marchés publics », l'arborescence fonctionnelle doit prévoir des parcours dédiés à :
- qualification d'un appel d'offres et de ses lots ;
- correspondance entre activités du marché et codes APE/NAF ;
- recherche et sélection d'entreprises par département ;
- fiche de qualification et traçabilité des sources ;
- diffusion ciblée de l'opportunité avec proposition d'accompagnement ;
- accompagnement humain et technique à la compréhension du DCE, aux pièces de candidature, au mémoire technique, à la vérification et au suivi des échéances ;
- suivi des réponses et actions dans le futur CRM.

La cible d'environ dix entreprises par département et par opportunité est un objectif de sélection, pas un quota à remplir avec des entreprises inadéquates. Les pages et formulaires correspondants doivent être ajoutés dans un lot fonctionnel dédié avec liens, états d'erreur, droits d'accès et tests. Cette exigence ne justifie pas d'ajouter des listes d'entreprises ou d'appels d'offres sur l'accueil épuré.

Références de reprise pour toute IA : DOCUMENTATION-REPRISE-IA-MAJESTIOS.md et SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md.


### Qualification d’entreprises — suggestions APE/NAF

- qualification-entreprises.html : formulaire de préqualification des entreprises par code APE/NAF et département.
- naf-suggestions.js : suggestions lexicales explicables à partir de l’intitulé du marché ; sélection explicite par l’opérateur.
- company-targeting.js : interrogation de l’API Recherche d’Entreprises, normalisation, dédoublonnage, scoring et sélection plafonnée.
- company-targeting-page.js : orchestration du formulaire et affichage des candidats.
- tests/naf-suggestions.test.cjs et tests/company-targeting.test.cjs : tests unitaires dédiés.
- .github/workflows/majestios-anti-regression.yml : tests ciblés, build et vérification structurelle sur la branche de chantier.

Les suggestions APE/NAF restent indicatives ; elles ne remplacent ni la lecture du DCE, ni la validation humaine des codes et des capacités de l’entreprise.
