// Retour vers le service d'origine après connexion ou création de l'espace personnel.
// Seules des clés connues sont acceptées (jamais une adresse libre) : pas de redirection ouverte.
export const RETOURS = Object.freeze({
  annonces: "sous-traitance.html#deposer",
  audit: "reputation-virtuelle.html",
  accompagnement: "accompagnement-appels-offres.html"
});

/** Clé de retour trouvée dans une chaîne de recherche (« ?retour=annonces »), ou null. */
export function retourDepuisRecherche(search = "") {
  try {
    const key = new URLSearchParams(search).get("retour");
    return key && Object.hasOwn(RETOURS, key) ? key : null;
  } catch { return null; }
}

/** Page de destination pour une clé connue, sinon null. */
export function destinationRetour(key) {
  return key && Object.hasOwn(RETOURS, key) ? RETOURS[key] : null;
}
