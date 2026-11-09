import test from "node:test";
import assert from "node:assert/strict";
import { createAiGatewayAnalyzer, DEFAULT_CHEEXPEER_AUDIT_MODEL } from "../supabase/functions/_shared/reputation-audit-ai-gateway.mjs";

const request = {
  system_prompt: "Analyse les preuves sans inventer.",
  input: { subject: "Atelier Exemple", evidence: [{ evidence_id: "E001" }] },
  output_schema: { type: "object", required: ["findings"], properties: { findings: { type: "array" } }, additionalProperties: false }
};

test("uses the selected Claude model and strict JSON Schema through AI Gateway", async () => {
  let url = "";
  let init;
  const analyzer = createAiGatewayAnalyzer({
    token: "test-token",
    fetchImpl: async (target, options) => {
      url = target;
      init = options;
      return { ok: true, json: async () => ({ choices: [{ message: { content: '{"findings":[],"recommendations":[],"gaps":[]}' } }] }) };
    }
  });
  const result = await analyzer(request);
  const body = JSON.parse(init.body);
  assert.equal(url, "https://ai-gateway.vercel.sh/v1/chat/completions");
  assert.equal(init.headers.Authorization, "Bearer test-token");
  assert.equal(body.model, DEFAULT_CHEEXPEER_AUDIT_MODEL);
  assert.equal(body.response_format.type, "json_schema");
  assert.equal(body.response_format.json_schema.strict, true);
  assert.deepEqual(body.response_format.json_schema.schema, request.output_schema);
  assert.equal(result, '{"findings":[],"recommendations":[],"gaps":[]}');
});

test("refuses missing credentials and non-Claude models", () => {
  assert.throws(() => createAiGatewayAnalyzer({ token: "" }), /AI_GATEWAY_AUTH_UNAVAILABLE/);
  assert.throws(() => createAiGatewayAnalyzer({ token: "token", model: "openai/gpt-model" }), /AI_GATEWAY_MODEL_INVALID/);
});

test("maps provider and malformed response failures without exposing secrets", async () => {
  const rateLimited = createAiGatewayAnalyzer({ token: "secret", fetchImpl: async () => ({ ok: false, status: 429 }) });
  const malformed = createAiGatewayAnalyzer({ token: "secret", fetchImpl: async () => ({ ok: true, json: async () => ({ choices: [] }) }) });
  await assert.rejects(rateLimited(request), /AI_GATEWAY_HTTP_429/);
  await assert.rejects(malformed(request), /AI_GATEWAY_EMPTY_RESPONSE/);
});
