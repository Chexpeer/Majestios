// Logique pure du centre de commande Cheexpeer (testable sans navigateur).
// Les trois API serveur existent sur MajestiOS-Test : soumission, décision d'approbation, lecture.
export const MISSION_TYPE = "readiness_probe";
export const MISSION_TYPE_PROSPECTS = "prospects_sous_traitance";
export const MISSION_TYPE_ANALYSE = "analyse_marche";
export const MISSION_TYPE_OPPORTUNITE = "opportunite_attribution";
export const MAX_RECHERCHES = 6;

export const STATUS_LABELS = Object.freeze({
  queued: "Validée · prête à lancer", awaiting_approval: "En attente de validation", retry_wait: "Nouvel essai prévu", blocked: "Bloquée", pending_approval: "En attente de validation", approved: "Approuvée",
  running: "En cours", succeeded: "Terminée", failed: "Échec", cancelled: "Annulée", rejected: "Refusée", expired: "Expirée"
});
export const APPROVAL_LABELS = Object.freeze({ pending: "À décider", approved: "Approuvée", rejected: "Refusée", expired: "Expirée" });

export const ERROR_LABELS = Object.freeze({
  AUTH_REQUIRED: "Votre session a expiré. Reconnectez-vous.",
  ACCESS_DENIED: "Accès refusé : cette page est réservée aux propriétaires et administrateurs internes.",
  INVALID_PAYLOAD: "La demande est incomplète ou invalide.",
  INVALID_JSON: "La demande est illisible.",
  PAYLOAD_TOO_LARGE: "La demande est trop volumineuse.",
  METHOD_NOT_ALLOWED: "Méthode non autorisée.",
  SERVICE_UNAVAILABLE: "Le service Cheexpeer n'est pas disponible pour le moment.",
  MISSION_SUBMISSION_FAILED: "La mission n'a pas pu être créée. Le diagnostic n'est probablement pas encore activé.",
  MISSION_READ_FAILED: "La lecture de la mission a échoué.",
  MISSION_NOT_FOUND: "Mission introuvable dans votre organisation.",
  MISSION_RUN_FAILED: "L'exécution n'a pas pu démarrer. Réessayez dans un instant.",
  RESULT_TOO_LARGE: "Le résultat est trop volumineux pour être affiché."
});
export const errorMessage = (code) => ERROR_LABELS[code] || "Une erreur inattendue est survenue. Rien n'a été modifié.";
export const statusLabel = (s) => STATUS_LABELS[s] || "Statut à vérifier";

const FUNCTIONS = Object.freeze({ submit: "cheexpeer-mission-submit", decision: "cheexpeer-approval-decision", read: "cheexpeer-mission-read", chat: "cheexpeer-chat", run: "cheexpeer-mission-run" });
export const functionUrl = (baseUrl, key) => {
  if (!FUNCTIONS[key]) throw new Error("Fonction inconnue");
  return `${String(baseUrl).replace(/\/+$/, "")}/functions/v1/${FUNCTIONS[key]}`;
};

export function buildSubmitPayload({ organizationId, title, objective, idempotencyKey }) {
  const t = String(title ?? "").trim().slice(0, 200);
  if (!t) return null;
  const payload = { organization_id: organizationId, mission_type: MISSION_TYPE, title: t, autonomy_level: 0, requires_approval: true, idempotency_key: idempotencyKey };
  const o = String(objective ?? "").trim();
  if (o) payload.objective = o.slice(0, 4000);
  return payload;
}
/** Demande de mission « prospects de sous-traitance » : validation humaine toujours exigée, aucun effet externe. */
export function buildProspectsPayload({ organizationId, naf, departement, limite, gagnantNom, gagnantSiren, marcheObjet, communeChantier, idempotencyKey }) {
  const n = String(naf ?? "").trim().toUpperCase().replace(/\s/g, "");
  const code = /^\d{4}[A-Z]$/.test(n) ? n.slice(0, 2) + "." + n.slice(2) : n;
  const dept = String(departement ?? "").trim().toUpperCase();
  const lim = Number(limite);
  if (!/^\d{2}\.\d{2}[A-Z]$/.test(code) || !/^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/.test(dept) || !Number.isInteger(lim) || (lim !== 0 && (lim < 20 || lim > 30))) return null;
  const input = { naf: code, departement: dept, limite: lim };
  const siren = String(gagnantSiren ?? "").replace(/\s/g, "");
  if (siren) { if (!/^\d{9}$/.test(siren)) return null; input.gagnant_siren = siren; }
  const nom = String(gagnantNom ?? "").trim(); if (nom) input.gagnant_nom = nom.slice(0, 120);
  const objet = String(marcheObjet ?? "").trim(); if (objet) input.marche_objet = objet.slice(0, 200);
  const commune = String(communeChantier ?? "").replace(/\s+/g, " ").trim(); if (commune) input.commune_chantier = commune.slice(0, 80);
  return { organization_id: organizationId, mission_type: MISSION_TYPE_PROSPECTS, title: `Prospects de sous-traitance · ${code} · dép. ${dept}`, autonomy_level: 0, requires_approval: true, input, idempotency_key: idempotencyKey };
}

