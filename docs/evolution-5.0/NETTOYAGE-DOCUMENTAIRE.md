# Nettoyage documentaire — inventaire et règles de conservation

## 1. Objectif

La documentation V5 doit devenir le point d'entrée lisible et fiable. Le nettoyage vise à réduire les doublons et contradictions, pas à effacer l'histoire du projet.

## 2. Sources identifiées dans la branche 3.0

L'inventaire initial a repéré :
- `README.md` à la racine : présentation, commandes de build et de tests ;
- `AGENTS.md` : consignes de travail et limites de l'architecture ;
- `docs/README.md` : index documentaire global ;
- `docs/evolution-2.0/` : audit initial, cahier des charges fondateur, cartographie fonctionnelle et gouvernance ;
- `docs/evolution-3.0/` : architecture API cible, audit comparatif technique, cahier des charges révisé, étapes A/B/C, migration et registre d'arbitrages/sécurité ;
- `docs/historique/` : documents historiques à inventorier avant décision ;
- branche documentaire `docs/audit-vision-roadmap-4.0-2026-11-04` : audit 3.0, vision 4.0, roadmap 4.0, mission de contre-audit et README.

## 3. Règles de tri

| Classe | Traitement |
|---|---|
| Référence actuelle, exacte et utile | Conserver et relier depuis le README V5 |
| Contenu utile mais daté | Extraire les éléments encore valides, citer la source et marquer l'ancien document comme historique |
| Doublon | Choisir une référence canonique ; garder l'original en archive jusqu'à validation |
| Contradiction | Ouvrir un arbitrage, ne pas choisir silencieusement |
| Proposition non validée | Garder dans un registre d'hypothèses, ne pas la présenter comme décision |
| Information non vérifiée | Marquer « à vérifier » et définir une preuve attendue |
| Contenu obsolète ou erroné | Proposer archivage ou retrait, avec justification et accord du fondateur |

## 4. Nettoyage technique et documentaire à prévoir

- vérifier les liens Markdown et chemins relatifs ;
- harmoniser titres, versions, dates, noms de branches et références de commits ;
- corriger les fautes et chemins mal formés ;
- supprimer les répétitions uniquement après comparaison ;
- distinguer code présent, fonctionnalité testée, prototype et cible documentaire ;
- remplacer les termes obsolètes dans les nouveaux documents, sans réécrire l'histoire ;
- regrouper les décisions dans un registre unique ;
- maintenir un glossaire et une matrice de traçabilité étage → dossier → page → fonction.

## 5. Points de vigilance déjà visibles

- La mission de contre-audit 4.0 contient une parenthèse excédentaire dans le chemin du document roadmap : `ROADMAP-MAJESTIOS-BRAINIOS-4.0.md)`.
- Les documents historiques V3/V4 peuvent encore contenir le nom BrainIOS. Il est conservé uniquement dans ces archives pour préserver l'historique ; toute nouvelle documentation et toute nouvelle interface utilisent **MajestiOS V.5**.
- La branche `main` est décrite dans l'audit comme nettement plus réduite que `evolution-3.0` ; ne pas l'utiliser comme base sans comparaison.
- Certains documents A/B/C de la 3.0 sont des architectures cibles, pas des fonctionnalités déployées.
- Les termes « Prosp'active » et « Réputation virtuelle » doivent être utilisés dans la cible actuelle ; les anciens termes peuvent rester dans les archives pour conserver le contexte historique.

## 6. Décisions de nettoyage actées pour V5

- Le nom BrainIOS est abandonné dans le périmètre actif : la plateforme intelligente transversale s'appelle désormais **MajestiOS V.5**. Les références historiques dans les archives V2/V3/V4 restent inchangées afin de ne pas réécrire l'histoire du projet.
- Le blog « 100 blagues » est retiré de l'expérience V5 : sa page HTML et son inclusion dans la construction du site ont été supprimées, ainsi que ses liens depuis la FAQ et la page Vision.

## 7. Nettoyage non destructif — première passe

Aucune suppression ni déplacement de fichier n'est autorisé dans cette première passe. Le travail consiste à :
1. dresser l'inventaire complet ;
2. identifier les documents canoniques ;
3. établir les dépendances entre documents ;
4. produire une liste de corrections et de fusions proposées ;
5. faire valider le plan ;
6. appliquer ensuite les changements par petits lots avec vérification des liens.

## 8. Livrables de la phase de nettoyage

- inventaire exhaustif des documents, avec taille, date, statut et sujet ;
- matrice doublons / contradictions / documents de référence ;
- liste de corrections non controversées ;
- propositions de fusion et d'archivage ;
- index documentaire final ;
- vérification automatique des liens internes et chemins.
