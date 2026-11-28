// Accompagnement aux appels d'offres : note d'adéquation d'une entreprise avec un appel d'offres OUVERT (BOAMP) et liste des pièces à préparer.
// Logique pure (sans page ni réseau) : testée dans tests/chances-ao.test.mjs. La note classe, elle ne prédit pas le résultat.
import { METIERS_CHANTIER, regionDe } from "./cheexpeer-command.mjs";

const critere = (cle, libelle, points, max, etat, detail) => ({ cle, libelle, points, max, etat, detail });
const texte = (v) => (v == null ? "" : Array.isArray(v) ? v.map(texte).join(" ") : typeof v === "object" ? Object.values(v).map(texte).join(" ") : String(v));

export function joursRestants(avis, now = new Date()) {
  const t = Date.parse(avis?.datelimitereponse ?? "");
  if (!Number.isFinite(t)) return null;
  return Math.ceil((t - new Date(now).getTime()) / 86400000);
}

const pad = (d) => (/^\d$/.test(d) ? "0" + d : d);
// Départements de l'avis (liste, parfois sans zéro initial : « 1 » pour 01).
export function departementsAvis(avis) {
  const brut = avis?.code_departement_prestation || avis?.code_departement || [];
  const liste = Array.isArray(brut) ? brut : String(brut).replace(/[\[\]"\s]/g, "").split(",");
  return liste.map((d) => pad(String(d).trim().toUpperCase())).filter(Boolean);
}
// Département retenu : le vôtre s'il figure dans l'avis, sinon un de votre région (si fournie), sinon le premier.
export function departementAvis(avis, monDep, memeRegion) {
  const l = departementsAvis(avis);
  if (monDep && l.includes(monDep)) return monDep;
  return (memeRegion && l.find(memeRegion)) || l[0] || "";
}

// Note /20 : métier (5), proximité (5/3/1), délai pour répondre (3). Les critères non évaluables sont exclus du calcul.
export function noteAppelOffres(avis, entreprise, now = new Date()) {
  const criteres = [];
  const mots = (entreprise?.mots ?? METIERS_CHANTIER[entreprise?.naf]?.mots ?? []).filter(Boolean);
  const objet = (texte(avis?.objet) + " " + texte(avis?.descripteur_libelle)).toLowerCase();
  const trouve = mots.find((m) => objet.includes(String(m).toLowerCase()));
  criteres.push(trouve
    ? critere("metier", "Métier", 5, 5, "confirmé", `L'avis parle de « ${trouve} »`)
    : critere("metier", "Métier", 2, 5, "en partie", "Avis trouvé par recherche large : le lien avec votre métier est à confirmer dans le dossier"));

  const monDep = entreprise?.departement, rg = regionDe(monDep);
  const dep = departementAvis(avis, monDep, rg ? (d) => regionDe(d) === rg : null);
  const memeDep = Boolean(monDep) && dep === monDep;
  const memeRegion = !memeDep && Boolean(regionDe(monDep)) && regionDe(monDep) === regionDe(dep);
  criteres.push(memeDep
    ? critere("proximite", "Proximité", 5, 5, "confirmé", `Chantier dans votre département (${monDep})`)
    : memeRegion
      ? critere("proximite", "Proximité", 3, 5, "en partie", `Chantier dans votre région (département ${dep})`)
      : critere("proximite", "Proximité", 1, 5, "en partie", `Chantier hors de votre région (département ${dep || "inconnu"})`));

  const j = joursRestants(avis, now);
  if (j === null) criteres.push(critere("delai", "Temps pour répondre", 0, 3, "non évalué", "Date limite non renseignée : à vérifier dans l'avis"));
  else if (j >= 21) criteres.push(critere("delai", "Temps pour répondre", 3, 3, "confirmé", `${j} jours : le temps de monter un dossier sérieux`));
  else if (j >= 10) criteres.push(critere("delai", "Temps pour répondre", 2, 3, "en partie", `${j} jours : il faut s'y mettre rapidement`));
  else if (j >= 0) criteres.push(critere("delai", "Temps pour répondre", 1, 3, "en partie", `${j} jour(s) seulement : délai très court`));
  else criteres.push(critere("delai", "Temps pour répondre", 0, 3, "contradictoire", "La date limite est dépassée"));

  const ok = criteres.filter((c) => c.etat !== "non évalué");
  const max = ok.reduce((s, c) => s + c.max, 0), pts = ok.reduce((s, c) => s + c.points, 0);
  return { note: max ? Math.round((pts / max) * 200) / 10 : 0, criteres };
}

// Appels d'offres ouverts, dédoublonnés, triés par note puis par date limite la plus proche.
export function classerAppels(avisListe, entreprise, now = new Date()) {
  const vus = new Set();
  return (avisListe ?? [])
    .filter((a) => a && (a.idweb || a.id) && !vus.has(a.idweb || a.id) && vus.add(a.idweb || a.id))
    .filter((a) => { const j = joursRestants(a, now); return j === null || j >= 0; })
    .map((a) => ({ avis: a, score: noteAppelOffres(a, entreprise, now), jours: joursRestants(a, now) }))
    .sort((x, y) => y.score.note - x.score.note || (x.jours ?? 9999) - (y.jours ?? 9999));
}

// Pièces habituellement demandées à une entreprise candidate. Le règlement de consultation de l'avis fait toujours foi.
export function piecesAPreparer(avis) {
  const type = String(avis?.type_marche ?? "").toUpperCase();
  const pieces = [
    { id: "candidature", label: "Candidature : formulaire DC1 et DC2, ou DUME", aide: "Lettre de candidature et déclaration du candidat ; le DUME les remplace si l'acheteur l'accepte." },
    { id: "kbis", label: "Extrait Kbis récent", aide: "Moins de 3 mois en général." },
    { id: "attestations", label: "Attestations fiscales et sociales à jour", aide: "Attestation de vigilance URSSAF et attestation de régularité fiscale." },
    { id: "ca", label: "Chiffre d'affaires des 3 derniers exercices", aide: "Global et sur le domaine du marché." },
    { id: "references", label: "Références comparables avec attestations de bonne exécution", aide: "Des chantiers récents, de nature et de taille proches." },
    { id: "moyens", label: "Moyens humains et matériels", aide: "Effectifs, encadrement, matériel disponible pour ce chantier." },
    { id: "memoire", label: "Mémoire technique", aide: "Méthode, planning, moyens affectés, gestion des risques : souvent le critère le plus pondéré." },
    { id: "prix", label: "Offre de prix : acte d'engagement et prix détaillés", aide: "À chiffrer à partir du dossier de consultation (DPGF, BPU ou DQE)." }
  ];
  if (type === "TRAVAUX" || type === "") pieces.splice(4, 0,
    { id: "assurances", label: "Attestations d'assurance (responsabilité civile et décennale)", aide: "En cours de validité, avec les activités couvertes." },
    { id: "qualifications", label: "Qualifications ou certifications demandées", aide: "Par exemple Qualibat, RGE, Qualifelec, selon l'avis." });
  return pieces;
}

// Métier saisi librement (mots, ou code NAF/APE) → { naf, metier, mots } ou { erreur }.
const norm = (t) => String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
export function resoudreMetier(texteSaisi) {
  const brut = String(texteSaisi ?? "").trim(), t = norm(brut);
  if (t.length < 3) return { erreur: "Écrivez votre métier (3 lettres au moins) ou votre numéro SIREN." };
  const code = brut.toUpperCase().replace(/[\s.]/g, "").match(/^(\d{2})(\d{2})([A-Z])$/);
  if (code) {
    const naf = `${code[1]}.${code[2]}${code[3]}`;
    return METIERS_CHANTIER[naf] ? { naf, metier: METIERS_CHANTIER[naf].nom, mots: undefined } : { erreur: `Le code ${naf} n'est pas encore reconnu : écrivez votre métier avec vos mots.` };
  }
  const hit = Object.entries(METIERS_CHANTIER).find(([, m]) => norm(m.nom) === t || m.mots.some((w) => norm(w) === t) || norm(m.nom).includes(t));
  if (hit) return { naf: hit[0], metier: hit[1].nom, mots: undefined };
  const mots = [...new Set(brut.split(/[\s,;]+/).filter((w) => w.length >= 4).map((w) => w.slice(0, 40)))].slice(0, 3);
  return mots.length ? { naf: null, metier: brut.slice(0, 60), mots } : { naf: null, metier: brut.slice(0, 60), mots: [brut.slice(0, 40)] };
}
