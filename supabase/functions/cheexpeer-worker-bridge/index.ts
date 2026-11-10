import { createClient } from "npm:@supabase/supabase-js@2";

type Action =
  | "dispatch_due"
  | "read_wakeups"
  | "claim_next"
  | "archive_wakeup"
  | "renew_lease"
  | "complete_mission"
  | "fail_mission";

const allowedActions = new Set<Action>([
  "dispatch_due",
  "read_wakeups",
  "claim_next",
  "archive_wakeup",
  "renew_lease",
  "complete_mission",
  "fail_mission",
]);

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_BODY_BYTES = 64 * 1024;
const MAX_RESULT_BYTES = 32 * 1024;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function constantTimeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aa = encoder.encode(a);
  const bb = encoder.encode(b);
  let diff = aa.length ^ bb.length;
  const length = Math.max(aa.length, bb.length);
  for (let i = 0; i < length; i++) diff |= (aa[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

function boundedInt(value: unknown, fallback: number, min: number, max: number): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= min && n <= max ? n : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function validWorkerId(value: unknown): value is string {
  return typeof value === "string"
    && value.trim().length > 0
    && value.trim().length <= 120
    && !/[\u0000-\u001f\u007f]/.test(value);
}

function validMissionId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

async function readBodyLimited(req: Request): Promise<string> {
  const declaredLength = req.headers.get("content-length");
  if (declaredLength && Number(declaredLength) > MAX_BODY_BYTES) {
    throw new Error("BODY_TOO_LARGE");
  }

  const reader = req.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel().catch(() => {});
      throw new Error("BODY_TOO_LARGE");
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const expectedSecret = Deno.env.get("CHEEXPEER_WORKER_SECRET");
  const suppliedSecret = req.headers.get("x-cheexpeer-worker-secret") ?? "";
  if (!expectedSecret || !constantTimeEqual(suppliedSecret, expectedSecret)) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Worker bridge is not configured" }, 503);
  }

  let body: Record<string, unknown>;
  try {
    const rawBody = await readBodyLimited(req);
    const parsed: unknown = JSON.parse(rawBody);
    if (!isRecord(parsed)) throw new Error("Invalid body");
    body = parsed;
  } catch (error) {
    if (error instanceof Error && error.message === "BODY_TOO_LARGE") {
      return json({ error: "Request body too large" }, 413);
    }
    return json({ error: "Invalid JSON body" }, 400);
  }

  const action = body.action as Action;
  if (!allowedActions.has(action)) return json({ error: "Unsupported action" }, 400);

  const missionActions = new Set<Action>([
    "renew_lease", "complete_mission", "fail_mission",
  ]);
  if (missionActions.has(action) && !validMissionId(body.mission_id)) {
    return json({ error: "A valid mission_id is required" }, 400);
  }
  if (["claim_next", "renew_lease", "complete_mission", "fail_mission"].includes(action)
      && !validWorkerId(body.worker_id)) {
    return json({ error: "A valid worker_id (1–120 characters) is required" }, 400);
  }
  if (action === "archive_wakeup"
      && (!Number.isSafeInteger(Number(body.message_id)) || Number(body.message_id) < 1)) {
    return json({ error: "A positive safe message_id is required" }, 400);
  }

  let result: Record<string, unknown> = {};
  if (action === "complete_mission") {
    if (body.result !== undefined && !isRecord(body.result)) {
      return json({ error: "result must be a JSON object" }, 400);
    }
    result = isRecord(body.result) ? body.result : {};
    if (new TextEncoder().encode(JSON.stringify(result)).byteLength > MAX_RESULT_BYTES) {
      return json({ error: "Mission result too large" }, 413);
    }
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const calls: Record<Action, () => Promise<{ data: unknown; error: unknown }>> = {
    dispatch_due: () => supabase.rpc("cheexpeer_worker_dispatch_due", {
      p_limit: boundedInt(body.limit, 50, 1, 100),
    }),
    read_wakeups: () => supabase.rpc("cheexpeer_worker_read_wakeups", {
      p_visibility_timeout_seconds: boundedInt(body.visibility_timeout_seconds, 120, 15, 3600),
      p_batch_size: boundedInt(body.batch_size, 10, 1, 10),
    }),
    claim_next: () => supabase.rpc("cheexpeer_worker_claim_next", {
      p_worker_id: (body.worker_id as string).trim(),
      p_lease_seconds: boundedInt(body.lease_seconds, 120, 15, 3600),
    }),
    archive_wakeup: () => supabase.rpc("cheexpeer_worker_archive_wakeup", {
      p_message_id: Number(body.message_id),
    }),
    renew_lease: () => supabase.rpc("cheexpeer_worker_renew_lease", {
      p_mission_id: body.mission_id as string,
      p_worker_id: (body.worker_id as string).trim(),
      p_lease_seconds: boundedInt(body.lease_seconds, 120, 15, 3600),
    }),
    complete_mission: () => supabase.rpc("cheexpeer_worker_complete_mission", {
      p_mission_id: body.mission_id as string,
      p_worker_id: (body.worker_id as string).trim(),
      p_result: result,
    }),
    fail_mission: () => supabase.rpc("cheexpeer_worker_fail_mission", {
      p_mission_id: body.mission_id as string,
      p_worker_id: (body.worker_id as string).trim(),
      p_error_code: String(body.error_code ?? "WORKER_ERROR").slice(0, 120),
      p_error_summary: String(body.error_summary ?? "Worker execution failed").slice(0, 2000),
      p_retry_delay_seconds: boundedInt(body.retry_delay_seconds, 60, 5, 86400),
    }),
  };

  try {
    const { data, error } = await calls[action]();
    if (error) {
      console.error("Cheexpeer worker bridge RPC failed", { action, error });
      return json({ error: "Worker operation failed" }, 502);
    }
    return json({ data });
  } catch (error) {
    console.error("Cheexpeer worker bridge unexpected failure", {
      action,
      error: error instanceof Error ? error.message : "unknown",
    });
    return json({ error: "Worker operation failed" }, 502);
  }
});
