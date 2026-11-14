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
      "construction", "aménagement intérieur", "vitrerie", "plombier", "électricien", "maçon", "peintre", "menuisier", "couvreur", "carreleur", "plâtrier", "chauffagiste"
    ])
  }),
  hotellerie: Object.freeze({
    label: "Hôtellerie et restauration",
    keywords: Object.freeze([
      "restaurant", "restauration", "hôtel", "hôtellerie", "traiteur", "brasserie", "café", "débit de boissons",
      "bar", "pizzeria", "snack", "crêperie", "hébergement", "chambre d'hôtes", "camping", "food truck", "kebab", "hôtelier", "restaurateur"
    ])
  })
});

export function quoteValue(value) {
  return "'" + String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
}

/** Clause de filtre ODS pour un secteur, appliquée au texte de l'activité de l'établissement. */
export function sectorClause(sectorKey, field = "listeetablissements") {
  if (sectorKey === "prioritaires") return "(" + Object.keys(SECTORS).map((key) => sectorClause(key, field)).join(" OR ") + ")";
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

function joinParts(parts, separator = " ") {
  return parts.map((part) => (part == null ? "" : String(part).trim())).filter(Boolean).join(separator);
}

function formatAddress(address) {
  if (!address || typeof address !== "object") return "";
  const street = joinParts([address.numeroVoie, address.typeVoie, address.nomVoie, address.complGeographique]);
  const city = joinParts([address.codePostal, address.ville]);
  return joinParts([street, city], ", ");
}

/**
 * Extrait d'une annonce de création le maximum d'éléments publiés par le BODACC :
 * identité (nom, prénom ou raison sociale), forme juridique, SIREN, adresse, activité, dates.
 * Lecture seule : rien n'est enregistré. Les règles de conservation et de prospection
 * seront validées par le service juridique avant tout lancement (voir VEILLE-02).
 */
export function parseCreation(item = {}) {
  const person = firstOf(parseJsonField(item.listepersonnes)?.personne);
  const establishment = firstOf(parseJsonField(item.listeetablissements)?.etablissement);
  const act = parseJsonField(item.acte);
  const isIndividual = person?.typePersonne === "pp";
  const activity = typeof establishment?.activite === "string" ? establishment.activite.trim() : "";
  const siren = String(firstOf(item.registre) ?? person?.numeroImmatriculation?.numeroIdentification ?? "").replace(/\s+/g, "");
  const address = formatAddress(establishment?.adresse) || formatAddress(person?.adresseSiegeSocial) || formatAddress(person?.adresse);
  return {
    isIndividual,
    kindLabel: isIndividual ? "Entrepreneur individuel" : "Société",
    lastName: isIndividual ? joinParts([person?.nom]) : "",
    firstName: isIndividual ? joinParts([person?.prenom]) : "",
    companyName: isIndividual ? "" : joinParts([person?.denomination, item.commercant && !person?.denomination ? item.commercant : ""]),
    legalForm: joinParts([person?.formeJuridique]),
    tradeName: joinParts([establishment?.enseigne, establishment?.nomCommercial], " · "),
    siren,
    address,
    activity,
    registrationDate: act?.dateImmatriculation || "",
    startDate: act?.dateCommencementActivite || "",
    place: item.ville || "",
    registry: joinParts([item.tribunal])
  };
}

/** Texte de détail d'une création, une information par segment. */
export function describeCreation(parsed, dateLabel = (value) => value) {
  const identity = parsed.isIndividual
    ? joinParts([parsed.firstName && "Prénom : " + parsed.firstName, parsed.lastName && "Nom : " + parsed.lastName], " · ")
    : joinParts([parsed.companyName && "Raison sociale : " + parsed.companyName, parsed.legalForm && "Forme : " + parsed.legalForm], " · ");
  return joinParts([
    identity,
    parsed.tradeName && "Enseigne : " + parsed.tradeName,
    parsed.siren && "SIREN : " + parsed.siren,
    parsed.address && "Adresse : " + parsed.address,
    parsed.activity && "Activité : " + parsed.activity,
    parsed.startDate && "Début d’activité : " + dateLabel(parsed.startDate),
    parsed.registrationDate && "Immatriculation : " + dateLabel(parsed.registrationDate),
    parsed.registry
  ], " · ");
}

function normalizeText(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/** Secteur détecté dans le texte de l'activité (mot entier, accents ignorés), ou "". */
export function detectSector(activity) {
  const text = normalizeText(activity);
  if (!text) return "";
  for (const [key, sector] of Object.entries(SECTORS)) {
    for (const keyword of sector.keywords) {
      const word = normalizeText(keyword).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp("(^|[^a-z0-9])" + word + "(s|x)?($|[^a-z0-9])").test(text)) return key;
    }
  }
  return "";
}

function daysBetween(dateText, now) {
  const time = Date.parse(dateText);
  if (Number.isNaN(time)) return null;
  return Math.floor((now.getTime() - time) / 86400000);
}

/**
 * Note de priorité (0–100) d'une création, par règles simples et lisibles — sans IA.
 * Chaque point attribué est expliqué dans `reasons`.
 */
export function scoreCreation(parsed, { now = new Date() } = {}) {
  let score = 0;
  const reasons = [];
  const sector = detectSector(parsed.activity);
  if (sector) { score += 30; reasons.push("Secteur " + SECTORS[sector].label.toLowerCase() + " (+30)"); }
  if (parsed.isIndividual) { score += 10; reasons.push("Entrepreneur individuel (+10)"); }
  else { score += 20; reasons.push("Société (+20)"); }
  const age = daysBetween(parsed.registrationDate, now);
  if (age !== null && age >= 0) {
    if (age <= 14) { score += 20; reasons.push("Immatriculée il y a " + age + " j (+20)"); }
    else if (age <= 30) { score += 15; reasons.push("Immatriculée il y a " + age + " j (+15)"); }
    else if (age <= 60) { score += 10; reasons.push("Immatriculée il y a " + age + " j (+10)"); }
  }
  if (/\d/.test(parsed.address) && /\b\d{5}\b/.test(parsed.address)) { score += 10; reasons.push("Adresse complète (+10)"); }
  if (parsed.activity.length >= 20) { score += 5; reasons.push("Activité décrite (+5)"); }
  if (/(internet|en ligne|a distance|à distance|livraison|e-commerce|site web)/i.test(parsed.activity)) { score += 10; reasons.push("Activité liée au web ou à la livraison (+10)"); }
  score = Math.min(100, score);
  const label = score >= 70 ? "Prioritaire" : score >= 45 ? "À considérer" : "Faible";
  return { score, label, reasons };
}
