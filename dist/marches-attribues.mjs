// Marchés publics attribués : règles pures (requêtes, libellés, formats). Données publiques (DECP, Licence Ouverte 2.0).
// Le serveur ne renvoie que des données professionnelles de marchés ; aucune coordonnée.

export const PAGE_SIZE = 10;

/** Grandes familles d'achats, par division du code CPV (deux premiers chiffres). */
export const SECTORS = Object.freeze({
  "45": "Travaux de construction",
  "71": "Architecture, ingénierie, études",
  "50": "Réparation et maintenance",
  "90": "Assainissement, déchets, nettoyage",
  "77": "Espaces verts, agriculture, sylviculture",
  "44": "Matériaux de construction",
  "34": "Véhicules et transport (équipements)",
  "60": "Services de transport",
  "30": "Matériel informatique et de bureau",
  "72": "Services informatiques",
  "79": "Services aux entreprises",
  "80": "Formation et enseignement",
  "85": "Santé et action sociale",
  "55": "Restauration et hébergement",
  "15": "Alimentation et boissons",
  "33": "Équipements médicaux",
  "09": "Énergie et combustibles",
  "39": "Mobilier et équipements ménagers"
});

const KIND_LABELS = Object.freeze({ travaux: "Travaux", services: "Services", fournitures: "Fournitures" });
const DEPARTMENT = /^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/;
const clean = (value) => String(value ?? "").trim();
const page = (value) => Math.max(0, Math.floor(Number(value) || 0));

/** Paramètres de list_awarded_contracts ; une valeur invalide est ignorée plutôt que transmise. */
export function buildContractsRequest({ department = "", query = "", sector = "", minAmount = "", page: p = 0 } = {}) {
  const dep = clean(department).toUpperCase();
  const q = clean(query).slice(0, 80);
  const min = Number(String(minAmount).replace(/\s/g, "").replace(",", "."));
  return {
    p_department: DEPARTMENT.test(dep) ? dep : null,
    p_query: q.length >= 3 ? q : null,
    p_cpv: Object.hasOwn(SECTORS, sector) ? sector : null,
    p_min_amount: Number.isFinite(min) && min > 0 ? Math.min(min, 1e10) : null,
    p_months: 6,
    p_limit: PAGE_SIZE + 1,
    p_offset: page(p) * PAGE_SIZE
  };
}

/** Paramètres de top_awarded_winners. */
export function buildWinnersRequest({ department = "", page: p = 0 } = {}) {
  const dep = clean(department).toUpperCase();
  return { p_department: DEPARTMENT.test(dep) ? dep : null, p_months: 6, p_min_contracts: 2, p_limit: PAGE_SIZE + 1, p_offset: page(p) * PAGE_SIZE };
}

const text = (value, max = 400) => { const t = clean(value); return t ? t.slice(0, max) : ""; };
const int = (value) => (Number.isFinite(Number(value)) && value !== null && value !== "" ? Math.round(Number(value)) : null);
const num = (value) => (value !== null && value !== "" && Number.isFinite(Number(value)) ? Number(value) : null);

/** Garde les seuls champs publics, avec des types sûrs ; ignore toute ligne sans identifiant de marché. */
export function normalizeContracts(rows) {
  if (!Array.isArray(rows)) return { items: [], hasMore: false };
  const items = rows.filter((r) => r && typeof r.contract_uid === "string" && r.contract_uid).slice(0, PAGE_SIZE).map((r) => ({
    uid: r.contract_uid,
    object: text(r.object, 300) || "Objet non précisé",
    awardedOn: text(r.awarded_on, 10),
    kind: Object.hasOwn(KIND_LABELS, r.kind) ? r.kind : "",
    procedure: text(r.procedure, 120),
    cpv: text(r.cpv, 20),
    amount: num(r.amount),
    amountFlag: ["suspect", "aberrant"].includes(r.amount_flag) ? r.amount_flag : "",
    offers: int(r.offers_received),
    durationMonths: int(r.duration_months),
    subcontracting: r.subcontracting_declared === true,
    buyer: text(r.buyer_name, 200),
    buyerCommune: text(r.buyer_commune, 120),
    buyerDept: DEPARTMENT.test(clean(r.buyer_dept)) ? clean(r.buyer_dept) : "",
    winners: text(r.winners, 300) || "Titulaire non précisé",
    winnerCount: Math.max(1, int(r.winner_count) || 1)
  }));
  return { items, hasMore: rows.length > PAGE_SIZE };
}

export function normalizeWinners(rows) {
  if (!Array.isArray(rows)) return { items: [], hasMore: false };
  const items = rows.filter((r) => r && typeof r.winner_id === "string" && r.winner_id).slice(0, PAGE_SIZE).map((r) => ({
    id: r.winner_id,
    name: text(r.winner_name, 200) || "Entreprise non nommée",
    category: ["PME", "ETI", "GE"].includes(r.winner_category) ? r.winner_category : "",
    commune: text(r.winner_commune, 120),
    dept: DEPARTMENT.test(clean(r.winner_dept)) ? clean(r.winner_dept) : "",
    contracts: Math.max(0, int(r.contracts) || 0),
    medianAmount: num(r.median_amount)
  }));
  return { items, hasMore: rows.length > PAGE_SIZE };
}

export const kindLabel = (kind) => KIND_LABELS[kind] || "";

export function formatAmount(value) {
  const n = num(value);
  if (n === null) return "Montant non communiqué";
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) + " € HT";
}

export function formatDateFr(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(clean(iso));
  return m ? m[3] + "/" + m[2] + "/" + m[1] : "";
}

/** Phrase de transparence : période couverte et date du dernier chargement. */
export function metaSummary(rows) {
  const m = Array.isArray(rows) ? rows[0] : null;
  if (!m || !Number(m.contracts)) return { loaded: false, text: "Les marchés attribués ne sont pas encore chargés sur cette version de test." };
  const fr = new Intl.NumberFormat("fr-FR");
  return { loaded: true, text: fr.format(Number(m.contracts)) + " marchés attribués et " + fr.format(Number(m.winners)) + " entreprises titulaires, du " + formatDateFr(m.oldest) + " au " + formatDateFr(m.newest) + ". Dernier chargement le " + formatDateFr(m.loaded_at) + "." };
}
