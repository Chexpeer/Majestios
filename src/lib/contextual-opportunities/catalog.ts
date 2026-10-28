export type ContextualEvent = {
  id: string;
  title: string;
  summary: string;
  sectors: string[];
  regions: string[];
  startsAt: string;
  endsAt: string;
  locationLabel: string;
  officialUrl?: string;
  status: "demo" | "verified";
  sponsored?: boolean;
};

export const contextualEventCatalog: ContextualEvent[] = [
  {
    id: "demo-construction-event",
    title: "Exemple de salon professionnel du bâtiment",
    summary: "Exemple de carte pour tester une recommandation liée au secteur de la construction.",
    sectors: ["batiment", "construction", "travaux", "artisan"],
    regions: ["nantes", "loire-atlantique", "44"],
    startsAt: "2099-03-15",
    endsAt: "2099-03-16",
    locationLabel: "Lieu fictif — à remplacer par une source vérifiée",
    status: "demo",
  },
];
