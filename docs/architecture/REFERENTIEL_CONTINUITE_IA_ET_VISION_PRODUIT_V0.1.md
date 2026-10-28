# MajestiOS — Référentiel de continuité IA, vision produit et architecture pyramidale

- **Version :** 0.1
- **Date de rédaction :** 28 octobre 2026
- **Branche de travail visée :** `architecture-v0-1`
- **Statut :** cadrage produit et architecture cible ; plusieurs éléments sont des exigences ou des intentions, pas des fonctions livrées.
- **Public cible :** fondateur, développeurs et toute IA ou personne appelée à reprendre le projet.
- **Règle de priorité :** ce document complète les référentiels maîtres et les tomes existants ; il ne les remplace pas. En cas de contradiction, signaler le conflit et demander arbitrage avant toute implémentation.

## 1. Message essentiel à toute IA qui reprend MajestiOS

MajestiOS est un projet ambitieux de plateforme professionnelle d'intelligence commerciale. Ne pas le réduire à une vitrine, un annuaire, un CRM traditionnel, un site de petites annonces ou un simple moteur d'appels d'offres.

La finalité est de transformer des informations économiques et professionnelles dispersées en signaux qualifiés, en opportunités compréhensibles et en actions commerciales que l'utilisateur peut organiser et suivre.

Le modèle conceptuel central est :

**Entreprise → Interlocuteur → Décideur**

Il est complété par :
- **ACT / Activité :** ce qui s'est passé et ce qui doit être suivi ;
- **KNB / Knowledge Base :** ce qui est connu et conservé comme connaissance de l'entreprise ;
- **PIP / offre ou proposition commerciale :** ce qui est proposé, vendu ou recherché ;
- **DMH / décideur et relations :** les personnes et rôles concernés, selon les définitions du référentiel maître.

Les termes et objets canoniques doivent être confirmés dans le référentiel maître V4.1 et les documents de conception associés avant de modifier le modèle de données. Ne pas inventer un nouveau modèle concurrent.

## 2. Vision et ambition produit

### 2.1 Positionnement

MajestiOS vise à devenir une **plateforme collaborative d'intelligence commerciale assistée par IA**. Elle doit aider les professionnels à :
1. détecter des événements et opportunités ;
2. trouver et qualifier des entreprises ;
3. comprendre leur activité et leur contexte ;
4. identifier, lorsque l'information est disponible et utilisable, les interlocuteurs et décideurs pertinents ;
5. préparer et organiser des démarches commerciales ;
6. recueillir des informations sur le terrain ;
7. conserver et réutiliser les connaissances professionnelles ;
8. transformer des contacts et informations en actions suivies.

L'IA est un copilote métier relié à des fonctions réellement disponibles, pas un chatbot généraliste prétendant tout faire.

### 2.2 Ambition et séquencement

L'ambition globale est large, mais le développement doit rester progressif et commercialement pragmatique :
- priorité à une première version professionnelle utile ;
- rechercher les premiers clients payants et valider l'usage réel ;
- enrichir ensuite les modules selon la valeur observée et le coût réel ;
- garder l'extension internationale et les fonctionnalités universelles comme évolutions possibles, sans détourner le MVP professionnel.

Ne pas confondre « prévu dans la vision » avec « développé », « testé », « validé » ou « disponible en production ».

## 3. Règles non négociables pour les intervenants et IA

