import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

function reply(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply({ error: "Méthode non autorisée." }, 405);

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return reply({ error: "Authentification requise." }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKeys = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
  const anonKey = publishableKeys ? JSON.parse(publishableKeys)["default"] : Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceKey) {
    return reply({ error: "Configuration serveur incomplète." }, 500);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const token = authorization.slice("Bearer ".length);
  const { data: authData, error: authError } = await userClient.auth.getUser(token);
  if (authError || !authData.user) return reply({ error: "Session invalide ou expirée." }, 401);

  let input: { organization_id?: string; siren?: string };
  try {
    input = await req.json();
  } catch {
    return reply({ error: "Corps JSON invalide." }, 400);
  }
  const organizationId = input.organization_id?.trim();
  const siren = input.siren?.replace(/\s/g, "");
  if (!organizationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(organizationId)) {
    return reply({ error: "Identifiant d’organisation invalide." }, 400);
  }
  if (!siren || !/^[0-9]{9}$/.test(siren)) return reply({ error: "Un SIREN valide à 9 chiffres est requis." }, 400);

  const { data: allowed, error: permissionError } = await userClient.rpc(
    "can_import_official_company",
    { p_organization_id: organizationId },
  );
  if (permissionError) return reply({ error: "Vérification des habilitations impossible." }, 500);
  if (allowed !== true) return reply({ error: "Accès refusé : un rôle éditeur dans cette organisation est nécessaire." }, 403);

  const upstream = new URL("https://recherche-entreprises.api.gouv.fr/search");
  upstream.searchParams.set("q", siren);
  upstream.searchParams.set("page", "1");
  upstream.searchParams.set("per_page", "10");

  try {
    const response = await fetch(upstream, {
      headers: { "Accept": "application/json", "User-Agent": "MajestiOS/1.0 (import entreprise officielle; https://majestios.com)" },
      signal: AbortSignal.timeout(10000),
    });
    if (response.status === 429) return reply({ error: "Limite temporaire du service officiel.", retry_after: response.headers.get("Retry-After") }, 429);
    if (!response.ok) return reply({ error: "Le service officiel est momentanément indisponible.", upstream_status: response.status }, 502);

    const payload = await response.json();
    const matches = Array.isArray(payload.results) ? payload.results : [];
    const company = matches.find((item: Record<string, unknown>) => String(item.siren ?? "") === siren);
    if (!company) return reply({ error: "Aucune entreprise correspondant exactement à ce SIREN n’a été trouvée." }, 404);

    const establishments = Array.isArray(company.matching_etablissements) ? [...company.matching_etablissements] : [];
    const headOffice = company.siege && typeof company.siege === "object"
      ? { ...(company.siege as Record<string, unknown>), est_etablissement: true }
      : null;
    if (headOffice && typeof headOffice.siret === "string") establishments.unshift(headOffice);

    const uniqueEstablishments = Array.from(
      new Map(establishments.filter((e: Record<string, unknown>) => typeof e.siret === "string").map((e: Record<string, unknown>) => [e.siret, e])).values(),
    );

    const serviceClient = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: imported, error: importError } = await serviceClient.rpc(
      "import_official_company_record",
      {
        p_organization_id: organizationId,
        p_company: company,
        p_establishments: uniqueEstablishments,
        p_source_url: "https://recherche-entreprises.api.gouv.fr",
      },
    );
    if (importError) return reply({ error: "Import impossible.", detail: importError.message }, 500);

    return reply({
      source: "API Recherche d’Entreprises — DINUM",
      imported_at: new Date().toISOString(),
      company: {
        siren: company.siren,
        name: company.nom_raison_sociale ?? company.nom_complet,
        status: company.etat_administratif,
        ape_naf: company.activite_principale,
        headquarters_siret: company.siege?.siret ?? null,
        city: company.siege?.libelle_commune ?? null,
        department: company.siege?.departement ?? null,
        establishment_count_received: uniqueEstablishments.length,
      },
      result: imported,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur inconnue";
    return reply({ error: "Échec de la connexion au service officiel.", detail }, 502);
  }
});
