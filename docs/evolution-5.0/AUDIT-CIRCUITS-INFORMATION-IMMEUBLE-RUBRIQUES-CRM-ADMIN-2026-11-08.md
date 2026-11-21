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


---

## 11. Vérification complémentaire — privilèges SQL et précision des habilitations

**Contrôle complémentaire du 8 novembre 2026 — lecture seule.** Les politiques RLS ont été recoupées avec les privilèges SQL effectifs et les définitions des fonctions d'autorisation. Cette vérification affine les constats précédents.

### 11.1 Privilèges effectifs sur `client_requests`

Le rôle `authenticated` dispose actuellement de :
- `SELECT` ;
- `INSERT` ;
- `UPDATE(status)` uniquement.

Il ne dispose pas d'un droit général de mise à jour de toutes les colonnes via le privilège de table. La politique RLS `Internal staff can update request status` autorise néanmoins la mise à jour de la colonne `status` à toute personne reconnue par `private.is_internal_staff()`.

**Précision importante :** le constat est donc qu'un membre de l'organisation interne ayant le rôle `member` peut modifier le statut d'une demande ; il ne peut pas, sur la seule base de ces privilèges, modifier librement toutes les colonnes de la demande. La correction doit porter sur le pouvoir de transition du statut et sur l'absence de séparation des habilitations, sans exagérer les droits actuels.

### 11.2 Définition actuelle du personnel interne

La fonction `private.is_internal_staff()` retourne vrai si l'utilisateur appartient à l'organisation de type `internal` avec l'un des rôles `owner`, `admin` ou `member`.

Les fonctions `private.is_org_admin(organization_id)` et `private.is_org_editor(organization_id)` sont distinctes :
- `is_org_admin` reconnaît `owner` et `admin` dans l'organisation ciblée ;
- `is_org_editor` reconnaît `owner`, `admin` et `member`.

Il n'existe donc pas, dans le modèle de rôles actuellement vérifié, de rôle fonctionnel explicite « agent Administration habilité à valider et diffuser ». Il ne faut pas simplement renommer `member` en « Administration » ni supposer que tous les administrateurs d'une organisation cliente sont des administrateurs MajestiOS.

### 11.3 Privilèges effectifs sur les ressources de sources

Le rôle `authenticated` possède actuellement `SELECT` sur :
- `official_data_sources` ;
- `company_source_observations` ;
- `company_registry` ;
- `company_registry_establishments`.

Les politiques RLS de lecture des quatre tables utilisent actuellement `USING (true)`. En revanche, `official_source_sync_runs` dispose d'une politique de lecture refusée et aucun privilège `SELECT` pour `authenticated` n'a été observé lors du contrôle.

**Optimisation à appliquer sans casser le produit :**
- réserver le catalogue technique `official_data_sources` et les observations brutes `company_source_observations` aux fonctions serveur et aux habilitations internes nécessaires ;
- conserver un accès métier aux données d'entreprise du registre uniquement à travers un parcours maîtrisé, avec des champs utiles et une finalité définie ;
- ne pas exposer les noms de fournisseurs, paramètres de connecteurs, payloads bruts ou détails d'exécution dans les écrans métier ;
- vérifier les fonctions Edge existantes avant de retirer les privilèges directs, afin de ne pas casser la recherche ni l'import des entreprises.

### 11.4 Matrice de permissions cible — à appliquer à chaque type de dossier

Cette matrice formalise le modèle de travail à préparer. Elle ne modifie pas les rôles ni les politiques actuellement déployés.

| Acteur | Lecture | Préparation / contribution | Validation | Affectation | Livraison / suivi |
|---|---|---|---|---|---|
| Demandeur | Sa demande et son suivi, selon le type de dossier | Compléments à sa demande | Non | Non | Reçoit le résultat si désigné bénéficiaire |
| Bénéficiaire | Résultats qui lui sont explicitement délivrés | Peut contribuer selon habilitation | Non | Non | Consulte et suit les éléments qui lui sont destinés |
| Préparateur de rubrique | Dossier métier dans son périmètre | Prépare, normalise et documente | Non | Non | Retourne le dossier à l'Administration ou au circuit prévu |
| Collaborateur affecté | Dossier et pièces nécessaires à sa mission | Traite et rend compte | Non, sauf habilitation distincte | Non | Accède au dossier affecté et à son historique utile |
| Agent Administration habilité | Dossier, preuves et historique nécessaires au contrôle | Peut demander un complément ou corriger selon procédure | Oui, dans son périmètre | Oui, dans son périmètre | Autorise la restitution et en suit l'état |
| Administrateur technique | Configuration, sécurité, audit technique | Opérations techniques contrôlées | Pas de validation métier automatique | Pas d'affectation métier automatique | Supervision et audit technique |
| Cheexpeer (future) | Lecture strictement autorisée | Analyse et préparation déléguées | Non par défaut | Recommandation seulement au départ | Alerte / rapport ; action ultérieure uniquement sur délégation explicite |