1. **Lire avant de modifier.** Examiner l'état actuel du dépôt, la branche, les documents de référence et les dépendances.
2. **Préserver l'existant.** Ne pas supprimer les fichiers historiques ou remplacer globalement des pages sans vérifier leur rôle et documenter le changement.
3. **Travailler par petites unités cohérentes.** Segmenter les idées, les livrables, les commits et les tests.
4. **Architecture pyramidale.** Organiser les domaines, modules, sous-modules, pages, composants, services et données avec des responsabilités distinctes.
5. **Modularité réelle.** Une nouvelle source ou fonctionnalité ne doit pas imposer une reconstruction générale.
6. **Vérité fonctionnelle.** Distinguer explicitement : opérationnel vérifié, présent dans le code mais non validé, maquette/exemple, prévu, bloqué.
7. **Traçabilité.** Documenter le besoin, la décision, les fichiers touchés, les tests et leurs limites.
8. **Pas de secrets dans Git.** Les clés et identifiants restent côté serveur, dans des variables sécurisées ; ne jamais les demander ou les écrire en clair dans la documentation.
9. **Sécurité dès la conception.** L'authentification ne remplace pas l'autorisation ; prévoir permissions serveur et isolation des organisations au niveau base de données.
10. **Sources vérifiables.** Conserver provenance, date, identifiant source et statut de validation. Distinguer fait sourcé, inférence IA et donnée à confirmer.
11. **Pas de faux résultats.** Une panne de source ne doit pas être masquée par des données fictives présentées comme réelles.
12. **Aucune action de production implicite.** Ne pas fusionner dans la branche de production, promouvoir un déploiement, changer domaine, variables, base ou paramètres de production sans autorisation explicite du fondateur.
13. **Une CI verte n'est pas une validation métier.** Build/lint ne prouvent ni la justesse des données externes, ni les parcours complets, ni la sécurité.
14. **Ne pas prétendre avoir exécuté une action** (création de compte, enregistrement, envoi, collecte) si aucun mécanisme réel ne l'a effectivement exécutée.

## 4. Architecture pyramidale de l'information et de la navigation

Cette structure est une cible fonctionnelle, pas un inventaire des routes actuellement implémentées.

### Niveau 1 — Entrées principales

- Accueil
- Opportunités
- Intelligence commerciale
- Réseaux
- Nous rejoindre
- Espace membre
- Aide (accessible depuis la navigation secondaire et le pied de page)

### Niveau 2 — Domaines fonctionnels

#### A. Accueil
- Présentation claire de MajestiOS et de sa valeur.
- Accès rapide à la recherche d'opportunités.
- Aperçu des marchés publics et opportunités privées.
- Présentation du radar des entreprises.
- Explication des usages et des limites des fonctions.
- Appels à l'action explicites, sans promesse non tenue.

#### B. Opportunités
- Appels d'offres publics.
- Opportunités privées et annonces déposées ou relayées.
- Missions commerciales, missions freelance, emplois, stages, apprentissages et collaborations selon le périmètre validé.
- Radar des nouvelles entreprises et événements économiques.
- Business : achat, vente, cession, fonds de commerce et transmission.
- Fiches de détail, filtres, source, dates, état et prochaine action possible.

#### C. Intelligence commerciale
- Recherche et qualification de prospects.
- Analyse d'entreprises et de marchés.
- Identification des interlocuteurs et décideurs à partir d'informations accessibles et vérifiables.
- Préparation de la prospection, des appels, entretiens et argumentaires.
- Collecte et analyse des informations de terrain.
- Veille sectorielle et e-réputation.
- Mémoire d'entreprise / Knowledge Base.
- Suivi des actions et activités commerciales.

#### D. Réseaux professionnels
- Découverte des entreprises et organisations.
- Interlocuteurs et décideurs.
- Partenaires et fournisseurs potentiels.
- Collaborations et mises en relation.
- Relations entre entreprises et opportunités.
- Respect des autorisations, de la confidentialité et des conditions de réutilisation des données.

#### E. Espace membre
- Connexion et inscription.
- Tableau de bord personnel/organisation.
- Profil professionnel et entreprise.
- Opportunités enregistrées.
- Recherches sauvegardées et alertes.
- Contacts et suivi commercial.
- Activités, rendez-vous et tâches.
- Mémoire d'entreprise.
- Paramètres, préférences et droits d'accès.

Ces rubriques ne doivent pas donner l'impression que des comptes, une authentification ou un stockage existent tant que le parcours complet n'a pas été implémenté et testé.

