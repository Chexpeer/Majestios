import { createClient } from "npm:@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};
function response(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}
function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function slugify(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}
Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return response(405, { error: "Méthode non autorisée." });
  const token = (request.headers.get("Authorization") ?? "").match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return response(401, { error: "Authentification requise." });
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return response(500, { error: "Configuration serveur incomplète." });
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  const user = authData.user;
  if (authError || !user) return response(401, { error: "Session invalide ou expirée." });
  if (!user.email_confirmed_at) return response(403, { error: "Confirmez votre adresse e-mail avant de créer votre espace." });
  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { return response(400, { error: "Corps de requête invalide." }); }
  const metadata = user.user_metadata ?? {};
  if (metadata.privacy_notice_acknowledged !== true) return response(403, { error: "La prise de connaissance de la politique de confidentialité est nécessaire." });
  const noticeVersion = cleanText(metadata.privacy_notice_version, 30);
  if (!noticeVersion) return response(400, { error: "Version de la politique de confidentialité manquante." });
  const organizationName = cleanText(metadata.organization_name || body.organization_name, 120);
  const displayName = cleanText(metadata.display_name || body.display_name, 120);
  const phone = cleanText(metadata.phone || body.phone, 32);
  if (organizationName.length < 2) return response(400, { error: "Le nom de l’entreprise ou de l’espace personnel est obligatoire." });
  const { data: memberships, error: lookupError } = await admin.from("organization_members").select("organization_id").eq("user_id", user.id).limit(20);
  if (lookupError) return response(500, { error: "Impossible de vérifier les espaces existants." });
  if (memberships?.length) {
    for (const membership of memberships) {
      const { data: existing } = await admin.from("organizations").select("id,name,slug,kind").eq("id", membership.organization_id).maybeSingle();
      if (existing?.kind === "client") {
        const { error } = await admin.from("privacy_acknowledgments").upsert({
          user_id: user.id, organization_id: existing.id, notice_version: noticeVersion
        }, { onConflict: "user_id,organization_id,notice_version" });
        if (error) return response(500, { error: "La confirmation de confidentialité n’a pas pu être enregistrée." });
        return response(200, { ok: true, existing: true, organization: existing });
      }
    }
  }
  const slug = `${slugify(organizationName) || "espace-client"}-${crypto.randomUUID().slice(0, 8)}`;
  const { data: organization, error: organizationError } = await admin.from("organizations")
    .insert({ name: organizationName, slug, kind: "client", created_by: user.id })
    .select("id,name,slug,kind").single();
  if (organizationError || !organization) return response(500, { error: "La création de votre espace n’a pas abouti." });
  const { error: membershipError } = await admin.from("organization_members")
    .insert({ organization_id: organization.id, user_id: user.id, role: "owner" });
  if (membershipError) {
    await admin.from("organizations").delete().eq("id", organization.id);
    return response(500, { error: "L’association de votre compte à l’espace a échoué." });
  }
  const { error: acknowledgmentError } = await admin.from("privacy_acknowledgments").upsert({
    user_id: user.id, organization_id: organization.id, notice_version: noticeVersion
  }, { onConflict: "user_id,organization_id,notice_version" });
  if (acknowledgmentError) {
    await admin.from("organization_members").delete().eq("organization_id", organization.id).eq("user_id", user.id);
    await admin.from("organizations").delete().eq("id", organization.id);
    return response(500, { error: "La prise de connaissance de la politique n’a pas pu être enregistrée." });
  }
  const { error: profileError } = await admin.from("profiles").upsert({
    id: user.id, display_name: displayName || null, phone: phone || null
  }, { onConflict: "id" });
  if (profileError) console.error("Profile enrichment failed:", profileError.message);
  return response(201, { ok: true, existing: false, organization });
});
