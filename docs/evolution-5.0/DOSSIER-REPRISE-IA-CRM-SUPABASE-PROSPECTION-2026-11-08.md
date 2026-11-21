# Dossier de reprise IA — CRM, Supabase et Prospection

**Date de consolidation :** 8 novembre 2026  
**Dépôt :** `Chexpeer/Majestios`  
**Branche de travail vérifiée :** `feature/crm-atomic-integration`  
**HEAD vérifié au moment de la rédaction :** `0f6aa0e8e212298a01bb83f76930dc32e6ae77ef`  
**Projet Supabase hébergé :** `majestios-crm` — référence `qxaghcifdhugfskuscoc` — région `eu-west-3`  
**Nature :** dossier de continuité technique et fonctionnelle destiné à toute IA ou personne qui reprend le développement. Il distingue explicitement les éléments présents dans Git, les éléments déployés, les tests réellement exécutés et les travaux seulement prévus.

> **Règle de reprise :** ce document ne constitue pas une autorisation de modifier la base hébergée, les politiques RLS, Auth, les secrets ou les déploiements. Il décrit l'état constaté et l'ordre de travail recommandé. Toute opération distante, migration, changement de droits, déploiement, merge ou modification de production exige une autorisation explicite distincte.

---

## 1. Résumé exécutif

MajestiOS possède déjà un socle Supabase multitenant et un premier CRM persistant. Le travail réalisé a permis de restaurer dans Git une partie importante de l'historique réellement déployé, de documenter les écarts de sécurité et de versionnement, de définir le contrat de circulation inter-rubriques/Administration/CRM, puis de construire un premier endpoint serveur de Prospection membre et un banc d'intégration Auth/RLS local.

**Ce qui est réellement acquis :**

- projet Supabase hébergé identifié et contrôlé en lecture seule ;
- 21 migrations recensées dans le ledger distant ;
- 21 fichiers SQL présents dans la branche de travail après restauration ;
- trois sources Edge Functions déployées restaurées dans Git et comparées à leurs empreintes de bundle ;
- tables CRM de base présentes : entreprises, contacts, opportunités, activités et relances persistantes ;
- identité multitenant avec organisations, profils et appartenances ;
- inscription/provisionnement client défini par une fonction SQL existante et un parcours frontend ;
- audit des habilitations et des politiques RLS ;
- contrat documentaire de transmission entre rubriques, Administration et CRM ;
- modules partagés de contrat DTO, validation, erreurs et autorisation pour Prospection ;
- endpoint membre de recherche avancée présent dans Git, mais **non déployé** ;
- configuration Supabase locale et workflow GitHub Actions isolé ;
- véritable test Auth/RLS local exécuté avec succès sur une base vierge reconstruite depuis les migrations Git.

**Ce qui n'est pas acquis :**

- parité exacte et définitivement réconciliée entre les versions de migration Git et le ledger hébergé ;
- tests HTTP complets de l'Edge Function, test d'un JWT signé mais expiré et intégration live aux API de données ;
- rate limiting partagé et fiable ;
- endpoint public de l'annuaire ;
- raccordement frontend du nouveau moteur membre ;
- flux de transmission universel entre rubriques, Administration, bénéficiaires, collaborateurs et CRM ;
- permissions d'Administration complètes et gouvernance de délégation ;
- déploiement du nouvel endpoint et validation en environnement de staging ;
- intégration ou activation de Cheexpeer.

Ne jamais confondre « source présente dans Git », « fonction active dans Supabase », « test local réussi » et « fonctionnalité disponible aux utilisateurs ».

---

## 2. Identifiants et état de référence

### 2.1 Projet hébergé

| Élément | Valeur vérifiée |
|---|---|
| Nom du projet | `majestios-crm` |
| Référence | `qxaghcifdhugfskuscoc` |
| Région | Paris — `eu-west-3` |
| État observé lors du contrôle | `ACTIVE_HEALTHY` |
| PostgreSQL observé dans l'audit | 17.x |
| Branche Git de réalisation | `feature/crm-atomic-integration` |

La référence d'un ancien projet Supabase conservée dans certains documents historiques est obsolète pour le backend actuel. Toujours vérifier `supabase-config.js`, le projet MCP sélectionné et la référence avant une opération. Ne jamais choisir un projet sur la base d'un ancien document.

### 2.2 Branche Git et points de retour

HEAD de la branche au moment de cette consolidation : `0f6aa0e8e212298a01bb83f76930dc32e6ae77ef`.

Commits de restauration et de consolidation à connaître :

