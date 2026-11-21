import test from "node:test";
import assert from "node:assert/strict";
import { isBootstrapMission, isWorkerSelfCheckMission, buildWorkerSelfCheckResult, healthIsReady } from "../src/policy.mjs";

test("only autonomy-zero readiness probes are executable", () => {
  assert.equal(isBootstrapMission({ mission_type: "readiness_probe", autonomy_level: 0 }), true);
  assert.equal(isBootstrapMission({ mission_type: "readiness_probe", autonomy_level: 1 }), false);
  assert.equal(isBootstrapMission({ mission_type: "send_email", autonomy_level: 0 }), false);
  assert.equal(isBootstrapMission({ mission_type: "scrape", autonomy_level: 4 }), false);
  assert.equal(isBootstrapMission(null), false);
});

test("health stays unready until the first successful worker tick", () => {
  assert.equal(healthIsReady({ stopping: false, lastErrorAt: null, lastSuccessAt: null }), false);
  assert.equal(healthIsReady({ stopping: false, lastErrorAt: "2026-11-09T20:00:00.000Z", lastSuccessAt: null }), false);
  assert.equal(healthIsReady({ stopping: false, lastErrorAt: null, lastSuccessAt: "2026-11-09T20:00:00.000Z" }), true);
});

test("health returns to ready after a successful poll", () => {
  assert.equal(healthIsReady({ stopping: false, lastErrorAt: "2026-11-09T20:00:00.000Z", lastSuccessAt: "2026-11-09T20:01:00.000Z" }), true);
  assert.equal(healthIsReady({ stopping: false, lastErrorAt: "2026-11-09T20:01:00.000Z", lastSuccessAt: "2026-11-09T20:00:00.000Z" }), false);
  assert.equal(healthIsReady({ stopping: true, lastErrorAt: null, lastSuccessAt: "2026-11-09T20:00:00.000Z" }), false);
});


test("worker self-check is limited to the exact autonomy-zero mission type", () => {
  assert.equal(isWorkerSelfCheckMission({ mission_type: "worker_self_check", autonomy_level: 0 }), true);
  assert.equal(isWorkerSelfCheckMission({ mission_type: "worker_self_check", autonomy_level: 1 }), false);
  assert.equal(isWorkerSelfCheckMission({ mission_type: "send_email", autonomy_level: 0 }), false);
  assert.equal(isWorkerSelfCheckMission(null), false);
});

test("worker self-check returns a bounded read-only diagnostic without secrets", () => {
  const result = buildWorkerSelfCheckResult({
    nodeVersion: "v22.12.0",
    workerId: "cheexpeer-test",
    supabaseUrl: "https://example.supabase.co",
    leaseExpiresAt: "2026-11-11T16:00:00.000Z",
    now: Date.parse("2026-11-11T15:00:00.000Z"),
  });
  assert.equal(result.status, "passed");
  assert.equal(result.external_effects, false);
  assert.equal(result.secrets_exposed, false);
  assert.deepEqual(result.checks.map(check => check.passed), [true, true, true, true]);
  assert.equal(JSON.stringify(result).includes("service_role"), false);
});

test("worker self-check flags unsupported runtime, insecure endpoint and expired lease", () => {
  const result = buildWorkerSelfCheckResult({
    nodeVersion: "v20.0.0",
    workerId: "",
    supabaseUrl: "http://localhost:54321",
    leaseExpiresAt: "2026-11-11T14:00:00.000Z",
    now: Date.parse("2026-11-11T15:00:00.000Z"),
  });
  assert.equal(result.status, "attention_required");
  assert.deepEqual(result.checks.map(check => check.passed), [false, false, false, false]);
});
