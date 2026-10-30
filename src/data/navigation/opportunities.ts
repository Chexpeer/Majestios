import type { SiteNode } from "./types";

export const opportunitiesNode: SiteNode = { label: "Opportunités", href: "/opportunites", description: "Explorer les marchés, les salons, l’emploi et les occasions de développement.", children: [
    { label: "Marchés publics", href: "/opportunites/marches-publics", description: "Repérer et qualifier les consultations publiques.", children: [
      { label: "Travaux", href: "/opportunites/marches-publics/travaux", description: "Marchés et consultations de travaux." },
      { label: "Services", href: "/opportunites/marches-publics/services", description: "Prestations intellectuelles et services." },
      { label: "Fournitures", href: "/opportunites/marches-publics/fournitures", description: "Achats et fournitures professionnelles." },
      { label: "Par département", href: "/opportunites/marches-publics/departement", description: "Explorer les consultations par territoire." }
    ]},
    { label: "Marchés privés", href: "/opportunites/marches-prives", description: "Découvrir les consultations privées publiées avec autorisation.", status: "preparing", children: [
      { label: "Par secteur", href: "/opportunites/marches-prives/secteur", description: "Explorer les besoins par secteur d’activité.", status: "preparing" },
      { label: "Déposer une annonce", href: "/opportunites/marches-prives/deposer", description: "Parcours de dépôt documenté ; le formulaire de publication n’est pas encore activé.", status: "preparing" }
    ]},
    { label: "Salons professionnels", href: "/opportunites/salons", description: "Préparer une visite et repérer les opportunités liées.", children: [
      { label: "Calendrier", href: "/opportunites/salons/calendrier", description: "Consulter les rendez-vous professionnels validés." },
      { label: "Préparer une visite", href: "/opportunites/salons/preparer", description: "Définir ses objectifs, qualifier les rencontres et organiser le suivi." },
      { label: "Par secteur", href: "/opportunites/salons/secteur", description: "Explorer les salons par domaine." },
      { label: "Par région", href: "/opportunites/salons/region", description: "Explorer les salons par territoire." }
    ]},
    { label: "Emploi et missions", href: "/opportunites/emploi", description: "Explorer les parcours d’emploi, de missions et de contribution à MajestiOS ; les flux d’annonces attendent la connexion de sources vérifiées.", status: "pending_data", children: [
      { label: "Offres d’emploi", href: "/opportunites/emploi/offres", description: "Guide de qualification disponible ; le flux de recherche attend la connexion de sources vérifiées.", status: "pending_data" },
      { label: "Missions", href: "/opportunites/emploi/missions", description: "Guide de qualification disponible ; le flux d’annonces attend la connexion de sources vérifiées.", status: "pending_data" },
      { label: "Métiers", href: "/opportunites/emploi/metiers", description: "Guides métiers fondés sur des informations vérifiables." },
      { label: "Nous rejoindre", href: "/nous-rejoindre", description: "Découvrir les façons de contribuer au développement de MajestiOS." },
      { label: "Déposer une offre", href: "/opportunites/emploi/deposer-une-offre", description: "Parcours de dépôt prévu ; aucun formulaire de publication d’offre n’est encore activé.", status: "preparing" },
      { label: "Conseils", href: "/opportunites/emploi/conseils", description: "Préparer sa candidature ou son recrutement." }
    ]}
  ]};
