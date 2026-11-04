# Nettoyage documentaire — inventaire et règles de conservation

## 1. Objectif

La documentation V5 est le point d'entrée actif. Le nettoyage vise à réduire les doublons, contradictions et éléments réellement abandonnés, sans effacer les exigences métier ni l'histoire du projet.

## 2. Sources à préserver et à confronter

- `README.md`, `AGENTS.md` et `docs/README.md` : consignes et index globaux.
- `docs/evolution-5.0/` : référentiel stratégique et cible de travail active.
- `docs/evolution-3.0/` : patrimoine technique et fonctionnel de référence, à préserver intact.
- `docs/evolution-2.0/` : cahier fondateur, gouvernance et cartographie fonctionnelle.
- `docs/historique/` : archives riches en spécifications métier, modèles de données, CRM, AO, veille, parcours et décisions.
- Documentation V4 : corpus de réflexion et de contre-audit en standby, à exploiter sans reprendre automatiquement ses conclusions.
- Code, tests, workflows et PR : preuves d'implémentation, à distinguer des intentions documentées.

## 3. Règles de tri

| Classe | Traitement |
|---|---|
| Référence actuelle, exacte et utile | Conserver et relier depuis l'index V5 |
| Fonction ou exigence utile, même non développée | Préserver et rattacher à la roadmap |
| Contenu utile mais daté | Extraire les éléments valides, garder la source en archive |
| Doublon | Choisir une référence canonique ; archiver l'original avant retrait |
| Contradiction | Ouvrir un arbitrage, ne pas choisir silencieusement |
| Proposition non validée | Garder dans un registre d'hypothèses |
| Information non vérifiée | Marquer « à vérifier » et définir la preuve attendue |
| Contenu réellement abandonné | Proposer le retrait après recherche des dépendances et validation |

## 4. Nettoyage technique et documentaire

- vérifier les liens Markdown et chemins relatifs ;
- harmoniser titres, versions, dates, branches et références de commits ;
- comparer les documents avant fusion ;
- distinguer code présent, prototype, fonction testée et fonction opérationnelle ;
- corriger les termes obsolètes dans l'interface active sans réécrire les archives ;
- maintenir la traçabilité destination → dossier → sous-dossier → page → fonction ;
- inventorier les dépendances HTML/CSS/JS, scripts de build, tests, workflows et ressources ;
- rechercher les références avant toute suppression ou renommage.

## 5. Points de vigilance stratégiques

- Les documents historiques peuvent contenir des noms ou concepts remplacés ; ils restent utiles pour retrouver les intentions d'origine.
- BrainIOS est l'appellation antérieure de MajestiOS V.5 : il s'agit d'une seule et même plateforme, pas de deux projets ou architectures. Les capacités, idées et travaux utiles documentés sous BrainIOS doivent être conservés et intégrés au périmètre MajestiOS V.5. Dans la documentation active et l'interface, employer exclusivement « MajestiOS V.5 » ; conserver « BrainIOS » uniquement dans les archives nécessaires à la traçabilité.
- « Réputation virtuelle » est le terme cible ; « e-Réputation » relève de l'historique.
- « Prospection » est l'intitulé du dossier ; « Prosp'active » peut être une signature de marque.
- Les pages salons et séminaires restent des contenus du Réseau.
- CRM, Business Intelligence, mémoire, orchestration, administration et SEO sont des capacités à préserver même si elles ne constituent pas des étages.
- Le SEO continu, la veille des moteurs et les recommandations de maintien à la pointe font partie du périmètre stratégique de l'administration IA.

## 6. Décisions de conservation connues

- Le blog « 100 blagues » est explicitement retiré de l'expérience active V5 ; ses références historiques peuvent rester archivées.
- Les ressources visuelles présentes dans la branche sont `Ambisios.webp`, `Développement-.webp`, `Marché-Public-.webp`, `Prospection-.webp` et `Marcheprive.webp`. Aucune ne doit être supprimée sans vérification de son usage et de sa valeur.
- Les pages de veille, accompagnement AO, BODACC, sous-traitance, qualification, salons-séminaires, CRM, suivi commercial, intelligence économique, vision, recrutement, FAQ et pages légales sont conservées jusqu'à audit de leur utilité et de leurs liens.

## 7. Première passe de nettoyage

La première passe est non destructive : inventorier, corriger les index et contradictions factuelles, établir les dépendances et préparer le plan de retrait. Une suppression ne devient admissible qu'après preuve qu'un élément est obsolète, sans dépendance ni valeur métier, et après validation du plan par le fondateur.

## 8. Livrables attendus

- inventaire des documents, pages, scripts, styles, images, routes, tests et workflows ;
- matrice doublons / contradictions / références canoniques ;
- matrice de traçabilité métier ;
- liste de corrections non controversées ;
- propositions motivées de regroupement, archivage et retrait ;
- vérification automatisée des liens internes, ressources et chemins ;
- rapport de tests et état exact des limites restantes.
