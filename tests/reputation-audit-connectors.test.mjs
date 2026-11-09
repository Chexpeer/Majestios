import test from "node:test";
import assert from "node:assert/strict";
import { normalizeEvidence, toAuditEvidenceDTO } from "../reputation-audit-core.mjs";
import {
  REPUTATION_SOURCE_REGISTRY, createOfficialCompanyIdentityAdapter,
  runReputationCollection, toReputationCollectionDTO, ReputationCollectionError
} from "../reputation-audit-connectors.mjs";

const auditCase = { subject: "Atelier Exemple", siren: "" };
const response = payload => ({ ok: true, status: 200, json: async () => payload });

test("official identity adapter queries a fixed official endpoint and normalizes records", async () => {
  let requestedUrl = "";
  const adapter = createOfficialCompanyIdentityAdapter({
    now: () => "2026-11-09T08:30:00.000Z",
    fetchImpl: async url => { requestedUrl = url; return response({ results: [{
      siren: "123456789", nom_complet: "Atelier Exemple", etat_administratif: "A",
      activite_principale: "43.21A", libelle_activite_principale: "Travaux électriques",
      siege: { libelle_commune: "Le Mans" }
    }] }); }
  });
  const items = await adapter.collect({ auditCase });
  assert.equal(new URL(requestedUrl).origin, "https://recherche-entreprises.api.gouv.fr");
  assert.equal(items.length, 1);
  assert.equal(items[0].evidence_type, "business_identity");
  assert.equal(items[0].subject_match, "confirmed");
  assert.match(items[0].excerpt, /123456789/);
  assert.match(items[0].limitations.join(" "), /pas la qualité de la réputation/);
});

test("official identity adapter maps rate limiting to a stable error", async () => {
  const adapter = createOfficialCompanyIdentityAdapter({ fetchImpl: async () => ({ ok: false, status: 429 }) });
  await assert.rejects(adapter.collect({ auditCase }), error =>
    error instanceof ReputationCollectionError && error.code === "OFFICIAL_IDENTITY_RATE_LIMITED");
});

test("orchestrator only runs sources marked ready and bounds evidence", async () => {
  const adapter = createOfficialCompanyIdentityAdapter({
    fetchImpl: async () => response({ results: Array.from({ length: 30 }, (_, i) => ({
      siren: String(100000000 + i), nom_complet: "Entreprise " + i, etat_administratif: "A"
    })) })
  });
  const result = await runReputationCollection({
    auditCase, requestedScopes: ["identity_context", "social_presence"],
    adapters: [adapter], normalizeEvidence
  });
  assert.equal(result.status, "completed");
  assert.equal(result.evidence.length, 5);
  assert.equal(result.source_results.length, 1);
  assert.equal(REPUTATION_SOURCE_REGISTRY.find(source => source.source_key === "social_platforms").status, "planned");
});

test("UI DTO does not expose internal provider identifiers", async () => {
  const adapter = createOfficialCompanyIdentityAdapter({ fetchImpl: async () => response({ results: [{
    siren: "123456789", nom_complet: "Atelier Exemple", etat_administratif: "A"
  }] }) });
  const result = await runReputationCollection({ auditCase, requestedScopes: ["identity_context"], adapters: [adapter], normalizeEvidence });
  const dto = toReputationCollectionDTO(result, toAuditEvidenceDTO);
  assert.equal(dto.evidence_count, 1);
  assert.equal("source_results" in dto, false);
  assert.equal("source_key" in dto.evidence[0], false);
  assert.match(dto.notice, /ne sont pas un score de réputation/);
});

test("manual and planned sources are never executed as automatic adapters", async () => {
  let called = false;
  const fake = { source_key: "social_platforms", collect: async () => { called = true; return []; } };
  const result = await runReputationCollection({
    auditCase, requestedScopes: ["social_presence"], adapters: [fake], normalizeEvidence
  });
  assert.equal(called, false);
  assert.equal(result.status, "blocked");
  assert.equal(result.source_results.length, 0);
});
