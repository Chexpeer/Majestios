// Mission Cheexpeer n°2 « analyse d'un marché » : règles pures, déterministes, sans IA générative.
// Lecture seule : un avis BOAMP (format eForms ou champs structurés) → lieu réel d'exécution, lots, métiers,
// codes NAF PROPOSÉS avec l'extrait exact qui les justifie. L'administrateur valide ou corrige avant toute recherche d'entreprises.
// Décisions : docs/evolution-12/FICHES-MISSIONS-CHEEXPEER-2026-11-22.md (« Décisions retenues le 22 novembre 2026 »).
import { DEPT, regionOfDepartment, normalizeNaf, MIN_LIMIT } from "./mission-prospects-core.mjs";

export const MISSION_TYPE_ANALYSE_MARCHE = "analyse_marche";

/** NUTS 3 français de Normandie (les autres régions passent par le code postal). */
const NUTS_DEPT = Object.freeze({ FRD11: "14", FRD12: "50", FRD13: "61", FRD21: "27", FRD22: "76" });

/**
 * Table métier → codes NAF (BTP). Une proposition n'existe que si un mot-clé est RETROUVÉ dans le texte de l'avis :
 * pas d'extrait = pas de proposition. La table est volontairement courte et lisible ; l'administrateur la complète.
 */
export const METIERS = Object.freeze([
  { metier: "Plomberie – sanitaire", re: /plomberie|sanitaire|canalisation|eau chaude sanitaire/i, naf: ["43.22A"] },
  { metier: "Chauffage – ventilation – climatisation", re: /chauffage|ventilation|climatisation|\bCVC\b|chaufferie/i, naf: ["43.22B"] },
  { metier: "Électricité – courants faibles", re: /[ée]lectricit[ée]|courants? faibles?|contr[oô]le d.acc[eè]s|[ée]clairage|vid[ée]osurveillance/i, naf: ["43.21A", "43.21B"] },
  { metier: "Démolition – désamiantage", re: /d[ée]samiantage|amiante|d[ée]molition|d[ée]plombage/i, naf: ["43.11Z", "39.00Z"] },
  { metier: "Menuiserie", re: /menuiserie|huisserie|fen[eê]tres?\b|porte[s]? (?:int[ée]rieure|ext[ée]rieure)/i, naf: ["43.32A", "43.32B"] },
  { metier: "Plâtrerie – faux plafonds – isolation", re: /faux[- ]plafonds?|pl[aâ]trerie|cloisons? s[eè]che|isolation/i, naf: ["43.31Z", "43.29A"] },
  { metier: "Peinture – revêtements", re: /peinture|rev[eê]tements? de (?:sol|mur)|carrelage|sols? souples?/i, naf: ["43.34Z", "43.33Z"] },
  { metier: "Maçonnerie – gros œuvre", re: /ma[cç]onnerie|gros [œo]uvre|b[ée]ton arm[ée]|rampe|accessibilit[ée]|\bPMR\b/i, naf: ["43.99C"] },
  { metier: "Couverture – charpente – étanchéité", re: /couverture|charpente|[ée]tanch[ée]it[ée]|toiture/i, naf: ["43.91A", "43.91B", "43.99B"] },
  { metier: "Assainissement – réseaux – terrassement", re: /assainissement|raccordement|r[ée]seaux? d.eau|terrassement|\bVRD\b|canalisations? enterr/i, naf: ["42.21Z", "43.12A"] },
  { metier: "Voirie – signalisation", re: /voirie|chauss[ée]e|pistes? cyclables?|signalisation|marquage|enrob[ée]/i, naf: ["42.11Z"] }
]);

export const NAF_LIBELLES = Object.freeze({
  "43.22A": "Travaux d'installation d'eau et de gaz en tous locaux", "43.22B": "Travaux d'installation d'équipements thermiques et de climatisation",
  "43.21A": "Travaux d'installation électrique dans tous locaux", "43.21B": "Travaux d'installation électrique sur la voie publique",
  "43.11Z": "Travaux de démolition", "39.00Z": "Activités de dépollution et autres services de gestion des déchets",
  "43.32A": "Travaux de menuiserie bois et PVC", "43.32B": "Travaux de menuiserie métallique et serrurerie",
  "43.31Z": "Travaux de plâtrerie", "43.29A": "Travaux d'isolation", "43.34Z": "Travaux de peinture et vitrerie", "43.33Z": "Travaux de revêtement des sols et des murs",
  "43.99C": "Travaux de maçonnerie générale et gros œuvre de bâtiment", "43.91A": "Travaux de charpente", "43.91B": "Travaux de couverture par éléments",
  "43.99B": "Travaux de montage de structures métalliques", "42.21Z": "Construction de réseaux pour fluides", "43.12A": "Travaux de terrassement courants et travaux préparatoires",
  "42.11Z": "Construction de routes et autoroutes"
});

const txt = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.map(txt).filter(Boolean).join(" ");
  if (typeof v === "object") return txt(v["#text"] ?? "");
  return "";
};
const arr = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const squash = (s, max = 400) => String(s ?? "").replace(/\s+/g, " ").trim().slice(0, max);

