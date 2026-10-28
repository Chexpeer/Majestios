> ARCHIVE DOCUMENTAIRE — Version historique récupérée de la branche `chexpeer-site-majestios` le 28 octobre 2026. Ce document est conservé pour sa traçabilité et ses principes, mais ses descriptions d'état du dépôt et ses propositions techniques ne constituent pas l'état actuel du code. Avant toute implémentation, confronter les propositions au référentiel maître actuel et au dépôt `developpement`.

# MAJ-BUILD-001 — Architecture de construction complète

| Champ | Valeur |
|---|---|
| Référence | MAJ-BUILD-001 |
| Version | 0.1 — proposition de construction |
| Statut | Document de travail à valider par le Fondateur |
| Date | 2026-10-26 |
| Autorité | MAJ-00 Doctrine Fondatrice, puis MAJ-REG |
| Portée | Architecture cible, contrats et plan de réalisation ; aucune migration n'est exécutée par ce document |

> **Règle de lecture.** `[DOCTRINE]` désigne une règle non négociable issue de la Doctrine ou du référentiel métier ; `[PROPOSITION]` désigne une conception technique recommandée mais non encore validée ; `[À DÉCIDER]` signale une décision qui appartient au Fondateur. La présence d'un élément ici ne prouve ni son implémentation ni sa conformité.

## 1. Objet et statut

MAJ-BUILD-001 transforme le corpus documentaire en plan de réalisation destiné aux développeurs et aux assistants de programmation. Il relie l'arborescence, les données, les écrans, les API, les workflows, les permissions, les prompts et l'ordre de construction.

Le document s'appuie sur MAJ-00, MAJ-REG, MAJ-T1 à MAJ-T7, MAJ-A2 et sur le schéma SQL de travail transmis en pièce jointe. Les documents de référence sont des propositions de travail ; leurs versions harmonisées ne sont pas réputées validées par leur seule présence dans le dépôt.

**État réel vérifié du dépôt au moment de la rédaction :** il contient le site public statique et ses fichiers de construction Vercel. Il ne contient pas encore l'application SaaS, une base Supabase, les quatre schémas SQL, des API MajestiOS, des connecteurs BOAMP/TED/SIRENE, un système d'authentification ou les contrôles RLS décrits ici.

Ce document ne crée aucun de ces composants, n'exécute aucune migration et ne revendique aucune intégration, conformité ou mise en production.

## 2. Socle directeur

### 2.1 Principes impératifs

1. **[DOCTRINE] FAIT ≠ HYPOTHÈSE ≠ DÉCISION.** Un fait conserve sa provenance et son statut de qualification. Une hypothèse est une interprétation incertaine, expliquée, datée et réévaluable. Une décision est un acte humain attribué à une personne autorisée.
2. **[DOCTRINE] Aucun passage automatique vers une décision ou une action engageante.** L'IA peut rechercher, classer, résumer et proposer ; elle ne valide pas sa propre proposition et n'envoie pas de communication externe.
3. **[DOCTRINE] Toute donnée entrante est d'abord en staging.** Une source ne peut pas écrire directement dans la mémoire métier qualifiée.
4. **[DOCTRINE] Toute action est traçable.** L'origine, l'acteur ou le processus, le statut précédent, le statut résultant et l'horodatage sont conservés selon les permissions.
5. **[DOCTRINE] Isolation par tenant, rôle, propriété et mandat.** Une identité authentifiée seule ne donne pas accès à toutes les données d'un tenant.
6. **[PROPOSITION] Construire d'abord un monolithe modulaire.** Ne pas introduire Kafka, microservices ou moteur de workflow externe avant qu'un besoin mesuré le justifie.
7. **[PROPOSITION] Montrer au client le sens utile, pas tous les rouages internes.** Les vues client résument l'état (« à confirmer », « source vérifiée », « décision requise ») ; les détails du pipeline sont réservés aux rôles habilités.

### 2.2 Chaîne de données

```text
Source approuvée
      │
      ▼
staging : réception, provenance, validation initiale, dédoublonnage
      │ qualification et promotion contrôlées
      ▼
memory : faits et connaissances qualifiés
      │ analyse en lecture, sans transformer un fait en certitude
      ▼
analysis : signaux, hypothèses, explications et scores
      │ arbitrage explicite par une personne autorisée
      ▼
ops_coach : opportunité activée, mission ou action métier
      │ résultat qualifié
      └──────────────────────────────► memory
```

Les schémas sont des domaines logiques, non des étapes où l'enregistrement original doit être déplacé puis supprimé. La provenance staging reste consultable selon les droits et les règles de conservation. Le résultat d'une analyse ne modifie jamais le fait source.

### 2.3 Niveaux documentaires et décision

| Niveau | Question traitée | Références | Règle de construction |
|---|---|---|---|
| 1 — Doctrine | Pourquoi MajestiOS existe et quelles limites s'imposent ? | MAJ-00, MAJ-DOC-STRAT | Toute contradiction bloque le périmètre concerné jusqu'à arbitrage. |
| 2 — Métier | Quels services, rôles et comportements sont attendus ? | T1, T2, T3, A2 | Le périmètre MVP prévaut sur les extensions différées. |
| 3 — Technique | Comment les données, API, sécurité et opérations sont conçues ? | T4, T5, T6, T7 | Cible documentaire à vérifier par rapport au dépôt et à l'environnement. |
| 4 — Build | Dans quel ordre et selon quels contrats construire ? | MAJ-BUILD-001 | Ce document organise l'exécution ; il ne remplace pas une validation des décisions ouvertes. |

## 3. Arborescence canonique proposée

**[PROPOSITION — À VALIDER]** L'arborescence ci-dessous reprend la structure de construction fournie par le Fondateur. Elle constitue la cible de MajestiOS V1, pas la description du dépôt actuel. Le site public destiné aux visiteurs, prospects et clients reste distinct de l'application métier authentifiée. Le flux BOAMP est un flux de données, pas un défilement automatique de la page.

```text
MAJESTIOS/
├── docs/
│   ├── 00_doctrine/
│   │   ├── doctrine_fondatrice.md
│   │   └── orientation_strategique.md
│   ├── 01_metier/
│   │   ├── vision_strategie.md
│   │   ├── fonctionnel_metier.md
│   │   ├── parcours_utilisateur.md
│   │   └── extensions_business.md
│   ├── 02_technique/
│   │   ├── architecture.md
│   │   ├── donnees_ontologies.md
│   │   ├── api_connecteurs.md
│   │   └── deploiement.md
│   ├── 03_build/
│   │   └── MAJ-BUILD-001.md
│   └── build_master_prompt.md
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── layouts/
│   └── lib/
├── backend/
│   ├── api/
│   │   ├── staging/
│   │   ├── memory/
│   │   ├── analysis/
│   │   ├── activities/
│   │   ├── coach/
│   │   ├── governance/
│   │   └── integrations/
│   ├── services/
│   │   └── integrations/
│   │       ├── boamp/
│   │       ├── ted/
│   │       ├── sirene/
│   │       ├── emploi/
│   │       ├── email/
│   │       ├── calendar/
│   │       ├── webhook/
│   │       └── custom/
│   ├── workflows/
│   ├── ai/
│   └── governance/
├── database/
│   ├── migrations/
│   ├── seeds/
│   ├── functions/
│   ├── rls/
│   ├── views/
│   └── triggers/
├── schemas/
│   ├── staging/
│   ├── memory/
│   ├── analysis/
│   └── ops_coach/
├── modules/
│   ├── organizations/
│   ├── contacts/
│   ├── decision_makers/
│   ├── opportunities/
│   ├── signals/
│   ├── hypotheses/
│   ├── activities/
│   ├── knowledge_base/
│   ├── coach/
│   ├── delegated_campaigns/
│   ├── double_dossier/
│   ├── partners/
│   ├── alliances/
│   ├── investors/
│   ├── partner_match/
│   ├── governance/
│   └── audit/
├── workflows/
│   ├── signal_ingestion/
│   ├── qualification/
│   ├── human_gate/
│   ├── opportunity_lifecycle/
│   ├── mission_lifecycle/
│   └── partner_matching/
├── ai/
│   ├── prompts/
│   │   ├── qualification/
│   │   ├── enrichment/
│   │   ├── opportunity_detection/
│   │   ├── partner_match/
│   │   ├── investor_match/
│   │   └── drafting/
│   ├── classifiers/
│   ├── embeddings/
│   ├── reranking/
│   └── interactions_audit/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── security/
│   └── rls/
├── monitoring/
│   ├── logs/
│   ├── metrics/
│   ├── alerts/
│   └── audit/
├── deployment/
│   ├── vercel/
│   ├── supabase/
│   ├── backups/
│   ├── rollback/
│   └── environments/
```

