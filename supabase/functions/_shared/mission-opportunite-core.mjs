// Mission Cheexpeer n°11 « opportunités après attribution » : règles pures, déterministes, sans IA générative, lecture seule.
// Un marché attribué (DECP) → le gagnant, sa taille face au montant, le métier, le lieu, et des PARTENAIRES POTENTIELS locaux du même métier.
// Règle de langage : jamais « besoin confirmé » ni « cherche un sous-traitant » ; seulement « peut représenter une opportunité ».
// Décisions : docs/evolution-12/FICHES-MISSIONS-CHEEXPEER-2026-11-22.md (mission 11, sans score : « qualification non réalisée »).
import { DEPT, COMPANIES_URL, SOURCE_NAME, normalizeNaf, runProspectsMission, regionOfDepartment } from "./mission-prospects-core.mjs";
import { scoreCompanies } from "./mission-score-core.mjs";
import { departmentsInText, findMetiers, NAF_LIBELLES } from "./mission-analyse-marche-core.mjs";

export const MISSION_TYPE_OPPORTUNITE = "opportunite_attribution";
export const FORMULATION = "Ce marché peut représenter une opportunité de collaboration. Ce n'est pas un besoin confirmé : l'entreprise gagnante n'a pas annoncé chercher un sous-traitant.";
export const SEUILS = Object.freeze({ fort: 100000, moyen: 40000 }); // € par salarié et par an — provisoires, à fixer après essais sur cas réels
export const MAX_GAGNANTS = 3;
export const MAX_RECHERCHES = 3;
export const MAX_PARTENAIRES = 60;
const CONTRACT_UID = /^[A-Za-z0-9_.\-]{5,160}$/;
const SIREN = /^\d{9}$/;

/** Tranche d'effectif INSEE → fourchette de salariés. « NN » ou inconnue : non évaluable. */
export const TRANCHES = Object.freeze({
  "00": [0, 0], "01": [1, 2], "02": [3, 5], "03": [6, 9], "11": [10, 19], "12": [20, 49], "21": [50, 99], "22": [100, 199], "31": [200, 249],
  "32": [250, 499], "41": [500, 999], "42": [1000, 1999], "51": [2000, 4999], "52": [5000, 9999], "53": [10000, 10000]
});

const clean = (v, max = 200) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export function validateOpportuniteInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).some((k) => k !== "contract_uid")) return { ok: false, error: "Champs non reconnus." };
  const uid = String(input.contract_uid ?? "").trim();
  if (!CONTRACT_UID.test(uid)) return { ok: false, error: "Identifiant de marché invalide." };
  return { ok: true, value: { contract_uid: uid } };
}

/** Effectif estimé (milieu de la tranche) ; null si la tranche est inconnue. */
export function effectifEstime(tranche) {
  const t = TRANCHES[String(tranche ?? "")];
  if (!t) return null;
  return Math.max(1, Math.round((t[0] + t[1]) / 2));
}

/**
 * Indice « faible / moyen / fort » à partir du montant annualisé rapporté à l'effectif du gagnant.
 * Jamais un besoin confirmé. Montant absent, suspect ou aberrant, ou effectif inconnu : « non évaluable » (qualification non réalisée).
 */
export function computeIndice({ montant, amountFlag, dureeMois, effectif, categorie, sousTraitanceDeclaree } = {}) {
  const raisons = [];
  if (sousTraitanceDeclaree) raisons.push("Une sous-traitance est déclarée dans les données du marché (fait constaté).");
  const base = { formulation: FORMULATION, seuils_provisoires: true, qualification: "non réalisée (pas de score)" };
  const amount = Number(montant);
  if (!Number.isFinite(amount) || amount <= 0) return { ...base, niveau: "non évaluable", ratio: null, raisons: [...raisons, "Montant du marché absent."] };
  if (amountFlag === "suspect" || amountFlag === "aberrant") return { ...base, niveau: "non évaluable", ratio: null, raisons: [...raisons, `Montant jugé ${amountFlag} dans les données publiques : indice non calculé.`] };
  if (!effectif) return { ...base, niveau: "non évaluable", ratio: null, raisons: [...raisons, "Effectif du gagnant inconnu : indice non calculé."] };
  const duree = Number(dureeMois);
  const annuel = Number.isFinite(duree) && duree >= 12 ? (amount * 12) / duree : amount;
  const ratio = Math.round(annuel / effectif);
  const niveau = ratio >= SEUILS.fort ? "fort" : ratio >= SEUILS.moyen ? "moyen" : "faible";
  raisons.push(`Montant ${Math.round(annuel).toLocaleString("fr-FR")} € ${annuel !== amount ? "par an" : ""} pour un effectif estimé à ${effectif} personne(s), soit ${ratio.toLocaleString("fr-FR")} € par salarié.`.replace("  ", " "));
  if (categorie) raisons.push(`Catégorie d'entreprise : ${categorie}.`);
  return { ...base, niveau, ratio, raisons };
}

