# MajestiOS 5.0 — dossier de référence

**Statut :** référentiel stratégique et technique de la version 5.0 ; référence centrale consolidée le 5 novembre 2026 sur le commit audité `735a09c`. Les décisions restent soumises aux validations du porteur du projet.  
**Branche de travail :** `evolution-5.0`  
**Filiation :** voir [Filiation documentaire V2 → V5](FILIATION-DOCUMENTAIRE-V2-A-V5.md). Les sources V2, V3 et V4 restent sur leurs branches respectives et ne sont pas recopiées dans ce dossier.

## Intention

Construire une nouvelle génération de MajestiOS comme **ascenseur stratégique des PME** : un environnement de développement commercial intelligent, immersif et évolutif. La plateforme associe données, méthodes, services, accompagnement humain, CRM, Business Intelligence, mémoire, intelligence centrale, administration, SEO et amélioration continue.

La vision ne se réduit ni à un moteur d'annonces, ni à un tableau de bord, ni à une image d'accueil cliquable. L'expérience immersive, le quartier d'affaires, l'immeuble, ses espaces intérieurs et l'ascenseur forment un parcours cohérent au service de l'arborescence métier.


## État de référence au 5 novembre 2026

La référence canonique `MAJESTIOS-V5-REFERENCE.md` a été actualisée à partir de l'audit du commit `735a09ce0b5c476ff659558060791b34a628b6ac`. Elle distingue les fonctions réellement présentes, les contrôles CI exécutés, les limites du prototype et les capacités qui restent à construire. Le run GitHub Actions `41936795822` a réussi les contrôles listés dans l'addendum de la référence ; cela ne vaut pas validation exhaustive du dépôt ni preuve de mise en production.

**MajestiOS V.5 reste l'intelligence centrale unique.** MajestiOS V.5 assure le suivi du référencement naturel et pilote l'amélioration continue de la plateforme.

## Guide de reprise pour les IA

[Guide autonome de reprise IA — MajestiOS V.5](GUIDE-REPRISE-IA-MAJESTIOS-V5.md) : vision, terminologie, arborescence, état réel du code, preuves CI, gouvernance, limites de données et méthode de reprise. À lire après la référence canonique.

## Documents de référence

