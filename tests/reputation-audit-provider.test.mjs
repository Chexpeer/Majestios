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

test("claude adapter uses the Messages API with a forced structured tool", async () => {
  const { createAnthropicCheexpeerAnalyzer, selectCheexpeerAnalyzer } = await import("../supabase/functions/_shared/reputation-audit-provider.mjs");
  let captured;
  const analyze = createAnthropicCheexpeerAnalyzer({
    apiKey: "sk-ant-server-only",
    fetchImpl: async (url, options) => {
      captured = { url, options };
      return { ok: true, json: async () => ({ content: [{ type: "tool_use", name: "cheexpeer_audit", input: { findings: [] } }] }) };
    }
  });
  const out = await analyze({ system_prompt: "s", output_schema: { type: "object" }, input: { a: 1 } });
  assert.deepEqual(JSON.parse(out), { findings: [] });
  assert.equal(captured.url, "https://api.anthropic.com/v1/messages");
  assert.equal(captured.options.headers["x-api-key"], "sk-ant-server-only");
  assert.equal(captured.options.headers["anthropic-version"], "2023-06-01");
  const body = JSON.parse(captured.options.body);
  assert.equal(body.model, "claude-sonnet-5-5");
  assert.deepEqual(body.tool_choice, { type: "tool", name: "cheexpeer_audit" });
  assert.equal(selectCheexpeerAnalyzer({}), null);
  assert.equal(typeof selectCheexpeerAnalyzer({ apiKey: "sk-ant-x" }), "function");
  assert.equal(selectCheexpeerAnalyzer({ apiKey: "other-key" }), null);
  const bad = createAnthropicCheexpeerAnalyzer({ apiKey: "sk-ant-x", fetchImpl: async () => ({ ok: true, json: async () => ({ content: [] }) }) });
  await assert.rejects(bad({ system_prompt: "", output_schema: {}, input: {} }), /CHEEXPEER_AI_EMPTY_RESPONSE/);
});
