// Mission Cheexpeer n°5 « score » : règles pures, déterministes, sans IA générative, lecture seule.
// Deux indicateurs séparés (grille du 22/11/2026) : note d'adéquation sur 20 + niveau de preuve en %.
// Le score CLASSE, il n'EXCLUT personne. Une information absente n'est jamais une preuve d'incapacité.
// Poids et seuils provisoires : à ajuster sur des cas réels (docs/evolution-12/FICHES-MISSIONS-CHEEXPEER-2026-11-22.md, mission 5).
export const SCORE_METHOD_VERSION = "1.0-provisoire";
export const POIDS = Object.freeze({ metier: 5, qualifications: 4, references: 4, financiere: 3, operationnelle: 2, proximite: 3 });
/** Paliers de distance (km) : défaut 25 / 50 / 100 ; désamiantage jusqu'à 200 km (décision du 23 novembre 2026). Provisoires, par métier. */
export const PALIERS_DEFAUT = Object.freeze({ max: 25, eleve: 50, moyen: 100 });
export const PALIERS_ETENDUS = Object.freeze({ max: 50, eleve: 100, moyen: 200 });
const NAF_DESAMIANTAGE = new Set(["39.00Z", "43.11Z"]);
export const paliersPourNafs = (nafs) => ((nafs ?? []).some((n) => NAF_DESAMIANTAGE.has(n)) ? PALIERS_ETENDUS : PALIERS_DEFAUT);
export const SEUILS = Object.freeze({ tres_bon_note: 16, tres_bon_preuve: 70, plafond_dossier_incomplet: 8, ratio_ok: 40000, ratio_limite: 100000, km_max: 25, km_eleve: 50, km_moyen: 100 });
const R_TERRE_KM = 6371;
const rad = (d) => (d * Math.PI) / 180;
/** Distance à vol d'oiseau en km (formule de haversine) ; null si un point est incomplet. */
export function distanceKm(a, b) {
  const num = (v) => (v === null || v === undefined || v === "" ? NaN : Number(v));
  const ok = (p) => p && Number.isFinite(num(p.lat)) && Number.isFinite(num(p.lon)) && !(num(p.lat) === 0 && num(p.lon) === 0);
  if (!ok(a) || !ok(b)) return null;
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R_TERRE_KM * Math.asin(Math.sqrt(h)) * 10) / 10;
}
export const ETATS = Object.freeze(["confirmé", "partiellement confirmé", "non prouvé", "contradictoire", "non applicable"]);
const LIBELLES = Object.freeze({ metier: "Adéquation au métier", qualifications: "Qualifications et exigences techniques", references: "Références et expériences vérifiables", financiere: "Capacité financière documentée", operationnelle: "Capacité opérationnelle", proximite: "Proximité géographique" });
const TRANCHES = Object.freeze({ "00": 0, "01": 1.5, "02": 4, "03": 7.5, 11: 15, 12: 35, 21: 75, 22: 150, 31: 225, 32: 375, 41: 750, 42: 1500, 51: 3500, 52: 7500, 53: 10000 });

const crit = (cle, points, etat, detail, source) => ({ cle, libelle: LIBELLES[cle], max: POIDS[cle], points, etat, detail, source });

/** Entreprises écartées d'office : radiées, en liquidation, non diffusables. */
export function estEcartee(c) {
  if (!c || typeof c !== "object") return "données absentes";
  if (c.radiee === true || (c.etat_administratif && c.etat_administratif !== "A")) return "entreprise radiée";
  if (c.en_liquidation === true) return "entreprise en liquidation";
  if (c.non_diffusable === true) return "entreprise non diffusable";
  return null;
}

function critMetier(c, ctx) {
  const cibles = [...new Set((ctx.nafs ?? []).filter(Boolean))];
  if (!c.naf || !cibles.length) return crit("metier", 0, "non prouvé", "Code NAF de l'entreprise ou du marché inconnu.", "annuaire officiel");
  if (cibles.includes(c.naf)) return crit("metier", POIDS.metier, "confirmé", `Code NAF ${c.naf} identique au métier recherché.`, "annuaire officiel");
  if (cibles.some((n) => n.slice(0, 4) === c.naf.slice(0, 4))) return crit("metier", 2, "partiellement confirmé", `Code NAF ${c.naf} proche du métier recherché (même groupe).`, "annuaire officiel");
  return crit("metier", 0, "contradictoire", `Code NAF ${c.naf} différent du métier recherché.`, "annuaire officiel");
}

