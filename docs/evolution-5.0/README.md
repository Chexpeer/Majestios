# MajestiOS 5.0 — dossier de référence

**Statut :** architecture fonctionnelle V5 en évolution ; les huit destinations visibles d’Ambisios constituent la référence de travail, sous réserve de validation finale des zones cliquables et des routes.  
**Branche de travail :** `evolution-5.0`  
**Base :** branche `evolution-3.0`, conservée comme patrimoine de référence.  
**Évolution 4.0 :** mise en standby ; ses documents sont des sources à examiner, pas des décisions automatiquement reprises.

## Intention

Construire une nouvelle génération de MajestiOS autour de la promesse :

> **MajestiOS — l'ascenseur stratégique des PME.**  
> **Donner de la hauteur à vos ambitions.**  
> *MajestiOS, pour une ascension magique et exponentielle.*

La V5 doit associer une expérience immersive, un développement commercial intelligent, une mémoire durable et contrôlée, un CRM nativement intelligent, la Business Intelligence et une capacité d'amélioration continue.

## Documents de ce dossier

0. [Audit initial et plan de nettoyage](AUDIT-INITIAL-ET-PLAN-NETTOYAGE.md) — constats V3/V4/V5, revue des PR de modularisation et lots proposés.

1. [Vision fondatrice](VISION-FONDATRICE.md) — promesse, doctrine et principes.
2. [Arborescence cible V5](ARBORESCENCE-CIBLE-V5.md) — nomenclature Ambisios, rattachement des pages et écarts à corriger.
3. [Expérience immersive et immeuble](EXPERIENCE-IMMERSIVE-ET-ETAGES.md) — panorama, ascenseur, étages et navigation.
4. [Vision IA transversale](VISION-IA-TRANSVERSALE.md) — rôles spécialisés, orchestration, proactivité, apprentissage contrôlé et gouvernance.
5. [Mémoire conversationnelle et IA](MEMOIRE-CONVERSATIONNELLE-ET-IA.md) — conservation, recherche et réutilisation contrôlée des discussions.
6. [Architecture fonctionnelle cible](ARCHITECTURE-FONCTIONNELLE-CIBLE.md) — domaines, frontières et données.
7. [Roadmap et gouvernance](ROADMAP-ET-GOUVERNANCE.md) — phases, validation et autonomie.
8. [Module Administration piloté par l'IA](MODULE-ADMIN-IA.md) — cockpit, supervision, SEO, maintenance et autonomie encadrée.
9. [Nettoyage documentaire](NETTOYAGE-DOCUMENTAIRE.md) — inventaire, règles de tri et conservation du patrimoine.

## Règles de lecture

- **Fait observé** : confirmé dans le code ou une preuve consultée.
- **Acquis à préserver** : fonctionnalité ou contenu existant dont la valeur doit être évaluée.
- **Proposition** : piste à étudier, non validée.
- **Décision fondatrice** : orientation explicitement exprimée par le porteur du projet.
- **À arbitrer** : point qui nécessite une décision.
- **À vérifier** : affirmation qui demande une preuve technique, juridique, commerciale ou utilisateur.

Aucun document de cadrage ne prouve qu'une fonctionnalité est développée ou opérationnelle.

## Protection du patrimoine

La V5 est construite sur une branche indépendante. La branche `evolution-3.0` n'est pas modifiée par les travaux V5. Aucun nettoyage destructif, renommage global, suppression de fonctionnalité, fusion ou déploiement de production ne doit être effectué sans audit et autorisation explicite.

## Statut des décisions

Le panorama de référence de l’accueil est `Ambisios.webp`. Quatre fonds de rubrique sont présents : `Développement-.webp`, `Marché-Public-.webp`, `Prospection-.webp` et `Marcheprive.webp`. Leur présence dans le dépôt ne certifie pas encore la validation visuelle de leur affectation ni leur rendu sur toutes les pages. Les huit destinations visibles sont Espace privé, Réseau, Développement commercial, Prospection, Marchés publics, Marchés privés, Réputation virtuelle et Accueil. Recherche, CRM, Business Intelligence et MajestiOS V.5 sont transversaux : ils ne constituent pas des étages supplémentaires. Le principe « le schéma reflète l’arborescence » demeure non négociable.


## Mise à jour d’architecture — 4 novembre 2026

- `Ambisios.webp` est le panorama de l’accueil.
- Quatre fonds de rubrique sont présents et déclarés dans le manifeste : `Développement-.webp`, `Marché-Public-.webp`, `Prospection-.webp` et `Marcheprive.webp` (Marchés privés).
- Les huit destinations Ambisios disposent d’un lien SVG direct ; les contrôles navigateur desktop/mobile doivent confirmer les zones.
- Les destinations visibles sont limitées aux huit intitulés de référence. Les fonctions transversales ne doivent pas devenir des étages supplémentaires.
- Les cinq ressources WebP actuellement présentes sont `Ambisios.webp` et les quatre fonds de rubrique listés ci-dessus. Toute suppression supplémentaire exige une vérification des références, de la valeur visuelle et de l'historique.
- Les coordonnées interactives, l’éclairage et la position de l’ascenseur restent à vérifier ensemble contre l’image réelle ; cette mise à jour documentaire ne certifie pas leur recette.
- Le filtre géographique du moteur est spécifié comme « département » dans la cible ; son implémentation effective sur chaque source reste à valider.
