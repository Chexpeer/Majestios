/**
 * Annonces de salons diffusables dans le flux d'accueil.
 *
 * Chaque fiche doit être vérifiée auprès d'une source officielle.
 * La date de vérification est conservée pour inciter à contrôler les
 * informations avant déplacement ou inscription.
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

export const salonEvents: SalonEvent[] = [
  {
    slug: "expoprotection-2026",
    title: "Expoprotection 2026",
    startDate: "2026-11-03",
    endDate: "2026-11-05",
    venue: "Paris Expo Porte de Versailles · Pavillon 1",
    city: "Paris",
    summary: "Salon professionnel consacré à la prévention et à la maîtrise des risques professionnels et industriels.",
    officialUrl: "https://www.expoprotection.com/fr-fr/infos-pratiques/horaires-acces-et-hotels.html",
    verifiedAt: "2026-10-29"
  },
  {
    slug: "urbest-2027",
    title: "URBEST 2027",
    startDate: "2027-01-13",
    endDate: "2027-01-14",
    venue: "Parc des Expositions de Metz",
    city: "Metz",
    summary: "Salon professionnel des décideurs de l’espace public du Grand Est, destiné notamment aux collectivités, entreprises et partenaires institutionnels.",
    officialUrl: "https://www.urbest.fr/",
    verifiedAt: "2026-10-29"
  },
  {
    slug: "intermat-2027",
    title: "INTERMAT Paris 2027",
    startDate: "2027-04-21",
    endDate: "2027-04-24",
    venue: "Parc des Expositions Paris-Nord Villepinte",
    city: "Villepinte",
    summary: "Salon international des solutions et technologies pour la construction, les travaux publics, les équipements et les matériels de chantier.",
    officialUrl: "https://www.intermatconstruction.com/fr-FR/intermat/presentation-du-salon",
    verifiedAt: "2026-10-29"
  }
];

export function getSalonEvent(slug: string): SalonEvent | undefined {
  return salonEvents.find((event) => event.slug === slug);
}
