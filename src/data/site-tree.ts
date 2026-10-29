export type SiteNode = {
  label: string;
  href: string;
  description: string;
  status?: "ready" | "preparing";
  children?: SiteNode[];
};

export const siteTree: SiteNode[] = [
  { label: "Accueil", href: "/", description: "Point d’entrée de MajestiOS." },
  { label: "Opportunités", href: "/opportunites", description: "Explorer les marchés, les salons, l’emploi et les occasions de développement.", children: [
    { label: "Marchés publics", href: "/opportunites/marches-publics", description: "Repérer et qualifier les consultations publiques.", children: [
      { label: "Travaux", href: "/opportunites/marches-publics/travaux", description: "Marchés et consultations de travaux." },
      { label: "Services", href: "/opportunites/marches-publics/services", description: "Prestations intellectuelles et services." },
      { label: "Fournitures", href: "/opportunites/marches-publics/fournitures", description: "Achats et fournitures professionnelles." },
      { label: "Par département", href: "/opportunites/marches-publics/departement", description: "Explorer les consultations par territoire." }
    ]},
    { label: "Marchés privés", href: "/opportunites/marches-prives", description: "Découvrir les consultations privées publiées avec autorisation.", children: [
      { label: "Par secteur", href: "/opportunites/marches-prives/secteur", description: "Explorer les besoins par secteur d’activité." },
      { label: "Déposer une annonce", href: "/opportunites/marches-prives/deposer", description: "Parcours de dépôt documenté ; le formulaire de publication n’est pas encore activé.", status: "preparing" }
    ]},
    { label: "Salons professionnels", href: "/opportunites/salons", description: "Préparer une visite et repérer les opportunités liées.", children: [
      { label: "Calendrier", href: "/opportunites/salons/calendrier", description: "Consulter les rendez-vous professionnels validés." },
      { label: "Préparer une visite", href: "/opportunites/salons/preparer", description: "Définir ses objectifs, qualifier les rencontres et organiser le suivi." },
      { label: "Par secteur", href: "/opportunites/salons/secteur", description: "Explorer les salons par domaine." },
      { label: "Par région", href: "/opportunites/salons/region", description: "Explorer les salons par territoire." }
    ]},
    { label: "Emploi et missions", href: "/opportunites/emploi", description: "Consulter des offres et missions publiées.", children: [
      { label: "Offres d’emploi", href: "/opportunites/emploi/offres", description: "Rechercher des offres par métier et région." },
      { label: "Missions", href: "/opportunites/emploi/missions", description: "Explorer les missions ponctuelles et freelance." },
      { label: "Métiers", href: "/opportunites/emploi/metiers", description: "Guides métiers fondés sur des informations vérifiables." },
      { label: "Déposer une offre", href: "/opportunites/emploi/deposer-une-offre", description: "Parcours de dépôt prévu ; aucun formulaire de publication d’offre n’est encore activé.", status: "preparing" },
      { label: "Conseils", href: "/opportunites/emploi/conseils", description: "Préparer sa candidature ou son recrutement." }
    ]}
  ]},
  { label: "Business", href: "/business", description: "Comprendre les signaux de création, d’évolution et de transmission.", children: [
    { label: "Intelligence entreprises", href: "/business/intelligence-entreprises", description: "Relier les informations économiques aux hypothèses de développement commercial.", children: [
      { label: "Créations et implantations", href: "/business/creations-implantations", description: "Repérer les créations et nouvelles implantations vérifiées." },
      { label: "Évolutions d’activité", href: "/business/evolutions-activite", description: "Étudier les changements susceptibles d’éclairer une action commerciale." }
    ]},
    { label: "Veille BODACC", href: "/business/veille-bodacc", description: "Explorer les publications BODACC et leurs limites." },
    { label: "Achat et cession", href: "/business/achat-cession", description: "Préparer un projet de reprise ou de transmission.", children: [
      { label: "Acheter", href: "/business/achat-cession/acheter", description: "Structurer un projet de reprise." },
      { label: "Vendre", href: "/business/achat-cession/vendre", description: "Préparer une cession." },
      { label: "Évaluer une entreprise", href: "/business/achat-cession/evaluer-une-entreprise", description: "Identifier les informations utiles à une évaluation." }
    ]},
    { label: "Diagnostic", href: "/business/diagnostic", description: "Faire le point sur les besoins et les priorités d’une entreprise." }
  ]},
  { label: "Développement commercial", href: "/developpement-commercial", description: "Transformer l’information en actions commerciales structurées.", children: [
    { label: "Prospection", href: "/developpement-commercial/prospection", description: "Organiser une prospection ciblée.", children: [
      { label: "Ciblage", href: "/developpement-commercial/prospection/ciblage", description: "Définir et qualifier les entreprises à contacter." },
      { label: "Argumentaires", href: "/developpement-commercial/prospection/argumentaires", description: "Préparer des messages adaptés au contexte." },
      { label: "Suivi", href: "/developpement-commercial/prospection/suivi", description: "Organiser les relances et capitaliser les retours." }
    ]},
    { label: "Études de marché", href: "/developpement-commercial/etudes-de-marche", description: "Structurer une étude et identifier ses sources.", children: [
      { label: "Méthodologie", href: "/developpement-commercial/etudes-de-marche/methodologie", description: "Définir la question, le périmètre et la méthode." },
      { label: "Sources", href: "/developpement-commercial/etudes-de-marche/sources", description: "Identifier des sources à vérifier." }
    ]},
    { label: "E-réputation", href: "/developpement-commercial/e-reputation", description: "Suivre et traiter les avis en ligne.", children: [
      { label: "Surveiller", href: "/developpement-commercial/e-reputation/surveiller", description: "Organiser une veille des avis." },
      { label: "Répondre aux avis", href: "/developpement-commercial/e-reputation/repondre-aux-avis", description: "Répondre avec méthode et cohérence." }
    ]},
    { label: "Accompagnement appels d’offres", href: "/developpement-commercial/accompagnement-appels-offres", description: "Préparer, rédiger et suivre une réponse.", children: [
      { label: "Préparer", href: "/developpement-commercial/accompagnement-appels-offres/preparer", description: "Analyser le dossier et décider de se positionner." },
      { label: "Rédiger", href: "/developpement-commercial/accompagnement-appels-offres/rediger", description: "Organiser les éléments de réponse." },
      { label: "Après un résultat", href: "/developpement-commercial/accompagnement-appels-offres/apres-un-resultat", description: "Capitaliser sur la décision et les retours." }
    ]}
  ]},
  { label: "Réseaux", href: "/reseaux", description: "Développer des relations professionnelles utiles et des complémentarités entre acteurs.", children: [
    { label: "Annuaire professionnel", href: "/reseaux/annuaire", description: "Consulter les profils lorsque l’annuaire sera ouvert.", status: "preparing" },
    { label: "Rejoindre le réseau", href: "/reseaux/rejoindre", description: "Découvrir comment contribuer au réseau." }
  ]},
  { label: "Comprendre", href: "/comprendre", description: "Comprendre le concept, les termes et les parcours MajestiOS.", children: [
    { label: "Le concept", href: "/comment-et-pourquoi", description: "Découvrir la mission et le fonctionnement visé." },
    { label: "FAQ", href: "/faq", description: "Trouver les réponses aux questions courantes." },
    { label: "Glossaire", href: "/comprendre/glossaire", description: "Comprendre le vocabulaire métier." }
  ]},
  { label: "Espace professionnel", href: "/espace-professionnel", description: "Accéder aux parcours réservés aux professionnels." },
  { label: "Confidentialité", href: "/confidentialite", description: "Comprendre les données collectées et leur traitement." },
  { label: "Mentions légales", href: "/mentions-legales", description: "Consulter les informations légales du site." }
];

export function flattenSiteTree(nodes: SiteNode[] = siteTree): SiteNode[] {
  return nodes.flatMap((node) => [node, ...flattenSiteTree(node.children ?? [])]);
}

export function findSiteNode(pathname: string): { node: SiteNode; ancestors: SiteNode[] } | null {
  const walk = (nodes: SiteNode[], ancestors: SiteNode[]): { node: SiteNode; ancestors: SiteNode[] } | null => {
    for (const node of nodes) {
      if (node.href === pathname) return { node, ancestors };
      const found = walk(node.children ?? [], [...ancestors, node]);
      if (found) return found;
    }
    return null;
  };
  return walk(siteTree, []);
}
