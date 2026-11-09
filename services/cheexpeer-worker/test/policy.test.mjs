import test from "node:test";
import assert from "node:assert/strict";
import { isBootstrapMission, healthIsReady } from "../src/policy.mjs";

test("only autonomy-zero readiness probes are executable", () => {
  assert.equal(isBootstrapMission({ mission_type: "readiness_probe", autonomy_level: 0 }), true);
  assert.equal(isBootstrapMission({ mission_type: "readiness_probe", autonomy_level: 1 }), false);
  assert.equal(isBootstrapMission({ mission_type: "send_email", autonomy_level: 0 }), false);
  assert.equal(isBootstrapMission({ mission_type: "scrape", autonomy_level: 4 }), false);
  assert.equal(isBootstrapMission(null), false);
});

test("health returns to ready after a successful poll", () => {
  assert.equal(healthIsReady({ stopping: false, lastErrorAt: null, lastSuccessAt: null }), true);
  assert.equal(healthIsReady({ stopping: false, lastErrorAt: "2026-11-09T20:00:00.000Z", lastSuccessAt: "2026-11-09T20:01:00.000Z" }), true);
  assert.equal(healthIsReady({ stopping: false, lastErrorAt: "2026-11-09T20:01:00.000Z", lastSuccessAt: "2026-11-09T20:00:00.000Z" }), false);
  assert.equal(healthIsReady({ stopping: true, lastErrorAt: null, lastSuccessAt: null }), false);
});
