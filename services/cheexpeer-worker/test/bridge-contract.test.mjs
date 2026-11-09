import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(
  new URL("../../../supabase/functions/cheexpeer-worker-bridge/index.ts", import.meta.url),
  "utf8",
);

test("worker bridge requires the independent shared secret before creating service client", () => {
  const secretCheck = source.indexOf("constantTimeEqual(suppliedSecret, expectedSecret)");
  const clientCreation = source.indexOf("createClient(supabaseUrl, serviceRoleKey");
  assert.notEqual(secretCheck, -1);
  assert.notEqual(clientCreation, -1);
  assert.ok(secretCheck < clientCreation);
  assert.match(source, /CHEEXPEER_WORKER_SECRET/);
});

test("worker bridge exposes only the explicit RPC action allowlist", () => {
  const actions = [
    "dispatch_due",
    "read_wakeups",
    "claim_next",
    "archive_wakeup",
    "renew_lease",
    "complete_mission",
    "fail_mission",
  ];
  for (const action of actions) {
    assert.match(source, new RegExp(`"${action}"`));
  }
  assert.match(source, /if \(!allowedActions\.has\(action\)\)/);
  assert.doesNotMatch(source, /rpc\(String\(body\./);
});

test("worker bridge never enables browser CORS", () => {
  assert.match(source, /if \(req\.method !== "POST"\)/);
  assert.doesNotMatch(source, /Access-Control-Allow-Origin/);
});
