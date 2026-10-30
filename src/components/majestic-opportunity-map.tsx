"use client";

import { useState } from "react";

type Surface = { title: string; href: string; points: string; labelX: number; labelY: number };
type Dossier = { id: string; title: string; color: string; description: string; surfaces: Surface[] };

const dossiers: Dossier[] = [
  { id: "public", title: "MARCHÉS PUBLICS", color: "#4b98dc", description: "Détecter les appels d’offres publics, qualifier les besoins et repérer les possibilités de sous-traitance.", surfaces: [
    { title: "Appels d’offres", href: "/opportunites/marches-publics", points: "250,165 350,222 250,280", labelX: 285, labelY: 224 },
    { title: "Qualification", href: "/opportunites/marches-publics", points: "250,280 350,222 450,280 350,338", labelX: 350, labelY: 283 },
    { title: "Sous-traitance", href: "/opportunites/marches-publics", points: "250,280 350,338 450,395 350,452 250,395", labelX: 322, labelY: 382 },
  ]},
  { id: "private", title: "MARCHÉS PRIVÉS", color: "#70b96d", description: "Identifier les besoins privés, leurs donneurs d’ordre et les occasions commerciales qui en découlent.", surfaces: [
    { title: "Avis privés", href: "/opportunites/marches-prives", points: "650,165 550,222 650,280", labelX: 615, labelY: 224 },
    { title: "Donneurs d’ordre", href: "/opportunites/marches-prives", points: "550,222 650,280 550,338 450,280", labelX: 550, labelY: 283 },
    { title: "Suivi des besoins", href: "/opportunites/marches-prives", points: "650,280 650,395 550,452 450,395 550,338", labelX: 578, labelY: 382 },
  ]},
  { id: "commercial", title: "DÉVELOPPEMENT COMMERCIAL", color: "#f4cf3e", description: "Faire converger veille, stratégie, CRM et relations pour transformer les signaux en développement durable.", surfaces: [
    { title: "Veille & stratégie", href: "/developpement-commercial", points: "650,395 750,450 850,500 750,555", labelX: 751, labelY: 477 },
    { title: "CRM & relations", href: "/developpement-commercial/crm", points: "650,395 750,555 650,615 550,557", labelX: 690, labelY: 540 },
    { title: "Études de marché", href: "/developpement-commercial/etudes-de-marche", points: "650,615 750,555 850,500 750,665 650,615", labelX: 750, labelY: 607 },
  ]},
  { id: "employment", title: "EMPLOI & RÉSEAUX", color: "#fa9a42", description: "Relier les besoins de compétences, les profils, les partenaires et les opportunités de collaboration.", surfaces: [
    { title: "Offres d’emploi", href: "/emploi", points: "450,605 550,662 450,720", labelX: 485, labelY: 662 },
    { title: "Profils & CV", href: "/emploi", points: "550,662 650,605 650,720 550,777 450,720", labelX: 555, labelY: 714 },
    { title: "Réseaux", href: "/reseaux", points: "550,777 650,720 650,835 550,777", labelX: 600, labelY: 789 },
  ]},
  { id: "support", title: "ACCOMPAGNEMENT", color: "#ef5b4d", description: "Accompagner la préparation des réponses, la conformité des dossiers et la capitalisation des apprentissages.", surfaces: [
    { title: "Conseil AO", href: "/developpement-commercial/accompagnement-appels-offres", points: "250,605 350,662 250,720", labelX: 285, labelY: 662 },
    { title: "Préparation", href: "/developpement-commercial/accompagnement-appels-offres", points: "350,662 450,605 450,720 350,777 250,720", labelX: 350, labelY: 714 },
    { title: "Conformité", href: "/developpement-commercial/accompagnement-appels-offres", points: "250,720 350,777 250,835", labelX: 286, labelY: 789 },
  ]},
  { id: "prospection", title: "PROSPECTION & QUALIFICATION", color: "#a365d5", description: "Qualifier les signaux, identifier les entreprises pertinentes, organiser les contacts et apprendre des retours.", surfaces: [
    { title: "Qualification", href: "/developpement-commercial/prospection", points: "50,500 150,445 250,500 150,555", labelX: 150, labelY: 496 },
    { title: "Identification", href: "/developpement-commercial/prospection", points: "150,445 250,395 350,452 250,500", labelX: 250, labelY: 450 },
    { title: "Prospection", href: "/developpement-commercial/prospection", points: "150,555 250,500 350,557 250,615", labelX: 250, labelY: 565 },
  ]},
];

