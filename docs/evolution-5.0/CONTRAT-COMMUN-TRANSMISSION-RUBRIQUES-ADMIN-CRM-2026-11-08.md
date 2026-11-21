# Contrat commun de transmission — rubriques, Administration et CRM

**Date :** 8 novembre 2026  
**Branche de travail :** `feature/crm-atomic-integration`  
**Statut :** conception fonctionnelle et technique proposée, à valider avant implémentation.  
**Dépendances documentaires :** [Audit des circuits d'information](AUDIT-CIRCUITS-INFORMATION-IMMEUBLE-RUBRIQUES-CRM-ADMIN-2026-11-08.md), [Matrice de circulation](MATRICE-CIRCULATION-RUBRIQUES-CRM-2026-11-08.md), [Plan stratégique acquisition, circulation, CRM et IA](PLAN-STRATEGIQUE-ACQUISITION-CIRCULATION-CRM-IA-2026-11-08.md).

> Ce document formalise le contrat commun de circulation. Il ne crée aucune table, migration, politique RLS, fonction Edge, permission, automatisation ou interface. Les noms de champs et les contrats JSON sont conceptuels tant qu'ils ne sont pas rapprochés du schéma et des fonctions réellement déployés.

## 1. Décision structurante

MajestiOS doit disposer d'un **circuit commun de transmission** utilisable par toutes les rubriques et tous les moteurs métier. Il ne s'agit pas d'un simple bouton « envoyer au CRM ».

Le circuit couvre :
1. la demande d'un membre ou la détection d'un signal ;
2. la préparation dans la rubrique d'origine ;
3. la normalisation et les contrôles ;
4. la revue et la décision de l'Administration ;
5. l'affectation au bénéficiaire et, si nécessaire, à un collaborateur ;
6. la restitution dans l'espace et le dossier autorisés ;
7. la capitalisation CRM, lorsqu'elle est pertinente et autorisée ;
8. le retour vers la rubrique et le résultat d'origine.

**Toutes les rubriques peuvent être à l'origine ou à destination d'une transmission.** Le flux n'est donc ni limité à Prospection → CRM, ni réservé aux données d'entreprises. Il doit pouvoir transporter un résultat de marché, une demande de sous-traitance, une analyse, un dossier d'accompagnement, une information de Réseau, un diagnostic de Réputation virtuelle ou tout autre objet métier autorisé.

L'immeuble interactif reste le plan d'orientation. Il ouvre la rubrique et le dossier ; il ne valide, ne transporte et ne stocke pas les données. Le CRM reste transversal et ne devient pas un étage.

## 2. Vocabulaire et unité de travail

### 2.1 Transmission

Une **transmission** est le dossier gouverné qui porte le passage d'une information d'un contexte métier vers un ou plusieurs destinataires autorisés. Elle possède un identifiant stable, une finalité, un périmètre d'accès, une origine, une destination, des participants, un état, un historique et un résultat.

Elle peut contenir un ou plusieurs éléments métier sélectionnés. La sélection explicite est obligatoire : aucun transfert massif ou implicite d'une page entière, d'une recherche ou d'un lot de résultats.

### 2.2 Résultat métier

Le résultat métier reste détenu par son domaine : annonce, entreprise, établissement, contact, opportunité, dossier AO, besoin de sous-traitance, diagnostic, événement, analyse ou document. La transmission le référence ou en transporte une représentation normalisée minimale ; elle ne remplace pas l'objet métier source.

### 2.3 Demande et transmission

Une demande est l'expression d'un besoin. Elle peut être créée par un membre, un collaborateur ou un processus métier autorisé. Une demande peut produire plusieurs transmissions. Un signal détecté par un moteur peut aussi ouvrir une transmission sans demande humaine préalable, à condition que la finalité et l'autorité de détection soient définies.

### 2.4 Transmission et CRM

Une transmission peut aboutir à zéro, un ou plusieurs liens CRM. Le CRM n'est pas la boîte de réception universelle de toutes les données. Une donnée peut être restituée dans une rubrique ou à un bénéficiaire sans devenir une entreprise, un contact ou une opportunité CRM.

## 3. Participants et séparation des responsabilités

Les fonctions suivantes sont distinctes, même si certaines peuvent être occupées par la même personne dans un cas donné.

| Fonction | Responsabilité | Limite |
|---|---|---|
| Demandeur | Exprime le besoin et son contexte | N'est pas automatiquement le bénéficiaire ni le validateur |
| Bénéficiaire | Reçoit le résultat validé | Ne reçoit que les éléments autorisés pour sa finalité |
| Préparateur | Constitue, normalise et documente le dossier | Ne peut pas s'auto-attribuer une validation Administration |
| Collaborateur affecté | Réalise le traitement confié | Accès limité au dossier et aux actions nécessaires |
| Validateur Administration | Contrôle, demande un complément, valide ou refuse | Habilitation dédiée ; un rôle générique de membre ne suffit pas |
| Responsable de diffusion | Confirme la destination et déclenche la restitution si cette responsabilité est séparée | Ne peut pas élargir les droits du bénéficiaire |
| Administrateur technique | Gère l'infrastructure et les habilitations techniques | N'est pas automatiquement décisionnaire métier |
| Cheexpeer (plus tard) | Analyse, rapproche, prépare, signale et recommande | Lecture/préparation par défaut ; aucun pouvoir implicite de validation ou de diffusion |

Le système doit conserver séparément les identifiants du demandeur, du bénéficiaire, du préparateur, du validateur et du collaborateur affecté. Ne jamais déduire le bénéficiaire de `created_by`, ni le validateur du rôle `owner` ou `admin` sans habilitation métier explicite.

## 4. Contrat logique minimal

Les noms ci-dessous définissent une sémantique, pas encore le schéma SQL.

### 4.1 Identité et contexte
- `transmission_id` : identifiant stable.
- `organization_id` : tenant propriétaire du dossier ; les transferts inter-organisations nécessitent une règle et une autorisation explicites.
- `request_id` : demande liée, facultative si la transmission provient d'un signal.
- `origin_domain`, `origin_rubric`, `origin_route`, `origin_record_type`, `origin_record_id` : contexte précis de provenance.
- `origin_query_context` : critères utiles à la reproduction du résultat, minimisés et sans secrets.
- `destination_domain`, `destination_type`, `destination_id` : destination fonctionnelle.
- `created_by`, `beneficiary_id`, `prepared_by`, `assigned_to`, `validated_by` : acteurs distincts.

### 4.2 Finalité et gouvernance
- `purpose_code` et `purpose_description` : finalité déterminée.
- `legal_basis_reference` : référence à la base légale / autorisation documentée, lorsqu'applicable ; ne pas inventer une base légale par défaut.
- `data_classification` : niveau de sensibilité.
- `allowed_actions` : actions permises pour ce dossier.
- `access_scope` : organisation, participants et ressources explicitement autorisés.
- `retention_rule`, `retention_until` : règle et échéance de conservation.
- `decision_code`, `decision_reason`, `decision_at` : décision Administration et motif.
- `delivery_receipt` : résultat de restitution et accusé de réception, le cas échéant.

### 4.3 Contenu, qualité et provenance
- `items[]` : liste explicite d'éléments métier sélectionnés, avec type, identifiant d'origine et rôle dans le dossier.
- `normalized_payload` : données normalisées nécessaires à la destination ; ne pas recopier inutilement un document source complet.
- `field_provenance[]` : champ, valeur, origine, date d'observation, statut (source, déclaré, calculé, inféré, vérifié humainement).
- `evidence_refs[]` : références de preuve autorisées.
- `quality_checks[]` : contrôles exécutés, résultat, version de règle et date.
- `deduplication_refs[]` : correspondances candidates et décision de rapprochement.
- `crm_links[]` : identifiants des objets CRM créés ou reliés après autorisation.

Ne pas confondre provenance technique et visibilité utilisateur. Dans Prospection, les noms, logos, catalogues et sélecteurs de fournisseurs restent invisibles. Les détails fournisseurs sont conservés uniquement dans la traçabilité technique interne habilitée.

## 5. Cycle de vie : états séparés et transitions contrôlées

Un champ `status` unique ne doit pas mélanger l'instruction, la décision, l'affectation, la livraison et la capitalisation.

### 5.1 États fonctionnels proposés

| Dimension | États proposés |
|---|---|
| Instruction | `draft`, `submitted`, `preparing`, `needs_information`, `ready_for_review`, `closed`, `cancelled` |
| Validation Administration | `pending`, `approved`, `rejected`, `changes_requested` |
| Affectation | `unassigned`, `assigned`, `reassigned`, `completed` |
| Restitution | `not_ready`, `ready`, `delivering`, `delivered`, `delivery_failed`, `acknowledged` |
| Capitalisation CRM | `not_applicable`, `pending_review`, `linked`, `created`, `blocked_duplicate`, `failed` |

Les états de chaque dimension sont indépendants. Exemple : une transmission peut être `approved`, `assigned` et `delivery_failed`. Une panne de notification ne doit pas annuler la décision Administration.

### 5.2 Transitions de référence

1. `draft → submitted` : le demandeur ou préparateur soumet un dossier complet au regard du contrat.
2. `submitted → preparing` : un préparateur autorisé prend en charge le dossier.
3. `preparing → needs_information` : le préparateur ou l'Administration demande un élément manquant ; le motif est obligatoire.
4. `preparing → ready_for_review` : contrôles de préparation terminés.
5. `ready_for_review → approved | rejected | changes_requested` : décision d'un validateur Administration habilité, avec motif et horodatage.
6. `approved → assigned` : affectation à un bénéficiaire et/ou collaborateur autorisé, avec périmètre d'accès.
7. `assigned → ready → delivering → delivered` : préparation et livraison contrôlées.
8. `delivered → acknowledged` : accusé de réception facultatif ou requis selon le type de transmission.
9. `acknowledged → completed / closed` : clôture après traitement ou capitalisation.
10. Une réaffectation crée un événement ; elle ne réécrit pas l'ancien responsable ni l'historique.
11. Un refus, une annulation ou une clôture n'efface jamais le journal. Une réouverture est une transition distincte et motivée, jamais une modification silencieuse de l'état passé.

Les transitions sont exécutées côté serveur. Le client ne peut pas écrire directement une valeur d'état arbitraire. Les actions de validation et de diffusion sont distinctes.

## 6. Historique immuable et preuve de circulation

Chaque action significative produit un événement append-only :
- création et soumission ;
- changement de préparateur ;
- demande de complément et réponse ;
- contrôles qualité exécutés ;
- décision Administration, motif et version des règles ;
- affectation et réaffectation ;
- livraison, échec et nouvelle tentative ;
- accusé de réception ;
- création, mise à jour ou rattachement CRM ;
- correction, annulation, réouverture et clôture ;
- consultation ou export lorsque le niveau de sensibilité l'exige.

Un événement conserve au minimum : `event_id`, `transmission_id`, `event_type`, `actor_id` (ou identité de service), `occurred_at`, `from_state`, `to_state`, `reason`, `payload_diff_ref`, `correlation_id` et résultat d'exécution.

L'historique métier ne doit pas être réécrit pour masquer une erreur. Une correction est un nouvel événement qui référence l'événement corrigé. Les journaux techniques ne doivent pas contenir de secrets ni dupliquer inutilement des données personnelles.

## 7. Contrat d'API conceptuel

Les noms d'endpoint sont indicatifs. Toute opération doit être authentifiée, autorisée côté serveur, limitée à l'organisation et à la finalité, validée par schéma et journalisée.

| Opération | Effet | Garde-fous |
|---|---|---|
| `createTransmission` | Crée un brouillon et ses éléments sélectionnés | Organisation, origine, finalité, bénéficiaire éventuel |
| `submitTransmission` | Soumet à instruction | Champs requis, preuve de sélection, contrôle anti-doublon |
| `claimPreparation` | Prend en charge la préparation | Habilitation de préparateur, affectation non concurrente |
| `requestInformation` | Demande un complément | Motif, destinataire, périmètre des données |
| `submitForReview` | Place le dossier dans la file Administration | Contrôles obligatoires terminés |
| `decideTransmission` | Valide, refuse ou demande correction | Capacité Administration dédiée, séparation des tâches si exigée, motif |
| `assignTransmission` | Affecte ou réaffecte | Bénéficiaire autorisé, contrôle d'accès recalculé |
| `deliverTransmission` | Restitue les éléments | Décision approuvée, destination et permissions revalidées |
| `acknowledgeTransmission` | Enregistre la réception | Destinataire ou service autorisé |
| `linkCrmRecord` | Crée ou relie un objet CRM | Confirmation adaptée, déduplication, autorisation d'écriture |
| `closeTransmission` | Clôture le dossier | Conditions de fin, rétention et événements complets |

### 7.1 Exemple de commande de création (illustratif)

```json
{
  "origin": {
    "domain": "market_monitoring",
    "rubric": "marches_publics",
    "route": "/veille-marches.html",
    "record_type": "public_tender",
    "record_id": "source-record-opaque-id"
  },
  "items": [
    {
      "record_type": "public_tender",
      "record_id": "source-record-opaque-id",
      "selection_reason": "À examiner pour adéquation avec les compétences documentées"
    }
  ],
  "requester_id": "user-id",
  "beneficiary_id": "beneficiary-user-id",
  "organization_id": "organization-id",
  "purpose": {
    "code": "commercial_opportunity_review",
    "description": "Évaluer la pertinence de cet avis pour l'organisation"
  },
  "destination": {
    "domain": "administration_review",
    "type": "controlled_queue"
  }
}
```

### 7.2 Exemple d'événement de décision (illustratif)

```json
{
  "event_type": "administration.decision.approved",
  "transmission_id": "transmission-id",
  "actor_id": "authorized-reviewer-id",
  "occurred_at": "2026-11-08T10:15:00Z",
  "from_state": "ready_for_review",
  "to_state": "approved",
  "reason": "Identité, provenance, finalité et destinataire vérifiés",
  "checks": [
    {"code": "origin_traceable", "result": "passed"},
    {"code": "recipient_authorized", "result": "passed"},
    {"code": "duplicate_check", "result": "passed"}
  ]
}
```

Ces exemples n'affirment pas que les identifiants, routes, endpoints ou états existent dans le code actuel. Ils servent à fixer le sens du contrat.

## 8. Règles de circulation entre rubriques et CRM

- Une rubrique peut recevoir une transmission en retour si l'utilisateur y possède toujours les droits.
- Le bénéficiaire peut être différent du demandeur ; le demandeur ne reçoit pas automatiquement les données remises à un tiers.
- Un collaborateur affecté ne voit que les éléments utiles à sa mission. Après réaffectation, son accès est recalculé et peut être retiré.
- Le CRM ne reçoit que les objets pertinents pour le suivi relationnel : entreprise, établissement, contact, opportunité, activité ou lien vers un dossier. Un document ou une analyse ne devient pas automatiquement une opportunité.
- Les objets CRM conservent un lien vers la transmission et le contexte d'origine. Le retour CRM → rubrique doit vérifier que la route et le résultat sont encore accessibles.
- Les doublons sont signalés avant création ou rapprochement. Les rapprochements ambigus sont soumis à décision humaine ; aucune fusion automatique sur le seul nom ou l'adresse.
- L'échec de livraison ne doit pas conduire à une création CRM répétée. Les opérations d'écriture doivent être idempotentes à l'aide d'une clé d'opération stable.
- Les transferts entre organisations ou tenants sont interdits par défaut. Ils exigent une autorisation documentée, une finalité et un destinataire identifiés.

## 9. Sécurité, confidentialité et conformité

1. **RLS et autorisation serveur :** chaque lecture/écriture est contrôlée sur la ressource, l'organisation, le participant, la finalité et l'action. Une validation Administration ne remplace jamais les politiques RLS.
2. **Habilitations dédiées :** séparer les rôles d'appartenance (`owner/admin/member/viewer`) des capacités métier Administration (lire, valider, refuser, corriger, affecter, diffuser).
3. **Moindre privilège :** pas d'accès par défaut à toutes les transmissions d'une organisation ; les périmètres de lecture sont explicites.
4. **Séparation des tâches :** selon le risque, interdire au préparateur de valider son propre dossier ; appliquer cette règle comme contrôle serveur, pas comme simple consigne d'interface.
5. **Finalité et minimisation :** ne transporter que les champs nécessaires. Une référence sécurisée à un document est préférable à sa duplication intégrale.
6. **Durée de conservation :** définir une règle par catégorie de dossier et supprimer/archiver les copies et données dérivées conformément à cette règle.
7. **Opposition et droits :** propager les restrictions applicables aux données personnelles vers les copies, index et destinataires concernés.
8. **Protection des documents :** traiter les contenus externes comme non fiables ; ils ne peuvent pas modifier les règles ou donner des instructions à Cheexpeer.
9. **Traçabilité :** journaliser les décisions, accès sensibles, exports, affectations et écritures CRM sans exposer les secrets.
10. **Fournisseurs invisibles :** aucun nom, logo, catalogue ou choix de source dans les interfaces de Prospection ; provenance fournisseur réservée aux écrans et journaux techniques autorisés.

## 10. Cheexpeer : délégation ultérieure, pas autorité implicite

Cheexpeer pourra progressivement :
- résumer une demande et proposer la rubrique de destination ;
- normaliser un résultat et relever les champs manquants ;
- rapprocher des entités et signaler les doublons possibles ;
- préparer une transmission et une synthèse sourcée ;
- repérer les dossiers en attente, les incohérences et les retards ;
- suggérer une affectation ou une action suivante.

Au démarrage, elle intervient en lecture et préparation. Les transitions, contrôles de permission, décisions Administration et écritures CRM restent déterministes et exécutés côté serveur. Toute délégation ultérieure doit préciser les opérations permises, le périmètre de données, les seuils, la supervision, le journal et le mécanisme de suspension. Elle ne valide ni ne diffuse de sa propre initiative.

## 11. Modèle conceptuel minimal — sans préjuger du schéma final

Éviter de créer d'emblée cinq ou six tables séparées sans preuve qu'elles sont nécessaires. Le modèle logique minimal comprend :

1. **Transmission (agrégat principal)** : identité, organisation, origine, destination, finalité, état courant par dimension, participants principaux, décision et échéances.
2. **Éléments de transmission** : sélection explicite des résultats ou références métier contenus dans le dossier. Peut être une relation enfant ou un payload structuré, selon les cardinalités observées.
3. **Événements de transmission** : historique append-only des transitions et opérations.
4. **Participants / affectations** : à matérialiser séparément seulement si plusieurs bénéficiaires, préparateurs, validateurs ou affectations successives doivent être gérés indépendamment. Sinon, les participants courants peuvent être des champs de l'agrégat et les changements historiques des événements.
5. **Livraisons** : à séparer si une transmission peut être délivrée à plusieurs destinations ou nécessite des tentatives indépendantes. Sinon, l'état de livraison et les reçus peuvent rester dans l'agrégat avec leurs événements.
6. **Liens CRM** : relation explicite vers les objets CRM concernés, sans recopier les objets dans la transmission.

**Recommandation de conception :** commencer par un agrégat Transmission, une collection d'éléments, un journal d'événements et des références CRM. N'ajouter des tables de participants, livraisons ou pièces jointes que lorsque les cas d'usage et les contraintes de sécurité le justifient. Réutiliser `client_requests` seulement après analyse de ses dépendances, sans le transformer par défaut en table universelle.

## 12. Matrice de tests d'acceptation

| ID | Scénario | Résultat attendu |
|---|---|---|
| T01 | Une demande est initiée par un membre pour un autre bénéficiaire | Demandeur et bénéficiaire restent distincts ; seul le bénéficiaire autorisé reçoit le résultat |
| T02 | Un signal est détecté sans demande humaine | La transmission conserve l'identité du processus, sa finalité et la règle autorisant la détection |
| T03 | Un membre interne sans capacité Administration tente de valider | Refus côté serveur et RLS ; aucun changement d'état |
| T04 | Le préparateur tente de valider son propre dossier alors que la séparation des tâches est requise | Refus, événement de sécurité et dossier inchangé |
| T05 | Un administrateur client tente d'utiliser l'Administration MajestiOS | Refus ; les rôles du tenant client ne confèrent aucune capacité interne |
| T06 | Un collaborateur reçoit une affectation | Accès limité au dossier et aux éléments nécessaires |
| T07 | Le dossier est réaffecté | Ancien collaborateur perd les droits qui ne sont plus justifiés ; historique conservé |
| T08 | Un utilisateur tente de lire une transmission d'un autre tenant par API directe | Refus sans fuite de métadonnées |
| T09 | Un résultat est refusé par l'Administration | Aucune diffusion ni création CRM opérationnelle ; motif consultable aux seuls acteurs autorisés |
| T10 | Une livraison échoue puis est retentée | Pas de doublon ; l'état de validation reste approuvé et les tentatives sont historisées |
| T11 | Une fiche entreprise existe déjà | Rattachement proposé ; pas de fusion automatique ni de duplication |
| T12 | Le résultat ne justifie pas une fiche CRM | Restitution possible sans création CRM |
| T13 | Un utilisateur revient d'une fiche CRM à la rubrique d'origine | Retour au contexte uniquement si la ressource est encore accessible |
| T14 | Une source technique est consultée depuis Prospection | Aucun nom de fournisseur ni catalogue n'est transmis au navigateur |
| T15 | Cheexpeer prépare une transmission | Brouillon/suggestion uniquement ; aucune validation, affectation ou diffusion sans autorisation dédiée |
| T16 | Une demande de suppression ou de limitation est appliquée | Propagation aux copies, pièces, index et destinataires selon la règle de conservation applicable |
| T17 | Une tentative de transition utilise un état interdit | Rejet serveur ; état courant et journal métier cohérents |
| T18 | Deux préparateurs prennent simultanément le même dossier | Une seule prise en charge gagne ; l'autre reçoit un conflit explicite |

Les tests doivent être exécutés avec plusieurs identités réelles de test : membre client, administrateur client, membre interne, agent Administration habilité, collaborateur affecté, collaborateur non affecté et utilisateur d'un autre tenant. Tester les API directement, pas uniquement les écrans.

## 13. Décisions à obtenir avant implémentation

Les principes suivants sont déjà établis par le porteur du projet : circulation inter-rubriques et CRM ; contrôle et validation Administration avant restitution ; bénéficiaire distinct possible du demandeur ; Cheexpeer déléguée progressivement sans autorité implicite.

Les points ci-dessous restent à préciser dans le dossier de conception avant toute migration :
1. Les catégories de données et règles de conservation correspondantes.
2. Les capacités Administration distinctes et les règles de séparation des tâches.
3. Les cas où une transmission comporte plusieurs bénéficiaires ou plusieurs livraisons.
4. Les demandes pouvant être visibles au demandeur, au bénéficiaire, à une équipe ou à aucun des deux avant validation.
5. Les éléments métier qui peuvent être restitués sans créer de fiche CRM.
6. La frontière exacte entre `client_requests` et le futur agrégat de transmission.
7. Le modèle d'idempotence, de reprise après erreur et de réouverture.

Aucune de ces questions ne doit être tranchée implicitement par le nom d'une colonne ou par une facilité d'implémentation.

## 14. Ordre de réalisation recommandé

1. Récupérer et versionner les sources exactes des fonctions Edge déployées ; établir la parité avant toute modification.
2. Finaliser la matrice des rôles et habilitations Administration, alignée sur les politiques RLS réelles.
3. Confronter ce contrat aux tables, fonctions SQL, fonctions Edge et dépendances actuelles ; produire un mapping précis champ logique → stockage existant / stockage manquant.
4. Choisir un flux pilote représentatif, puis écrire ses tests d'acceptation avant le code.
5. Proposer une migration minimale et réversible, avec sauvegarde et plan de retour arrière, pour validation explicite.
6. Implémenter le circuit serveur et ses contrôles ; ne pas faire confiance au statut fourni par le navigateur.
7. Tester le parcours de bout en bout, les refus d'accès, la réaffectation, les doublons et les erreurs de livraison.
8. Étendre aux autres rubriques uniquement après réussite du pilote.

**Critère de sortie :** une transmission choisie depuis une rubrique peut être préparée, contrôlée, validée par une capacité Administration dédiée, affectée, restituée au bon bénéficiaire, reliée au CRM si pertinent, puis retrouvée depuis la rubrique d'origine — sans élargissement des droits, perte de provenance ni écriture automatique non autorisée.

---

## Journal de périmètre

Pour cette étape, un document de conception est ajouté et référencé dans les deux index documentaires. Aucun code applicatif, schéma Supabase, politique RLS, fonction Edge, donnée, secret, branche de production ou déploiement n'est modifié. Aucun test d'exécution n'est déclaré : il s'agit d'une spécification à valider, non d'une fonctionnalité livrée.
