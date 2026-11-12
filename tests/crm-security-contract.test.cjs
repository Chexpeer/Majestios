const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const schema = read("supabase/migrations/20261105163901_majestios_core_multitenant_foundation.sql");
const roles = read("supabase/migrations/20261106074500_enforce_crm_editor_roles.sql");
const crmColumnHardening = read("supabase/migrations/20261109160000_restrict_crm_update_columns.sql");
const crmActivityHistory = read("supabase/migrations/20261109170000_atomic_crm_activity_history.sql");
const crmRelationshipIntegrity = read("supabase/migrations/20261109190000_enforce_crm_business_relationships.sql");
const reminderVipHardening = read("supabase/migrations/20261109180000_harden_crm_reminder_vip_rpc.sql");
const officialImportPermission = read("supabase/migrations/20261107070406_harden_import_permission_and_sync_index.sql");
const officialImportVipHardening = read("supabase/migrations/20261109194500_harden_official_import_vip_permissions.sql");
const officialImportEdge = read("supabase/functions/import-official-company/index.ts");
const vipBoundary = read("supabase/migrations/20261108151400_enforce_vip_boundary_for_internal_crm.sql");
const tenantCrmPermissions = read("supabase/migrations/20261109200000_restore_tenant_scoped_crm_permissions.sql");
const crmIntegrityActivation = read("supabase/migrations/20261109210000_activate_crm_integrity_and_reminder_rpc.sql");
const bootstrap = read("supabase/migrations/20261106031500_bootstrap_first_internal_admin.sql");
const provisioning = read("supabase/migrations/20261106090000_atomic_client_workspace_provisioning.sql");
const client = read("crm-client.js");
const page = read("crm-page.js");
const crmHtml = read("crm.html");
const edge = read("supabase/functions/provision-client-workspace/index.ts");
const auth = read("auth-espace-membre.js");
const internalAccess = read("espace-interne.js");
const internalPage = read("espace-interne.html");

const columnsByTable = {};
for (const match of schema.matchAll(/create table public\.(\w+) \(([\s\S]*?)\n\);/g)) {
  const columns = new Set();
  for (const line of match[2].split("\n")) {
    for (const column of line.matchAll(/(?:^|,)\s*([a-z_]+)\s+(?=[a-z])/g)) {
      columns.add(column[1]);
    }
  }
  columnsByTable[match[1]] = columns;
}

for (const match of roles.matchAll(/grant update \(([\s\S]*?)\) on public\.(\w+) to authenticated;/g)) {
  const table = match[2];
  const columns = match[1].split(",").map((column) => column.trim()).filter(Boolean);
  assert.ok(columnsByTable[table], `La table ${table} doit exister dans le schéma initial.`);
  for (const column of columns) {
    assert.ok(columnsByTable[table].has(column), `La colonne ${table}.${column} accordée en UPDATE doit exister.`);
  }
}

for (const [table, policy] of [
  ["businesses", "Members can create businesses"],
  ["businesses", "Members can update businesses"],
  ["contacts", "Members can create contacts"],
  ["contacts", "Members can update contacts"],
  ["opportunities", "Members can create opportunities"],
  ["opportunities", "Members can update opportunities"],
  ["activities", "Members can append activities"]
]) {
  assert.ok(schema.includes(`create policy "${policy}" on public.${table}`), `La politique initiale ${policy} doit être connue.`);
  assert.ok(roles.includes(`drop policy if exists "${policy}" on public.${table}`), `La politique initiale ${policy} doit être retirée par la migration des rôles.`);
}

assert.match(roles, /m\.role in \('owner', 'admin', 'member'\)/);
assert.match(roles, /create policy "Editors can append activities"/);
assert.match(roles, /revoke update on public\.businesses, public\.contacts, public\.opportunities from authenticated/);
assert.ok(crmColumnHardening.includes("revoke update on public.businesses, public.contacts, public.opportunities from authenticated"));
for (const table of ["businesses", "contacts", "opportunities"]) {
  const grantPattern = new RegExp("grant update \\(([\\s\\S]*?)\\) on public\\." + table + " to authenticated;");
  const historicalGrant = roles.match(grantPattern);
  const finalGrant = crmColumnHardening.match(grantPattern);
  assert.ok(historicalGrant, "Liste blanche historique absente : " + table);
  assert.ok(finalGrant, "Liste blanche finale absente : " + table);
  assert.deepEqual(finalGrant[1].split(",").map(column => column.trim()).filter(Boolean),
    historicalGrant[1].split(",").map(column => column.trim()).filter(Boolean),
    "Les colonnes autorisées doivent rester identiques pour " + table);
}
assert.ok(crmColumnHardening.indexOf("revoke update") < crmColumnHardening.indexOf("grant update"),
  "Le droit global doit être révoqué avant les droits ciblés.");
