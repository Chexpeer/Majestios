"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { flattenSiteTree, type SiteNode } from "@/data/site-tree";

type PolePresentation = { href: string; id: string; x: string; y: string; color: string; icon: string; detail?: string };

const polePresentation: PolePresentation[] = [
  { id: "tenders", href: "/opportunites/marches-publics", x: "50%", y: "7%", color: "blue", icon: "⌕", detail: "Recherche et qualification des consultations publiques." },
  { id: "prospection", href: "/developpement-commercial/prospection", x: "15%", y: "29%", color: "green", icon: "◎", detail: "Ciblage, qualification et suivi des entreprises." },
  { id: "intelligence", href: "/business", x: "85%", y: "29%", color: "mint", icon: "⌘", detail: "Entreprises, signaux économiques et évolutions." },
  { id: "development", href: "/developpement-commercial", x: "15%", y: "71%", color: "gold", icon: "↗", detail: "Études, accompagnement et stratégie commerciale." },
  { id: "networks", href: "/reseaux", x: "85%", y: "71%", color: "violet", icon: "♧", detail: "Annuaire, rencontres et complémentarités professionnelles." },
  { id: "employment", href: "/opportunites/emploi", x: "50%", y: "93%", color: "teal", icon: "◈", detail: "Offres, compétences et missions." }
];

type SnowflakePole = PolePresentation & { node: SiteNode; children: SiteNode[]; label: string };

export default function MajestiOSOpportunityMap() {
  const allNodes = useMemo(() => flattenSiteTree(), []);
  const poles = useMemo(() => polePresentation.flatMap((presentation) => {
    const node = allNodes.find((item) => item.href === presentation.href);
    if (!node) return [];
    return [{ ...presentation, node, label: node.label, children: node.children ?? [] }];
  }), [allNodes]);
  const [active, setActive] = useState("/opportunites/marches-publics");
  const selected = poles.find((pole) => pole.href === active) ?? poles[0];

  if (!selected) return null;

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
            return <g key={pole.id} className={active === pole.href ? "is-lit" : ""}>
              <line className="snowflake-arm" x1="50" y1="50" x2={x} y2={y} />
              <line className="snowflake-twig" x1={bx} y1={by} x2={bx - dy / length * side} y2={by + dx / length * side} />
              <line className="snowflake-twig" x1={bx} y1={by} x2={bx + dy / length * side} y2={by - dx / length * side} />
              <circle className="snowflake-joint" cx={x} cy={y} r={active === pole.href ? "1.4" : "0.8"} />
            </g>;
          })}
        </svg>
        <Link className="maj-map-core" href="/" aria-label="Revenir à l’accueil MajestiOS">
          <span className="maj-map-core-mark" aria-hidden="true"><svg className="majesti-crown" viewBox="0 0 32 22" focusable="false"><path d="M3 18 1 5l8 5 7-9 7 9 8-5-2 13Z" fill="currentColor"/><path d="M4 20h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><span>M</span></span>
          <strong>MajestiOS</strong><small>INTELLIGENCE COMMERCIALE</small>
        </Link>
        {poles.map((pole) => (
          <button key={pole.id} type="button" className={`maj-map-node ${pole.color} ${active === pole.href ? "is-active" : ""}`} style={{ left: pole.x, top: pole.y }} onClick={() => setActive(pole.href)} onMouseEnter={() => setActive(pole.href)} onFocus={() => setActive(pole.href)} aria-pressed={active === pole.href}>
            <span className="maj-map-node-icon" aria-hidden="true">{pole.icon}</span><strong>{pole.label}</strong>
          </button>
        ))}
      </div>
      <div className="maj-map-selection" aria-live="polite">
        <div><span className="maj-map-selection-kicker">BRANCHE SÉLECTIONNÉE</span><strong>{selected.label}</strong><p>{selected.detail}</p></div>
        <Link href={selected.href} className="maj-map-selection-link">Ouvrir le dossier <span aria-hidden="true">↗</span></Link>
      </div>
      <nav className="maj-map-branch-links" aria-label={`Sous-rubriques de ${selected.label}`}>
        {selected.children.map((child) => <Link key={child.href} href={child.href}><span aria-hidden="true">↳</span>{child.label}{child.status === "preparing" ? <small className="maj-map-branch-status">En préparation</small> : null}<span aria-hidden="true">↗</span></Link>)}
      </nav>
    </section>
  );
}
