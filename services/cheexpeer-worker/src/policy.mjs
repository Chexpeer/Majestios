export function isBootstrapMission(mission) {
  return Boolean(
    mission
    && mission.mission_type === "readiness_probe"
    && Number(mission.autonomy_level) === 0
  );
}

export function healthIsReady({ stopping, lastErrorAt, lastSuccessAt }) {
  return !stopping
    && lastSuccessAt !== null
    && (lastErrorAt === null || Date.parse(lastSuccessAt) >= Date.parse(lastErrorAt));
}


export function isWorkerSelfCheckMission(mission) {
  return Boolean(
    mission
    && mission.mission_type === "worker_self_check"
    && Number(mission.autonomy_level) === 0
  );
}

export function buildWorkerSelfCheckResult({
  nodeVersion,
  workerId,
  supabaseUrl,
  leaseExpiresAt,
  now = Date.now(),
} = {}) {
  const version = typeof nodeVersion === "string" ? nodeVersion.replace(/^v/, "").split(".").map(Number) : [];
  const nodeMajor = Number.isInteger(version[0]) ? version[0] : 0;
  const parsedUrl = (() => {
    try { return new URL(supabaseUrl); } catch { return null; }
  })();
  const leaseExpiry = Date.parse(leaseExpiresAt || "");
  const checks = [
    { key: "node_runtime", passed: nodeMajor >= 22, observed: nodeMajor ? `major_${nodeMajor}` : "unknown" },
    { key: "worker_identity", passed: typeof workerId === "string" && workerId.trim().length > 0 && workerId.length <= 120 },
    { key: "supabase_endpoint", passed: parsedUrl?.protocol === "https:" && parsedUrl.hostname.endsWith(".supabase.co") },
    { key: "mission_lease", passed: Number.isFinite(leaseExpiry) && leaseExpiry > now },
  ];
  return Object.freeze({
    status: checks.every(check => check.passed) ? "passed" : "attention_required",
    checks: Object.freeze(checks.map(check => Object.freeze(check))),
    external_effects: false,
    secrets_exposed: false,
    checked_at: new Date(now).toISOString(),
  });
}
