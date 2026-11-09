import test from "node:test";
import assert from "node:assert/strict";
import { createReputationAuditHandler } from "../supabase/functions/_shared/reputation-audit-handler.mjs";

const payload = { results: [{
  siren: "123456789", nom_complet: "Atelier Exemple", etat_administratif: "A",
  libelle_activite_principale: "Travaux électriques", siege: { libelle_commune: "Le Mans" }
}] };
const fetchOk = async () => ({ ok: true, status: 200, json: async () => payload });
const authOk = async () => ({ id: "user-test" });
const request = (body, headers = {}) => new Request("https://local.test/reputation-audit-context", {
  method: "POST",
  headers: { Authorization: "Bearer valid-token", "Content-Type": "application/json", ...headers },
  body: JSON.stringify(body)
});

test("requires a verified authenticated user", async () => {
  const handler = createReputationAuditHandler({ authenticate: async () => null });
  const response = await handler(request({ subject: "Atelier Exemple" }));
  assert.equal(response.status, 401);
});

test("validates the company name and SIREN before upstream calls", async () => {
  let called = false;
  const handler = createReputationAuditHandler({ authenticate: authOk, fetchImpl: async () => { called = true; return fetchOk(); } });
  const shortName = await handler(request({ subject: "A" }));
  const badSiren = await handler(request({ subject: "Atelier Exemple", siren: "123" }));
  assert.equal(shortName.status, 400);
  assert.equal(badSiren.status, 400);
  assert.equal(called, false);
});

test("returns sanitized identity evidence and no internal connector identifiers", async () => {
  const handler = createReputationAuditHandler({ authenticate: authOk, fetchImpl: fetchOk, now: () => "2026-11-09T08:45:00.000Z" });
  const response = await handler(request({ subject: "Atelier Exemple", siren: "123456789" }));
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.status, "completed");
  assert.equal(body.evidence_count, 1);
  assert.equal(body.evidence[0].subject_match, "confirmed");
  assert.equal("source_key" in body.evidence[0], false);
  assert.equal("source_results" in body, false);
  assert.match(body.notice, /ne constituent pas un audit/);
});

test("rejects oversized and non-JSON requests", async () => {
  const handler = createReputationAuditHandler({ authenticate: authOk, fetchImpl: fetchOk });
  const wrongType = await handler(new Request("https://local.test/reputation-audit-context", {
    method: "POST", headers: { Authorization: "Bearer valid-token", "Content-Type": "text/plain" }, body: "x"
  }));
  const large = await handler(request({ subject: "x".repeat(5000) }));
  assert.equal(wrongType.status, 415);
  assert.equal(large.status, 413);
});