| Commit | Objet |
|---|---|
| `b4a34b0e6a6b25c4db6a596844f03f86bb26e673` | Restauration de neuf migrations SQL déployées dans Git |
| `423e47d348b62ebe0a661f09fbb2b155fafe2f85` | Restauration des trois sources Edge Functions et de leur README |
| `b7b00c700db737536282f97324e6abaed5b38375` | Audit parité Git/Supabase, Edge Functions et RLS |
| `16edae902ea0d62b39e306ac874be08a9ab57c36` | Contrat DTO de recherche unifiée et audit des consommateurs |
| `38e12b64d085c677a1061525568eccefbf0cf5eb` | Audit des habilitations Supabase pour Prospection |
| `33a9415ac0ce2883c53eba6e72491c01ab3c6ab3` | Contrat serveur visiteur/membre |
| `69c7c6960a99afa3ae3220af27532fc9cc68e5b3` | Conception technique des endpoints, autorisation et DTO |
| `f91e6ea50c377e741f773d4f7638fc1ed37bcf50` | Premier endpoint authentifié de recherche membre |
| `a7e14442e9abff83fb7c2776ac0c3d300de95b36` | Vérification syntaxique TypeScript de l'entrée Edge Function dans la CI |
| `4af0792e94a00f7a0f6b726623c5b4354c999a39` | Préflight documentaire des tests Auth/RLS locaux |
| `0f6aa0e8e212298a01bb83f76930dc32e6ae77ef` | Rapport du banc Auth/RLS local après le run réussi |

Les lots CRM antérieurs sont également décrits dans les documents spécialisés, notamment les lots CRM atomiques 04, 05 et 06, le poste de travail Entreprises, l'audit CRM/capitalisation et l'architecture des espaces Administration/CRM/Client. Leurs rapports précisent les commits et les résultats de CI propres à ces lots. Ne pas extrapoler leur état à partir du seul titre.

---

## 3. Modèle de données Supabase actuellement présent

### 3.1 Les 15 tables publiques recensées

Toutes les 15 tables publiques étaient signalées avec RLS activé lors de l'audit.

| Domaine | Tables | Responsabilité |
|---|---|---|
| Identité et multitenant | `organizations`, `organization_members`, `profiles` | Organisations, utilisateurs, rôles et appartenance |
| CRM | `businesses`, `contacts`, `opportunities`, `activities`, `crm_reminders` | Entreprises, interlocuteurs, opportunités, historique d'activité et relances |
| Demandes et confidentialité | `client_requests`, `privacy_acknowledgments` | Demandes entrantes et preuve d'information/acceptation de confidentialité |
| Référentiel officiel | `company_registry`, `company_registry_establishments` | Identités entreprise et établissements normalisées |
| Sources et traçabilité | `official_data_sources`, `official_source_sync_runs`, `company_source_observations` | Registre technique, exécutions de collecte et observations |

Les volumes observés dans les audits sont des instantanés datés, pas des invariants. Au relevé du 8 novembre, les tables CRM et de référentiel étaient pour l'essentiel vides ; le projet avait une organisation interne, une appartenance et un profil. Refaire un relevé avant de conclure sur les volumes actuels.

### 3.2 Modèle CRM déjà en place

- `businesses` : fiche entreprise CRM tenant-aware ; des champs d'affectation et de provenance existent.
- `contacts` : interlocuteurs rattachés au périmètre CRM.
- `opportunities` : opportunités commerciales, avec certains champs d'origine, d'affectation et de suivi.
- `activities` : journal d'activités CRM, conçu pour préserver l'historique plutôt que réécrire les événements passés.
- `crm_reminders` : relances persistantes, avec migrations successives pour le cycle de vie, la création d'activité à la complétion, les permissions et les index.
- `client_requests` : demandes entrantes depuis l'espace client ; **ce n'est pas** un objet de transmission universelle entre rubriques.
- `company_registry` et `company_registry_establishments` : référentiel officiel distinct des fiches CRM.

La séparation référentiel officiel / CRM est volontaire : trouver une entreprise dans un annuaire ne doit pas créer automatiquement un prospect, une opportunité ou une relation commerciale. Une qualification et une finalité métier sont nécessaires.

### 3.3 Rôles et appartenance observés

La table `organization_members` contient notamment `organization_id`, `user_id`, `role` et `created_at`. Les rôles observés sont :

- `owner`
- `admin`
- `member`
- `viewer`

Les organisations ont un type `kind` parmi :

- `internal`
- `client`
- `partner`

Aucun champ d'état `active` / `suspended` ni matrice de permissions fines par fonctionnalité n'a été observé. Dans le modèle actuel, la révocation d'accès passe par la gestion de l'appartenance ; la suspension temporaire et les permissions détaillées nécessitent une évolution de schéma et un arbitrage.

Les helpers SQL audités incluent `private.is_org_member(uuid)`, `private.is_org_editor(uuid)` et `private.is_internal_staff()`. Ils ne constituent pas à eux seuls un système complet de pouvoirs Administration.

---

## 4. Migrations : restauration et point de vigilance majeur

### 4.1 État vérifié

Le ledger du projet Supabase hébergé a été relu le 8 novembre : **21 migrations appliquées**. La branche actuelle contient **21 fichiers SQL**. Le replay des 21 fichiers dans la base locale vierge a réussi lors du run d'intégration.

Neuf migrations précédemment absentes de Git ont été restaurées à partir des migrations déployées et archivées dans le commit `b4a34b0e6a6b25c4db6a596844f03f86bb26e673`. Leurs noms et empreintes ont été vérifiés après commit.