**Règle de lecture :** les répertoires sont des domaines de responsabilité et ne prouvent pas que leur contenu existe. Le niveau 1 regroupe la doctrine, le niveau 2 le référentiel métier, le niveau 3 le référentiel technique et le niveau 4 le présent Build Master, qui organise la construction. Les APIs sont rangées dans `backend/api/`, les intégrations dans `backend/services/` et les prompts/composants IA dans `ai/` et `backend/ai/` selon leur rôle, sans dupliquer les responsabilités. Le site public doit proposer des parcours visiteurs, prospects et clients ; un espace authentifié, lorsqu'il sera construit, sera une expérience distincte et ne remplacera pas le site public.

**Stack frontend cible :** Next.js, TypeScript, Tailwind CSS et shadcn/ui, sous réserve de validation et de mise en place explicite. Le dépôt actuel reste un site statique ; cette cible ne signifie pas qu'une application, une migration, une authentification, un backend, des intégrations ou des contrôles RLS ont déjà été créés.

## 4. Schéma de données maître

### 4.1 Corrections nécessaires au SQL transmis

Le SQL joint est un bon inventaire de départ, mais il ne constitue pas encore une migration exécutable sûre. Les corrections ci-dessous sont intégrées à la cible proposée :

| Sujet du brouillon | Traitement dans MAJ-BUILD-001 |
|---|---|
| `current_user = 'system'` comme blocage du Human Gate | Non retenu : le nom de rôle SQL ne prouve pas l'identité de la personne. La transition est une commande serveur transactionnelle exigeant un utilisateur authentifié, un rôle autorisé et un journal de décision. Aucun droit client d'édition directe du statut d'hypothèse. |
| RLS fondée uniquement sur `auth.jwt()->>'tenant_id'` | Non retenue seule : le contexte est contrôlé par l'appartenance active en base. Le serveur ne fait pas confiance à un `tenant_id` envoyé dans le corps d'une requête. |
| `tenant_id` ajouté uniformément à toutes les tables | Adapté au domaine : les données métier privées portent un tenant ; les sources et imports de plateforme peuvent être globaux et ne sont pas exposés aux utilisateurs. |
| Références inter-tables sans tenant | Remplacées par des contraintes composites `(tenant_id, id)` lorsque la relation doit rester dans le même tenant. |
| Hypothèses sans lien structuré vers leurs preuves | Chaque hypothèse possède des sources explicites et conserve les identifiants des faits/événements utilisés. |
| JSON libre pour les dossiers et sorties IA | Conservé seulement pour des métadonnées versionnées ; fichiers et dossiers volumineux restent dans un stockage privé avec références contrôlées. |
| Extensions `uuid-ossp` et `pgcrypto` | Ne pas installer par défaut : `gen_random_uuid()` est disponible sur PostgreSQL supporté par Supabase. Ajouter une extension uniquement si une migration le justifie. |

### 4.2 Domaines et entités

| Schéma | Entités principales | Règle de statut |
|---|---|---|
| `staging` | `sources`, `ingestion_batches`, `raw_events` | Donnée reçue, parsée, en revue, rejetée ou qualifiée ; aucun statut ne la rend vraie automatiquement. |
| `memory` | `tenants`, `organization_memberships`, `organizations`, `contacts`, `decision_makers`, `facts`, `business_events`, `activities`, `activity_participants`, `activity_outcomes` | Faits qualifiés, relations de travail et résultats constatés ; historique de provenance conservé. |
| `analysis` | `signals`, `hypotheses`, `hypothesis_sources`, `ai_interactions`, `scores` | Interprétations et scores contestables, avec justification, incertitude, sources et expiration. |
| `ops_coach` | `human_decisions`, `opportunities`, `missions`, `double_dossiers`, `partner_cases`, `investor_cases`, `audit_events` | Actions et dossiers opérationnels ; les créations engageantes suivent le Human Gate. |

### 4.3 Nomenclature des données

- Identifiants : UUID générés par PostgreSQL.
- Horodatages : `timestamptz`, en UTC.
- Scores de confiance et d'incertitude : `numeric` compris entre 0 et 1 ; une confiance n'est pas une probabilité garantie.
- Statuts : valeurs contrôlées par `CHECK` dans la première version ; remplacer par des types dédiés seulement si l'évolution et les migrations sont maîtrisées.
- Source : identifiant de source, identifiant de l'enregistrement source, date observée, date collectée et URL/référence si disponible.
- Qualification : statut, personne qualifiante et date lorsque la qualification est humaine.
- IA : identifiant d'interaction, version de prompt/règle et modèle ; minimiser les entrées et ne jamais stocker de secret.
- Tenant : renseigné sur toute donnée privée d'entreprise, d'analyse ou d'opération. Les données publiques de référence ne deviennent pas privées par défaut.

### 4.4 SQL maître — squelette de migration proposé

Le bloc suivant fournit un noyau cohérent pour estimer et construire la première migration. **Il ne doit pas être appliqué avant validation** des décisions listées à la section 12, vérification des versions de Supabase/PostgreSQL et revue des politiques par tests. Les politiques RLS ne sont pas exhaustivement activées dans ce bloc : leur matrice normative figure à la section 8 et la migration devra les créer pour chaque table exposée.

