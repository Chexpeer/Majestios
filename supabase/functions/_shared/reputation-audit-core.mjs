/**
 * Contrat métier du moteur d'audit de réputation Cheexpeer.
 * Couche pure : aucune collecte réseau, aucun secret, aucun accès Supabase.
 * Les fournisseurs restent internes et ne doivent pas être exposés dans les DTO UI.
 */
export const AUDIT_STATUSES = Object.freeze(["draft", "collecting", "analysing", "ready", "blocked"]);
export const EVIDENCE_TYPES = Object.freeze([
  "web_result", "local_listing", "social_profile", "review", "website_page", "business_identity", "legal_event",
  "technical_signal", "competitor_signal", "manual_observation"
]);
export const EVIDENCE_STRENGTHS = Object.freeze(["low", "medium", "high"]);

const clean = (value, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";

export function createAuditCase(input = {}, now = new Date().toISOString()) {
  const subject = clean(input.subject, 180);
  if (!subject) throw new TypeError("AUDIT_SUBJECT_REQUIRED");
  return Object.freeze({
    schema_version: 1,
    audit_id: clean(input.audit_id, 80) || null,
    status: "draft",
    subject,
    siren: /^\d{9}$/.test(clean(input.siren, 9)) ? clean(input.siren, 9) : "",
    website: clean(input.website, 500),
    territory: clean(input.territory, 160),
    activity: clean(input.activity, 240),
    objectives: Array.isArray(input.objectives) ? input.objectives.map(v => clean(v, 120)).filter(Boolean).slice(0, 12) : [],
    created_at: now,
    updated_at: now,
    evidence_count: 0
  });
}

export function normalizeEvidence(input = {}) {
  const sourceKey = clean(input.source_key, 80);
  const url = clean(input.url, 2000);
  const evidenceType = clean(input.evidence_type, 40);
  const capturedAt = clean(input.captured_at, 40);
  if (!sourceKey || !url || !capturedAt || !EVIDENCE_TYPES.includes(evidenceType)) {
    throw new TypeError("AUDIT_EVIDENCE_INVALID");
  }
  let parsed;
  try { parsed = new URL(url); } catch { throw new TypeError("AUDIT_EVIDENCE_URL_INVALID"); }
  if (!["https:", "http:"].includes(parsed.protocol)) throw new TypeError("AUDIT_EVIDENCE_URL_INVALID");
  const strength = EVIDENCE_STRENGTHS.includes(input.strength) ? input.strength : "low";
  return Object.freeze({
    evidence_id: clean(input.evidence_id, 100) || null,
    source_key: sourceKey,
    source_record_id: clean(input.source_record_id, 160) || null,
    url: parsed.toString(),
    title: clean(input.title, 300),
    excerpt: clean(input.excerpt, 2000),
    evidence_type: evidenceType,
    captured_at: capturedAt,
    subject_match: ["confirmed", "probable", "uncertain", "rejected"].includes(input.subject_match) ? input.subject_match : "uncertain",
    strength,
    limitations: Array.isArray(input.limitations) ? input.limitations.map(v => clean(v, 240)).filter(Boolean).slice(0, 10) : [],
    // Une preuve décrit une observation datée ; elle ne constitue pas à elle seule une conclusion.
    interpretation: null
  });
}

export function toAuditEvidenceDTO(evidence) {
  if (!evidence || typeof evidence !== "object") throw new TypeError("AUDIT_EVIDENCE_INVALID");
  return Object.freeze({
    title: clean(evidence.title, 300) || "Observation documentée",
    excerpt: clean(evidence.excerpt, 2000),
    evidence_type: EVIDENCE_TYPES.includes(evidence.evidence_type) ? evidence.evidence_type : "manual_observation",
    captured_at: clean(evidence.captured_at, 40),
    subject_match: ["confirmed", "probable", "uncertain", "rejected"].includes(evidence.subject_match) ? evidence.subject_match : "uncertain",
    strength: EVIDENCE_STRENGTHS.includes(evidence.strength) ? evidence.strength : "low",
    limitations: Array.isArray(evidence.limitations) ? evidence.limitations.map(v => clean(v, 240)).filter(Boolean).slice(0, 10) : [],
    // Ne jamais transmettre source_key ni source_record_id au navigateur.
    reference: clean(evidence.url, 2000)
  });
}

export function buildAuditReportDraft({ auditCase, evidence = [], generatedAt = new Date().toISOString() } = {}) {
  if (!auditCase?.subject || !Array.isArray(evidence)) throw new TypeError("AUDIT_REPORT_INPUT_INVALID");
  const items = evidence.map(toAuditEvidenceDTO);
  return Object.freeze({
    schema_version: 1,
    status: "draft",
    subject: clean(auditCase.subject, 180),
    generated_at: generatedAt,
    evidence_count: items.length,
    findings: [],
    evidence: items,
    conclusions: [],
    recommendations: [],
    review_required: true,
    notice: "Rapport préparatoire : aucune conclusion ni recommandation n'est générée sans analyse effective et validation humaine."
  });
}