#### F. Nous rejoindre
- Pourquoi rejoindre MajestiOS.
- Parcours par public : entreprises, artisans et indépendants, commerciaux/prospecteurs, recruteurs ou organisations, partenaires.
- Ce que chaque profil peut réellement faire aujourd'hui.
- Fonctionnement de l'inscription et conditions d'accès.
- Formulaire uniquement si le traitement, le stockage, la sécurité et le message de confirmation sont réellement raccordés.
- Possibilité de candidatures, annonces et missions à développer selon le périmètre validé.

#### G. Aide et pédagogie
- FAQ générale.
- Comprendre MajestiOS.
- Guides de prise en main.
- Guides de recherche d'opportunités et de prospection.
- Explication des sources et des limites.
- Sécurité et confidentialité.
- Contact/assistance si le canal existe réellement.

### Niveau 3 — Sous-pages et fonctionnalités

Chaque domaine doit se décomposer en pages d'accueil de rubrique, pages de recherche/listes, fiches détaillées, formulaires et espaces de suivi. N'ajouter un sous-niveau que s'il clarifie le parcours ou la responsabilité.

### Niveau 4 — Composants et services réutilisables

Prévoir, au rythme des besoins validés :
- composants de navigation et de pied de page ;
- composants de filtres et de résultats ;
- cartes d'entreprise, de contact, d'opportunité et d'activité ;
- états de chargement, erreur, absence de résultats et accès refusé ;
- services de normalisation, déduplication, provenance et qualification ;
- connecteurs de sources isolés ;
- services d'authentification, d'autorisation et d'audit.

## 5. Refonte de la navigation

### 5.1 Menu principal cible

| Entrée | Contenu |
|---|---|
| Accueil | Vision, proposition de valeur, accès aux recherches et parcours principaux |
| Opportunités | Marchés publics, opportunités privées, radar entreprises, Business achat/vente/cession |
| Intelligence commerciale | Prospection, études de marché, veille, e-réputation, mémoire d'entreprise |
| Réseaux | Entreprises, interlocuteurs, décideurs, partenariats, collaborations |
| Nous rejoindre | Présentation des publics, bénéfices, parcours et accès à l'inscription |
| Espace membre | Connexion, inscription et accès à l'espace authentifié |

L'aide et la FAQ doivent être facilement trouvables, notamment depuis le pied de page et éventuellement un accès secondaire.

### 5.2 Exigences de cohérence

- Même en-tête, mêmes conventions visuelles et même pied de page sur les pages publiques.
- Menus déroulants organisés par domaines, utilisables à la souris, au clavier et sur mobile.
- Indication de la page ou rubrique active.
- Liens internes vers de vraies routes ; aucune entrée morte ou redirection trompeuse.
- Les liens vers des sections de page sont réservés aux ancres pertinentes, pas utilisés comme substitut permanent à une page de connexion ou à un tableau de bord.
- Connexion et inscription doivent être distinguées.
- Menu mobile accessible, lisible et testé.
- Navigation et pied de page doivent être partagés autant que possible, plutôt que recopiés indépendamment sur chaque page.

### 5.3 Organisation des routes

L'espace membre doit avoir son propre segment de route/dossier dans l'App Router Next.js (par exemple `src/app/espace-membre/`) et des pages enfant organisées par fonction. Le chemin exact doit être confronté aux routes existantes avant toute création ou migration. Un dossier ne constitue pas une protection de sécurité : authentification, contrôles d'autorisation serveur et règles de base de données sont obligatoires pour les données privées.

Ne pas déplacer tous les fichiers dans un nouveau groupe de routes sans audit des routes, liens, styles, imports et déploiements.

## 6. Exigences de contenu et de pédagogie

Le texte n'est pas un habillage secondaire. Il doit expliquer la valeur et apprendre à utiliser le produit.

