import type { SiteNode } from "./types";

export const commercialDevelopmentNode: SiteNode = { label: "Développement commercial", href: "/developpement-commercial", description: "Transformer l’information en actions commerciales structurées.", children: [
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
  ]};
