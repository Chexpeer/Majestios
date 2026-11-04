# Registre des observations techniques — démarrage MajestiOS 4.0

**Date :** 4 novembre 2026  
**Périmètre :** observations techniques issues du contre-audit externe, reprises comme points de contrôle et non comme verdict sur l'ambition du produit.  
**Statut :** backlog technique initial ; chaque point doit être vérifié dans le code avant correction.

## Principes de traitement

- Les observations utiles sont converties en tâches vérifiables.
- Une alerte n'entraîne pas automatiquement une suppression de fonctionnalité ou une réduction du périmètre produit.
- Toute correction doit préserver les acquis de la 3.0, être isolée dans un lot, et être accompagnée de tests anti-régression.
- Aucune fusion vers `main`, aucun déploiement et aucune modification de production ne sont autorisés par la création de cette branche.
- Les choix de produit restent guidés par la vision MajestiOS 4.0 ; ce registre ne constitue pas une validation éthique ou un arbitrage métier.

## Observations converties en travaux

| ID | Observation technique | Traitement 4.0 | Priorité initiale | Preuve attendue |
|---|---|---|---|---|
| T-01 | Dépôt GitHub public et risque d'exposition de secrets ou d'informations opérationnelles | Inventaire des secrets, contrôle de l'historique accessible, règles de secret scanning, revue des fichiers de configuration et séparation stricte des secrets d'environnement | Critique | Rapport de contrôle sans secret exposé ; procédure de rotation si incident |
| T-02 | Plusieurs chaînes de pull requests empilées et dépendantes | Cartographier bases/têtes/diffs ; choisir un seul flux de travail 4.0 ; réimplémenter proprement les changements utiles plutôt que fusionner aveuglément des chaînes divergentes | Élevée | Matrice PR → fonctionnalités → décision ; aucune perte de fonctionnalité |
| T-03 | Tests qui figent des libellés historiques | Distinguer vocabulaire visible, alias de compatibilité et références historiques ; actualiser les tests vers Prosp'active et Réputation virtuelle sans masquer les véritables régressions | Élevée | Tests de contenu et de navigation cohérents avec le lexique 4.0 |
| T-04 | Taxonomie BOAMP/BODACC incohérente entre documentation et code | Définir un catalogue versionné par source, type, catégorie et sous-catégorie ; isoler les règles d'inclusion/exclusion ; documenter les divergences restantes | Élevée | Matrice de taxonomie et tests positifs/négatifs, notamment pour les familles BODACC |
| T-05 | SEO technique incomplet ou non surveillé | Mettre en place un audit initial : sitemap, robots, canonical, HTTP, redirections, métadonnées, données structurées, liens internes, mobile et Core Web Vitals ; préparer ensuite le suivi BrainIOS | Élevée | Rapport reproductible et contrôles automatisables, sans promesse de positionnement |
| T-06 | Contraintes Google Maps / Places sur recherche, affichage, stockage et réutilisation | Concevoir un adaptateur serveur conforme aux conditions du produit Google retenu ; gérer quotas, coûts, attribution, Place ID, conservation et résolution d'identité | Élevée | Matrice API/usage/droits/durée ; tests de quotas et d'ambiguïté ; aucune clé privée côté navigateur |
| T-07 | Prospection par e-mail et règles CNIL | Concevoir les fonctions de contact avec qualification B2B/B2C, pertinence professionnelle, information, opposition, listes de suppression et preuve de provenance ; ne pas activer d'envoi automatique par défaut | Élevée | Tests des règles d'éligibilité et d'opposition ; journal d'autorisation avant envoi |
| T-08 | Besoin de séparer les risques techniques des choix de vision | Traiter les alertes comme contraintes d'ingénierie et critères d'acceptation ; conserver les objectifs fonctionnels MajestiOS 4.0 lorsqu'une voie de réalisation maîtrisée existe | Structurante | Chaque risque a une mesure de maîtrise et un responsable de décision |

## Ordre de traitement proposé

### Lot 0 — Mise en place de la ligne 4.0
- Branche `evolution-4.0` créée à partir de la branche documentaire validée, elle-même fondée sur le socle `evolution-3.0`.
- Documentation de référence 4.0 conservée dans `docs/evolution-4.0/`.
- Les PR existantes ne sont ni fusionnées, ni fermées, ni retargetées à ce stade.

### Lot 1 — Réconciliation et hygiène technique
1. comparer l'arbre 4.0 au socle 3.0 et inventorier les modifications héritées ;
2. cartographier les PR #23 à #34, leurs dépendances, leurs fichiers et leurs tests ;
3. contrôler secrets, configurations, workflows et protections de branches ;
4. repérer les assertions de tests liées à l'ancien vocabulaire ;
5. établir la liste des écarts de taxonomie BOAMP/BODACC.

### Lot 2 — Qualité produit et visibilité
1. corriger la taxonomie selon les décisions métier déjà documentées ;
2. mettre à jour les tests de vocabulaire sans supprimer les contrôles utiles ;
3. effectuer l'audit SEO technique de référence ;
4. préparer les contrats d'intégration Google Maps/Places ;
5. formaliser les garde-fous techniques de prospection e-mail.

## Règles de validation

Chaque lot doit fournir :
- la liste exacte des fichiers modifiés ;
- la raison de chaque modification ;
- les tests exécutés et leurs résultats ;
- les points non vérifiés ;
- le risque résiduel ;
- la procédure de retour arrière.

**Interdiction de déclarer un lot terminé si le build, les contrôles d'architecture ou les tests ciblés échouent sans explication et décision explicite.**
