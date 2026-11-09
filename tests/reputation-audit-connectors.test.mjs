import test from "node:test";
import assert from "node:assert/strict";
import { normalizeEvidence, toAuditEvidenceDTO } from "../reputation-audit-core.mjs";
import {
  REPUTATION_SOURCE_REGISTRY, createOfficialCompanyIdentityAdapter, createBodaccLegalEventsAdapter,
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
  assert.equal(items[0].subject_match, "probable");
  assert.match(items[0].excerpt, /123456789/);
  assert.match(items[0].limitations.join(" "), /pas la qualité de la réputation/);
});


test("official identity requires a matching SIREN before confirming identity", async () => {
  const adapter = createOfficialCompanyIdentityAdapter({
    fetchImpl: async () => response({ results: [
      { siren: "123456789", nom_complet: "Atelier Exemple", etat_administratif: "A" },
      { siren: "987654321", nom_complet: "Atelier Exemple", etat_administratif: "A" }
    ] })
  });
  const withMatchingSiren = await adapter.collect({ auditCase: { subject: "Atelier Exemple", siren: "123456789" } });
  const withDifferentSiren = await adapter.collect({ auditCase: { subject: "Atelier Exemple", siren: "111111111" } });
  const withoutSiren = await adapter.collect({ auditCase: { subject: "Atelier Exemple", siren: "" } });
  assert.equal(withMatchingSiren[0].subject_match, "confirmed");
  assert.equal(withDifferentSiren[0].subject_match, "rejected");
  assert.equal(withoutSiren[0].subject_match, "probable");
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


test("BODACC adapter builds a constrained official query and normalizes legal notices", async () => {
  let requestedUrl = "";
  const adapter = createBodaccLegalEventsAdapter({
    now: () => "2026-11-09T09:00:00.000Z",
    fetchImpl: async url => {
      requestedUrl = url;
      return response({ results: [{
        id: "A202600001234", commercant: "ATELIER EXEMPLE", dateparution: "2026-11-08",
        typeavis_lib: "Avis initial", familleavis_lib: "Créations", ville: "Le Mans",
        departement_nom_officiel: "Sarthe", url_complete: "https://www.bodacc.fr/pages/annonces-commerciales-detail/?id=A202600001234"
      }] });
    }
  });
  const items = await adapter.collect({ auditCase });
  const url = new URL(requestedUrl);
  assert.equal(url.hostname, "bodacc-datadila.opendatasoft.com");
  assert.match(url.searchParams.get("where"), /search\(commercant,/);
  assert.equal(url.searchParams.get("limit"), "10");
  assert.equal(items.length, 1);
  assert.equal(items[0].evidence_type, "legal_event");
  assert.equal(items[0].subject_match, "probable");
  assert.equal(items[0].source_record_id, "A202600001234");
  assert.match(items[0].limitations.join(" "), /pas une appréciation de la réputation/);
});

test("BODACC rate limits are surfaced as a stable connector error", async () => {
  const adapter = createBodaccLegalEventsAdapter({ fetchImpl: async () => ({ ok: false, status: 429 }) });
  await assert.rejects(adapter.collect({ auditCase }), error =>
    error instanceof ReputationCollectionError && error.code === "BODACC_RATE_LIMITED");
});