Les habilitations sont des capacités fonctionnelles, pas nécessairement des rôles exclusifs. Une même personne peut cumuler plusieurs capacités, mais chaque action doit vérifier la capacité requise, le périmètre d'organisation, la finalité, le destinataire et l'état du dossier.

### 11.5 Architecture de rôles recommandée

Ne pas surcharger le rôle générique `organization_members.role` pour exprimer tous les pouvoirs métier. Séparer :
1. **rôle d'appartenance à une organisation** : `owner`, `admin`, `member`, `viewer` ;
2. **habilitations internes MajestiOS** : consulter, contrôler, valider, affecter, corriger, administrer techniquement ;
3. **affectation au dossier** : demandeur, bénéficiaire, préparateur et collaborateur responsable ;
4. **droits sur la ressource** : tenant, rubrique, dossier, données, finalité et durée d'accès.

Les habilitations Administration doivent être attribuées par un mécanisme de confiance, jamais par une valeur de profil librement modifiable par l'utilisateur. Le contrôle doit être appliqué côté serveur/RLS et vérifié à chaque transition sensible.

### 11.6 Ordre de correction retenu pour la suite

1. **Cartographier les rôles internes existants et leurs usages** dans le cockpit, les fonctions Edge et les parcours de demandes ; identifier les comptes et scénarios de test sans afficher ni copier de secrets.
2. **Définir les capacités Administration** (lecture, contrôle, validation, affectation, correction, administration technique) et leur attribution sécurisée.
3. **Séparer les règles de lecture des demandes** : demandeur, bénéficiaire, collaborateurs affectés, Administration habilitée ; décider explicitement des éventuels dossiers collaboratifs visibles à toute une organisation.
4. **Protéger les métadonnées et observations des fournisseurs** tout en conservant un accès métier maîtrisé aux données d'entreprise utiles.
5. **Définir le contrat de transmission** et les transitions autorisées avant d'ajouter de nouvelles tables ou colonnes.
6. **Préparer une migration réversible et ses tests** ; la faire relire, sauvegarder et tester sur environnement isolé avant toute application.

### 11.7 Scénarios de sécurité supplémentaires

- Un membre interne ordinaire ne peut pas faire passer une demande de `received` à `accepted` ou `rejected`.
- Un administrateur d'un tenant client ne reçoit aucun droit de validation Administration MajestiOS par simple cumul de rôles.
- Le demandeur ne peut pas s'auto-désigner validateur.
- Le bénéficiaire ne peut consulter le dossier qu'après décision et livraison autorisées, sauf accès de collaboration explicitement défini.
- Un collaborateur perd l'accès au dossier lorsqu'il est désaffecté, sans effacer son historique d'intervention.
- Un agent Administration peut consulter les preuves nécessaires sans exposer les identifiants techniques des fournisseurs dans l'espace membre.
- Une requête directe PostgREST sur le catalogue ou le payload brut est refusée pour un membre métier non habilité.
- La recherche métier continue de fonctionner après restriction des tables internes, via les fonctions serveur autorisées.
- Les accès refusés, décisions, changements d'affectation et livraisons sont auditables.

**État après vérification complémentaire :** le modèle de circulation et la matrice de permissions sont désormais plus précis. Aucun privilège, rôle, objet métier, fonction Edge ou paramètre Supabase n'a été modifié. La prochaine étape reste la préparation d'un correctif contrôlé, après inventaire des usages applicatifs et définition du mécanisme d'habilitation Administration.


## 12. Contrôle des fonctions Edge actives — nouveaux écarts de circulation

Les trois fonctions actives du projet ont été relues directement dans Supabase, en lecture seule : `search-official-companies` v4, `import-official-company` v2 et `bootstrap-internal-admin` v3. Les fonctions exigent un JWT (`verify_jwt=true`). Aucun déploiement ni changement de fonction n'a été effectué.

### 12.1 Les réponses de recherche révèlent le fournisseur technique

