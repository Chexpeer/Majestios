// Liste publique « Appels d'offres privés » : règles pures (requêtes, libellés, validation d'une demande de mise en relation).
// Aucune coordonnée d'auteur n'existe côté public : le serveur ne les renvoie jamais.

export const PAGE_SIZE = 10;

export const KIND_LABELS = Object.freeze({
  subcontract_need: "Recherche de sous-traitant",
  subcontract_offer: "Offre de services en sous-traitance",
  job_offer: "Offre d’emploi",
  job_seeker: "Demande d’emploi",
  equipment_offer: "Location de matériel",
  equipment_wanted: "Recherche de matériel à louer",
  other_offer: "Autre offre",
  other_request: "Autre demande"
});

const DEPARTMENT = /^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const clean = (value) => String(value ?? "").trim();

/** Paramètres de list_published_announcements ; une valeur invalide est ignorée plutôt que transmise. */
export function buildListRequest({ kind = "", department = "", page = 0 } = {}) {
  const dep = clean(department).toUpperCase();
  return {
    p_kind: Object.hasOwn(KIND_LABELS, kind) ? kind : null,
    p_department: DEPARTMENT.test(dep) ? dep : null,
    p_limit: PAGE_SIZE + 1,
    p_offset: Math.max(0, Math.floor(Number(page) || 0)) * PAGE_SIZE
  };
}

/** Garde les seuls champs publics, avec des types sûrs ; ignore toute ligne sans référence. */
export function normalizeAnnouncements(rows) {
  if (!Array.isArray(rows)) return { items: [], hasMore: false };
  const items = rows
    .filter((row) => row && typeof row.reference === "string" && /^AN-[A-Z0-9]{8}$/.test(row.reference))
    .map((row) => ({
      reference: row.reference,
      kind: Object.hasOwn(KIND_LABELS, row.kind) ? row.kind : "subcontract_need",
      title: clean(row.title),
      description: clean(row.description),
      trade: clean(row.trade),
      department: clean(row.department),
      areaNote: clean(row.area_note),
      validUntil: clean(row.valid_until),
      publishedAt: clean(row.published_at),
      company: clean(row.company)
    }));
  return { items: items.slice(0, PAGE_SIZE), hasMore: items.length > PAGE_SIZE };
}

export function formatDateFr(value) {
  const time = Date.parse(value);
  if (Number.isNaN(time)) return "";
  return new Date(time).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function placeLabel(item) {
  return [item.department && "Département " + item.department, item.areaNote].filter(Boolean).join(" · ");
}

/** Validation d'une demande de mise en relation (miroir de request_announcement_introduction). */
export function validateIntroduction(input = {}) {
  const f = { name: clean(input.name), email: clean(input.email).toLowerCase(), message: clean(input.message), consent: input.consent === true || input.consent === "on", website: clean(input.website) };
  const errors = {};
  if (f.name.length < 2 || f.name.length > 120) errors.name = "Indiquez votre nom (2 à 120 caractères).";
  if (!EMAIL.test(f.email) || f.email.length > 254) errors.email = "Adresse e-mail invalide.";
  if (f.message.length < 20 || f.message.length > 1000) errors.message = "Le message doit faire entre 20 et 1000 caractères.";
  if (!f.consent) errors.consent = "Vous devez accepter le traitement de votre demande.";
  return { ok: Object.keys(errors).length === 0, errors, payload: { p_name: f.name, p_email: f.email, p_message: f.message, p_consent: f.consent, p_website: f.website || null } };
}

export function introductionError(error) {
  const text = String(error?.message || error || "");
  if (text.includes("announcement_not_available")) return "Cette annonce n’est plus disponible.";
  if (text.includes("rate_limited")) return "Trop de demandes récentes depuis cette connexion. Réessayez demain.";
  return "La demande n’a pas pu être envoyée. Réessayez plus tard.";
}
