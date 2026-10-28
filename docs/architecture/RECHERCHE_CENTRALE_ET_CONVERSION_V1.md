# MajestiOS — Recherche centrale et parcours de conversion V1

> Spécification fonctionnelle de référence. Ce document décrit la cible à implémenter ; il ne signifie pas que l'authentification, les candidatures ou le traitement documentaire sont déjà opérationnels.

## 1. Décisions UX validées

- La page d'accueil présente un moteur de recherche immédiatement visible, positionné au-dessus du carrefour circulaire MajestiOS.
- Le moteur ne doit ni recouvrir ni déséquilibrer le schéma. Le carrefour reste entièrement visible et constitue une seconde porte d'entrée vers les pôles.
- Le moteur d'accueil est compact par défaut : champ principal, bouton « Rechercher » et accès « Filtres avancés ». Les filtres détaillés s'ouvrent dans un panneau ou une zone repliable, pas dans le cercle.
- Le carrefour comprend les pôles Entreprises, Opportunités privées, Marchés publics, Emploi & missions, Business, Réseau & veille et Sources.
- La page d'accueil et les pages spécialisées partagent les composants de recherche, mais configurent les filtres selon le domaine. C'est une architecture hybride : une entrée transversale et des moteurs contextualisés, pas une copie indépendante du moteur pour chaque rubrique.
- La marque centrale du carrefour utilise le « M » doré surmonté d'une couronne. Le triangle doré au-dessus du M est conservé comme élément du symbole, intégré au dessin de la couronne.
- Le bandeau Emploi & missions défile de gauche à droite. Le bandeau des appels d'offres publics et celui des opportunités privées défilent de droite à gauche. Les animations respectent le survol, le focus clavier et la préférence système de réduction des animations.

## 2. Moteur transversal et filtres spécialisés

### Recherche depuis l'accueil
Le visiteur peut lancer une recherche par mots-clés et sélectionner un domaine. Les filtres avancés restent masqués tant que l'utilisateur ne les ouvre pas.

Domaines initiaux :
- Entreprises et radar d'entreprises ;
- Business : cession, acquisition, transmission et événements commerciaux ;
- Marchés publics ;
- Opportunités privées ;
- Emploi, missions et collaborations ;
- Réseau, partenaires et sources de veille.

Le système ne doit proposer que des filtres pertinents pour le domaine choisi. Il doit afficher explicitement les états de chargement, d'erreur, d'absence de résultats et la provenance des résultats.

### Recherche spécialisée
Chaque rubrique peut réutiliser le même socle de recherche et ses composants, avec ses propres champs :
- Entreprises : activité, localisation, identifiants officiels, taille ou événements lorsque les sources les fournissent ;
- Business : type d'événement, entreprise, localisation et date ;
- Marchés publics : mots-clés, acheteur, catégorie, département et échéance selon les données disponibles ;
- Opportunités privées : catégorie, zone, statut de publication et critères autorisés ;
- Emploi : métier, compétences, contrat, localisation, télétravail et date ;
- Sources et veille : source, thème, date et entreprise liée.

Ne jamais annoncer un filtre comme fonctionnel avant que la source ou le backend fournisse les données nécessaires.

## 3. Parcours commun de positionnement

Une annonce ou un résultat public peut être consulté selon les informations accessibles. L'action principale n'est pas une redirection vers un site tiers : elle invite à poursuivre la démarche dans MajestiOS.

Libellés possibles selon le contexte :
- « Cette opportunité m'intéresse »
- « Me positionner »
- « Créer mon espace personnel »
- « Déposer mon CV »

Lorsqu'un visiteur engage une action qui nécessite un compte :
1. conserver l'identifiant et le contexte du résultat sélectionné ;
2. présenter la création d'espace personnel ;
3. demander le minimum prévu : prénom, nom, adresse e-mail et téléphone ;
4. vérifier l'adresse e-mail et appliquer les protections anti-abus adaptées ;
5. après inscription, revenir à l'opportunité d'origine sans imposer une nouvelle recherche.

Un lien vers la publication ou la source officielle peut rester disponible à titre secondaire, pour la vérification et la transparence.

Tant qu'un backend d'authentification et de persistance n'est pas raccordé, l'interface doit indiquer clairement que le parcours est une démonstration et ne prétendre ni créer réellement le compte ni enregistrer la demande.

## 4. Parcours entreprise et Kbis

Pour le représentant d'une entreprise, après la création du compte :
1. proposer le téléversement d'un Kbis ou d'un justificatif adapté à la forme juridique ;
2. stocker le document dans un stockage privé, avec accès restreint et règles de conservation ;
3. extraire les champs lisibles, puis rapprocher l'entreprise des sources officielles disponibles ;
4. afficher les données extraites pour vérification et correction par l'utilisateur ;
5. déclencher les contrôles complémentaires requis avant d'accorder les permissions ou badges correspondants.

