/**
 * Registre interne et connecteur initial du moteur d'audit Cheexpeer.
 * Les noms techniques et identifiants de sources restent côté serveur.
 */
export const REPUTATION_SOURCE_REGISTRY = Object.freeze([
  Object.freeze({
    source_key: "official_company_identity",
    status: "ready",
    scopes: Object.freeze(["identity_context"]),
    access_mode: "public_api",
    purpose: "Vérification de l'identité administrative de l'entreprise ; ne mesure pas sa réputation."
  }),
  Object.freeze({
    source_key: "google_web",
    status: "manual_only",
    scopes: Object.freeze(["web_presence"]),
    access_mode: "manual",
    purpose: "Consultation manuelle dans le prototype actuel."
  }),
  Object.freeze({
    source_key: "google_maps",
    status: "manual_only",
    scopes: Object.freeze(["local_presence"]),
    access_mode: "manual",
    purpose: "Consultation manuelle dans le prototype actuel."
  }),
  Object.freeze({
    source_key: "bodacc",
    status: "ready",
    scopes: Object.freeze(["legal_events"]),
    access_mode: "public_api",
    purpose: "Annonces légales publiques utilisées comme contexte factuel, sans interprétation automatique de réputation."
  }),
  Object.freeze({
    source_key: "social_platforms",
    status: "planned",
    scopes: Object.freeze(["social_presence"]),
    access_mode: "to_assess",
    purpose: "Aucune connexion automatisée aux plateformes n'est activée."
  })
]);

const MAX_EVIDENCE_PER_SOURCE = 20;
const clean = (value, max = 300) => typeof value === "string" ? value.trim().slice(0, max) : "";
const normalizeName = value => clean(value, 180).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

export class ReputationCollectionError extends Error {
  constructor(code) { super(code); this.name = "ReputationCollectionError"; this.code = code; }
}

export function createOfficialCompanyIdentityAdapter({ fetchImpl = fetch, now = () => new Date().toISOString() } = {}) {
  return Object.freeze({
    source_key: "official_company_identity",
    async collect({ auditCase, signal } = {}) {
      const subject = clean(auditCase?.subject, 180);
      if (subject.length < 2) throw new ReputationCollectionError("AUDIT_SUBJECT_INVALID");
      const query = clean(auditCase?.siren, 9) || subject;
      const url = new URL("https://recherche-entreprises.api.gouv.fr/search");
      url.searchParams.set("q", query);
      url.searchParams.set("per_page", "5");
      url.searchParams.set("page", "1");
      let response;
      try {
        response = await fetchImpl(url.toString(), {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "MajestiOS/1.0 (audit de contexte administratif; https://majestios.com)"
          },
          signal: signal || AbortSignal.timeout(10000)
        });
      } catch {
        throw new ReputationCollectionError("OFFICIAL_IDENTITY_UNAVAILABLE");
      }
      if (response.status === 429) throw new ReputationCollectionError("OFFICIAL_IDENTITY_RATE_LIMITED");
      if (!response.ok) throw new ReputationCollectionError("OFFICIAL_IDENTITY_UNAVAILABLE");
      let payload;
      try { payload = await response.json(); } catch { throw new ReputationCollectionError("OFFICIAL_IDENTITY_INVALID_RESPONSE"); }
      if (!Array.isArray(payload?.results)) throw new ReputationCollectionError("OFFICIAL_IDENTITY_INVALID_RESPONSE");

      const capturedAt = now();
      const searchUrl = url.toString();
      return payload.results.slice(0, 5).map(record => {
        const siren = clean(String(record?.siren ?? "").replace(/\D/g, ""), 9);
        const name = clean(record?.nom_complet || record?.nom_raison_sociale || record?.denomination, 180);
        const activity = clean(record?.libelle_activite_principale || record?.activite_principale, 180);
        const city = clean(record?.siege?.libelle_commune || record?.siege?.commune, 100);
        const active = record?.etat_administratif === "A";
        const sirenMatch = Boolean(auditCase?.siren && siren === clean(auditCase.siren, 9));
        const exactNameMatch = normalizeName(name) === normalizeName(subject);
        const subjectMatch = auditCase?.siren
          ? sirenMatch ? "confirmed" : "rejected"
          : exactNameMatch ? "probable" : "uncertain";
        const details = [
          siren ? "SIREN " + siren : "",
          active ? "établissement administratif actif" : record?.etat_administratif === "C" ? "établissement administratif cessé" : "état administratif non confirmé",
          activity ? "activité " + activity : "",
          city ? "commune " + city : ""
        ].filter(Boolean).join(" · ");
        return {
          source_key: "official_company_identity",
          source_record_id: siren || null,
          url: searchUrl,
          title: name || "Entreprise retournée par le référentiel officiel",
          excerpt: details,
          evidence_type: "business_identity",
          captured_at: capturedAt,
          subject_match: subjectMatch,
          strength: "high",
          limitations: [
            "Cette observation confirme des éléments d'identité administrative, pas la qualité de la réputation en ligne.",
            "La correspondance doit être vérifiée si plusieurs entreprises portent un nom proche."
          ]
        };
      });
    }
  });
}