function critQualifications(c, ctx) {
  const ex = ctx.exigences;
  const rgeRequis = !!ex && Array.isArray(ex.obligatoires) && ex.obligatoires.includes("rge");
  if (rgeRequis) {
    return c.rge ? crit("qualifications", POIDS.qualifications, "confirmé", "Qualification RGE demandée et présente dans l'annuaire.", "annuaire officiel (RGE)")
      : crit("qualifications", 0, "non prouvé", "RGE demandée, non trouvée dans l'annuaire. Les autres qualifications (Qualibat…) ne sont pas encore vérifiables.", "annuaire officiel (RGE)");
  }
  if (c.rge) return crit("qualifications", 2, "partiellement confirmé", "Qualification RGE présente (atout) ; aucune exigence connue à comparer.", "annuaire officiel (RGE)");
  return crit("qualifications", 0, "non applicable", "Aucune qualification exigée connue : critère neutralisé.", null);
}

function critReferences(c, ctx) {
  const n = ctx.references?.[c.siren];
  if (typeof n !== "number") return crit("references", 0, "non prouvé", "Marchés comparables déjà remportés : donnée non branchée.", null);
  if (n >= 3) return crit("references", POIDS.references, "confirmé", `${n} marchés publics comparables remportés (DECP).`, "DECP");
  if (n >= 1) return crit("references", 2, "partiellement confirmé", `${n} marché(s) public(s) comparable(s) remporté(s) (DECP).`, "DECP");
  return crit("references", 0, "non prouvé", "Aucun marché public comparable trouvé (ne prouve pas l'absence d'expérience privée).", "DECP");
}

function critFinanciere(c, ctx) {
  const t = Date.parse(c.creation ?? "");
  if (!Number.isFinite(t)) return crit("financiere", 0, "non prouvé", "Date de création inconnue ; comptes non branchés.", null);
  const ans = (new Date(ctx.now ?? Date.now()).getTime() - t) / 31557600000;
  if (ans >= 5) return crit("financiere", 2, "partiellement confirmé", `Entreprise créée depuis ${Math.floor(ans)} ans ; comptes et procédures collectives non vérifiés.`, "annuaire officiel");
  if (ans >= 2) return crit("financiere", 1, "partiellement confirmé", `Entreprise créée depuis ${Math.floor(ans)} ans ; comptes non vérifiés.`, "annuaire officiel");
  return crit("financiere", 0, "partiellement confirmé", "Entreprise récente (moins de 2 ans) ; comptes non vérifiés.", "annuaire officiel");
}

function critOperationnelle(c, ctx) {
  const montant = Number(ctx.montantAnnuel);
  if (!Number.isFinite(montant) || montant <= 0) return crit("operationnelle", 0, "non applicable", "Montant du marché inconnu : critère neutralisé.", null);
  const eff = TRANCHES[String(c.effectif ?? "")];
  if (!eff) return crit("operationnelle", 0, "non prouvé", "Effectif inconnu.", null);
  const ratio = Math.round(montant / eff);
  const pts = ratio <= SEUILS.ratio_ok ? 2 : ratio <= SEUILS.ratio_limite ? 1 : 0;
  return crit("operationnelle", pts, "partiellement confirmé", `Marché ≈ ${ratio.toLocaleString("fr-FR")} € par salarié et par an (effectif estimé au milieu de la tranche).`, "annuaire officiel");
}

