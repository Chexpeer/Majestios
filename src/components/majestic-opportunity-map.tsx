"use client";

import Link from "next/link";
import { useState } from "react";

// Chaque branche de la constellation mène vers une rubrique réelle de l'arborescence.
const poles = [
  { id: "entreprises", label: "Entreprises", detail: "Création · développement · reprise", href: "/opportunites/radar-entreprises", x: "50%", y: "8%", color: "mint", icon: "▥" },
  { id: "public", label: "Marchés publics", detail: "Avis · consultations · marchés", href: "/opportunites/marches-publics", x: "17%", y: "29%", color: "blue", icon: "⌂" },
  { id: "prive", label: "Marchés privés", detail: "Consultations · missions · partenariats", href: "/opportunites/marches-prives", x: "83%", y: "29%", color: "green", icon: "↗" },
  { id: "sources", label: "Sources & veille", detail: "Données · études de marché · signaux", href: "/developpement-commercial/etudes-de-marche/sources", x: "15%", y: "67%", color: "blue", icon: "⌕" },
  { id: "reseaux", label: "Réseaux professionnels", detail: "Interlocuteurs · décideurs · connexions", href: "/reseaux", x: "85%", y: "67%", color: "green", icon: "♧" },
  { id: "business", label: "Business & transmission", detail: "Achat · vente · reprise d'entreprise", href: "/business", x: "34%", y: "91%", color: "violet", icon: "↗" },
  { id: "emploi", label: "Emploi & missions", detail: "Compétences · collaborations · recrutement", href: "/opportunites/emploi", x: "66%", y: "91%", color: "red", icon: "◎" },
];

export default function MajestiOSOpportunityMap() {
  const [active, setActive] = useState("entreprises");
  const selected = poles.find((pole) => pole.id === active) ?? poles[0];

  return (
    <section className="maj-map" aria-label="Flocon numérique interactif du réseau MajestiOS">
      <div className="maj-map-canvas maj-map-snowflake">
        <div className="maj-map-orbit maj-map-orbit-outer" aria-hidden="true" />
        <div className="maj-map-orbit maj-map-orbit-inner" aria-hidden="true" />
        <svg className="maj-map-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="majSnowflakeGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#527eaa" />
              <stop offset="50%" stopColor="#c4a15b" />
              <stop offset="100%" stopColor="#4f9277" />
            </linearGradient>
          </defs>
          <g className="maj-map-crystal-frame">
            <path d="M50 50 L50 18 M50 50 L23 34 M50 50 L77 34 M50 50 L20 68 M50 50 L80 68 M50 50 L36 85 M50 50 L64 85" />
            <path d="M50 18 L42 26 M50 18 L58 26 M23 34 L33 34 M23 34 L26 44 M77 34 L67 34 M77 34 L74 44 M20 68 L30 64 M20 68 L25 78 M80 68 L70 64 M80 68 L75 78 M36 85 L37 74 M36 85 L46 82 M64 85 L63 74 M64 85 L54 82" />
            <path d="M42 26 L58 26 L67 34 L74 44 L70 64 L63 74 L54 82 L46 82 L37 74 L30 64 L26 44 L33 34 Z" />
          </g>
          <g className="maj-map-spokes">
            {poles.map((pole) => <line key={pole.id} x1="50" y1="50" x2={Number.parseFloat(pole.x)} y2={Number.parseFloat(pole.y)} />)}
          </g>
          <g className="maj-map-crystal-points">
            <circle cx="50" cy="18" r=".65" /><circle cx="23" cy="34" r=".65" /><circle cx="77" cy="34" r=".65" />
            <circle cx="20" cy="68" r=".65" /><circle cx="80" cy="68" r=".65" /><circle cx="36" cy="85" r=".65" /><circle cx="64" cy="85" r=".65" />
          </g>
        </svg>
        <Link className="maj-map-core" href="/comprendre/concept" aria-label="Découvrir la mission et le concept MajestiOS">
          <span className="maj-map-core-mark" aria-hidden="true"><svg className="majesti-crown" viewBox="0 0 32 22" focusable="false"><path d="M3 18 1 5l8 5 7-9 7 9 8-5-2 13Z" fill="currentColor"/><path d="M4 20h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><span>M</span></span>
          <strong>MajestiOS</strong><small>RÉSEAUTAGE INTELLIGENT</small>
        </Link>
        {poles.map((pole) => (
          <Link key={pole.id} className={`maj-map-node ${pole.color} ${active === pole.id ? "is-active" : ""}`} style={{ left: pole.x, top: pole.y }} href={pole.href} onMouseEnter={() => setActive(pole.id)} onFocus={() => setActive(pole.id)} aria-label={`Explorer : ${pole.label}`}>
            <span className="maj-map-node-icon" aria-hidden="true">{pole.icon}</span><strong>{pole.label}</strong>
          </Link>
        ))}
      </div>
      <div className="maj-map-selection" aria-live="polite">
        <div><span className="maj-map-selection-kicker">BRANCHE SÉLECTIONNÉE</span><strong>{selected.label}</strong><p>{selected.detail}</p></div>
        <Link href={selected.href} className="maj-map-selection-link">Explorer cette rubrique <span aria-hidden="true">↗</span></Link>
      </div>
      <nav className="maj-map-quicklinks" aria-label="Accès rapides aux branches du réseau MajestiOS">
        {poles.map((pole) => <Link key={pole.id} href={pole.href}>{pole.label}</Link>)}
      </nav>
    </section>
  );
}