```sql
-- MAJ-BUILD-001 — SQL de conception, non appliqué.
-- PostgreSQL Supabase ; les fichiers de migration réels doivent être versionnés.

CREATE SCHEMA IF NOT EXISTS staging;
CREATE SCHEMA IF NOT EXISTS memory;
CREATE SCHEMA IF NOT EXISTS analysis;
CREATE SCHEMA IF NOT EXISTS ops_coach;
CREATE SCHEMA IF NOT EXISTS authz;

-- STAGING : zone contrôlée par les services d'ingestion.
CREATE TABLE staging.sources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    source_type text NOT NULL,
    source_uri text,
    active boolean NOT NULL DEFAULT true,
    terms_review_status text NOT NULL DEFAULT 'pending'
        CHECK (terms_review_status IN ('pending', 'approved', 'blocked')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE staging.ingestion_batches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id uuid NOT NULL REFERENCES staging.sources(id),
    tenant_id uuid,
    batch_identifier text,
    schema_version text NOT NULL,
    records_count integer NOT NULL DEFAULT 0 CHECK (records_count >= 0),
    status text NOT NULL DEFAULT 'received'
        CHECK (status IN ('received', 'processing', 'completed', 'partial', 'failed')),
    started_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz,
    error_summary text,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (source_id, batch_identifier)
);

CREATE TABLE staging.raw_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id uuid NOT NULL REFERENCES staging.sources(id),
    batch_id uuid REFERENCES staging.ingestion_batches(id),
    tenant_id uuid,
    event_type text NOT NULL,
    external_id text,
    idempotency_key text,
    payload jsonb NOT NULL,
    source_uri text,
    observed_at timestamptz,
    collected_at timestamptz NOT NULL DEFAULT now(),
    qualification_status text NOT NULL DEFAULT 'received'
        CHECK (qualification_status IN
            ('received', 'parsed', 'needs_review', 'rejected', 'qualified', 'quarantined')),
    validation_errors jsonb NOT NULL DEFAULT '[]'::jsonb,
    schema_version text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (source_id, idempotency_key)
);

CREATE INDEX raw_events_status_collected_idx
    ON staging.raw_events (qualification_status, collected_at DESC);
CREATE INDEX raw_events_external_id_idx
    ON staging.raw_events (source_id, external_id);

-- MEMORY : organisation cliente et faits métier isolés par tenant.
CREATE TABLE memory.tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    status text NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'suspended', 'closed')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (id)
);

CREATE TABLE memory.organization_memberships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    role text NOT NULL CHECK (role IN (
        'SUPER_ADMIN', 'TENANT_ADMIN', 'BUSINESS_DEVELOPER',
        'COACH', 'VALIDATOR', 'MEMBER'
    )),
    status text NOT NULL DEFAULT 'active'
        CHECK (status IN ('invited', 'active', 'suspended', 'revoked')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, user_id),
    UNIQUE (tenant_id, id)
);

CREATE INDEX memberships_user_status_idx
    ON memory.organization_memberships (user_id, status, tenant_id);

CREATE TABLE memory.organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    organization_name text NOT NULL,
    siret text,
    website text,
    industry text,
    employee_size integer CHECK (employee_size IS NULL OR employee_size >= 0),
    organization_status text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    UNIQUE (tenant_id, siret)
);

CREATE INDEX organizations_tenant_name_idx
    ON memory.organizations (tenant_id, organization_name);

CREATE TABLE memory.contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    organization_id uuid NOT NULL,
    first_name text,
    last_name text,
    email text,
    phone text,
    role_title text,
    qualification_status text NOT NULL DEFAULT 'needs_review'
        CHECK (qualification_status IN ('needs_review', 'qualified', 'rejected', 'stale')),
    source_record_id uuid REFERENCES staging.raw_events(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    FOREIGN KEY (tenant_id, organization_id)
        REFERENCES memory.organizations (tenant_id, id) ON DELETE RESTRICT
);

CREATE INDEX contacts_tenant_org_idx ON memory.contacts (tenant_id, organization_id);

CREATE TABLE memory.decision_makers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    contact_id uuid NOT NULL,
    decision_level integer CHECK (decision_level IS NULL OR decision_level BETWEEN 0 AND 5),
    influence_level integer CHECK (influence_level IS NULL OR influence_level BETWEEN 0 AND 5),
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    FOREIGN KEY (tenant_id, contact_id)
        REFERENCES memory.contacts (tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE memory.facts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    organization_id uuid,
    fact_type text NOT NULL,
    source_record_id uuid REFERENCES staging.raw_events(id) ON DELETE RESTRICT,
    source_reference text,
    title text NOT NULL,
    description text,
    observed_at timestamptz,
    qualification_status text NOT NULL DEFAULT 'qualified'
        CHECK (qualification_status IN ('qualified', 'superseded', 'expired')),
    qualified_by uuid REFERENCES auth.users(id) ON DELETE RESTRICT,
    qualified_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    CHECK (source_record_id IS NOT NULL OR source_reference IS NOT NULL),
    FOREIGN KEY (tenant_id, organization_id)
        REFERENCES memory.organizations (tenant_id, id) ON DELETE RESTRICT
);

CREATE INDEX facts_tenant_org_observed_idx
    ON memory.facts (tenant_id, organization_id, observed_at DESC);

CREATE TABLE memory.business_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    organization_id uuid NOT NULL,
    source_record_id uuid REFERENCES staging.raw_events(id) ON DELETE RESTRICT,
    event_type text NOT NULL,
    title text NOT NULL,
    description text,
    event_date timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    FOREIGN KEY (tenant_id, organization_id)
        REFERENCES memory.organizations (tenant_id, id) ON DELETE RESTRICT
);

CREATE TABLE memory.activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    organization_id uuid,
    contact_id uuid,
    owner_user_id uuid REFERENCES auth.users(id) ON DELETE RESTRICT,
    activity_type text NOT NULL CHECK (activity_type IN
        ('CALL', 'EMAIL', 'VISIO', 'RDV', 'TASK', 'NOTE')),
    status text NOT NULL DEFAULT 'planned' CHECK (status IN
        ('planned', 'in_progress', 'completed', 'cancelled', 'no_response')),
    title text NOT NULL,
    notes text,
    scheduled_at timestamptz,
    completed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    FOREIGN KEY (tenant_id, organization_id)
        REFERENCES memory.organizations (tenant_id, id) ON DELETE RESTRICT,
    FOREIGN KEY (tenant_id, contact_id)
        REFERENCES memory.contacts (tenant_id, id) ON DELETE RESTRICT
);

CREATE INDEX activities_tenant_schedule_idx
    ON memory.activities (tenant_id, scheduled_at DESC);
CREATE INDEX activities_owner_status_idx
    ON memory.activities (tenant_id, owner_user_id, status);

CREATE TABLE memory.activity_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    activity_id uuid NOT NULL,
    contact_id uuid NOT NULL,
    participation_role text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, activity_id, contact_id),
    FOREIGN KEY (tenant_id, activity_id)
        REFERENCES memory.activities (tenant_id, id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id, contact_id)
        REFERENCES memory.contacts (tenant_id, id) ON DELETE RESTRICT
);

CREATE TABLE memory.activity_outcomes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    activity_id uuid NOT NULL,
    outcome_type text NOT NULL CHECK (outcome_type IN
        ('confirmed', 'not_confirmed', 'no_follow_up', 'converted', 'other')),
    summary text NOT NULL,
    recorded_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    recorded_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    FOREIGN KEY (tenant_id, activity_id)
        REFERENCES memory.activities (tenant_id, id) ON DELETE RESTRICT
);

-- ANALYSIS : signaux et hypothèses ne sont jamais des faits qualifiés.
CREATE TABLE analysis.ai_interactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    model_name text NOT NULL,
    interaction_type text NOT NULL,
    prompt_version text NOT NULL,
    prompt_hash text NOT NULL,
    input_data jsonb NOT NULL DEFAULT '{}'::jsonb,
    output_data jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id)
);

CREATE TABLE analysis.signals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    organization_id uuid NOT NULL,
    source_record_id uuid REFERENCES staging.raw_events(id) ON DELETE RESTRICT,
    signal_type text NOT NULL CHECK (signal_type IN (
        'LOST_TENDER_DEVELOPMENT_NEED', 'WON_TENDER_SUPPLY_NEED',
        'TRIPLE_RH_EXPANSION_SIGNAL', 'SECTORIAL_RH_THERMOMETER',
        'PARTNER_MATCH', 'INVESTOR_MATCH'
    )),
    confidence_score numeric(4,3) CHECK
        (confidence_score IS NULL OR confidence_score BETWEEN 0 AND 1),
    uncertainty_level numeric(4,3) CHECK
        (uncertainty_level IS NULL OR uncertainty_level BETWEEN 0 AND 1),
    rationale text NOT NULL,
    coverage jsonb NOT NULL DEFAULT '{}'::jsonb,
    period_start timestamptz,
    period_end timestamptz,
    expires_at timestamptz,
    interaction_id uuid,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    FOREIGN KEY (tenant_id, organization_id)
        REFERENCES memory.organizations (tenant_id, id) ON DELETE RESTRICT,
    FOREIGN KEY (tenant_id, interaction_id)
        REFERENCES analysis.ai_interactions (tenant_id, id) ON DELETE RESTRICT
);

CREATE INDEX signals_tenant_org_expiry_idx
    ON analysis.signals (tenant_id, organization_id, expires_at);

CREATE TABLE analysis.hypotheses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    signal_id uuid,
    organization_id uuid NOT NULL,
    hypothesis_type text NOT NULL,
    title text NOT NULL,
    explanation text NOT NULL,
    confidence_score numeric(4,3) CHECK
        (confidence_score IS NULL OR confidence_score BETWEEN 0 AND 1),
    uncertainty_level numeric(4,3) CHECK
        (uncertainty_level IS NULL OR uncertainty_level BETWEEN 0 AND 1),
    review_status text NOT NULL DEFAULT 'draft' CHECK (review_status IN
        ('draft', 'pending_review', 'accepted', 'rejected', 'deferred', 'expired', 'superseded')),
    expires_at timestamptz,
    interaction_id uuid,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    FOREIGN KEY (tenant_id, signal_id)
        REFERENCES analysis.signals (tenant_id, id) ON DELETE RESTRICT,
    FOREIGN KEY (tenant_id, organization_id)
        REFERENCES memory.organizations (tenant_id, id) ON DELETE RESTRICT,
    FOREIGN KEY (tenant_id, interaction_id)
        REFERENCES analysis.ai_interactions (tenant_id, id) ON DELETE RESTRICT
);

CREATE INDEX hypotheses_review_queue_idx
    ON analysis.hypotheses (tenant_id, review_status, created_at DESC);

CREATE TABLE analysis.hypothesis_sources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    hypothesis_id uuid NOT NULL,
    fact_id uuid,
    source_record_id uuid REFERENCES staging.raw_events(id) ON DELETE RESTRICT,
    relevance_note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (fact_id IS NOT NULL OR source_record_id IS NOT NULL),
    FOREIGN KEY (tenant_id, hypothesis_id)
        REFERENCES analysis.hypotheses (tenant_id, id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id, fact_id)
        REFERENCES memory.facts (tenant_id, id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX hypothesis_sources_fact_idx
    ON analysis.hypothesis_sources (tenant_id, hypothesis_id, fact_id)
    WHERE fact_id IS NOT NULL;
CREATE UNIQUE INDEX hypothesis_sources_record_idx
    ON analysis.hypothesis_sources (tenant_id, hypothesis_id, source_record_id)
    WHERE source_record_id IS NOT NULL;

CREATE TABLE analysis.scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    hypothesis_id uuid NOT NULL,
    score_name text NOT NULL,
    score_value numeric(10,3) NOT NULL,
    score_explanation text,
    calculated_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    FOREIGN KEY (tenant_id, hypothesis_id)
        REFERENCES analysis.hypotheses (tenant_id, id) ON DELETE CASCADE
);

-- OPS_COACH : commandes humaines append-only et objets opérationnels.
CREATE TABLE ops_coach.human_decisions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    hypothesis_id uuid NOT NULL,
    actor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    decision_type text NOT NULL CHECK (decision_type IN
        ('accept', 'reject', 'defer', 'request_verification')),
    previous_status text NOT NULL,
    resulting_status text NOT NULL,
    rationale text,
    decided_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    FOREIGN KEY (tenant_id, hypothesis_id)
        REFERENCES analysis.hypotheses (tenant_id, id) ON DELETE RESTRICT
);

CREATE INDEX human_decisions_hypothesis_idx
    ON ops_coach.human_decisions (tenant_id, hypothesis_id, decided_at DESC);

CREATE TABLE ops_coach.opportunities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    organization_id uuid NOT NULL,
    hypothesis_id uuid NOT NULL,
    human_decision_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    status text NOT NULL DEFAULT 'active' CHECK (status IN
        ('active', 'qualified', 'in_progress', 'won', 'lost', 'closed')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    UNIQUE (tenant_id, hypothesis_id),
    FOREIGN KEY (tenant_id, organization_id)
        REFERENCES memory.organizations (tenant_id, id) ON DELETE RESTRICT,
    FOREIGN KEY (tenant_id, hypothesis_id)
        REFERENCES analysis.hypotheses (tenant_id, id) ON DELETE RESTRICT,
    FOREIGN KEY (tenant_id, human_decision_id)
        REFERENCES ops_coach.human_decisions (tenant_id, id) ON DELETE RESTRICT
);

CREATE TABLE ops_coach.missions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    mission_name text NOT NULL,
    mission_type text NOT NULL,
    objective text NOT NULL,
    owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN
        ('draft', 'proposed', 'authorized', 'active', 'paused', 'completed', 'cancelled')),
    start_date date,
    end_date date,
    mandate jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE TABLE ops_coach.double_dossiers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    mission_id uuid NOT NULL,
    official_folder jsonb NOT NULL DEFAULT '{}'::jsonb,
    mirror_folder jsonb NOT NULL DEFAULT '{}'::jsonb,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN
        ('draft', 'in_review', 'authorized', 'active', 'closed')),
    version integer NOT NULL DEFAULT 1 CHECK (version > 0),
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    FOREIGN KEY (tenant_id, mission_id)
        REFERENCES ops_coach.missions (tenant_id, id) ON DELETE RESTRICT
);

CREATE TABLE ops_coach.partner_cases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    target_organization_id uuid,
    relationship_status text NOT NULL DEFAULT 'identified' CHECK (relationship_status IN
        ('identified', 'qualifying', 'contacted', 'discussion', 'active', 'closed', 'declined')),
    next_action text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id),
    FOREIGN KEY (tenant_id, target_organization_id)
        REFERENCES memory.organizations (tenant_id, id) ON DELETE RESTRICT
);

CREATE TABLE ops_coach.investor_cases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    investor_name text NOT NULL,
    qualification_status text NOT NULL DEFAULT 'identified' CHECK (qualification_status IN
        ('identified', 'qualifying', 'qualified', 'rejected')),
    relationship_status text NOT NULL DEFAULT 'identified' CHECK (relationship_status IN
        ('identified', 'contacted', 'discussion', 'active', 'closed', 'declined')),
    next_action text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, id)
);

CREATE TABLE ops_coach.audit_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES memory.tenants(id) ON DELETE RESTRICT,
    actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_kind text NOT NULL CHECK (actor_kind IN ('human', 'service', 'system')),
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid,
    request_id text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_events_tenant_created_idx
    ON ops_coach.audit_events (tenant_id, created_at DESC);

-- Accès RLS : fonction d'aide à la décision d'accès, propriété contrôlée.
-- Les fonctions SECURITY DEFINER doivent être revues, restreintes et testées.
CREATE OR REPLACE FUNCTION authz.has_tenant_role(p_tenant_id uuid, p_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM memory.organization_memberships AS m
        WHERE m.tenant_id = p_tenant_id
          AND m.user_id = auth.uid()
          AND m.status = 'active'
          AND m.role = ANY (p_roles)
    );
$$;

REVOKE ALL ON FUNCTION authz.has_tenant_role(uuid, text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION authz.has_tenant_role(uuid, text[]) TO authenticated;

-- staging reste inaccessible aux rôles client et en refus par défaut sous RLS.
ALTER TABLE staging.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE staging.ingestion_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE staging.raw_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA staging FROM anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA analysis FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA ops_coach FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA memory FROM anon;
```

