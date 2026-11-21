// Publication d'une annonce par le propriétaire (administration) — miroir des contrôles de publish_announcement_admin.
// Le serveur reste l'autorité : réservé au propriétaire.
import { KINDS } from "./annonces-formulaire.mjs";

const DEPARTMENT = /^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/;
const clean = (value) => String(value ?? "").trim();

export function validateAdminPublication(input = {}, { today = new Date() } = {}) {
  const f = {
    kind: clean(input.kind), title: clean(input.title), description: clean(input.description), trade: clean(input.trade),
    department: clean(input.department).toUpperCase(), area_note: clean(input.area_note), valid_until: clean(input.valid_until),
    company: clean(input.company), source_url: clean(input.source_url)
  };
  const errors = {};
  if (!KINDS.some(([value]) => value === f.kind)) errors.kind = "Choisissez le type d’annonce.";
  if (f.title.length < 8 || f.title.length > 120) errors.title = "Le titre doit faire entre 8 et 120 caractères.";
  if (f.description.length < 30 || f.description.length > 2000) errors.description = "La description doit faire entre 30 et 2000 caractères.";
  if (f.trade.length < 2 || f.trade.length > 80) errors.trade = "Indiquez le métier ou le domaine (2 à 80 caractères).";
  if (f.department && !DEPARTMENT.test(f.department)) errors.department = "Département inconnu (exemples : 35, 2A, 971).";
  if (f.area_note.length > 200) errors.area_note = "La précision de zone est limitée à 200 caractères.";
  if (f.company && (f.company.length < 2 || f.company.length > 120)) errors.company = "Nom d’entreprise : 2 à 120 caractères.";
  if (f.source_url.length > 500) errors.source_url = "Lien trop long (500 caractères maximum).";
  if (f.valid_until) {
    const date = Date.parse(f.valid_until + "T00:00:00Z");
    const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    if (Number.isNaN(date) || date < start || date > start + 365 * 86400000) errors.valid_until = "Choisissez une date entre aujourd’hui et un an.";
  }
  return {
    ok: Object.keys(errors).length === 0,
    errors,
    payload: {
      p_kind: f.kind, p_title: f.title, p_description: f.description, p_trade: f.trade, p_department: f.department || null,
      p_area_note: f.area_note || null, p_valid_until: f.valid_until || null, p_company: f.company || null, p_source_url: f.source_url || null
    }
  };
}

export function adminPublicationError(error) {
  const text = String(error?.message || error || "");
  if (text.includes("forbidden")) return "Seul le propriétaire peut publier une annonce depuis l’administration.";
  if (text.includes("account_required")) return "Reconnectez-vous pour publier.";
  if (text.includes("invalid_")) return "Un champ n’est pas valide. Vérifiez le formulaire.";
  return "La publication n’a pas abouti. Réessayez.";
}
