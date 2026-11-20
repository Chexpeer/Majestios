// Relecture des annonces : règles pures (libellés, validation d'une décision, messages d'erreur du serveur).
// Le contrôle d'accès réel est côté serveur (moderation_queue / moderate_announcement) ; ces règles guident l'écran.

export const TABS = Object.freeze([
  ["pending", "À relire"],
  ["published", "Publiées"],
  ["rejected", "Refusées"],
  ["withdrawn", "Retirées"],
  ["expired", "Expirées"]
]);

export const KIND_LABELS = Object.freeze({ subcontract_need: "Recherche de sous-traitant", subcontract_offer: "Offre de services", job_offer: "Offre d’emploi", job_seeker: "Demande d’emploi", equipment_offer: "Location de matériel", equipment_wanted: "Recherche de matériel à louer", real_estate_offer: "Offre immobilière", real_estate_wanted: "Recherche immobilière", business_sale: "Cession d’entreprise", business_wanted: "Recherche de reprise d’entreprise", other_offer: "Autre offre", other_request: "Autre demande" });

export const isKnownStatus = (status) => TABS.some(([value]) => value === status);

/** Décisions autorisées selon l'état de l'annonce. */
export function allowedDecisions(status) {
  if (status === "pending") return ["publish", "reject"];
  if (status === "published") return ["withdraw"];
  return [];
}

/** Valide une décision et prépare les paramètres de moderate_announcement. */
export function buildDecision({ id, status, decision, note = "", title = "", description = "", original = {} }) {
  const errors = [];
  if (!id) errors.push("Annonce inconnue.");
  if (!allowedDecisions(status).includes(decision)) errors.push("Décision impossible pour une annonce « " + status + " ».");
  const cleanNote = String(note).trim();
  if (decision === "reject" && !cleanNote) errors.push("Un motif est obligatoire pour refuser une annonce.");
  if (cleanNote.length > 500) errors.push("Le motif est limité à 500 caractères.");
  const t = String(title).trim();
  const d = String(description).trim();
  if (decision === "publish") {
    if (t.length < 8 || t.length > 120) errors.push("Le titre doit faire entre 8 et 120 caractères.");
    if (d.length < 30 || d.length > 2000) errors.push("La description doit faire entre 30 et 2000 caractères.");
  }
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    params: {
      p_id: id, p_decision: decision, p_note: cleanNote || null,
      // Le texte n'est transmis que s'il a été corrigé : le journal garde alors une trace « Texte corrigé ».
      p_title: decision === "publish" && t !== String(original.title ?? "").trim() ? t : null,
      p_description: decision === "publish" && d !== String(original.description ?? "").trim() ? d : null
    }
  };
}

export function moderationError(error) {
  const text = String(error?.message || error?.code || error || "");
  if (text.includes("forbidden") || text.includes("42501")) return "Ce compte n’est pas autorisé à relire les annonces (propriétaire ou administrateur interne requis).";
  if (text.includes("not_pending")) return "Cette annonce n’est plus à relire : elle a déjà été traitée.";
  if (text.includes("note_required")) return "Un motif est obligatoire pour refuser une annonce.";
  if (text.includes("not_found")) return "Annonce introuvable.";
  return "L’opération n’a pas pu être enregistrée. Réessayez.";
}

export const DECISION_LABELS = Object.freeze({ publish: "Annonce publiée.", reject: "Annonce refusée.", withdraw: "Annonce retirée." });
