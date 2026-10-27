# Catalogue des automatisations BrainIOS — version 0.1

- **Date :** 27 octobre 2026
- **Branche :** `architecture-v0-1`
- **Statut :** catalogue initial de cadrage. Les entrées ci-dessous ne signifient pas que les automatisations sont codées ou actives.

## Comment lire ce catalogue

- **Idée :** besoin identifié, règle encore à préciser.
- **À spécifier :** conditions, sources ou critères à définir.
- **Prêt à tester :** spécification et données de test disponibles.
- **En test :** vérification en cours, pas de garantie de fonctionnement.
- **Actif :** tests et preuve d’exécution documentés.
- **Suspendu / retiré :** ne doit pas s’exécuter.

Les priorités sont provisoires et doivent être révisées à partir des risques, des dépendances et de la valeur démontrée.

## Registre initial

| ID | Automatisation | Entrée / source | Résultat attendu | Autonomie initiale | Priorité | Statut |
|---|---|---|---|---|---|---|
| BIO-001 | Scan de veille des appels d’offres | Connecteur BOAMP existant, fonctionnement à vérifier | Collecte horodatée, références officielles, rapport de collecte | A1 — observation | P1 | À spécifier et tester |
| BIO-002 | Détection des nouveaux avis et changements | Résultats BIO-001 comparés aux archives précédentes | Nouveautés, modifications, avis disparus et incertitudes | A2 — analyse | P1 | Idée |
| BIO-003 | Synthèse périodique de veille | Résultats collectés et changements confirmés | Résumé des nouveaux marchés, échéances et anomalies | A2 — analyse | P1 | Idée |
| BIO-004 | Alertes sur échéances et événements critiques | Dates et statuts vérifiés de la source | Alertes justifiées avec source, urgence et action proposée | A2 — analyse | P1 | Idée |
| BIO-005 | Qualification des marchés par activité et territoire | Texte d’avis, codes APE/NAF et périmètre géographique | Critères de pertinence explicites, justification et incertitudes | A2 — analyse | P2 | À spécifier |
| BIO-006 | Rapprochement d’entreprises avec le CRM | Entreprises issues de sources autorisées et données CRM disponibles | Correspondances proposées, doublons potentiels, provenance | A2 — analyse | P2 | Idée |
| BIO-007 | Préparation de ciblage commercial | Marchés qualifiés et entreprises candidates | Liste à contrôler, exclusions et motifs de sélection | A3 — préparation | P2 | Idée |
| BIO-008 | Contrôle de santé des sources et tâches | Résultats des scans, erreurs et délais d’exécution | Alerte en cas d’échec, de retard ou de données anormales | A2 — analyse | P2 | Idée |
| BIO-009 | Synthèse générale des archives | Archives et historiques autorisés | Synthèse datée avec sources, nouveautés et points incertains | A2 — analyse | P3 | Idée |
| BIO-010 | Préparation de campagne | Ciblage validé et règles commerciales applicables | Brouillon et liste à valider, sans envoi automatique initial | A3 — préparation | P3 | Idée |
| BIO-011 | Mesure des résultats | Actions autorisées et résultats effectivement observés | Indicateurs documentés pour évaluer la pertinence | A2 — analyse | P3 | Idée |

## Fiche obligatoire pour chaque automatisation

Avant de passer au développement, documenter :

1. **Objectif métier** : quel problème concret est résolu ?
2. **Déclencheur** : manuel, horaire, événement ou demande d’un utilisateur.
3. **Sources et permissions** : accès autorisé, conditions d’utilisation et limites.
4. **Entrées et sorties** : format, champs obligatoires, provenance et résultats attendus.
5. **Règles métier** : critères de filtrage, rapprochement, priorité et déduplication.
6. **Autonomie permise** : observation, analyse, préparation ou exécution sous contrôle.
7. **Gestion des erreurs** : délai maximal, nouvelle tentative, interruption et alerte.
8. **Sécurité et conservation** : accès, durée, données sensibles et journalisation.
9. **Tests d’acceptation** : cas normaux, limites, erreurs, doublons et données contradictoires.
10. **Mesure de qualité** : précision utile, faux positifs, omissions, temps gagné et coûts.
11. **Responsable et version** : propriétaire métier, version de règle, date de revue.
12. **Preuve d’activation** : test réussi, exécution observable et conditions de désactivation.

## Ordre de travail proposé

### Lot 1 — Fiabiliser la veille en lecture seule
1. Vérifier le connecteur BOAMP et les champs réellement retournés.
2. Définir le format minimal d’une archive et les règles de déduplication.
3. Comparer deux collectes pour détecter les nouveautés et modifications.
4. Produire une synthèse datée et un rapport d’erreurs.
5. Tester les alertes sans envoyer de notification externe.

### Lot 2 — Améliorer la pertinence
6. Définir des règles explicables de classification par type de marché, territoire et activité.
7. Évaluer ces règles sur un échantillon contrôlé.
8. Préparer les correspondances avec les entreprises sans les enregistrer comme vérités non vérifiées.

### Lot 3 — Préparer l’action commerciale
9. Construire un ciblage justifié avec exclusions et contrôles.
10. Préparer les campagnes en brouillon.
11. Ajouter l’envoi seulement après validation des règles, de la conformité, du fournisseur et des mécanismes de désinscription/gestion des oppositions.

## Critère de passage à « Actif »

Une automatisation n’est déclarée active que si son implémentation est identifiée, ses tests d’acceptation sont documentés, ses erreurs sont gérées, sa sortie est traçable et une exécution réelle a été observée. La simple présence d’une spécification ou d’un workflow planifié ne suffit pas.
