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
  region: string;
  sectors: string[];
  summary: string;
  officialUrl: string;
  registrationUrl?: string;
  verifiedAt: string;
};

export const salonEvents: SalonEvent[] = [
  {
    slug: "euro-industries-2026",
    title: "Euro Industries 2026",
    startDate: "2026-11-17",
    endDate: "2026-11-18",
    venue: "Parc Expo Mulhouse",
    city: "Mulhouse",
    region: "Grand Est",
    sectors: ["Industrie", "Innovation", "Technologies", "Performance industrielle"],
    summary: "Rendez-vous B2B des solutions industrielles : automatisation, IA, cybersécurité, équipements, performance et transition énergétique. L’organisateur annonce des rendez-vous d’affaires et une inscription visiteur gratuite.",
    officialUrl: "https://www.euroindustries.eu/fr",
    registrationUrl: "https://www.euroindustries.eu/registration/formulaire-d-inscription-new-",
    verifiedAt: "2026-10-29"
  },
  {
    slug: "salon-des-maires-2026",
    title: "Salon des Maires et des Collectivités Locales 2026",
    startDate: "2026-11-24",
    endDate: "2026-11-26",
    venue: "Paris Expo Porte de Versailles · Pavillon 7",
    city: "Paris",
    region: "Île-de-France",
    sectors: ["Prévention", "Sécurité", "Risques professionnels", "Industrie"],
    region: "Île-de-France",
    sectors: ["Collectivités", "Commande publique", "Territoires", "Services aux collectivités"],
    summary: "Rendez-vous des élus, décideurs publics et partenaires des collectivités. Une occasion de repérer les projets territoriaux et de rencontrer les acteurs de la commande publique.",
    officialUrl: "https://www.salondesmaires.com/",
    verifiedAt: "2026-10-29"
  },
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
    region: "Grand Est",
    sectors: ["Collectivités", "Espace public", "Aménagement", "Services aux territoires"],
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
    region: "Île-de-France",
    sectors: ["BTP", "Travaux publics", "Équipements", "Matériel de chantier"],
    summary: "Salon international des solutions et technologies pour la construction, les travaux publics, les équipements et les matériels de chantier.",
    officialUrl: "https://www.intermatconstruction.com/fr-FR/intermat/presentation-du-salon",
    verifiedAt: "2026-10-29"
  }
];

export function getSalonEvent(slug: string): SalonEvent | undefined {
  return salonEvents.find((event) => event.slug === slug);
}