### 4.2 Les 12 versions historiques à réconcilier

Les 12 migrations plus anciennes ont un nom conceptuel correspondant, mais les préfixes de version des fichiers Git ne correspondent pas aux versions inscrites dans le ledger hébergé : les fichiers historiques Git utilisent des préfixes `20261105...` / `20261106...`, tandis que le ledger distant utilise les versions `202611070658...` à `20261107065914`.

**Le replay local réussi ne résout pas cette divergence.** Il prouve que les fichiers présents peuvent reconstruire une base locale vierge dans cet environnement ; il ne prouve pas que les identifiants de versions sont identiques au ledger distant ni qu'une future migration distante sera sans conflit.

À faire avant tout changement de schéma ou déploiement SQL :

1. inventorier les 21 fichiers Git et les 21 entrées du ledger distant ;
2. établir une correspondance univoque version ↔ nom ↔ contenu SQL ;
3. vérifier les neuf migrations restaurées et les douze migrations historiques ;
4. comparer le schéma local reconstruit au schéma hébergé, y compris fonctions, triggers, contraintes, index, grants, policies et extensions ;
5. documenter les écarts et choisir une stratégie de réconciliation compatible avec Supabase ;
6. obtenir une autorisation spécifique avant toute modification du ledger ou application distante.

Ne jamais renommer les migrations, altérer le ledger ou lancer `db push` / `migration repair` à l'aveugle.

---

## 5. Edge Functions : déployées et en préparation

### 5.1 Trois fonctions actuellement actives sur le projet hébergé

Dernier inventaire Supabase relu pendant cette consolidation :

| Fonction | Version hébergée | JWT | Bundle SHA-256 |
|---|---:|---|---|
| `search-official-companies` | 4 | requis | `e91851a82639e45fcc9eb45e441905874650ca84ad82f92de233542f709dc5ad` |
| `import-official-company` | 2 | requis | `7cb5c723140719ea10f4db67708793b1ae3afb49bfa413003052bc37b3b90a5c` |
| `bootstrap-internal-admin` | 3 | requis | `331827cfdf8999eb4d2d861e7c7644fe99354c4fb0dd580cdb19ddbc4af606d4` |

Leurs sources `index.ts` ont été restaurées dans Git. Les empreintes de bundle hébergées ont été consignées ; elles ne sont pas les SHA Git des fichiers.

**Risques documentés :**
- `search-official-companies` renvoie encore des métadonnées de fournisseur, une URL source et le payload amont ; cela contrevient à la règle d'invisibilité des sources dans l'interface de Prospection.
- `import-official-company` conserve des métadonnées de provenance dans ses réponses/logiques actuelles ; aligner son contrat sur un DTO métier sans provenance exposée.
- `bootstrap-internal-admin` sert au premier bootstrap et ne constitue pas un système de délégation, transfert ou révocation des administrateurs. Sa source restaurée comporte un identifiant de bootstrap en dur : ne pas recopier cette valeur dans la documentation publique, ne pas l'exposer et auditer le mécanisme avant toute évolution.
- `provision-client-workspace` est présent dans le dépôt et appelé par le parcours frontend, mais n'apparaissait pas dans le dernier inventaire des fonctions actives du projet hébergé. Son déploiement effectif et son parcours de bout en bout restent à vérifier.

Aucun des trois bundles actifs n'a été remplacé lors des lots documentés.

### 5.2 Nouvel endpoint membre : présent dans Git, non déployé

Chemin : `supabase/functions/prospection-search-member/index.ts`.

Il s'agit d'un endpoint POST authentifié qui :
- exige un Bearer JWT ;
- vérifie l'identité avec Supabase Auth via `auth.getUser(token)` ;
- utilise un client utilisateur (clé publishable/anon + JWT), pas `service_role`, pour lire les appartenances et organisations sous RLS ;
- exige exactement une appartenance à une organisation `client` et un rôle `owner`, `admin` ou `member` ;
- refuse `viewer`, les organisations `internal` et `partner`, les appartenances absentes ou multiples et les situations ambiguës ;
- n'accepte pas `organization_id` ou `role` du navigateur comme preuve d'autorisation ;
- valide strictement le JSON, limite le corps à 16 Ko, applique CORS, renvoie des erreurs MajestiOS stables ;
- orchestre la recherche et renvoie un DTO normalisé sans fournisseur, URL de source, payload brut, structure amont ou détail technique ;
- limite la page à 10 résultats et expose un indicateur `partial`.

Le noyau couvre les filtres textuels, APE/NAF, départements/régions, tranches d'effectif, formes juridiques, labels RGE/Qualiopi/EPV/ESS, ancienneté et géolocalisation (commune/code postal, rayon 1–50 km avec code APE/NAF requis).

**Limite connue :** `revenue_bands` est volontairement refusé. Ne pas annoncer un filtre chiffre d'affaires opérationnel avant définition des tranches, exercice de référence, fraîcheur et règles de calcul. La recherche SIREN/SIRET directe n'est pas combinable avec les autres filtres car l'API amont ignore silencieusement certains paramètres.

