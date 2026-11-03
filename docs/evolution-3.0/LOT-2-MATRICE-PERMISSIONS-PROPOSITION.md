# MajestiOS 3.0 — Lot 2.1 : matrice de permissions proposée

**Date :** 3 novembre 2026  
**Statut :** proposition de travail à relire — non validée.  
**Dépendance :** `LOT-2-PROPRIETE-DONNEES-CLOISONNEMENT.md`.  
**Périmètre :** définition fonctionnelle des autorisations ; aucune implémentation de rôles ou de politiques techniques.

---

## 1. But

Transformer les principes de cloisonnement du lot 2 en une première matrice exploitable par les étapes C (contrats API), D (arbitrage technique) et E (fondation serveur).

Cette matrice est volontairement prudente : **refus par défaut**, droits explicites, contrôle serveur et vérification du périmètre à chaque opération. Elle constitue une base de discussion et non une décision métier déjà prise.

## 2. Règles non négociables proposées

1. Être authentifié ne signifie pas être autorisé.
2. Un rôle n'accorde des droits que dans son périmètre (tenant, domaine interne ou corpus).
3. Le tenant actif fourni par le client est un contexte à vérifier, jamais une preuve d'appartenance.
4. Toute opération vérifie l'acteur, l'action, la ressource, le périmètre, l'état et la finalité applicable.
5. Les relations entre ressources sont contrôlées : pas de traversée indirecte d'un tenant à l'autre.
6. Les recherches, exports, fichiers, notifications, traitements asynchrones et API appliquent les mêmes règles.
7. Les accès privilégiés sont distincts, limités, motivés et audités.
8. Une projection partagée ne confère jamais un droit sur l'objet source.
9. Une restriction, opposition, révocation ou suspension prévaut sur une autorisation antérieure incompatible.
10. Toute permission non explicitement accordée est refusée.

## 3. Acteurs de référence — rôles fonctionnels provisoires

| Code | Acteur | Périmètre | Statut |
|---|---|---|---|
| VISITOR | Visiteur non authentifié | Public uniquement | Socle de sécurité proposé |
| CLIENT_OWNER | Responsable d'un tenant client | Son tenant uniquement | Rôle à arbitrer |
| CLIENT_MEMBER | Membre d'un tenant client | Son tenant, selon attribution | Rôle à arbitrer |
| CRM_OPERATOR | Opérateur CRM MajestiOS | CRM interne, selon permissions | Rôle à arbitrer |
| CRM_MANAGER | Responsable CRM MajestiOS | CRM interne, selon permissions étendues | Rôle à arbitrer |
| MODERATOR | Modérateur de publications | File et objets de modération attribués | Rôle à arbitrer |
| TECH_ADMIN | Administrateur technique | Administration technique, sans droit métier implicite | Principe de séparation à confirmer |
| SERVICE_ACCOUNT | Compte technique | Ressources et opérations explicitement déclarées | Identité technique à définir |

Les noms sont des codes de travail. Ils ne doivent pas être implémentés tels quels sans arbitrage du modèle de rôles et des responsabilités.

## 4. Ressources et actions

### 4.1 Ressources

- **PublicProjection** : champs explicitement publiés d'une annonce ou d'un contenu.
- **TenantProfile** : paramètres et informations de l'espace client.
- **TenantMembership** : membres, invitations, rôles et états d'appartenance.
- **TenantWorkspace** : dossiers et espaces de travail du tenant.
- **TenantDocument** : fichiers et métadonnées appartenant au tenant.
- **TenantActivity** : commentaires, activités et historique du tenant.
- **CRMCompany / CRMContact** : fiches et relations CRM internes.
- **CRMActivity / CRMOpportunity** : activités, signaux qualifiés et opportunités internes.
- **CRMProjection** : projection de champs explicitement partagés vers un tenant.
- **ModerationItem** : contenu soumis à modération et décision associée.
- **BrainCorpus / BrainDocument** : corpus et documents indexables selon droits.
- **AuditEvent** : événements d'audit à lecture restreinte.