assert.ok(vipBoundary.includes("private.can_read_crm_org"));
assert.ok(vipBoundary.includes("private.can_edit_crm_org"));
assert.ok(vipBoundary.includes("m.role in ('owner', 'admin')"));
assert.ok(vipBoundary.includes('create policy "Authorized users can read businesses"'));
assert.ok(vipBoundary.includes("private.can_edit_crm_org(v_reminder.organization_id)"));

assert.match(vipBoundary, /o\.kind <> 'internal'\s+or m\.role in \('owner', 'admin'\)/,
  "La lecture CRM interne doit être réservée aux rôles VIP.");
assert.match(vipBoundary, /o\.kind = 'internal' and m\.role in \('owner', 'admin'\)/,
  "L’écriture CRM interne doit être réservée aux rôles VIP.");
assert.match(vipBoundary, /o\.kind <> 'internal' and m\.role in \('owner', 'admin', 'member'\)/,
  "Les membres doivent conserver leurs droits d’écriture dans leur propre tenant client/partenaire.");

for (const [table, oldRead, oldInsert, oldUpdate, newRead, newInsert, newUpdate] of [
  ["businesses", "Members can read businesses", "Editors can create businesses", "Editors can update businesses", "Authorized users can read businesses", "Authorized editors can create businesses", "Authorized editors can update businesses"],
  ["contacts", "Members can read contacts", "Editors can create contacts", "Editors can update contacts", "Authorized users can read contacts", "Authorized editors can create contacts", "Authorized editors can update contacts"],
  ["opportunities", "Members can read opportunities", "Editors can create opportunities", "Editors can update opportunities", "Authorized users can read opportunities", "Authorized editors can create opportunities", "Authorized editors can update opportunities"]
]) {
  for (const [oldName, newName] of [[oldRead,newRead],[oldInsert,newInsert],[oldUpdate,newUpdate]]) {
    assert.ok(vipBoundary.includes(`drop policy if exists "${oldName}" on public.${table}`),
      `L’ancienne politique ${oldName} doit être retirée.`);
    assert.ok(vipBoundary.includes(`create policy "${newName}"`),
      `La politique VIP ${newName} doit être créée.`);
  }
}
for (const [table, oldName, newName] of [
  ["activities", "Members can read activities", "Authorized users can read activities"],
  ["activities", "Editors can append activities", "Authorized editors can append activities"],
  ["crm_reminders", "Members can read their CRM reminders", "Authorized users can read their CRM reminders"],
  ["crm_reminders", "Editors can mark their CRM reminders read", "Authorized editors can mark their CRM reminders read"]
]) {
  assert.ok(vipBoundary.includes(`drop policy if exists "${oldName}" on public.${table}`),
    `L’ancienne politique ${oldName} doit être retirée.`);
  assert.ok(vipBoundary.includes(`create policy "${newName}"`),
    `La politique VIP ${newName} doit être créée.`);
}
assert.match(vipBoundary, /create or replace function public\.complete_crm_reminder\(p_reminder_id uuid\)[\s\S]*?security definer\s+set search_path = ''/);
assert.match(vipBoundary, /revoke all on function public\.complete_crm_reminder\(uuid\) from public, anon/);
assert.match(vipBoundary, /grant execute on function public\.complete_crm_reminder\(uuid\) to authenticated/);
assert.ok(client.includes('!["owner", "admin"].includes(membership.role)'));
assert.match(internalAccess, /const canAdminister = \["owner", "admin"\]\.includes\(membership\.role\)/);
assert.match(internalAccess, /crmLink\.hidden = !canAdminister/);
assert.match(internalAccess, /const destinationAllowed = canAdminister/);
assert.match(internalAccess, /\["crm\.html", "administration\.html", "admin-recherches\.html"\]/);
assert.match(internalPage, /id="internal-crm-link"/);

