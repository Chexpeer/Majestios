# MajestiOS 5.0 — dossier de référence

**Statut :** référentiel stratégique et technique de la version 5.0 ; référence centrale consolidée le 5 novembre 2026 sur le commit audité `735a09c`. Les décisions restent soumises aux validations du porteur du projet.  
**Branche de travail :** `evolution-5.0`  
**Filiation :** voir [Filiation documentaire V2 → V5](FILIATION-DOCUMENTAIRE-V2-A-V5.md). Les sources V2, V3 et V4 restent sur leurs branches respectives et ne sont pas recopiées dans ce dossier.

## Intention

Construire une nouvelle génération de MajestiOS comme **ascenseur stratégique des PME** : un environnement de développement commercial intelligent, immersif et évolutif. La plateforme associe données, méthodes, services, accompagnement humain, CRM, Business Intelligence, Cheexpeer (identité de l'IA intégrée), mémoire, administration, SEO et amélioration continue.

La vision ne se réduit ni à un moteur d'annonces, ni à un tableau de bord, ni à une image d'accueil cliquable. L'expérience immersive, le quartier d'affaires, l'immeuble, ses espaces intérieurs et l'ascenseur forment un parcours cohérent au service de l'arborescence métier.


## État de référence au 5 novembre 2026

La référence canonique `MAJESTIOS-V5-REFERENCE.md` a été actualisée à partir de l'audit du commit `735a09ce0b5c476ff659558060791b34a628b6ac`. Elle distingue les fonctions réellement présentes, les contrôles CI exécutés, les limites du prototype et les capacités qui restent à construire. Le run GitHub Actions `41936795822` a réussi les contrôles listés dans l'addendum de la référence ; cela ne vaut pas validation exhaustive du dépôt ni preuve de mise en production.

**Cheexpeer est le nom retenu pour l’IA intégrée à MajestiOS.** Son activation est différée pendant la préparation des fondations. À terme, elle assurera notamment la surveillance, l’analyse, les rapports, les alertes et le scoring explicable des opportunités ; elle pourra également contribuer au suivi du référencement naturel.

## Guide de reprise pour les IA

[Dossier de reprise IA — CRM, Supabase et Prospection](DOSSIER-REPRISE-IA-CRM-SUPABASE-PROSPECTION-2026-11-08.md) : état détaillé du CRM, du backend hébergé, des migrations, des fonctions Edge, des tests Auth/RLS, des écarts de sécurité et des lots restant à réaliser. À consulter pour tout travail backend/CRM.

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
13. [Vision IA transversale](VISION-IA-TRANSVERSALE.md) — Cheexpeer, missions futures, capacités spécialisées, surveillance, analyse, scoring et gouvernance.
14. [Mémoire conversationnelle et IA](MEMOIRE-CONVERSATIONNELLE-ET-IA.md) — conservation, recherche et réutilisation contrôlée.
15. [Module Administration piloté par l'IA](MODULE-ADMIN-IA.md) — cockpit, supervision, SEO, maintenance et autonomie encadrée.
16. [Architecture des espaces Administration, CRM et Client](ARCHITECTURE-ESPACES-ADMIN-CRM-CLIENT.md) — séparation des espaces, navigation, CRM intégré, habilitations et état du premier cockpit.
16. [Roadmap et gouvernance](ROADMAP-ET-GOUVERNANCE.md) — phases, critères de sortie et autonomie.
 [Plan stratégique acquisition, circulation, CRM et IA — 8 novembre 2026](PLAN-STRATEGIQUE-ACQUISITION-CIRCULATION-CRM-IA-2026-11-08.md) — audit de l’état courant, parcours bidirectionnels rubriques ↔ CRM, contrat de transmission, rôles IA et étapes stratégiques.
17. [Audit du panorama et trajectoire 3D](AUDIT-PANORAMA-ET-PLAN-3D.md) — état réel du prototype et limites vérifiées.
18. [Audit initial et plan de nettoyage](AUDIT-INITIAL-ET-PLAN-NETTOYAGE.md) — constats datés et écarts historiques à revalider.
19. [Nettoyage documentaire](NETTOYAGE-DOCUMENTAIRE.md) — inventaire, règles de tri et conservation du patrimoine.
20. [Audit technique indépendant — source Claude](AUDIT-TECHNIQUE-CLAUDE-2026-11-05.md) — contrôles déclarés, limites de l’analyse, anomalies, points positifs et recommandations de consolidation.
21. [Cahier des charges — veille stratégique](CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md) — cadrage des signaux économiques, ressources, emploi, immobilier professionnel et raccordement au ciblage commercial.
22. [Maintenance, sauvegardes et continuité](MAINTENANCE-ET-CONTINUITE.md) — méthode permanente de nettoyage Git, points de retour, vérifications, documentation et reprise.
23. [Correctif ciblé — navigation du CRM interne](CORRECTIF-NAVIGATION-CRM-2026-11-06.md) — suppression d'un retour redondant, nettoyage du balisage et contrôle anti-régression.


24. [Cadrage stratégique — CRM, sources, ciblage commercial et Réputation virtuelle](CADRAGE-STRATEGIQUE-CRM-SOURCES-CIBLAGE-REPUTATION-VIRTUELLE-2026-11-06.md) — nouveaux circuits métier et dossier de consultation pour revue indépendante par d'autres IA.


25. [Prompt de revue indépendante par IA — CRM](PROMPT-REVUE-INDEPENDANTE-IA-CRM-2026-11-06.md) — consigne prête à transmettre à plusieurs IA pour obtenir des audits critiques comparables.

26. [Lot CRM — poste de travail Entreprises](LOT-CRM-POSTE-ENTREPRISES-2026-11-06.md) — recherche locale, filtres de qualification et de département, limites et étapes suivantes.
27. [État des ressources du moteur de Prospection](ETAT-RESSOURCES-PROSPECTION-2026-11-07.md) — état réel des connecteurs officiels et professionnels, conditions d’accès, contrôles exécutés et limites.
28. [Préparation de l’environnement technique de Cheexpeer — 8 novembre 2026](PREPARATION-ENVIRONNEMENT-CHEXPEER-2026-11-08.md) — état vérifié du backend, registre des sources, connecteurs, écarts de migrations, circuits Administration/CRM et prérequis d’intégration IA.

Les documents complémentaires précisent des sujets. Ils ne constituent pas des sources de décision concurrentes à la référence centrale.

**Cahier des charges opérationnel de Cheexpeer :** [CAHIER-DES-CHARGES-CHEXPEER.md](CAHIER-DES-CHARGES-CHEXPEER.md) — identité indépendante du moteur IA, veille et analyse commerciale, scoring explicable, SEO, rapports, alertes, gouvernance, sécurité et déploiement progressif. Ce document prépare l'intégration future sans activer l'IA.

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

Les destinations visibles sont des portes d'entrée vers des dossiers réels, pas la totalité des capacités de la plateforme. Recherche, CRM, Business Intelligence, Cheexpeer, mémoire, administration, orchestration et SEO sont des fonctions transversales ou des sous-parcours. Les pages de veille, accompagnement AO, BODACC, sous-traitance, qualification, salons et séminaires, suivi commercial, vision, recrutement, FAQ et pages légales doivent être rattachées correctement ; leur absence du panorama ne justifie pas leur suppression.

Le principe « le schéma reflète l'arborescence » est non négociable. La navigation spatiale doit préserver le rôle de l'ascenseur et la cohérence entre destination, dossier, page, étage éclairé et position de l'ascenseur. Une image statique munie de zones approximatives ne constitue pas à elle seule l'expérience immersive cible.

## Points à ne pas figer prématurément

Toute évolution récente du fondateur peut rouvrir un sujet précédemment documenté comme acquis. Le nom, le périmètre et les relations des capacités d'intelligence doivent être traités selon les échanges les plus récents et inscrits dans le registre des décisions ; ne pas clore un débat stratégique par une phrase isolée d'un document antérieur.

| [Concept — Publipostage intelligent par QR Code et badge MajestiOS](evolution-5.0/CONCEPT-PUBLIPOSTAGE-QR-CODE-BADGE-VIP-2026-11-06.md) | Orientation stratégique à soumettre aux autres IA : publipostage physique QR complémentaire à l'emailing, badge public/invité/VIP, Accès VIP, sécurité, conformité et MVP pilote |


## Audit des circuits d'information — 8 novembre 2026

[Audit et optimisation des circuits d'information — Immeuble, rubriques, CRM et Administration](AUDIT-CIRCUITS-INFORMATION-IMMEUBLE-RUBRIQUES-CRM-ADMIN-2026-11-08.md) — état vérifié des tables et politiques RLS, frontières de visibilité, séparation des rôles, circuit de validation/affectation/restitution et plan de correction priorisé.

[Contrat commun de transmission — rubriques, Administration et CRM](CONTRAT-COMMUN-TRANSMISSION-RUBRIQUES-ADMIN-CRM-2026-11-08.md) — spécification détaillée des acteurs, finalités, états, transitions, historique, API conceptuelle, permissions, modèle minimal et tests d'acceptation ; aucune implémentation déclenchée.


[Mapping du contrat de transmission vers l'existant — Supabase et fonctions serveur](MAPPING-CONTRAT-TRANSMISSION-SCHEMA-SUPABASE-EDGE-2026-11-08.md) — champs existants/manquants, permissions, visibilité des sources, fonctions Edge, migrations et ordre de correction. Relevé en lecture seule ; aucune modification du backend.

[Audit de rapprochement Git / ledger / schéma Supabase — 8 novembre 2026](AUDIT-RAPPROCHEMENT-GIT-LEDGER-SCHEMA-SUPABASE-2026-11-08.md) — correspondance des 21 migrations, divergences de versions, objets PostgreSQL observés, écarts de visibilité des sources et limites de preuve ; audit en lecture seule.
