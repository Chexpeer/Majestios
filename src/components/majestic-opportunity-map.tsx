"use client";

import Link from "next/link";
import { useState } from "react";

type MapLink = { label: string; href: string };
type ValueStage = {
  id: string; label: string; href: string; x: string; y: string;
  color: string; icon: string; detail: string; bullets: string[]; links: MapLink[];
};

const stages: ValueStage[] = [
  {
    id: "detecter", label: "Détecter", href: "/opportunites", x: "50%", y: "7%", color: "blue", icon: "⌕",
    detail: "Repérer les signaux utiles avant qu’ils ne deviennent des occasions manquées.",
    bullets: ["Appels d’offres publics et privés", "BODACC et annonces légales", "Autres sources et signaux de marché"],
    links: [
      { label: "Appels d’offres publics", href: "/opportunites/marches-publics" },
      { label: "Marchés privés", href: "/opportunites/marches-prives" },
      { label: "Veille BODACC", href: "/business/veille-bodacc" },
      { label: "Salons professionnels", href: "/opportunites/salons" }
    ]
  },
  {
    id: "qualifier", label: "Qualifier", href: "/opportunites/marches-publics", x: "85%", y: "29%", color: "green", icon: "◎",
    detail: "Évaluer si l’opportunité correspond réellement à l’entreprise, à ses moyens et à ses objectifs.",
    bullets: ["Critères, secteur et territoire", "Besoins et contraintes", "Pertinence et faisabilité"],
    links: [
      { label: "Marchés publics par département", href: "/opportunites/marches-publics/departement" },
      { label: "Marchés privés par secteur", href: "/opportunites/marches-prives/secteur" },
      { label: "Diagnostic d’entreprise", href: "/business/diagnostic" }
    ]
  },
  {
    id: "identifier", label: "Identifier", href: "/business/intelligence-entreprises", x: "85%", y: "71%", color: "violet", icon: "⌕",
    detail: "Confirmer les informations par croisement de sources pour retrouver les entreprises et les bons interlocuteurs.",
    bullets: ["BODACC et données d’entreprise", "Réseaux professionnels", "Historique et signaux d’activité"],
    links: [
      { label: "Intelligence entreprises", href: "/business/intelligence-entreprises" },
      { label: "Créations et implantations", href: "/business/intelligence-entreprises/creations-implantations" },
      { label: "Évolutions d’activité", href: "/business/intelligence-entreprises/evolutions-activite" },
      { label: "Réseau professionnel", href: "/reseaux" }
    ]
  },
  {
    id: "contacter", label: "Contacter", href: "/developpement-commercial/prospection", x: "50%", y: "93%", color: "orange", icon: "✉",
    detail: "Mobiliser les ressources humaines, les outils de communication et une méthode de prise de contact éprouvée.",
    bullets: ["Ciblage et préparation", "Messages adaptés au contexte", "Suivi et relances personnalisées"],
    links: [
      { label: "Ciblage", href: "/developpement-commercial/prospection/ciblage" },
      { label: "Argumentaires", href: "/developpement-commercial/prospection/argumentaires" },
      { label: "Suivi de prospection", href: "/developpement-commercial/prospection/suivi" }
    ]
  },
  {
    id: "transformer", label: "Transformer", href: "/developpement-commercial/accompagnement-appels-offres", x: "15%", y: "71%", color: "red", icon: "↗",
    detail: "Faire progresser l’opportunité grâce à l’accompagnement, à la mise en relation et à la négociation.",
    bullets: ["Accompagnement commercial", "Positionnement et réponse", "Suivi jusqu’au résultat"],
    links: [
      { label: "Préparation express", href: "/developpement-commercial/accompagnement-appels-offres/preparation-express" },
      { label: "Préparer un dossier", href: "/developpement-commercial/accompagnement-appels-offres/preparer" },
      { label: "Rédiger une réponse", href: "/developpement-commercial/accompagnement-appels-offres/rediger" },
      { label: "Après un résultat", href: "/developpement-commercial/accompagnement-appels-offres/apres-un-resultat" }
    ]
  },
  {
    id: "capitaliser", label: "Capitaliser", href: "/developpement-commercial/prospection/suivi", x: "15%", y: "29%", color: "teal", icon: "↻",
    detail: "Tirer parti des retours et des résultats pour enrichir la connaissance et renforcer le réseau.",
    bullets: ["Analyse des retours", "Enrichissement de la connaissance", "Nouvelles opportunités et fidélisation"],
    links: [
      { label: "Suivi de prospection", href: "/developpement-commercial/prospection/suivi" },
      { label: "Développement commercial", href: "/developpement-commercial" },
      { label: "Réseaux professionnels", href: "/reseaux" },
      { label: "Intelligence entreprises", href: "/business" }
    ]
  }
];

