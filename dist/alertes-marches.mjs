// Alertes « marché gagné » : règles pures (libellé, filtres, comptage des nouveautés). Le stockage est dans public.contract_alerts (droits par membre).
import { SECTORS } from "./marches-attribues.mjs";

export const MAX_ALERTES = 5;
const clean = (v) => String(v ?? "").trim();

/** Alerte à enregistrer à partir des filtres de la page ; null si aucun critère n'est renseigné. */
export function buildAlertFromFilters({ department = "", query = "", sector = "", minAmount = "" } = {}) {
  const dep = clean(department).toUpperCase();
  const q = clean(query).slice(0, 80);
  const min = Number(String(minAmount).replace(/\s/g, "").replace(",", "."));
  const alert = {
    department: /^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/.test(dep) ? dep : null,
    cpv: Object.hasOwn(SECTORS, sector) ? sector : null,
    query: q.length >= 3 ? q : null,
    min_amount: Number.isFinite(min) && min > 0 ? Math.min(min, 1e10) : null
  };
  if (!alert.department && !alert.cpv && !alert.query && !alert.min_amount) return null;
  return { ...alert, label: alertLabel(alert) };
}

export function alertLabel(a) {
  const parts = [];
  if (a.cpv) parts.push(SECTORS[a.cpv]);
  if (a.department) parts.push("dép. " + a.department);
  if (a.query) parts.push("« " + a.query + " »");
  if (a.min_amount) parts.push("dès " + new Intl.NumberFormat("fr-FR").format(a.min_amount) + " €");
  return parts.join(" · ").slice(0, 120) || "Toute la France";
}

/** Paramètres de list_awarded_contracts pour une alerte. */
export function alertRequest(a) {
  return { p_department: a.department || null, p_query: a.query || null, p_cpv: a.cpv || null, p_min_amount: a.min_amount ?? null, p_months: 6, p_limit: 40, p_offset: 0 };
}

/** Valeurs à remettre dans le formulaire pour « Voir » une alerte. */
export function alertToFormValues(a) {
  return { department: a.department || "", query: a.query || "", sector: a.cpv || "", minAmount: a.min_amount ? String(a.min_amount) : "" };
}

/** Nombre de marchés notifiés après la dernière consultation (dates AAAA-MM-JJ). */
export function countNew(rows, lastSeenOn) {
  const seen = clean(lastSeenOn);
  return (Array.isArray(rows) ? rows : []).filter((r) => r && typeof r.awarded_on === "string" && r.awarded_on > seen).length;
}
