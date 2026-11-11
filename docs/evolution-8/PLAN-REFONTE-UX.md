# Plan de refonte UX — MajestiOS Evolution-8

**Date :** 11 novembre 2026  
**Statut :** plan de conception ; les composants et parcours décrits ci-dessous ne sont pas encore livrés.

## 1. Objectif de l'interface

L'utilisateur ne doit pas percevoir une collection de services juxtaposés. Il doit comprendre qu'il utilise un environnement unique qui l'aide à développer et gérer son entreprise.

Le fil de navigation doit suivre les besoins du client :
1. développer ;
2. trouver des marchés ;
3. gérer ses clients ;
4. organiser ses interventions ;
5. établir ses devis et factures ;
6. suivre ses règlements ;
7. être accompagné et trouver des partenaires.

## 2. Vitrine publique

### Accueil

La page d'accueil doit répondre en quelques secondes à trois questions :
- Qu'est-ce que MajestiOS ?
- Qu'est-ce que cela m'apporte concrètement ?
- Comment commencer sans changer tous mes outils ?

Structure cible :
- promesse principale et sous-titre métier ;
- deux parcours explicites : « J'utilise déjà un CRM » et « Je cherche un CRM » ;
- présentation synthétique des domaines intégrés ;
- focus sur appels d'offres, développement commercial et facturation électronique ;
- explication du rôle de Cheexpeer ;
- mise en valeur du Réseau et des partenaires ;
- appel à l'action vers l'espace membre et l'accompagnement.

Ne pas annoncer un module facturation, une PA ou un CRM client comme disponible avant sa recette. Les éléments en préparation doivent être étiquetés « en préparation » ou « à venir ».

### Navigation

Conserver une navigation classique, stable et responsive. Les six familles existantes et leurs routes doivent être inventoriées avant toute modification. Les entrées métier peuvent évoluer vers :
- Développement commercial ;
- Appels d'offres ;
- Gestion d'entreprise ;
- Facturation & dématérialisation ;
- Réseau & partenaires ;
- Espace client.

La réorganisation ne doit ni supprimer des pages utiles ni créer de liens fictifs. La page « Facturation électronique & dématérialisation » est un sous-parcours de l'accompagnement et doit être accessible depuis les menus Appels d'offres et Développement commercial.

Direction visuelle à vérifier sur prototype :
- barre supérieure discrète et compacte ;
- éviter les grands panneaux sombres opaques ;
- sous-menus lisibles, contrastés, avec accents de couleur par famille ;
- profondeur 3D et effets de matière maîtrisés, sans nuire à la lisibilité ;
- identité bleu nuit, or et chrome réservée aux éléments qui la justifient ;
- hamburger mobile toujours visible, menu accessible au tactile et au clavier ;
- parent de groupe ouvrant le sous-menu, sous-liens assurant la navigation.

## 3. Espace de travail

L'espace connecté doit devenir le poste de travail de l'entreprise, distinct du CRM interne MajestiOS.

Structure cible :
- **Vue d'ensemble** : activité, actions à faire, devis en attente, factures à échéance et alertes.
- **Développement** : opportunités, appels d'offres, prospection et veille.
- **Clients** : entreprises, contacts et historique.
- **Opérations** : devis, interventions/chantiers, agenda et documents.
- **Facturation** : factures, avoirs, règlements, rejets et transmission PA.
- **Réseau** : partenaires et services connectés.
- **Cheexpeer** : assistant, missions et validations.

Les cartes de l'espace membre actuel sont des aperçus de produit ; elles ne doivent pas être converties en boutons actifs tant que les parcours backend ne sont pas prêts.

## 4. Deux parcours de démarrage

### Parcours A — le client possède déjà un CRM
1. Diagnostic de ses outils et besoins.
2. Choix des services MajestiOS utiles.
3. Identification des possibilités de connexion de son CRM.
4. Choix d'une PA et vérification de compatibilité, si facturation électronique demandée.
5. Mise en place de connecteurs ou d'un flux structuré de remplacement.
6. Accompagnement sans migration imposée.

