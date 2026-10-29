"use client";

import Link from "next/link";
import { useState } from "react";

const poles = [
  { id: "tenders", label: "Appels d’offres", detail: "Marchés publics et privés · consultations", href: "/opportunites/marches-publics", x: "50%", y: "7%", color: "blue", icon: "⌕", children: [
    { label: "Marchés publics", href: "/opportunites/marches-publics" },
    { label: "Marchés privés", href: "/opportunites/marches-prives" },
    { label: "Salons professionnels", href: "/opportunites/salons" }
  ]},
  { id: "prospection", label: "Prospection intelligente", detail: "Ciblage · qualification · relances", href: "/developpement-commercial/prospection", x: "15%", y: "29%", color: "green", icon: "◎", children: [
    { label: "Ciblage", href: "/developpement-commercial/prospection/ciblage" },
    { label: "Argumentaires", href: "/developpement-commercial/prospection/argumentaires" },
    { label: "Suivi commercial", href: "/developpement-commercial/prospection/suivi" }
  ]},
  { id: "intelligence", label: "Intelligence économique", detail: "Entreprises · signaux · évolutions", href: "/business", x: "85%", y: "29%", color: "mint", icon: "⌘", children: [
    { label: "Intelligence entreprises", href: "/business/intelligence-entreprises" },
    { label: "Veille BODACC", href: "/business/veille-bodacc" },
    { label: "Créations et implantations", href: "/business/creations-implantations" }
  ]},
  { id: "development", label: "Développement commercial", detail: "Études · accompagnement · stratégie", href: "/developpement-commercial", x: "15%", y: "71%", color: "gold", icon: "↗", children: [
    { label: "Accompagnement appels d’offres", href: "/developpement-commercial/accompagnement-appels-offres" },
    { label: "Études de marché", href: "/developpement-commercial/etudes-de-marche" },
    { label: "E-réputation", href: "/developpement-commercial/e-reputation" }
  ]},
  { id: "networks", label: "Réseaux professionnels", detail: "Annuaire · rencontres · interlocuteurs", href: "/reseaux", x: "85%", y: "71%", color: "violet", icon: "♧", children: [
    { label: "Annuaire", href: "/reseaux/annuaire" },
    { label: "Rejoindre le réseau", href: "/reseaux/rejoindre" },
    { label: "Salons et événements", href: "/opportunites/salons" }
  ]},
  { id: "employment", label: "Emploi et missions", detail: "Offres · compétences · collaborations", href: "/opportunites/emploi", x: "50%", y: "93%", color: "teal", icon: "◈", children: [
    { label: "Offres d’emploi", href: "/opportunites/emploi/offres" },
    { label: "Missions", href: "/opportunites/emploi/missions" },
    { label: "Conseils", href: "/opportunites/emploi/conseils" }
  ]}
];

export default function MajestiOSOpportunityMap() {
  const [active, setActive] = useState("tenders");
  const selected = poles.find((pole) => pole.id === active) ?? poles[0];

  return (
    <section className="maj-map maj-snowflake" aria-labelledby="maj-map-title">
      <div className="maj-map-heading">
        <span className="section-label">LE FLOCON INTERACTIF MAJESTIOS</span>
        <h2 id="maj-map-title">Un centre. Six pôles. Des parcours en profondeur.</h2>
        <p>Sélectionnez une branche pour révéler ses sous-rubriques et accéder aux pages dédiées.</p>
      </div>
      <div className="maj-map-canvas">
        <svg className="maj-map-links maj-snowflake-branches" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {poles.map((pole) => {
            const x = Number.parseFloat(pole.x);
            const y = Number.parseFloat(pole.y);
            const dx = x - 50;
            const dy = y - 50;
            const length = Math.sqrt(dx * dx + dy * dy) || 1;
            const bx = x - dx / length * 13;
            const by = y - dy / length * 13;
            const side = 4.5;
            return <g key={pole.id} className={active === pole.id ? "is-lit" : ""}>
              <line className="snowflake-arm" x1="50" y1="50" x2={x} y2={y} />
              <line className="snowflake-twig" x1={bx} y1={by} x2={bx - dy / length * side} y2={by + dx / length * side} />
              <line className="snowflake-twig" x1={bx} y1={by} x2={bx + dy / length * side} y2={by - dx / length * side} />
              <circle className="snowflake-joint" cx={x} cy={y} r={active === pole.id ? "1.4" : "0.8"} />
            </g>;
          })}
        </svg>
        <Link className="maj-map-core" href="/" aria-label="Revenir à l’accueil MajestiOS">
          <span className="maj-map-core-mark" aria-hidden="true"><svg className="majesti-crown" viewBox="0 0 32 22" focusable="false"><path d="M3 18 1 5l8 5 7-9 7 9 8-5-2 13Z" fill="currentColor"/><path d="M4 20h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><span>M</span></span>
          <strong>MajestiOS</strong><small>INTELLIGENCE COMMERCIALE</small>
        </Link>
        {poles.map((pole) => (
          <button key={pole.id} type="button" className={`maj-map-node ${pole.color} ${active === pole.id ? "is-active" : ""}`} style={{ left: pole.x, top: pole.y }} onClick={() => setActive(pole.id)} onMouseEnter={() => setActive(pole.id)} onFocus={() => setActive(pole.id)} aria-pressed={active === pole.id}>
            <span className="maj-map-node-icon" aria-hidden="true">{pole.icon}</span><strong>{pole.label}</strong>
          </button>
        ))}
      </div>
      <div className="maj-map-selection" aria-live="polite">
        <div><span className="maj-map-selection-kicker">BRANCHE SÉLECTIONNÉE</span><strong>{selected.label}</strong><p>{selected.detail}</p></div>
        <Link href={selected.href} className="maj-map-selection-link">Ouvrir le dossier <span aria-hidden="true">↗</span></Link>
      </div>
      <nav className="maj-map-branch-links" aria-label={`Sous-rubriques de ${selected.label}`}>
        {selected.children.map((child) => <Link key={child.href} href={child.href}><span aria-hidden="true">↳</span>{child.label}<span aria-hidden="true">↗</span></Link>)}
      </nav>
    </section>
  );
}