/** Départements cités dans un texte libre : « départements 50 et 14 », « départements de la Manche (50) et du Calvados (14) ». */
export function departmentsInText(text) {
  const out = new Set();
  const t = String(text ?? "");
  for (const m of t.matchAll(/d[ée]partements?\b[^.;]{0,80}/gi)) {
    for (const n of m[0].matchAll(/\b(2[AB]|0[1-9]|[1-8]\d|9[0-5]|97[1-6])\b/gi)) out.add(n[1].toUpperCase());
  }
  return [...out].filter((d) => DEPT.test(d));
}

function locationOf(node, origine) {
  const loc = node?.["cac:RealizedLocation"];
  if (!loc) return null;
  const a = loc["cac:Address"] ?? {};
  const nuts = txt(a["cbc:CountrySubentityCode"]);
  const cp = txt(a["cbc:PostalZone"]);
  let departement = NUTS_DEPT[nuts] ?? null;
  if (!departement && /^\d{5}$/.test(cp)) departement = /^97\d/.test(cp) ? cp.slice(0, 3) : cp.slice(0, 2);
  if (departement && !DEPT.test(departement)) departement = null;
  const description = squash(txt(loc["cbc:Description"]), 200);
  const cited = departmentsInText(description);
  const commune = squash(txt(a["cbc:CityName"]), 80) || null;
  if (!departement && !cited.length && !commune) return null;
  return { origine, departements: departement ? [departement, ...cited.filter((d) => d !== departement)] : cited, commune, nuts: nuts || null, description: description || null };
}

/**
 * Lieu réel d'exécution, par ordre de fiabilité :
 * lot → exécution du marché (adresse) → département cité dans l'objet → région → « territoire non déterminé ».
 * L'adresse de l'ACHETEUR n'est jamais utilisée : l'acheteur n'est pas le lieu des travaux.
 */
export function resolveLocation({ lot, project, objet, departementPrestation }) {
  const fromLot = lot ? locationOf(lot, "lot") : null;
  if (fromLot?.departements.length) return fromLot;
  const fromProject = project ? locationOf(project, "exécution du marché") : null;
  if (fromProject?.departements.length) {
    // L'avis cite parfois plusieurs départements dans son titre alors que l'adresse n'en donne qu'un (ex. « départements 50 et 14 ») : on les réunit.
    const cites = departmentsInText(objet).filter((d) => !fromProject.departements.includes(d));
    return cites.length ? { ...fromProject, origine: "exécution du marché + départements cités dans l'objet", departements: [...fromProject.departements, ...cites] } : fromProject;
  }
  const fromObjet = departmentsInText(objet);
  if (fromObjet.length) return { origine: "département cité dans l'objet", departements: fromObjet, commune: null, nuts: null, description: null };
  const prest = arr(departementPrestation).map((d) => String(d).trim().toUpperCase()).filter((d) => DEPT.test(d));
  if (prest.length) return { origine: "champ « département de prestation » de l'avis", departements: [...new Set(prest)], commune: null, nuts: null, description: null };
  return { origine: "territoire non déterminé", departements: [], commune: null, nuts: null, description: null };
}

/** Cherche les métiers dans un texte ; chaque correspondance renvoie l'extrait exact (±60 caractères autour du mot trouvé). */
export function findMetiers(text) {
  const t = String(text ?? "");
  const found = [];
  for (const m of METIERS) {
    const hit = t.match(m.re);
    if (!hit) continue;
    const start = Math.max(0, hit.index - 60);
    found.push({ metier: m.metier, naf: m.naf, mot: hit[0], extrait: squash(t.slice(start, hit.index + hit[0].length + 60), 200) });
  }
  return found;
}

/**
 * Analyse un avis. `avis` = { idweb, objet, type_marche, descripteur_libelle, code_departement_prestation, donnees }
 * où `donnees` est le JSON eForms (texte ou objet). Renvoie une analyse complète, sans effet de bord.
 */
