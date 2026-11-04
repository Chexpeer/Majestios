# MajestiOS 5.0 — dossier de référence

**Statut :** branche de travail stratégique et technique ; le cadrage reste soumis à la confrontation des documents, du code et des décisions récentes du fondateur.  
**Branche de travail :** `evolution-5.0`  
**Patrimoine :** `evolution-3.0` est conservée intacte comme référence ; la documentation 2.0 et les archives historiques restent consultables.  
**Évolution 4.0 :** la documentation attendue n'est pas présente dans ce checkout. Elle reste nécessaire pour établir la filiation fonctionnelle demandée ; aucune décision V4 n'est présumée.

## Intention

Construire une nouvelle génération de MajestiOS comme **ascenseur stratégique des PME** : un environnement de développement commercial intelligent, immersif et évolutif. La plateforme associe données, méthodes, services, accompagnement humain, CRM, Business Intelligence, mémoire, IA transversale et amélioration continue.

La vision ne se réduit ni à un moteur d'annonces, ni à un tableau de bord, ni à une image d'accueil cliquable. L'expérience immersive, le quartier d'affaires, l'immeuble, ses espaces intérieurs et l'ascenseur forment un parcours cohérent au service de l'arborescence métier.

## Documents de référence

1. [Référence MajestiOS V.5](MAJESTIOS-V5-REFERENCE.md) — document maître et source canonique.
2. [Audit de conformité de l'architecture et des liens](AUDIT-CONFORMITE-ARCHITECTURE-ET-LIENS.md) — état du dépôt, routes et contrôles vérifiés.
3. [Audit du lot 2 — conformité fonctionnelle et navigation](AUDIT-LOT-2-NAVIGATION-FONCTIONNELLE.md) — parcours de second niveau, défauts observés, corrections et limites de recette.
4. [Audit du lot 3 — fonctionnalités des rubriques](AUDIT-LOT-3-FONCTIONNALITES.md) — état par rubrique, défaut corrigé, fonctions simulées et travaux restant à développer.
5. [Audit du lot 4 — moteur de recherche transversal](AUDIT-LOT-4-MOTEUR-RECHERCHE.md) — sources, filtres, pertinence, limites de couverture et état de préparation CRM.
6. [Audit du lot 5 — architecture CRM et capitalisation](AUDIT-LOT-5-ARCHITECTURE-CRM-CAPITALISATION.md) — modèle conceptuel proposé, données par source, écarts, cloisonnement et arbitrages avant persistance.
7. [Vision fondatrice](VISION-FONDATRICE.md) — promesse, doctrine et principes.
8. [Arborescence cible V5](ARBORESCENCE-CIBLE-V5.md) — destinations, dossiers, pages et fonctions transversales.
9. [Expérience immersive et immeuble](EXPERIENCE-IMMERSIVE-ET-ETAGES.md) — quartier, panorama, ascenseur, étages et navigation.
10. [Architecture fonctionnelle cible](ARCHITECTURE-FONCTIONNELLE-CIBLE.md) — domaines, frontières et données.
11. [Vision IA transversale](VISION-IA-TRANSVERSALE.md) — rôles spécialisés, orchestration, proactivité et gouvernance.
12. [Mémoire conversationnelle et IA](MEMOIRE-CONVERSATIONNELLE-ET-IA.md) — conservation, recherche et réutilisation contrôlée.
13. [Module Administration piloté par l'IA](MODULE-ADMIN-IA.md) — cockpit, supervision, SEO, maintenance et autonomie encadrée.
14. [Roadmap et gouvernance](ROADMAP-ET-GOUVERNANCE.md) — phases, critères de sortie et autonomie.
15. [Audit du panorama et trajectoire 3D](AUDIT-PANORAMA-ET-PLAN-3D.md) — état réel du prototype et limites vérifiées.
16. [Audit initial et plan de nettoyage](AUDIT-INITIAL-ET-PLAN-NETTOYAGE.md) — constats datés et écarts historiques à revalider.
17. [Nettoyage documentaire](NETTOYAGE-DOCUMENTAIRE.md) — inventaire, règles de tri et conservation du patrimoine.

Les documents 3 à 14 sont des compléments de sujet. Ils ne constituent pas des sources de décision concurrentes à la référence centrale.

## Règles de lecture

- **Fait observé** : confirmé dans le code ou une preuve consultée.
- **Acquis à préserver** : fonctionnalité ou contenu existant dont la valeur doit être évaluée.
- **Décision fondatrice** : orientation explicitement exprimée par le porteur du projet.
- **Proposition** : piste à étudier, non validée.
- **À arbitrer** : point qui nécessite une décision.
- **À vérifier** : affirmation qui demande une preuve technique, juridique, commerciale ou utilisateur.

Aucun document de cadrage ne prouve qu'une fonctionnalité est développée ou opérationnelle.

## Protection du patrimoine et méthode

La V5 est construite sur une branche indépendante. La branche `evolution-3.0` n'est pas modifiée par les travaux V5. Les suppressions, déplacements, fusions et changements irréversibles sont précédés d'un inventaire des dépendances et d'un point de retour. Aucun merge ou déploiement de production sans accord explicite du fondateur.

Le nettoyage suit cinq traitements : conserver, corriger, regrouper, archiver ou retirer. Une fonction métier n'est jamais supprimée au seul motif qu'elle n'est pas encore opérationnelle ou qu'elle n'apparaît pas comme destination de premier niveau.

## État des ressources visuelles au 4 novembre 2026

Les six visuels publiés dans la branche sont :
- `Majestios.immeuble.jpg` — image interactive de l'accueil ;
- `Majestios.developpement-commercial.jpg` — fond de Développement commercial ;
- `Marché-Public-.webp` — fond de Marchés publics ;
- `Prospection-.webp` — fond de Prospection ;
- `Marcheprive.webp` — fond de Marchés privés ;
- `Reseau.webp` — fond de Réseau.

Les originaux `Majestios.immeuble.jfif` et `devellopement.jfif` sont conservés à leur définition native ; les JPEG publiés sont des dérivés optimisés sans agrandissement. Le libellé erroné « ACTINELL » a été remplacé par « ACCUEIL » dans les dérivés. Les contrôles de rendu et de recadrage doivent être vérifiés sur desktop et mobile.

## Architecture de navigation — principes à préserver

Les destinations visibles sont des portes d'entrée vers des dossiers réels, pas la totalité des capacités de la plateforme. Recherche, CRM, Business Intelligence, MajestiOS V.5, mémoire, administration, orchestration et SEO sont des fonctions transversales ou des sous-parcours. Les pages de veille, accompagnement AO, BODACC, sous-traitance, qualification, salons et séminaires, suivi commercial, vision, recrutement, FAQ et pages légales doivent être rattachées correctement ; leur absence du panorama ne justifie pas leur suppression.

Le principe « le schéma reflète l'arborescence » est non négociable. La navigation spatiale doit préserver le rôle de l'ascenseur et la cohérence entre destination, dossier, page, étage éclairé et position de l'ascenseur. Une image statique munie de zones approximatives ne constitue pas à elle seule l'expérience immersive cible.

## Points à ne pas figer prématurément

Toute évolution récente du fondateur peut rouvrir un sujet précédemment documenté comme acquis. Le nom, le périmètre et les relations des modules d'intelligence doivent être traités selon les échanges les plus récents et inscrits dans le registre des décisions ; ne pas clore un débat stratégique par une phrase isolée d'un document antérieur.
