# Matrice initiale — référentiel métier vers architecture V0.1

**Date :** 27 octobre 2026  
**Statut :** Pré-analyse, à faire valider — ne constitue pas un modèle relationnel définitif.  
**Sources de travail :** Tome 4 V1.2, Tome 5 V0.3, Tome 6 V0.1, Tome 7 V1.0 et architecture cible V0.1.

## 1. Règle de lecture

Les objets du Tome 5 sont les candidats canoniques du modèle métier. Les noms du prototype technique ne doivent pas être assimilés à ces objets sans décision explicite. Les noms ci-dessous sont des correspondances de travail, pas des décisions de renommage SQL.

## 2. Correspondance des objets

| Référentiel métier | Nom simplifié présent dans l'architecture V0.1 | Analyse / risque | Décision avant SQL |
|---|---|---|---|
| Tenant | Aucun équivalent explicite | Frontière de sécurité client absente de la liste simplifiée | Définir tenant, création, cycle de vie et contexte obligatoire |
| User | Utilisateur implicite | Compte global distinct de l'accès à un tenant | Confirmer identité globale et gestion de session |
| Membership | memberships | Concept proche, mais rôle et état d'appartenance à spécifier | Valider états, rôles, unicité et révocation |
| Organization | organizations / companies | Ambiguïté majeure : entreprise cliente vs entreprise commerciale référencée | Séparer explicitement les deux concepts et leurs liens |
| Contact | contacts | Correspondance probable, mais rattachement à Organization et contexte de tenant à valider | Valider partage, visibilité et règles d'accès |
| OpportunityCase | opportunities | Le dossier commercial canonique peut contenir acteurs, historique, missions et activités | Ne pas réduire le dossier à une annonce ou une ligne de flux |
| CaseActor | Aucun équivalent explicite | Rôle d'un interlocuteur dans un dossier distinct de son identité globale | Définir rôles, unicité et cohérence tenant/dossier |
| Mission | tasks (correspondance incertaine) | Une mission opérationnelle n'est pas nécessairement une tâche simple | Ne pas fusionner avant d'avoir défini états et cycle de vie |
| MissionAssignment | Aucun équivalent explicite | Affectation opérationnelle et responsabilité à contrôler | Définir affectations et règle d'une seule affectation active ou politique multi-opérateur |
| Activity | activities | Pilier transversal pour appels, RDV, tâches, notes, emails et autres événements | Définir relations et empêcher les références croisées incohérentes |
| Document / DocumentVersion | Aucun équivalent explicite dans la liste courte | Métadonnées, versioning et accès privé requis | Définir stockage, versions, suppression et conservation |
| KnowledgeItem | knowledge_items | Correspondance probable avec KNB, mais provenance et validation sont déterminantes | Définir source, statut, propriétaire et historique |
| AuditLog | audit_logs | Correspondance probable | Définir événements immuables côté utilisateur, accès et rétention |
| AIInteraction | Aucun équivalent explicite | Requis pour traçabilité, erreurs et coûts IA ; ne jamais y stocker des secrets | Définir tenant cohérent, membership, contexte, devise et calcul du coût |
| Notification | Aucun équivalent explicite | Objet prévu dans le Tome 5 | Définir destinataire et contrôle d'accès |

## 3. Invariants à préserver dans le modèle et les tests

1. Un identifiant UUID ne donne aucun droit par lui-même.
2. Chaque opération métier vérifie l'identité, l'appartenance active au tenant, la permission et l'accès à la ressource.
3. Les liens dossier, mission, contact, activité, document et interaction IA doivent être cohérents avec le même tenant et le contexte métier autorisé.
4. Une hypothèse produite par l'IA ne devient pas automatiquement un fait validé ou une décision commerciale.
5. Les statuts métier évoluent par des opérations contrôlées et traçables, et non par modification arbitraire d'un champ.
6. Les fichiers sont privés par défaut ; l'accès passe par une autorisation contrôlée.
7. Les journaux excluent les mots de passe, tokens, clés API et autres secrets.
8. Une politique de rétention, une sauvegarde ou un test ne sont pas considérés validés simplement parce qu'ils sont documentés.

## 4. Arbitrages bloquants ou à expliciter

- **Entreprise cliente vs entreprise prospectée :** quelles entités sont propres au tenant, et quelles données peuvent être communes ou mutualisées ?
- **Partage des organisations et contacts :** partage global, copie tenant-local ou mécanisme de référence partagé avec contrôle d'accès ? Le choix ne doit pas être implicite.
- **Dossier commercial vs mission :** états, transitions, acteurs et responsables distincts.
- **Affectations de mission :** une seule affectation active ou plusieurs opérateurs autorisés ?
- **Activité transversale :** comment garantir qu'une activité reliée à un dossier et une mission ne crée pas de relation incohérente ou inter-tenant ?
- **Données IA :** devise et méthode de calcul du coût ; règles de conservation et minimisation des données d'entrée/sortie.
- **Documents :** politique de versioning, suppression, export, accès et conservation.
- **Autorisations :** matrice des permissions du Tome 6 à réconcilier avec les rôles et les politiques RLS.

## 5. Tests à dériver après validation

- Un membre du tenant A ne peut pas lire, modifier, rechercher ou exporter les données du tenant B, même en fournissant directement un UUID.
- Un utilisateur sans membership ACTIVE est refusé.
- Un contact ou une activité ne peut pas être relié à un dossier d'un autre tenant.
- Un changement de statut non autorisé est refusé et ne contourne pas l'historique.
- Une suggestion IA demeure non validée tant qu'un humain habilité n'a pas effectué l'action explicite.
- Les fichiers privés ne sont pas accessibles via une URL ou un identifiant sans autorisation.
- Les traces et journaux ne contiennent aucun secret.
- Les coûts IA sont rattachés au tenant et au contexte autorisés sans enregistrer de secret.

## 6. Prochaine étape

Faire valider cette matrice contre les versions faisant autorité des tomes et des annexes. Enregistrer les décisions ou reports dans un registre d'arbitrage. Après validation seulement, produire le modèle relationnel V1.0, les contraintes de clés étrangères (y compris composites si nécessaires), les migrations et les tests d'isolation dans un environnement DEV.

---
**Fin de la matrice initiale.**
