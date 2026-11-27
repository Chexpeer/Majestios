// Logique pure du centre de commande Cheexpeer (testable sans navigateur).
// Les trois API serveur existent sur MajestiOS-Test : soumission, décision d'approbation, lecture.
export const MISSION_TYPE = "readiness_probe";
export const MISSION_TYPE_PROSPECTS = "prospects_sous_traitance";
export const MISSION_TYPE_ANALYSE = "analyse_marche";
export const MISSION_TYPE_OPPORTUNITE = "opportunite_attribution";
export const MISSION_TYPE_FICHES = "fiches_contacts";
export const MAX_FICHES = 30;
export const MAX_RECHERCHES = 6;

export const STATUS_LABELS = Object.freeze({
  queued: "Validée · prête à lancer", awaiting_approval: "En attente de validation", retry_wait: "Nouvel essai prévu", blocked: "Bloquée", pending_approval: "En attente de validation", approved: "Approuvée",
  running: "En cours", succeeded: "Terminée", failed: "Échec", cancelled: "Annulée", rejected: "Refusée", expired: "Expirée"
});
export const APPROVAL_LABELS = Object.freeze({ pending: "À décider", approved: "Approuvée", rejected: "Refusée", expired: "Expirée" });

export const ERROR_LABELS = Object.freeze({
  AUTH_REQUIRED: "Votre session a expiré. Reconnectez-vous.",
  ACCESS_DENIED: "Accès refusé : cette page est réservée aux propriétaires et administrateurs internes.",
  INVALID_PAYLOAD: "La demande est incomplète ou invalide.",
  INVALID_JSON: "La demande est illisible.",
  PAYLOAD_TOO_LARGE: "La demande est trop volumineuse.",
  METHOD_NOT_ALLOWED: "Méthode non autorisée.",
  SERVICE_UNAVAILABLE: "Le service Cheexpeer n'est pas disponible pour le moment.",
  MISSION_SUBMISSION_FAILED: "La mission n'a pas pu être créée. Le diagnostic n'est probablement pas encore activé.",
  MISSION_READ_FAILED: "La lecture de la mission a échoué.",
  MISSION_NOT_FOUND: "Mission introuvable dans votre organisation.",
  MISSION_RUN_FAILED: "L'exécution n'a pas pu démarrer. Réessayez dans un instant.",
  RESULT_TOO_LARGE: "Le résultat est trop volumineux pour être affiché."
});
export const errorMessage = (code) => ERROR_LABELS[code] || "Une erreur inattendue est survenue. Rien n'a été modifié.";
export const statusLabel = (s) => STATUS_LABELS[s] || "Statut à vérifier";

const FUNCTIONS = Object.freeze({ submit: "cheexpeer-mission-submit", decision: "cheexpeer-approval-decision", read: "cheexpeer-mission-read", chat: "cheexpeer-chat", run: "cheexpeer-mission-run" });
export const functionUrl = (baseUrl, key) => {
  if (!FUNCTIONS[key]) throw new Error("Fonction inconnue");
  return `${String(baseUrl).replace(/\/+$/, "")}/functions/v1/${FUNCTIONS[key]}`;
};