Chaque page de fonctionnalité devrait préciser, lorsque pertinent :
1. À quoi sert la fonction ?
2. À qui s'adresse-t-elle ?
3. Quel problème professionnel résout-elle ?
4. Comment fonctionne-t-elle, étape par étape ?
5. Quelles données utilise-t-elle et d'où viennent-elles ?
6. Que peut faire l'utilisateur à partir du résultat ?
7. Quelles sont les limites et conditions d'accès ?
8. Quel est le statut de la fonction : disponible, bêta, prototype ou prévue ?
9. Quelle est la prochaine action possible ?

Exigences éditoriales :
- contenu suffisamment approfondi, concret et compréhensible ;
- exemples pédagogiques clairement étiquetés comme fictifs s'ils ne proviennent pas de données réelles ;
- vocabulaire précis : marché public, mission, entreprise à reprendre, cession, signal commercial, contact, décideur ;
- éviter de présenter toute donnée comme une opportunité certaine ;
- éviter les promesses vagues telles que « l'IA fait tout » ;
- CTA explicites et cohérents avec le fonctionnement réel ;
- FAQ structurée par thèmes, avec réponses complètes, pas seulement quelques questions de présentation ;
- cohérence entre textes, menus, pages et fonctionnalités réellement disponibles.

## 7. Vision fonctionnelle des sources et des opportunités

### 7.1 Principe commun

Les sources externes doivent alimenter une chaîne réutilisable :

**Source → collecte → validation/normalisation → déduplication → rapprochement avec une entreprise → signal/événement → qualification → opportunité potentielle → action utilisateur → suivi.**

Chaque enregistrement exploitable devrait conserver, selon les possibilités et la source : identifiant externe, URL d'origine, date de publication/collecte, type d'événement, données brutes minimales nécessaires, statut de validation et historique des mises à jour.

Les sources ne sont pas équivalentes et ne doivent pas être fusionnées sans conserver la provenance. Respecter licences, conditions d'accès, fréquence autorisée, données personnelles et règles de prospection.

### 7.2 BOAMP

Rôle : marchés publics et avis de commande publique. Le connecteur existe dans le prototype sous `src/app/api/opportunities/route.ts`, mais son fonctionnement réel et ses filtres doivent encore être validés de bout en bout. Se reporter à `README.md`, `docs/veille-appels-offres.md` et aux dossiers `docs/brainios/`.

Ne pas considérer une CI réussie ou une page Vercel en état READY comme une preuve que les résultats, départements, dates limites et liens vers les avis sont corrects.

### 7.3 BODACC

Le BODACC est une source cible à prévoir explicitement dans le registre des sources. Il peut contribuer, selon les catégories d'annonces et les conditions de diffusion, à repérer :
- certaines créations/immatriculations ou étapes de vie des entreprises ;
- ventes et cessions ;
- transmissions et reprises ;
- procédures collectives et événements juridiques publiés ;
- autres modifications annoncées.

Usages possibles :
- **Radar des nouvelles entreprises** pour les prestataires souhaitant prospecter des entreprises récemment créées ;
- **Business : achat, vente et cession** pour repérer des annonces de cession et de transmission ;
- **Veille entreprise** pour enrichir le contexte et l'historique.

Précautions :
- toutes les créations ou transactions ne sont pas nécessairement présentes dans les mêmes catégories ;
- une annonce ancienne ou publiée ne prouve pas qu'une offre est encore disponible ;
- une adresse n'est pas toujours présente, exacte ou adaptée à une prospection physique ;
- les procédures collectives exigent un traitement prudent, sans stigmatisation ni inférence automatique ;
- vérifier l'annonce d'origine et l'actualité de l'information avant de recommander une action.

**Statut : source envisagée/documentée ici ; connecteur BODACC non attesté comme implémenté.**

### 7.4 SIRENE / répertoire des entreprises et établissements

Source cible complémentaire pour rapprocher les entreprises/établissements et enrichir, lorsque disponibles et diffusibles, des données comme raison sociale, activité, adresse professionnelle, identifiants et dates de création. Les modalités d'accès, la licence, les données non diffusibles et les conditions d'utilisation doivent être vérifiées avant implémentation.

