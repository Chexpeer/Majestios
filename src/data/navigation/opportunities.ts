import type { SiteNode } from "./types";

export const opportunitiesNode: SiteNode = {
  label: "Opportunités",
  href: "/opportunites",
  description: "Choisir ce que l’on recherche : marchés publics, opportunités privées, emploi ou événements professionnels.",
  children: [
    {
      label: "Marchés publics",
      href: "/opportunites/marches-publics",
      description: "Explorer les consultations publiques par dossier et par besoin.",
      children: [
            {
              label: "Appels d’offres",
              href: "/opportunites/marches-publics/appels-offres",
              description: "Rechercher les avis et examiner les conditions avant de se positionner.",
              children: [
                { label: "Travaux", href: "/opportunites/marches-publics/appels-offres/travaux", description: "Chantiers, construction, rénovation et travaux spécialisés." },
                { label: "Services", href: "/opportunites/marches-publics/appels-offres/services", description: "Prestations, services récurrents et missions externalisées." },
                { label: "Fournitures", href: "/opportunites/marches-publics/appels-offres/fournitures", description: "Matériel, équipements, consommables et livraisons." }
              ]
            },
            { label: "Par département", href: "/opportunites/marches-publics/departement", description: "Explorer les consultations par territoire." }
          ]
    },
    {
      label: "Opportunités privées",
      href: "/opportunites/privees",
      description: "Découvrir les besoins d’entreprises, les consultations privées et les pistes commerciales à qualifier.",
      children: [
        {
          label: "Marchés privés",
          href: "/opportunites/marches-prives",
          description: "Explorer les consultations privées et les besoins explicitement publiés.",
          status: "preparing",
          children: [
            { label: "Par secteur", href: "/opportunites/marches-prives/secteur", description: "Explorer les besoins par secteur d’activité.", status: "preparing" },
            { label: "Proposer une annonce", href: "/opportunites/marches-prives/deposer", description: "Présenter une opportunité à vérifier avant diffusion.", status: "preparing" }
          ]
        },
        { label: "Radar des entreprises", href: "/opportunites/radar-entreprises", description: "Explorer les entreprises à qualifier comme pistes commerciales, sans supposer leurs besoins." },
        { label: "Signaux économiques", href: "/opportunites/signaux-entreprises", description: "Comprendre les signaux économiques avant d’en faire une hypothèse commerciale." }
      ]
    },
    {
      label: "Salons professionnels",
      href: "/opportunites/salons",
      description: "Repérer les rendez-vous professionnels et préparer des rencontres utiles.",
      children: [
        { label: "Calendrier", href: "/opportunites/salons/calendrier", description: "Consulter les rendez-vous professionnels référencés." },
        { label: "Préparer une visite", href: "/opportunites/salons/preparer", description: "Définir ses objectifs et organiser le suivi." },
        { label: "Par secteur", href: "/opportunites/salons/secteur", description: "Explorer les salons par domaine." },
        { label: "Par région", href: "/opportunites/salons/region", description: "Explorer les salons par territoire." }
      ]
    }
  ]
};
