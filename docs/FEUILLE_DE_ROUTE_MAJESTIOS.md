# Feuille de route centrale — MajestiOS
## Version de référence — 29 octobre 2026

Cette feuille de route organise les décisions fonctionnelles, éditoriales et architecturales de MajestiOS. Elle sert de référence avant toute évolution importante du site. Les changements sont réalisés progressivement sur la branche de travail dédiée `fix/homepage-structure-opportunity-flow`, sans modifier `main` ni la branche de sauvegarde.

---

## 1. Doctrine fondatrice

MajestiOS est une plateforme d'**intelligence commerciale proactive** et de **prospection inversée assistée par IA**. Ce n'est ni un simple catalogue d'appels d'offres ni un tableau de bord générique.

MajestiOS doit agir comme :
- **Conseiller** : aider à choisir une direction et à évaluer les options ;
- **Informateur** : détecter et expliquer les signaux commerciaux pertinents ;
- **Accompagnateur** : aider l'utilisateur à passer de l'information à l'action ;
- **Formateur** : transmettre des méthodes, des connaissances et de bonnes pratiques ;
- **Garant de méthode et de traçabilité** : rendre visibles les sources, les dates, les limites et le statut des informations, sans promettre une garantie absolue sur les résultats.

Boucle d'intelligence : **Observer → Vérifier → Qualifier → Expliquer → Agir → Recueillir les retours → Améliorer → Valider et partager les apprentissages**.

Fil conducteur produit : **Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser**.

L'analogie de la gare demeure structurante : MajestiOS détecte les signaux, qualifie les opportunités, oriente les entreprises vers les bons interlocuteurs et coordonne leur parcours commercial.

## 2. Architecture commune du site

Toutes les pages utilisent un langage visuel et une navigation cohérents :
- barre de navigation principale identique et fonctionnelle ;
- accès visible à l'espace personnel ;
- hiérarchie claire des titres, rubriques et actions ;
- liens internes menant à des pages ou fonctions réelles ;
- responsive mobile et prise en compte de la préférence de réduction des animations ;
- aucune navigation reposant uniquement sur des ancres vers des paragraphes éloignés ;
- aucun lien laissé en place s'il mène vers une route inexistante ;
- chaque page explique son objectif, les actions possibles et les limites de maturité des fonctions.

La structure est modulaire : les composants partagés doivent éviter les duplications, tandis que les contenus et cartes interactives restent propres à chaque rubrique.

## 3. Page d'accueil — poste de pilotage commercial

### Ordre et rôle des blocs
1. **Barre de navigation** : accès aux rubriques principales, aux sous-rubriques et à l'espace personnel.
2. **Présentation concise** : intelligence commerciale proactive, réseautage intelligent et accompagnement de bout en bout.
3. **Recherche multicritère d'opportunités** : mots-clés, zone géographique/département, catégorie et filtres réellement disponibles. Elle doit rester distincte visuellement du schéma.
4. **Schéma interactif central en flocon de neige numérique** : représentation de l'écosystème MajestiOS, avec le M/couronne au centre, des branches reliées et des nœuds qui conduisent à des pages dédiées.
5. **Flux d'annonces compact** : flux horizontal discret, sans transformer l'accueil en long catalogue. Distinguer visuellement les marchés publics et privés ; intégrer emploi, missions ou événements dans des flux adaptés.
6. **Espace personnel** : connexion/création d'espace et poursuite d'une démarche.
7. **Ressources utiles** : guides, bonnes pratiques et outils sélectionnés, sans concurrencer la recherche ni le schéma.

### Règles d'expérience
- La recherche multicritère ne doit pas recouvrir le flocon.
- Le flocon est un dispositif de navigation fonctionnel, pas une illustration décorative.
- Les flux servent à signaler des pistes et à inciter à explorer, pas à afficher une liste exhaustive.
- Les annonces privées peuvent masquer certains détails jusqu'à la création d'un espace, mais le parcours doit expliquer clairement ce qui sera demandé.
- L'accueil doit communiquer la proposition de valeur sans devenir une page interminable.

## 4. Pages annexes — espaces de travail spécialisés

### Gabarit de page
1. Barre de navigation commune.
2. Titre, mission et courte explication de la rubrique.
3. **Carte interactive spécialisée**, qui remplace le flocon central de l'accueil.
4. Recherche et filtres propres à la rubrique, lorsqu'ils sont utiles.
5. Flux d'annonces ou de signaux propre à la rubrique, lorsqu'il est pertinent.
6. Deux ou trois cartes de ressources : guide, bonnes pratiques, outil.
7. Actions concrètes et accès à l'espace personnel.
8. Informations de source, de date et de statut lorsqu'une donnée ou une recommandation en dépend.