Le rapprochement doit utiliser des identifiants stables lorsqu'ils sont disponibles et traiter les doublons et changements d'adresse avec prudence.

**Statut : source envisagée ; connecteur non attesté comme implémenté.**

### 7.5 Autres sources potentielles

D'autres sites publics ou professionnels pourront être ajoutés via des connecteurs indépendants, après vérification de la fiabilité, de la licence, des modalités techniques et de la valeur utilisateur. Ne pas présumer qu'une source est gratuite, ouverte, accessible sans clé ou réutilisable commercialement sans vérification.

### 7.6 Radar des nouvelles entreprises et événements

Fonction cible : permettre une recherche par zone géographique, secteur, type d'événement et ancienneté (par exemple 7, 30 ou 90 jours, selon disponibilité des données). Les résultats pourraient être enregistrés, qualifiés et convertis en tâches ou suivis commerciaux.

Exemples d'usage :
- un fournisseur d'équipement recherche de nouveaux artisans dans un département ;
- un prestataire comptable recherche des entreprises récemment créées ;
- un repreneur explore les annonces de cession disponibles.

Les exemples d'entreprises doivent être fictifs et clairement étiquetés, sauf lorsqu'ils proviennent d'une source réelle citée et vérifiée. La présence d'une adresse professionnelle n'autorise pas toutes les formes de prospection : respecter les règles applicables, les préférences et oppositions des personnes, ainsi que la nature des coordonnées utilisées.

### 7.7 Business : achat, vente, cession

Rubriques cibles :
- acheter une entreprise ou un fonds de commerce ;
- vendre/cession d'entreprise ou fonds de commerce ;
- recherche de repreneurs ;
- transmission et opportunités de reprise ;
- événements et signaux associés, en séparant annonces vérifiées, signaux issus d'une source et offres déposées directement par les membres.

Le BODACC peut fournir une partie des signaux et annonces pertinentes, mais ne doit pas être considéré comme un catalogue exhaustif ni comme une preuve de disponibilité commerciale.

## 8. Modèle de valeur : de la source à l'action

Les modules doivent se renforcer mutuellement, sans créer des doublons de données ou des accès injustifiés.

Exemple de chaîne cible :
1. un événement de création est détecté ;
2. l'entreprise est identifiée/rapprochée des données professionnelles disponibles ;
3. son activité, sa localisation et la date de l'événement sont qualifiées ;
4. un membre recherche les entreprises correspondant à son profil client idéal ;
5. MajestiOS explique pourquoi le résultat est pertinent et d'où vient l'information ;
6. le membre peut enregistrer le résultat, préparer une démarche et planifier une activité ;
7. les retours de prospection peuvent, selon les autorisations, enrichir la mémoire de son organisation.

Une cession peut aussi alimenter le domaine Business si les données et l'annonce correspondent à cet usage. Ne pas déduire automatiquement qu'un événement légal est une intention d'achat, une intention de vente encore active ou une opportunité rentable.

## 9. Espace membre : parcours et sécurité

L'espace membre est un domaine structurant, mais ne doit pas être simulé. Les pages peuvent être planifiées et documentées, cependant toute zone privée doit attendre une authentification et une autorisation réelles.

Fonctions cibles possibles :
- profil professionnel ;
- organisation/entreprise ;
- opportunités enregistrées ;
- recherches et alertes ;
- contacts ;
- tâches, appels, rendez-vous et activités ;
- mémoire d'entreprise ;
- préférences et droits.

Avant de construire les fonctions persistantes :
- confirmer l'environnement Supabase DEV ;
- valider les objets métier et le modèle d'organisation ;
- mettre en place l'authentification ;
- appliquer RLS et contrôles serveur ;
- tester l'isolation entre organisations ;
- protéger les actions d'administration ;
- ne jamais exposer de clé privée dans le navigateur ou le dépôt.