export function buildSubmitPayload({ organizationId, title, objective, idempotencyKey }) {
  const t = String(title ?? "").trim().slice(0, 200);
  if (!t) return null;
  const payload = { organization_id: organizationId, mission_type: MISSION_TYPE, title: t, autonomy_level: 0, requires_approval: true, idempotency_key: idempotencyKey };
  const o = String(objective ?? "").trim();
  if (o) payload.objective = o.slice(0, 4000);
  return payload;
}
/** Demande de mission « prospects de sous-traitance » : validation humaine toujours exigée, aucun effet externe. */
export function buildProspectsPayload({ organizationId, naf, departement, limite, gagnantNom, gagnantSiren, marcheObjet, communeChantier, idempotencyKey }) {
  const n = String(naf ?? "").trim().toUpperCase().replace(/\s/g, "");
  const code = /^\d{4}[A-Z]$/.test(n) ? n.slice(0, 2) + "." + n.slice(2) : n;
  const dept = String(departement ?? "").trim().toUpperCase();
  const lim = Number(limite);
  if (!/^\d{2}\.\d{2}[A-Z]$/.test(code) || !/^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/.test(dept) || !Number.isInteger(lim) || (lim !== 0 && (lim < 20 || lim > 30))) return null;
  const input = { naf: code, departement: dept, limite: lim };
  const siren = String(gagnantSiren ?? "").replace(/\s/g, "");
  if (siren) { if (!/^\d{9}$/.test(siren)) return null; input.gagnant_siren = siren; }
  const nom = String(gagnantNom ?? "").trim(); if (nom) input.gagnant_nom = nom.slice(0, 120);
  const objet = String(marcheObjet ?? "").trim(); if (objet) input.marche_objet = objet.slice(0, 200);
  const commune = String(communeChantier ?? "").replace(/\s+/g, " ").trim(); if (commune) input.commune_chantier = commune.slice(0, 80);
  return { organization_id: organizationId, mission_type: MISSION_TYPE_PROSPECTS, title: `Prospects de sous-traitance · ${code} · dép. ${dept}`, autonomy_level: 0, requires_approval: true, input, idempotency_key: idempotencyKey };
}

