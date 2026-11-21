import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const migration = await readFile(
  new URL("../supabase/migrations/20261111200000_cheexpeer_api_security_fixes.sql", import.meta.url),
  "utf8"
);

test("idempotency is unique per organization and conflict lookup is tenant-filtered", () => {
  assert.match(migration, /unique index if not exists cheexpeer_missions_org_idempotency_unique\s+on private\.cheexpeer_missions \(organization_id, idempotency_key\)\s+where idempotency_key is not null/i);
  assert.match(migration, /on conflict \(organization_id, idempotency_key\)\s+where idempotency_key is not null\s+do nothing/i);
  assert.match(migration, /where m\.organization_id = p_organization_id\s+and m\.idempotency_key = p_idempotency_key/i);
});

test("expired approval is persisted as a normal return and is never enqueued", () => {
  const start = migration.indexOf("create or replace function private.cheexpeer_decide_approval");
  const end = migration.indexOf("revoke all on function private.cheexpeer_submit_mission", start);
  assert.ok(start >= 0 && end > start);
  const fn = migration.slice(start, end);
  const expiry = fn.indexOf("set status = 'expired'");
  const returned = fn.indexOf("return query select 'expired'::text, v_mission.status", expiry);
  assert.ok(expiry >= 0 && returned > expiry);
  const expiryPath = fn.slice(expiry, returned + (`return query select 'expired'::text`).length);
  assert.match(expiryPath, /insert into private\.cheexpeer_mission_events[\s\S]*approval_expired/);
  assert.doesNotMatch(expiryPath, /raise exception/i);
  assert.match(expiryPath, /return query select 'expired'::text/);
  assert.match(fn, /if v_next_mission_status = 'queued' then[\s\S]*pgmq\.send/i);
});

test("user API RPCs are service-role only and consultation is organization-scoped", () => {
  assert.match(migration, /revoke all on function public\.cheexpeer_api_submit_mission[\s\S]*from public, anon, authenticated/i);
  assert.match(migration, /grant execute on function public\.cheexpeer_api_submit_mission[\s\S]*to service_role/i);
  assert.match(migration, /revoke all on function public\.cheexpeer_api_read_mission[\s\S]*from public, anon, authenticated/i);
  assert.match(migration, /where m\.id = p_mission_id\s+and m\.organization_id = p_organization_id/i);
});

test("approval decision RPC binds approval to the requested tenant", () => {
  const start = migration.indexOf("create or replace function public.cheexpeer_api_decide_approval(");
  const end = migration.indexOf("revoke all on function public.cheexpeer_api_submit_mission", start);
  assert.ok(start >= 0 && end > start);
  const fn = migration.slice(start, end);
  assert.match(fn, /p_organization_id uuid/i);
  assert.match(fn, /where a\.id = p_approval_id\s+and m\.organization_id = p_organization_id/i);
  assert.match(fn, /if not found then[\s\S]*raise exception 'approval not found'/i);
  assert.match(migration, /revoke all on function public\.cheexpeer_api_decide_approval\(uuid,uuid,uuid,text,text\) from public, anon, authenticated/i);
});

test("SQL submission fails closed for unimplemented mission executors", () => {
  assert.match(migration, /p_mission_type <> 'readiness_probe' or p_autonomy_level <> 0/i);
  assert.match(migration, /mission type or autonomy level is not currently supported/i);
});