export async function runReputationCollection({
  auditCase,
  requestedScopes = [],
  adapters = [],
  signal,
  normalizeEvidence
} = {}) {
  if (!auditCase?.subject || !Array.isArray(requestedScopes) || !Array.isArray(adapters) || typeof normalizeEvidence !== "function") {
    throw new TypeError("AUDIT_COLLECTION_INPUT_INVALID");
  }
  const enabled = REPUTATION_SOURCE_REGISTRY.filter(source =>
    source.status === "ready" && source.scopes.some(scope => requestedScopes.includes(scope))
  );
  const adapterMap = new Map(adapters.filter(adapter => adapter && typeof adapter.source_key === "string").map(adapter => [adapter.source_key, adapter]));
  const evidence = [];
  const sourceResults = [];

  for (const source of enabled) {
    const adapter = adapterMap.get(source.source_key);
    if (!adapter || typeof adapter.collect !== "function") {
      sourceResults.push({ source_key: source.source_key, status: "not_configured", evidence_count: 0 });
      continue;
    }
    try {
      const collected = await adapter.collect({ auditCase, signal });
      if (!Array.isArray(collected)) throw new ReputationCollectionError("CONNECTOR_INVALID_RESULT");
      const bounded = collected.slice(0, MAX_EVIDENCE_PER_SOURCE);
      for (const item of bounded) evidence.push(normalizeEvidence({ ...item, source_key: source.source_key }));
      sourceResults.push({ source_key: source.source_key, status: "succeeded", evidence_count: bounded.length });
    } catch (error) {
      const code = error instanceof ReputationCollectionError ? error.code : "CONNECTOR_FAILED";
      sourceResults.push({ source_key: source.source_key, status: "failed", evidence_count: 0, error_code: code });
    }
  }

  const successful = sourceResults.filter(result => result.status === "succeeded").length;
  const status = successful === 0 ? "blocked" : sourceResults.some(result => result.status !== "succeeded") ? "partial" : "completed";
  return Object.freeze({ status, evidence: Object.freeze(evidence), source_results: Object.freeze(sourceResults) });
}

export function toReputationCollectionDTO(result, toEvidenceDTO) {
  if (!result || !Array.isArray(result.evidence) || typeof toEvidenceDTO !== "function") {
    throw new TypeError("AUDIT_COLLECTION_RESULT_INVALID");
  }
  return Object.freeze({
    status: ["blocked", "partial", "completed"].includes(result.status) ? result.status : "blocked",
    evidence: result.evidence.map(toEvidenceDTO),
    evidence_count: result.evidence.length,
    // Aucun identifiant de fournisseur, statut de connecteur ou catalogue technique dans le DTO UI.
    notice: "Les éléments administratifs constituent un contexte d'identification ; ils ne sont pas un score de réputation."
  });
}


/**
 * Collecte limitée aux annonces commerciales publiées par la DILA.
 * Les annonces sont du contexte légal, jamais un score ou un jugement de réputation.
 */
