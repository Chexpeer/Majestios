import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";

// Durcissement AN-05 (préparé dans Git, non déployé) :
// - l'adresse administrateur et les origines autorisées viennent de secrets de la fonction ;
// - sans secret configuré, le comportement historique est conservé afin de ne jamais verrouiller le compte initial.
const LEGACY_ADMIN_EMAIL = "szineddine174@gmail.com";
const ADMIN_EMAIL = (Deno.env.get("INTERNAL_ADMIN_EMAIL") || LEGACY_ADMIN_EMAIL).trim().toLowerCase();
const ALLOWED_ORIGINS = (Deno.env.get("INTERNAL_ALLOWED_ORIGINS") || "")
  .split(",").map((origin) => origin.trim()).filter(Boolean);

function corsFor(req: Request): Record<string, string> {
  const base = {
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  if (ALLOWED_ORIGINS.length === 0) return { ...base, "Access-Control-Allow-Origin": "*" };
  const origin = req.headers.get("Origin") || "";
  return ALLOWED_ORIGINS.includes(origin)
    ? { ...base, "Access-Control-Allow-Origin": origin, "Vary": "Origin" }
    : { ...base, "Vary": "Origin" };
}

Deno.serve(async (req: Request) => {
  const corsHeaders = corsFor(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (status: number, body: Record<string, unknown>) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  if (req.method !== "POST") return json(405, { ok: false, error: "Méthode non autorisée." });

  const authorization = req.headers.get("Authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) return json(401, { ok: false, error: "Authentification requise." });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return json(500, { ok: false, error: "Configuration serveur incomplète." });
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser(token);
  const user = authData?.user;

  if (authError || !user) return json(401, { ok: false, error: "Session invalide." });
  if ((user.email || "").trim().toLowerCase() !== ADMIN_EMAIL) {
    return json(403, { ok: false, error: "Cette adresse n'est pas autorisée pour l'administration interne." });
  }
  if (!user.email_confirmed_at) {
    return json(403, { ok: false, error: "Confirmez d'abord votre adresse e-mail." });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // A repeated login by the already bootstrapped owner is a successful no-op.
  const { data: membership, error: membershipError } = await adminClient
    .from("organization_members")
    .select("id, role, organization_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (membershipError) return json(500, { ok: false, error: "Vérification des accès internes indisponible." });
  if (membership) {
    const { data: organization, error: organizationError } = await adminClient
      .from("organizations")
      .select("id")
      .eq("id", membership.organization_id)
      .eq("kind", "internal")
      .maybeSingle();
    if (organizationError) return json(500, { ok: false, error: "Vérification de l'organisation interne indisponible." });
    if (organization && membership.role === "owner") {
      return json(200, { ok: true, role: "owner", already_bootstrapped: true });
    }
    return json(409, { ok: false, error: "Ce compte possède déjà une appartenance qui empêche le bootstrap initial." });
  }

  const { data: membershipId, error: bootstrapError } = await adminClient.rpc(
    "bootstrap_first_internal_admin",
    { p_user_id: user.id },
  );

  if (bootstrapError) {
    const duplicate = bootstrapError.code === "23505";
    return json(duplicate ? 409 : 400, {
      ok: false,
      error: duplicate
        ? "Le premier administrateur interne a déjà été initialisé par un autre compte."
        : "L'initialisation du compte administrateur a échoué.",
    });
  }

  return json(200, { ok: true, role: "owner", membership_id: membershipId });
});