#### Notes de migration obligatoires

- Le bloc illustre les relations principales ; les migrations réelles doivent ajouter les politiques RLS complètes, les privilèges par rôle, les index manquants, les fonctions transactionnelles et les tests avant toute exposition PostgREST.
- La clé `service_role` ne va jamais dans le navigateur. Les routes serveur utilisent le principe du moindre privilège et un contexte tenant calculé après authentification et vérification d'appartenance.
- Les tables `analysis.ai_interactions` et `ops_coach.audit_events` sont à accès très restreint ; les payloads doivent être minimisés, expurgés et soumis à une politique de conservation à décider.
- `staging.raw_events.tenant_id` est nullable uniquement pour permettre l'ingestion de sources publiques gérées par la plateforme. Les lignes d'un tenant et celles de la plateforme doivent rester distinctes et non consultables directement par un membre.
- Les opérations de suppression logique, fusion d'organisations, versions de règles et rétention doivent faire l'objet de migrations dédiées ; ne pas supprimer en cascade une provenance ou une décision auditée.

## 5. Catalogue des écrans et navigation

### 5.1 Site public — visiteurs, prospects et clients

Le site public est l'expérience principale avant connexion. Il explique les services sans exposer la mécanique interne complète. Les tarifs, témoignages, logos clients, résultats chiffrés et connecteurs ne sont publiés qu'après validation et preuve.

