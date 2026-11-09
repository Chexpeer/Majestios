import { MAJESTIOS_SUPABASE } from "../majestios-supabase-public-config.mjs";
import { createAiGatewayAnalyzer, DEFAULT_CHEEXPEER_AUDIT_MODEL } from "../supabase/functions/_shared/reputation-audit-ai-gateway.mjs";
import { createVercelReputationAuditHandler } from "../supabase/functions/_shared/reputation-audit-vercel-handler.mjs";

const supabaseHeaders = {
  apikey: MAJESTIOS_SUPABASE.publishableKey,
  "Content-Type": "application/json"
};

async function verifyUser(token: string): Promise<boolean> {
  const response = await fetch(MAJESTIOS_SUPABASE.url + "/auth/v1/user", {
    headers: { apikey: MAJESTIOS_SUPABASE.publishableKey, Authorization: "Bearer " + token },
    signal: AbortSignal.timeout(10000)
  });
  return response.ok;
}

async function collectContext({ token, subject, siren }: { token: string; subject: string; siren: string }) {
  const response = await fetch(MAJESTIOS_SUPABASE.url + "/functions/v1/reputation-audit-context", {
    method: "POST",
    headers: { ...supabaseHeaders, Authorization: "Bearer " + token },
    body: JSON.stringify({ subject, siren }),
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error("REPUTATION_CONTEXT_UNAVAILABLE");
  return response.json();
}

async function analyzeModel(request: { system_prompt: string; output_schema: object; input: object }): Promise<string> {
  const token = process.env.VERCEL_OIDC_TOKEN || process.env.AI_GATEWAY_API_KEY;
  const model = process.env.CHEXPEER_AUDIT_MODEL || DEFAULT_CHEEXPEER_AUDIT_MODEL;
  const analyzer = createAiGatewayAnalyzer({ token, model });
  return analyzer(request);
}

const handler = createVercelReputationAuditHandler({ verifyUser, collectContext, analyzeModel });

export default async function reputationAuditAnalyze(request: Request): Promise<Response> {
  return handler(request);
}
