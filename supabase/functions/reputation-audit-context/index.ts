import { createClient } from "npm:@supabase/supabase-js@2";
import { createReputationAuditHandler } from "../_shared/reputation-audit-handler.mjs";
import { selectCheexpeerAnalyzer } from "../_shared/reputation-audit-provider.mjs";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const publishableKeysRaw = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
let publishableKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
if (publishableKeysRaw) {
  try { publishableKey = JSON.parse(publishableKeysRaw).default || publishableKey; }
  catch { publishableKey = ""; }
}

const aiApiKey = Deno.env.get("CHEEXPEER_AI_API_KEY") || "";
const aiModel = Deno.env.get("CHEEXPEER_AI_MODEL") || "";
const aiBaseUrl = Deno.env.get("CHEEXPEER_AI_BASE_URL") || "";
const aiProvider = Deno.env.get("CHEEXPEER_AI_PROVIDER") || "";
// Clé Anthropic (sk-ant-…) : Claude via l'API Messages, modèle par défaut claude-sonnet-5-5.
// Sans clé : l'analyse reste désactivée (mode collecte seule), aucun rapport simulé.
const analyzer = selectCheexpeerAnalyzer({ apiKey: aiApiKey, model: aiModel, baseUrl: aiBaseUrl, provider: aiProvider });

const handler = createReputationAuditHandler({
  analyze: analyzer,
  consumeQuota: async user => {
    if (!user?.organization_id || !user?.quotaClient) throw new Error("AUDIT_QUOTA_CONTEXT_UNAVAILABLE");
    const { data, error } = await user.quotaClient.rpc("consume_reputation_audit_quota", {
      p_organization_id: user.organization_id
    });
    if (error) throw new Error("AUDIT_QUOTA_CHECK_UNAVAILABLE");
    return data === true;
  },
  authenticate: async token => {
    if (!supabaseUrl || !publishableKey) throw new Error("AUTH_CONFIGURATION_UNAVAILABLE");
    const userClient = createClient(supabaseUrl, publishableKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data, error } = await userClient.auth.getUser(token);
    if (error || !data?.user?.id) return null;
    const { data: memberships, error: membershipError } = await userClient
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", data.user.id)
      .limit(2);
    if (membershipError) throw new Error("AUDIT_MEMBERSHIP_CHECK_UNAVAILABLE");
    if (!memberships?.length) return null;
    if (memberships.length !== 1) {
      return { id: data.user.id, organization_selection_required: true };
    }
    return { id: data.user.id, organization_id: memberships[0].organization_id, quotaClient: userClient };
  }
});

Deno.serve(handler);