| Route | Audience | Contenu / action | Limite explicite |
|---|---|---|---|
| `/` | Visiteur | Proposition de valeur, cas d'usage, accès aux parcours et actualités d'opportunités démontratives. | Ne pas présenter les données fictives comme un flux BOAMP réel. |
| `/solutions/opportunites` | Prospect | Intelligence d'opportunités, origines des signaux, qualification humaine. | Les détections et intégrations sont décrites comme cible tant qu'elles ne sont pas opérationnelles. |
| `/solutions/prospection` | Prospect | Préparation, suivi des démarches et bénéfice attendu. | Aucun envoi automatique promis. |
| `/solutions/coach` | Prospect / client | Accompagnement humain, périmètre et prise de contact. | Service disponible seulement selon capacité et mandat validés. |
| `/solutions/double-dossier` | Prospect / client | Dossier AO officiel séparé du dossier miroir de préparation. | Le miroir n'altère ni ne remplace les pièces officielles. |
| `/opportunites` | Visiteur | Flux d'annonces ou exemples, filtres et pagination/chargement progressif. | Source, date de mise à jour et couverture affichées ; données de démonstration explicitement étiquetées. |
| `/opportunites/[id]` | Visiteur / prospect | Détail d'une annonce publique et formulaire de demande d'information. | Ne pas afficher d'hypothèse interne ni de donnée personnelle. |
| `/contact` | Prospect | Demande de contact qualifiée, consentement et accusé de réception local ou backend existant. | Si aucun backend n'existe, afficher clairement que l'envoi n'est pas transmis. |
| `/espace-client` | Client | Présentation du parcours de connexion ou accès au portail. | Ne pas simuler une authentification fonctionnelle. |
| `/tarifs` | Prospect | Offre et tarifs validés. | Si non fixés, afficher les modalités de prise de contact, pas des prix inventés. |
| `/legal/*` | Tous | Mentions et politiques rédigées et validées avant mise en ligne. | Ne pas prétendre à une conformité réglementaire non vérifiée. |

Le menu est organisé par pages et sous-pages. Un lien de navigation ne doit pas être une simple ancre déguisée en rubrique si une page dédiée est attendue. Les effets de scroll peuvent être utilisés localement par l'utilisateur, mais aucun défilement automatique ne remplace le flux d'annonces ni la navigation.

### 5.2 Application authentifiée

| Route | Rôle principal | Fonction |
|---|---|---|
| `/connexion`, `/inscription`, `/reinitialisation` | Visiteur / utilisateur | Authentification réelle uniquement une fois le fournisseur et le parcours validés. |
| `/accueil` | Tous les membres | Résumé contextualisé : tâches, décisions en attente, opportunités récentes du tenant. |
| `/opportunites` | BD, valideur, admin | Liste filtrable, état fait/hypothèse/décision et fraîcheur. |
| `/opportunites/[id]` | BD, valideur, admin | Dossier de qualification, sources, limites, décision humaine et historique. |
| `/organisations/[id]` | BD, membre autorisé | Faits qualifiés, relations et activités de l'organisation. |
| `/contacts/[id]` | BD, membre autorisé | Informations minimisées, provenance et fraîcheur ; actions selon permissions. |
| `/activites` et `/activites/[id]` | BD, Coach mandaté | Timeline, tâches, appels, rendez-vous, résultats et suivi. |
| `/connaissances` | BD, valideur, admin | Faits qualifiés et enseignements autorisés. |
| `/coach/missions/[id]` | Coach mandaté, admin | Objectif, périmètre, mandat, actions et résultats. |
| `/double-dossier/[id]` | Coach / membre habilité | Vue séparée du dossier officiel et du miroir, version et statut de brouillon. |
| `/partenaires`, `/investisseurs` | Propriétaire de dossier, admin autorisé | Suivi isolé des dossiers membres et MajestiOS. |
| `/gouvernance/decisions` | Valideur, admin autorisé | Historique des arbitrages et décisions à traiter. |
| `/gouvernance/ia` | Valideur, admin plateforme selon portée | Sources, version de prompt, limites et audit d'interaction. |
| `/parametres/membres` | Admin tenant | Inviter/révoquer des membres et attribuer un rôle. |

### 5.3 États visibles

- Un **fait** affiche la source, la date observée, la date collectée et l'état de qualification.
- Une **hypothèse** affiche « à confirmer » (ou le statut précis), son explication, son incertitude et son expiration.
- Une **décision** affiche l'action choisie, le valideur habilité, l'horodatage et un motif lorsque requis.
- Un bouton d'action externe reste désactivé tant que le mandat, les permissions et la validation humaine ne sont pas établis.
- Une erreur de source ou de synchronisation est affichée comme telle ; l'interface ne transforme jamais un échec en succès simulé.

## 6. Catalogue des API

Toutes les routes sont des **contrats cibles proposés**, pas des endpoints actuellement présents. Elles sont versionnées sous `/api/v1`, valident leurs entrées côté serveur, déduisent le tenant de la session et enregistrent un identifiant de requête. Les réponses d'erreur doivent être explicites et ne pas révéler de données d'un autre tenant.

| Méthode et route | Rôle / contrôle | Entrée principale | Résultat |
|---|---|---|---|
| `POST /api/v1/staging/events` | Connecteur serveur autorisé ; idempotence requise | Source, version de schéma, identifiant externe, dates et payload validé | `202` avec `batch_id`, `record_id` et statut initial ; aucun fait canonique créé. |
| `GET /api/v1/staging/records/{id}` | Opérateur habilité ou service | Identifiant du record | Provenance, dates, statut, erreurs ; payload expurgé selon le rôle. |
| `POST /api/v1/staging/records/{id}/qualify` | Valideur ou processus de qualification contrôlé | `decision`, champs normalisés, motif, version de règle | Promotion transactionnelle vers `memory` ou rejet/quarantaine ; acteur et audit. |
| `GET /api/v1/memory/records` | Membre actif du tenant | Filtres, pagination, type | Faits accessibles au tenant, avec provenance et statut de fraîcheur. |
| `POST /api/v1/memory/records` | BD / valideur habilité | Fait et référence source vérifiables | Fait qualifié ou en revue ; pas d'écriture directe de connecteur. |
| `GET /api/v1/analysis/signals` | Membre autorisé | Organisation, type, date, statut | Signaux avec sources, couverture et expiration. |
| `GET /api/v1/analysis/hypotheses` | BD / valideur | Statut, organisation, pagination | Hypothèses, preuves liées, justification et incertitude. |
| `POST /api/v1/analysis/hypotheses` | Service applicatif autorisé | Faits admissibles, prompt/règle versionnés | Hypothèse en `draft` ou `pending_review`, jamais acceptée automatiquement. |
| `POST /api/v1/analysis/hypotheses/{id}/decision` | Valideur ou admin métier autorisé | `accept`, `reject`, `defer` ou `request_verification`, motif | Transaction qui vérifie l'accès, écrit `human_decisions`, change le statut et journalise. Une opportunité active n'est créée que pour une acceptation autorisée. |
| `GET /api/v1/activities` | Membre actif, filtrage additionnel pour Coach | Période, propriétaire, organisation, statut | Timeline paginée du tenant ou des missions assignées. |
| `POST /api/v1/activities` | BD / Coach dans son mandat | Type, organisation, participant, échéance, titre | Activité tracée ; pas d'envoi d'e-mail. |
| `POST /api/v1/activities/{id}/outcome` | Propriétaire ou rôle autorisé | Résultat, résumé et suite prévue | Résultat append-only ; une connaissance peut être proposée pour qualification. |
| `GET /api/v1/ops/missions` / `POST /api/v1/ops/missions` | Admin tenant / Coach selon mandat | Mission, objectif, propriétaire, limites | Mission consultable ou créée en brouillon ; l'activation exige autorisation distincte. |
| `POST /api/v1/ops/double-dossiers` | Coach / BD autorisé | Mission, références officielles, version du miroir | Dossier créé en brouillon ; aucune pièce officielle n'est modifiée. |
| `GET /api/v1/ops/partner-cases` / `POST /api/v1/ops/partner-cases` | Propriétaire, admin autorisé | Organisation cible, statut, prochaine action | Dossier isolé dans le tenant propriétaire. |
| `GET /api/v1/ops/investor-cases` / `POST /api/v1/ops/investor-cases` | Propriétaire, admin autorisé | Investisseur, statut et prochaine action | Dossier sans promesse de financement ni partage implicite. |
| `GET /api/v1/governance/ai-interactions/{id}` | Valideur / rôle d'audit habilité | Interaction | Métadonnées, version, sources et sorties expurgées selon droit. |
| `POST /api/v1/public/contact-requests` | Visiteur, anti-abus serveur | Coordonnées minimisées, objet et consentement requis | Confirmation seulement si une transmission réelle est configurée ; sinon erreur/information explicite. |
| `GET /api/v1/public/opportunities` | Public | Filtres autorisés, pagination | Annonces publiables issues d'une source opérationnelle ou données de démo clairement étiquetées. |

