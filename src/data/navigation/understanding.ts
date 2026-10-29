import type { SiteNode } from "./types";

export const understandingNode: SiteNode = { label: "Comprendre", href: "/comprendre", description: "Comprendre le concept, les termes et les parcours MajestiOS.", children: [
    { label: "Le concept", href: "/comment-et-pourquoi", description: "Découvrir la mission et le fonctionnement visé." },
    { label: "FAQ", href: "/faq", description: "Trouver les réponses aux questions courantes." },
    { label: "Glossaire", href: "/comprendre/glossaire", description: "Comprendre le vocabulaire métier." }
  ]};
