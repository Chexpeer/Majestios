export const DEFAULT_CHEEXPEER_AUDIT_MODEL = "anthropic/claude-sonnet-4.6";

export function createAiGatewayAnalyzer({ token, model = DEFAULT_CHEEXPEER_AUDIT_MODEL, fetchImpl = fetch, timeoutMs = 45000 } = {}) {
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("AI_GATEWAY_AUTH_UNAVAILABLE");
  }
  if (typeof model !== "string" || !/^anthropic\/claude-[a-z0-9.-]+$/i.test(model)) {
    throw new Error("AI_GATEWAY_MODEL_INVALID");
  }
  if (typeof fetchImpl !== "function") throw new TypeError("AI_GATEWAY_FETCH_REQUIRED");

  return async function analyze(request) {
    if (!request?.system_prompt || !request?.input || !request?.output_schema) {
      throw new TypeError("AI_GATEWAY_ANALYSIS_REQUEST_INVALID");
    }
    const system = request.system_prompt + "\n\nLe schéma de sortie est imposé par le paramètre response_format JSON Schema.";
    const response = await fetchImpl("https://ai-gateway.vercel.sh/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
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
        stream: false,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "cheexpeer_reputation_audit",
            description: "Constats, recommandations et lacunes d'un audit fondés sur des preuves référencées.",
            strict: true,
            schema: request.output_schema
          }
        }
      }),
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (!response.ok) throw new Error("AI_GATEWAY_HTTP_" + response.status);
    let payload;
    try { payload = await response.json(); } catch { throw new Error("AI_GATEWAY_INVALID_RESPONSE"); }
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) throw new Error("AI_GATEWAY_EMPTY_RESPONSE");
    return content;
  };
}
