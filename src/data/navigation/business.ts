import type { SiteNode } from "./types";

export const businessNode: SiteNode = { label: "Business", href: "/business", description: "Comprendre les signaux de création, d’évolution et de transmission.", children: [
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
  ]};
