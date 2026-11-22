import { createClient } from "npm:@supabase/supabase-js@2.119.0";
import { apiResponse, authorizeOrganizationAdmin, isAllowedOrigin, isUuid, readJsonLimited } from "../_shared/cheexpeer-api.mjs";
import { runPending } from "../_shared/mission-runner-core.mjs";

// Lance l'exécution des missions déjà validées. Réservé aux propriétaires et administrateurs internes ; aucune validation n'est contournée
// (la réservation SQL ne prend que les missions approuvées dont l'outil est activé dans le registre).
Deno.serve(async (request: Request) => {
  const origin = request.headers.get("Origin");
  const configuredOrigins = Deno.env.get("ALLOWED_ORIGINS") ?? "";
  if (origin && !isAllowedOrigin(origin, configuredOrigins)) return apiResponse(403, { ok: false, error: "ACCESS_DENIED" });
  if (request.method === "OPTIONS") return apiResponse(204, {}, origin, configuredOrigins);
  if (request.method !== "POST") return apiResponse(405, { ok: false, error: "METHOD_NOT_ALLOWED" }, origin, configuredOrigins);
  const token = (request.headers.get("Authorization") ?? "").match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return apiResponse(401, { ok: false, error: "AUTH_REQUIRED" }, origin, configuredOrigins);
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return apiResponse(503, { ok: false, error: "SERVICE_UNAVAILABLE" }, origin, configuredOrigins);
  const parsed = await readJsonLimited(request, 2 * 1024);
  if (!parsed.ok) return apiResponse(parsed.status, { ok: false, error: parsed.status === 413 ? "PAYLOAD_TOO_LARGE" : "INVALID_JSON" }, origin, configuredOrigins);
  const keys = Object.keys(parsed.value ?? {});
  if (keys.length !== 1 || keys[0] !== "organization_id" || !isUuid(parsed.value.organization_id)) return apiResponse(400, { ok: false, error: "INVALID_PAYLOAD" }, origin, configuredOrigins);
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const access = await authorizeOrganizationAdmin({ admin, token, organizationId: parsed.value.organization_id });
  if (!access.ok) return apiResponse(access.status, { ok: false, error: access.code }, origin, configuredOrigins);
  try {
    const summary = await runPending(admin);
    return apiResponse(200, { ok: true, ...summary }, origin, configuredOrigins);
  } catch {
    console.error("cheexpeer-mission-run failed");
    return apiResponse(502, { ok: false, error: "MISSION_RUN_FAILED" }, origin, configuredOrigins);
  }
});
