import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return json({ error: "Méthode non autorisée." }, 405);

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return json({ error: "Authentification requise." }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKeys = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
  const apiKey = publishableKeys
    ? JSON.parse(publishableKeys)["default"]
    : Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !apiKey) {
    return json({ error: "Configuration Supabase indisponible." }, 500);
  }

  const userClient = createClient(supabaseUrl, apiKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const token = authorization.slice("Bearer ".length);
  const { data: authData, error: authError } = await userClient.auth.getUser(token);
  if (authError || !authData.user) return json({ error: "Session invalide ou expirée." }, 401);

  const incoming = new URL(req.url);
  const q = (incoming.searchParams.get("q") ?? "").trim();
  if (q.length < 2 || q.length > 120) {
    return json({ error: "Le terme de recherche doit contenir entre 2 et 120 caractères." }, 400);
  }

  const page = Math.max(1, Math.min(100, Number(incoming.searchParams.get("page") ?? "1") || 1));
  const perPage = Math.max(1, Math.min(25, Number(incoming.searchParams.get("per_page") ?? "10") || 10));
  const department = incoming.searchParams.get("departement")?.trim();
  const activity = incoming.searchParams.get("activite_principale")?.trim();

  const upstream = new URL("https://recherche-entreprises.api.gouv.fr/search");
  upstream.searchParams.set("q", q);
  upstream.searchParams.set("page", String(page));
  upstream.searchParams.set("per_page", String(perPage));
  if (department && /^[0-9]{2,3}$/.test(department)) upstream.searchParams.set("departement", department);
  if (activity && /^[0-9]{2}\.?[0-9]{2}[A-Z]$/.test(activity)) upstream.searchParams.set("activite_principale", activity);

  try {
    const response = await fetch(upstream, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "MajestiOS/1.0 (recherche commerciale; contact: https://majestios.com)",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (response.status === 429) {
      return json({ error: "Le service officiel limite temporairement les recherches. Réessayez dans quelques instants.", retry_after: response.headers.get("Retry-After") }, 429);
    }
    if (!response.ok) {
      return json({ error: "Le service officiel de recherche d'entreprises est momentanément indisponible.", upstream_status: response.status }, 502);
    }
    const payload = await response.json();
    return json({
      source: "API Recherche d’Entreprises — DINUM (données notamment issues de SIRENE et du RNE)",
      source_url: "https://recherche-entreprises.api.gouv.fr",
      searched_at: new Date().toISOString(),
      page,
      per_page: perPage,
      data: payload,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return json({ error: "Impossible de joindre le service officiel.", detail: message }, 502);
  }
});