Autres limites :
- pas de sauvegarde CRM, export, import ou écriture métier ;
- pas de rate limiting partagé inter-instances ;
- aucune consommation par le frontend ;
- endpoint non déployé dans Supabase ;
- aucun test live auprès de l'API de données dans le lot B.

### 5.3 Modules partagés associés

Les modules `supabase/functions/_shared/prospection-*.mjs` couvrent le contrat DTO, validation, codes d'erreur, contrôle d'autorisation et noyau de recherche. Les tests unitaires utilisent des réponses simulées. La CI a vérifié les tests du noyau et la syntaxe TypeScript de l'entrée via Node ; **aucun `deno check` n'a été exécuté**.

---

## 6. Contrat d'autorisation Prospection : règle provisoire implémentée

Le résolveur partagé `resolveProspectionAccess` applique la séquence suivante :

1. exiger un token non vide ;
2. appeler `userClient.auth.getUser(token)` ;
3. refuser un utilisateur absent, un JWT invalide ou un e-mail non confirmé ;
4. lire `organization_members` avec le client utilisateur et RLS ;
5. exiger une seule ligne d'appartenance ;
6. lire l'organisation correspondante avec le même client utilisateur ;
7. exiger une seule organisation de type `client` ;
8. autoriser uniquement `owner`, `admin` ou `member` ;
9. refuser toute erreur, ambiguïté ou donnée incohérente (fail closed).

Ne jamais remplacer ce contrôle par un simple contrôle frontend, une valeur d'ID envoyée par le navigateur, une lecture privilégiée `service_role` ou une simple vérification « JWT présent ».

Cette règle est provisoire et propre au premier parcours de recherche avancée membre. Elle ne définit pas encore les permissions complètes du CRM, de l'Administration, des exports, des transmissions ou des actions d'écriture.

---

## 7. Prospection : décisions fonctionnelles à préserver

Deux niveaux d'accès du **même moteur métier** sont décidés :

### Visiteur
- véritable annuaire public, pas une démo fictive ;
- recherche simple et fiche entreprise synthétique ;
- résultats bornés (cible actuelle : maximum 10) ;
- aucun filtre avancé, export B2B, scoring, qualification, sauvegarde ou transmission CRM.

### Membre authentifié
- recherche multicritère et ciblage avancé ;
- filtres APE/NAF, département, région, rayon, effectif, ancienneté, forme juridique, labels ;
- préparation et sauvegarde des prospects, puis transmission CRM selon droits dans un lot futur ;
- accès autorisé côté serveur selon l'organisation et le rôle.

Les sources et fournisseurs doivent rester **totalement invisibles** dans l'expérience de Prospection : aucun nom, logo, catalogue, sélecteur, fournisseur ou choix de connecteur. Les ressources sont orchestrées en arrière-plan. Les données de provenance technique restent internes et restreintes aux fonctions d'exploitation autorisées.

Les API de recherche d'entreprises et de géolocalisation sont encore appelées directement depuis certains scripts frontend audités. Le nouveau endpoint membre ne corrige pas cette situation tant que le frontend n'est pas migré. Les modules de signaux BODACC et de ressources complémentaires doivent être audités individuellement avant leur bascule ; ne pas supposer que tous les scripts sont montés sur toutes les pages.

---

## 8. CRM, Administration et circulation de l'information

### 8.1 Responsabilités fonctionnelles

- **Rubriques et moteurs métier :** détectent, recueillent, préparent et qualifient les informations dans leur contexte.
- **Administration :** contrôle qualité, finalité, provenance, doublons, permissions et conditions de diffusion ; valide, refuse, demande un complément, corrige ou affecte selon ses pouvoirs réels.
- **CRM :** capitalise les informations métier utiles et validées : entreprises, établissements, contacts, opportunités et activités.
- **Membres/collaborateurs :** demandent, reçoivent les informations auxquelles ils ont droit, traitent les dossiers affectés et rendent compte.
- **Cheexpeer plus tard :** lecture seule initiale pour analyser, préparer, signaler, alerter et scorer ; aucune validation ou affectation silencieuse.

Le CRM, la Business Intelligence, l'Administration et Cheexpeer sont des capacités transversales, pas des étages de l'immeuble.

### 8.2 Contrat de transmission déjà documenté, pas encore implémenté

Le contrat logique prévoit de distinguer :
- demandeur ;
- bénéficiaire ;
- préparateur ;
- validateur Administration ;
- collaborateur affecté ;
- organisation et périmètre ;
- rubrique, dossier, route et objet d'origine ;
- destination ;
- finalité et classification ;
- décision, motif, horodatages ;
- éléments sélectionnés ;
- livraison et historique des réaffectations ;
- lien éventuel vers les objets CRM.

Le demandeur n'est pas nécessairement le bénéficiaire. Le bénéficiaire n'est pas nécessairement le collaborateur affecté. La validation ne doit pas automatiquement ouvrir l'accès à toute l'organisation.