La carte de chaque page doit guider l'utilisateur entre les étapes et sous-fonctions réelles de cette activité. Elle ne doit pas répliquer mécaniquement le schéma général de l'accueil.

### Rubriques et finalités
- **Marchés publics** : rechercher, filtrer, comprendre et qualifier les appels d'offres publics.
- **Marchés privés** : repérer les opportunités privées et comprendre le parcours de positionnement.
- **Radar entreprises** : détecter et qualifier des entreprises et signaux commerciaux.
- **Développement commercial** : organiser veille, ciblage, prospection, accompagnement et suivi.
- **Sources et veille** : comprendre les sources, leur fiabilité, leur couverture et leurs limites.
- **Réseaux professionnels** : identifier des acteurs et faciliter des mises en relation pertinentes.
- **Business et transmission** : présenter les signaux d'activité, acquisitions, cessions et transmissions, notamment ceux issus du BODACC lorsqu'ils seront effectivement intégrés.
- **Emploi et missions** : explorer les métiers, missions et offres ; distinguer explicitement les offres réelles des exemples ou postes encore à formaliser.
- **Comprendre MajestiOS / FAQ** : expliquer le concept, la méthode, les étapes, les responsabilités et les limites.
- **Nous rejoindre** : présenter les profils et parcours pour contribuer au projet.

## 5. Recherche, flux et conversion

- Les champs affichés doivent correspondre à des filtres opérationnels ; ne pas laisser croire qu'un filtre agit sur des données s'il n'est pas raccordé.
- Les flux doivent être compacts, lisibles et adaptés au contexte de la page.
- Marchés publics : identité visuelle bleue ; marchés privés : identité visuelle verte avec une mention « Privé » explicite.
- Un clic sur une annonce doit mener à une fiche utile ou à un parcours interne cohérent, pas rediriger automatiquement vers un site tiers lorsque le parcours MajestiOS est censé prendre le relais.
- Le parcours d'intérêt pour une opportunité peut demander nom, prénom, e-mail et téléphone, puis proposer le dépôt de pièces pertinentes (par exemple Kbis) au moment adéquat.
- Le dépôt de fichiers, la transmission de formulaires, la création de compte et le stockage ne doivent être annoncés comme opérationnels que lorsqu'ils sont réellement implémentés et sécurisés.
- Les sources externes envisagées comprennent notamment BOAMP, les plateformes de marchés publics et privés, France Marchés, LinkedIn, Apec, Cadremploi, France Travail, le Journal officiel et le BODACC. Une source ne doit être présentée comme connectée qu'après intégration effective.

## 6. Ressources et intelligence apprenante

Chaque rubrique doit pouvoir proposer deux ou trois cartes utiles :
- **Guide** : comprendre un processus ;
- **Bonnes pratiques** : éviter des erreurs et améliorer la qualité d'action ;
- **Outil** : réaliser une tâche concrète.

Ces cartes doivent conduire à des pages distinctes et réellement accessibles. Les contenus peuvent évoluer et être contextualisés, mais ne doivent pas être qualifiés de « mis à jour automatiquement » tant qu'aucun mécanisme d'actualisation n'existe.

La base de connaissances doit progressivement tracer : source, date, périmètre, historique, niveau de vérification et éventuelles limites. Les retours utilisateurs ne doivent pas être assimilés automatiquement à des vérités : ils doivent être évalués, contextualisés et validés avant de devenir des règles ou connaissances partagées.

## 7. Espace personnel et confiance

L'espace personnel est un parcours central, pas un simple lien de navigation. Il devra à terme gérer identité, suivi des démarches, documents et échanges avec des règles de confidentialité et d'isolation entre entreprises.

Tant que l'authentification, le stockage sécurisé, les règles d'accès et la conformité correspondante ne sont pas activés, l'interface doit indiquer clairement qu'aucune donnée ou pièce n'est réellement transmise ou conservée. Ne pas présenter une maquette comme un service actif.

## 8. Priorités de réalisation

### Lot 1 — cohérence et fiabilité de l'architecture
- conserver une seule page d'accueil de référence ;
- auditer les routes, menus, redirections et liens ;
- corriger les liens morts et les doublons de navigation ;
- confirmer que chaque rubrique principale mène à une page distincte ;
- vérifier le rendu du composant de ressources dans le gabarit partagé.