/** Demande de mission « analyse d'un appel d'offres » : seul l'identifiant de l'avis BOAMP est envoyé. */
export function buildAnalysePayload({ organizationId, idweb, idempotencyKey }) {
  const id = String(idweb ?? "").trim();
  if (!/^\d{2}-\d{1,8}$/.test(id)) return null;
  return { organization_id: organizationId, mission_type: MISSION_TYPE_ANALYSE, title: `Analyse de l'avis BOAMP ${id}`, autonomy_level: 0, requires_approval: true, input: { idweb: id }, idempotency_key: idempotencyKey };
}
/** Demande de mission « opportunités après attribution » : seul l'identifiant du marché attribué est envoyé. */
export function buildOpportunitePayload({ organizationId, contractUid, label, idempotencyKey }) {
  const uid = String(contractUid ?? "").trim();
  if (!/^[A-Za-z0-9_.\-]{5,160}$/.test(uid)) return null;
  const short = String(label ?? "").replace(/\s+/g, " ").trim().slice(0, 90);
  return { organization_id: organizationId, mission_type: MISSION_TYPE_OPPORTUNITE, title: `Opportunités après attribution${short ? " · " + short : ""}`.slice(0, 200), autonomy_level: 0, requires_approval: true, input: { contract_uid: uid }, idempotency_key: idempotencyKey };
}
/** Demande de mission « fiches de contacts » : 30 entreprises au plus (SIREN, nom, commune, code postal), validation humaine toujours exigée. */
export function buildFichesPayload({ organizationId, entreprises, label, idempotencyKey }) {
  const seen = new Set(), list = [];
  for (const e of Array.isArray(entreprises) ? entreprises : []) {
    const siren = String(e?.siren ?? "").replace(/\s/g, "");
    if (!/^\d{9}$/.test(siren) || seen.has(siren)) continue; seen.add(siren);
    list.push({ siren, nom: String(e?.nom ?? "").slice(0, 140), commune: String(e?.commune ?? "").slice(0, 80), code_postal: String(e?.code_postal ?? "").slice(0, 10) });
    if (list.length >= MAX_FICHES) break;
  }
  if (!list.length) return null;
  const short = String(label ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
  return { organization_id: organizationId, mission_type: MISSION_TYPE_FICHES, title: `Fiches contacts · ${list.length} entreprise(s)${short ? " · " + short : ""}`.slice(0, 200), autonomy_level: 0, requires_approval: true, input: { entreprises: list }, idempotency_key: idempotencyKey };
}
/** Fichier CSV des fiches (séparateur point-virgule, UTF-8 avec BOM, protégé contre les formules). */
export function fichesToCsv(fiches, scores = null) {
  const cols = [["Entreprise", (f) => f.nom], ["SIREN", (f) => f.siren], ["Commune", (f) => f.commune], ["Dirigeant(s) (annuaire officiel)", (f) => (f.dirigeants || []).map((d) => [d.nom, d.qualite && `(${d.qualite})`].filter(Boolean).join(" ")).join(" ; ")],
    ["Lien Google Maps", (f) => f.google?.lien_google_maps], ["Correspondance Google", (f) => f.google?.statut], ["Téléphone", (f) => f.telephone], ["Source du téléphone", (f) => f.telephone_source], ["E-mail", (f) => (f.emails || []).join(" ; ")], ["Source de l'e-mail", (f) => f.email_source], ["Site web", (f) => f.site_web], ["Lien annuaire", (f) => f.source_url]];
  if (scores instanceof Map && scores.size) cols.unshift(["Note /20", (f) => scores.get(String(f.siren))?.note], ["Preuve (%)", (f) => scores.get(String(f.siren))?.preuve], ["Distance (km)", (f) => scores.get(String(f.siren))?.distance_km]);
  const rows = [cols.map(([l]) => csvCell(l)).join(";")];
  for (const f of Array.isArray(fiches) ? fiches : []) rows.push(cols.map(([, get]) => csvCell(get(f))).join(";"));
  return "\uFEFF" + rows.join("\r\n") + "\r\n";
}

/**
 * Transforme les codes NAF cochés par l'administrateur × les départements retenus en demandes « prospects ».
 * Jamais plus de MAX_RECHERCHES demandes d'un coup ; chaque demande reste soumise à validation humaine.
 */
export function buildProspectsFromAnalysis({ organizationId, nafs, departements, marcheObjet, communeChantier, limite = 20, newKey }) {
  const codes = [...new Set(nafs ?? [])], depts = [...new Set(departements ?? [])];
  if (!codes.length || !depts.length) return { ok: false, message: "Cochez au moins un code NAF et un département." };
  if (codes.length * depts.length > MAX_RECHERCHES) return { ok: false, message: `Trop de recherches d'un coup (${codes.length * depts.length}). Maximum : ${MAX_RECHERCHES}. Décochez quelques codes ou départements.` };
  const bodies = [];
  for (const naf of codes) for (const departement of depts) {
    const b = buildProspectsPayload({ organizationId, naf, departement, limite, marcheObjet, communeChantier, idempotencyKey: newKey() });
    if (!b) return { ok: false, message: `Code ou département invalide : ${naf} / ${departement}.` };
    bodies.push(b);
  }
  return { ok: true, bodies };
}

const CSV_COLUMNS = Object.freeze([
  ["Entreprise", "nom"], ["SIREN", "siren"], ["SIRET (établissement)", "siret"], ["Établissement", "etablissement"], ["RGE", "rge"], ["Code NAF", "naf"], ["Adresse", "adresse"], ["Code postal", "code_postal"], ["Commune", "commune"],
  ["Département", "departement"], ["Zone", "zone"], ["Effectif (tranche)", "effectif"], ["Latitude", "latitude"], ["Longitude", "longitude"],
  ["Téléphone", "telephone"], ["E-mail", "email"], ["Google Maps", "google_maps"], ["Source", "source"], ["Lien source", "source_url"], ["Collecté le", "collecte_le"]
]);
// Protège contre l'exécution de formules à l'ouverture dans un tableur (=, +, -, @).
const csvCell = (value) => {
  let t = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(t)) t = "'" + t;
  return /[;"\r\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
};
/** CSV lisible par Excel (séparateur « ; », UTF-8 avec BOM) et importable dans Google Sheets. */
const SCORE_COLUMNS = Object.freeze([["Note /20 (provisoire)", "score_note"], ["Preuve %", "score_preuve"], ["Étiquette", "score_etiquette"], ["Distance du chantier (km, à vol d'oiseau)", "distance_km"]]);
export function prospectsToCsv(companies) {
  const list = Array.isArray(companies) ? companies : [];
  const cols = list.some((c) => c?.score) ? [...SCORE_COLUMNS, ...CSV_COLUMNS] : CSV_COLUMNS;
  const rows = [cols.map(([label]) => csvCell(label)).join(";")];
  for (const c of list) rows.push(cols.map(([, key]) => csvCell(key === "score_note" ? c?.score?.note : key === "score_preuve" ? c?.score?.preuve : key === "score_etiquette" ? c?.score?.etiquette : c?.[key])).join(";"));
  return "\uFEFF" + rows.join("\r\n") + "\r\n";
}
export const prospectsFilename = (criteres, now = new Date()) => `prospects-sous-traitance-${String(criteres?.naf ?? "naf").replace(".", "")}-dep${criteres?.departement ?? "xx"}-${now.toISOString().slice(0, 10)}.csv`;

export const buildDecisionPayload = ({ organizationId, approvalId, decision, note }) => {
  if (!["approved", "rejected"].includes(decision)) return null;
  const p = { organization_id: organizationId, approval_id: approvalId, decision };
  const n = String(note ?? "").trim();
  if (n) p.decision_note = n.slice(0, 2000);
  return p;
};

// Appelle une API avec le jeton de session ; renvoie { ok, status, data, message }.
export async function callApi(fetchImpl, { baseUrl, key, token, body }) {
  let response;
  try {
    response = await fetchImpl(functionUrl(baseUrl, key), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
  } catch {
    return { ok: false, status: 0, data: null, message: "Le service est injoignable. Vérifiez votre connexion." };
  }
  let data = null;
  try { data = await response.json(); } catch { /* corps vide */ }
  if (response.ok && data?.ok !== false) return { ok: true, status: response.status, data, message: "" };
  return { ok: false, status: response.status, data, message: errorMessage(data?.error) };
}

// ---- Mes chantiers à reprendre : une entreprise (SIREN) cherche des chantiers en sous-traitance ----
// Mots à chercher dans l'objet des marchés attribués, selon le métier (code NAF) de l'entreprise.
export const METIERS_CHANTIER = Object.freeze({
  "43.22A": { nom: "Plomberie – sanitaire", mots: ["plomberie", "sanitaire"] },
  "43.22B": { nom: "Chauffage – ventilation – climatisation", mots: ["chauffage", "climatisation", "ventilation"] },
  "43.21A": { nom: "Électricité", mots: ["électricité", "électrique"] },
  "43.21B": { nom: "Électricité sur la voie publique", mots: ["éclairage public", "électrification"] },
  "43.11Z": { nom: "Démolition", mots: ["démolition", "déconstruction"] },
  "39.00Z": { nom: "Désamiantage – dépollution", mots: ["désamiantage", "amiante"] },
  "43.32A": { nom: "Menuiserie bois et PVC", mots: ["menuiserie", "fenêtres"] },
  "43.32B": { nom: "Menuiserie métallique – serrurerie", mots: ["serrurerie", "métallerie"] },
  "43.31Z": { nom: "Plâtrerie", mots: ["plâtrerie", "cloisons"] },
  "43.29A": { nom: "Isolation", mots: ["isolation"] },
  "43.34Z": { nom: "Peinture – vitrerie", mots: ["peinture"] },
  "43.33Z": { nom: "Revêtement de sols et murs", mots: ["revêtement", "carrelage"] },
  "43.99C": { nom: "Maçonnerie – gros œuvre", mots: ["maçonnerie", "gros œuvre"] },
  "43.91A": { nom: "Charpente", mots: ["charpente"] },
  "43.91B": { nom: "Couverture", mots: ["couverture", "toiture"] },
  "42.21Z": { nom: "Réseaux d'eau – assainissement", mots: ["assainissement", "réseaux"] },
  "43.12A": { nom: "Terrassement", mots: ["terrassement"] },
  "42.11Z": { nom: "Voirie", mots: ["voirie", "chaussée"] },
});
const EFFECTIF_MILIEU = Object.freeze({ "01": 1.5, "02": 4, "03": 7.5, 11: 15, 12: 35, 21: 75, 22: 150, 31: 225, 32: 375, 41: 750, 42: 1500, 51: 3500, 52: 7500, 53: 10000 });
export const SIREN_RE = /^\d{9}$/;

export function entrepriseDepuisAnnuaire(r) {
  if (!r || !/^\d{9}$/.test(String(r.siren ?? ""))) return null;
  const naf = String(r.activite_principale ?? r.siege?.activite_principale ?? "").toUpperCase();
  const dep = String(r.siege?.departement ?? "").toUpperCase() || (String(r.siege?.code_postal ?? "").startsWith("97") ? String(r.siege.code_postal).slice(0, 3) : String(r.siege?.code_postal ?? "").slice(0, 2));
  return { siren: String(r.siren), nom: String(r.nom_complet ?? "").slice(0, 140), naf, departement: dep, tranche: String(r.tranche_effectif_salarie ?? ""), effectif: EFFECTIF_MILIEU[String(r.tranche_effectif_salarie ?? "")] ?? null, metier: METIERS_CHANTIER[naf]?.nom ?? null };
}

const critere = (cle, libelle, points, max, etat, detail) => ({ cle, libelle, points, max, etat, detail });

// Note de chances /20 (provisoire). Les critères non évaluables sont exclus du calcul.
export function noteChantier(marche, entreprise, now = new Date()) {
  const criteres = [];
  const mots = METIERS_CHANTIER[entreprise?.naf]?.mots ?? [];
  const objet = String(marche?.object ?? "").toLowerCase();
  const trouve = mots.find((m) => objet.includes(m.toLowerCase()));
  criteres.push(trouve ? critere("metier", "Métier", 5, 5, "confirmé", `Le marché parle de « ${trouve} »`) : critere("metier", "Métier", 2, 5, "en partie", "Marché trouvé par recherche large"));
  const memeDep = entreprise?.departement && marche?.buyer_dept === entreprise.departement;
  criteres.push(memeDep ? critere("proximite", "Proximité", 5, 5, "confirmé", `Acheteur dans votre département (${entreprise.departement})`) : critere("proximite", "Proximité", 1, 5, "en partie", `Acheteur hors de votre département (${marche?.buyer_dept || "?"})`));
  const montant = Number(marche?.amount), flag = marche?.amount_flag;
  if (Number.isFinite(montant) && montant > 0 && flag !== "suspect" && flag !== "aberrant" && entreprise?.effectif) {
    const mois = Number(marche?.duration_months), annuel = Number.isFinite(mois) && mois >= 12 ? (montant * 12) / mois : montant;
    const ratio = Math.round(annuel / entreprise.effectif);
    const pts = ratio <= 40000 ? 5 : ratio <= 100000 ? 3 : 1;
    criteres.push(critere("taille", "Taille du marché pour vous", pts, 5, "en partie", `Environ ${ratio.toLocaleString("fr-FR")} € par salarié et par an (effectif estimé ${entreprise.effectif})`));
  } else criteres.push(critere("taille", "Taille du marché pour vous", 0, 5, "non évalué", "Montant ou effectif inconnu"));
  criteres.push(marche?.subcontracting_declared ? critere("sous_traitance", "Sous-traitance déjà prévue", 3, 3, "confirmé", "Une sous-traitance est déclarée dans ce marché") : critere("sous_traitance", "Sous-traitance déjà prévue", 0, 3, "non prouvé", "Aucune sous-traitance déclarée (ne veut pas dire qu'il n'y en aura pas)"));
  const age = (new Date(now).getTime() - Date.parse(marche?.awarded_on ?? "")) / 86400000;
  criteres.push(Number.isFinite(age) ? (age <= 90 ? critere("fraicheur", "Marché récent", 2, 2, "confirmé", "Attribué il y a moins de 3 mois") : critere("fraicheur", "Marché récent", 1, 2, "en partie", "Attribué il y a 3 à 12 mois")) : critere("fraicheur", "Marché récent", 0, 2, "non évalué", "Date inconnue"));
  const ok = criteres.filter((c) => c.etat !== "non évalué");
  const max = ok.reduce((s, c) => s + c.max, 0), pts = ok.reduce((s, c) => s + c.points, 0);
  return { note: max ? Math.round((pts / max) * 200) / 10 : 0, criteres };
}

export function classerChantiers(marches, entreprise, now = new Date()) {
  const vus = new Set();
  return (marches ?? []).filter((m) => m?.contract_uid && !vus.has(m.contract_uid) && vus.add(m.contract_uid))
    .map((m) => ({ marche: m, score: noteChantier(m, entreprise, now) }))
    .sort((a, b) => b.score.note - a.score.note);
}
