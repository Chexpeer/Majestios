// Mission Cheexpeer n°1 « prospects de sous-traitance » : règles pures et appel à l'annuaire officiel.
// Lecture seule : aucun envoi, aucune écriture métier. Spécification : docs/evolution-12/MISSION-CHEEXPEER-PROSPECTS-SOUS-TRAITANCE-2026-11-22.md
export const MISSION_TYPE_PROSPECTS = "prospects_sous_traitance";
export const COMPANIES_URL = "https://recherche-entreprises.api.gouv.fr/search";
export const SOURCE_NAME = "API Recherche d'Entreprises (data.gouv.fr)";
export const MIN_LIMIT = 20;
export const MAX_LIMIT = 30;
/** limite = 0 : « toutes » les entreprises du métier ayant un établissement actif dans le département (plafond de sécurité). */
export const LIMIT_TOUTES = 0;
export const MAX_TOUTES = 1000;
export const PAGE_SIZE = 25;

/** Code région INSEE → départements (régions actuelles). */
export const REGIONS = Object.freeze({
  "11": { nom: "Île-de-France", depts: ["75", "77", "78", "91", "92", "93", "94", "95"] },
  "24": { nom: "Centre-Val de Loire", depts: ["18", "28", "36", "37", "41", "45"] },
  "27": { nom: "Bourgogne-Franche-Comté", depts: ["21", "25", "39", "58", "70", "71", "89", "90"] },
  "28": { nom: "Normandie", depts: ["14", "27", "50", "61", "76"] },
  "32": { nom: "Hauts-de-France", depts: ["02", "59", "60", "62", "80"] },
  "44": { nom: "Grand Est", depts: ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"] },
  "52": { nom: "Pays de la Loire", depts: ["44", "49", "53", "72", "85"] },
  "53": { nom: "Bretagne", depts: ["22", "29", "35", "56"] },
  "75": { nom: "Nouvelle-Aquitaine", depts: ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"] },
  "76": { nom: "Occitanie", depts: ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"] },
  "84": { nom: "Auvergne-Rhône-Alpes", depts: ["01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"] },
  "93": { nom: "Provence-Alpes-Côte d'Azur", depts: ["04", "05", "06", "13", "83", "84"] },
  "94": { nom: "Corse", depts: ["2A", "2B"] },
  "01": { nom: "Guadeloupe", depts: ["971"] }, "02": { nom: "Martinique", depts: ["972"] }, "03": { nom: "Guyane", depts: ["973"] },
  "04": { nom: "La Réunion", depts: ["974"] }, "06": { nom: "Mayotte", depts: ["976"] }
});

export const DEPT = /^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/;
const NAF = /^\d{2}\.\d{2}[A-Z]$/;
const SIREN = /^\d{9}$/;

export function regionOfDepartment(dept) {
  const d = String(dept ?? "").trim().toUpperCase();
  for (const [code, r] of Object.entries(REGIONS)) if (r.depts.includes(d)) return { code, nom: r.nom };
  return null;
}

export const normalizeNaf = (value) => {
  const raw = String(value ?? "").trim().toUpperCase().replace(/\s/g, "");
  const dotted = /^\d{4}[A-Z]$/.test(raw) ? raw.slice(0, 2) + "." + raw.slice(2) : raw;
  return NAF.test(dotted) ? dotted : null;
};

const clean = (v, max = 160) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

/** Valide l'entrée d'une mission. Renvoie { ok, value } ou { ok:false, error }. */
export function validateProspectsInput(input) {
  const allowed = new Set(["naf", "departement", "limite", "gagnant_siren", "gagnant_nom", "marche_objet"]);
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).some((k) => !allowed.has(k))) return { ok: false, error: "Champs non reconnus." };
  const naf = normalizeNaf(input.naf);
  if (!naf) return { ok: false, error: "Code NAF invalide (format attendu : 43.22B)." };
  const departement = String(input.departement ?? "").trim().toUpperCase();
  if (!DEPT.test(departement)) return { ok: false, error: "Département invalide." };
  const limite = input.limite == null ? MAX_LIMIT : input.limite;
  if (!Number.isInteger(limite) || (limite !== LIMIT_TOUTES && (limite < MIN_LIMIT || limite > MAX_LIMIT))) return { ok: false, error: `Le nombre d'entreprises doit être compris entre ${MIN_LIMIT} et ${MAX_LIMIT}, ou « toutes ».` };
  const siren = input.gagnant_siren == null || input.gagnant_siren === "" ? null : String(input.gagnant_siren).replace(/\s/g, "");
  if (siren !== null && !SIREN.test(siren)) return { ok: false, error: "SIREN du gagnant invalide (9 chiffres)." };
  return { ok: true, value: { naf, departement, limite, gagnant_siren: siren, gagnant_nom: clean(input.gagnant_nom, 120) || null, marche_objet: clean(input.marche_objet, 200) || null } };
}

/** Département d'un établissement : déduit du code commune INSEE (97x pour l'outre-mer, 2A/2B pour la Corse), sinon du code postal. */
export function departmentOfEstablishment(etab) {
  const c = String(etab?.commune ?? "").toUpperCase();
  if (/^97\d/.test(c)) return c.slice(0, 3);
  if (/^(2A|2B)/.test(c)) return c.slice(0, 2);
  if (/^\d{5}$/.test(c)) return c.slice(0, 2);
  const cp = String(etab?.code_postal ?? "");
  if (/^97\d/.test(cp)) return cp.slice(0, 3);
  return /^\d{5}$/.test(cp) ? (cp.startsWith("20") ? "" : cp.slice(0, 2)) : "";
}

/**
 * L'annuaire officiel filtre sur les ÉTABLISSEMENTS : une entreprise dont le siège est ailleurs peut avoir une agence dans la zone.
 * On présente donc l'établissement situé dans la zone demandée (adresse, commune, coordonnées), jamais l'adresse d'un siège lointain.
 * Renvoie null si l'entreprise n'a aucun établissement actif dans la zone.
 */
export function pickLocalCompany(raw, { naf, departement, regionCode, now = new Date() } = {}) {
  const siren = String(raw?.siren ?? "");
  if (!SIREN.test(siren)) return null;
  const candidates = [raw?.siege, ...(Array.isArray(raw?.matching_etablissements) ? raw.matching_etablissements : [])].filter((e) => e && typeof e === "object");
  const seen = new Set(); let best = null, bestScore = 99;
  for (const e of candidates) {
    const key = String(e.siret ?? JSON.stringify([e.adresse, e.commune]));
    if (seen.has(key)) continue; seen.add(key);
    if (e.etat_administratif && e.etat_administratif !== "A") continue;
    const enaf = normalizeNaf(e.activite_principale);
    if (enaf && enaf !== naf) continue;
    const dept = String(e.departement ?? "").toUpperCase() || departmentOfEstablishment(e);
    const inDept = dept === departement;
    const inRegion = inDept || String(e.region ?? "") === regionCode || regionOfDepartment(dept)?.code === regionCode;
    if (!inRegion) continue;
    const score = (inDept ? 0 : 2) + (e.est_siege ? 0 : 1);
    if (score < bestScore) { best = { e, dept, inDept }; bestScore = score; }
  }
  if (!best) return null;
  const { e, dept, inDept } = best;
  const lat = Number(e.latitude), lon = Number(e.longitude);
  return {
    score: bestScore,
    company: {
      siren,
      siret: /^\d{14}$/.test(String(e.siret ?? "")) ? String(e.siret) : null,
      nom: clean(raw.nom_complet, 140),
      naf: normalizeNaf(raw.activite_principale ?? e.activite_principale) ?? clean(raw.activite_principale, 10),
      adresse: clean(e.adresse, 200),
      code_postal: clean(e.code_postal, 10),
      commune: clean(e.libelle_commune, 80),
      departement: dept,
      zone: inDept ? "même département" : "même région",
      etablissement: e.est_siege ? "siège" : "agence locale",
      effectif: clean(e.tranche_effectif_salarie ?? raw.tranche_effectif_salarie, 4) || null,
      rge: Array.isArray(e.liste_rge) && e.liste_rge.length > 0,
      latitude: Number.isFinite(lat) && lat !== 0 ? Math.round(lat * 1e5) / 1e5 : null,
      longitude: Number.isFinite(lon) && lon !== 0 ? Math.round(lon * 1e5) / 1e5 : null,
      telephone: null, email: null, google_maps: null, // à compléter dans une étape suivante (clé Google, sites web)
      source: SOURCE_NAME,
      source_url: "https://annuaire-entreprises.data.gouv.fr/entreprise/" + siren,
      creation: clean(raw.date_creation, 10) || null,
      collecte_le: now.toISOString().slice(0, 10)
    }
  };
}

async function fetchPage(fetchImpl, params) {
  const url = new URL(COMPANIES_URL);
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  const res = await fetchImpl(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error("annuaire_" + res.status);
  const body = await res.json();
  return Array.isArray(body?.results) ? body.results : [];
}

/**
 * Exécute la mission : entreprises du même métier (code NAF) ayant un établissement actif dans le département du marché, puis dans le
 * reste de la région. Classement : siège local, agence locale, puis même région. Hors entreprise gagnante, sans doublon, dans la limite demandée.
 */
export async function runProspectsMission(input, { fetchImpl = fetch, now = new Date(), pauseMs = 150 } = {}) {
  const checked = validateProspectsInput(input);
  if (!checked.ok) throw Object.assign(new Error(checked.error), { code: "INVALID_INPUT" });
  const { naf, departement, limite, gagnant_siren } = checked.value;
  const region = regionOfDepartment(departement);
  if (!region) throw Object.assign(new Error("Région introuvable."), { code: "INVALID_INPUT" });
  const pool = new Map(); // siren → { score, order, company }
  let order = 0;
  const base = { activite_principale: naf, etat_administratif: "A", per_page: 25 };
  const collect = (results) => {
    for (const r of results) {
      const picked = pickLocalCompany(r, { naf, departement, regionCode: region.code, now });
      if (!picked || picked.company.siren === gagnant_siren) continue;
      const known = pool.get(picked.company.siren);
      if (!known || picked.score < known.score) pool.set(picked.company.siren, { score: picked.score, order: known?.order ?? order++, company: picked.company });
    }
  };
  const toutes = limite === LIMIT_TOUTES;
  if (toutes) {
    // Toutes les entreprises du département, page après page (l'annuaire limite le débit : courte pause entre deux pages).
    const maxPages = Math.ceil(MAX_TOUTES / PAGE_SIZE) + 4;
    for (let page = 1; page <= maxPages && pool.size < MAX_TOUTES; page++) {
      const r = await fetchPage(fetchImpl, { ...base, departement, page });
      collect(r); if (r.length < PAGE_SIZE) break;
      if (pauseMs > 0) await new Promise((resolve) => setTimeout(resolve, pauseMs));
    }
    const all = [...pool.values()].filter((x) => x.score <= 1).sort((a, b) => a.score - b.score || a.order - b.order).slice(0, MAX_TOUTES).map((x) => x.company);
    return {
      type: MISSION_TYPE_PROSPECTS,
      criteres: { naf, departement, region: region.nom, limite, toutes: true, gagnant_siren, gagnant_nom: checked.value.gagnant_nom, marche_objet: checked.value.marche_objet },
      nombre: all.length, entreprises: all, plafond_atteint: all.length >= MAX_TOUTES,
      manquant: ["telephone", "email", "google_maps"], sources: [SOURCE_NAME], genere_le: now.toISOString(), effets_externes: false
    };
  }
  const inDeptCount = () => [...pool.values()].filter((x) => x.score <= 1).length;
  for (let page = 1; page <= 4 && inDeptCount() < limite; page++) {
    const r = await fetchPage(fetchImpl, { ...base, departement, page });
    collect(r); if (r.length < 25) break;
  }
  for (let page = 1; page <= 4 && pool.size < limite; page++) {
    const r = await fetchPage(fetchImpl, { ...base, region: region.code, page });
    collect(r); if (r.length < 25) break;
  }
  const companies = [...pool.values()].sort((a, b) => a.score - b.score || a.order - b.order).slice(0, limite).map((x) => x.company);
  return {
    type: MISSION_TYPE_PROSPECTS,
    criteres: { naf, departement, region: region.nom, limite, gagnant_siren, gagnant_nom: checked.value.gagnant_nom, marche_objet: checked.value.marche_objet },
    nombre: companies.length,
    entreprises: companies,
    manquant: ["telephone", "email", "google_maps"],
    sources: [SOURCE_NAME],
    genere_le: now.toISOString(),
    effets_externes: false
  };
}
