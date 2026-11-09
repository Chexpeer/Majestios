import { createClient } from "npm:@supabase/supabase-js@2";
import { createReputationAuditHandler } from "../_shared/reputation-audit-handler.mjs";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const publishableKeysRaw = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
let publishableKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
if (publishableKeysRaw) {
  try { publishableKey = JSON.parse(publishableKeysRaw).default || publishableKey; }
  catch { publishableKey = ""; }
}

const handler = createReputationAuditHandler({
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
