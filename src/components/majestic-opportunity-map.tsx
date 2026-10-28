"use client";

import Link from "next/link";
import { useState } from "react";

const poles = [
  { id: "entreprises", label: "Entreprises", detail: "Création · développement · reprise", href: "/opportunites/radar-entreprises", x: "50%", y: "8%", color: "mint", icon: "▥" },
  { id: "public", label: "Marchés publics", detail: "Avis · consultations · marchés", href: "/appels-offres-publics", x: "17%", y: "29%", color: "violet", icon: "⌂" },
  { id: "prive", label: "Opportunités privées", detail: "Consultations · missions · partenariats", href: "/appels-offres-prives", x: "83%", y: "29%", color: "orange", icon: "↗" },
  { id: "sources", label: "Sources & veille", detail: "Données officielles · signaux marché", href: "/intelligence-commerciale", x: "13%", y: "67%", color: "blue", icon: "⌕" },
  { id: "reseaux", label: "Réseaux professionnels", detail: "Interlocuteurs · décideurs", href: "/reseaux", x: "87%", y: "67%", color: "green", icon: "♧" },
  { id: "business", label: "Business", detail: "Achat · vente · transmission", href: "/business", x: "34%", y: "91%", color: "violet", icon: "↗" },
  { id: "emploi", label: "Emploi & missions", detail: "Collaborations · recrutement", href: "/offres-emploi", x: "66%", y: "91%", color: "red", icon: "◎" },
];

export default function MajestiOSOpportunityMap() {
  const [active, setActive] = useState("entreprises");
  const selected = poles.find((pole) => pole.id === active) ?? poles[0];

  return (
    <section className="maj-map" aria-labelledby="maj-map-title">
      <div className="maj-map-heading">
        <span className="section-label">LE CARREFOUR MAJESTIOS</span>
        <h2 id="maj-map-title">Un écosystème. Des opportunités connectées.</h2>
        <p>Sélectionnez un pôle pour explorer la rubrique qui vous intéresse.</p>
      </div>
      <div className="maj-map-canvas">
        <div className="maj-map-orbit maj-map-orbit-outer" aria-hidden="true" />
        <div className="maj-map-orbit maj-map-orbit-inner" aria-hidden="true" />
        <svg className="maj-map-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {poles.map((pole) => <line key={pole.id} x1="50" y1="50" x2={Number.parseFloat(pole.x)} y2={Number.parseFloat(pole.y)} />)}
        </svg>
        <Link className="maj-map-core" href="/intelligence-commerciale" aria-label="Découvrir l'intelligence commerciale MajestiOS">
          <span className="maj-map-core-mark">M</span><strong>MajestiOS</strong><small>INTELLIGENCE COMMERCIALE</small>
        </Link>
        {poles.map((pole) => (
          <button key={pole.id} type="button" className={`maj-map-node ${pole.color} ${active === pole.id ? "is-active" : ""}`} style={{ left: pole.x, top: pole.y }} onClick={() => setActive(pole.id)} onDoubleClick={() => { window.location.href = pole.href; }} aria-pressed={active === pole.id} aria-label={`${pole.label} : afficher le lien`}>
            <span className="maj-map-node-icon" aria-hidden="true">{pole.icon}</span><strong>{pole.label}</strong>
          </button>
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