### Parcours B — le client souhaite adopter MajestiOS CRM
1. Création et vérification du compte.
2. Création sécurisée de son organisation.
3. Configuration guidée des informations de l'entreprise.
4. Import facultatif des clients et contacts.
5. Première action : créer une fiche, un devis ou une tâche.
6. Activation progressive des modules.

Le parcours ne sera ouvert qu'après recette Auth et RLS.

## 5. Parcours métier de référence

**Prospection → client qualifié → devis → intervention → facture → transmission PA → paiement → archivage → suivi Cheexpeer.**

Chaque étape doit conserver les références des objets précédents et éviter la ressaisie. Les changements de statut doivent être historisés.

## 6. Principes d'accessibilité et d'ergonomie

- priorité mobile pour les usages terrain ;
- libellés simples, langage métier compréhensible ;
- actions principales visibles, actions secondaires regroupées ;
- états vides utiles, jamais des tableaux vides incompréhensibles ;
- erreurs expliquant la cause et l'action possible ;
- confirmation avant suppression ou action engageante ;
- navigation clavier et lecteur d'écran ;
- contraste conforme et taille de cible adaptée au tactile ;
- indicateurs de statut cohérents entre les modules.

## 7. Ordre des prototypes

1. Prototype de la page d'accueil et de la navigation.
2. Prototype du tableau de bord client.
3. Prototype du parcours client/devis/intervention.
4. Prototype du module Facturation.
5. Prototype de connexion CRM externe et PA.
6. Prototype du centre de commande Cheexpeer.

Chaque prototype sera confronté à des tâches réelles du premier cercle de 5 à 7 personnes. Le prototype ne sera pas connecté à des données réelles avant validation de la sécurité.


## 8. Avancement du premier prototype — 11 novembre 2026

Une première version de la vitrine Evolution-8 est construite dans `index.html` et `homepage-evolution-8.css`. Elle :
- introduit l'ambition CRM tout-en-un en distinguant les outils actuels des modules en préparation ;
- présente les trois parcours : conserver son CRM, adopter le CRM MajestiOS, préparer facturation/dématérialisation ;
- conserve le moteur de recherche existant via `#home-search-mount` ;
- garde les appels d'offres et le développement commercial comme porte d'entrée actuelle ;
- présente un aperçu conceptuel explicitement signalé comme non connecté.

La navigation partagée a reçu une première couche de style Evolution-8 : barre transparente, onglets colorés, menus déroulants clairs, hamburger mobile préservé et lien VIP conservé. Le sous-parcours « Facturation électronique & dématérialisation » est maintenant présent dans les menus Appels d'offres et Développement commercial. La page `facturation-electronique.html` expose le calendrier réglementaire, le rôle des PA et le statut réel du projet ; elle est publiée dans le manifeste `site-files.json`.

**État de recette :**
- Build Vercel de prévisualisation : réussi, 81 fichiers vérifiés (dont la nouvelle page facturation électronique).
- Tests de contrat et tests navigateur : non confirmés sur ce commit.
- Inspection visuelle desktop/mobile : à réaliser sur la prévisualisation.
- Tests de non-régression des moteurs, formulaires et espaces protégés : à réaliser avant extension à d'autres pages.

La première validation attendue porte sur le rendu desktop/mobile, la lisibilité des menus sur fonds clairs et foncés, la visibilité du hamburger, l'accès VIP et la conservation du moteur de recherche. Aucune mise en production n'est autorisée par ce lot.


## 9. Prévention des régressions de navigation

Le contrat statique `verify-architecture.js` et le test navigateur `tests/navigation-classique.browser.cjs` doivent toujours valider le même menu. Après l'ajout de la rubrique facturation électronique, le menu compte 20 entrées secondaires et 18 destinations uniques. Le vérificateur statique a été corrigé sur Evolution-8 pour refléter ce contrat et exiger la présence de `facturation-electronique.html` parmi les routes fonctionnelles. La recette CI post-correction reste à confirmer.