/** Lieu des travaux : départements cités dans l'objet, sinon département du gagnant (signalé). Jamais l'adresse de l'acheteur. */
export function resolveTerritoire({ objet, winnerDept }) {
  const cites = departmentsInText(objet);
  if (cites.length) return { origine: "département cité dans l'objet du marché", departements: cites.slice(0, 2) };
  const w = String(winnerDept ?? "").trim().toUpperCase();
  if (DEPT.test(w)) return { origine: "lieu des travaux non précisé : département du gagnant (à confirmer)", departements: [w] };
  return { origine: "territoire non déterminé", departements: [] };
}

async function lookupCompany(fetchImpl, siren) {
  const url = new URL(COMPANIES_URL);
  url.searchParams.set("q", siren); url.searchParams.set("per_page", "1");
  const res = await fetchImpl(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error("annuaire_" + res.status);
  const r = (await res.json())?.results?.[0];
  if (!r || String(r.siren) !== siren) return null;
  return {
    naf: normalizeNaf(r.activite_principale), nom: clean(r.nom_complet, 140), tranche: String(r.tranche_effectif_salarie ?? ""),
    categorie: clean(r.categorie_entreprise, 8) || null, creation: clean(r.date_creation, 10) || null
  };
}

/** Résume les lignes DECP d'un marché (un gagnant par ligne) en une fiche, avec partenaires potentiels du même métier. */
export async function runOpportuniteMission(input, { admin, fetchImpl = fetch, now = new Date(), pauseMs = 150 } = {}) {
  const checked = validateOpportuniteInput(input);
  if (!checked.ok) throw Object.assign(new Error(checked.error), { code: "INVALID_INPUT" });
  if (!admin?.rpc) throw Object.assign(new Error("Lecture des marchés attribués indisponible."), { code: "EXECUTION_FAILED" });
  const read = await admin.rpc("cheexpeer_worker_read_awarded_contract", { p_contract_uid: checked.value.contract_uid });
  if (read.error) throw new Error("lecture_marche_echec");
  const rows = Array.isArray(read.data) ? read.data : [];
  if (!rows.length) throw Object.assign(new Error("Marché introuvable dans la base des marchés attribués."), { code: "INVALID_INPUT" });
  const m = rows[0];
  const winnersRaw = [...new Map(rows.filter((r) => /^\d{14}$/.test(String(r.winner_id ?? ""))).map((r) => [String(r.winner_id).slice(0, 9), r])).entries()].slice(0, MAX_GAGNANTS);

  const gagnants = [];
  for (const [siren, r] of winnersRaw) {
    let info = null; try { info = await lookupCompany(fetchImpl, siren); } catch { info = null; }
    if (pauseMs > 0) await new Promise((resolve) => setTimeout(resolve, pauseMs));
    gagnants.push({
      siren, siret: String(r.winner_id), nom: clean(r.winner_name, 140) || info?.nom || null, naf: info?.naf ?? null,
      categorie: clean(r.winner_category, 8) || info?.categorie || null, tranche_effectif: info?.tranche || null,
      effectif_estime: effectifEstime(info?.tranche), departement: clean(r.winner_dept, 3) || null,
      source: SOURCE_NAME, source_url: "https://annuaire-entreprises.data.gouv.fr/entreprise/" + siren
    });
  }
  const principal = gagnants[0] ?? null;
  const montant = m.amount == null ? null : Number(m.amount);
  const indice = computeIndice({ montant, amountFlag: m.amount_flag, dureeMois: m.duration_months, effectif: principal?.effectif_estime, categorie: principal?.categorie, sousTraitanceDeclaree: m.subcontracting_declared });
  const territoire = resolveTerritoire({ objet: m.object, winnerDept: principal?.departement });

  // Métiers : code NAF du gagnant d'abord, puis métiers retrouvés dans l'objet (avec extrait). Au plus MAX_RECHERCHES recherches de partenaires.
  const metiers = [];
  const addNaf = (naf, origine, extrait = null) => { if (naf && !metiers.some((x) => x.naf === naf)) metiers.push({ naf, libelle: NAF_LIBELLES[naf] ?? null, origine, extrait }); };
  for (const g of gagnants) addNaf(g.naf, "activité principale du gagnant (annuaire officiel)");
  for (const f of findMetiers(`${m.object ?? ""}`)) for (const naf of f.naf) addNaf(naf, "métier retrouvé dans l'objet du marché", f.extrait);

  const partenaires = []; const seen = new Set(gagnants.map((g) => g.siren)); const recherches = [];
  const combos = [];
  for (const mt of metiers) for (const d of territoire.departements) combos.push({ naf: mt.naf, departement: d });
  for (const c of combos.slice(0, MAX_RECHERCHES)) {
    if (!regionOfDepartment(c.departement)) continue;
    let r; try { r = await runProspectsMission({ naf: c.naf, departement: c.departement, limite: 30, gagnant_siren: principal?.siren ?? undefined }, { fetchImpl, now, pauseMs }); } catch { recherches.push({ ...c, erreur: true }); continue; }
    recherches.push({ ...c, nombre: r.nombre });
    for (const e of r.entreprises) {
      if (seen.has(e.siren) || partenaires.length >= MAX_PARTENAIRES) continue;
      seen.add(e.siren);
      partenaires.push({ ...e, raison: `Même métier (NAF ${e.naf}) ; ${e.zone} ${e.departement} ; ${e.etablissement}. Hors entreprise gagnante.` });
    }
  }

  // Score (mission 5) : classe les partenaires potentiels ; exigences du marché non lues, références et comptes non branchés → affichés « non prouvé » / « exigences non vérifiées ».
  const duree = Number(m.duration_months);
  const montantAnnuel = Number.isFinite(montant) && montant > 0 && m.amount_flag !== "suspect" && m.amount_flag !== "aberrant" ? (Number.isFinite(duree) && duree >= 12 ? (montant * 12) / duree : montant) : null;
  const classement = scoreCompanies(partenaires, { nafs: metiers.map((x) => x.naf), departement: territoire.departements[0] ?? null, exigences: null, montantAnnuel, now });
  const parSiren = new Map(classement.classees.map((x, i) => [x.siren, { rang: i + 1, note: x.note, sur: 20, preuve: x.preuve, niveau: x.niveau, etiquette: x.etiquette, methode: x.methode, criteres: x.criteres.map((k) => ({ cle: k.cle, libelle: k.libelle, points: k.points, max: k.max, etat: k.etat, detail: k.detail })) }]));
  for (const p of partenaires) p.score = parSiren.get(p.siren) ?? null;
  partenaires.sort((a, b) => (a.score?.rang ?? 1e9) - (b.score?.rang ?? 1e9));

  return {
    type: MISSION_TYPE_OPPORTUNITE,
    marche: { contract_uid: m.contract_uid, objet: clean(m.object, 500), date_attribution: m.awarded_on ?? null, montant, indicateur_montant: m.amount_flag ?? null, duree_mois: m.duration_months ?? null, cpv: m.cpv ?? null, acheteur: clean(m.buyer_name, 140) || null, sous_traitance_declaree: !!m.subcontracting_declared, procedure: m.procedure ?? null },
    gagnants, indice, territoire, metiers, recherches, nombre: partenaires.length, partenaires,
    manquant: ["telephone", "email", "google_maps", "references", "comptes", "exigences_du_marche"], sources: [SOURCE_NAME, "DECP (données essentielles de la commande publique)"],
    methode_score: classement.methode, score_provisoire: true,
    genere_le: now.toISOString(), effets_externes: false
  };
}
