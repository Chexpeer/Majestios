import test from "node:test";
import assert from "node:assert/strict";
import { createAuditCase, normalizeEvidence, toAuditEvidenceDTO, buildAuditReportDraft } from "../reputation-audit-core.mjs";

test("creates a minimal audit case and bounds objectives", () => {
  const item = createAuditCase({ subject: "  Atelier Exemple ", objectives: Array(20).fill("visibilité") }, "2026-11-09T08:00:00.000Z");
  assert.equal(item.subject, "Atelier Exemple");
  assert.equal(item.objectives.length, 12);
  assert.equal(item.status, "draft");
});

test("rejects evidence without a valid http(s) reference", () => {
  assert.throws(() => normalizeEvidence({ source_key: "registry", url: "javascript:alert(1)", captured_at: "2026-11-09", evidence_type: "web_result" }), /AUDIT_EVIDENCE_URL_INVALID/);
  assert.throws(() => normalizeEvidence({ url: "https://example.org", captured_at: "2026-11-09", evidence_type: "web_result" }), /AUDIT_EVIDENCE_INVALID/);
});

test("normalizes evidence and keeps internal source identifiers out of UI DTO", () => {
  const evidence = normalizeEvidence({
    source_key: "internal_provider_alpha", source_record_id: "record-42",
    url: "https://example.org/page", title: "Exemple", excerpt: "Observation vérifiable",
    captured_at: "2026-11-09T08:00:00.000Z", evidence_type: "website_page", strength: "high"
  });
  const dto = toAuditEvidenceDTO(evidence);
  assert.equal(dto.strength, "high");
  assert.equal(dto.reference, "https://example.org/page");
  assert.equal("source_key" in dto, false);
  assert.equal("source_record_id" in dto, false);
});

test("report draft never fabricates findings or recommendations", () => {
  const auditCase = createAuditCase({ subject: "Entreprise Exemple" });
  const report = buildAuditReportDraft({ auditCase, evidence: [] });
  assert.equal(report.status, "draft");
  assert.deepEqual(report.findings, []);
  assert.deepEqual(report.conclusions, []);
  assert.deepEqual(report.recommendations, []);
  assert.equal(report.review_required, true);
});