Les cycles de vie doivent rester séparés : demande, validation, affectation, restitution/livraison et capitalisation CRM. Un unique champ `status` ne doit pas représenter toutes ces étapes.

**État actuel :** `client_requests` est une demande entrante simplifiée. Il n'existe pas encore de table/agrégat universel `transmissions` ni de journal événementiel de ses transitions. Les activités CRM ne doivent pas être détournées pour remplacer ce journal.

La recommandation documentaire est d'étudier un agrégat central de transmission, un historique append-only et une collection d'éléments sélectionnés, sans multiplier les tables avant d'avoir validé le modèle. Aucun schéma n'a été modifié pour cette cible.

### 8.3 État des écrans CRM et cockpit

Des lots antérieurs ont développé et documenté le poste de travail Entreprises, la navigation Administration/CRM, les suggestions lexicales APE/NAF et les indicateurs CRM du cockpit.

Le lot CRM 06 ajoute au cockpit trois compteurs en lecture seule (entreprises, contacts, opportunités) filtrés par l'organisation interne vérifiée. Les opérations métier restent dans le CRM. Ce lot ne prouve pas un CRM complet ni un test live avec session réelle ; son rapport précise les limites de CI et le blocage hérité de vérifications d'architecture.

Les indicateurs du cockpit ne doivent pas être confondus avec les fonctionnalités de gestion des fiches CRM.

---

## 9. Sécurité et écarts RLS à traiter

Les audits ont identifié plusieurs points qui doivent rester visibles pour toute IA repreneuse :

1. Certaines politiques RLS `USING (true)` sur `official_data_sources` et `company_source_observations` rendent le catalogue technique et des métadonnées/payloads d'observation accessibles aux utilisateurs authentifiés. Cela contredit la règle d'invisibilité des fournisseurs.
2. Le registre d'entreprises peut avoir une vocation de données de référence partagées, mais il faut le séparer des métadonnées techniques internes de collecte.
3. Des champs `businesses.source_label` et `source_url` ont été observés et peuvent être lus par les membres de l'organisation. Définir leur visibilité et leur nécessité métier ; ne pas les exposer dans les DTO de Prospection.
4. Les réponses des anciennes Edge Functions peuvent révéler source, URL et payload amont.
5. `client_requests` a une politique de lecture organisationnelle et interne ; le rôle membre interne ne doit pas être assimilé à un rôle Administration tout-puissant.
6. Les helpers d'autorisation actuels n'offrent pas de statut actif/suspendu ni de matrice complète des permissions.
7. La validation Administration n'est pas un substitut à RLS, à la confidentialité, à la base légale ni au cloisonnement par tenant.
8. Les fonctions `SECURITY DEFINER`, grants, search_path, droits `EXECUTE` et secrets doivent être revus avec prudence à chaque changement. Ne jamais exposer la clé `service_role` au navigateur ni l'utiliser pour remplacer l'autorisation utilisateur.
9. Les erreurs et journaux techniques détaillés doivent rester internes ; les DTO navigateur ne doivent pas exposer payload brut, source, provider, connector, URL amont, secrets ou erreurs upstream.

Aucun changement RLS ou grant n'a été réalisé dans les lots de restauration, d'audit, A, B ou C décrits ici.

---

## 10. Tests et preuves réellement obtenus

### 10.1 CI du lot B

Run GitHub Actions `42476659464` : `completed / success`. La CI a exécuté les tests unitaires du noyau avec réponses simulées, les tests de contrat/DTO/habilitation du lot A, le build, les contrôles d'architecture et les smoke tests existants.

Limites :
- pas d'Auth live ;
- pas de test API amont réel pour le nouvel endpoint ;
- pas de test HTTP complet de la fonction Edge ;
- syntaxe TypeScript vérifiée avec Node, pas de `deno check`.

### 10.2 Banc d'intégration Auth/RLS — succès réel local

