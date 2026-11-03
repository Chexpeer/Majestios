# Gouvernance des interventions — MajestiOS

**Statut :** règles de travail validées par le porteur du projet le 3 novembre 2026.
**Application :** toute intervention documentaire, technique ou produit.

## Règles non négociables

1. **Documentation d'abord.** Avant d'intervenir, lire les dernières versions du cahier des charges, de l'audit, des décisions et des avertissements. Vérifier aussi les instructions du dossier concerné.
2. **La cible précède le produit.** La vision, les spécifications, l'architecture cible et la feuille de route doivent décrire l'étape visée avant que le site soit modifié. Le site ne doit pas dicter seul la conception future.
3. **Audit avant action.** Examiner l'existant réel, les changements récents, les dépendances, les tests et la faisabilité. Distinguer ce qui fonctionne, ce qui est partiel, simulé, inactif ou non vérifié.
4. **Alerte avant modification.** Exposer au porteur du projet les bugs, régressions possibles, contradictions documentaires, risques de sécurité, coûts, limites techniques et conséquences. Ne pas poursuivre si un arbitrage est nécessaire.
5. **Méthode sûre.** Proposer la solution la plus simple, maintenable et réversible. Décrire comment l'appliquer, les fichiers touchés, les contrôles, le retour arrière et les critères d'acceptation. Préserver les acquis ; éviter les changements massifs et irréversibles.
6. **Validation explicite.** Aucune modification du code, de l'architecture, des paramètres de production, aucun déploiement ni fusion sans autorisation explicite correspondant au périmètre. Une autorisation documentaire ne vaut pas autorisation de coder.
7. **Documentation vivante et concise.** Maintenir une documentation synthétique, sans doublons, orientée vers la prochaine étape. Toute décision, évolution de périmètre, anomalie importante ou vérification doit être reportée dans le document de référence concerné.
8. **Relecture croisée.** Faire relire régulièrement les documents et changements par plusieurs agents IA lorsque c'est possible. Les relecteurs cherchent contradictions, omissions, risques et erreurs ; ils ne valident pas à la place du porteur du projet. Toute divergence est signalée.
9. **Versions isolées.** Conserver `evolution-2.0` comme base de référence. Tout changement critique ou à risque significatif doit être réalisé sur une branche dédiée, jamais directement sur la base. La prochaine branche dédiée sera `evolution-3.0` (« Évolution 3.0 »), créée depuis une base explicitement choisie et vérifiée. Les étapes ultérieures pourront suivre `evolution-4.0`, etc. Ne jamais réécrire l'historique ni écraser une base antérieure. Une branche ne remplace pas un tag ou une sauvegarde.

## Séquence obligatoire avant toute intervention

1. Lire les documents et avertissements à jour.
2. Auditer l'état réel et les changements depuis le dernier contrôle.
3. Vérifier faisabilité, dépendances et compatibilité.
4. Présenter objectif, périmètre, solution recommandée, risques et méthode de retour arrière.
5. Obtenir l'autorisation requise.
6. Intervenir sur une branche isolée, avec changements limités.
7. Exécuter les contrôles pertinents et comparer le résultat à l'état initial.
8. Faire relire, corriger la documentation et rendre compte précisément.

## Référentiel documentaire

- `AGENTS.md` : règles opérationnelles communes aux agents.
- `CAHIER-DES-CHARGES-FONDATEUR.md` : vision, besoins, décisions et feuille de route fonctionnelle.
- `CARTOGRAPHIE-FONCTIONNELLE-FLUX.md` : circulation des informations, responsabilités des modules, règles de visibilité et points à arbitrer ; document de conception évolutif.
- `AUDIT-EXISTANT-PHASE-1.md` : état constaté, limites, écarts et risques ; dater chaque mise à jour.
- Le dossier d'architecture cible et les spécifications détaillées seront créés ou actualisés au moment où leur contenu sera suffisamment audité et arbitré. Ne pas multiplier les documents redondants.
- `docs/README.md` : index, hiérarchie et contradictions connues.

**Règle de priorité documentaire :** les décisions explicites et récentes du porteur du projet, la feuille de route active et les documents visionnaires validés priment sur les documents historiques. Les archives sont consultatives : elles ne constituent pas des exigences actuelles et ne doivent pas réintroduire une ancienne orientation. Toute contradiction entre décisions actives est remontée pour arbitrage, jamais résolue par supposition.
