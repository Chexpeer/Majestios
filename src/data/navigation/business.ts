import type { SiteNode } from "./types";

export const businessNode: SiteNode = { label: "Business", href: "/business", description: "Comprendre les signaux de création, d’évolution et de transmission.", children: [
    { label: "Intelligence entreprises", href: "/business/intelligence-entreprises", description: "Relier des signaux économiques vérifiables à des hypothèses de développement commercial.", children: [
      { label: "Créations et implantations", href: "/business/intelligence-entreprises/creations-implantations", description: "Repérer les créations et nouvelles implantations vérifiées." },
      { label: "Évolutions d’activité", href: "/business/intelligence-entreprises/evolutions-activite", description: "Étudier les changements susceptibles d’éclairer une action commerciale." }
    ]},
    { label: "Veille BODACC", href: "/business/veille-bodacc", description: "Repérer les événements juridiques publiés au BODACC, puis vérifier leur portée commerciale." },
    { label: "Achat et cession", href: "/business/achat-cession", description: "Structurer un projet de reprise ou de transmission en distinguant les annonces des opportunités qualifiées.", children: [
      { label: "Acheter", href: "/business/achat-cession/acheter", description: "Structurer un projet de reprise." },
      { label: "Vendre", href: "/business/achat-cession/vendre", description: "Préparer une cession." },
      { label: "Évaluer une entreprise", href: "/business/achat-cession/evaluer-une-entreprise", description: "Identifier les informations utiles à une évaluation." }
    ]},
    { label: "Diagnostic", href: "/business/diagnostic", description: "Faire le point sur les besoins et les priorités d’une entreprise." }
  ]};
