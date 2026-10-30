"use client";

import Link from "next/link";
import { useState } from "react";

const axes = [
  { id:"commercial", label:"Développement commercial", detail:"Le sommet stratégique : transformer les signaux et les opportunités en relations d’affaires.", href:"/developpement-commercial", tone:"commercial", icon:"↗", position:"apex" },
  { id:"public", label:"Marchés publics", detail:"Détecter et qualifier les appels d’offres publics pour se positionner au bon moment.", href:"/opportunites/marches-publics", tone:"public", icon:"§", position:"base-left" },
  { id:"private", label:"Marchés privés", detail:"Repérer les consultations, les besoins directs et les opportunités de sous-traitance.", href:"/opportunites/marches-prives", tone:"private", icon:"◇", position:"base-right" },
];

const engines = [
  { label:"Prospection", detail:"Ciblage et prise de contact", href:"/developpement-commercial/prospection", icon:"➤" },
  { label:"Emploi & recrutement", detail:"Compétences et ressources", href:"/emploi", icon:"◎" },
  { label:"Accompagnement appels d’offres", detail:"Préparer, rédiger, progresser", href:"/developpement-commercial/accompagnement-appels-offres", icon:"▤" },
  { label:"Salons professionnels", detail:"Rencontres et opportunités", href:"/opportunites/salons", icon:"▦" },
];

export default function MajestiOSOpportunityMap() {
  const [active, setActive] = useState("commercial");
  const selected = axes.find((axis) => axis.id === active) ?? axes[0];

  return (
    <section className="maj-map maj-pyramid" aria-labelledby="maj-map-title">
      <header className="maj-map-heading">
        <span className="section-label">L’ARCHITECTURE MAJESTIOS</span>
        <h2 id="maj-map-title">Trois axes. Une même intelligence commerciale.</h2>
        <p>Les marchés publics et privés alimentent la stratégie commerciale. Au centre, les moteurs et les acteurs relient les opportunités à l’action.</p>
      </header>

      <div className="maj-pyramid-legend" aria-label="Les trois axes stratégiques">
        <span><i className="pyramid-legend-commercial" /> Stratégie commerciale</span>
        <span><i className="pyramid-legend-public" /> Marchés publics</span>
        <span><i className="pyramid-legend-private" /> Marchés privés</span>
      </div>

      <div className="maj-pyramid-stage">
        <svg className="maj-pyramid-outline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="majPyramidFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e6f3f2"/><stop offset="100%" stopColor="#f6f1e6"/></linearGradient></defs>
          <polygon points="50,2 3,97 97,97" fill="url(#majPyramidFill)" fillOpacity=".72" stroke="#b6cbd3" strokeWidth=".6" />
          <line x1="50" y1="2" x2="50" y2="97" stroke="#c7d8de" strokeWidth=".35" strokeDasharray="1.4 1.5"/>
          <line x1="26.5" y1="49.5" x2="73.5" y2="49.5" stroke="#c7d8de" strokeWidth=".35" strokeDasharray="1.4 1.5"/>
        </svg>

        <Link
          href={axes[0].href}
          className={`maj-pyramid-axis maj-pyramid-apex ${active === "commercial" ? "is-active" : ""}`}
          onMouseEnter={() => setActive("commercial")} onFocus={() => setActive("commercial")} onTouchStart={() => setActive("commercial")}
          aria-label="Ouvrir le dossier Développement commercial"
        >
          <span className="maj-pyramid-axis-kicker">SOMMET STRATÉGIQUE</span>
          <span className="maj-pyramid-axis-icon" aria-hidden="true">
            <svg viewBox="0 0 32 26" focusable="false"><path d="M3 22 1 7l8 6 7-10 7 10 8-6-2 15Z" fill="currentColor"/><path d="M5 24h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </span>
          <strong>Développement commercial</strong>
          <small>Détecter · qualifier · contacter · transformer</small>
          <span className="maj-pyramid-axis-open">Explorer le dossier ↗</span>
        </Link>

        <div className="maj-pyramid-synergy" aria-label="Moteurs et acteurs de la synergie">
          <span className="maj-pyramid-synergy-kicker">AU CŒUR DE LA PYRAMIDE</span>
          <h3>La synergie MajestiOS</h3>
          <p>Les moteurs qui font circuler l’intelligence entre les trois axes.</p>
          <div className="maj-pyramid-engines">
            {engines.map((engine) => (
              <Link className="maj-pyramid-engine" href={engine.href} key={engine.label}>
                <span aria-hidden="true">{engine.icon}</span>
                <span><strong>{engine.label}</strong><small>{engine.detail}</small></span>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
          <div className="maj-pyramid-synergy-note"><span aria-hidden="true">⇄</span> Détecter les besoins · mobiliser les ressources · créer des relations d’affaires</div>
        </div>

        <Link
          href={axes[1].href}
          className={`maj-pyramid-axis maj-pyramid-public ${active === "public" ? "is-active" : ""}`}
          onMouseEnter={() => setActive("public")} onFocus={() => setActive("public")} onTouchStart={() => setActive("public")}
          aria-label="Ouvrir le dossier Marchés publics"
        >
          <span className="maj-pyramid-axis-kicker">BASE GAUCHE</span><span className="maj-pyramid-axis-icon" aria-hidden="true">§</span>
          <strong>Marchés publics</strong><small>Appels d’offres · travaux · services · fournitures</small><span className="maj-pyramid-axis-open">Explorer le dossier ↗</span>
        </Link>
        <Link
          href={axes[2].href}
          className={`maj-pyramid-axis maj-pyramid-private ${active === "private" ? "is-active" : ""}`}
          onMouseEnter={() => setActive("private")} onFocus={() => setActive("private")} onTouchStart={() => setActive("private")}
          aria-label="Ouvrir le dossier Marchés privés"
        >
          <span className="maj-pyramid-axis-kicker">BASE DROITE</span><span className="maj-pyramid-axis-icon" aria-hidden="true">◇</span>
          <strong>Marchés privés</strong><small>Consultations · besoins directs · sous-traitance</small><span className="maj-pyramid-axis-open">Explorer le dossier ↗</span>
        </Link>
      </div>

      <div className="maj-pyramid-selection" aria-live="polite">
        <div><span>AXE SÉLECTIONNÉ</span><strong>{selected.label}</strong><p>{selected.detail}</p></div>
        <Link href={selected.href}>Ouvrir le dossier <b aria-hidden="true">↗</b></Link>
      </div>
    </section>
  );
}