export function createBodaccLegalEventsAdapter({ fetchImpl = fetch, now = () => new Date().toISOString() } = {}) {
  return Object.freeze({
    source_key: "bodacc",
    async collect({ auditCase, signal } = {}) {
      const subject = clean(auditCase?.subject, 120).replace(/["\\]/g, " ").replace(/\s+/g, " ").trim();
      if (subject.length < 2) throw new ReputationCollectionError("AUDIT_SUBJECT_INVALID");
      const url = new URL("https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records");
      url.searchParams.set("where", 'search(commercant, "' + subject + '")');
      url.searchParams.set("limit", "10");
      url.searchParams.set("order_by", "dateparution desc");
      url.searchParams.set("select", "id,publicationavis,dateparution,numeroannonce,typeavis_lib,familleavis_lib,departement_nom_officiel,commercant,ville,registre,url_complete");
      let response;
      try {
        response = await fetchImpl(url.toString(), {
          method: "GET",
          headers: { Accept: "application/json", "User-Agent": "MajestiOS/1.0 (contexte légal; https://majestios.com)" },
          signal: signal || AbortSignal.timeout(12000)
        });
      } catch {
        throw new ReputationCollectionError("BODACC_UNAVAILABLE");
      }
      if (response.status === 429) throw new ReputationCollectionError("BODACC_RATE_LIMITED");
      if (!response.ok) throw new ReputationCollectionError("BODACC_UNAVAILABLE");
      let payload;
      try { payload = await response.json(); } catch { throw new ReputationCollectionError("BODACC_INVALID_RESPONSE"); }
      const records = Array.isArray(payload?.results) ? payload.results :
        Array.isArray(payload?.records) ? payload.records.map(item => item?.record?.fields || item?.fields || {}).filter(item => Object.keys(item).length) : null;
      if (!records) throw new ReputationCollectionError("BODACC_INVALID_RESPONSE");

      const capturedAt = now();
      return records.slice(0, 10).map(record => {
        const merchant = clean(record?.commercant, 180);
        const normalizedSubject = normalizeName(subject);
        const normalizedMerchant = normalizeName(merchant);
        const registryValues = Array.isArray(record?.registre)
          ? record.registre
          : typeof record?.registre === "string" ? record.registre.split(",") : [];
        const registrySirens = registryValues
          .map(value => String(value).replace(/\D/g, ""))
          .filter(value => /^\d{9}$/.test(value));
        const requestedSiren = clean(auditCase?.siren, 9);
        const sirenMatch = Boolean(requestedSiren && registrySirens.includes(requestedSiren));
        const exactNameMatch = Boolean(normalizedMerchant && normalizedMerchant === normalizedSubject);
        const match = requestedSiren
          ? sirenMatch ? "confirmed" : "rejected"
          : exactNameMatch ? "probable" : "uncertain";
        const id = clean(String(record?.id || record?.numeroannonce || record?.publicationavis || ""), 100);
        const titleParts = [clean(record?.typeavis_lib, 120), clean(record?.familleavis_lib, 120)].filter(Boolean);
        const details = [
          merchant ? "Entreprise publiée : " + merchant : "",
          clean(record?.dateparution, 20) ? "Parution : " + clean(record.dateparution, 20) : "",
          clean(record?.ville, 100) ? "Commune : " + clean(record.ville, 100) : "",
          clean(record?.departement_nom_officiel, 100) ? "Département : " + clean(record.departement_nom_officiel, 100) : ""
        ].filter(Boolean).join(" · ");
        const officialUrl = typeof record?.url_complete === "string" && /^https:\/\/(www\.)?bodacc\.fr\//i.test(record.url_complete)
          ? record.url_complete
          : url.toString();
        return {
          source_key: "bodacc",
          source_record_id: id || null,
          url: officialUrl,
          title: titleParts.join(" — ") || "Annonce commerciale publiée",
          excerpt: details,
          evidence_type: "legal_event",
          captured_at: capturedAt,
          subject_match: match,
          strength: "high",
          limitations: [
            "Une annonce légale est un fait de publication, pas une appréciation de la réputation de l'entreprise.",
            "Le contenu intégral et le contexte juridique doivent être vérifiés avant toute interprétation.",
            "Les données BODACC peuvent contenir des données personnelles ; seules les informations nécessaires à l'identification de l'entreprise sont reprises ici."
          ]
        };
      });
    }
  });
}
