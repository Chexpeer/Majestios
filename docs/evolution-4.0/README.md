# Dossier de référence — MajestiOS 4.0

Ce dossier constitue la référence de cadrage et de suivi de l'évolution 4.0. La branche `evolution-4.0` est la ligne de développement active. Les fonctionnalités sont livrées progressivement et ne sont déclarées opérationnelles qu'après vérification.

## Documents

1. [Audit MajestiOS 3.0](AUDIT-MAJESTIOS-3.0.md) — état du dépôt, capacités réellement présentes, branches, PR, tests, écarts et limites.
2. [Vision et architecture cible MajestiOS 4.0](VISION-ET-ARCHITECTURE-MAJESTIOS-4.0.md) — doctrine produit, domaines fonctionnels, BrainIOS, Réputation virtuelle, SEO et sécurité.
3. [Roadmap MajestiOS / BrainIOS 4.0](ROADMAP-MAJESTIOS-BRAINIOS-4.0.md) — phases, dépendances, lots et jalons de validation.
4. [BrainIOS — API OpenAI et cockpit admin](BRAINIOS-API-ET-ESPACE-ADMIN.md) — intégration API, espace de pilotage et évolution du produit depuis l'administration.
5. [Fondations du back-office 4.0](FONDATIONS-BACK-OFFICE-4.0.md) — ergonomie, architecture modulaire, sécurité, modèle de données et séquence de réalisation.
6. [Registre des observations techniques](REGISTRE-OBSERVATIONS-TECHNIQUES-4.0.md) — observations techniques converties en tâches et preuves attendues.
7. [Mission de contre-audit IA](MISSION-CONTRE-AUDIT-IA.md) — consignes facultatives de revue technique externe.

## Référence de code

- Socle de départ : `evolution-3.0`.
- Branche de développement active : `evolution-4.0`.
- Les PR héritées ne sont ni fusionnées ni retargetées sans cartographie.
- Aucun déploiement en production n'a été effectué.

## Statut

La version 4.0 est engagée. Un premier prototype ergonomique du cockpit admin est isolé dans `admin/` et exclu du build public ; il ne comporte encore aucun service connecté. La vision du porteur du projet guide les choix produit ; les observations techniques externes sont traitées comme des contrôles d'ingénierie. L'espace admin et BrainIOS constituent le poste de pilotage des évolutions à venir.

Le porteur du projet pilotera les évolutions depuis l'espace admin. BrainIOS utilisera une API OpenAI payante dédiée, appelée côté serveur avec une clé conservée dans les secrets d'environnement. Les budgets et coûts API seront suivis séparément de l'abonnement ChatGPT.

## Chantiers transversaux

- **SEO & visibilité** : surveillance et optimisation continue par BrainIOS.
- **Qualité** : build, tests, liens, architecture et anti-régression.
- **Sécurité** : authentification réelle, permissions serveur, secrets et audit.
