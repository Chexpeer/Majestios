const GENERIC_TERMS = /\b(?:bodacc|rechercher|recherche|chercher|cherche|trouver|trouve|une|un|des|de|du|d|dans|sur|à|au|aux|cession|cessions|reprise|reprises|entreprise|entreprises|vente|vendre|fonds|commerce)\b/giu;

/** Extract a meaningful search criterion from a natural-language BODACC request. */
export function extractBodaccSearchTerm(value: string): string {
  return value
    .normalize("NFC")
    .replace(/[’‘]/g, "'")
    .replace(/\bd['’]\s*/giu, " ")
    .replace(GENERIC_TERMS, " ")
    // JavaScript \b is ASCII-oriented: remove the standalone French preposition explicitly.
    .replace(/(^|\\s)à(?=\\s)/giu, "$1 ")
    .replace(/[^\p{L}\p{N} .,'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