Ne pas multiplier prématurément les clés IA/agents. Le principe de travail actuel est un assistant métier avec des outils autorisés côté serveur et des permissions distinctes selon le rôle, sauf décision d'architecture ultérieurement justifiée.

## 10. Organisation technique cible (indicative)

Exemple d'organisation possible, à adapter à l'arborescence existante après audit :

```text
src/
├── app/
│   ├── page.tsx
│   ├── opportunites/
│   │   ├── page.tsx
│   │   ├── appels-offres-publics/
│   │   ├── opportunites-privees/
│   │   ├── entreprises/
│   │   └── business/
│   ├── intelligence-commerciale/
│   │   ├── page.tsx
│   │   ├── prospection/
│   │   ├── etudes-de-marche/
│   │   ├── e-reputation/
│   │   └── memoire-entreprise/
│   ├── reseaux/
│   ├── espace-membre/
│   │   ├── connexion/
│   │   ├── inscription/
│   │   ├── tableau-de-bord/
│   │   ├── opportunites/
│   │   ├── contacts/
│   │   └── parametres/
│   ├── nous-rejoindre/
│   ├── aide/
│   │   ├── faq/
│   │   └── guides/
│   └── api/
├── components/
│   ├── navigation/
│   ├── opportunities/
│   ├── companies/
│   ├── contacts/
│   └── shared/
├── features/
│   ├── opportunity-intelligence/
│   ├── sales-workspace/
│   ├── market-intelligence/
│   └── business-knowledge/
└── lib/
    ├── sources/
    │   ├── boamp/
    │   ├── bodacc/
    │   └── sirene/
    ├── database/
    ├── security/
    └── utils/
```

Cet exemple n'est pas une instruction de déplacer immédiatement les fichiers. La branche actuelle contient aussi des fichiers historiques à la racine (`index.html`, `app.js`, `build.js`, `styles.css`) dont le rôle doit être vérifié avant toute suppression ou migration.

## 11. État de référence connu au 28 octobre 2026

- Dépôt : `Chexpeer/Majestios`.
- Branche de travail citée : `architecture-v0-1`.
- Application Next.js sous `src/app`; des fichiers historiques statiques coexistent à la racine.
- La page d'accueil contient un formulaire de recherche BOAMP, des éléments illustratifs d'opportunités privées et de missions, des sections pédagogiques encore incomplètes et une demande d'accès dont la persistance doit être vérifiée.
- Il n'y a pas encore de preuve que l'authentification, un tableau de bord membre, un CRM persistant, une facturation, la base métier complète ou le connecteur BODACC/SIRENE soient opérationnels.
- Le connecteur BOAMP est présent dans le code, mais la validation de bout en bout (filtres, résultats réels, dates, état des avis, URL de source et interface) reste à documenter.
- Le déploiement de prévisualisation associé à `architecture-v0-1` était marqué READY lors du contrôle du 28 octobre 2026. Cela ne vaut pas validation de toutes les pages ni autorisation de promotion en production.
- La production et la prévisualisation sont distinctes ; vérifier les projets/domaines avant toute action.
- Un workflow GitHub Actions avait réussi sur le commit BOAMP `ff1fd3697103937aed70b6846ce472ffacc68255`, run `40635180936`. Ce résultat atteste le contrôle exécuté, pas l'intégralité du comportement métier.

Ce point d'état est daté et doit être réactualisé après vérification, plutôt que traité comme une vérité permanente.

## 12. Ordre de réalisation recommandé

### Phase 0 — Reprise et cartographie
- Lire ce document, le README, les documents sous `docs/architecture` et `docs/brainios`.
- Retrouver le référentiel maître/tomes qui font autorité.
- Vérifier branche et commit courants, fichiers modifiés, routes et projets Vercel.
- Établir ce qui est réellement opérationnel, partiel, simulé ou absent.

