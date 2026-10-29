# MajestiOS — Arborescence fonctionnelle V1

## Objectif

Organiser le produit en six univers compréhensibles. Chaque univers dispose d'une page d'accueil métier, de quelques portes d'entrée visibles au premier niveau, puis de sous-dossiers fonctionnels. La profondeur doit correspondre à un vrai besoin : aucun niveau ne doit être créé uniquement pour multiplier les pages.

La navigation latérale globale reste stable d'un univers à l'autre. L'identité de chaque univers est signalée par un arrière-plan doux différent, sans modifier les règles d'usage ni les composants communs.

## Les six univers

### 1. Opportunités — bleu
**Route racine :** `/opportunites`  
**Module de navigation :** `src/data/navigation/opportunities.ts`  
**Sous-dossiers :**
- Marchés publics — recherche, filtres métier, territoire, détail d'une consultation et préparation d'une réponse.
- Marchés privés — consultations autorisées, secteur, dépôt d'annonce lorsque le formulaire sera activé.
- Salons professionnels — calendrier, région, secteur, fiche d'événement et préparation d'une visite.
- Emploi et missions — offres, métiers, missions et conseils, en distinguant les fonctions actives des parcours en préparation.

### 2. Business / intelligence économique — sable
**Route racine :** `/business`  
**Module :** `src/data/navigation/business.ts`  
**Portes d'entrée :**
- Intelligence entreprises : contexte et informations recoupées.
- Veille BODACC : créations, modifications, procédures et transmissions, sans déduire automatiquement un besoin commercial.
- Achat et cession : préparation d'une reprise, d'une vente et éléments d'évaluation.
- Diagnostic : objectifs, situation, données manquantes et priorités.

### 3. Développement commercial — vert
**Route racine :** `/developpement-commercial`  
**Module :** `src/data/navigation/commercial-development.ts`  
**Sous-dossiers :**
- Prospection : ciblage, argumentaires, suivi.
- Études de marché : méthodologie, sources et limites.
- E-réputation : surveillance et traitement professionnel des avis.
- Accompagnement aux appels d'offres : éligibilité, pièces, critères, délais et préparation.
- Autres méthodes de développement commercial, uniquement lorsqu'elles ont une fonction clairement définie.

### 4. Réseaux professionnels — violet
**Route racine :** `/reseaux`  
**Module :** `src/data/navigation/networks.ts`  
**Portes d'entrée :**
- Annuaire professionnel (à signaler en préparation tant que les accès et données ne sont pas prêts).
- Rejoindre le réseau.
- Rencontres et complémentarités, à approfondir si un parcours métier réel le justifie.

### 5. Comprendre MajestiOS — gris bleuté
**Route racine :** `/comprendre`  
**Module :** `src/data/navigation/understanding.ts`  
**Portes d'entrée :**
- Concept et doctrine.
- FAQ.
- Glossaire.
Les pages explicatives sont séparées des pages opérationnelles.

### 6. Services transversaux — neutre
**Module :** `src/data/navigation/general.ts`  
**Pages :** espace professionnel, confidentialité, mentions légales. Ces liens restent accessibles sans encombrer les cinq univers métier.

## Règles de profondeur

1. La page racine d'un univers explique sa finalité et propose des portes d'entrée différentes, avec des descriptions et des actions concrètes.
2. Un sous-dossier est justifié par une tâche, une catégorie de données ou une étape de parcours distincte.
3. Une page de détail apporte un contenu propre à son objet. Un titre changé au-dessus d'un guide générique ne suffit pas.
4. Les composants communs (navigation, fil d'Ariane, cartes, états de préparation) peuvent être partagés ; le contenu métier et les actions ne doivent pas être artificiellement uniformisés.
5. Tout clic important mène à une route explicite. Les ancres vers une section de la page courante ne remplacent pas une destination métier.
6. Chaque page doit indiquer clairement ce qui est actif, ce qui est méthodologique et ce qui est encore en préparation.
7. Les données doivent garder leur provenance, leur date et leurs limites. Une hypothèse n'est jamais présentée comme un besoin confirmé.

## Règles d'identité visuelle

- Opportunités : bleu pâle.
- Business : sable / doré très pâle.
- Développement commercial : vert pâle.
- Réseaux : violet pâle.
- Comprendre : gris bleuté.
- Services transversaux : fond neutre.

Les arrière-plans sont des repères de contexte, pas des thèmes graphiques indépendants. Typographie, contraste, boutons, navigation et règles d'accessibilité restent communs.

## Structure du code

- `src/data/navigation/` contient un module par univers et le contrat commun `types.ts`.
- `src/data/site-tree.ts` assemble les modules ; il ne doit pas redevenir un catalogue monolithique.
- `src/app/<univers>/page.tsx` porte la page racine métier.
- Les sous-routes sont rangées sous le dossier du domaine correspondant.
- Les composants communs restent dans `src/components/`, mais une page métier substantielle doit conserver son propre contenu.

## Ordre de consolidation

1. Stabiliser les imports, les tests, le lint, le typage et le build.
2. Vérifier les destinations de tous les liens et la cohérence entre arborescence déclarée et routes réelles.
3. Remplacer progressivement les hubs génériques des pages importantes par des contenus métier dédiés, en commençant par les parcours les plus centraux.
4. Contrôler la navigation latérale et le panneau mobile.
5. Vérifier le flux d'annonces unique, la lisibilité des catégories et l'absence de chevauchement.
6. Ne déployer en production qu'après validation explicite.

## Limites de cette version

Ce document décrit la structure cible et l'état du code au moment de sa rédaction. Il ne signifie pas que tous les connecteurs, annuaires, dépôts ou automatismes sont déjà opérationnels. Les statuts doivent rester visibles jusqu'à activation et vérification réelles.
