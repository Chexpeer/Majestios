// Mission Cheexpeer « pitch de sous-traitance » : règles pures (métiers complémentaires par code NAF, texte du pitch).
// Rien n'est envoyé ici : le pitch est un brouillon que le propriétaire valide. Voir docs/evolution-12/MISSION-CHEEXPEER-PITCH-SOUS-TRAITANCE-2026-11-21.md.

/** Métiers du bâtiment (code NAF → libellé court), tournés vers l'artisan à qui on s'adresse. */
export const METIERS = Object.freeze({
  "41.20A": "construction de maisons individuelles", "41.20B": "construction de bâtiments",
  "43.21A": "installation électrique", "43.21B": "installation électrique sur la voie publique",
  "43.22A": "plomberie (eau et gaz)", "43.22B": "chauffage, ventilation et climatisation",
  "43.29A": "isolation", "43.29B": "autres travaux d’installation",
  "43.31Z": "plâtrerie", "43.32A": "menuiserie bois et PVC", "43.32B": "menuiserie métallique et serrurerie",
  "43.33Z": "revêtement de sols et de murs", "43.34Z": "peinture et vitrerie", "43.39Z": "travaux de finition",
  "43.91A": "charpente", "43.91B": "couverture", "43.99A": "étanchéité", "43.99B": "structures métalliques",
  "43.99C": "maçonnerie et gros œuvre"
});

/** Point de départ à valider par le propriétaire : métier gagnant (NAF) → métiers à solliciter (NAF). */
export const COMPLEMENTAIRES = Object.freeze({
  "43.22B": ["43.21A", "43.22A", "43.29A"],
  "43.21A": ["43.22B", "43.22A", "43.91B"],
  "43.22A": ["43.22B", "43.21A", "43.99C"],
  "43.91B": ["43.21A", "43.99A", "43.91A"],
  "43.91A": ["43.91B", "43.99A", "43.21A"],
  "43.99C": ["43.21A", "43.22A", "43.31Z", "43.34Z", "43.33Z"],
  "43.29A": ["43.31Z", "43.34Z", "43.32A"],
  "43.31Z": ["43.34Z", "43.33Z", "43.21A"],
  "43.34Z": ["43.31Z", "43.33Z", "43.32A"],
  "41.20A": ["43.21A", "43.22A", "43.22B", "43.91B", "43.99C", "43.34Z"],
  "41.20B": ["43.21A", "43.22A", "43.22B", "43.91B", "43.99C", "43.34Z"]
});

const NAF = /^\d{2}\.\d{2}[A-Z]$/;
export const normalizeNaf = (value) => {
  const raw = String(value ?? "").trim().toUpperCase().replace(/\s/g, "");
  const dotted = /^\d{4}[A-Z]$/.test(raw) ? raw.slice(0, 2) + "." + raw.slice(2) : raw;
  return NAF.test(dotted) ? dotted : null;
};

/** Métiers complémentaires du code NAF de l'entreprise gagnante ; liste vide si le métier n'est pas encore décrit. */
export function complementaryTrades(winnerNaf) {
  const naf = normalizeNaf(winnerNaf);
  return (naf && COMPLEMENTAIRES[naf] ? COMPLEMENTAIRES[naf] : []).map((code) => ({ naf: code, label: METIERS[code] }));
}

const clean = (v, max = 200) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
const euros = (n) => (Number.isFinite(Number(n)) && Number(n) > 0 ? new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Number(n)) + " €" : "");

/** Brouillon de pitch pour un artisan d'un métier complémentaire. Aucune coordonnée personnelle, aucun envoi. */
export function buildPitch({ winner, object, buyer, commune, dept, amount, trade } = {}) {
  const w = clean(winner, 120), o = clean(object, 200), b = clean(buyer, 120), c = clean(commune, 80), d = clean(dept, 3), t = clean(trade, 80);
  if (!w || !o || !t) return null;
  const where = [c, d && "dép. " + d].filter(Boolean).join(", ");
  const sum = euros(amount);
  const lines = [
    "Bonjour,",
    "",
    `${w} vient de remporter le marché « ${o} »${b ? ` auprès de ${b}` : ""}${where ? ` (${where})` : ""}${sum ? `, pour un montant de ${sum}` : ""}.`,
    `Pour mener ce chantier près de chez vous, des partenaires locaux en ${t} peuvent être sollicités en sous-traitance.`,
    `Si votre entreprise intervient en ${t} dans ce secteur et souhaite se faire connaître, répondez à ce message : MajestiOS vous met en relation.`,
    "",
    "L’équipe MajestiOS"
  ];
  return lines.join("\n");
}
