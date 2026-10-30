# MajestiOS — Modèle fonctionnel commun Appels d’offres + CRM V0.1

- **Date :** 30 octobre 2026
- **Branche de travail :** `refonte-profondeur-flux`
- **Statut :** proposition de conception ; aucun schéma physique ni migration exécuté par ce document.
- **Objectif :** faire des appels d’offres et du CRM deux vues cohérentes d’une même intelligence commerciale, sans créer deux référentiels indépendants.

## 1. Décision structurante

Le CRM et le gestionnaire d’appels d’offres partagent les mêmes objets métier. Une entreprise ne doit pas être recréée pour chaque consultation ; un contact ne doit pas être dupliqué à chaque échange ; une annonce source ne doit pas être confondue avec le dossier de travail du client.

Le modèle distingue :
1. **les données de référence** : organisations clientes, entreprises, interlocuteurs ;
2. **les faits détectés** : avis, attributions, signaux économiques et autres éléments sourcés ;
3. **le travail du client** : opportunités suivies, dossiers, décisions, tâches et documents ;
4. **la relation commerciale** : interactions, rôles, partenaires et historique ;
5. **la provenance et la sécurité** : sources, dates de vérification, permissions et audit.

## 2. Entités logiques proposées

Ces noms sont des repères conceptuels, pas encore des noms de tables imposés.

| Entité | Rôle | Relations essentielles |
|---|---|---|
| Organisation cliente | Périmètre de données et de facturation d’un client MajestiOS | Membres, dossiers, tâches, paramètres |
| Membre / rôle | Personne autorisée dans une organisation cliente | Organisation, permissions |
| Entreprise | Référentiel d’entreprises identifiées | Interlocuteurs, opportunités, signaux, interactions |
| Interlocuteur | Personne rattachée à une entreprise lorsque ce lien est connu | Entreprise, interactions, tâches |
| Avis source | Copie normalisée d’une annonce ou d’un avis provenant d’une source externe | Source, opportunités suivies, événements d’historique |
| Opportunité suivie | Dossier de travail qu’une organisation cliente décide de suivre | Avis source éventuel, entreprise(s), tâches, documents, interactions |
| Dossier de consultation | Ensemble de l’analyse et de la préparation d’une réponse à un marché | Opportunité suivie, documents, tâches, partenaires |
| Interaction | Appel, réunion, note, courriel consigné ou autre échange | Organisation cliente, entreprise, interlocuteur, opportunité |
| Tâche / échéance | Action à faire, date cible, responsable et état | Opportunité, entreprise, interlocuteur |
| Document | Référence à un fichier, type, version, accès et provenance | Dossier, entreprise ou interaction |
| Relation commerciale | Rôle contextualisé entre deux objets : prospect, client, partenaire, sous-traitant, fournisseur, etc. | Entreprises, organisation cliente, opportunité |
| Signal | Fait publié ou piste commerciale issue d’une analyse | Source, entreprise éventuelle, opportunité éventuelle |
| Source | Origine, URL officielle, identifiant, date de collecte et règles d’usage | Avis, signaux, données enrichies |
| Historique / audit | Trace des changements et opérations sensibles | Objet concerné, auteur, date, motif |

### Distinction à préserver

- **Avis source** : l’objet externe détecté, avec sa provenance.
- **Opportunité suivie** : le dossier interne qu’un client crée pour qualifier et travailler cet objet.
- **Dossier de consultation** : la préparation opérationnelle d’une réponse, si l’entreprise décide de se positionner.
- **Signal** : une information ou hypothèse qui peut justifier une action commerciale, mais qui n’est pas nécessairement un appel d’offres.

Un même avis source peut être suivi par plusieurs organisations clientes, chacune avec son propre statut, ses notes, ses tâches et ses documents privés. Les données privées d’un client ne doivent jamais être exposées à un autre.

## 3. Relations métier

Modèle conceptuel simplifié :

```text
Source ── Avis source ──< Opportunité suivie >── Organisation cliente
                              │
                              ├── Dossier de consultation
                              ├── Tâches / échéances
                              ├── Documents
                              ├── Interactions
                              ├── Entreprises liées
                              └── Partenaires éventuels

Entreprise ──< Interlocuteurs
    │
    ├── Relations commerciales
    ├── Signaux sourcés
    ├── Opportunités liées
    └── Interactions / historique
```

Les relations entre entreprise et opportunité doivent pouvoir préciser un rôle : acheteur, candidat potentiel, titulaire/attributaire publié, partenaire, sous-traitant envisagé ou autre. Le rôle doit être sourcé ou marqué comme hypothèse à confirmer.

## 4. Cycle de vie proposé pour une opportunité suivie

États initiaux :
- détectée ;
- à qualifier ;
- à étudier ;
- décision à prendre ;
- en préparation ;
- déposée ;
- en attente de résultat ;
- gagnée ;
- perdue ;
- abandonnée ;
- suspendue ;
- non éligible.

Les transitions doivent être explicites et historisées. « Déposée » ne peut être choisi qu’après confirmation humaine ou preuve intégrée du dépôt. La détection d’un avis ne signifie pas que le client s’est positionné.

La décision commerciale doit conserver, si l’utilisateur la renseigne, son motif : adéquation, capacité, délai, territoire, rentabilité estimée, partenaire manquant ou autre.

## 5. Provenance, faits et hypothèses

Chaque information externe exploitable doit conserver autant que possible :
- source et URL officielle ;
- identifiant de la source ;
- date de publication, si disponible ;
- date de collecte et dernière vérification ;
- valeur brute ou référence au contenu d’origine ;
- valeur normalisée ;
- méthode d’extraction ou de rapprochement ;
- niveau de confiance et motif de vérification, si nécessaire.