export default function MajestiOSOpportunityMap() {
  const [activeId, setActiveId] = useState("detecter");
  const selected = stages.find((stage) => stage.id === activeId) ?? stages[0];

  return (
    <section className="maj-map maj-snowflake" aria-labelledby="maj-map-title">
      <div className="maj-map-heading">
        <span className="section-label">LA CHAÎNE DE VALEUR MAJESTIOS</span>
        <h2 id="maj-map-title">Du signal commercial à l’opportunité transformée</h2>
        <p>Chaque étape est reliée aux ressources et aux dossiers correspondants.</p>
      </div>
      <div className="maj-map-canvas">
        <svg className="maj-map-links maj-snowflake-branches" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {stages.map((stage) => {
            const x = Number.parseFloat(stage.x);
            const y = Number.parseFloat(stage.y);
            const dx = x - 50;
            const dy = y - 50;
            const length = Math.sqrt(dx * dx + dy * dy) || 1;
            const bx = x - dx / length * 13;
            const by = y - dy / length * 13;
            const side = 4.5;
            return <g key={stage.id} className={activeId === stage.id ? "is-lit" : ""}>
              <line className="snowflake-arm" x1="50" y1="50" x2={x} y2={y} />
              <line className="snowflake-twig" x1={bx} y1={by} x2={bx - dy / length * side} y2={by + dx / length * side} />
              <line className="snowflake-twig" x1={bx} y1={by} x2={bx + dy / length * side} y2={by - dx / length * side} />
              <circle className="snowflake-joint" cx={x} cy={y} r={activeId === stage.id ? "1.4" : "0.8"} />
            </g>;
          })}
        </svg>
        <Link className="maj-map-core" href="/developpement-commercial" aria-label="Ouvrir le dossier Développement commercial">
          <svg className="majestic-crown-triangle" viewBox="0 0 48 46" aria-hidden="true" focusable="false">
            <path d="M8 10 4 2l9 4 11-6 11 6 9-4-4 8Z" fill="currentColor" />
            <path d="M24 14 44 43H4Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          </svg>
          <strong>MajestiOS</strong><small>DÉVELOPPEMENT COMMERCIAL</small><span className="maj-map-core-subtitle">Prospection intégrée · Intelligence commerciale proactive</span>
        </Link>
        {stages.map((stage, index) => (
          <Link key={stage.id} href={stage.href} className={`maj-map-node ${stage.color} ${activeId === stage.id ? "is-active" : ""}`} style={{ left: stage.x, top: stage.y }} onMouseEnter={() => setActiveId(stage.id)} onFocus={() => setActiveId(stage.id)} aria-current={activeId === stage.id ? "location" : undefined} aria-label={`Ouvrir l’étape ${stage.label}`}>
            <span className="maj-map-node-number">{index + 1}</span><span className="maj-map-node-icon" aria-hidden="true">{stage.icon}</span><strong>{stage.label}</strong>
          </Link>
        ))}
      </div>
      <div className="maj-map-selection" aria-live="polite">
        <div>
          <span className="maj-map-selection-kicker">ÉTAPE {stages.findIndex((stage) => stage.id === selected.id) + 1} · {selected.label.toLocaleUpperCase("fr-FR")}</span>
          <strong>{selected.detail}</strong>
          <ul className="maj-map-stage-points">{selected.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
        </div>
        <Link href={selected.href} className="maj-map-selection-link">Explorer cette étape <span aria-hidden="true">↗</span></Link>
      </div>
      <nav className="maj-map-branch-links" aria-label={`Dossiers associés à l’étape ${selected.label}`}>
        {selected.links.map((item) => <Link key={item.href} href={item.href}><span aria-hidden="true">›</span>{item.label}<span aria-hidden="true">↗</span></Link>)}
      </nav>
    </section>
  );
}