Workflow : [run #2 — Auth/RLS local](https://github.com/Chexpeer/Majestios/actions/runs/42477827778).

État API vérifié : `completed`, conclusion `success`. Le job et chacune de ses étapes sont terminés avec succès.

Le workflow :
- installe Node 22 et Supabase CLI épinglée en version 2.122.1 ;
- démarre une stack Supabase locale éphémère ;
- reconstruit une base vierge avec `supabase db reset --local` ;
- exécute des tests avec de vrais utilisateurs Auth locaux, de vraies sessions JWT et des requêtes PostgREST soumises aux politiques RLS ;
- arrête la stack et supprime les volumes avec `supabase stop --no-backup`.

Résultats :
- 21 fichiers de migration appliqués à la base locale vierge ;
- neuf utilisateurs Auth et neuf organisations de test créés uniquement dans la stack locale ;
- `owner`, `admin`, `member` autorisés ;
- `viewer`, organisations `internal` et `partner`, absence d'appartenance et appartenance multiple refusés ;
- tentative de connexion par mot de passe avec e-mail non confirmé refusée par Auth avec `email_not_confirmed` ;
- JWT altéré refusé ;
- lectures des appartenances et organisations sous RLS vérifiées ;
- champs navigateur `organization_id` et `role` rejetés par le validateur ;
- arrêt et suppression des volumes réussis.

Un premier run a échoué parce que le test attendait à tort une session pour un e-mail non confirmé ; l'assertion a été corrigée. Le second run a réussi.

**Limites de ce succès :**
- le test d'un JWT altéré n'est pas un test d'un JWT correctement signé mais expiré ;
- le runtime HTTP complet de l'Edge Function n'est pas démarré dans ce workflow ;
- les pannes réseau/PostgREST et l'erreur forcée pendant la lecture de `organizations` ne sont pas injectées par le banc ;
- les API fournisseurs, la pagination live, le rate limiting et les quotas ne sont pas testés ;
- le replay local ne résout pas l'écart historique des préfixes de version de migration.

### 10.3 Configuration locale

Fichiers :
- `supabase/config.toml` : projet local `majestios-local-auth-ci`, PostgreSQL 17, Auth activé ; confirmations e-mail désactivées dans la stack de test uniquement ;
- `tests/prospection-authz.integration.mjs` : tests Auth/RLS avec vrais utilisateurs locaux ;
- `.github/workflows/prospection-auth-integration.yml` : workflow isolé.

Le workflow ne contient aucun secret GitHub de production, n'exécute aucun `supabase link`, `--remote` ou `--linked`, ne configure aucune URL distante et ne touche pas au projet hébergé.

---

## 11. Liste exhaustive des travaux restant à faire — ordre recommandé

### Priorité 0 — maintenir l'intégrité et la traçabilité

- [ ] Revalider le HEAD de la branche, le workflow et les inventaires Supabase avant toute reprise.
- [ ] Garder ce dossier et les rapports spécialisés synchronisés avec les preuves nouvelles.
- [ ] Ne pas fusionner ni déployer sans validation explicite.
- [ ] Préserver les points de retour et les empreintes des bundles déployés.

### Priorité 1 — achever les tests Auth/RLS et HTTP

- [ ] Ajouter un test d'un JWT correctement signé mais expiré (en tenant compte du mode de signature local).
- [ ] Tester les réponses HTTP de l'Edge Function : OPTIONS, méthode interdite, absence de JWT, JWT invalide/expiré, e-mail non confirmé, rôle interdit, JSON invalide, payload trop volumineux, filtres incompatibles, succès, erreur interne.
- [ ] Démarrer la fonction Edge dans le banc local et vérifier l'ensemble du cycle HTTP, pas seulement le résolveur partagé.
- [ ] Ajouter un scénario d'erreur de lecture `organizations` et vérifier le fail-closed, côté intégration ou par injection contrôlée.
- [ ] Tester le cloisonnement inter-organisations sur les objets CRM réels, y compris SELECT/INSERT/UPDATE/DELETE selon les politiques attendues.
- [ ] Ajouter tests de non-divulgation du DTO : aucune clé `source`, `provider`, `connector`, `source_url`, `raw`, `payload`, `upstream`, `debug` ou secret.

### Priorité 2 — réconcilier Git et le projet Supabase hébergé

- [ ] Établir la matrice des 21 versions du ledger et des 21 fichiers Git.
- [ ] Réconcilier les 12 préfixes de version historiques sans modifier le ledger par supposition.
- [ ] Comparer schéma local et schéma hébergé : tables, colonnes, contraintes, index, fonctions SQL, triggers, policies, grants, extensions, vues et paramètres Auth.
- [ ] Vérifier la présence et le déploiement réel de `provision-client-workspace` ; tester l'inscription client de bout en bout en environnement isolé/staging.
- [ ] Revalider les sources restaurées par comparaison de bundle ou d'une méthode de build reproductible avant toute modification des fonctions existantes.

### Priorité 3 — sécuriser le modèle d'autorisation et les données techniques

- [ ] Revoir les politiques trop permissives sur `official_data_sources` et `company_source_observations`.
- [ ] Séparer le registre métier partageable des métadonnées techniques internes.
- [ ] Revoir l'exposition des champs de provenance sur `businesses` et dans les réponses des fonctions.
- [ ] Auditer les fonctions `SECURITY DEFINER`, leurs propriétaires, `search_path`, droits `EXECUTE` et contrôles d'identité.
- [ ] Définir les pouvoirs Administration : validation, refus, demande de complément, correction, affectation, transfert, révocation et audit.
- [ ] Arbitrer suspension de membership et permissions fines ; ne pas ajouter de colonnes sans contrat et autorisation.
- [ ] Définir une matrice RLS complète par rôle, type d'organisation, table et opération.

### Priorité 4 — rendre l'orchestration serveur robuste

- [ ] Choisir et implémenter un rate limiter partagé fiable pour les endpoints publics et membres. Un compteur en mémoire Edge Function n'est pas suffisant.
- [ ] Définir quotas, fenêtres, limites par IP/utilisateur/organisation, réponses 429 et stratégie anti-abus.
- [ ] Définir observabilité, request_id, métriques, journal technique restreint, rétention et alertes.
- [ ] Revalider les contrats DTO, les champs autorisés, les erreurs stables, la pagination et le plafond de dix résultats.
- [ ] Définir la stratégie de cache et de fraîcheur sans exposer la provenance interne.
- [ ] Tester les limites de débit, les appels partiels, timeouts, retries, erreurs upstream et réponses malformées.

### Priorité 5 — construire l'annuaire public

- [ ] Arbitrer le rate limiting avant d'ouvrir un endpoint public.
- [ ] Créer `prospection-directory-public` séparé de l'endpoint membre.
- [ ] N'autoriser qu'une recherche simple et des fiches synthétiques, sans proxy générique vers l'API amont.
- [ ] Borner résultats, paramètres, pagination, quotas et protections anti-énumération.
- [ ] Réutiliser le normaliseur commun, mais avec un DTO public plus réduit que le DTO membre.
- [ ] Tester les accès anon, les abus, les erreurs, les limites et l'absence de fuite de données.
- [ ] Ne pas toucher au moteur global de recherche de la page d'accueil, qui est hors périmètre.

### Priorité 6 — migrer le moteur Prospection frontend vers le serveur

- [ ] Cartographier les consommateurs réels des scripts de ciblage, ressources et signaux.
- [ ] Basculer `company-targeting.js` et les appels de géolocalisation vers les endpoints serveur ; retirer les appels directs du navigateur.
- [ ] Migrer les signaux BODACC et les ressources complémentaires par lots contrôlés, en vérifiant les usages page par page.
- [ ] Retirer les catalogues/noms de fournisseurs de toute interface utilisateur de Prospection.
- [ ] Aligner l'import d'entreprise sur une réponse métier normalisée et une autorisation serveur.
- [ ] Ajouter les états de chargement, résultats partiels, erreurs stables, pagination bornée et gestion des critères conservés.
- [ ] Tester visiteur et membre avec vrais comptes locaux/staging, puis tests navigateur.
- [ ] Conserver le filtrage progressif des moteurs Appels d'offres dans leur périmètre propre ; ne pas modifier le moteur global d'accueil.

### Priorité 7 — finaliser le CRM métier

- [ ] Auditer précisément les écrans Entreprises, Contacts, Opportunités, Activités et Relances contre les tables réelles.
- [ ] Tester les opérations CRUD autorisées avec de vraies sessions, rôles et organisations.
- [ ] Vérifier déduplication SIREN/SIRET et règles de rapprochement entre registre officiel et CRM.
- [ ] Définir les cycles de vie des entreprises, contacts, opportunités, activités et rappels.
- [ ] Définir les règles d'affectation, transfert et historique des réaffectations.
- [ ] Relier les résultats préparés par les rubriques au CRM uniquement après contrôle et selon la finalité autorisée.
- [ ] Vérifier les compteurs du cockpit en lecture réelle, sans élargir les droits d'accès.
- [ ] Tester notifications et relances persistantes, complétion avec activité et absence de doublons.

### Priorité 8 — implémenter la circulation universelle

- [ ] Finaliser le modèle d'agrégat `transmissions` et de journal append-only ; ne pas réutiliser `client_requests` comme table universelle.
- [ ] Définir les rôles distincts : demandeur, bénéficiaire, préparateur, validateur, collaborateur affecté.
- [ ] Définir les états séparés demande/validation/affectation/livraison/capitalisation CRM.
- [ ] Concevoir l'attachement d'éléments hétérogènes et leur provenance, finalité, classification et conservation.
- [ ] Définir les permissions par organisation et par destinataire, y compris les transmissions inter-organisations autorisées.
- [ ] Implémenter la file Administration et les actions contrôlées, avec motifs et journal d'audit.
- [ ] Implémenter restitution au bénéficiaire et retour vers la rubrique d'origine.
- [ ] Relier les transmissions aux objets CRM sans créer automatiquement une opportunité pour chaque signal.
- [ ] Tester les parcours bidirectionnels sur chaque rubrique prioritaire.

### Priorité 9 — staging et déploiement contrôlé

- [ ] Créer ou identifier un environnement Supabase de staging isolé, sans réutiliser la production comme bac à sable.
- [ ] Rejouer les migrations reconciliées, vérifier RLS, Auth, Edge Functions, secrets et CORS.
- [ ] Déployer l'endpoint membre uniquement après validation explicite et test complet.
- [ ] Migrer le frontend progressivement derrière une stratégie de retour arrière.
- [ ] Effectuer les tests de bout en bout et vérifier les logs/alertes.
- [ ] Préparer un plan de rollback documenté.
- [ ] N'effectuer la mise en production qu'après autorisation explicite.

### Priorité 10 — Cheexpeer, plus tard

- [ ] Maintenir Cheexpeer inactive tant que les fondations, permissions, observabilité et contrats ne sont pas validés.
- [ ] Commencer par un accès lecture seule aux données autorisées.
- [ ] Permettre analyse, préparation, rapports, alertes et scoring explicable.
- [ ] Exiger validation humaine/Administration pour toute écriture, affectation, contact externe ou action engageante.
- [ ] Journaliser les recommandations, preuves, décisions et actions.

---

## 12. Ordre de reprise conseillé à la prochaine IA

La prochaine IA ne doit pas commencer par coder une nouvelle table ou brancher le frontend. Ordre conseillé :

1. Lire `AGENTS.md`, `docs/README.md`, la référence V5, le guide de reprise IA et ce dossier.
2. Revalider le HEAD réel de `feature/crm-atomic-integration`, le dernier workflow Auth/RLS et l'inventaire Supabase.
3. Lire les rapports Lot A, B et C ainsi que l'audit RLS et le mapping du contrat de transmission.
4. Compléter le test JWT expiré et le runtime HTTP Edge en environnement local isolé.
5. Préparer la matrice de parité des migrations et du schéma sans écriture distante.
6. Présenter les écarts et le plan de réconciliation avant toute intervention sur le projet hébergé.
7. Poursuivre par lots bornés avec preuves CI, rapport documentaire et point de retour.

### Commandes et interdictions conceptuelles

- Pour le banc local, rester sur `supabase start`, `supabase db reset --local`, `supabase status`, `supabase stop --no-backup`.
- Ne pas exécuter `supabase link`, `supabase db push`, `migration repair`, `functions deploy` ou une commande distante sans autorisation explicite.
- Ne jamais copier une clé `service_role` dans le frontend, les logs publics ou la documentation.
- Ne jamais faire confiance à `organization_id`, `role`, `user_metadata` ou à une valeur d'interface pour autoriser une action.
- Ne pas rendre les sources visibles dans l'interface Prospection.
- Ne pas confondre l'organisation interne et une organisation cliente.
- Ne pas confondre une demande client et une transmission universelle.
- Ne pas transformer une recommandation IA en décision Administration.

---

## 13. Documents techniques complémentaires à lire

Les rapports suivants contiennent les détails, preuves, limites et historiques par sujet :

- `docs/evolution-5.0/AUDIT-LOT-5-ARCHITECTURE-CRM-CAPITALISATION.md`
- `docs/evolution-5.0/LOT-CRM-POSTE-ENTREPRISES-2026-11-06.md`
- `docs/evolution-5.0/ARCHITECTURE-ESPACES-ADMIN-CRM-CLIENT.md`
- `docs/evolution-5.0/LOT-CRM-ATOMIC-04-NAVIGATION-ADMIN-CRM.md`
- `docs/evolution-5.0/LOT-CRM-ATOMIC-05-COUVERTURE-LEXICALE-NAF.md`
- `docs/evolution-5.0/LOT-CRM-ATOMIC-06-INDICATEURS-CRM-COCKPIT.md`
- `docs/evolution-5.0/AUDIT-CIRCUITS-INFORMATION-IMMEUBLE-RUBRIQUES-CRM-ADMIN-2026-11-08.md`
- `docs/evolution-5.0/CONTRAT-COMMUN-TRANSMISSION-RUBRIQUES-ADMIN-CRM-2026-11-08.md`
- `docs/evolution-5.0/MAPPING-CONTRAT-TRANSMISSION-SCHEMA-SUPABASE-EDGE-2026-11-08.md`
- `docs/evolution-5.0/AUDIT-PARITE-GIT-SUPABASE-SECURITE-EDGE-RLS-2026-11-08.md`
- `docs/evolution-5.0/CONTRAT-DTO-RECHERCHE-UNIFIEE-ET-AUDIT-CONSOMMATEURS-2026-11-08.md`
- `docs/evolution-5.0/AUDIT-HABILITATIONS-SUPABASE-PROSPECTION-2026-11-08.md`
- `docs/evolution-5.0/CONTRATS-SERVEUR-PROSPECTION-ANNUAIRE-PUBLIC-ET-MEMBRE-2026-11-08.md`
- `docs/evolution-5.0/CONCEPTION-TECHNIQUE-ENDPOINTS-PROSPECTION-AUTHZ-DTO-2026-11-08.md`
- `docs/evolution-5.0/LOT-A-FONDATIONS-PROSPECTION-DTO-VALIDATION-AUTHZ-2026-11-08.md`
- `docs/evolution-5.0/LOT-B-ENDPOINT-PROSPECTION-MEMBER-2026-11-08.md`
- `docs/evolution-5.0/LOT-C-PREFLIGHT-TESTS-INTEGRATION-AUTH-RLS-2026-11-08.md`
- `docs/evolution-5.0/LOT-C-BANC-INTEGRATION-AUTH-RLS-LOCAL-2026-11-08.md`
- `supabase/functions/README.md`

**Instruction finale :** conserver les fondations, vérifier avant d'affirmer, distinguer les faits des cibles, ne pas refaire ce qui est déjà livré, ne pas masquer les limites, et ne jamais toucher au projet Supabase hébergé sans autorisation explicite.
