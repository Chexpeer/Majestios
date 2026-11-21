import { createClient } from "npm:@supabase/supabase-js@2.119.0";
import {
  apiResponse, authorizeOrganizationAdmin, isAllowedOrigin, readJsonLimited,
  validateApprovalPayload
} from "../_shared/cheexpeer-api.mjs";

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

  const parsed = await readJsonLimited(request, 8 * 1024);
  if (!parsed.ok) return apiResponse(parsed.status, { ok:false, error:parsed.status === 413 ? "PAYLOAD_TOO_LARGE" : "INVALID_JSON" }, origin, configuredOrigins);
  const validation = validateApprovalPayload(parsed.value);
  if (!validation.ok) return apiResponse(400, { ok:false, error:"INVALID_PAYLOAD" }, origin, configuredOrigins);

  const admin = createClient(url, serviceKey, { auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false} });
  const access = await authorizeOrganizationAdmin({ admin, token, organizationId:validation.value.organization_id });
  if (!access.ok) return apiResponse(access.status, { ok:false, error:access.code }, origin, configuredOrigins);

  try {
    const { data, error } = await admin.rpc("cheexpeer_api_decide_approval", {
      p_organization_id:access.organizationId,
      p_approval_id:validation.value.approval_id,
      p_decision_by:access.userId,
      p_decision:validation.value.decision,
      p_decision_note:validation.value.decision_note ?? null
    });
    if (error || !Array.isArray(data) || !data[0]?.approval_status) {
      console.error("Cheexpeer approval decision failed", { code:error?.code ?? "INVALID_RPC_RESULT" });
      return apiResponse(409, { ok:false, error:"APPROVAL_NOT_AVAILABLE" }, origin, configuredOrigins);
    }
    return apiResponse(200, { ok:true, approval:data[0] }, origin, configuredOrigins);
  } catch {
    return apiResponse(502, { ok:false, error:"APPROVAL_DECISION_FAILED" }, origin, configuredOrigins);
  }
});
