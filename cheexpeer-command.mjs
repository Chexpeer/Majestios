// Logique pure du centre de commande Cheexpeer (testable sans navigateur).
// Les trois API serveur existent sur MajestiOS-Test : soumission, décision d'approbation, lecture.
export const MISSION_TYPE = "readiness_probe";

export const STATUS_LABELS = Object.freeze({
  queued: "En file d'attente", pending_approval: "En attente de validation", approved: "Approuvée",
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
  RESULT_TOO_LARGE: "Le résultat est trop volumineux pour être affiché."
});
export const errorMessage = (code) => ERROR_LABELS[code] || "Une erreur inattendue est survenue. Rien n'a été modifié.";
export const statusLabel = (s) => STATUS_LABELS[s] || "Statut à vérifier";

const FUNCTIONS = Object.freeze({ submit: "cheexpeer-mission-submit", decision: "cheexpeer-approval-decision", read: "cheexpeer-mission-read" });
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
