/**
 * Adaptateur serveur pour tout fournisseur compatible avec l'API Chat Completions
 * et le mode JSON Schema strict. Les secrets ne quittent jamais l'Edge Function.
 */
export function createOpenAICompatibleCheexpeerAnalyzer({
  apiKey,
  model,
  baseUrl = "https://api.openai.com/v1/chat/completions",
  fetchImpl = fetch
} = {}) {
  if (typeof apiKey !== "string" || !apiKey.trim() ||
      typeof model !== "string" || !model.trim()) {
    throw new TypeError("CHEEXPEER_AI_CONFIGURATION_REQUIRED");
  }
  let endpoint;
  try {
    endpoint = new URL(baseUrl);
  } catch {
    throw new TypeError("CHEEXPEER_AI_ENDPOINT_INVALID");
  }
  if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password) {
    throw new TypeError("CHEEXPEER_AI_ENDPOINT_INVALID");
  }

  return async function analyze(request) {
    const response = await fetchImpl(endpoint.toString(), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model.trim(),
        temperature: 0.1,
        max_tokens: 4096,
        messages: [
          { role: "system", content: request.system_prompt },
          { role: "user", content: JSON.stringify(request.input) }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "cheexpeer_audit",
            strict: true,
            schema: request.output_schema
          }
        }
      }),
      signal: AbortSignal.timeout(30000)
    });
    if (!response.ok) throw new Error("CHEEXPEER_AI_PROVIDER_UNAVAILABLE");
    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("CHEEXPEER_AI_EMPTY_RESPONSE");
    }
    return content;
  };
}