La fonction `search-official-companies` renvoie dans son JSON :
- le nom du fournisseur ;
- l'URL du fournisseur ;
- les données brutes de sa réponse.

Cela signifie que la discrétion visuelle du moteur ne garantit pas l'invisibilité de la ressource : le nom du fournisseur est transmis au navigateur et peut être inspecté dans la réponse réseau. Cela contredit la règle métier selon laquelle les sources restent invisibles dans les moteurs et écrans de Prospection.

**Correction à préparer :** conserver la provenance dans le journal technique interne, mais renvoyer au moteur un contrat de résultat neutre, normalisé et limité aux champs nécessaires. Ne pas transmettre le nom du fournisseur ni le catalogue technique au client.

### 12.2 L'import crée déjà une fiche dans le CRM de l'organisation

La fonction `import-official-company` vérifie l'identité de l'utilisateur, contrôle via `can_import_official_company` qu'il possède le droit d'édition dans l'organisation demandée, puis utilise le rôle serveur pour appeler `import_official_company_record`.

Cette procédure :
- met à jour le registre commun d'entreprise ;
- met à jour les établissements ;
- crée ou met à jour directement une ligne `businesses` dans l'organisation choisie ;
- marque cette fiche `qualification_status = 'to_review'` ;
- enregistre une observation brute dans `company_source_observations`.

Il s'agit donc d'un import authentifié et balisé « à examiner », pas d'une validation Administration. Il faut éviter de présenter cette fiche comme une donnée déjà validée ou comme une opportunité prête à être exploitée.

**Optimisation recommandée :** distinguer visuellement et techniquement « donnée importée / à contrôler » de « donnée validée et diffusée ». Le futur circuit doit décider si l'import reste un brouillon CRM non opérationnel ou s'il passe d'abord par un dossier de transmission en attente de contrôle. Dans les deux cas, l'écriture doit conserver l'état de contrôle, la provenance, l'acteur initiateur et l'organisation bénéficiaire. Aucune conversion automatique en opportunité ne doit se produire.

### 12.3 Le droit d'import et le droit de validation sont deux capacités différentes

La fonction SQL `can_import_official_company(organization_id)` s'appuie sur `private.is_org_editor(organization_id)`, qui autorise les rôles `owner`, `admin` et `member` du tenant. Ce contrôle peut être pertinent pour importer une donnée dans un espace de travail, mais il ne constitue pas une habilitation Administration MajestiOS.

**Règle à préserver :** l'utilisateur peut éventuellement demander ou préparer un import dans son organisation ; cela ne lui confère jamais le droit de valider la donnée au nom de MajestiOS, de la diffuser à d'autres utilisateurs ou de la transformer en opportunité qualifiée.

### 12.4 Bootstrap du premier administrateur

La fonction `bootstrap-internal-admin` v3 utilise une vérification serveur d'identité et de confirmation d'adresse, puis appelle un bootstrap SQL protégé par verrou transactionnel pour créer le premier propriétaire de l'organisation interne. La fonction est active et protégée par JWT.

Le bootstrap SQL vérifie notamment qu'aucun propriétaire ou administrateur interne n'a déjà été initialisé et que l'utilisateur ne possède pas déjà une appartenance. Ce mécanisme est un bootstrap initial, pas un système complet de délégation des habilitations Administration. Il faudra vérifier son caractère strictement temporaire, son idempotence et la procédure de révocation / transfert avant de généraliser les rôles.

### 12.5 État de parité entre les fonctions déployées et Git

Les versions et empreintes des trois fonctions déployées ont été relevées. La récupération du contenu déployé est possible, mais la parité avec les fichiers de la branche examinée n'est pas encore établie : les chemins de fichiers testés dans `supabase/functions/` n'ont pas tous été retrouvés sur cette branche. Aucun rapprochement par hash Git n'est donc déclaré.

Avant toute correction, il faut retrouver le chemin source exact et comparer :
- le contenu complet ;
- les imports et dépendances ;
- les variables d'environnement attendues (sans lire ni exposer leurs valeurs secrètes) ;
- les contrôles d'identité et d'autorisation ;
- les contrats JSON de sortie ;
- les versions et empreintes des fonctions déployées.

**Ne pas redéployer une fonction tant que son source de référence et ses dépendances ne sont pas identifiés.**

### 12.6 Priorités mises à jour

