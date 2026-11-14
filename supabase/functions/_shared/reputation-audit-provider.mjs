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

/**
 * Adaptateur serveur natif pour l'API Messages d'Anthropic (Claude).
 * La sortie structurée est imposée par un outil unique dont le schéma est le JSON Schema attendu.
 * Les secrets ne quittent jamais l'Edge Function.
 */
export function createAnthropicCheexpeerAnalyzer({
  apiKey,
  model = "claude-sonnet-5-5",
  baseUrl = "https://api.anthropic.com/v1/messages",
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
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model.trim(),
        max_tokens: 4096,
        system: request.system_prompt + "\nRetourne ta réponse uniquement en appelant l'outil cheexpeer_audit, sans texte libre.",
        messages: [{ role: "user", content: JSON.stringify(request.input) }],
        tools: [{
          name: "cheexpeer_audit",
          description: "Retourne l'analyse au format structuré attendu.",
          input_schema: request.output_schema
        }],
        // Certains modèles refusent tool_choice "tool"/"any" : mode automatique, consigne explicite dans le prompt système.
        tool_choice: { type: "auto" }
      }),
      signal: AbortSignal.timeout(30000)
    });
    if (!response.ok) {
      // Diagnostic sans secret : code HTTP et début du message d'erreur du fournisseur.
      let detail = "";
      try { detail = (await response.text()).slice(0, 300); } catch { /* ignoré */ }
      console.error("Cheexpeer AI provider error", { status: response.status, detail });
      throw new Error("CHEEXPEER_AI_PROVIDER_UNAVAILABLE");
    }
    const payload = await response.json();
    const block = Array.isArray(payload?.content)
      ? payload.content.find(item => item?.type === "tool_use" && item?.name === "cheexpeer_audit")
      : null;
    if (!block || typeof block.input !== "object" || block.input === null) {
      throw new Error("CHEEXPEER_AI_EMPTY_RESPONSE");
    }
    return JSON.stringify(block.input);
  };
}

/** Choix du fournisseur : explicite (CHEEXPEER_AI_PROVIDER) ou déduit d'une clé Anthropic (sk-ant-). */
export function selectCheexpeerAnalyzer({ apiKey, model, baseUrl, provider, fetchImpl } = {}) {
  if (!apiKey) return null;
  const chosen = (provider || (String(apiKey).startsWith("sk-ant-") ? "anthropic" : "openai")).toLowerCase();
  if (chosen === "anthropic") {
    return createAnthropicCheexpeerAnalyzer({ apiKey, model: model || undefined, baseUrl: baseUrl || undefined, fetchImpl });
  }
  if (!model) return null;
  return createOpenAICompatibleCheexpeerAnalyzer({ apiKey, model, baseUrl: baseUrl || undefined, fetchImpl });
}
