# Audit et optimisation des circuits d'information — Immeuble, rubriques, CRM et Administration

**Date du contrôle :** 8 novembre 2026  
**Branche examinée :** `feature/crm-atomic-integration`  
**Backend contrôlé en lecture seule :** projet Supabase `majestios-crm`, région `eu-west-3`, référence `qxaghcifdhugfskuscoc`  
**Périmètre :** circulation de l'information entre l'immeuble interactif, les rubriques et moteurs métier, l'Administration, le CRM et les membres / collaborateurs.  
**Statut :** audit de l'existant et architecture cible. Aucune modification applicative, migration, politique RLS, fonction Edge ou donnée Supabase n'a été effectuée.

---

## 1. Décision d'architecture à appliquer partout

L'immeuble est la **carte de navigation de l'activité**. Il conduit vers les rubriques et leurs dossiers ; il ne constitue ni une base de données ni un circuit de validation.

Les responsabilités doivent rester distinctes :

| Composant | Responsabilité dans le circuit |
|---|---|
| Immeuble interactif | Orienter vers la bonne rubrique, le dossier et la page métier. Le schéma doit rester fidèle à l'arborescence. |
| Rubriques et moteurs métier | Produire ou recueillir des informations dans leur contexte métier : prospection, marchés, accompagnement, réseau, réputation virtuelle, etc. |
| Administration | Contrôler la qualité, la provenance, la finalité, les doublons, les permissions et les conditions de diffusion ; valider, refuser, demander un complément, corriger ou affecter selon ses habilitations. |
| CRM | Capitaliser les informations métier validées et utiles au suivi : entreprises, établissements, contacts, opportunités et activités. Il reste transversal, pas un étage supplémentaire. |
| Membres et collaborateurs | Formuler une demande, recevoir les informations validées auxquelles ils ont droit, traiter les dossiers qui leur sont affectés et rendre compte du résultat. |
| Cheexpeer (plus tard) | Préparer, rapprocher, analyser, signaler et recommander dans le périmètre délégué. Elle ne remplace pas l'Administration et ne reçoit pas implicitement son pouvoir de validation. |

**Principe central :** les données peuvent circuler entre toutes les rubriques, moteurs, dossiers et le CRM. Leur circulation n'est toutefois ni une diffusion générale ni une écriture automatique : elle suit un circuit gouverné, traçable et soumis aux droits d'accès.

## 2. Circuit cible de bout en bout

Le circuit doit être commun à toutes les rubriques. Les règles métier et les schémas de données restent adaptés à chaque famille d'information.

1. **Demande ou détection** — un membre demande une information ou un moteur détecte un signal utile. Le contexte d'origine est capturé.
2. **Préparation** — la rubrique prépare le résultat, sans écriture prématurée dans le CRM.
3. **Normalisation** — le système structure les données et conserve les champs inconnus comme inconnus.
4. **Contrôles automatiques déterministes** — format, identifiants, cohérence, doublons, fraîcheur, provenance, finalité, minimisation et permissions.
5. **File Administration** — le dossier est présenté à un agent habilité avec les éléments de preuve, les anomalies et les décisions possibles.
6. **Décision Administration** — validation, rejet motivé, demande de complément, correction contrôlée ou retour au préparateur. La décision et son auteur sont conservés.
7. **Affectation** — après validation, désignation du bénéficiaire et, si nécessaire, du collaborateur chargé du traitement.
8. **Restitution** — livraison dans l'espace et le dossier autorisés du bénéficiaire ; notification éventuelle selon les préférences et règles applicables.
9. **Capitalisation CRM** — création ou mise à jour des objets CRM pertinents, uniquement si cela répond à une finalité métier définie et après contrôle des doublons.
10. **Suivi et retour** — les actions réellement réalisées sont consignées ; le membre ou collaborateur peut retrouver la rubrique, le dossier et le résultat d'origine.
11. **Clôture et conservation** — état final, durée de conservation, éventuelle purge et historique des décisions sont appliqués.

### Deux chemins d'entrée, un même contrôle