function critProximite(c, ctx) {
  const pt = ctx.chantier;
  const km = pt ? distanceKm({ lat: pt.lat, lon: pt.lon }, { lat: c.latitude, lon: c.longitude }) : null;
  if (km !== null) {
    const pal = paliersPourNafs(ctx.nafs);
    const pts = km <= pal.max ? POIDS.proximite : km <= pal.eleve ? 2.5 : km <= pal.moyen ? 1.5 : 0;
    const gagn = ctx.gagnantKm === undefined || ctx.gagnantKm === null ? "" : km < ctx.gagnantKm ? ` Plus proche du chantier que l'entreprise gagnante (${ctx.gagnantKm} km).` : ` L'entreprise gagnante est à ${ctx.gagnantKm} km du chantier.`;
    const etat = pt.fiable === false ? "partiellement confirmé" : "confirmé";
    return { ...crit("proximite", pts, etat, `À ${km} km à vol d'oiseau du chantier (${pt.origine || "lieu du chantier"})${pal === PALIERS_ETENDUS ? ` ; paliers élargis pour ce métier (${pal.max} / ${pal.eleve} / ${pal.moyen} km)` : ""}.${pt.fiable === false ? " Lieu du chantier à confirmer." : ""}${gagn}`, "annuaire officiel + API Adresse"), distance_km: km };
  }
  const d = String(c.departement ?? "").toUpperCase();
  if (!d || !ctx.departement) return crit("proximite", 0, "non prouvé", "Lieu du chantier ou de l'établissement inconnu.", null);
  if (d === String(ctx.departement).toUpperCase()) return crit("proximite", 2, "partiellement confirmé", `Même département que le chantier (${d}) ; distance exacte inconnue.`, "annuaire officiel");
  if (c.zone === "même région") return crit("proximite", 1, "partiellement confirmé", `Même région (dép. ${d}) ; distance exacte inconnue.`, "annuaire officiel");
  return crit("proximite", 0, "partiellement confirmé", `Hors région (dép. ${d}) ; distance exacte inconnue.`, "annuaire officiel");
}

/**
 * Note une entreprise. ctx : { nafs[], departement, exigences:{obligatoires[]}|null, references:{siren:n}, montantAnnuel, now }.
 * exigences = null → règlement non lu : pas de plafond, étiquette « exigences non vérifiées ».
 */
export function scoreCompany(company, ctx = {}) {
  const raison = estEcartee(company);
  const base = { siren: company?.siren ?? null, nom: company?.nom ?? null, methode: SCORE_METHOD_VERSION, qualification_humaine: "à valider par l'administrateur (le score classe, il n'exclut pas)" };
  if (raison) return { ...base, ecartee: true, raison, note: null, preuve: null, niveau: "écartée", etiquette: null, criteres: [] };
  const criteres = [critMetier(company, ctx), critQualifications(company, ctx), critReferences(company, ctx), critFinanciere(company, ctx), critOperationnelle(company, ctx), critProximite(company, ctx)];
  const actifs = criteres.filter((k) => k.etat !== "non applicable");
  const maxTotal = actifs.reduce((s, k) => s + k.max, 0);
  const pts = actifs.reduce((s, k) => s + k.points, 0);
  let note = maxTotal ? (pts / maxTotal) * 20 : 0;
  const verifie = actifs.reduce((s, k) => s + (k.etat === "confirmé" ? k.max : k.etat === "partiellement confirmé" ? k.max / 2 : 0), 0);
  const preuve = maxTotal ? Math.round((verifie / maxTotal) * 100) : 0;
  const exigencesConnues = !!ctx.exigences && Array.isArray(ctx.exigences.obligatoires);
  const obligatoireManquante = exigencesConnues && ctx.exigences.obligatoires.includes("rge") && !company.rge;
  let etiquette = exigencesConnues ? null : "exigences non vérifiées";
  if (obligatoireManquante) { note = Math.min(note, SEUILS.plafond_dossier_incomplet); etiquette = "dossier incomplet"; }
  note = Math.round(note * 10) / 10;
  const niveau = note >= SEUILS.tres_bon_note && preuve >= SEUILS.tres_bon_preuve ? "très bon" : note >= SEUILS.tres_bon_note ? "bon (preuve limitée)" : note >= 10 ? "moyen" : "faible";
  return { ...base, ecartee: false, raison: null, note, sur: 20, preuve, niveau, etiquette, distance_km: criteres.find((k) => k.cle === "proximite")?.distance_km ?? null, criteres, seuils_provisoires: true };
}

/** Classe une liste : les entreprises écartées sont signalées à part, jamais supprimées en silence. */
export function scoreCompanies(companies, ctx = {}) {
  const scores = (Array.isArray(companies) ? companies : []).map((c) => scoreCompany(c, ctx));
  const classees = scores.filter((s) => !s.ecartee).sort((a, b) => b.note - a.note || b.preuve - a.preuve);
  return { methode: SCORE_METHOD_VERSION, classees, ecartees: scores.filter((s) => s.ecartee) };
}