**Contrat commun :** identifiant stable, pagination bornée, validation de schéma, idempotency key sur les écritures rejouables, `request_id`, codes HTTP cohérents, réponse d'erreur structurée, journalisation sans secret ni données excessives. Une route de décision n'accepte jamais un `actor_id` fourni par le client.

## 7. Workflows métier

### WF-01 — Ingestion source

1. Un connecteur approuvé vérifie son statut et les conditions d'accès à la source.
2. Il reçoit ou récupère les données, attribue une version de schéma et une clé d'idempotence.
3. Il écrit dans `staging` et consigne le lot, les dates et les erreurs.
4. Les contrôles de structure, source, doublon, fraîcheur, tenant et champs requis classent chaque élément.
5. Les erreurs permanentes sont visibles et arrêtent la promotion ; les reprises transitoires sont bornées.

### WF-02 — Qualification et promotion

1. Une règle déterministe ou un opérateur examine le record staging.
2. Les faits ambigus restent `needs_review`; ils ne sont pas exposés comme connaissances qualifiées.
3. Un acteur habilité qualifie, rejette ou demande une vérification.
4. Une transaction conserve la référence staging et crée l'objet `memory` sans effacer la source.
5. Les opérations répétées produisent le même résultat ou une erreur d'idempotence explicite.

### WF-03 — Détection et arbitrage d'opportunité

1. Une règle ou un modèle identifie un signal à partir de faits admissibles.
2. Le signal documente sources, couverture, période, date d'observation, incertitude et expiration.
3. L'analyse propose zéro ou plusieurs hypothèses ; chaque hypothèse expose les preuves et limites.
4. Un humain habilité accepte, rejette, reporte ou demande une vérification.
5. Seule une hypothèse explicitement acceptée peut devenir une opportunité active.
6. Une action externe nécessite en plus le rôle, le mandat et l'autorisation applicables ; la décision d'acceptation seule n'envoie rien.

### WF-04 — AO gagné/perdu et signaux RH

- Un AO perdu peut suggérer un rebond commercial ; il ne prouve pas un besoin d'accompagnement.
- Un AO gagné est un événement source factuel ; sous-traitance, RH, achats ou matériel demeurent des hypothèses jusqu'à confirmation.
- Un thermomètre RH décrit sources couvertes, période, règles de regroupement et biais ; libellé recommandé : « signal fort de croissance, à confirmer ».
- La liste publique d'annonces est distincte de l'analyse privée et ne révèle jamais les hypothèses du tenant.

### WF-05 — Activité, mission et capitalisation

1. Une activité est créée, planifiée puis achevée ou annulée.
2. La clôture consigne un résultat, y compris « non confirmé », « sans suite » ou « pas de réponse ».
3. Une connaissance issue du résultat reste une proposition jusqu'à qualification.
4. Une mission opérée nécessite commanditaire, périmètre, propriétaire, mandat, calendrier, limites et critères d'arrêt.
5. Le Coach n'agit que dans le périmètre assigné ; les tentatives et résultats sont auditables.

### WF-06 — Double Dossier AO

Le dossier officiel référence les exigences et pièces de l'appel d'offres sans les modifier. Le dossier miroir contient la préparation d'exécution, les besoins, risques et actions. Toute production IA porte un statut de brouillon et une version ; une validation humaine précède tout partage ou dépôt.

### WF-07 — Partenariat et investisseur

Le dossier définit explicitement son propriétaire (tenant membre ou MajestiOS), son périmètre de visibilité, son statut et sa prochaine action. Les données d'un membre ne sont pas réutilisées pour un autre dossier sans autorisation. Une suggestion d'investisseur ne garantit ni financement ni mise en relation.

## 8. Rôles, permissions et RLS

### 8.1 Rôles métier proposés

| Rôle | Portée | Permissions de principe |
|---|---|---|
| `SUPER_ADMIN` | Plateforme MajestiOS, accès exceptionnel et audité | Administration technique ; ne devient pas automatiquement propriétaire des données client. |
| `TENANT_ADMIN` | Un tenant | Gérer membres et paramètres, consulter les données du tenant, attribuer les rôles autorisés. |
| `BUSINESS_DEVELOPER` | Un tenant | Qualifier les opportunités, gérer organisations/contacts/activités et proposer des actions. |
| `COACH` | Mandat et missions assignés | Consulter et traiter uniquement les dossiers/activités autorisés par son mandat. |
| `VALIDATOR` | Un tenant ou périmètre explicitement attribué | Arbitrer les hypothèses et transitions métier sensibles ; accès à la preuve nécessaire. |
| `MEMBER` | Un tenant | Consulter les informations explicitement partagées et suivre ses dossiers ; pas de privilège d'administration. |
| Service d'ingestion | Service, jamais utilisateur humain | Écrire staging ; pas de promotion directe en memory. |
| Service IA | Service, jamais valideur humain | Lire les entrées autorisées et créer des propositions ; aucun droit de décision. |

`SUPER_ADMIN` est un rôle de plateforme, pas un rôle métier automatiquement attribué à chaque tenant. Les rôles d'un utilisateur sont liés à son appartenance et ne sont pas inférés d'un e-mail ou d'un paramètre client.

### 8.2 Matrice fonctionnelle minimale

Légende : `L` lire ; `C` créer/proposer ; `M` modifier dans son périmètre ; `D` décision humaine ; `A` administration. Le contrôle du tenant, de la propriété et du mandat s'applique à toutes les cases.

| Ressource / opération | Super admin | Admin tenant | Business Developer | Coach mandaté | Validateur | Membre |
|---|---:|---:|---:|---:|---:|---:|
| Source brute / staging | A technique, journalisé | — | L selon délégation | — | L en revue | — |
| Organisations et contacts du tenant | L exceptionnel | L/C/M/A | L/C/M | L assigné | L | L partagé |
| Faits qualifiés | L exceptionnel | L | L/C | L assigné | L/C qualification | L partagé |
| Signaux et hypothèses | L exceptionnel | L | L/C | L assigné | L/D | L partagé |
| Décision d'hypothèse | — | D si habilité | — | — | D | — |
| Opportunités | L exceptionnel | L/M | L/C/M | L assigné | L | L partagé |
| Activités et résultats | L exceptionnel | L/M | L/C/M | L/C/M assigné | L | L partagé |
| Missions / Double Dossier | L exceptionnel | A | C si autorisé | L/C/M mandaté | L/D sur partage | L explicitement partagé |
| Partenaires / investisseurs | L exceptionnel audité | A dans son tenant | L/C selon droit | — sauf mandat | L selon mandat | L sur son dossier |
| Interactions IA / audit | A selon procédure | L selon politique | — | — | L périmètre autorisé | — |
| Membres et rôles | A plateforme | A tenant | — | — | — | — |

