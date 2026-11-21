import { createClient } from "npm:@supabase/supabase-js@2.119.0";
import {
  apiResponse, authorizeOrganizationAdmin, isAllowedOrigin, readJsonLimited,
  validateSubmissionPayload
} from "../_shared/cheexpeer-api.mjs";

const MAX_BODY = 16 * 1024;
Deno.serve(async (request: Request) => {
  const origin = request.headers.get("Origin");
  const configuredOrigins = Deno.env.get("ALLOWED_ORIGINS") ?? "";
  if (origin && !isAllowedOrigin(origin, configuredOrigins)) return apiResponse(403, { ok:false, error:"ACCESS_DENIED" });
  if (request.method === "OPTIONS") return apiResponse(204, {}, origin, configuredOrigins);
  if (request.method !== "POST") return apiResponse(405, { ok:false, error:"METHOD_NOT_ALLOWED" }, origin, configuredOrigins);

  const token = (request.headers.get("Authorization") ?? "").match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return apiResponse(401, { ok:false, error:"AUTH_REQUIRED" }, origin, configuredOrigins);
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return apiResponse(503, { ok:false, error:"SERVICE_UNAVAILABLE" }, origin, configuredOrigins);

  const parsed = await readJsonLimited(request, MAX_BODY);
  if (!parsed.ok) return apiResponse(parsed.status, { ok:false, error:parsed.status === 413 ? "PAYLOAD_TOO_LARGE" : "INVALID_JSON" }, origin, configuredOrigins);
  const validation = validateSubmissionPayload(parsed.value);
  if (!validation.ok) return apiResponse(400, { ok:false, error:"INVALID_PAYLOAD" }, origin, configuredOrigins);

  const admin = createClient(url, serviceKey, { auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false} });
  const access = await authorizeOrganizationAdmin({ admin, token, organizationId:validation.value.organization_id });
  if (!access.ok) return apiResponse(access.status, { ok:false, error:access.code }, origin, configuredOrigins);

  const input = validation.value;
  try {
    const { data, error } = await admin.rpc("cheexpeer_api_submit_mission", {
      p_organization_id:access.organizationId,
      p_mission_type:input.mission_type.trim(),
      p_title:input.title.trim(),
      p_created_by:access.userId,
      p_objective:input.objective ?? null,
      p_priority:input.priority ?? 3,
      p_autonomy_level:input.autonomy_level ?? 0,
      p_requires_approval:input.requires_approval ?? true,
      p_scheduled_at:input.scheduled_at ?? new Date().toISOString(),
      p_deadline_at:input.deadline_at ?? null,
      p_input:input.input ?? {},
      p_context:input.context ?? {},
      p_idempotency_key:input.idempotency_key ?? null
    });
    if (error || !Array.isArray(data) || !data[0]?.mission_id) {
      console.error("Cheexpeer mission submission failed", { code:error?.code ?? "INVALID_RPC_RESULT" });
      return apiResponse(502, { ok:false, error:"MISSION_SUBMISSION_FAILED" }, origin, configuredOrigins);
    }
    return apiResponse(data[0].was_created ? 201 : 200, { ok:true, mission:data[0] }, origin, configuredOrigins);
  } catch {
    return apiResponse(502, { ok:false, error:"MISSION_SUBMISSION_FAILED" }, origin, configuredOrigins);
  }
});
