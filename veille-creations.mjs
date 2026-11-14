// Règles de la veille des créations d'entreprises (BODACC) — module pur, sans accès réseau.
// Les secteurs sont repérés par mots-clés dans la description de l'activité : le BODACC ne fournit pas de code NAF.

export const ZONES = Object.freeze({
  idf: ["75", "77", "78", "91", "92", "93", "94", "95"],
  normandie: ["14", "27", "50", "61", "76"],
  pdl: ["44", "49", "53", "72", "85"],
  bretagne: ["22", "29", "35", "56"]
});

export const CREATION_FAMILIES = Object.freeze(["Créations", "Immatriculations"]);

export const SECTORS = Object.freeze({
  batiment: Object.freeze({
    label: "Bâtiment (tous corps d’état)",
    keywords: Object.freeze([
      "bâtiment", "maçonnerie", "gros oeuvre", "plomberie", "chauffage", "climatisation", "électricité",
      "peinture", "menuiserie", "charpente", "couverture", "zinguerie", "carrelage", "plâtrerie", "isolation",
      "étanchéité", "rénovation", "terrassement", "serrurerie", "façade", "ravalement", "revêtement", "démolition",
      "construction", "aménagement intérieur", "vitrerie"
    ])
  }),
  hotellerie: Object.freeze({
    label: "Hôtellerie et restauration",
    keywords: Object.freeze([
      "restaurant", "restauration", "hôtel", "hôtellerie", "traiteur", "brasserie", "café", "débit de boissons",
      "bar", "pizzeria", "snack", "crêperie", "hébergement", "chambre d'hôtes", "camping", "food truck", "kebab"
    ])
  })
});

export function quoteValue(value) {
  return "'" + String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
}

/** Clause de filtre ODS pour un secteur, appliquée au texte de l'activité de l'établissement. */
export function sectorClause(sectorKey, field = "listeetablissements") {
  const sector = SECTORS[sectorKey];
  if (!sector) return "";
  return "(" + sector.keywords.map((word) => "search(" + field + ", " + quoteValue(word) + ")").join(" OR ") + ")";
}

export function familyClause(value) {
  if (value === "__creations") return "familleavis_lib IN (" + CREATION_FAMILIES.map(quoteValue).join(",") + ")";
  return value ? "familleavis_lib = " + quoteValue(value) : "";
}

function parseJsonField(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try { return JSON.parse(value); } catch { return null; }
}

function firstOf(value) {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Extrait d'une annonce de création les seules informations utiles à la prospection.
 * Pour une personne physique (entrepreneur individuel), aucune adresse n'est reprise :
 * elle peut correspondre à un domicile.
 */
export function parseCreation(item = {}) {
  const person = firstOf(parseJsonField(item.listepersonnes)?.personne);
  const establishment = firstOf(parseJsonField(item.listeetablissements)?.etablissement);
  const act = parseJsonField(item.acte);
  const isIndividual = person?.typePersonne === "pp";
  const activity = typeof establishment?.activite === "string" ? establishment.activite.trim() : "";
  return {
    isIndividual,
    kindLabel: isIndividual ? "Entrepreneur individuel" : "Société",
    activity,
    registrationDate: act?.dateImmatriculation || "",
    startDate: act?.dateCommencementActivite || "",
    place: item.ville || ""
  };
}
