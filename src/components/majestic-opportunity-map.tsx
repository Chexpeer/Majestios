"use client";

import Link from "next/link";
import { useState } from "react";

const poles = [
  { id: "public", label: "Marchés publics", detail: "Appels d’offres · travaux · services · fournitures", href: "/opportunites/publiques", x: "17%", y: "29%", color: "violet", icon: "⌂" },
  { id: "prive", label: "Opportunités privées", detail: "Marchés privés · besoins d’entreprises · sous-traitance", href: "/opportunites/privees", x: "83%", y: "29%", color: "orange", icon: "↗" },
  { id: "entreprises", label: "Entreprises", detail: "Identifier et qualifier les entreprises", href: "/opportunites/radar-entreprises", x: "50%", y: "8%", color: "mint", icon: "▥" },
  { id: "sources", label: "Veille économique", detail: "Sources officielles · signaux économiques", href: "/opportunites/signaux-entreprises", x: "13%", y: "67%", color: "blue", icon: "⌕" },
  { id: "reseaux", label: "Réseaux professionnels", detail: "Interlocuteurs · partenaires · décideurs", href: "/reseaux", x: "87%", y: "67%", color: "green", icon: "♧" },
  { id: "business", label: "Développement commercial", detail: "Prospection · qualification · accompagnement", href: "/developpement-commercial", x: "34%", y: "91%", color: "violet", icon: "↗" },
  { id: "emploi", label: "Emploi & recrutement", detail: "Offres d’emploi · missions · publier une offre", href: "/opportunites/emploi", x: "66%", y: "91%", color: "red", icon: "◎" },
];

export default function MajestiOSOpportunityMap() {
  const [active, setActive] = useState("public");
  const selected = poles.find((pole) => pole.id === active) ?? poles[0];

  return (
    <section className="maj-map" aria-labelledby="maj-map-title">
      <div className="maj-map-heading">
        <span className="section-label">LE CARREFOUR MAJESTIOS</span>
        <h2 id="maj-map-title">Choisissez votre porte d’entrée.</h2>
        <p>Le schéma présente les grandes rubriques. Chaque clic ouvre son propre dossier.</p>
      </div>
      <div className="maj-map-canvas">
        <div className="maj-map-orbit maj-map-orbit-outer" aria-hidden="true" />
        <div className="maj-map-orbit maj-map-orbit-inner" aria-hidden="true" />
        <svg className="maj-map-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {poles.map((pole) => <line key={pole.id} x1="50" y1="50" x2={Number.parseFloat(pole.x)} y2={Number.parseFloat(pole.y)} />)}
        </svg>
        <Link className="maj-map-core" href="/opportunites" aria-label="Explorer toutes les opportunités MajestiOS">
          <span className="maj-map-core-mark" aria-hidden="true"><svg className="majesti-crown" viewBox="0 0 32 22" focusable="false"><path d="M3 18 1 5l8 5 7-9 7 9 8-5-2 13Z" fill="currentColor"/><path d="M4 20h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><svg className="majesti-triangle" viewBox="0 0 36 30" focusable="false"><path d="M18 2.5 33.5 27H2.5Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg></span><strong>MajestiOS</strong><small>DES OPPORTUNITÉS À VOTRE MESURE</small>
        </Link>
        {poles.map((pole) => (
          <Link key={pole.id} className={`maj-map-node ${pole.color} ${active === pole.id ? "is-active" : ""}`} style={{ left: pole.x, top: pole.y }} href={pole.href} onMouseEnter={() => setActive(pole.id)} onFocus={() => setActive(pole.id)} aria-label={`Explorer : ${pole.label}`}>
            <span className="maj-map-node-icon" aria-hidden="true">{pole.icon}</span><strong>{pole.label}</strong>
          </Link>
        ))}
      </div>
      <div className="maj-map-selection" aria-live="polite">
        <div><span className="maj-map-selection-kicker">PÔLE SÉLECTIONNÉ</span><strong>{selected.label}</strong><p>{selected.detail}</p></div>
        <Link href={selected.href} className="maj-map-selection-link">Explorer cette rubrique <span aria-hidden="true">↗</span></Link>
      </div>
      <nav className="maj-map-quicklinks" aria-label="Accès rapides aux pôles MajestiOS">
        {poles.map((pole) => <Link key={pole.id} href={pole.href}>{pole.label}</Link>)}
      </nav>
    </section>
  );
}