Les informations doivent être classées :
- **fait sourcé** : explicitement indiqué par une source identifiable ;
- **rapprochement** : correspondance proposée entre données ;
- **hypothèse commerciale** : piste produite par analyse, à confirmer ;
- **information déclarée** : renseignée par le client ou un membre autorisé.

Un marché attribué à une entreprise peut constituer un fait sourcé. Un besoin potentiel de sous-traitance est une hypothèse jusqu’à confirmation. Aucun score ni montant ne doit être inventé lorsque la donnée manque.

## 6. CRM : entreprise, interlocuteur, relation

Le CRM sépare :
- la fiche entreprise ;
- les fiches des personnes et leur fonction connue ;
- le statut relationnel dans un contexte donné ;
- l’historique des interactions ;
- les opportunités et signaux associés.

Les catégories relationnelles ne sont pas exclusives. Une même entreprise peut être cliente pour un service, partenaire sur un dossier et prospect pour un autre. La catégorie doit donc être rattachée au contexte pertinent plutôt que codée comme une valeur unique et globale sur la fiche entreprise.

Une personne ne doit pas être présentée comme décideur si ce rôle n’est qu’une supposition. Les coordonnées doivent avoir une provenance et être traitées selon les règles de protection des données applicables.

## 7. Sécurité et séparation des données

- Toutes les données de travail privées sont rattachées à une organisation cliente.
- Chaque lecture et écriture doit vérifier l’appartenance à cette organisation et les permissions côté serveur.
- Les contrôles de base de données doivent empêcher l’accès inter-organisations ; masquer les boutons dans l’interface ne suffit pas.
- Les avis et signaux publics peuvent être partagés comme référentiel commun si leurs conditions de réutilisation le permettent ; les notes, documents, tâches, décisions et interactions du client restent privés.
- Les fichiers sensibles nécessitent un stockage privé, des règles d’accès et une stratégie de conservation.
- Les modifications importantes, rapprochements, fusions et exports doivent être auditables.
- Les secrets d’intégration ne doivent jamais être exposés dans le navigateur.

## 8. Règles anti-doublons et cohérence

1. Un avis source est identifié prioritairement par son identifiant officiel et sa source ; les changements sont historisés.
2. Une entreprise n’est pas fusionnée sur le seul nom. Utiliser un identifiant légal fiable lorsqu’il existe ; sinon soumettre les homonymes à vérification.
3. Un contact conserve son lien entreprise et la provenance de ses informations.
4. Une opportunité suivie peut référencer un avis source, mais peut aussi exister sans avis public (ex. piste privée ou opportunité issue d’un échange).
5. Les données d’une organisation cliente ne sont jamais fusionnées dans le référentiel partagé sans règle explicite et autorisation appropriée.
6. Une collecte répétée doit être idempotente : elle actualise le même avis au lieu de créer des doublons.
7. Les suppressions et fusions doivent conserver une trace adaptée et permettre d’expliquer le résultat.

## 9. Ordre de réalisation recommandé

### Lot A — Vérification préalable
- confronter ce modèle au référentiel maître et aux documents existants ;
- inspecter le schéma de base réellement présent sur la branche et les migrations ;
- inventorier l’authentification, les rôles et les tests d’isolation existants ;
- confirmer les champs réellement fournis par le connecteur BOAMP.

### Lot B — Socle CRM et suivi
- entreprises et interlocuteurs ;
- opportunités suivies ;
- tâches et interactions ;
- liens entre entreprise, avis et opportunité ;
- contrôle des accès et tests d’isolation.

### Lot C — Dossiers de consultation
- documents et pièces attendues ;
- échéances et responsables ;
- préparation de réponse ;
- décision, résultat et capitalisation.

### Lot D — Intelligence proactive
- avis d’attribution ;
- signaux BODACC et autres sources autorisées ;
- rapprochement des entreprises ;
- recommandations explicables et revue humaine.

Ne pas créer toutes les entités d’un seul coup. Implémenter par incréments verticaux, avec des tests d’accès et de parcours pour chaque lot.

## 10. Tests d’acceptation de base

- Une organisation ne peut pas lire ni modifier les notes, tâches ou documents d’une autre.
- Un même avis source suivi par deux organisations donne deux espaces de travail distincts.
- Une opportunité peut être reliée à plusieurs entreprises avec des rôles différents.
- Une entreprise peut être à la fois cliente et partenaire dans des contextes distincts.
- Une donnée absente reste inconnue et n’est pas remplacée par une valeur fictive.
- Une hypothèse commerciale est visuellement distinguée d’un fait sourcé.
- Une collecte répétée ne crée pas de doublons.
- Toute transition vers « déposée » ou « gagnée » conserve la preuve ou la confirmation disponible.
- Les changements de statut et les rapprochements importants sont historisés.
- Un utilisateur non autorisé ne peut pas accéder à un document par URL directe.

## 11. Points non tranchés

- Champs exacts et règles de validation à confronter aux tomes du référentiel maître.
- Structure physique des tables, conventions de nommage et migrations.
- Politique de partage des données publiques enrichies et données fournies par les clients.
- Gestion des documents et durée de conservation.
- Règles d’accès par rôle et fonctionnement du compte multi-membres.
- Intégration des e-mails, calendriers et autres services externes.

**Ce document cadre le modèle fonctionnel ; il ne prouve pas que ces fonctions sont déjà implémentées. Aucune migration, donnée client ou intégration n’est créée par ce document.**
