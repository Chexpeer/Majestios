# Instructions de travail pour les agents IA — MajestiOS

Ce fichier est le point d'entrée canonique pour tout assistant ou agent intervenant dans ce dépôt.

## 1. Lecture obligatoire

Avant toute intervention, lire :
1. `README.md` et les instructions du dossier concerné ;
2. `docs/evolution-2.0/CAHIER-DES-CHARGES-FONDATEUR.md` ;
3. `docs/evolution-2.0/AUDIT-EXISTANT-PHASE-1.md` et ses avertissements à jour ;
4. `docs/evolution-2.0/GOUVERNANCE-INTERVENTIONS.md` ;
5. les décisions et changements récents de la branche.

Vérifier ensuite l'état réel du code et de la branche. Ne jamais se fier uniquement aux conversations, à la documentation ancienne ou à des hypothèses. Pour la conception future, privilégier les décisions récentes validées, la feuille de route active et les documents visionnaires actifs ; l'historique est secondaire et ne sert que de matériau à comparer.

## 2. Préservation et autorisations

`evolution-2.0` est une base de travail isolée. Les règles de gouvernance détaillées sont dans `docs/evolution-2.0/GOUVERNANCE-INTERVENTIONS.md`.

Sans autorisation explicite adaptée au périmètre :
- ne modifier ni code ni comportement du site ;
- ne toucher ni aux branches sources ni à la production ;
- ne fusionner, déployer ou modifier aucune configuration de production ;
- ne supprimer ni remplacer des acquis.

Une autorisation de modifier la documentation n'autorise pas une modification du code.

## 3. Méthode obligatoire

Avant toute modification : lire les documents et alertes, auditer l'existant et les changements récents, vérifier la faisabilité et les dépendances, identifier les contradictions et risques, puis présenter une méthode simple, réversible et testable. Obtenir l'autorisation requise.

Après autorisation : travailler sur une branche isolée, limiter le périmètre, préserver les acquis, exécuter les contrôles pertinents, comparer au résultat initial, faire relire et mettre à jour la documentation. Rapporter exactement les fichiers, tests, limites et risques. Ne jamais masquer un échec.

## 4. Règles de vérité et de conception

- Distinguer faits observés, résultats vérifiés, hypothèses, propositions et décisions validées.
- Ne jamais annoncer une fonctionnalité comme opérationnelle sans vérification.
- Ne pas inventer catégories, règles métier, sources, tarifs ou fonctions.
- Signaler toute information manquante et toute contradiction ; demander arbitrage si nécessaire.
- Le CRM est le référentiel commercial central ; les fonctions doivent échanger des données traçables.
- Préserver provenance, historique, cloisonnement des données et séparation des espaces clients.
- Évaluer sécurité, conformité, conditions d'utilisation, coûts et compatibilité avant tout choix technique majeur.

## 5. Documentation et versions

La documentation doit rester concise, sans doublons, et précéder les évolutions du produit : la cible et la feuille de route sont définies avant leur réalisation. La tenir à jour après chaque décision ou changement significatif et organiser des relectures croisées par plusieurs IA lorsque possible ; les IA ne remplacent jamais la validation du porteur du projet.

Conserver `evolution-2.0` comme base de référence. Tout changement critique ou présentant un risque significatif doit être isolé sur une nouvelle branche dédiée. La prochaine branche de ce type portera le nom Git `evolution-3.0` (affichée « Évolution 3.0 »). Elle sera créée depuis une base explicitement choisie et vérifiée avant intervention. Les étapes structurantes suivantes pourront utiliser `evolution-4.0`, etc. Une branche n'est pas une sauvegarde : conserver aussi des références stables (tags/commits) et des sauvegardes adaptées.

La documentation et les comptes rendus sont en français clair. `AGENTS.md` est la source canonique des consignes ; les adaptations à d'autres outils doivent y renvoyer sans créer une seconde source de vérité.