/** Demande de mission « analyse d'un appel d'offres » : seul l'identifiant de l'avis BOAMP est envoyé. */
export function buildAnalysePayload({ organizationId, idweb, idempotencyKey }) {
  const id = String(idweb ?? "").trim();
  if (!/^\d{2}-\d{1,8}$/.test(id)) return null;
  return { organization_id: organizationId, mission_type: MISSION_TYPE_ANALYSE, title: `Analyse de l'avis BOAMP ${id}`, autonomy_level: 0, requires_approval: true, input: { idweb: id }, idempotency_key: idempotencyKey };
}
/** Demande de mission « opportunités après attribution » : seul l'identifiant du marché attribué est envoyé. */
export function buildOpportunitePayload({ organizationId, contractUid, label, idempotencyKey }) {
  const uid = String(contractUid ?? "").trim();
  if (!/^[A-Za-z0-9_.\-]{5,160}$/.test(uid)) return null;
  const short = String(label ?? "").replace(/\s+/g, " ").trim().slice(0, 90);
  return { organization_id: organizationId, mission_type: MISSION_TYPE_OPPORTUNITE, title: `Opportunités après attribution${short ? " · " + short : ""}`.slice(0, 200), autonomy_level: 0, requires_approval: true, input: { contract_uid: uid }, idempotency_key: idempotencyKey };
}
/**
 * Transforme les codes NAF cochés par l'administrateur × les départements retenus en demandes « prospects ».
 * Jamais plus de MAX_RECHERCHES demandes d'un coup ; chaque demande reste soumise à validation humaine.
 */
export function buildProspectsFromAnalysis({ organizationId, nafs, departements, marcheObjet, communeChantier, limite = 20, newKey }) {
  const codes = [...new Set(nafs ?? [])], depts = [...new Set(departements ?? [])];
  if (!codes.length || !depts.length) return { ok: false, message: "Cochez au moins un code NAF et un département." };
  if (codes.length * depts.length > MAX_RECHERCHES) return { ok: false, message: `Trop de recherches d'un coup (${codes.length * depts.length}). Maximum : ${MAX_RECHERCHES}. Décochez quelques codes ou départements.` };
  const bodies = [];
  for (const naf of codes) for (const departement of depts) {
    const b = buildProspectsPayload({ organizationId, naf, departement, limite, marcheObjet, communeChantier, idempotencyKey: newKey() });
    if (!b) return { ok: false, message: `Code ou département invalide : ${naf} / ${departement}.` };
    bodies.push(b);
  }
  return { ok: true, bodies };
}

const CSV_COLUMNS = Object.freeze([
  ["Entreprise", "nom"], ["SIREN", "siren"], ["SIRET (établissement)", "siret"], ["Établissement", "etablissement"], ["RGE", "rge"], ["Code NAF", "naf"], ["Adresse", "adresse"], ["Code postal", "code_postal"], ["Commune", "commune"],
  ["Département", "departement"], ["Zone", "zone"], ["Effectif (tranche)", "effectif"], ["Latitude", "latitude"], ["Longitude", "longitude"],
  ["Téléphone", "telephone"], ["E-mail", "email"], ["Google Maps", "google_maps"], ["Source", "source"], ["Lien source", "source_url"], ["Collecté le", "collecte_le"]
]);
// Protège contre l'exécution de formules à l'ouverture dans un tableur (=, +, -, @).
const csvCell = (value) => {
  let t = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(t)) t = "'" + t;
  return /[;"\r\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
};
/** CSV lisible par Excel (séparateur « ; », UTF-8 avec BOM) et importable dans Google Sheets. */
const SCORE_COLUMNS = Object.freeze([["Note /20 (provisoire)", "score_note"], ["Preuve %", "score_preuve"], ["Étiquette", "score_etiquette"], ["Distance du chantier (km, à vol d'oiseau)", "distance_km"]]);
export function prospectsToCsv(companies) {
  const list = Array.isArray(companies) ? companies : [];
  const cols = list.some((c) => c?.score) ? [...SCORE_COLUMNS, ...CSV_COLUMNS] : CSV_COLUMNS;
  const rows = [cols.map(([label]) => csvCell(label)).join(";")];
  for (const c of list) rows.push(cols.map(([, key]) => csvCell(key === "score_note" ? c?.score?.note : key === "score_preuve" ? c?.score?.preuve : key === "score_etiquette" ? c?.score?.etiquette : c?.[key])).join(";"));
  return "\uFEFF" + rows.join("\r\n") + "\r\n";
}
export const prospectsFilename = (criteres, now = new Date()) => `prospects-sous-traitance-${String(criteres?.naf ?? "naf").replace(".", "")}-dep${criteres?.departement ?? "xx"}-${now.toISOString().slice(0, 10)}.csv`;

export const buildDecisionPayload = ({ organizationId, approvalId, decision, note }) => {
  if (!["approved", "rejected"].includes(decision)) return null;
  const p = { organization_id: organizationId, approval_id: approvalId, decision };
  const n = String(note ?? "").trim();
  if (n) p.decision_note = n.slice(0, 2000);
  return p;
};

// Appelle une API avec le jeton de session ; renvoie { ok, status, data, message }.
export async function callApi(fetchImpl, { baseUrl, key, token, body }) {
  let response;
  try {
    response = await fetchImpl(functionUrl(baseUrl, key), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
  } catch {
    return { ok: false, status: 0, data: null, message: "Le service est injoignable. Vérifiez votre connexion." };
  }
  let data = null;
  try { data = await response.json(); } catch { /* corps vide */ }
  if (response.ok && data?.ok !== false) return { ok: true, status: response.status, data, message: "" };
  return { ok: false, status: response.status, data, message: errorMessage(data?.error) };
}
