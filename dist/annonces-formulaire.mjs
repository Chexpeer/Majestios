// Règles du formulaire de dépôt d'annonce — miroir des contrôles du serveur (submit_announcement) pour guider la saisie.
// Le serveur reste l'autorité : ces règles ne protègent rien à elles seules.

export const KINDS = Object.freeze([
  ["subcontract_need", "Sous-traitance : je cherche un sous-traitant"],
  ["subcontract_offer", "Sous-traitance : je propose mes services"],
  ["job_offer", "Emploi : je propose un poste"],
  ["job_seeker", "Emploi : je cherche un poste"],
  ["equipment_offer", "Matériel : je loue du matériel (ex. BTP)"],
  ["equipment_wanted", "Matériel : je cherche du matériel à louer"],
  ["real_estate_offer", "Immobilier : je propose un bien ou un local"],
  ["real_estate_wanted", "Immobilier : je cherche un bien ou un local"],
  ["business_sale", "Entreprise : je cède mon entreprise"],
  ["business_wanted", "Entreprise : je cherche à reprendre une entreprise"],
  ["other_offer", "Autre : je propose"],
  ["other_request", "Autre : je recherche"]
]);

const DEPARTMENT = /^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const CONTACT_IN_TEXT = /(https?:\/\/|www\.|[^@\s]+@[^@\s]+\.[a-z]{2,}|(\+33|0)[1-9]([ .-]?[0-9]{2}){4})/i;

const clean = (value) => String(value ?? "").trim();

/** Retourne { ok, errors:{champ:message}, payload } ; payload suit les paramètres de submit_announcement. */
export function validateAnnouncement(input = {}, { today = new Date() } = {}) {
  const f = {
    kind: clean(input.kind), title: clean(input.title), description: clean(input.description), trade: clean(input.trade),
    department: clean(input.department).toUpperCase(), area_note: clean(input.area_note), valid_until: clean(input.valid_until),
    contact_name: clean(input.contact_name), email: clean(input.email).toLowerCase(), phone: clean(input.phone),
    consent: input.consent === true || input.consent === "on", website: clean(input.website)
  };
  const errors = {};
  if (!KINDS.some(([value]) => value === f.kind)) errors.kind = "Choisissez le type d’annonce.";
  if (f.title.length < 8 || f.title.length > 120) errors.title = "Le titre doit faire entre 8 et 120 caractères.";
  if (f.description.length < 30 || f.description.length > 2000) errors.description = "La description doit faire entre 30 et 2000 caractères.";
  if (f.trade.length < 2 || f.trade.length > 80) errors.trade = "Indiquez le domaine, le métier ou le matériel (2 à 80 caractères).";
  if (f.department && !DEPARTMENT.test(f.department)) errors.department = "Département inconnu (exemples : 35, 2A, 971).";
  if (f.area_note.length > 200) errors.area_note = "La précision de zone est limitée à 200 caractères.";
  if (f.contact_name.length < 2 || f.contact_name.length > 120) errors.contact_name = "Indiquez votre nom (2 à 120 caractères).";
  if (f.phone.length > 30) errors.phone = "Numéro trop long.";
  if (f.valid_until) {
    const date = Date.parse(f.valid_until + "T00:00:00Z");
    const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    if (Number.isNaN(date) || date < start || date > start + 365 * 86400000) errors.valid_until = "Choisissez une date entre aujourd’hui et un an.";
  }
  if (!errors.title && !errors.description && CONTACT_IN_TEXT.test([f.title, f.description, f.area_note].join(" "))) {
    errors.description = "Ne mettez ni lien, ni adresse e-mail, ni numéro de téléphone dans le texte : les mises en relation passent par MajestiOS.";
  }
  if (!f.consent) errors.consent = "Vous devez accepter le traitement de votre demande pour déposer l’annonce.";
  return {
    ok: Object.keys(errors).length === 0,
    errors,
    payload: {
      p_kind: f.kind, p_title: f.title, p_description: f.description, p_trade: f.trade, p_department: f.department || null,
      p_area_note: f.area_note || null, p_valid_until: f.valid_until || null, p_contact_name: f.contact_name, p_email: "",
      p_phone: f.phone || null, p_consent: f.consent, p_website: f.website || null
    }
  };
}

export const SERVER_MESSAGES = Object.freeze({
  account_required: "Pour déposer une annonce, créez votre espace personnel ou connectez-vous.",
  rate_limited: "Trop de dépôts récents depuis cette connexion. Réessayez demain.",
  queue_full: "La file de relecture est momentanément pleine. Réessayez plus tard.",
  contact_in_text: "Retirez les liens et coordonnées du texte de l’annonce.",
  consent_required: "Le consentement est nécessaire.",
  invalid_email: "Adresse e-mail invalide."
});

export function serverMessage(error) {
  const text = String(error?.message || error || "");
  for (const [code, message] of Object.entries(SERVER_MESSAGES)) if (text.includes(code)) return message;
  return "Le dépôt n’a pas pu être enregistré. Réessayez plus tard ou utilisez le formulaire de contact.";
}