- **Chemin A — demande initiée par un membre :** demande → préparation par la rubrique ou l'équipe → Administration → affectation → restitution au demandeur ou à un autre bénéficiaire autorisé.
- **Chemin B — signal détecté par un moteur :** signal → préparation/qualification → Administration → affectation éventuelle → restitution au collaborateur habilité → capitalisation CRM si pertinente.

Le demandeur initial, le bénéficiaire final, le préparateur, le validateur et le collaborateur affecté sont des rôles distincts. Ils peuvent désigner des personnes différentes. Le système ne doit jamais déduire le bénéficiaire du seul créateur de la ligne.

## 3. Contrat minimal de circulation

Chaque transmission doit porter un identifiant stable et conserver au minimum :

| Champ logique | Finalité |
|---|---|
| `transmission_id` | Identifiant stable du dossier de circulation. |
| `requester_id` | Personne à l'origine de la demande, si elle existe. |
| `beneficiary_id` | Personne ou équipe autorisée à recevoir le résultat. |
| `assigned_to` | Collaborateur chargé du traitement, distinct du bénéficiaire si nécessaire. |
| `prepared_by` | Personne ou service ayant préparé le dossier. |
| `validated_by` | Personne habilitée ayant pris la décision Administration. |
| `organization_id` / périmètre | Organisation ou espace auquel les données peuvent être rattachées. |
| `origin_rubric`, `origin_route`, `origin_record_id` | Rubrique, dossier, page et résultat d'origine. |
| `destination` | Espace, dossier, utilisateur ou objet CRM destinataire. |
| `purpose` | Finalité précise et autorisée de la transmission. |
| `data_classification` | Nature et sensibilité des données transportées. |
| `source_provenance` | Référence technique, identifiant externe, URL, date de publication et date d'observation. |
| `validation_status` / `delivery_status` | Décision de contrôle et état de restitution, sans les confondre. |
| `decision_reason` | Motif de validation, refus, correction ou demande de complément. |
| `created_at`, `validated_at`, `delivered_at`, `closed_at` | Horodatages du cycle de vie. |
| `retention_until` | Échéance de conservation ou règle de purge applicable. |

Les noms ci-dessus sont des **champs logiques de contrat**, pas une proposition de migration immédiatement exécutable. Leur traduction en tables et colonnes doit être conçue après vérification de toutes les dépendances.

### Séparer les cycles d'état

Ne pas faire porter à un seul champ `status` toutes les étapes. Au minimum, distinguer :

- **état de la demande** : reçue, en instruction, complément attendu, acceptée, refusée, clôturée ;
- **état de validation** : à contrôler, validée, refusée, à corriger ;
- **état d'affectation** : non affectée, à affecter, affectée, réaffectée ;
- **état de restitution** : à préparer, prête, délivrée, échec, annulée ;
- **état de capitalisation CRM** : non pertinente, à préparer, créée, mise à jour, bloquée par doublon ou refusée.

Chaque transition doit avoir un acteur autorisé, une condition, une date et une trace. La validation Administration ne donne pas à elle seule accès à tous les destinataires.

## 4. Contrôles réalisés sur le backend réel

Le projet Supabase actuellement contrôlé est `majestios-crm` (`qxaghcifdhugfskuscoc`), et non l'ancien identifiant conservé dans le document historique `ETAT-BACKEND-SUPABASE.md`. Le schéma public comprend 15 tables et RLS est activé sur les 15. Les tables CRM et de registre d'entreprises sont encore vides au contrôle ; la base contient notamment une organisation interne, un espace membre et un profil. Les tables de demandes, entreprises, contacts, opportunités et activités ne contiennent pas encore de flux métier persistant.

### 4.1 Ce qui existe

- `organizations` et `organization_members` fournissent une séparation par organisation et une appartenance avec les rôles `owner`, `admin`, `member`, `viewer`.
- `businesses`, `contacts`, `opportunities` et `activities` forment un socle CRM multi-tenant.
- `businesses` et `opportunities` comportent `created_by` et `assigned_to`.
- Les opportunités conservent certains éléments d'origine : type de source, identifiant externe, URL et date de publication.
- `official_data_sources`, `company_registry`, `company_registry_establishments`, `official_source_sync_runs` et `company_source_observations` forment un début de registre de données officielles et de traçabilité technique.
- `client_requests` existe pour les demandes émises depuis un espace client authentifié.
- Les activités CRM sont prévues comme historique append-only pour les rôles applicatifs.

