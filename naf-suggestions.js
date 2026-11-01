/* Suggestions indicatives APE/NAF à partir de mots-clés de marché.
   Elles orientent une vérification humaine et ne déclenchent aucune recherche ni action externe. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MajestiosNafSuggestions = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const normalizeText = (value) => String(value == null ? "" : value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  const RULES = [
    { code: "43.21A", label: "Installation électrique", keywords: ["electricite", "installation electrique", "reseau electrique", "eclairage", "courant fort", "courant faible", "renovation energetique"] },
    { code: "43.22A", label: "Plomberie et installations sanitaires", keywords: ["plomberie", "sanitaire", "reseau eau", "canalisation", "robinetterie"] },
    { code: "43.22B", label: "Chauffage, ventilation et climatisation", keywords: ["chauffage", "climatisation", "pompe a chaleur", "ventilation", "cvc", "equipement thermique", "renovation energetique"] },
    { code: "43.99C", label: "Maçonnerie et gros œuvre", keywords: ["maconnerie", "gros oeuvre", "beton arme", "fondation", "mur porteur"] },
    { code: "43.32A", label: "Menuiserie bois et PVC", keywords: ["menuiserie", "fenetre", "porte", "volet", "agencement bois", "renovation energetique"] },
    { code: "43.34Z", label: "Peinture et vitrerie", keywords: ["peinture", "peintre", "vitrerie", "ravalement", "revetement mural"] },
    { code: "43.91B", label: "Couverture", keywords: ["couverture", "couvreur", "toiture", "tuile", "ardoise"] },
    { code: "43.12A", label: "Terrassement", keywords: ["terrassement", "excavation", "nivellement", "plateforme chantier"] },
    { code: "43.99A", label: "Étanchéification", keywords: ["etancheite", "etancheification", "infiltration toiture"] },
    { code: "43.29A", label: "Travaux d’isolation", keywords: ["isolation thermique", "isolation des combles", "isolation facade", "renovation energetique"] },
    { code: "81.21Z", label: "Nettoyage courant des bâtiments", keywords: ["nettoyage", "menage", "entretien locaux", "proprete", "nettoyage bureaux"] },
    { code: "81.30Z", label: "Services d’aménagement paysager", keywords: ["espaces verts", "paysagiste", "entretien jardin", "elagage", "plantation"] },
    { code: "62.01Z", label: "Programmation informatique", keywords: ["developpement logiciel", "developpement web", "application informatique", "programmation", "site internet"] },
    { code: "62.02A", label: "Conseil en systèmes et logiciels informatiques", keywords: ["conseil informatique", "architecture informatique", "systeme informatique", "audit informatique"] },
    { code: "62.02B", label: "Tierce maintenance informatique", keywords: ["maintenance informatique", "infogerance", "support informatique", "maintenance applicative"] },
    { code: "85.59A", label: "Formation continue d’adultes", keywords: ["formation professionnelle", "formation continue", "formation adultes", "formation entreprise"] },
    { code: "70.22Z", label: "Conseil pour les affaires et autres conseils de gestion", keywords: ["conseil en gestion", "strategie entreprise", "accompagnement entreprise", "organisation", "etude de marche"] },
    { code: "71.11Z", label: "Activités d’architecture", keywords: ["architecte", "architecture", "maitrise d oeuvre", "conception architecturale"] },
    { code: "71.12B", label: "Ingénierie, études techniques", keywords: ["ingenierie", "etude technique", "bureau etudes", "diagnostic technique", "maitrise d oeuvre technique"] },
    { code: "73.11Z", label: "Activités des agences de publicité", keywords: ["communication", "publicite", "campagne marketing", "creation graphique", "communication digitale"] },
    { code: "80.10Z", label: "Activités de sécurité privée", keywords: ["securite privee", "gardiennage", "surveillance humaine", "agent de securite"] },
    { code: "49.41B", label: "Transports routiers de fret de proximité", keywords: ["transport de marchandises", "livraison", "transport routier", "fret de proximite"] }
  ];

  function suggestNafCodes(text, options) {
    const normalized = normalizeText(text);
    const limit = Number.isInteger(options && options.limit) ? Math.max(1, Math.min(options.limit, 10)) : 6;
    if (!normalized) return [];
    const words = normalized.split(" ");
    return RULES.map((rule) => {
      const matches = rule.keywords.filter((keyword) => {
        const phrase = normalizeText(keyword);
        return phrase.includes(" ") ? (" " + normalized + " ").includes(" " + phrase + " ") : words.includes(phrase);
      });
      return { code: rule.code, label: rule.label, matches, matchCount: matches.length, confidence: matches.length >= 2 ? "plusieurs indices lexicaux" : "indice lexical unique" };
    })
      .filter((item) => item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount || a.code.localeCompare(b.code, "fr"))
      .slice(0, limit)
      .map(({ code, label, matches, matchCount, confidence }) => ({ code, label, matches, matchCount, confidence }));
  }

  return { normalizeText, suggestNafCodes, rulesCount: RULES.length };
});
