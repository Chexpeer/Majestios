import type { ContextualEvent } from "./catalog";

export type SearchContext = {
  keyword: string;
  location: string;
  type: string;
};

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();

const BUILDING_TERMS = ["batiment", "construction", "travaux", "artisan", "renovation", "chantier"];

export function selectContextualEvents(
  context: SearchContext,
  events: ContextualEvent[],
  now = new Date(),
): ContextualEvent[] {
  const keyword = normalize(context.keyword);
  const type = normalize(context.type);
  const location = normalize(context.location);

  if (!keyword && (!type || type === "all")) return [];

  const buildingIntent =
    BUILDING_TERMS.some((term) => keyword.includes(term)) ||
    type === "travaux";

  if (!buildingIntent) return [];

  return events.filter((event) => {
    const end = new Date(event.endsAt);
    if (Number.isNaN(end.getTime()) || end < now) return false;
    const sectorsMatch = event.sectors.some((term) => keyword.includes(normalize(term)));
    const locationMatch =
      !location || event.regions.some((region) => normalize(region).includes(location) || location.includes(normalize(region)));
    return sectorsMatch && locationMatch;
  });
}