assert.match(client, /supabase\.auth\.getUser\(\)/);
assert.match(client, /organization\.kind === "internal"/);
assert.match(client, /\.eq\("organization_id", membership\.organization_id\)/);
assert.match(client, /membership\.role === "viewer"/);
assert.match(client, /async function update\(table, id, values\)/);
assert.match(client, /editableColumns/);
assert.match(client, /\.eq\("organization_id", membership\.organization_id\)\.select/);
assert.match(client, /payload\.qualification_score = score/);
assert.match(client, /updateBusiness: \(id, values\)/);
assert.match(client, /updateContact: \(id, values\)/);
assert.match(client, /updateOpportunity: \(id, values\)/);
assert.match(page, /consultation seule/);
assert.match(page, /renderEditableList/);
assert.match(page, /Modifier \/ qualifier l’entreprise/);
assert.match(page, /Qualifier l’opportunité/);
assert.match(page, /qualification_status/);
assert.match(page, /qualification_score/);
assert.match(page, /Ne pas contacter/);

const crmPayloadColumns = {
  businesses: ["legal_name", "website", "city", "country_code", "qualification_status", "organization_id", "created_by"],
  contacts: ["last_name", "first_name", "email", "phone", "consent_status", "organization_id", "created_by"],
  opportunities: ["title", "description", "source_type", "status", "organization_id", "created_by"],
  activities: ["subject", "activity_type", "body", "organization_id", "actor_user_id"]
};
for (const [table, columns] of Object.entries(crmPayloadColumns)) {
  for (const column of columns) {
    assert.ok(columnsByTable[table]?.has(column), `Le payload CRM utilise une colonne absente : ${table}.${column}`);
  }
}
for (const value of ["manual", "boamp", "bodacc", "private_market", "partner", "other"]) {
  assert.ok(schema.includes(`'${value}'`), `Source d’opportunité absente du schéma : ${value}`);
  assert.ok(crmHtml.includes(`<option value="${value}"`), `Source d’opportunité absente du formulaire : ${value}`);
}
for (const value of ["note", "call", "email", "meeting", "task", "qualification"]) {
  assert.ok(schema.includes(`'${value}'`), `Type d’activité absent du schéma : ${value}`);
  assert.ok(crmHtml.includes(`<option value="${value}"`), `Type d’activité absent du formulaire : ${value}`);
}
assert.match(page, /qualification_status: "to_review"/);
assert.match(page, /consent_status: "unknown"/);
assert.match(page, /status: "detected"/);

assert.match(edge, /body\.privacy_acknowledged !== true/);
assert.match(edge, /metadata\.privacy_notice_acknowledged !== true/);
assert.match(edge, /metadata\.privacy_notice_version !== NOTICE_VERSION/);
assert.match(edge, /body\.flow !== "signup"/);
assert.match(edge, /const noticeVersion = NOTICE_VERSION/);
assert.match(edge, /SUPABASE_SERVICE_ROLE_KEY/);
assert.match(auth, /shouldCreateUser: false/);
assert.doesNotMatch(auth, /provisionWorkspace|privacy_notice_version|mode === "signup"/);
assert.match(auth, /signInWithOtp/);
assert.match(auth, /verifyOtp/);
assert.match(auth, /!memberships\?\.length/);
assert.match(edge, /const NOTICE_VERSION = "2026-11-05"/);
assert.ok(edge.includes("isAllowedOrigin(origin)") && edge.includes("majestios-jc8g-") && edge.includes("ALLOWED_ORIGINS"));
assert.match(edge, /return allowedOrigins\.includes\(origin\)/);
assert.doesNotMatch(edge, /majestios-jc8g-\[a-z0-9-\]\+/,
  "Les previews Vercel doivent être autorisées explicitement, sans motif générique.");
