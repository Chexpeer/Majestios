import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ADMIN_EMAIL = "szineddine174@gmail.com";

Deno.serve(async (req: Request) => {
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
  const { data: membershipId, error: bootstrapError } = await adminClient.rpc(
    "bootstrap_first_internal_admin",
    { p_user_id: user.id },
  );

  if (bootstrapError) {
    const duplicate = bootstrapError.code === "23505";
    return json(duplicate ? 409 : 400, {
      ok: false,
      error: duplicate
        ? "Le premier administrateur interne a déjà été initialisé ou ce compte possède déjà un accès."
        : "L'initialisation du compte administrateur a échoué.",
    });
  }

  return json(200, { ok: true, role: "owner", membership_id: membershipId });
});
