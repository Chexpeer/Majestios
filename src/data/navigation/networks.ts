import type { SiteNode } from "./types";

export const networksNode: SiteNode = { label: "Réseaux", href: "/reseaux", description: "Développer des relations professionnelles utiles et des complémentarités entre acteurs.", children: [
    { label: "Annuaire professionnel", href: "/reseaux/annuaire", description: "Consulter les profils lorsque l’annuaire sera ouvert.", status: "preparing" },
    { label: "Rejoindre le réseau", href: "/reseaux/rejoindre", description: "Découvrir comment contribuer au réseau." }
  ]};