### Phase 1 — Navigation et architecture de contenu
- Faire l'inventaire des routes et liens.
- Définir une navigation commune et un pied de page partagé.
- Unifier le menu principal, le menu membre, « Nous rejoindre » et l'aide.
- Corriger les destinations mortes et les ancres utilisées à tort comme pages.
- Tester desktop/mobile/clavier.

### Phase 2 — Profondeur et pédagogie
- Construire les pages de niveau supérieur puis leurs sous-pages selon une priorité validée.
- Rédiger des textes pédagogiques complets, exemples, limites et CTA.
- Créer une FAQ organisée par thèmes et des guides.
- Identifier explicitement ce qui est disponible ou en développement.

### Phase 3 — Domaine opportunités et sources
- Valider BOAMP en bout en bout et consigner les cas de test.
- Définir les contrats génériques des connecteurs et le modèle de provenance.
- Documenter BODACC et SIRENE comme sources cibles, puis valider accès, licence, schéma, quotas et cas de test avant implémentation.
- Prioriser le radar des nouvelles entreprises et Business achat/vente/cession selon la valeur utilisateur.

### Phase 4 — Espace membre et données
- Confirmer le modèle métier à partir du référentiel maître.
- Concevoir l'authentification, les rôles, les permissions et l'isolation des organisations.
- Implémenter un parcours de bout en bout avant d'annoncer la disponibilité.
- Tester les scénarios d'accès autorisé et interdit.

### Phase 5 — Vérification et livraison
- Lint et build.
- Tests de routes et de parcours réels.
- Tests API sur données de sources et scénarios d'erreur.
- Vérification mobile, accessibilité, liens, contenu et états vides/erreur.
- Prévisualisation Vercel et compte rendu.
- Aucun merge, promotion production ou changement sensible sans autorisation explicite.

## 13. Définition de terminé (DoD) pour chaque évolution

Une tâche n'est terminée que si :
- le besoin et le résultat attendu sont clairs ;
- le changement est limité et cohérent ;
- les pages et liens associés sont à jour ;
- les états de chargement, erreur et absence de données sont prévus ;
- les données réelles sont distinguées des exemples ;
- les permissions sont considérées pour les données privées ;
- les contrôles applicables ont été exécutés et rapportés ;
- les limites et tests non réalisés sont indiqués ;
- la documentation et le registre de décisions sont mis à jour ;
- le statut du déploiement est indiqué sans promotion implicite en production.

## 14. Instructions de reprise — première action de la prochaine IA

Avant d'écrire du code :
1. lire ce document ;
2. lire le `README.md` et les documents pertinents dans `docs/architecture/` et `docs/brainios/` ;
3. vérifier la branche et le dernier commit, puis les routes/fichiers actuels ;
4. ne pas supposer que la proposition d'arborescence existe déjà ;
5. proposer ou exécuter uniquement le prochain petit lot cohérent dans la branche de développement ;
6. résumer les fichiers modifiés, les contrôles exécutés, les limites et l'URL de prévisualisation ;
7. ne jamais fusionner ou déployer en production sans l'accord explicite du fondateur.

## 15. Décisions confirmées par ce cadrage

- MajestiOS est une plateforme d'intelligence commerciale, pas seulement un site d'annonces.
- La vision est ambitieuse ; la réalisation doit être modulaire, segmentée et progressive.
- La navigation, l'espace membre, « Nous rejoindre », les réseaux, la FAQ et la pédagogie doivent être traités comme des éléments de premier plan.
- BODACC et SIRENE doivent être prévus dans le catalogue des sources, en complément de BOAMP ; leur intégration réelle doit être testée avant toute annonce de disponibilité.
- Le radar des nouvelles entreprises et le domaine Business achat/vente/cession sont des usages cibles importants.
- Les informations d'une source sont des signaux à qualifier, pas automatiquement des opportunités vérifiées.
- Les branches de développement et les prévisualisations servent à valider ; la production reste protégée par une autorisation explicite.
