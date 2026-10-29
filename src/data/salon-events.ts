/**
 * Annonces de salons diffusables dans le flux d'accueil.
 *
 * Ne publier ici que des événements vérifiés auprès d'une source fiable.
 * Une liste vide est volontaire : aucun salon n'est inventé ou présenté
 * comme confirmé tant qu'une fiche complète n'a pas été validée.
 */
export type SalonEvent = {
  slug: string;
  title: string;
  startDate: string;
  endDate?: string;
  venue: string;
  city: string;
  summary: string;
  officialUrl: string;
  registrationUrl?: string;
  verifiedAt: string;
};

export const salonEvents: SalonEvent[] = [];

export function getSalonEvent(slug: string): SalonEvent | undefined {
  return salonEvents.find((event) => event.slug === slug);
}