### 4.2 Actions

| Action | Définition |
|---|---|
| DISCOVER | Découvrir qu'une ressource existe |
| READ | Lire son contenu autorisé |
| CREATE | Créer une ressource |
| UPDATE | Modifier une ressource |
| DELETE | Supprimer ou demander la suppression |
| INVITE | Inviter un membre |
| ASSIGN | Attribuer ou modifier un rôle |
| SHARE | Autoriser une projection vers un autre périmètre |
| EXPORT | Extraire ou télécharger des données |
| MODERATE | Approuver, refuser ou retirer une publication |
| ADMINISTER | Configurer un service ou une ressource technique |
| AUDIT_READ | Consulter une trace d'audit |

DISCOVER est distinct de READ : masquer le contenu sans masquer l'existence peut déjà révéler une information confidentielle.

## 5. Matrice provisoire des droits

Légende :
- **Oui** : autorisation fonctionnelle proposée, sous réserve du périmètre et des contrôles.
- **Conditionnel** : seulement avec permission dédiée, affectation explicite ou règle de workflow.
- **Non** : refus par défaut.
- **N/A** : hors périmètre fonctionnel de l'acteur.

| Ressource / action | VISITOR | CLIENT_OWNER | CLIENT_MEMBER | CRM_OPERATOR | CRM_MANAGER | MODERATOR | TECH_ADMIN | SERVICE_ACCOUNT |
|---|---|---|---|---|---|---|---|---|
| PublicProjection — DISCOVER/READ | Oui | Oui | Oui | Oui | Oui | Oui | Non | Conditionnel |
| TenantProfile — READ | Non | Oui | Conditionnel | Non | Non | Non | Non | Conditionnel |
| TenantProfile — UPDATE | Non | Oui | Non | Non | Non | Non | Non | Conditionnel |
| TenantMembership — READ | Non | Oui | Conditionnel | Non | Non | Non | Non | Conditionnel |
| TenantMembership — INVITE | Non | Conditionnel | Non | Non | Non | Non | Non | Conditionnel |
| TenantMembership — ASSIGN | Non | Conditionnel | Non | Non | Non | Non | Non | Non par défaut |
| TenantWorkspace — READ | Non | Oui | Conditionnel | Non | Non | Non | Non | Conditionnel |
| TenantWorkspace — CREATE/UPDATE | Non | Oui | Conditionnel | Non | Non | Non | Non | Conditionnel |
| TenantWorkspace — DELETE | Non | Conditionnel | Non | Non | Non | Non | Non | Non par défaut |
| TenantDocument — READ/EXPORT | Non | Oui | Conditionnel | Non | Non | Non | Non | Conditionnel |
| TenantDocument — CREATE | Non | Oui | Conditionnel | Non | Non | Non | Non | Conditionnel |
| TenantDocument — UPDATE/DELETE | Non | Conditionnel | Conditionnel | Non | Non | Non | Non | Non par défaut |
| TenantActivity — READ/CREATE | Non | Oui | Conditionnel | Non | Non | Non | Non | Conditionnel |
| CRMCompany / CRMContact — READ | Non | Non | Non | Conditionnel | Conditionnel | Non | Non | Conditionnel |
| CRMCompany / CRMContact — UPDATE | Non | Non | Non | Conditionnel | Conditionnel | Non | Non | Conditionnel |
| CRMActivity / CRMOpportunity — READ/UPDATE | Non | Non | Non | Conditionnel | Conditionnel | Non | Non | Conditionnel |
| CRMProjection — SHARE | Non | Non | Non | Conditionnel | Conditionnel | Non | Non | Non par défaut |
| CRMProjection — READ côté client | Non | Conditionnel | Conditionnel | N/A | N/A | N/A | Non | Conditionnel |
| ModerationItem — READ | Non | Non | Non | Non | Non | Conditionnel | Non | Conditionnel |
| ModerationItem — MODERATE | Non | Non | Non | Non | Non | Conditionnel | Non | Non par défaut |
| BrainCorpus / BrainDocument — READ | Non | Conditionnel | Conditionnel | Conditionnel | Conditionnel | Non | Non | Conditionnel |
| BrainCorpus / BrainDocument — ADMINISTER | Non | Non | Non | Non | Non | Non | Non | Conditionnel |
| AuditEvent — AUDIT_READ | Non | Non | Non | Conditionnel | Conditionnel | Conditionnel | Non | Conditionnel |

