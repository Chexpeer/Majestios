import { createClient } from "npm:@supabase/supabase-js@2";
import { createReputationAuditHandler } from "../_shared/reputation-audit-handler.mjs";
import { createOpenAICompatibleCheexpeerAnalyzer } from "../_shared/reputation-audit-provider.mjs";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const publishableKeysRaw = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
let publishableKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
if (publishableKeysRaw) {
  try { publishableKey = JSON.parse(publishableKeysRaw).default || publishableKey; }
  catch { publishableKey = ""; }
}

const aiApiKey = Deno.env.get("CHEEXPEER_AI_API_KEY") || "";
const aiModel = Deno.env.get("CHEEXPEER_AI_MODEL") || "";
const aiBaseUrl = Deno.env.get("CHEEXPEER_AI_BASE_URL") || "https://api.openai.com/v1/chat/completions";
const analyzer = aiApiKey && aiModel
  ? createOpenAICompatibleCheexpeerAnalyzer({ apiKey: aiApiKey, model: aiModel, baseUrl: aiBaseUrl })
  : null;

const handler = createReputationAuditHandler({
  analyze: analyzer,
  authenticate: async token => {
    if (!supabaseUrl || !publishableKey) throw new Error("AUTH_CONFIGURATION_UNAVAILABLE");
    const userClient = createClient(supabaseUrl, publishableKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data, error } = await userClient.auth.getUser(token);
    if (error || !data?.user?.id) return null;
    return { id: data.user.id };
  }
});

Deno.serve(handler);
