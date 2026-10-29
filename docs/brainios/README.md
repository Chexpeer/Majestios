# BrainIOS — référentiel central d’intelligence et d’automatisation

- **Version :** 0.1
- **Date :** 27 octobre 2026
- **Branche de travail :** `architecture-v0-1`
- **Statut :** cadrage documentaire initial — aucune exécution automatique n’est activée par ce document.

## 1. Mission

BrainIOS est le référentiel transversal qui organise les instructions IA, les règles métier automatisables, les scans périodiques, les archives, les synthèses, les alertes et l’évaluation des résultats de MajestiOS.

BrainIOS n’est pas, à ce stade, un agent autonome déjà opérationnel ni un moteur technique implémenté. Ce dossier formalise la cible et permet de construire progressivement une solution vérifiable, sans prétendre que les fonctions décrites existent déjà.

## 2. Principes directeurs

1. **Comprendre avant d’automatiser.** Cartographier les fonctions et données existantes avant d’ajouter un mécanisme.
2. **Distinguer le prévu du réalisé.** Toute règle possède un statut explicite : idée, spécifiée, en développement, en test, active, suspendue ou retirée.
3. **Conserver la provenance.** Une information archivée doit, lorsque disponible, garder sa source, son identifiant externe, sa date de collecte et sa date d’origine.
4. **Séparer faits, hypothèses et décisions.** Une déduction de l’IA ne devient pas un fait vérifié sans contrôle approprié.
5. **Tracer les changements.** Conserver les versions pertinentes, les différences observées, les exécutions et les décisions.
6. **Privilégier l’automatisation progressive.** Commencer par observer, comparer et synthétiser ; préparer ensuite les actions ; exécuter des actions externes uniquement avec les permissions et validations requises.
7. **Limiter les effets de bord.** Définir les droits, le périmètre, les quotas, les délais, les règles de reprise et le comportement en cas d’échec.
8. **Mesurer l’utilité.** Évaluer la qualité des alertes, les faux positifs, les informations manquantes, le temps gagné, la fiabilité et les coûts.
9. **Rester modulaire.** BrainIOS coordonne des capacités communes sans dupliquer les responsabilités du CRM, de la veille marchés publics, des campagnes ou des autres modules.
10. **Respecter le périmètre technique actuel.** Pas de connexion ni de nouvelle dépendance Supabase. Pas d’action sur le déploiement Vercel dans le cadre de ce travail.

## 3. Cycle commun de traitement

1. **Déclencher** un scan manuel ou planifié.
2. **Collecter** des données provenant de sources autorisées et documentées.
3. **Normaliser** les données et conserver la référence à la source.
4. **Dédupliquer** les éléments déjà connus.
5. **Comparer** avec l’état ou l’archive précédente.
6. **Croiser** les informations selon des règles explicites.
7. **Synthétiser** les faits nouveaux, changements, incertitudes et points à examiner.
8. **Prioriser** les alertes selon l’impact, l’urgence, la fiabilité et l’échéance.
9. **Proposer** une action, ou la préparer dans un brouillon.
10. **Faire valider** les actions sensibles ou externes selon les règles définies.
11. **Tracer** l’exécution, les erreurs, la validation et le résultat.
12. **Évaluer** la qualité du traitement pour améliorer la règle dans une version ultérieure.

Toutes les étapes ne sont pas obligatoirement automatisées dès la première version.

## 4. Familles de capacités

- **Mémoire et archives :** documents, enregistrements, versions, provenance, indexation et conservation.
- **Surveillance :** scans planifiés, détection de changement, contrôle de disponibilité des sources.
- **Croisement :** rapprochement d’entreprises, de marchés, de territoires, de besoins, d’acteurs et d’événements.
- **Synthèse :** bilans périodiques, résumés par dossier, entreprise, territoire ou sujet.
- **Alertes :** échéances, changements significatifs, anomalies, échecs de collecte et actions en attente.
- **Préparation d’actions :** dossiers, listes de ciblage, brouillons de messages et tâches proposées.
- **Évaluation :** qualité, taux de faux positifs, coûts, erreurs et résultats obtenus.
- **Gouvernance :** droits, validation humaine, journal d’exécution, versions des règles et suspension.

## 5. Niveaux d’autonomie

