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
assert.match(page, /consultation seule/);

assert.match(edge, /metadata\.privacy_notice_acknowledged !== true/);
assert.match(edge, /metadata\.privacy_notice_version !== NOTICE_VERSION/);
assert.match(edge, /SUPABASE_SERVICE_ROLE_KEY/);
assert.match(auth, /privacy_notice_version: "2026-11-05"/);
assert.match(auth, /signInWithPassword/);
assert.match(auth, /!memberships\?\.length/);
assert.match(auth, /await provisionWorkspace\(\s*data\.session/);
assert.match(edge, /const NOTICE_VERSION = "2026-11-05"/);
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

console.log("CRM security contract: OK — schéma, privilèges, rôles, isolation tenant, confidentialité, bootstrap et provisionnement atomique.");