Cette matrice est une proposition de moindre privilège. Chaque case doit être convertie en tests d'accès ; « L exceptionnel » n'autorise pas une consultation générale sans motif ni audit.

### 8.3 Exigences RLS et contrôles serveur

1. Activer RLS sur toute table exposée par PostgREST, sans exception silencieuse.
2. `USING` limite les lignes lisibles/modifiables ; `WITH CHECK` valide aussi la nouvelle ligne lors des insertions et mises à jour.
3. Valider en base l'appartenance active à `tenant_id`. Ne pas prendre le tenant d'une donnée entrante comme preuve d'autorisation.
4. Les relations entre objets privés utilisent des clés étrangères composites incluant `tenant_id`, pour empêcher une référence croisée inter-tenant.
5. `staging` est inaccessible aux rôles `anon` et `authenticated`; les connecteurs utilisent un chemin serveur limité.
6. Les décisions humaines sont créées par fonction transactionnelle contrôlée. Aucun client ne modifie directement `review_status`; aucune identité système n'est considérée comme un humain.
7. Les décisions et événements d'audit sont append-only pour les rôles applicatifs. Les vues et fonctions `SECURITY DEFINER` fixent un `search_path`, vérifient l'identité et ont des privilèges révoqués au public.
8. Tester l'accès en lecture, insertion, mise à jour, suppression, requêtes relationnelles, vues, fonctions et exports avec deux tenants et chaque rôle.
9. Ne pas exposer les contacts, les notes internes, les données partenaires ou investisseurs entre tenants ou entre un tenant et MajestiOS.
10. Toute utilisation de la clé `service_role` se fait sur serveur uniquement et doit être réduite au strict nécessaire ; elle contourne généralement la RLS et ne remplace pas les contrôles applicatifs.

**Critère de sortie RLS :** tests automatisés reproductibles prouvant qu'un utilisateur du tenant A ne peut pas lire, inférer, joindre, créer ou modifier des données du tenant B, y compris en changeant les identifiants, le corps de requête, filtres, relations et paramètres de fonction.

## 9. Prompts IA et contrats de sortie

Chaque prompt est versionné dans `ai/prompts/`, couvert par des jeux d'exemples positifs/négatifs et journalisé avec sa version. Les règles système ci-dessous s'appliquent à tous les cas d'usage.

### 9.1 Instruction commune

```text
Tu assistes un professionnel de l'intelligence commerciale.
Sépare strictement les faits fournis, les hypothèses que tu infères et les décisions humaines.
N'invente ni source, ni citation, ni donnée d'entreprise ou de personne.
Si la preuve est absente, contradictoire, ancienne ou incomplète, indique-le et demande une vérification.
Un marché gagné/perdu ou un signal RH n'établit pas à lui seul un besoin commercial.
Ne décide pas qu'une opportunité est acceptée. Ne contacte personne et ne déclenche aucune action externe.
Fournis une justification concise, les limites, la fraîcheur et les preuves utilisées.
Respecte le format JSON demandé ; si les entrées ne permettent pas de conclure, retourne un résultat indéterminé.
```

### 9.2 Qualification d'un événement

**Entrées autorisées :** `source_record_id`, métadonnées autorisées, payload normalisé, date observée/collectée, version du schéma. Ne pas envoyer de secret ni d'information non nécessaire.

**Sortie JSON proposée :**

```json
{
  "classification": "valid | needs_review | reject",
  "facts": [
    {
      "statement": "formulation strictement appuyée par la source",
      "source_record_id": "uuid",
      "observed_at": "RFC3339 ou null",
      "confidence": 0.0
    }
  ],
  "missing_fields": [],
  "validation_notes": [],
  "human_review_required": true
}
```

Le résultat IA ne promeut pas lui-même le record. Une règle métier ou un valideur autorisé exécute la transition.

### 9.3 Détection d'une hypothèse

```json
{
  "hypothesis_type": "code canonique",
  "title": "formulation explicitement hypothétique",
  "explanation": "raisonnement vérifiable, sans fait ajouté",
  "supporting_fact_ids": ["uuid"],
  "supporting_source_record_ids": ["uuid"],
  "confidence_score": 0.0,
  "uncertainty_level": 1.0,
  "limitations": [],
  "expires_at": "RFC3339 ou null",
  "suggested_next_step": "vérification humaine non engageante",
  "review_status": "draft"
}
```

Le serveur vérifie que les identifiants cités appartiennent au même tenant et au périmètre transmis, puis persiste l'interaction. Le statut est toujours `draft` ou `pending_review`, jamais `accepted`.

### 9.4 Rédaction assistée / partenaire / investisseur

L'IA peut produire un brouillon interne et une liste de vérifications. Elle ne peut pas envoyer, publier, soumettre, partager un dossier ou contacter une personne. Avant toute action externe, une personne habilitée revoit le contenu, son destinataire, la base d'autorisation et le mandat. Les estimations ou correspondances sont indiquées comme exploratoires, jamais comme garantie.

## 10. Ontologies et statuts canoniques

### 10.1 Types de signal proposés

| Code | Interprétation autorisée | Formulation de prudence |
|---|---|---|
| `LOST_TENDER_DEVELOPMENT_NEED` | Piste possible après perte d'un marché. | N'établit ni volonté d'être contacté ni besoin d'accompagnement. |
| `WON_TENDER_SUPPLY_NEED` | Besoin potentiel d'exécution après attribution. | L'attribution est le fait ; le besoin fournisseur demeure à confirmer. |
| `TRIPLE_RH_EXPANSION_SIGNAL` | Convergence de signaux RH. | « Signal fort de croissance, à confirmer ». |
| `SECTORIAL_RH_THERMOMETER` | Mesure/observation sectorielle agrégée. | Décrire période, couverture, sources et limites. |
| `PARTNER_MATCH` | Hypothèse d'adéquation entre organisations. | Le score ne garantit pas un partenariat ni une mise en relation. |
| `INVESTOR_MATCH` | Hypothèse de pertinence d'un investisseur/financeur. | Ne pas promettre un financement ou une levée. |

### 10.2 Statuts initiaux

| Objet | Statuts proposés |
|---|---|
| Record staging | `received`, `parsed`, `needs_review`, `rejected`, `qualified`, `quarantined` |
| Fait memory | `qualified`, `superseded`, `expired` |
| Hypothèse | `draft`, `pending_review`, `accepted`, `rejected`, `deferred`, `expired`, `superseded` |
| Activité | `planned`, `in_progress`, `completed`, `cancelled`, `no_response` |
| Résultat d'activité | `confirmed`, `not_confirmed`, `no_follow_up`, `converted`, `other` |
| Mission | `draft`, `proposed`, `authorized`, `active`, `paused`, `completed`, `cancelled` |
| Dossier partenaire | `identified`, `qualifying`, `contacted`, `discussion`, `active`, `closed`, `declined` |
| Qualification investisseur | `identified`, `qualifying`, `qualified`, `rejected` |

Les transitions autorisées, rôles, préconditions et effets sont définis dans `packages/core` et confirmés par les transactions serveur. Un statut ne peut pas être changé uniquement parce qu'une chaîne est fournie par le navigateur ou générée par l'IA.

## 11. Plan de génération et critères d'acceptation

### Phase 0 — Validation du Build Master

- Arbitrer les éléments de la section 12.
- Geler les versions des référentiels et établir un registre des décisions.
- Confirmer le périmètre du MVP et les sources de démonstration.

**Sortie :** MAJ-BUILD-001 versionné et validé comme spécification ; aucune prétention d'implémentation.