### 4.2 Ce qui manque pour le circuit global décidé

Le schéma actuellement déployé ne fournit pas encore de mécanisme complet de circulation inter-rubriques :

- aucune table dédiée ne matérialise une transmission entre une rubrique, l'Administration, un bénéficiaire et le CRM ;
- aucune file de validation Administration avec décisions, motifs, preuves et transitions n'est identifiée ;
- `client_requests` ne comporte pas de champ distinct pour le bénéficiaire, le préparateur, le validateur ou le collaborateur affecté ;
- `client_requests` ne conserve pas la rubrique, la route et le résultat d'origine ;
- les objets CRM ne portent pas de lien commun vers un dossier de transmission ni le demandeur initial et le bénéficiaire final ;
- les observations officielles sont un registre de provenance technique, pas une file de dossiers métier validés ;
- aucune restitution contrôlée et réciproque vers l'espace du bénéficiaire n'est démontrée par ce seul schéma.

**Conséquence :** la fondation CRM existe, mais elle ne doit pas être confondue avec le circuit global d'information. Il faut construire le lien de circulation et de gouvernance avant de brancher toutes les rubriques.

## 5. Écarts d'autorisation observés — à traiter en priorité

Les politiques RLS actives ont été lues directement sur le projet, sans modification.

### P1 — Lecture des demandes plus large que le nom de la politique

La politique `Requesters and internal staff can read requests` sur `client_requests` autorise la lecture si l'utilisateur est **membre de l'organisation** ou membre du personnel interne. La condition ne vérifie pas `created_by = auth.uid()`. Ainsi, un membre d'un même espace client peut lire les demandes créées par d'autres membres de son organisation.

Cela peut être une règle métier volontaire pour certains espaces collaboratifs, mais elle ne correspond pas à une règle « demandeur uniquement ». Il faut arbitrer la visibilité attendue par type de demande et par rôle, puis appliquer et tester le principe du moindre privilège.

### P1 — Le rôle « Administration » n'est pas isolé dans le contrôle des demandes

La politique `Internal staff can update request status` s'appuie sur `private.is_internal_staff()`. La fonction autorise les rôles internes `owner`, `admin` **et `member`**. Un membre de l'organisation interne peut donc mettre à jour le statut d'une demande au niveau RLS ; le contrôle n'est pas limité à un rôle Administration dédié.

Le rôle fonctionnel de contrôle et de validation doit être explicite. Il ne faut pas assimiler automatiquement tout membre interne à un administrateur habilité à valider et diffuser les dossiers.

### P1 — Le catalogue et les observations de sources sont lisibles par tout utilisateur authentifié

Les politiques de `official_data_sources` et `company_source_observations` utilisent une condition de lecture `true` pour le rôle `authenticated`. Les tables `company_registry` et `company_registry_establishments` sont également lisibles par tout utilisateur authentifié.

En particulier, `company_source_observations` contient un `payload` JSON et des références de source. L'invisibilité des fournisseurs dans l'interface de Prospection n'est donc pas, à elle seule, une garantie de confidentialité au niveau de l'API. Un utilisateur authentifié peut interroger directement les tables si les privilèges API correspondants sont disponibles.

Il faut distinguer les données publiques d'entreprise dont l'accès large est assumé, les métadonnées techniques des fournisseurs et les observations brutes. Les deux dernières catégories doivent rester réservées aux fonctions internes autorisées. Cette restriction doit être conçue sans casser la recherche métier ni les fonctions serveur.

### P1 — La validation et la diffusion ne sont pas représentées comme deux décisions distinctes

Les politiques RLS contrôlent l'accès aux tables existantes, mais elles ne matérialisent pas un workflow complet « contrôle → validation → affectation → restitution ». Il manque donc une preuve technique commune qu'un dossier a été validé pour une finalité et un destinataire donnés.

**Aucune de ces anomalies n'a été corrigée dans le backend pendant cet audit.** Une modification RLS ou une migration exige une proposition précise, une sauvegarde/point de retour, des tests multi-utilisateurs et l'autorisation explicite avant application.

