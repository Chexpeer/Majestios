import { createClient } from "npm:@supabase/supabase-js@2.119.0";
import {
  apiResponse, authorizeOrganizationAdmin, isAllowedOrigin, readJsonLimited,
  validateReadPayload
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
  const validation = validateReadPayload(parsed.value);
  if (!validation.ok) return apiResponse(400, { ok:false, error:"INVALID_PAYLOAD" }, origin, configuredOrigins);

  const admin = createClient(url, serviceKey, { auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false} });
  const access = await authorizeOrganizationAdmin({ admin, token, organizationId:validation.value.organization_id });
  if (!access.ok) return apiResponse(access.status, { ok:false, error:access.code }, origin, configuredOrigins);

  try {
    const { data, error } = await admin.rpc("cheexpeer_api_read_mission", {
      p_mission_id:validation.value.mission_id,
      p_organization_id:access.organizationId
    });
    if (error) {
      console.error("Cheexpeer mission read failed", { code:error.code ?? "UNKNOWN" });
      return apiResponse(502, { ok:false, error:"MISSION_READ_FAILED" }, origin, configuredOrigins);
    }
    if (!data?.mission?.id) return apiResponse(404, { ok:false, error:"MISSION_NOT_FOUND" }, origin, configuredOrigins);
    const bytes = new TextEncoder().encode(JSON.stringify(data)).byteLength;
    if (bytes > 32 * 1024) return apiResponse(413, { ok:false, error:"RESULT_TOO_LARGE" }, origin, configuredOrigins);
    return apiResponse(200, { ok:true, ...data }, origin, configuredOrigins);
  } catch {
    return apiResponse(502, { ok:false, error:"MISSION_READ_FAILED" }, origin, configuredOrigins);
  }
});
