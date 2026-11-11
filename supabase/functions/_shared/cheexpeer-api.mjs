const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const STATIC_ORIGINS = new Set(["https://majestios.com", "https://www.majestios.com"]);

export function isUuid(value) {
  return typeof value === "string" && UUID.test(value);
}

export function isAllowedOrigin(origin, configured = "") {
  if (!origin) return true;
  const extras = new Set(String(configured).split(",").map((item) => item.trim()).filter(Boolean));
  return STATIC_ORIGINS.has(origin) || extras.has(origin);
}

export function apiResponse(status, body, origin = null, configuredOrigins = "") {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store, max-age=0",
    pragma: "no-cache",
    "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-max-age": "86400"
  });
  if (origin && isAllowedOrigin(origin, configuredOrigins)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "Origin");
  }
  return new Response(status === 204 ? null : JSON.stringify(body), { status, headers });
}

export async function readJsonLimited(request, maxBytes = 16 * 1024) {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) return { ok: false, status: 413 };
  let raw;
  try { raw = await request.text(); } catch { return { ok: false, status: 400 }; }
  if (new TextEncoder().encode(raw).byteLength > maxBytes) return { ok: false, status: 413 };
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, status: 400 };
    return { ok: true, value };
  } catch {
    return { ok: false, status: 400 };
  }
}

/**
 * Identity is resolved only by Supabase Auth from the bearer JWT.
 * The request body is deliberately not consulted for actor/user identifiers.
 */
export async function authorizeOrganizationAdmin({ admin, token, organizationId }) {
  if (!admin?.auth?.getUser || !admin?.from || !isUuid(organizationId) || typeof token !== "string" || !token) {
    return { ok: false, status: 401, code: "AUTH_REQUIRED" };
  }
  let auth;
  try { auth = await admin.auth.getUser(token); } catch {
    return { ok: false, status: 401, code: "AUTH_REQUIRED" };
  }
  const user = auth?.data?.user;
  if (auth?.error || !user?.id || !(user.email_confirmed_at || user.phone_confirmed_at)) {
    return { ok: false, status: 401, code: "AUTH_REQUIRED" };
  }
  let membership;
  try {
    membership = await admin.from("organization_members")
      .select("organization_id,user_id,role")
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .maybeSingle();
  } catch {
    return { ok: false, status: 404, code: "ACCESS_DENIED" };
  }
  const row = membership?.data;
  if (membership?.error || !row || row.organization_id !== organizationId ||
      row.user_id !== user.id || !["owner", "admin"].includes(row.role)) {
    return { ok: false, status: 404, code: "ACCESS_DENIED" };
  }
  return { ok: true, userId: user.id, organizationId, role: row.role };
}

export function validateSubmissionPayload(value) {
  const allowed = new Set([
    "organization_id", "mission_type", "title", "objective", "priority",
    "autonomy_level", "requires_approval", "scheduled_at", "deadline_at",
    "input", "context", "idempotency_key"
  ]);
  if (!value || Object.keys(value).some((key) => !allowed.has(key))) return { ok: false };
  if (!isUuid(value.organization_id) ||
      value.mission_type !== "readiness_probe" ||
      typeof value.title !== "string" || !value.title.trim() || value.title.length > 200 ||
      (value.objective != null && (typeof value.objective !== "string" || value.objective.length > 4000)) ||
      (value.priority != null && (!Number.isInteger(value.priority) || value.priority < 1 || value.priority > 5)) ||
      (value.autonomy_level != null && value.autonomy_level !== 0) ||
      (value.requires_approval != null && typeof value.requires_approval !== "boolean") ||
      (value.idempotency_key != null && (typeof value.idempotency_key !== "string" || !value.idempotency_key.trim() || value.idempotency_key.length > 200)) ||
      (value.input != null && (!value.input || typeof value.input !== "object" || Array.isArray(value.input))) ||
      (value.context != null && (!value.context || typeof value.context !== "object" || Array.isArray(value.context)))) return { ok: false };
  for (const key of ["scheduled_at", "deadline_at"]) {
    if (value[key] != null && (typeof value[key] !== "string" || Number.isNaN(Date.parse(value[key])))) return { ok: false };
  }
  return { ok: true, value };
}

export function validateApprovalPayload(value) {
  const allowed = new Set(["organization_id", "approval_id", "decision", "decision_note"]);
  if (!value || Object.keys(value).some((key) => !allowed.has(key)) ||
      !isUuid(value.organization_id) || !isUuid(value.approval_id) ||
      !["approved", "rejected"].includes(value.decision) ||
      (value.decision_note != null && (typeof value.decision_note !== "string" || value.decision_note.length > 2000))) {
    return { ok: false };
  }
  return { ok: true, value };
}

export function validateReadPayload(value) {
  const allowed = new Set(["organization_id", "mission_id"]);
  if (!value || Object.keys(value).some((key) => !allowed.has(key)) ||
      !isUuid(value.organization_id) || !isUuid(value.mission_id)) return { ok: false };
  return { ok: true, value };
}
