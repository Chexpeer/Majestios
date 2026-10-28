import type { ContextualEvent } from "./catalog";

export type SearchContext = {
  keyword: string;
  location: string;
  type: string;
};

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();

const BUILDING_TERMS = ["batiment", "construction", "travaux", "artisan", "renovation", "chantier"];

function matchesLocation(event: ContextualEvent, rawLocation: string): boolean {
  const location = normalize(rawLocation);
  if (!location) return true;
  const regions = event.regions.map(normalize);
  // Le champ de recherche du site demande principalement un département (ex. 44).
  if (/^\d{2,3}$/.test(location)) {
    return regions.some((region) => region === location);
  }
  return regions.some((region) => region.includes(location) || location.includes(region));
}

export function selectContextualEvents(
  context: SearchContext,
  events: ContextualEvent[],
  now = new Date(),
): ContextualEvent[] {
  const keyword = normalize(context.keyword);
  const type = normalize(context.type);

  if (!keyword && (!type || type === "all")) return [];

  const buildingIntent =
    BUILDING_TERMS.some((term) => keyword.includes(term)) ||
    type === "travaux";

  if (!buildingIntent) return [];

  return events.filter((event) => {
    const end = new Date(event.endsAt);
    if (Number.isNaN(end.getTime()) || end < now) return false;
    const sectorsMatch = event.sectors.some((term) => keyword.includes(normalize(term)));
    return sectorsMatch && matchesLocation(event, context.location);
  });
}
