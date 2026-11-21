const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const read = (path) => fs.readFileSync(path, "utf8");

test("chargement DECP : clés uniquement en secrets, jamais écrites ni affichées", () => {
  const workflow = read(".github/workflows/charger-decp.yml");
  const script = read("scripts/charger-decp.py");
  assert.match(workflow, /secrets\.SUPABASE_TEST_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(workflow, /eyJ|sb_secret_|service_role_key:\s*["']?[A-Za-z0-9._-]{20,}/);
  assert.match(workflow, /permissions:\s*\n\s*contents: read/);
  assert.doesNotMatch(script, /print\([^)]*key/i);
  assert.match(script, /MIN_ROWS_TO_PURGE/);
});

test("marchés attribués : accès direct refusé, chargement réservé au service, lecture publique bornée", () => {
  const sql = read("supabase/migrations/20261121160000_awarded_contracts.sql");
  assert.match(sql, /alter table private\.awarded_contracts enable row level security/);
  assert.match(sql, /revoke all on private\.awarded_contracts from public, anon, authenticated/);
  assert.match(sql, /grant execute on function public\.import_awarded_contracts\(jsonb\) to service_role/);
  assert.match(sql, /grant execute on function public\.purge_awarded_contracts\(date\) to service_role/);
  assert.doesNotMatch(sql, /grant execute on function public\.(import|purge)_awarded_contracts[^;]*(anon|authenticated)/);
  assert.match(sql, /least\(greatest\(coalesce\(p_limit, 10\), 1\), 50\)/);
  assert.match(sql, /set search_path = ''/);
});
