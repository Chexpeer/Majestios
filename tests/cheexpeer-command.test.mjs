import test from "node:test";
import assert from "node:assert/strict";
import { buildSubmitPayload, buildDecisionPayload, callApi, functionUrl, errorMessage, statusLabel } from "../cheexpeer-command.mjs";
import { validateSubmissionPayload, validateApprovalPayload, validateReadPayload } from "../supabase/functions/_shared/cheexpeer-api.mjs";

const org = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", ap = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

test("la mission construite par l'interface est acceptée par la validation serveur", () => {
  const p = buildSubmitPayload({ organizationId: org, title: "  Diagnostic  ", objective: "", idempotencyKey: "k1" });
  assert.equal(validateSubmissionPayload(p).ok, true);
  assert.equal(p.title, "Diagnostic");
  assert.equal("objective" in p, false);
  assert.equal(p.autonomy_level, 0); assert.equal(p.requires_approval, true);
});
test("intitulé vide refusé côté interface, titre long tronqué", () => {
  assert.equal(buildSubmitPayload({ organizationId: org, title: "   ", idempotencyKey: "k" }), null);
  assert.equal(buildSubmitPayload({ organizationId: org, title: "x".repeat(500), idempotencyKey: "k" }).title.length, 200);
});
test("la décision est acceptée par le serveur et rejette toute valeur inconnue", () => {
  assert.equal(validateApprovalPayload(buildDecisionPayload({ organizationId: org, approvalId: ap, decision: "approved", note: "ok" })).ok, true);
  assert.equal(buildDecisionPayload({ organizationId: org, approvalId: ap, decision: "execute" }), null);
});
test("aucune identité d'acteur n'est jamais envoyée par le navigateur", () => {
  const all = JSON.stringify([buildSubmitPayload({ organizationId: org, title: "t", idempotencyKey: "k" }), buildDecisionPayload({ organizationId: org, approvalId: ap, decision: "rejected" })]);
  assert.doesNotMatch(all, /created_by|decision_by|user_id|actor/);
});
test("les URLs ciblent les trois fonctions attendues", () => {
  assert.equal(functionUrl("https://x.supabase.co/", "submit"), "https://x.supabase.co/functions/v1/cheexpeer-mission-submit");
  assert.match(functionUrl("https://x.supabase.co", "decision"), /cheexpeer-approval-decision$/);
  assert.match(functionUrl("https://x.supabase.co", "read"), /cheexpeer-mission-read$/);
  assert.throws(() => functionUrl("https://x.supabase.co", "autre"));
  assert.equal(validateReadPayload({ organization_id: org, mission_id: ap }).ok, true);
});
test("callApi : succès, erreur serveur traduite, réseau injoignable", async () => {
  const ok = await callApi(async () => ({ ok: true, status: 201, json: async () => ({ ok: true, mission: { mission_id: ap } }) }), { baseUrl: "https://x.co", key: "submit", token: "t", body: {} });
  assert.equal(ok.ok, true);
  const ko = await callApi(async () => ({ ok: false, status: 403, json: async () => ({ ok: false, error: "ACCESS_DENIED" }) }), { baseUrl: "https://x.co", key: "read", token: "t", body: {} });
  assert.equal(ko.ok, false); assert.match(ko.message, /réservée/);
  const net = await callApi(async () => { throw new Error("boom"); }, { baseUrl: "https://x.co", key: "read", token: "t", body: {} });
  assert.equal(net.status, 0); assert.match(net.message, /injoignable/);
});
test("le jeton est envoyé en Bearer et jamais dans le corps", async () => {
  let seen;
  await callApi(async (u, o) => { seen = o; return { ok: true, status: 200, json: async () => ({ ok: true }) }; }, { baseUrl: "https://x.co", key: "read", token: "SECRET", body: { a: 1 } });
  assert.equal(seen.headers.Authorization, "Bearer SECRET"); assert.doesNotMatch(seen.body, /SECRET/);
});
test("libellés : codes inconnus sans fuite d'information", () => {
  assert.match(errorMessage("QUOI_QUE_CE_SOIT"), /Rien n'a été modifié/);
  assert.equal(statusLabel("succeeded"), "Terminée"); assert.equal(statusLabel("zzz"), "Statut à vérifier");
});