Le dépôt d'un Kbis ne certifie pas à lui seul tous les droits d'un utilisateur. Les documents ne doivent jamais être exposés dans un dossier public, les clés API restent côté serveur et les accès sont contrôlés côté serveur.

## 5. Emploi, missions et collaborations MajestiOS

La rubrique « Emploi & missions » possède deux flux visuellement et fonctionnellement distingués :

1. **Offres externes** : offres issues de sources autorisées, d'API ou de partenariats, sous réserve des conditions d'utilisation de chaque source.
2. **Collaborations potentielles avec MajestiOS** : besoins de recrutement réellement ouverts et, séparément, constitution d'un vivier de personnes intéressées par de futures collaborations.

Les profils susceptibles d'être utiles au développement de MajestiOS peuvent être mis en avant, notamment :
- comptabilité ;
- assistance administrative ;
- développement commercial et vente B2B ;
- prospection ;
- développement logiciel et automatisation.

La priorité d'affichage ne doit pas être présentée comme une offre d'emploi confirmée. Les postes ouverts, les missions envisagées et les candidatures spontanées doivent être explicitement différenciés. Ne jamais inventer une offre ou prétendre qu'un recrutement est ouvert sans validation.

### Parcours CV
Le CTA « Déposer mon CV — MajestiOS s'occupe du reste » ouvre ou reprend l'espace personnel. Après authentification, l'utilisateur peut transmettre son CV et vérifier les données extraites : compétences, expérience, formations, langues, métiers recherchés et préférences de travail.

L'IA peut rapprocher le profil des offres et besoins connus, expliquer les correspondances et préparer des éléments de candidature. Aucune candidature ni transmission du CV à un tiers ne doit être effectuée sans validation explicite du candidat. Le traitement du CV, les finalités, les accès et la durée de conservation devront être définis avant ouverture réelle du service.

Les offres externes ne peuvent être collectées automatiquement que si les modalités techniques et les conditions de la source le permettent. Si une source ne permet pas la republication, afficher une description limitée et proposer un accès secondaire à la source, sans prétendre que l'offre a été importée intégralement.

## 6. Intégration du BODACC dans Business

Le BODACC est une source de signaux d'intelligence commerciale et non une simple liste de liens externes. Depuis une annonce, l'utilisateur doit pouvoir enregistrer son intérêt dans MajestiOS et retrouver le contexte dans son espace personnel après inscription.

Les faits publiés, les rapprochements réalisés par MajestiOS et les hypothèses de l'assistant doivent être identifiés séparément. Une annonce ne permet pas de déduire automatiquement les intentions, les conditions d'une cession ni la disponibilité réelle d'une opportunité.

La source officielle reste consultable comme référence secondaire. Les données et champs affichés doivent être vérifiés sur les réponses réelles de l'API avant de déclarer l'intégration prête.

## 7. Socle technique modulaire

Prévoir des composants et contrats partagés, sans coupler les rubriques entre elles :
- configuration des domaines de recherche et de leurs filtres ;
- composants de recherche, filtres avancés et états de résultats ;
- modèle commun d'opportunité avec source, identifiant, date, type, provenance et état de vérification ;
- conservation du contexte de l'opportunité pendant le parcours d'inscription ;
- comptes et profils séparés des données métier ;
- stockage documentaire privé pour les justificatifs et les CV ;
- contrôle d'accès côté serveur et séparation des données par utilisateur/organisation ;
- journalisation des actions sensibles et traitement explicite des erreurs ;
- intégrations externes isolées derrière des adaptateurs par source.

Le moteur de recherche ne doit pas connaître les secrets d'API côté navigateur. Les fonctionnalités qui ne sont pas encore reliées à un backend doivent être signalées comme en préparation.

## 8. Ordre de réalisation recommandé

1. Vérifier les liens, routes, composants existants et l'état réel de l'intégration BODACC.
2. Ajuster la page d'accueil : recherche compacte au-dessus du carrefour, filtres avancés repliables et M doré couronné au centre du schéma.
3. Formaliser le modèle commun de résultat et la configuration des filtres par rubrique.
4. Définir le parcours d'inscription et le retour à l'opportunité sélectionnée, sans simuler une authentification opérationnelle.
5. Reconcevoir la rubrique Emploi & missions autour des offres externes et des collaborations MajestiOS, avec bandeau gauche-vers-droite.
6. Préparer le téléversement privé du CV et du Kbis uniquement après choix du backend, des règles d'accès et de conservation.
7. Tester les liens, la navigation clavier, le responsive, les états d'erreur, les sources et les tests de compilation.
8. Ne pas fusionner dans la branche principale ni déployer en production sans validation explicite du fondateur.