1. [Référence MajestiOS V.5](MAJESTIOS-V5-REFERENCE.md) — document maître et source canonique.
2. [Filiation documentaire V2 → V5](FILIATION-DOCUMENTAIRE-V2-A-V5.md) — sources versionnées, continuité des décisions, changements et retrait des copies historiques de V5.
3. [Audit de conformité de l'architecture et des liens](AUDIT-CONFORMITE-ARCHITECTURE-ET-LIENS.md) — état du dépôt, routes, rectificatifs et contrôles vérifiés.
4. [Audit du lot 2 — conformité fonctionnelle et navigation](AUDIT-LOT-2-NAVIGATION-FONCTIONNELLE.md) — parcours de second niveau, défauts observés, corrections et limites de recette.
5. [Audit du lot 3 — fonctionnalités des rubriques](AUDIT-LOT-3-FONCTIONNALITES.md) — état par rubrique, défaut corrigé, fonctions simulées et travaux restant à développer.
6. [Audit du lot 4 — moteur de recherche transversal](AUDIT-LOT-4-MOTEUR-RECHERCHE.md) — sources, filtres, pertinence, limites de couverture et état de préparation CRM.
7. [Audit du lot 5 — architecture CRM et capitalisation](AUDIT-LOT-5-ARCHITECTURE-CRM-CAPITALISATION.md) — modèle conceptuel proposé, données par source, écarts, cloisonnement et arbitrages avant persistance.
8. [Audit du lot 6 — parcours de conversion, formulaires et CRM](AUDIT-LOT-6-PARCOURS-FORMULAIRES-CRM.md) — état réel des formulaires, espace membre, résultats, CRM et tunnel de conversion.
9. [Vision fondatrice](VISION-FONDATRICE.md) — promesse, doctrine et principes.
10. [Arborescence cible V5](ARBORESCENCE-CIBLE-V5.md) — destinations, dossiers, pages et fonctions transversales.
11. [Expérience immersive et immeuble](EXPERIENCE-IMMERSIVE-ET-ETAGES.md) — quartier, panorama, ascenseur, étages et navigation.
12. [Architecture fonctionnelle cible](ARCHITECTURE-FONCTIONNELLE-CIBLE.md) — domaines, frontières et données.
13. [Vision IA transversale](VISION-IA-TRANSVERSALE.md) — intelligence centrale, capacités spécialisées, orchestration, proactivité et gouvernance.
14. [Mémoire conversationnelle et IA](MEMOIRE-CONVERSATIONNELLE-ET-IA.md) — conservation, recherche et réutilisation contrôlée.
15. [Module Administration piloté par l'IA](MODULE-ADMIN-IA.md) — cockpit, supervision, SEO, maintenance et autonomie encadrée.
16. [Architecture des espaces Administration, CRM et Client](ARCHITECTURE-ESPACES-ADMIN-CRM-CLIENT.md) — séparation des espaces, navigation, CRM intégré, habilitations et état du premier cockpit.
16. [Roadmap et gouvernance](ROADMAP-ET-GOUVERNANCE.md) — phases, critères de sortie et autonomie.
17. [Audit du panorama et trajectoire 3D](AUDIT-PANORAMA-ET-PLAN-3D.md) — état réel du prototype et limites vérifiées.
18. [Audit initial et plan de nettoyage](AUDIT-INITIAL-ET-PLAN-NETTOYAGE.md) — constats datés et écarts historiques à revalider.
19. [Nettoyage documentaire](NETTOYAGE-DOCUMENTAIRE.md) — inventaire, règles de tri et conservation du patrimoine.
20. [Audit technique indépendant — source Claude](AUDIT-TECHNIQUE-CLAUDE-2026-11-05.md) — contrôles déclarés, limites de l’analyse, anomalies, points positifs et recommandations de consolidation.
21. [Cahier des charges — veille stratégique](CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md) — cadrage des signaux économiques, ressources, emploi, immobilier professionnel et raccordement au ciblage commercial.
22. [Maintenance, sauvegardes et continuité](MAINTENANCE-ET-CONTINUITE.md) — méthode permanente de nettoyage Git, points de retour, vérifications, documentation et reprise.

Les documents complémentaires précisent des sujets. Ils ne constituent pas des sources de décision concurrentes à la référence centrale.

## Règles de lecture

- **Fait observé** : confirmé dans le code ou une preuve consultée.
- **Acquis à préserver** : fonctionnalité ou contenu existant dont la valeur doit être évaluée.
- **Décision fondatrice** : orientation explicitement exprimée par le porteur du projet.
- **Proposition** : piste à étudier, non validée.
- **À arbitrer** : point qui nécessite une décision.
- **À vérifier** : affirmation qui demande une preuve technique, juridique, commerciale ou utilisateur.

Aucun document de cadrage ne prouve qu'une fonctionnalité est développée ou opérationnelle.

## Protection du patrimoine et méthode

Le protocole opérationnel détaillé est [Maintenance, sauvegardes et continuité](MAINTENANCE-ET-CONTINUITE.md). Il s'applique à chaque lot, y compris aux interventions documentaires : état initial identifié, point de retour, diff contrôlé, tests réellement exécutés et mise à jour des références.

La V5 est construite sur une branche indépendante. Les branches historiques restent intactes et ne sont pas modifiées par les travaux V5. Les suppressions, déplacements, fusions et changements irréversibles sont précédés d'un inventaire des dépendances et d'un point de retour. Aucun merge ou déploiement de production sans accord explicite du fondateur.

Le nettoyage suit cinq traitements : conserver, corriger, regrouper, archiver ou retirer. Une fonction métier n'est jamais supprimée au seul motif qu'elle n'est pas encore opérationnelle ou qu'elle n'apparaît pas comme destination de premier niveau.

## État des ressources visuelles publiées — contrôle du 5 novembre 2026

Le manifeste courant `site-files.json` déclare trois ressources graphiques pour l'accueil :

- `IMMEUBLE.jfif` — photographie de référence de l'immeuble interactif ;
- `Designer (2).png` — décor général de l'accueil ;
- `immeuble-masque.png` — masque de détourage de la tour.

Ces trois fichiers sont présents dans le manifeste de publication et leurs références sont contrôlées par `verify-architecture.js`. Les anciennes ressources listées dans les notes visuelles antérieures du 4 novembre (`Majestios.immeuble.jpg`, `Majestios.developpement-commercial.jpg`, `Marché-Public-.webp`, `Prospection-.webp`, `Marcheprive.webp`, `Reseau.webp`) ne constituent plus la liste des actifs publiés par le manifeste courant. Ne pas les réintroduire ni les supprimer du patrimoine sans vérifier d'abord leurs références et leur rôle historique.

Le contrôle du manifeste confirme les fichiers déclarés ; il ne remplace pas une recette visuelle du rendu et du recadrage sur desktop et mobile. L'image de l'immeuble et ses zones interactives ne doivent pas être modifiées lors d'une correction de navigation ou de contenu sans demande explicite.

## Architecture de navigation — principes à préserver

Les destinations visibles sont des portes d'entrée vers des dossiers réels, pas la totalité des capacités de la plateforme. Recherche, CRM, Business Intelligence, MajestiOS V.5, mémoire, administration, orchestration et SEO sont des fonctions transversales ou des sous-parcours. Les pages de veille, accompagnement AO, BODACC, sous-traitance, qualification, salons et séminaires, suivi commercial, vision, recrutement, FAQ et pages légales doivent être rattachées correctement ; leur absence du panorama ne justifie pas leur suppression.

Le principe « le schéma reflète l'arborescence » est non négociable. La navigation spatiale doit préserver le rôle de l'ascenseur et la cohérence entre destination, dossier, page, étage éclairé et position de l'ascenseur. Une image statique munie de zones approximatives ne constitue pas à elle seule l'expérience immersive cible.

## Points à ne pas figer prématurément

Toute évolution récente du fondateur peut rouvrir un sujet précédemment documenté comme acquis. Le nom, le périmètre et les relations des capacités d'intelligence doivent être traités selon les échanges les plus récents et inscrits dans le registre des décisions ; ne pas clore un débat stratégique par une phrase isolée d'un document antérieur.