1. Corriger le contrat JSON de recherche pour ne plus exposer le fournisseur au navigateur.
2. Clarifier le statut de l'import entreprise : brouillon à contrôler, dossier de transmission ou autre étape explicitement définie.
3. Séparer droit d'import, droit de validation Administration et droit de diffusion.
4. Protéger les tables de métadonnées et observations techniques sans casser les fonctions serveur.
5. Retrouver les sources Git exactes des fonctions déployées et établir la parité.
6. Ensuite seulement, préparer la migration et les tests d'accès.

**État de sortie du contrôle Edge :** une fuite de métadonnées fournisseur dans la réponse de recherche et un import direct en fiche CRM « à examiner » ont été confirmés. Ces constats renforcent la nécessité d'un circuit de transmission et de validation distinct du CRM. Aucun code ni service actif n'a été modifié.


## 13. Recherche de provenance Git des fonctions déployées — 8 novembre 2026

### 13.1 Résultat de la recherche des sources

Les chemins conventionnels suivants ont été recherchés dans cinq branches représentatives : `main`, `evolution-5.0-admin-cockpit`, `backup/evolution-5.0-admin-cockpit-2026-11-07`, `rebuild/evolution-5.0-admin-cockpit-clean-supabase` et `feature/crm-atomic-integration`.

- `supabase/functions/search-official-companies/index.ts`
- `supabase/functions/import-official-company/index.ts`
- `supabase/functions/bootstrap-internal-admin/index.ts`

**Résultat : aucun de ces trois fichiers n'a été retrouvé à ces chemins dans les cinq branches contrôlées.** La recherche de code GitHub sur la branche par défaut n'a pas non plus remonté ces fonctions. Cette absence ne prouve pas qu'aucune copie n'existe dans un autre dépôt, une archive locale ou un historique externe ; elle signifie que la branche de travail ne fournit pas actuellement une source de référence vérifiable par ces chemins.

### 13.2 Indices historiques identifiés

L'historique Git contient le commit `844cb147524d15310d00c8c314921de405717527`, intitulé « MajestiOS V5 — reconstruction propre et validation complète (#38) », qui regroupe notamment les travaux de CRM, de bootstrap interne et de migrations. La recherche de commits a également identifié `28b4001ee68da730deb09c3b6de69bec252424be`, intitulé « feat: add atomic deduplicated official company import ».

Ces commits constituent des pistes d'historique, mais les résultats de recherche de commits ne fournissent pas ici les chemins ni les contenus des fonctions Edge déployées. Ils ne permettent donc pas d'établir une filiation source-déploiement ni une égalité de contenu.

### 13.3 Matrice de parité actuelle

| Fonction déployée | Version active relevée | Source exacte dans les branches testées | Parité vérifiée | Décision |
|---|---:|---|---|---|
| `search-official-companies` | v4 | Non retrouvée | Non | Bloquer toute modification/redéploiement jusqu'à récupération du source |
| `import-official-company` | v2 | Non retrouvée | Non | Bloquer toute modification/redéploiement jusqu'à récupération du source |
| `bootstrap-internal-admin` | v3 | Non retrouvée | Non | Bloquer toute modification/redéploiement jusqu'à récupération du source |

### 13.4 Procédure de récupération recommandée

1. Exporter ou récupérer le code exact de chaque fonction depuis la source qui a servi au déploiement (poste de développement, archive, dépôt secondaire ou historique de déploiement), sans exporter de secrets.
2. Archiver les fichiers avec leur nom, leur version active, leur empreinte SHA-256, la date de récupération et l'origine vérifiable.
3. Comparer le code récupéré au contenu actuellement déployé, imports inclus.
4. Reconstituer les dépendances et variables d'environnement attendues, sans afficher les valeurs secrètes.
5. Réintégrer les sources dans un emplacement Git versionné et documenter leur filiation avant toute correction.
6. Ajouter des tests de contrat sur les autorisations, la forme des réponses et la non-exposition des fournisseurs.
7. Faire relire le diff et valider une procédure de retour arrière avant toute livraison.

Ne pas recréer les fonctions à partir de leur comportement observé ou de leurs noms : cela risquerait de perdre des contrôles implicites, des dépendances ou des correctifs déjà présents en production.

**Conclusion de cette étape :** la recherche Git ne permet pas encore d'établir la provenance des trois fonctions Edge. Le bon prochain geste n'est donc pas de les réécrire, mais de récupérer leur source exacte et de la versionner. Aucun changement Supabase, aucune modification de fonction, aucun déploiement et aucune fusion n'ont été effectués pendant cette étape.
