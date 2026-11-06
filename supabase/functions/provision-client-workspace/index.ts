import { createClient } from "npm:@supabase/supabase-js@2.119.0";
const NOTICE_VERSION = "2026-11-05";
const allowedOrigins = [
  "https://majestios.com",
  "https://www.majestios.com",
  "https://majestios-jc8g-cqy7hpelc-majistr.vercel.app",
  ...((Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map((origin) => origin.trim()).filter(Boolean))
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  return allowedOrigins.includes(origin) ||
    /^https:\/\/majestios-jc8g-[a-z0-9-]+-majistr\.vercel\.app$/.test(origin);
}

function corsHeaders(origin: string | null): HeadersInit {
  return {
    ...(origin && isAllowedOrigin(origin)
      ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {}),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  };
}
function response(status: number, body: Record<string, unknown>, origin: string | null = null) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });
}
function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function slugify(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}
Deno.serve(async (request: Request) => {
  const origin = request.headers.get("Origin");
  if (origin && !isAllowedOrigin(origin)) {
    return new Response(JSON.stringify({ error: "Origine non autorisée." }), {
      status: 403, headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (request.method !== "POST") return response(405, { error: "Méthode non autorisée." }, origin);
  const token = (request.headers.get("Authorization") ?? "").match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return response(401, { error: "Authentification requise." }, origin);
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return response(500, { error: "Configuration serveur incomplète." }, origin);
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  const user = authData.user;
  if (authError || !user) return response(401, { error: "Session invalide ou expirée." }, origin);
  if (!user.email_confirmed_at) return response(403, { error: "Confirmez votre adresse e-mail avant de créer votre espace." }, origin);
  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { return response(400, { error: "Corps de requête invalide." }, origin); }
  const metadata = user.user_metadata ?? {};
  if (
    body.flow !== "signup" ||
    body.privacy_acknowledged !== true ||
    metadata.privacy_notice_acknowledged !== true ||
    metadata.privacy_notice_version !== NOTICE_VERSION
  ) {
    return response(403, { error: "La confirmation de la politique doit être fournie lors de l’inscription avec la version en vigueur." }, origin);
  }
  const noticeVersion = NOTICE_VERSION;
  const organizationName = cleanText(metadata.organization_name || body.organization_name, 120);
  const displayName = cleanText(metadata.display_name || body.display_name, 120);
  const phone = cleanText(metadata.phone || body.phone, 32);
  if (organizationName.length < 2) return response(400, { error: "Le nom de l’entreprise ou de l’espace personnel est obligatoire." }, origin);
  const slug = `${slugify(organizationName) || "espace-client"}-${crypto.randomUUID().slice(0, 8)}`;
  const { data: result, error: provisioningError } = await admin.rpc("provision_client_workspace", {
    p_user_id: user.id,
    p_organization_name: organizationName,
    p_slug: slug,
    p_display_name: displayName || null,
    p_phone: phone || null,
    p_notice_version: noticeVersion
  });

  if (provisioningError || !result?.ok || !result.organization) {
    console.error("Atomic workspace provisioning failed:", provisioningError?.message ?? "Invalid RPC response");
    return response(500, { error: "La création de votre espace n’a pas abouti. Votre compte reste intact ; réessayez ou contactez-nous." }, origin);
  }

  return response(result.existing ? 200 : 201, {
    ok: true,
    existing: result.existing === true,
    organization: result.organization
  }, origin);
});