Cette matrice ne remplace pas une matrice détaillée par attribut. Les droits « Conditionnel » doivent être décomposés en permissions nommées, avec critères d'attribution, portée et durée. Aucun droit ne doit être accordé simplement parce qu'une ligne porte un rôle.

## 6. Contrôles additionnels obligatoires

### 6.1 Tenant client

- CLIENT_OWNER ne gère que les membres et espaces de son tenant.
- Le transfert de propriété du tenant ne peut pas être une simple modification libre de rôle ; il doit suivre un workflow audité.
- CLIENT_MEMBER n'obtient que les permissions explicitement attribuées.
- Un membre ne peut pas s'accorder lui-même des droits supplémentaires.
- Les rôles et appartenances suspendus ou révoqués sont refusés côté serveur.

### 6.2 CRM interne

- CRM_OPERATOR ne reçoit pas un accès global par défaut.
- CRM_MANAGER ne contourne pas les restrictions de finalité, oppositions ou restrictions d'usage.
- La consultation de données sensibles et les exports peuvent exiger une permission distincte.
- L'accès au CRM ne confère pas le droit de partager une fiche vers un tenant.
- SHARE est une action dédiée, distincte de READ et UPDATE.

### 6.3 Modération

- MODERATOR accède uniquement aux éléments attribués à la modération.
- Il peut décider du statut de publication selon le workflow, mais ne reçoit pas d'accès aux notes CRM internes.
- La décision de modération et la projection publique sont deux ressources distinctes.
- Une décision doit conserver l'auteur, la date, le motif et la version du contenu examiné.

### 6.4 Administration technique et comptes de service

- TECH_ADMIN administre l'infrastructure sans accès métier automatique.
- Un accès exceptionnel aux données métier doit être séparé, temporaire, approuvé, justifié et audité.
- SERVICE_ACCOUNT possède une liste explicite de ressources, actions, environnements et conditions d'exécution.
- Aucun secret ou compte technique partagé ne doit devenir une identité d'utilisateur humain.

## 7. Contrat d'autorisation à appliquer à chaque requête

Avant toute opération métier, le backend devra établir et vérifier :

1. identité authentifiée et état du compte ;
2. appartenance active et rôle dans le périmètre ;
3. permission correspondant à l'action demandée ;
4. propriétaire et périmètre de la ressource ;
5. cohérence du périmètre de toutes les ressources liées ;
6. finalité et restrictions applicables ;
7. état métier (brouillon, publié, révoqué, archivé, etc.) ;
8. autorisation d'export ou de partage si l'opération sort du périmètre ;
9. trace d'audit appropriée sans copie inutile du contenu sensible.

Une décision d'autorisation doit être refusée si un contrôle obligatoire ne peut pas être effectué. Le frontend peut masquer les actions interdites pour l'expérience utilisateur, mais ce masquage n'est jamais un contrôle de sécurité.

## 8. Cas de test directement dérivés de la matrice

