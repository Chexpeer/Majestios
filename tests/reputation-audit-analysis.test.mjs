import test from "node:test";
import assert from "node:assert/strict";
import { createAuditCase, normalizeEvidence } from "../reputation-audit-core.mjs";
import {
  buildCheexpeerAnalysisRequest, runCheexpeerAuditAnalysis, validateCheexpeerAnalysis
} from "../reputation-audit-analysis.mjs";

const auditCase = createAuditCase({ subject: "Atelier Exemple", activity: "Travaux électriques" });
const evidence = [
  normalizeEvidence({
    source_key: "official_company_identity", source_record_id: "123456789",
    url: "https://recherche-entreprises.api.gouv.fr/search?q=Atelier",
    title: "Atelier Exemple", excerpt: "SIREN 123456789 · activité travaux électriques",
    evidence_type: "business_identity", captured_at: "2026-11-09T09:00:00.000Z",
    subject_match: "confirmed", strength: "high"
  }),
  normalizeEvidence({
    source_key: "bodacc", source_record_id: "A202600001234",
    url: "https://www.bodacc.fr/annonce/A202600001234",
    title: "Avis initial — Créations", excerpt: "Entreprise publiée : Atelier Exemple",
    evidence_type: "legal_event", captured_at: "2026-11-09T09:00:00.000Z",
    subject_match: "confirmed", strength: "high"
  })
];
const emptyOutput = { findings: [], recommendations: [], gaps: ["Aucun avis client vérifié n'a été collecté."] };

test("analysis request assigns stable in-request evidence references and excludes provider keys", () => {
  const request = buildCheexpeerAnalysisRequest({ auditCase, evidence });
  assert.equal(request.input.evidence[0].evidence_id, "E001");
  assert.equal(request.input.evidence[1].evidence_id, "E002");
  assert.equal("source_key" in request.input.evidence[0], false);
  assert.match(request.system_prompt, /n'inventes aucune recherche/);
  assert.equal(request.output_schema.additionalProperties, false);
});

test("analysis may return no findings when evidence is insufficient", async () => {
  const report = await runCheexpeerAuditAnalysis({ auditCase, evidence: [], analyze: async () => emptyOutput });
  assert.equal(report.status, "analysis_ready");
  assert.deepEqual(report.findings, []);
  assert.deepEqual(report.recommendations, []);
  assert.equal(report.review_required, true);
});

test("analysis findings must reference existing evidence", () => {
  const invalid = {
    findings: [{
      category: "identity", classification: "fact", confidence: "high", severity: "low",
      statement: "Entreprise confirmée.", evidence_ids: ["E999"], limitations: []
    }],
    recommendations: [], gaps: []
  };
  assert.throws(() => validateCheexpeerAnalysis(invalid, buildCheexpeerAnalysisRequest({ auditCase, evidence }).input.evidence),
    /AUDIT_ANALYSIS_EVIDENCE_REFERENCE_INVALID/);
});

test("administrative evidence cannot be converted into a reputation finding", () => {
  const invalid = {
    findings: [{
      category: "reviews", classification: "interpretation", confidence: "high", severity: "high",
      statement: "La réputation est mauvaise.", evidence_ids: ["E002"], limitations: []
    }],
    recommendations: [], gaps: []
  };
  assert.throws(() => validateCheexpeerAnalysis(invalid, buildCheexpeerAnalysisRequest({ auditCase, evidence }).input.evidence),
    /AUDIT_ANALYSIS_ADMIN_DATA_CANNOT_PROVE_REPUTATION/);
});

test("facts require confirmed subject matching", () => {
  const probable = [normalizeEvidence({
    source_key: "manual", url: "https://example.org", title: "Entreprise proche",
    excerpt: "Nom proche", evidence_type: "web_result", captured_at: "2026-11-09",
    subject_match: "probable"
  })];
  const indexed = buildCheexpeerAnalysisRequest({ auditCase, evidence: probable }).input.evidence;
  const invalid = {
    findings: [{
      category: "web_presence", classification: "fact", confidence: "medium", severity: "low",
      statement: "Le résultat concerne l'entreprise.", evidence_ids: ["E001"], limitations: []
    }],
    recommendations: [], gaps: []
  };
  assert.throws(() => validateCheexpeerAnalysis(invalid, indexed), /AUDIT_ANALYSIS_FACT_NOT_CONFIRMED/);
});

test("recommendations must point to a valid finding", () => {
  const invalid = {
    findings: [{
      category: "identity", classification: "fact", confidence: "high", severity: "low",
      statement: "Identité confirmée.", evidence_ids: ["E001"], limitations: []
    }],
    recommendations: [{
      finding_ids: ["F999"], priority: "low", action: "Vérifier", rationale: "Contrôle",
      expected_impact: "Meilleure fiabilité", validation_method: "Contrôle manuel"
    }],
    gaps: []
  };
  assert.throws(() => validateCheexpeerAnalysis(invalid, buildCheexpeerAnalysisRequest({ auditCase, evidence }).input.evidence),
    /AUDIT_ANALYSIS_FINDING_REFERENCE_INVALID/);
});

test("model errors and malformed JSON are not converted into reports", async () => {
  await assert.rejects(runCheexpeerAuditAnalysis({ auditCase, evidence, analyze: async () => "not-json" }), /AUDIT_ANALYSIS_INVALID_JSON/);
  await assert.rejects(runCheexpeerAuditAnalysis({ auditCase, evidence, analyze: async () => { throw new Error("provider down"); } }), /provider down/);
});

test("recommendations are linked to findings and report remains human-reviewable", async () => {
  const output = {
    findings: [{
      category: "identity", classification: "fact", confidence: "high", severity: "low",
      statement: "La dénomination correspond au référentiel administratif.", evidence_ids: ["E001"], limitations: []
    }],
    recommendations: [{
      finding_ids: ["F001"], priority: "low", action: "Compléter le cadrage du site web.",
      rationale: "Le dossier ne contient pas encore d'URL confirmée.",
      expected_impact: "Améliorer le périmètre de l'audit.",
      validation_method: "Valider l'URL avec le client."
    }],
    gaps: ["URL du site non fournie."]
  };
  const report = await runCheexpeerAuditAnalysis({ auditCase, evidence, analyze: async () => output });
  assert.equal(report.findings[0].finding_id, "F001");
  assert.equal(report.recommendations[0].recommendation_id, "R001");
  assert.deepEqual(report.recommendations[0].finding_ids, ["F001"]);
  assert.equal(report.review_required, true);
});
