import assert from "node:assert/strict";
import test from "node:test";
import { chat, toProviderMessages, mapChatError, SYSTEM_PROMPT } from "../supabase/functions/_shared/cheexpeer-chat-core.mjs";

const HISTORY = [{ role: "assistant", content: "orphelin" }, { role: "user", content: "Bonjour" }, { role: "user", content: "Ça va ?" }, { role: "assistant", content: "Oui" }, { role: "user", content: "Merci" }];
function setup({ prepare, record, fetchImpl } = {}) {
  const calls = [];
  return {
    calls,
    userClient: { rpc: async (n, a) => { calls.push(["user", n, a]); return prepare ?? { data: { conversation_id: "c1", history: HISTORY }, error: null }; } },
    adminClient: { rpc: async (n, a) => { calls.push(["admin", n, a]); return record ?? { data: { ok: true }, error: null }; } },
    fetchImpl: fetchImpl ?? (async (url, init) => { calls.push(["fetch", url, JSON.parse(init.body), init.headers]); return { ok: true, json: async () => ({ content: [{ type: "text", text: "Bonjour !" }], usage: { input_tokens: 12, output_tokens: 5 } }) }; }),
  };
}
const run = (s, extra = {}) => chat({ body: { message: "Salut" }, userId: "u1", userClient: s.userClient, adminClient: s.adminClient, apiKey: "k", fetchImpl: s.fetchImpl, ...extra });

test("alternance user/assistant garantie", () => {
  assert.deepEqual(toProviderMessages(HISTORY), [{ role: "user", content: "Bonjour\n\nÇa va ?" }, { role: "assistant", content: "Oui" }, { role: "user", content: "Merci" }]);
  assert.deepEqual(toProviderMessages(null), []);
});
test("réponse enregistrée par le client service, jamais par l'utilisateur", async () => {
  const s = setup(); const r = await run(s);
  assert.equal(r.status, 200); assert.equal(r.body.reply, "Bonjour !");
  const rec = s.calls.find((c) => c[1] === "cheexpeer_chat_record");
  assert.equal(rec[0], "admin"); assert.equal(rec[2].p_user_id, "u1"); assert.equal(rec[2].p_output_tokens, 5);
});
test("appel fournisseur : clé en en-tête, consigne de sécurité, plafond de sortie", async () => {
  const s = setup(); await run(s);
  const f = s.calls.find((c) => c[0] === "fetch");
  assert.equal(f[3]["x-api-key"], "k"); assert.equal(f[2].system, SYSTEM_PROMPT); assert.ok(f[2].max_tokens <= 800);
  assert.match(SYSTEM_PROMPT, /Majestios Bot/); assert.match(SYSTEM_PROMPT, /lecture seule/); assert.match(SYSTEM_PROMPT, /n'exécutes aucune action/);
});
test("dialogue éteint ou plafond : aucun appel au fournisseur", async () => {
  for (const [code, status] of [["CHAT_DISABLED", 409], ["QUOTA_DAY", 429], ["QUOTA_MONTH", 429], ["ACCESS_DENIED", 403]]) {
    const s = setup({ prepare: { data: null, error: { message: code } } }); const r = await run(s);
    assert.equal(r.status, status); assert.equal(s.calls.filter((c) => c[0] === "fetch").length, 0);
  }
  assert.equal(mapChatError("boom").status, 500);
});
test("clé absente : refus propre sans appel", async () => {
  const s = setup(); const r = await run(s, { apiKey: "" });
  assert.equal(r.status, 503); assert.equal(s.calls.length, 0);
});
test("échec du fournisseur : 502 et rien d'enregistré côté assistant", async () => {
  const s = setup({ fetchImpl: async () => ({ ok: false, status: 500 }) }); const r = await run(s);
  assert.equal(r.status, 502); assert.equal(s.calls.filter((c) => c[1] === "cheexpeer_chat_record").length, 0);
});
test("identifiant de conversation invalide ignoré", async () => {
  const s = setup(); await run(s, { body: { message: "x", conversation_id: "'; drop" } });
  assert.equal(s.calls[0][2].p_conversation, null);
});