| ID | Précondition | Tentative | Résultat attendu |
|---|---|---|---|
| PERM-01 | Client A connecté | Lire un workspace de B | Refus sans divulgation |
| PERM-02 | Client A membre simple | Modifier les rôles de A | Refus |
| PERM-03 | CLIENT_OWNER de A | Lire une fiche CRM interne | Refus |
| PERM-04 | CRM_OPERATOR sans droit SHARE | Partager une fiche CRM | Refus |
| PERM-05 | CRM_OPERATOR autorisé à lire | Exporter le CRM sans permission EXPORT | Refus |
| PERM-06 | MODERATOR affecté à un contenu | Lire les notes internes CRM liées | Refus |
| PERM-07 | TECH_ADMIN | Lire une pièce privée métier | Refus par défaut |
| PERM-08 | SERVICE_ACCOUNT limitée à l'indexation BrainOS | Lire une activité CRM | Refus |
| PERM-09 | Ancien membre révoqué | Réutiliser une session active | Refus selon délai de révocation fixé |
| PERM-10 | Projection CRM révoquée | Lire la projection depuis le tenant | Refus |
| PERM-11 | Ressource inexistante ou interdite | Comparer les réponses API | Pas de fuite d'existence par réponse |
| PERM-12 | Restriction commerciale active | Déclencher une action de prospection | Action bloquée |
| PERM-13 | Client A | Télécharger un fichier de B via URL directe | Refus |
| PERM-14 | CLIENT_MEMBER sans droit DELETE | Supprimer un document | Refus |
| PERM-15 | Recherche multi-tenant | Rechercher une entreprise | Aucun résultat privé hors périmètre |

Les tests doivent être exécutés au niveau API et base de données lorsque la technologie le permet, pas uniquement dans l'interface.

## 9. Décisions qui restent nécessaires

| ID | Arbitrage | Proposition de départ | Statut |
|---|---|---|---|
| P-01 | Rôles client initiaux | CLIENT_OWNER + CLIENT_MEMBER, permissions dédiées ensuite | À arbitrer |
| P-02 | Gestion des invitations | Invitation par CLIENT_OWNER, acceptation par utilisateur | À arbitrer |
| P-03 | Multi-tenant utilisateur | Autoriser un utilisateur à appartenir à plusieurs tenants, contexte choisi puis vérifié côté serveur | À arbitrer |
| P-04 | Dossiers/workspaces | Plusieurs workspaces possibles dans un tenant, visibilité attribuable par workspace | À arbitrer |
| P-05 | Partage CRM | Permission SHARE indépendante de READ/UPDATE | À arbitrer |
| P-06 | Export | Permission EXPORT distincte de READ | À arbitrer |
| P-07 | Administration d'urgence | Procédure temporaire à double contrôle et audit | À arbitrer |
| P-08 | Révocation | Révocation côté serveur et invalidation des sessions selon délai cible à définir | À arbitrer |
| P-09 | BrainOS | Droits évalués par corpus et document, sans héritage automatique du CRM | À arbitrer |
| P-10 | Audit | Lecture du journal réservée à des permissions dédiées | À arbitrer |

## 10. Conditions de passage aux contrats API (étape C)

La matrice pourra être traduite en contrats API lorsque :

- chaque rôle et permission aura un propriétaire fonctionnel ;
- les droits conditionnels auront été décomposés ;
- le modèle d'appartenance et de workspace sera arbitré ;
- les règles de partage, export et révocation seront définies ;
- les réponses de refus seront harmonisées sans divulgation ;
- les scénarios PERM-01 à PERM-15 seront acceptés comme exigences de test.

## 11. Hors périmètre

Ce document ne crée aucun rôle dans le code, aucune policy RLS, aucun middleware, aucune permission Supabase, aucune route API et aucun utilisateur. Il ne constitue pas une validation juridique ni une matrice finale signée.

## 12. Références

- [Lot 2.2 — Modèle logique conceptuel](LOT-2-MODELE-LOGIQUE-CONCEPTUEL.md)

- [Lot 2 — Propriété des données et cloisonnement](LOT-2-PROPRIETE-DONNEES-CLOISONNEMENT.md)
- [Étape B — Modèle de données et cloisonnement](ETAPE-B-MODELE-DONNEES-CLOISONNEMENT.md)
- [Étape C — Contrats API et événements](ETAPE-C-CONTRATS-API-EVENEMENTS.md)
- [Référentiel A/B/C](CONSOLIDATION-A-B-C-REFERENTIEL.md)
