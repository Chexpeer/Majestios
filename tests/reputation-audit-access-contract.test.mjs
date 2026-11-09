import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../supabase/functions/reputation-audit-context/index.ts", import.meta.url), "utf8");
const quotaMigration = fs.readFileSync(new URL("../supabase/migrations/20261109193000_cheexpeer_reputation_audit_quotas.sql", import.meta.url), "utf8");

test("Cheexpeer reputation audit requires a valid Supabase user and an organization membership", () => {
  assert.match(source, /auth\.getUser\(token\)/);
  assert.match(source, /from\("organization_members"\)/);
  assert.match(source, /\.select\("organization_id"\)/);
  assert.match(source, /\.eq\("user_id", data\.user\.id\)/);
  assert.match(source, /if \(!memberships\?\.length\) return null/);
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY/);
});

test("Cheexpeer consumes a persistent quota using the authenticated member client", () => {
  assert.match(source, /consume_reputation_audit_quota/);
  assert.match(source, /user\.quotaClient\.rpc/);
  assert.match(quotaMigration, /pg_advisory_xact_lock/);
  assert.match(quotaMigration, /v_user_count >= 5 or v_org_count >= 25/);
  assert.match(quotaMigration, /usage_date < v_usage_date - 90/);
  assert.match(quotaMigration, /create or replace function private\.consume_reputation_audit_quota/);
  assert.match(quotaMigration, /security definer/);
  assert.match(quotaMigration, /create or replace function public\.consume_reputation_audit_quota/);
  assert.match(quotaMigration, /security invoker/);
  assert.match(quotaMigration, /revoke all on function private\.consume_reputation_audit_quota\(uuid\) from public, anon/);
  assert.match(quotaMigration, /private\.is_org_member/);
  assert.match(quotaMigration, /grant execute on function public\.consume_reputation_audit_quota\(uuid\) to authenticated/);
});
