import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const config = {
  supabaseUrl: process.env.SUPABASE_URL?.replace(/\/$/, ""),
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  workerSecret: process.env.CHEXPEER_WORKER_SECRET,
  workerId: process.env.CHEXPEER_WORKER_ID || `cheexpeer-${randomUUID()}`,
  pollMs: Math.max(1000, Number(process.env.CHEXPEER_POLL_MS) || 5000),
  leaseSeconds: Math.min(3600, Math.max(30, Number(process.env.CHEXPEER_LEASE_SECONDS) || 120)),
  port: Number(process.env.PORT) || 8080,
};

const missing = ["supabaseUrl", "serviceRoleKey", "workerSecret"].filter((key) => !config[key]);
if (missing.length) {
  throw new Error(`Missing required worker configuration: ${missing.join(", ")}`);
}

let stopping = false;
let inFlight = false;
let lastSuccessAt = null;
let lastErrorAt = null;

async function bridge(action, args = {}) {
  const response = await fetch(`${config.supabaseUrl}/functions/v1/cheexpeer-worker-bridge`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "apikey": config.serviceRoleKey,
      "authorization": `Bearer ${config.serviceRoleKey}`,
      "x-cheexpeer-worker-secret": config.workerSecret,
    },
    body: JSON.stringify({ action, ...args }),
    signal: AbortSignal.timeout(15000),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Worker bridge returned HTTP ${response.status} for ${action}`);
  }
  return payload.data;
}

function firstRow(data) {
  if (Array.isArray(data)) return data[0] ?? null;
  return data ?? null;
}

async function processOneMission() {
  const mission = firstRow(await bridge("claim_next", {
    worker_id: config.workerId,
    lease_seconds: config.leaseSeconds,
  }));
  if (!mission) return false;

  // Deliberately the only executable handler in this bootstrap worker.
  // It has no external side effects. All business tools remain disabled.
  if (mission.mission_type === "readiness_probe" && Number(mission.autonomy_level) === 0) {
    const completed = await bridge("complete_mission", {
      mission_id: mission.mission_id,
      worker_id: config.workerId,
      result: {
        status: "passed",
        executor: "cheexpeer-worker-bootstrap",
        verified_at: new Date().toISOString(),
        external_effects: false,
      },
    });
    if (completed !== true) {
      throw new Error("Mission completion was rejected; lease may have expired");
    }
    console.info("Cheexpeer mission completed", {
      missionId: mission.mission_id,
      missionType: mission.mission_type,
      attempt: mission.attempt_count,
    });
    return true;
  }

  // A registered future tool without a handler must never be guessed or run.
  await bridge("fail_mission", {
    mission_id: mission.mission_id,
    worker_id: config.workerId,
    error_code: "UNSUPPORTED_EXECUTOR",
    error_summary: "No reviewed handler is installed for this mission type",
    retry_delay_seconds: 300,
  });
  console.error("Mission safely rejected: no executor handler", {
    missionId: mission.mission_id,
    missionType: mission.mission_type,
  });
  return true;
}

async function tick() {
  if (inFlight || stopping) return;
  inFlight = true;
  try {
    await bridge("dispatch_due", { limit: 50 });
    const wakeups = await bridge("read_wakeups", {
      visibility_timeout_seconds: config.leaseSeconds,
      batch_size: 10,
    });
    await processOneMission();

    // Wakeups are hints only. The durable mission row is the source of truth.
    // A failed archive is harmless: PGMQ will redeliver after its visibility timeout.
    for (const message of Array.isArray(wakeups) ? wakeups : []) {
      try {
        await bridge("archive_wakeup", { message_id: message.msg_id });
      } catch (error) {
        console.warn("Wakeup archive deferred", {
          messageId: message.msg_id,
          error: error instanceof Error ? error.message : "unknown",
        });
      }
    }
    lastSuccessAt = new Date().toISOString();
  } catch (error) {
    lastErrorAt = new Date().toISOString();
    console.error("Cheexpeer worker tick failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
  } finally {
    inFlight = false;
  }
}

const server = createServer((req, res) => {
  if (req.method !== "GET" || req.url !== "/health") {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }
  const healthy = !stopping && (
    lastErrorAt === null
    || (lastSuccessAt !== null && Date.parse(lastSuccessAt) >= Date.parse(lastErrorAt))
  );
  res.writeHead(healthy ? 200 : 503, { "content-type": "application/json", "cache-control": "no-store" });
  res.end(JSON.stringify({
    status: healthy ? "ok" : "degraded",
    workerId: config.workerId,
    inFlight,
    lastSuccessAt,
    lastErrorAt,
  }));
});

server.listen(config.port, "0.0.0.0", () => {
  console.info("Cheexpeer worker started", {
    workerId: config.workerId,
    pollMs: config.pollMs,
    leaseSeconds: config.leaseSeconds,
  });
  void tick();
  const interval = setInterval(() => void tick(), config.pollMs);
  server.on("close", () => clearInterval(interval));
});

async function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  console.info("Cheexpeer worker shutting down", { signal });
  server.close();
  const deadline = Date.now() + 10000;
  while (inFlight && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  process.exit(inFlight ? 1 : 0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