## 6. Matrice des flux à garantir

| Origine | Destination intermédiaire | Contrôle Administration | Destination finale | Retour attendu |
|---|---|---|---|---|
| Prospection | Dossier de transmission | Identité entreprise, pertinence, provenance, doublons, finalité | Collaborateur affecté et CRM si pertinent | Fiche CRM → résultat et critères d'origine |
| Marchés publics | Dossier de transmission | Référence officielle, échéance, acheteur, lot, doublons | Responsable AO / collaborateur autorisé, puis opportunité si validée | Opportunité → avis et lot d'origine |
| Marchés privés / BODACC | Dossier de transmission | Nature exacte du signal, statut juridique, date, fiabilité, finalité | Collaborateur chargé de l'analyse, puis CRM si pertinent | Fiche → annonce et observation d'origine |
| Qualification entreprises | Dossier de transmission | Identité SIREN/SIRET, preuves, limites et niveau de confiance | Demandeur ou collaborateur désigné | Fiche → diagnostic et justificatifs |
| Accompagnement appels d'offres | Dossier de transmission | Exigences, compétences documentées, pièces et échéances | Responsable du dossier AO | Dossier → consultation et éléments d'origine |
| Sous-traitance / Réseau | Dossier de transmission | Besoin réel, identité, disponibilité vérifiable, autorisation de mise en relation | Bénéficiaire / collaborateur habilité | Fiche → besoin ou événement d'origine |
| Réputation virtuelle | Dossier de transmission | Bon établissement, informations publiques, date, droits d'utilisation | Demandeur ou chargé de visibilité | Fiche → diagnostic daté |
| Salons / Séminaires | Dossier de transmission | Contexte de rencontre, données collectées, finalité et opposition | Collaborateur autorisé | Contact / activité → événement d'origine |
| Recherche transversale | Dossier de transmission | Pertinence, provenance, périmètre et doublons | Demandeur ou collaborateur désigné | Fiche → requête et résultat d'origine |

Les fournisseurs de données restent invisibles dans les moteurs de Prospection et les interfaces métier destinées aux utilisateurs. La traçabilité technique peut exister dans le dossier interne Administration, sans exposer un catalogue de fournisseurs.

## 7. Optimisations d'architecture recommandées

1. **Créer un objet de transmission commun**, sans fusionner les objets métier. Une transmission référence un ou plusieurs résultats ; elle ne remplace ni une entreprise, ni un contact, ni une opportunité.
2. **Distinguer demande, transmission et objet CRM.** Une demande peut produire plusieurs transmissions ; une transmission peut conduire à zéro, un ou plusieurs objets CRM ; un résultat peut être rejeté sans création CRM.
3. **Séparer les rôles.** Demandeur, bénéficiaire, préparateur, validateur Administration et collaborateur affecté doivent être stockés et contrôlés séparément.
4. **Séparer validation et livraison.** Une validation n'implique pas que la livraison a réussi ; une livraison n'autorise pas automatiquement l'écriture CRM.
5. **Appliquer les droits au niveau de chaque ressource.** La validation administrative ne remplace jamais RLS, l'isolation multi-tenant, la finalité ou le contrôle du destinataire.
6. **Préserver une provenance champ par champ.** Distinguer données sources, données normalisées, déductions et décisions humaines.
7. **Prévoir une file Administration unifiée.** Vue par priorité, échéance, état, rubrique d'origine, demandeur, bénéficiaire et responsable ; accès aux preuves, historique et motif de décision.
8. **Rendre le CRM réversible dans ses effets métier.** Prévisualisation, détection de doublons, confirmation, journal des changements et possibilité de corriger une affectation sans effacer l'historique.
9. **Fournir des retours contextuels.** Depuis une fiche CRM, retrouver la rubrique, le dossier, le résultat, les critères pertinents et la source d'origine ; depuis une rubrique, retrouver les fiches liées auxquelles l'utilisateur a droit.
10. **Garder Cheexpeer en mode différé.** Elle pourra plus tard préparer et analyser les dossiers, mais ne valide ni ne diffuse au nom de l'Administration sans délégation explicite et contrôle humain.

