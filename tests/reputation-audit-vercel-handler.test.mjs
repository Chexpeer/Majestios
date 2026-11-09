import test from "node:test";
import assert from "node:assert/strict";
import { createVercelReputationAuditHandler } from "../supabase/functions/_shared/reputation-audit-vercel-handler.mjs";

const req = (body, headers = {}) => new Request("https://majestios.test/api/reputation-audit-analyze", {
  method: "POST",
  headers: { Authorization: "Bearer valid-token", "Content-Type": "application/json", ...headers },
  body: JSON.stringify(body)
});
const evidence = [{
  title: "Atelier Exemple",
  excerpt: "SIREN 123456789 · activité travaux électriques",
  evidence_type: "business_identity",
  captured_at: "2026-11-09T09:00:00.000Z",
  subject_match: "confirmed",
  strength: "high",
  limitations: ["Contexte administratif uniquement."],
  reference: "https://recherche-entreprises.api.gouv.fr/search?q=Atelier"
}];

test("rejects requests without a verified Supabase user", async () => {
  const handler = createVercelReputationAuditHandler({
    verifyUser: async () => false, collectContext: async () => ({ evidence: [] }), analyzeModel: async () => ({ findings: [], recommendations: [], gaps: [] })
  });
  const response = await handler(req({ subject: "Atelier Exemple" }));
  assert.equal(response.status, 401);
});

test("validates the request before collecting evidence", async () => {
  let called = false;
  const handler = createVercelReputationAuditHandler({
    verifyUser: async () => true,
    collectContext: async () => { called = true; return { evidence: [] }; },
    analyzeModel: async () => ({ findings: [], recommendations: [], gaps: [] })
  });
  const response = await handler(req({ subject: "A" }));
  assert.equal(response.status, 400);
  assert.equal(called, false);
});

test("does not spend model calls when no evidence was collected", async () => {
  let modelCalled = false;
  const handler = createVercelReputationAuditHandler({
    verifyUser: async () => true,
    collectContext: async () => ({ status: "completed", evidence: [] }),
    analyzeModel: async () => { modelCalled = true; return {}; },
    now: () => "2026-11-09T09:30:00.000Z"
  });
  const response = await handler(req({ subject: "Atelier Exemple" }));
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.status, "insufficient_evidence");
  assert.equal(modelCalled, false);
  assert.deepEqual(body.findings, []);
});

test("collects server-side evidence and returns a validated Cheexpeer report", async () => {
  let collected = false;
  let modelRequest;
  const handler = createVercelReputationAuditHandler({
    verifyUser: async token => token === "valid-token",
    collectContext: async ({ token, subject }) => {
      collected = token === "valid-token" && subject === "Atelier Exemple";
      return { status: "completed", evidence };
    },
    analyzeModel: async request => {
      modelRequest = request;
      return {
        findings: [{
          category: "identity", classification: "fact", confidence: "high", severity: "low",
          statement: "La dénomination correspond au référentiel administratif.",
          evidence_ids: ["E001"], limitations: ["Le contexte ne mesure pas la réputation."]
        }],
        recommendations: [{
          finding_ids: ["F001"], priority: "low", action: "Compléter le site déclaré.",
          rationale: "Le dossier ne comporte pas de site confirmé.",
          expected_impact: "Améliorer le périmètre de l'audit.",
          validation_method: "Faire confirmer l'URL."
        }],
        gaps: ["Site web non renseigné."]
      };
    },
    now: () => "2026-11-09T09:30:00.000Z"
  });
  const response = await handler(req({ subject: "Atelier Exemple", objectives: ["présence locale"] }));
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(collected, true);
  assert.equal(modelRequest.input.evidence[0].evidence_id, "E001");
  assert.equal(body.status, "analysis_ready");
  assert.equal(body.findings.length, 1);
  assert.equal(body.recommendations[0].finding_ids[0], "F001");
  assert.equal(body.review_required, true);
});

test("collection or model failures never create a fabricated report", async () => {
  const collectionFailure = createVercelReputationAuditHandler({
    verifyUser: async () => true, collectContext: async () => { throw new Error("offline"); }, analyzeModel: async () => ({})
  });
  const modelFailure = createVercelReputationAuditHandler({
    verifyUser: async () => true, collectContext: async () => ({ evidence }), analyzeModel: async () => { throw new Error("gateway unavailable"); }
  });
  assert.equal((await collectionFailure(req({ subject: "Atelier Exemple" }))).status, 503);
  assert.equal((await modelFailure(req({ subject: "Atelier Exemple" }))).status, 502);
});