export function analyseAvis(avis) {
  let notice = null;
  try {
    const raw = typeof avis?.donnees === "string" ? JSON.parse(avis.donnees) : avis?.donnees;
    notice = raw?.EFORMS?.ContractNotice ?? null;
  } catch { notice = null; }
  const objet = squash(avis?.objet, 500);
  const project = notice?.["cac:ProcurementProject"] ?? null;
  const titre = squash(txt(project?.["cbc:Name"]), 500) || objet;
  const description = squash(txt(project?.["cbc:Description"]), 2000);
  const lotsRaw = arr(notice?.["cac:ProcurementProjectLot"]);
  const descripteurs = arr(avis?.descripteur_libelle).join(" ; ");
  const cpv = txt(project?.["cac:MainCommodityClassification"]?.["cbc:ItemClassificationCode"]) || null;

  const lots = (lotsRaw.length ? lotsRaw : [null]).map((lot, i) => {
    const lotProject = lot?.["cac:ProcurementProject"] ?? null;
    const lotId = txt(lot?.["cbc:ID"]) || `LOT-${String(i + 1).padStart(4, "0")}`;
    const lotTitre = squash(txt(lotProject?.["cbc:Name"]), 300) || (lot ? "" : titre);
    const lotDesc = squash(txt(lotProject?.["cbc:Description"]), 1200);
    return { id: lotId, titre: lotTitre || titre, description: lotDesc, lieu: resolveLocation({ lot: lotProject, project, objet: titre, departementPrestation: avis?.code_departement_prestation }) };
  });

  // Une proposition = un métier retrouvé dans un texte précis. « forte » : dans le titre/objet ; « complémentaire » : seulement dans la description ou les descripteurs.
  const propositions = [];
  for (const lot of lots) {
    const principal = `${lot.titre} ${objet}`;
    const secondaire = `${lot.description} ${lot === lots[0] ? description : ""} ${descripteurs}`;
    const deja = new Set();
    for (const [niveau, source, texte] of [["forte", "titre ou objet de l'avis", principal], ["complémentaire", "description ou descripteurs de l'avis", secondaire]]) {
      for (const f of findMetiers(texte)) {
        if (deja.has(f.metier)) continue;
        deja.add(f.metier);
        for (const naf of f.naf) propositions.push({ lot: lot.id, naf, libelle: NAF_LIBELLES[naf] ?? null, metier: f.metier, niveau, source, mot_trouve: f.mot, extrait: f.extrait });
      }
    }
  }

  const departements = [...new Set(lots.flatMap((l) => l.lieu.departements))];
  const regions = [...new Set(departements.map((d) => regionOfDepartment(d)?.nom).filter(Boolean))];
  return {
    idweb: avis?.idweb ?? null,
    objet: titre,
    type_marche: avis?.type_marche ?? null,
    cpv,
    date_limite: avis?.datelimitereponse ?? null,
    acheteur: avis?.nomacheteur ?? null,
    lots,
    departements,
    regions,
    territoire: departements.length ? "déterminé" : "non déterminé",
    propositions,
    // Rien n'est cherché tant que l'administrateur n'a pas validé : statut explicite.
    statut: propositions.length ? "à valider par l'administrateur" : "aucun métier reconnu : saisie manuelle des codes NAF"
  };
}

/**
 * Transforme les codes NAF VALIDÉS par l'administrateur en demandes de recherche d'entreprises (une par couple NAF × département),
 * au format attendu par la mission « prospects ». Ne retient que des codes valides, présents dans la proposition ou ajoutés à la main.
 * Si le territoire n'est pas déterminé, aucune recherche n'est créée : l'administrateur doit choisir le département.
 */
export function buildProspectSearches(analyse, { nafValides = [], departements = null, limite = MIN_LIMIT } = {}) {
  const nafs = [...new Set(nafValides.map(normalizeNaf).filter(Boolean))];
  const depts = (departements ?? analyse?.departements ?? []).map((d) => String(d).toUpperCase()).filter((d) => DEPT.test(d));
  if (!nafs.length) return { ok: false, error: "Aucun code NAF validé." };
  if (!depts.length) return { ok: false, error: "Territoire non déterminé : choisissez un département." };
  const searches = [];
  for (const naf of nafs) for (const departement of depts) searches.push({ naf, departement, limite, marche_objet: squash(analyse?.objet, 200) || null });
  return { ok: true, searches };
}

export const BOAMP_URL = "https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records";
const IDWEB = /^\d{2}-\d{1,8}$/;

/** Entrée de la mission : uniquement l'identifiant de l'avis BOAMP (ex. 26-111564). */
export function validateAnalyseInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).some((k) => k !== "idweb")) return { ok: false, error: "Champs non reconnus." };
  const idweb = String(input.idweb ?? "").trim();
  if (!IDWEB.test(idweb)) return { ok: false, error: "Identifiant d'avis invalide (format attendu : 26-111564)." };
  return { ok: true, value: { idweb } };
}

/** Lit l'avis sur l'open data officiel du BOAMP puis l'analyse. Lecture seule, aucun effet externe. */
export async function runAnalyseMission(input, { fetchImpl = fetch, now = new Date() } = {}) {
  const checked = validateAnalyseInput(input);
  if (!checked.ok) throw Object.assign(new Error(checked.error), { code: "INVALID_INPUT" });
  const url = new URL(BOAMP_URL);
  url.searchParams.set("where", `idweb="${checked.value.idweb}"`);
  url.searchParams.set("limit", "1");
  const res = await fetchImpl(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error("boamp_" + res.status);
  const avis = (await res.json())?.results?.[0];
  if (!avis) throw Object.assign(new Error("Avis introuvable au BOAMP."), { code: "INVALID_INPUT" });
  const analyse = analyseAvis(avis);
  return { type: MISSION_TYPE_ANALYSE_MARCHE, ...analyse, source: "BOAMP (open data officiel)", genere_le: now.toISOString(), effets_externes: false };
}