### Phase 1 — Fondations du dépôt

- Choisir et créer le workspace, les applications public et authentifiée et les packages partagés.
- Configurer TypeScript, lint, tests, variables d'environnement par environnement et build Vercel.
- Créer les vraies routes publiques, la navigation visiteurs/prospects/clients et les états de chargement/erreur.
- Garder les données fictives explicitement étiquetées ; ne pas simuler un backend.

**Sortie :** build reproductible, routes profondes accessibles, navigation responsive et documentation d'exécution.

### Phase 2 — Identité, tenant et données

- Créer migrations versionnées, authentification retenue et modèle tenant/membership.
- Ajouter les entités de base organisations, contacts, faits et activités.
- Activer RLS immédiatement, puis tester les parcours et tentatives d'accès croisé.

**Sortie :** parcours d'inscription/connexion et première donnée vérifiables ; aucune donnée cross-tenant accessible.

### Phase 3 — Opportunités et Human Gate

- Construire staging, qualification, signaux, hypothèses, preuves et file de revue.
- Implémenter la décision transactionnelle et l'audit append-only.
- Créer les pages détail, acceptation, rejet, report et vérification.

**Sortie :** test démontrant qu'une hypothèse IA ne peut pas devenir une opportunité active sans décision humaine autorisée.

### Phase 4 — Activités et mémoire

- Construire timeline, clôture avec résultat, et processus de qualification d'une connaissance issue du résultat.
- Vérifier la propriété et les rôles dans chaque route.

**Sortie :** parcours complet opportunité → décision → activité → résultat → fait qualifié.

### Phase 5 — Ingestion réelle et services opérés

- Étudier les conditions, contrats, quotas et disponibilité des sources avant le premier connecteur réel.
- Activer d'abord un seul connecteur dans un environnement non productif, avec idempotence et reprise bornée.
- Construire Coach et Double Dossier après validation du pilote, du mandat et de l'isolation.

**Sortie :** preuves d'ingestion, erreurs observables, provenance et absence de promotion non contrôlée.

### Phase 6 — Extensions

- Partenaires/investisseurs après validation de la séparation des dossiers.
- A2 (post-attribution, évaluation, immobilier, équipements) après stabilisation du cœur.
- Kafka ou architecture distribuée uniquement sur mesure démontrant un besoin.

### Critères généraux avant production

- Tests unitaires des transitions et validations ; contrats API de succès/erreur ; tests e2e des parcours utiles.
- Tests RLS complets sur deux tenants, toutes les opérations et les rôles.
- Aucun secret dans le bundle navigateur, journaux ou artefacts publics.
- Toute erreur d'intégration est visible et corrélable ; retries bornés et idempotents.
- Sources, hypothèses, limites, fraîcheur et décisions sont visibles selon les permissions.
- Revue accessibilité, responsive, confidentialité et parcours de suppression/rétention à compléter.
- Déploiement et rollback documentés ; aucune mention de « production », « conforme » ou « intégré » sans preuve datée.

## 12. Décisions à obtenir avant le développement du socle

| ID | Décision requise | Proposition de travail | Pourquoi bloquant |
|---|---|---|---|
| D-01 | Statut officiel et version des sources de référence | Conserver MAJ-BUILD-001 comme proposition jusqu'à validation explicite. | Résoudre les contradictions de doctrine et éviter de figer une proposition. |
| D-02 | Architecture de dépôt et framework | Stack frontend validée par les instructions Copilot : Next.js, TypeScript, Tailwind et shadcn/ui ; monorepo avec `apps/landing` et `apps/web`. | Le dépôt actuel est un site statique ; toute migration et le choix des versions restent à planifier explicitement. |
| D-03 | Fournisseur d'authentification et invitation | Supabase Auth est la cible documentaire ; confirmer flux et gestion des comptes. | Détermine les identités, les memberships et les tests RLS. |
| D-04 | Propriété des données publiques et des organisations | Sources publiques platform-wide ; comptes et relations CRM isolés par tenant. | Détermine partage, duplication, RLS et conditions de réutilisation. |
| D-05 | Modèle des rôles et privilèges Super Admin | Appliquer la matrice proposée, confirmer portée de chaque rôle et accès de support. | L'accès plateforme peut exposer les dossiers clients. |
| D-06 | Source BOAMP et conditions d'accès | Aucune intégration présumée ; valider l'API, la licence, la cadence et le périmètre. | Évite une collecte indisponible ou non autorisée. |
| D-07 | Autres sources et données personnelles | Évaluer séparément TED, SIRENE, emploi/RH et données membres. | Qualité, droit d'accès, minimisation et rétention diffèrent par source. |
| D-08 | Service IA, région, rétention et données transmises | N'envoyer que les champs strictement nécessaires après choix du fournisseur. | Les modèles et transferts affectent les données, coûts et engagements. |
| D-09 | Durées de conservation et effacement | Définir une politique distincte pour staging, mémoire, audit et interactions IA. | Le schéma ne doit pas faire supposer une conservation indéfinie. |
| D-10 | Tarifs, contrats et périmètre des services Coach | Hors de ce build jusqu'à validation métier et contractuelle. | Ne pas afficher de prix, engagement ou prestation comme décidé. |
| D-11 | Activation de partenaires/investisseurs et A2 | Phases ultérieures, non-MVP. | Éviter de retarder le socle et de croiser des dossiers confidentiels. |
| D-12 | Déploiement, environnements, sauvegardes et secrets | Vercel/Supabase sont candidats, à confirmer pour chaque environnement. | Les sources documentaires ne prouvent ni projet ni configuration existante. |

Tant que ces décisions ne sont pas prises, un développeur peut produire des maquettes, contrats typés et tests à données fictives ; il ne doit pas exécuter de migration irréversible, collecter des données réelles, activer de connecteur ou exposer un parcours d'authentification comme fonctionnel.

## 13. Sources documentaires

- `00_MAJ-DOC_Doctrine-Fondatrice_V1.1-travail-1` — primauté de la Doctrine, séparation des faits, hypothèses et décisions.
- `01_MAJ-REG_Gouvernance-Referentiel_V1.1-travail-1` — nomenclature et statut des propositions.
- `02_MAJ-T1_Vision-Strategie-Modele-Business_V1.6-travail-1` — positionnement, priorités et phases.
- `03_MAJ-T2_Fonctionnel-Metier-Coach_V1.6-travail-1` — règles de qualification, Human Gate et parcours métier.
- `04_MAJ-T3_Parcours-Experience-Interfaces_V1.6-travail-1` — rôles, parcours et écrans.
- `05_MAJ-T4_Architecture-Securite_V1.6-travail-1` — architecture logique, staging, RLS et contrôles.
- `06_MAJ-T5_Donnees-Ontologies_V1.6-travail-1` — modèle conceptuel, champs et vocabulaires.
- `07_MAJ-T6_API-Connecteurs-Services_V1.6-travail-2` — contrats cibles, ingestion et intégrations.
- `08_MAJ-T7_Deploiement-Operations_V1.6-travail-1` — phases et preuves opérationnelles.
- `09_MAJ-A2_Post-Attribution-Extensions-Business_V1.2-travail-1` — extensions différées.
- `10_MAJ-INDEX_Guide-de-lecture-et-controle_V1.0-1` — ordre de lecture et limites de preuve.
- Pièce jointe utilisateur de 529 lignes — proposition de schéma SQL initial, revue et corrigée dans la section 4.
- `.github/copilot-instructions.md` et `copilot/forbidden-assumptions.md` — règles opérationnelles de génération, subordonnées à l'autorité documentaire.

**Clause de gouvernance :** en cas de conflit entre ce plan, le SQL de travail, une implémentation future ou une source de rang supérieur, suspendre le périmètre concerné, tracer le conflit et demander l'arbitrage du Fondateur. Ce document ne certifie ni conformité réglementaire, ni sécurité effective, ni disponibilité d'une intégration.