### Lot 2 — expérience d'accueil
- stabiliser la hiérarchie barre de navigation → recherche multicritère → flocon interactif → flux compact → espace personnel ;
- vérifier que le flocon ne se superpose pas à la recherche ou aux cartes ;
- harmoniser la charte graphique et les comportements sur mobile.

### Lot 3 — gabarit des pages annexes
- appliquer la barre de navigation commune ;
- concevoir une carte interactive propre à chaque domaine ;
- conserver seulement les filtres, flux et ressources utiles au domaine ;
- faire en sorte que chaque nœud et chaque carte mènent à une destination réelle.

### Lot 4 — parcours et données
- clarifier les parcours public/privé, emploi et espace personnel ;
- distinguer données réelles, exemples, hypothèses et fonctions non encore actives ;
- connecter progressivement les sources et les fonctions métier, sans simuler leur intégration.

### Lot 5 — apprentissage et accompagnement
- structurer les guides, bonnes pratiques et outils par rubrique ;
- créer la traçabilité des sources et des retours ;
- préparer la base de connaissances évolutive et les parcours pédagogiques.

### Lot 6 — validation
- vérifier toutes les routes et tous les liens internes ;
- contrôler navigation clavier, libellés accessibles et états interactifs ;
- contrôler les mises en page desktop et mobile ;
- exécuter lint, tests et build lorsque l'environnement le permet ;
- signaler explicitement toute validation qui n'a pas pu être effectuée.

## 9. Critères d'acceptation

Une évolution est acceptable seulement si :
- elle sert un besoin utilisateur identifié ;
- elle s'inscrit dans l'intelligence commerciale globale ;
- elle utilise ou prépare des données et connaissances identifiables ;
- elle améliore les résultats, la compréhension ou les compétences de l'utilisateur ;
- elle ne casse pas la navigation commune ;
- ses liens mènent à des destinations existantes ;
- elle décrit honnêtement son niveau de fonctionnement ;
- elle respecte la modularité et ne transforme pas le site en une page unique interminable.

## 10. Discipline de travail

- Travailler par lots cohérents plutôt que multiplier les micro-interruptions.
- Rester sur la branche dédiée existante ; ne pas modifier `main` ou la sauvegarde.
- Ne pas lancer de déploiement Vercel tant que la priorité reste le travail sur le dépôt.
- Ne pas déclarer un build, un test ou une vérification visuelle réussis sans résultat observable.
- Après chaque lot, résumer les changements réellement commités, les validations effectuées et les points encore ouverts.


## Règle éditoriale des cartes et ressources — 29 octobre 2026

Une carte ne doit pas pointer par défaut vers une page générique « Article en construction ». Sa destination dépend de sa fonction : page interne dédiée, guide, tutoriel, vidéo, logiciel, documentation officielle, outil ou parcours de service. Le libellé de l’action doit décrire la destination réelle. Les liens externes devront être identifiés et accompagnés de leur source ; les ressources non vérifiées ou fonctionnalités non disponibles ne doivent pas être présentées comme actives. La page « Article en construction » reste une solution ponctuelle pour un contenu précisément identifié, jamais une destination systématique.

## Principe directeur — profondeur et complexité progressives

La puissance de MajestiOS doit apparaître dans sa capacité à faire passer l’utilisateur d’une entrée simple à des niveaux d’analyse et d’action de plus en plus riches, sans rupture de navigation ni surcharge initiale.

Pour chaque rubrique et chaque nouvelle fonctionnalité, vérifier :
- **Niveau 1 — Comprendre :** l’utilisateur saisit la finalité et sait par où commencer.
- **Niveau 2 — Explorer :** il accède à une page dédiée, avec contexte, sous-rubriques et ressources pertinentes.
- **Niveau 3 — Qualifier :** il peut approfondir les critères, les sources et les éléments de décision réellement disponibles.
- **Niveau 4 — Agir :** il trouve un parcours concret, ses prérequis et les limites éventuelles du service.
- **Niveau 5 — Capitaliser :** les fonctions de suivi et de retour d’expérience pourront relier les actions aux résultats, une fois réellement implémentées.

Ce modèle est progressif, pas obligatoire à l’identique pour chaque page : la profondeur doit dépendre du besoin métier. Une fonctionnalité n’est pas considérée comme aboutie parce qu’elle possède une carte ou un écran ; elle doit s’inscrire dans un parcours cohérent et offrir une prochaine étape utile.

La validation d’un lot doit donc examiner à la fois la présence des pages, la pertinence des destinations, la continuité des parcours, l’absence de fausses fonctionnalités et la possibilité d’ajouter des niveaux sans refonte générale.