const centerPoints = "450,395 550,452 550,557 450,615 350,557 350,452";

export default function MajestiOSOpportunityMap() {
  const [active, setActive] = useState("commercial");
  const selected = dossiers.find((d) => d.id === active) ?? dossiers[0];

  return (
    <section className="maj-map maj-star-map" aria-labelledby="maj-map-title">
      <header className="maj-map-heading">
        <span className="section-label">LE CŒUR DU FONCTIONNEMENT MAJESTIOS</span>
        <h2 id="maj-map-title">Six dossiers. <em>Des surfaces. Une intelligence croisée.</em></h2>
        <p>Chaque losange ouvre un dossier ; chaque surface colorée donne accès à un sous-dossier. Les croisements matérialisent les synergies entre les domaines.</p>
      </header>

      <div className="maj-star-canvas">
        <svg className="maj-star-svg" viewBox="0 0 900 900" role="group" aria-label="Étoile interactive des six dossiers MajestiOS">
          <circle className="maj-star-orbit" cx="450" cy="500" r="425" />
          <g className="maj-star-links" aria-hidden="true">
            <path d="M250 165 L450 280 L650 165 L650 395 L850 500 L650 615 L650 835 L450 720 L250 835 L250 615 L50 500 L250 395 Z" />
            <path d="M250 395 L450 500 L650 395 M250 615 L450 500 L650 615 M450 280 L450 720 M250 395 L650 615 M650 395 L250 615" />
          </g>
          {dossiers.map((dossier) => (
            <g key={dossier.id} className={`maj-star-dossier ${active === dossier.id ? "is-active" : ""}`}>
              {dossier.surfaces.map((surface, index) => (
                <a key={surface.title} href={surface.href} className="maj-star-surface" aria-label={`${surface.title}, sous-dossier de ${dossier.title}`} onMouseEnter={() => setActive(dossier.id)} onFocus={() => setActive(dossier.id)}>
                  <polygon points={surface.points} fill={dossier.color} fillOpacity={index === 1 ? ".98" : ".72"} />
                  <text x={surface.labelX} y={surface.labelY} textAnchor="middle">{surface.title}</text>
                </a>
              ))}
            </g>
          ))}
          <polygon className="maj-star-center" points={centerPoints} />
          <g className="maj-star-center-label">
            <text x="450" y="489" textAnchor="middle" className="maj-star-crown">♛</text>
            <text x="450" y="520" textAnchor="middle" className="maj-star-brand">MAJESTIOS</text>
            <text x="450" y="540" textAnchor="middle" className="maj-star-tagline">INTELLIGENCE CROISÉE</text>
          </g>
          {dossiers.map((dossier, index) => {
            const anchors = [
              { x: 350, y: 315 }, { x: 550, y: 315 }, { x: 742, y: 500 },
              { x: 550, y: 680 }, { x: 350, y: 680 }, { x: 158, y: 500 },
            ];
            const p = anchors[index];
            return <g key={dossier.id + "-title"} className="maj-star-title" onClick={() => setActive(dossier.id)} role="button" tabIndex={0} aria-label={`Sélectionner le dossier ${dossier.title}`} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setActive(dossier.id); }}>
              <rect x={p.x - 75} y={p.y - 18} width="150" height="36" rx="7" fill={dossier.color} />
              <text x={p.x} y={p.y + 4} textAnchor="middle">{dossier.title}</text>
            </g>;
          })}
        </svg>
      </div>

      <div className="maj-star-legend" aria-label="Axes stratégiques">
        <span><i style={{ background: "#4b98dc" }} /> Marchés publics</span>
        <span><i style={{ background: "#70b96d" }} /> Marchés privés</span>
        <span><i style={{ background: "#f4cf3e" }} /> Développement commercial</span>
      </div>

      <div className="maj-map-selection" aria-live="polite">
        <div>
          <span className="maj-map-selection-kicker">DOSSIER SÉLECTIONNÉ · {selected.title}</span>
          <strong>{selected.description}</strong>
          <p><b>Synergie :</b> ce dossier échange des signaux, des contacts et des apprentissages avec les cinq autres dossiers.</p>
        </div>
        <a className="maj-map-selection-link" href={selected.surfaces[0].href}>Ouvrir le dossier <span aria-hidden="true">↗</span></a>
      </div>
      <p className="maj-star-note">Les surfaces sont des sous-dossiers navigables. Les connexions représentent des relations fonctionnelles transversales, non une simple hiérarchie. Les fonctions en préparation sont signalées dans leurs dossiers respectifs.</p>
    </section>
  );
}
