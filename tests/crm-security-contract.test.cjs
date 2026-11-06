const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const schema = read("supabase/migrations/20261105163901_majestios_core_multitenant_foundation.sql");
const roles = read("supabase/migrations/20261106074500_enforce_crm_editor_roles.sql");
const bootstrap = read("supabase/migrations/20261106031500_bootstrap_first_internal_admin.sql");
const provisioning = read("supabase/migrations/20261106090000_atomic_client_workspace_provisioning.sql");
const client = read("crm-client.js");
const page = read("crm-page.js");
const crmHtml = read("crm.html");
const edge = read("supabase/functions/provision-client-workspace/index.ts");
const auth = read("auth-espace-membre.js");

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

assert.match(edge, /metadata\.privacy_notice_acknowledged !== true/);
assert.match(edge, /metadata\.privacy_notice_version !== NOTICE_VERSION/);
assert.match(edge, /SUPABASE_SERVICE_ROLE_KEY/);
assert.match(auth, /privacy_notice_version: "2026-11-05"/);
assert.match(auth, /signInWithPassword/);
assert.match(auth, /!memberships\?\.length/);
assert.match(auth, /await provisionWorkspace\(\s*data\.session/);
assert.match(edge, /const NOTICE_VERSION = "2026-11-05"/);
assert.ok(edge.includes("isAllowedOrigin(origin)") && edge.includes("majestios-jc8g-") && edge.includes("ALLOWED_ORIGINS"));
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
assert.ok(page.includes("renderSelect(\"#crm-contact-form [name=business_id]\""));
assert.ok(page.includes("renderSelect(\"#crm-opportunity-form [name=primary_contact_id]\""));
assert.ok(page.includes("renderSelect(\"#crm-activity-form [name=opportunity_id]\""));
console.log("CRM security contract: OK — schéma, privilèges, rôles, isolation tenant, confidentialité, bootstrap, provisionnement et rattachements CRM.");

assert.match(client, /order\(table === "activities" \? "occurred_at"/);
assert.match(client, /changedFields/);
assert.match(client, /previous_status:/);
assert.match(client, /new_status:/);
assert.match(client, /activity_type: activityType/);
assert.match(page, /ajoutée à l’historique/);
assert.match(page, /Intl\.DateTimeFormat\("fr-FR"/);