import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../supabase/functions/reputation-audit-context/index.ts", import.meta.url), "utf8");

test("Cheexpeer reputation audit requires a valid Supabase user and an organization membership", () => {
  assert.match(source, /auth\.getUser\(token\)/);
  assert.match(source, /from\("organization_members"\)/);
  assert.match(source, /\.select\("organization_id"\)/);
  assert.match(source, /\.eq\("user_id", data\.user\.id\)/);
  assert.match(source, /if \(!memberships\?\.length\) return null/);
  assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY/);
});
