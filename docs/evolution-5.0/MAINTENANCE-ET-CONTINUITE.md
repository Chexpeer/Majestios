# Maintenance, sauvegardes et continuité — MajestiOS

**Version :** 5 novembre 2026  
**Périmètre :** toutes les branches et tous les environnements du projet MajestiOS.

## 1. Principe directeur

MajestiOS doit évoluer sans perdre la mémoire de sa propre construction. Le nettoyage, les sauvegardes, la traçabilité et la documentation sont des activités de développement à part entière, pas des tâches facultatives de fin de projet.

> **« Si tu commets une erreur, regarde le rétroviseur avant de faire marche arrière. »**

Cette règle signifie : comprendre l'origine d'un problème avant de revenir en arrière, examiner les commits, les différences, les journaux et les sauvegardes, puis choisir une correction proportionnée. Ne jamais lancer un reset, un revert, une suppression ou une réécriture d'historique à l'aveugle.

## 2. Avant chaque lot

1. Identifier précisément le dépôt, la branche, le HEAD et la PR concernés.
2. Vérifier l'état Git, les commits récents, le diff depuis la dernière référence stable et les éventuels changements non intégrés.
3. Lire les décisions récentes et les documents canoniques concernés.
4. Vérifier le dernier résultat CI et distinguer les contrôles réellement exécutés des contrôles simplement configurés.
5. Définir le périmètre, les critères d'acceptation, les risques et les fichiers qui seront touchés.
6. Créer ou confirmer un point de retour exploitable avant toute intervention risquée : commit de sauvegarde, branche de sauvegarde ou référence distante identifiée.
7. Ne jamais considérer une branche de travail comme une sauvegarde unique.

## 3. Pendant le lot

- Travailler par lots cohérents et de taille maîtrisée.
- Préserver les fonctionnalités, les ressources et les décisions déjà validées.
- Éviter les refontes globales sans justification issue d'un audit.
- Ne pas supprimer, renommer ou déplacer avant inventaire des dépendances et vérification des liens.
- Ne pas réécrire l'historique partagé ni forcer une mise à jour de branche sans procédure explicite et point de retour.
- Garder séparés les environnements de travail, de prévisualisation et de production.
- Signaler immédiatement tout échec, toute divergence inattendue ou toute perte potentielle.

## 4. Après chaque lot

1. Exécuter les contrôles adaptés au périmètre : syntaxe, tests ciblés, build, architecture, routes, liens, navigateur et intégrations externes si concernées.
2. Comparer le résultat au point de départ et examiner le diff complet.
3. Vérifier que les ressources publiées figurent dans le manifeste et que les liens documentaires restent valides.
4. Mettre à jour les documents concernés : référence canonique, guide de reprise, roadmap, index et consignes des agents selon la nature du changement.
5. Consigner la date, la branche, le commit, les fichiers modifiés, les contrôles exécutés, leurs résultats, les limites et les travaux restants.
6. Conserver une référence stable du résultat validé avant d'entamer un lot risqué suivant.

## 5. Règles de documentation

La documentation doit refléter l'état vérifié du dépôt, et non une intention ou un souvenir.

- Une décision validée est distinguée d'une proposition et d'une hypothèse.
- Un test configuré est distingué d'un test exécuté ; son résultat doit être consultable.
- Un prototype, une simulation, une intégration testée et une fonction en production sont qualifiés séparément.
- Les références de branches et de commits sont datées ; les SHA anciens sont signalés comme historiques.
- Les documents qui se recoupent renvoient à une source canonique au lieu de maintenir des copies divergentes.
- Toute évolution de l'arborescence doit préserver la règle : **le schéma reflète l'arborescence**.
- Les archives historiques sont conservées comme traces, mais ne prévalent pas sur une décision plus récente validée.

## 6. Branches, sauvegardes et autorisations

- Les branches historiques V2, V3 et V4 sont des sources à préserver.
- `evolution-5.0` conserve l'état de travail V5 d'origine.
- `evolution-5.0-clean-preview` est la branche de reconstruction propre utilisée par la PR #38 ; elle ne remplace pas silencieusement la branche source.
- Une PR et une Preview ne valent ni fusion ni mise en production.
- Aucune fusion vers `main`, promotion production, suppression de branche ou suppression de sauvegarde sans autorisation explicite.
- Avant une opération irréversible, expliquer le point de retour, le périmètre et la méthode de restauration.

## 7. Compte rendu minimal obligatoire

Chaque lot doit laisser une trace vérifiable :

| Élément | Information attendue |
|---|---|
| Point de départ | Branche, commit et état initial |
| Objectif | Résultat attendu et périmètre autorisé |
| Changements | Fichiers et comportements modifiés |
| Sauvegarde | Référence du point de retour |
| Vérifications | Commandes, workflows ou tests réellement exécutés |
| Résultats | Réussites, échecs et limites |
| Documentation | Documents actualisés |
| Suite | Risques résiduels et prochain lot |

**Règle finale :** comprendre avant de corriger, sauvegarder avant de risquer, vérifier avant d'affirmer et documenter avant de passer au lot suivant.


## 8. Boucle de travail intégrée : audit → harmonisation → analyse → correction → optimisation

Ces termes désignent des dimensions complémentaires d'un même processus continu. Ils ne constituent pas cinq missions isolées ni cinq étapes facultatives. Ils doivent fonctionner en synergie et se nourrir mutuellement :

1. **Audit** — observer l'état réel, inventorier, mesurer, détecter les écarts, les régressions, les risques et les incohérences.
2. **Analyse** — comprendre les causes, les dépendances, les impacts et les priorités ; confronter les constats au besoin métier, à l'architecture et aux décisions validées.
3. **Harmonisation** — rétablir la cohérence entre vision, terminologie, arborescence, interfaces, code, documentation, tests et règles de gouvernance.
4. **Correction** — traiter les causes identifiées sans masquer les symptômes ni dégrader les éléments déjà validés ; préserver un point de retour.
5. **Optimisation** — améliorer lisibilité, robustesse, performance, maintenabilité et expérience, uniquement lorsque les preuves et le périmètre le justifient.
6. **Vérification et capitalisation** — rejouer les contrôles, comparer avant/après, mettre à jour les documents et inscrire les enseignements dans le référentiel.

Cette boucle est itérative : une correction peut révéler un nouvel écart ; une optimisation peut nécessiter un nouvel audit ; l'harmonisation documentaire peut révéler une contradiction qui impose une analyse complémentaire. On recommence jusqu'à obtenir un résultat cohérent, vérifié et traçable.

**Règle de conduite :** ne pas optimiser une incohérence sans l'avoir comprise ; ne pas corriger sans preuve ni point de retour ; ne pas déclarer terminé sans vérification et mise à jour documentaire.
