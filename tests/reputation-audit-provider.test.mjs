import test from "node:test";
import assert from "node:assert/strict";
import { createOpenAICompatibleCheexpeerAnalyzer } from "../supabase/functions/_shared/reputation-audit-provider.mjs";

test("provider sends strict structured analysis request with server-side bearer token", async () => {
  let captured;
  const analyzer = createOpenAICompatibleCheexpeerAnalyzer({
    apiKey: "server-only-test-secret",
    model: "test-model",
    fetchImpl: async (url, options) => {
      captured = { url, options };
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content: JSON.stringify({ findings: [], recommendations: [], gaps: [] }) } }] })
      };
    }
  });
  const result = await analyzer({
    system_prompt: "Analyse uniquement les preuves.",
    output_schema: { type: "object", additionalProperties: false },
    input: { subject: "Atelier Exemple", evidence: [] }
  });
  assert.deepEqual(JSON.parse(result), { findings: [], recommendations: [], gaps: [] });
  assert.equal(captured.url, "https://api.openai.com/v1/chat/completions");
  assert.equal(captured.options.headers.Authorization, "Bearer server-only-test-secret");
  const body = JSON.parse(captured.options.body);
  assert.equal(body.response_format.type, "json_schema");
  assert.equal(body.response_format.json_schema.strict, true);
  assert.equal(body.model, "test-model");
  assert.equal(body.max_tokens, 4096);
});

test("provider rejects missing credentials and insecure endpoints", () => {
  assert.throws(() => createOpenAICompatibleCheexpeerAnalyzer({ model: "test" }), /CHEEXPEER_AI_CONFIGURATION_REQUIRED/);
  assert.throws(() => createOpenAICompatibleCheexpeerAnalyzer({
    apiKey: "secret", model: "test", baseUrl: "http://example.com/chat"
  }), /CHEEXPEER_AI_ENDPOINT_INVALID/);
});

test("provider rejects non-success and malformed responses", async () => {
  const unavailable = createOpenAICompatibleCheexpeerAnalyzer({
    apiKey: "secret", model: "test", fetchImpl: async () => ({ ok: false })
  });
  await assert.rejects(unavailable({ system_prompt: "", output_schema: {}, input: {} }), /CHEEXPEER_AI_PROVIDER_UNAVAILABLE/);
  const malformed = createOpenAICompatibleCheexpeerAnalyzer({
    apiKey: "secret", model: "test", fetchImpl: async () => ({ ok: true, json: async () => ({ choices: [] }) })
  });
  await assert.rejects(malformed({ system_prompt: "", output_schema: {}, input: {} }), /CHEEXPEER_AI_EMPTY_RESPONSE/);
});