| Niveau | Autorisation fonctionnelle | Exemple |
|---|---|---|
| A0 — Documenté | Décrire la règle sans exécution | Une idée d’automatisation enregistrée |
| A1 — Observer | Lire et collecter dans le périmètre autorisé | Scanner les avis publiés |
| A2 — Analyser | Comparer, classifier et synthétiser | Repérer des marchés pertinents |
| A3 — Préparer | Créer un brouillon ou une tâche sans action externe | Préparer une campagne pour validation |
| A4 — Exécuter sous contrôle | Exécuter une action explicitement autorisée, avec journalisation et garde-fous | Envoyer après approbation selon une règle approuvée |

Un niveau supérieur n’est jamais implicite. Les droits et contrôles doivent être définis par type d’action et par source.

## 6. Gestion des alertes

Chaque alerte devrait contenir, dans la mesure où ces éléments sont disponibles :

- un identifiant et une date de détection ;
- un titre explicite et un niveau de priorité ;
- les entités ou dossiers concernés ;
- le changement ou le fait observé ;
- les sources et leurs dates ;
- le niveau de confiance et les incertitudes ;
- l’échéance éventuelle ;
- l’action recommandée et son motif ;
- un statut de traitement, un responsable éventuel et l’historique des décisions.

Une alerte critique ne doit pas être fondée uniquement sur une inférence non vérifiée. En cas de source indisponible ou de données contradictoires, BrainIOS doit signaler l’incertitude plutôt que fabriquer une conclusion.

## 7. Architecture documentaire

- `README.md` : mission, principes, périmètre et liens vers les documents.
- `CATALOGUE_AUTOMATISATIONS_V0.1.md` : registre des automatisations, statuts, priorités et critères de validation.
- Les futurs documents détailleront les archives, les scans, les alertes, les règles de rapprochement, les évaluations et les contrôles, uniquement lorsqu’un besoin précis le justifiera.

Les documents de BrainIOS complètent la documentation d’architecture existante ; ils ne la remplacent pas. Les règles générales et décisions techniques doivent rester cohérentes avec la feuille de route et la matrice de traçabilité de MajestiOS.

## 8. Première étape recommandée

Commencer par une automatisation en lecture seule : surveiller une source identifiée, conserver les références et les dates, comparer les résultats aux collectes précédentes, puis produire une synthèse et des alertes testables.

La veille des appels d’offres publics constitue un candidat naturel, car un connecteur BOAMP existe déjà dans le prototype, mais son fonctionnement de bout en bout doit être vérifié avant d’en faire une dépendance opérationnelle.

## 9. Limites et décisions encore ouvertes

- Aucune technologie de stockage, de planification, de recherche sémantique ou de traitement en arrière-plan n’est imposée ici.
- Les durées de conservation, les droits d’accès, les coûts et les conditions de réutilisation des sources devront être définis avant une exploitation réelle.
- Aucune campagne commerciale ni action externe ne doit être déclenchée sur la seule base de cette spécification.
- Le passage d’une règle à l’état « active » exige des tests et une preuve d’exécution documentée.


## 10. Doctrine opérationnelle actualisée — 29 octobre 2026

La doctrine de référence et la feuille de route consolidée sont désormais décrites dans [DOCTRINE_OPERATIONNELLE_FEUILLE_DE_ROUTE_V1.md](./DOCTRINE_OPERATIONNELLE_FEUILLE_DE_ROUTE_V1.md).

Cette doctrine précise que BrainiOS est la mémoire économique, documentaire et opérationnelle transversale de MajestiOS. Elle doit relier les sources, les signaux économiques, les entreprises, les besoins, les métiers, les actions commerciales et les résultats.

Points à intégrer dans toute évolution :
- le BODACC est une source transversale pouvant servir plusieurs métiers, pas seulement la rubrique des opportunités privées ;
- l'objectif des parcours appels d'offres est de donner aux entreprises des moyens concrets de renforcer leurs candidatures, pas seulement d'afficher des avis ;
- les prises de contact, rendez-vous et mises en relation sont des résultats opérationnels à préparer et suivre, pas de simples promesses d'interface ;
- les réussites et les échecs doivent pouvoir enrichir l'expérience, tout en distinguant faits, motifs connus, hypothèses et inconnues ;
- l'autonomie se construit par étapes, avec permissions explicites, validation adaptée et journalisation ;
- aucune fonction spécifiée ne doit être présentée comme déjà active sans preuve de fonctionnement.

**Convention de nommage :** le nom produit à employer dans les textes est **BrainiOS**. Le répertoire technique reste `docs/brainios/` pour conserver une convention de chemin simple et stable.