assert.ok(!edge.includes('"Access-Control-Allow-Origin": "*"'));
assert.match(edge, /admin\.rpc\("provision_client_workspace"/);
assert.doesNotMatch(edge, /\.from\("organizations"\)\s*\.insert/);
assert.doesNotMatch(edge, /\.from\("organization_members"\)\s*\.insert/);
assert.match(provisioning, /security definer\s+set search_path = ''/);
assert.match(provisioning, /coalesce\(auth\.role\(\), ''\) <> 'service_role'/);
assert.match(provisioning, /pg_advisory_xact_lock/);
assert.match(provisioning, /email_confirmed_at/);
assert.match(provisioning, /grant execute on function public\.provision_client_workspace[\s\S]*to service_role/);
assert.match(provisioning, /privacy_acknowledgments/);
assert.match(provisioning, /organization_members/);
assert.match(provisioning, /public\.organizations/);

assert.match(bootstrap, /pg_advisory_xact_lock/);
assert.match(bootstrap, /email_confirmed_at/);
assert.match(bootstrap, /grant execute on function private\.bootstrap_first_internal_admin\(uuid\) to service_role/);
assert.match(bootstrap, /grant usage on schema private to service_role/);

for (const field of ["business_id", "primary_contact_id", "contact_id", "opportunity_id"]) {
  assert.ok(crmHtml.includes("name=\"" + field + "\""), "Le formulaire CRM doit exposer le rattachement " + field + ".");
  assert.ok(page.includes(field + ": nullableId(data." + field + ")"), "Le rattachement " + field + " doit être transmis au client CRM.");
}
assert.match(crmRelationshipIntegrity, /opportunity contact must belong to the opportunity business/);
assert.match(crmRelationshipIntegrity, /activity contact must match the opportunity business/);
assert.match(crmRelationshipIntegrity, /activity business must match the opportunity business/);
assert.match(crmRelationshipIntegrity, /create unique index if not exists businesses_org_siret_unique/);
assert.match(crmRelationshipIntegrity, /group by organization_id, regexp_replace\(siret, '\[\^0-9\]', '', 'g'\)\s+having count\(\*\) > 1/);
assert.match(crmRelationshipIntegrity, /regexp_replace\(siret, '\[\^0-9\]', '', 'g'\) <> ''/);
assert.ok(page.includes("const relationSelectors = ["));
for (const selector of [
  "#crm-contact-form [name=business_id]",
  "#crm-opportunity-form [name=primary_contact_id]",
  "#crm-activity-form [name=opportunity_id]"
]) {
  assert.ok(page.includes('["' + selector + '"'),
    "Le sélecteur relationnel distant doit être configuré : " + selector);
}
assert.ok(page.includes("setupRemoteRelationSelectors();"),
  "Les sélecteurs relationnels doivent être initialisés au chargement du CRM.");
console.log("CRM security contract: OK — schéma, privilèges, rôles, isolation tenant, confidentialité, bootstrap, provisionnement et rattachements CRM.");

assert.match(client, /order\(table === "activities" \? "occurred_at"/);
assert.match(crmActivityHistory, /create or replace function public\.record_crm_activity\(\)/);
assert.match(crmActivityHistory, /after insert or update on public\.businesses/);
assert.match(crmActivityHistory, /after insert or update on public\.contacts/);
assert.match(crmActivityHistory, /after insert or update on public\.opportunities/);
assert.match(crmActivityHistory, /insert into public\.activities/);
assert.match(crmActivityHistory, /'changed_fields', to_jsonb\(v_changed_fields\)/);
assert.match(crmActivityHistory, /'event', 'created'/);
assert.match(crmActivityHistory, /'event', 'updated'/);
assert.match(client, /Le trigger SQL écrit l'activité dans la même transaction/);
assert.match(client, /\.contains\("metadata", \{ event: "updated", entity_type: table, entity_id: id, changed_fields: changedFields \}\)/);
assert.match(client, /historyRecorded: !historyReadError && Boolean\(historyRows\?\.length\)/);
assert.doesNotMatch(client, /const \{ error: historyError \} = await supabase\.from\("activities"\)\.insert/);
assert.match(page, /ajoutée à l’historique/);
assert.match(page, /Intl\.DateTimeFormat\("fr-FR"/);
assert.match(page, /function renderFollowups\(opportunities\)/);
assert.match(page, /const closedStatuses = new Set\(\["won", "lost", "archived"\]\)/);
assert.match(page, /groups\.overdue\.push\(row\)/);
assert.match(page, /groups\.today\.push\(row\)/);
assert.match(page, /groups\.upcoming\.push\(row\)/);
assert.match(page, /groups\.unplanned\.push\(row\)/);
assert.match(page, /Ouvrir la fiche/);
assert.match(page, /new Date\(values\.next_action_at\)\.toISOString\(\)/);
assert.match(page, /values\.next_action_at = values\.next_action_at \?/);
assert.match(page, /renderFollowups\(opportunities\)/);
assert.match(page, /function sendDueReminders\(opportunities\)/);
assert.match(page, /Notification\.requestPermission\(\)/);
assert.match(page, /Notification\.permission !== "granted"/);
assert.match(page, /new Notification\(/);
assert.match(page, /notifiedReminders\.has\(key\)/);
assert.match(page, /notification\.addEventListener\("click"/);
assert.match(page, /sendDueReminders\(opportunities\)/);
assert.ok(crmHtml.includes('id="crm-enable-reminders"'), "Le contrôle d’activation des alertes est absent.");
assert.ok(crmHtml.includes('id="crm-reminder-status"'), "Le statut des alertes est absent.");

for (const id of ["overdue", "today", "upcoming", "unplanned"]) {
  assert.ok(crmHtml.includes(`id="crm-followup-${id}"`), `Vue de relance absente : ${id}`);
  assert.ok(crmHtml.includes(`id="crm-followup-${id}-count"`), `Compteur de relance absent : ${id}`);
}

const persistentReminders = read("supabase/migrations/20261106100000_persistent_crm_reminders.sql");
for (const fragment of [
  "create table if not exists public.crm_reminders",
  "enable row level security",
  "private.is_org_member(organization_id)",
  "private.is_org_editor(organization_id)",
  "unique (organization_id, opportunity_id, due_at)",
  "on conflict (organization_id, opportunity_id, due_at) do nothing",
  "cron.schedule",
  "'*/5 * * * *'",
  "status not in ('won', 'lost', 'archived')"
]) {
  assert.ok(persistentReminders.includes(fragment), "Contrat de relance absent : " + fragment);
}
assert.ok(client.includes("async function listReminders()"));
assert.ok(client.includes("async function markReminderRead(id)"));
assert.ok(page.includes("function renderPersistentReminders(reminders, canEdit)"));
assert.ok(page.includes("Marquer comme traitée"));
assert.ok(page.includes("MajestiosCRM.listReminders()"));
assert.ok(crmHtml.includes('id="crm-persistent-reminders"'), "Le panneau de relances persistantes est absent.");

const reminderLifecycle = read("supabase/migrations/20261106110000_sync_crm_reminder_lifecycle.sql");
for (const fragment of [
  "add column if not exists cancelled_at",
  "state in ('pending', 'read', 'cancelled')",
  "create or replace function private.sync_crm_reminders_for_opportunity",
  "after update of status, title, next_action, next_action_at",
  "state = 'cancelled', cancelled_at = now()",
  "due_at is distinct from new.next_action_at",
  "where public.crm_reminders.state = 'cancelled'",
  "read_at = null"
]) assert.ok(reminderLifecycle.includes(fragment), "Cycle de vie des relances incomplet : " + fragment);

const reminderCompletion = read("supabase/migrations/20261106120000_complete_crm_reminder_with_activity.sql");
for (const fragment of [
  "create or replace function public.complete_crm_reminder",
  "private.is_org_editor(v_reminder.organization_id)",
  "for update",
  "update public.crm_reminders",
  "state = 'read'",
  "insert into public.activities",
  "'crm_reminder'",
  "'reminder_id', v_reminder.id",
  "grant execute on function public.complete_crm_reminder(uuid) to authenticated"
]) assert.ok(reminderCompletion.includes(fragment), "Clôture de relance non conforme : " + fragment);
assert.ok(client.includes('supabase.rpc("complete_crm_reminder"'));
assert.match(reminderVipHardening, /create or replace function public\.complete_crm_reminder\(p_reminder_id uuid\)/);
assert.match(reminderVipHardening, /private\.is_org_admin\(v_reminder\.organization_id\)/);
assert.doesNotMatch(reminderVipHardening.slice(reminderVipHardening.indexOf("as $")), /private\.is_org_editor\(/);
assert.match(reminderVipHardening, /security definer\s+set search_path = ''/);
assert.match(reminderVipHardening, /revoke all on function public\.complete_crm_reminder\(uuid\) from public, anon/);
assert.match(reminderVipHardening, /grant execute on function public\.complete_crm_reminder\(uuid\) to authenticated/);
assert.ok(page.includes("Relance traitée et ajoutée à l’historique"));
assert.ok(page.includes("const businessById = new Map(businesses.map"));
assert.ok(page.includes("const contactById = new Map(contacts.map"));
assert.ok(page.includes("const opportunityById = new Map(opportunities.map"));
assert.ok(page.includes("crm-timeline-context"));
assert.ok(page.includes("activityTypes[row.activity_type]"));


console.log("CRM persistent reminders contract: OK — persistance, déduplication, isolation tenant, cycle de vie et planification PostgreSQL.");


assert.match(officialImportPermission, /private\.is_org_editor\(p_organization_id\)/);
assert.match(officialImportVipHardening, /create or replace function public\.can_import_official_company\(p_organization_id uuid\)/);
assert.match(officialImportVipHardening, /security invoker\s+set search_path = ''/);
assert.match(officialImportVipHardening, /private\.is_org_admin\(p_organization_id\)/);
assert.doesNotMatch(officialImportVipHardening, /private\.is_org_editor\(/);
assert.match(officialImportVipHardening, /revoke all on function public\.can_import_official_company\(uuid\) from public, anon/);
assert.match(officialImportVipHardening, /grant execute on function public\.can_import_official_company\(uuid\) to authenticated/);
assert.ok(officialImportEdge.indexOf('userClient.rpc(\n    "can_import_official_company"') < officialImportEdge.indexOf('createClient(supabaseUrl, serviceKey'),
  "L'import serveur doit être précédé du contrôle VIP avec le client utilisateur.");
assert.ok(officialImportEdge.includes('serviceClient.rpc(\n      "import_official_company_record"'),
  "L'import privilégié doit rester encapsulé dans l'Edge Function.");
console.log("Official company import permissions: OK — seuls owner/admin peuvent déclencher l'import privilégié.");

// The privileged official importer must not expose a wildcard browser origin
// or internal database/upstream errors to callers.
assert.ok(officialImportEdge.includes('Deno.env.get("ALLOWED_ORIGINS")'));
assert.ok(officialImportEdge.includes('"https://majestios.com"'));
assert.ok(officialImportEdge.includes('"https://www.majestios.com"'));
assert.match(officialImportEdge, /function isAllowedOrigin\(origin: string \| null\): boolean/);
assert.match(officialImportEdge, /if \(!isAllowedOrigin\(origin\)\)/);
assert.match(officialImportEdge, /"Access-Control-Allow-Origin": origin/);
assert.doesNotMatch(officialImportEdge, /"Access-Control-Allow-Origin": "\*"/);
assert.match(officialImportEdge, /Accès réservé aux administrateurs VIP de cette organisation/);
assert.doesNotMatch(officialImportEdge, /rôle éditeur/);
assert.doesNotMatch(officialImportEdge, /detail:\s*importError\.message/);
assert.doesNotMatch(officialImportEdge, /upstream_status:/);
assert.doesNotMatch(officialImportEdge, /\{ error: "[^"]+", detail \}/);
assert.match(officialImportEdge, /console\.error\("Official company import failed\."/);
console.log("Official company import hardening: OK — CORS à origine autorisée, rôle VIP cohérent et erreurs internes non exposées.");

// The latest migration must win over the intermediate global VIP-only policy.
// Internal CRM stays VIP-only; client/partner CRM remains tenant-scoped.
for (const table of ["businesses", "contacts", "opportunities"]) {
  assert.match(tenantCrmPermissions,
    new RegExp('create policy "Authorized users can read ' + table + '"[\\s\\S]*?private\\.can_read_crm_org\\(organization_id\\)'));
  assert.match(tenantCrmPermissions,
    new RegExp('create policy "Authorized editors can create ' + table + '"[\\s\\S]*?private\\.can_edit_crm_org\\(organization_id\\)'));
  assert.match(tenantCrmPermissions,
    new RegExp('create policy "Authorized editors can update ' + table + '"[\\s\\S]*?private\\.can_edit_crm_org\\(organization_id\\)'));
}
assert.match(tenantCrmPermissions, /create policy "Authorized users can read activities"[\s\S]*?private\.can_read_crm_org/);
assert.match(tenantCrmPermissions, /create policy "Authorized editors can append activities"[\s\S]*?private\.can_edit_crm_org/);
assert.match(tenantCrmPermissions, /create policy "Authorized users can read their CRM reminders"[\s\S]*?private\.can_read_crm_org/);
assert.match(tenantCrmPermissions, /create policy "Authorized editors can mark their CRM reminders read"[\s\S]*?private\.can_edit_crm_org/);
assert.match(tenantCrmPermissions, /create policy "Organization admins can delete businesses"[\s\S]*?private\.is_org_admin/);
assert.match(tenantCrmPermissions, /create or replace function public\.complete_crm_reminder\(p_reminder_id uuid\)[\s\S]*?private\.can_edit_crm_org\(v_reminder\.organization_id\)/);
assert.match(tenantCrmPermissions, /security definer\s+set search_path = ''/);
assert.match(tenantCrmPermissions, /revoke all on function public\.complete_crm_reminder\(uuid\) from public, anon/);
assert.match(tenantCrmPermissions, /grant execute on function public\.complete_crm_reminder\(uuid\) to authenticated/);
console.log("Tenant CRM permission contract: OK — isolation par organisation, VIP interne, membres clients et suppression admin-only.");

// Integrity must be active as table triggers, not merely present as an unused function.
for (const table of ["businesses", "contacts", "opportunities", "activities"]) {
  assert.match(crmIntegrityActivation,
    new RegExp('create trigger ' + table + '_enforce_tenant_integrity[\\s\\S]*?execute function private\\.enforce_tenant_relationship_integrity\\(\\)'));
}
assert.match(crmIntegrityActivation, /before insert or update on public\.businesses/);
assert.match(crmIntegrityActivation, /before insert or update on public\.contacts/);
assert.match(crmIntegrityActivation, /before insert or update on public\.opportunities/);
assert.match(crmIntegrityActivation, /before insert or update on public\.activities/);

// Browser clients must not close reminders directly and bypass the activity-writing RPC.
assert.match(crmIntegrityActivation, /revoke update on public\.crm_reminders from authenticated/);
assert.match(crmIntegrityActivation, /create or replace function public\.complete_crm_reminder\(p_reminder_id uuid\)/);
assert.match(crmIntegrityActivation, /if not found then\s+raise exception 'Opportunité associée introuvable\.'/);
assert.match(crmIntegrityActivation, /insert into public\.activities/);
assert.match(crmIntegrityActivation, /revoke all on function public\.complete_crm_reminder\(uuid\) from public, anon/);
assert.match(crmIntegrityActivation, /grant execute on function public\.complete_crm_reminder\(uuid\) to authenticated/);
console.log("CRM integrity activation: OK — triggers actifs et clôture de relance exclusivement via RPC atomique.");


// Les créations CRM appliquent une liste blanche indépendante de la validation des formulaires.
// Les champs de tenant et d'identité d'auteur restent toujours définis côté client authentifié.
assert.match(client, /const creatableColumns = Object\.freeze\(/);
assert.match(client, /entries\.some\(\(\[key\]\) => !creatableColumns\[table\]\.has\(key\)\)/);
assert.match(client, /Object\.fromEntries\(entries\), organization_id: membership\.organization_id/);
assert.match(client, /if \(table === "activities"\) payload\.actor_user_id = session\.user\.id/);
assert.match(client, /else payload\.created_by = session\.user\.id/);
assert.match(client, /const changedFields = Object\.entries\(payload\)/);
for (const [table, columns] of Object.entries({
  businesses: ["legal_name", "trade_name", "siren", "siret", "vat_number", "ape_naf", "website", "address_line", "postal_code", "city", "department_code", "country_code", "qualification_status", "qualification_notes", "source_label", "source_url", "assigned_to"],
  contacts: ["business_id", "first_name", "last_name", "job_title", "email", "phone", "is_primary", "source_label", "consent_status"],
  opportunities: ["business_id", "primary_contact_id", "title", "description", "source_type", "source_external_id", "source_url", "source_published_at", "department_code", "status", "qualification_score", "qualification_summary", "assigned_to", "next_action", "next_action_at"],
  activities: ["business_id", "contact_id", "opportunity_id", "activity_type", "subject", "body"]
})) {
  const match = client.match(new RegExp(table + ": new Set\\(\\[([^\\]]+)\\]\\)"));
  assert.ok(match, "Liste blanche de création absente : " + table);
  const allowed = match[1].split(",").map(value => value.trim().replace(/^["']|["']$/g, ""));
  assert.deepEqual(allowed, columns, "Les champs de création autorisés doivent être explicites pour " + table);
  for (const column of allowed) {
    assert.ok(columnsByTable[table]?.has(column), "La création autorise une colonne absente du schéma : " + table + "." + column);
  }
}