## 8. Plan de correction, vérification et optimisation

### Lot 1 — Autorisations et frontières (priorité immédiate)
- décider si les demandes sont visibles au demandeur seul, à certains rôles du tenant ou à toute l'organisation ;
- définir les rôles Administration habilités à lire, valider, rejeter, corriger et affecter ;
- restreindre l'accès au catalogue technique et aux observations brutes aux fonctions internes autorisées ;
- tester les accès par API directe, pas seulement par l'interface ;
- vérifier les frontières entre organisation interne et organisations clientes.

### Lot 2 — Contrat de transmission
- formaliser les champs logiques de la section 3 ;
- définir les états séparés de demande, validation, affectation, livraison et capitalisation ;
- définir les règles de conservation, de correction, de réaffectation et de clôture ;
- décider si une transmission porte un seul résultat ou un lot explicitement sélectionné.

### Lot 3 — File Administration
- concevoir la file de contrôle avec priorités, preuves, anomalies et actions permises ;
- rendre toute décision explicable et horodatée ;
- séparer les permissions de lecture, validation, affectation et administration technique ;
- prévoir une file de retour au préparateur ou de complément au demandeur.

### Lot 4 — Premier flux pilote
- choisir un flux métier pilote ;
- faire passer un résultat de sa rubrique à la préparation, au contrôle Administration, à l'affectation, à la restitution et, si nécessaire, au CRM ;
- vérifier le retour depuis le CRM vers le résultat initial ;
- tester doublons, données partielles, identifiants manquants, source inaccessible, refus, réaffectation et session expirée.

### Lot 5 — Généralisation et Cheexpeer différée
- appliquer le contrat commun aux autres rubriques sans uniformiser artificiellement leurs critères métier ;
- mesurer délais, taux de rejet, complétude, doublons, erreurs d'affectation et valeur de capitalisation ;
- introduire Cheexpeer d'abord en lecture/analyse, puis en préparation ; conserver la validation Administration.

## 9. Tests d'acceptation obligatoires

- Un membre ne voit que les demandes et livraisons auxquelles son rôle lui donne accès.
- Un membre interne sans habilitation Administration ne peut pas valider ou diffuser un dossier.
- Un administrateur habilité peut examiner les preuves, motiver sa décision et affecter le dossier.
- Le demandeur et le bénéficiaire peuvent être deux personnes différentes.
- Un collaborateur affecté voit le dossier nécessaire à sa mission, sans accès général au CRM ou à un autre tenant.
- Une donnée rejetée n'est pas capitalisée comme opportunité validée.
- Une donnée validée mais non livrée reste identifiable comme telle.
- Une livraison échouée peut être reprise sans dupliquer les fiches.
- Une fiche CRM retrouve son origine ; un retour vers la rubrique ne contourne pas les droits.
- Les sources et observations techniques ne sont pas accessibles aux utilisateurs métier par requête directe si elles sont classées internes.
- Une tentative inter-tenant est refusée côté serveur / RLS.
- Toutes les décisions, affectations, réaffectations et écritures sont horodatées et attribuées à un acteur.
- Les interfaces mobiles et desktop respectent les mêmes règles d'autorisation.
- Aucun e-mail, publipostage, message ou contact tiers n'est déclenché par une simple transmission.

## 10. Limites de ce contrôle et prochaine étape

Ce contrôle confirme la structure des tables, les colonnes principales, l'état des migrations et les politiques RLS actuellement déployées. Il ne constitue pas une recette E2E multi-comptes : les scénarios d'accès doivent être exécutés avec des comptes de test représentant plusieurs rôles et plusieurs organisations avant toute modification.

La prochaine intervention technique doit être un **lot de correction des permissions et du contrat de transmission**, après arbitrage précis des rôles et de la visibilité des demandes. Ne pas commencer par brancher toutes les rubriques au CRM ni par ajouter Cheexpeer.

**État de sortie :** architecture de circulation clarifiée ; écarts backend identifiés et priorisés ; aucune modification risquée appliquée. La base existante est conservée et les corrections proposées sont préparées pour un lot contrôlé.
