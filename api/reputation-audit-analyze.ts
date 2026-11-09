import { MAJESTIOS_SUPABASE } from "../majestios-supabase-public-config.mjs";
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
  const gatewayToken = process.env.VERCEL_OIDC_TOKEN || process.env.AI_GATEWAY_API_KEY;
  if (!gatewayToken) throw new Error("AI_GATEWAY_AUTH_UNAVAILABLE");
  const model = process.env.CHEXPEER_AUDIT_MODEL || "anthropic/claude-sonnet-4.6";
  const system = request.system_prompt + "\n\nSchéma JSON obligatoire :\n" + JSON.stringify(request.output_schema);
  const response = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + gatewayToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: JSON.stringify(request.input) }
      ],
      temperature: 0,
      max_tokens: 4096,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "cheexpeer_reputation_audit",
          description: "Constats, recommandations et lacunes d’un audit de réputation fondés sur des preuves référencées.",
          strict: true,
          schema: request.output_schema
        }
      }
    }),
    signal: AbortSignal.timeout(45000)
  });
  if (!response.ok) throw new Error("AI_GATEWAY_HTTP_" + response.status);
  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) throw new Error("AI_GATEWAY_EMPTY_RESPONSE");
  return content;
}

const handler = createVercelReputationAuditHandler({ verifyUser, collectContext, analyzeModel });

export default async function reputationAuditAnalyze(request: Request): Promise<Response> {
  return handler(request);
}
