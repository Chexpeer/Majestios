import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(
  new URL("../../../supabase/functions/cheexpeer-worker-bridge/index.ts", import.meta.url),
  "utf8",
);
const worker = await readFile(new URL("../src/index.mjs", import.meta.url), "utf8");
const envExample = await readFile(new URL("../.env.example", import.meta.url), "utf8");
const workflow = await readFile(new URL("../../../.github/workflows/cheexpeer-worker.yml", import.meta.url), "utf8");
const migration = await readFile(new URL("../../../supabase/migrations/20261111160000_cheexpeer_worker_self_check_tool.sql", import.meta.url), "utf8");

test("worker bridge requires the independent shared secret before creating service client", () => {
  const secretCheck = source.indexOf("constantTimeEqual(suppliedSecret, expectedSecret)");
  const clientCreation = source.indexOf("createClient(supabaseUrl, serviceRoleKey");
  assert.notEqual(secretCheck, -1);
  assert.notEqual(clientCreation, -1);
  assert.ok(secretCheck < clientCreation);
  assert.match(source, /CHEEXPEER_WORKER_SECRET/);
  assert.doesNotMatch(source, new RegExp("CHE" + "XPEER_"));
});

test("worker and Edge bridge use one canonical CHEEXPEER_* environment contract", () => {
  const names = ["CHEEXPEER_WORKER_SECRET", "CHEEXPEER_WORKER_ID", "CHEEXPEER_POLL_MS", "CHEEXPEER_LEASE_SECONDS"];
  for (const name of names) {
    assert.ok(worker.includes("process.env." + name), name + " must be read by the worker");
    assert.ok(envExample.split(/\r?\n/).some((line) => line.startsWith(name + "=")), name + " must be documented in .env.example");
  }
  assert.ok(source.includes('Deno.env.get("CHEEXPEER_WORKER_SECRET")'));
  assert.doesNotMatch(worker, new RegExp("CHE" + "XPEER_"));
  assert.doesNotMatch(envExample, new RegExp("CHE" + "XPEER_"));
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

test("worker bridge validates identifiers and rejects oversized payloads before RPC", () => {
  assert.match(source, /validWorkerId\(body\.worker_id\)/);
  assert.match(source, /validMissionId\(body\.mission_id\)/);
  assert.match(source, /Number\.isSafeInteger\(Number\(body\.message_id\)\)/);
  assert.match(source, /MAX_BODY_BYTES/);
  assert.match(source, /MAX_RESULT_BYTES/);
  assert.match(source, /async function readBodyLimited/);
  assert.match(source, /req\.body\?\.getReader\(\)/);
  assert.doesNotMatch(source, /await req\.text\(\)/);
  assert.match(source, /result must be a JSON object/);
});

test("worker bridge never enables browser CORS", () => {
  assert.match(source, /if \(req\.method !== "POST"\)/);
  assert.doesNotMatch(source, /Access-Control-Allow-Origin/);
});


test("worker contract workflow is enabled on the active Evolution-9 branch", () => {
  assert.match(workflow, /branches:\s*\[[^\]]*Evolution-9/);
  assert.match(workflow, /services\/cheexpeer-worker\/\*\*/);
  assert.match(workflow, /supabase\/functions\/cheexpeer-worker-bridge\/\*\*/);
});


test("worker self-check tool is registered read-only, approval-gated and disabled by default", () => {
  assert.match(migration, /'worker_self_check'/);
  assert.match(migration, /\n  0,\n  true,\n  'read',\n  false,/);
  assert.match(migration, /on conflict \(tool_key, version\) do nothing/);
});

test("worker self-check renews its lease before completing the mission", () => {
  const selfCheckStart = worker.indexOf("if (isWorkerSelfCheckMission(mission))");
  const renew = worker.indexOf('bridge("renew_lease"', selfCheckStart);
  const complete = worker.indexOf('bridge("complete_mission"', selfCheckStart);
  assert.notEqual(selfCheckStart, -1);
  assert.ok(renew > selfCheckStart);
  assert.ok(complete > renew);
  assert.match(worker.slice(selfCheckStart, complete), /renewed !== true/);
});

test("worker workflow runs when a Cheexpeer migration changes", () => {
  assert.match(workflow, /supabase\/migrations\/\*cheexpeer\*/);
});
