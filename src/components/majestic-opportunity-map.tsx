"use client";

import { useState } from "react";

type Surface = { title: string; href: string };
type Dossier = { id: string; title: string; color: string; description: string; angle: number; surfaces: Surface[] };

const dossiers: Dossier[] = [
  { id: "public", title: "MARCHÉS PUBLICS", color: "#4b98dc", angle: -120, description: "Détecter les appels d’offres publics, qualifier les besoins et repérer les possibilités de sous-traitance.", surfaces: [
    { title: "Appels d’offres", href: "/opportunites/marches-publics" },
    { title: "Qualification", href: "/opportunites/marches-publics" },
    { title: "Sous-traitance", href: "/opportunites/marches-publics" },
  ]},
  { id: "private", title: "MARCHÉS PRIVÉS", color: "#70b96d", angle: -60, description: "Identifier les besoins privés, leurs donneurs d’ordre et les occasions commerciales qui en découlent.", surfaces: [
    { title: "Avis privés", href: "/opportunites/marches-prives" },
    { title: "Donneurs d’ordre", href: "/opportunites/marches-prives" },
    { title: "Suivi des besoins", href: "/opportunites/marches-prives" },
  ]},
  { id: "commercial", title: "DÉVELOPPEMENT COMMERCIAL", color: "#f4cf3e", angle: 0, description: "Faire converger veille, stratégie, CRM et relations pour transformer les signaux en développement durable.", surfaces: [
    { title: "Veille & stratégie", href: "/developpement-commercial" },
    { title: "CRM & relations", href: "/developpement-commercial/crm" },
    { title: "Études de marché", href: "/developpement-commercial/etudes-de-marche" },
  ]},
  { id: "networks", title: "RÉSEAUX & ÉCOSYSTÈME", color: "#fa9a42", angle: 60, description: "Développer les relations utiles, prolonger les rencontres professionnelles et transformer salons et séminaires en opportunités concrètes.", surfaces: [
    { title: "Réseaux", href: "/reseaux" },
    { title: "Salons professionnels", href: "/reseaux" },
    { title: "Séminaires", href: "/reseaux" },
  ]},
  { id: "support", title: "ACCOMPAGNEMENT", color: "#ef5b4d", angle: 120, description: "Accompagner la préparation des réponses, la conformité des dossiers et la capitalisation des apprentissages.", surfaces: [
    { title: "Conseil AO", href: "/developpement-commercial/accompagnement-appels-offres" },
    { title: "Préparation", href: "/developpement-commercial/accompagnement-appels-offres" },
    { title: "Conformité", href: "/developpement-commercial/accompagnement-appels-offres" },
  ]},
  { id: "prospection", title: "PROSPECTION & QUALIFICATION", color: "#a365d5", angle: 180, description: "Qualifier les signaux, identifier les entreprises pertinentes, organiser les contacts et apprendre des retours.", surfaces: [
    { title: "Qualification", href: "/developpement-commercial/prospection" },
    { title: "Identification", href: "/developpement-commercial/prospection" },
    { title: "Prospection", href: "/developpement-commercial/prospection" },
  ]},
];

const CX = 450;
const CY = 450;
const RADII = [0, 180, 280, 390];
const WIDTHS = [0, 108, 116, 0];
const LABEL_RADII = [105, 230, 326];

function point(angle: number, radius: number, offset = 0) {
  const a = (angle * Math.PI) / 180;
  const nx = -Math.sin(a);
  const ny = Math.cos(a);
  return { x: CX + Math.cos(a) * radius + nx * offset, y: CY + Math.sin(a) * radius + ny * offset };
}
function crossSection(angle: number, radius: number, halfWidth: number) {
  return [point(angle, radius, -halfWidth), point(angle, radius, halfWidth)];
}
function polygonPoints(points: { x: number; y: number }[]) {
  return points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}
function surfacePolygon(angle: number, index: number) {
  const a = crossSection(angle, RADII[index], WIDTHS[index]);
  const b = crossSection(angle, RADII[index + 1], WIDTHS[index + 1]);
  return polygonPoints([a[0], b[0], b[1], a[1]]);
}
function labelPoint(angle: number, index: number) {
  return point(angle, LABEL_RADII[index]);
}
export default function MajestiOSOpportunityMap() {
  const [active, setActive] = useState("commercial");
  const [touchedSurface, setTouchedSurface] = useState<string | null>(null);
  const selected = dossiers.find((d) => d.id === active) ?? dossiers[0];

  return (
    <section className="maj-map maj-star-map" aria-labelledby="maj-map-title">
      <header className="maj-map-heading">
        <span className="section-label">LE CŒUR DU FONCTIONNEMENT MAJESTIOS</span>
        <h2 id="maj-map-title">Six activités. <em>Des liens. Une intelligence croisée.</em></h2>
        <p>Le schéma conserve ses six branches. L’emploi et le recrutement disposent de leur propre rubrique ; les réseaux, salons et séminaires contribuent aux synergies entre les activités.</p>
      </header>

      <div className="maj-star-canvas">
        <svg className="maj-star-svg" viewBox="0 0 900 900" role="group" aria-label="Schéma interactif des six dossiers et de leurs sous-dossiers">
          <circle className="maj-star-orbit" cx={CX} cy={CY} r="410" />
          <g className="maj-star-crosslinks" aria-label="Synergies transversales">
            <path d="M450 100 L450 800 M100 450 L800 450 M205 245 L695 655 M695 245 L205 655" />
          </g>
          {dossiers.map((dossier) => (
            <g key={dossier.id} className={`maj-star-dossier ${active === dossier.id ? "is-active" : ""}`}>
              {dossier.surfaces.map((surface, index) => {
                const p = labelPoint(dossier.angle, index);
                return (
                  <a key={surface.title} href={surface.href} className="maj-star-surface" aria-label={`${surface.title}, sous-dossier de ${dossier.title}`} onMouseEnter={() => setActive(dossier.id)} onFocus={() => setActive(dossier.id)} onClick={(event) => { if (window.matchMedia("(hover: none)").matches && touchedSurface !== surface.title) { event.preventDefault(); setTouchedSurface(surface.title); setActive(dossier.id); } }}>
                    <polygon points={surfacePolygon(dossier.angle, index)} fill={dossier.color} />
                    <text x={p.x} y={p.y + 4} textAnchor="middle">{surface.title}</text>
                    <title>{dossier.title} — {surface.title}</title>
                  </a>
                );
              })}
              <path className="maj-star-branch-outline" d={(() => {
                const left = crossSection(dossier.angle, RADII[0], WIDTHS[0])[0];
                const leftMid = crossSection(dossier.angle, RADII[1], WIDTHS[1])[0];
                const leftOuter = crossSection(dossier.angle, RADII[2], WIDTHS[2])[0];
                const tip = point(dossier.angle, RADII[3]);
                const rightOuter = crossSection(dossier.angle, RADII[2], WIDTHS[2])[1];
                const rightMid = crossSection(dossier.angle, RADII[1], WIDTHS[1])[1];
                const right = crossSection(dossier.angle, RADII[0], WIDTHS[0])[1];
                return `M${left.x},${left.y} L${leftMid.x},${leftMid.y} L${leftOuter.x},${leftOuter.y} L${tip.x},${tip.y} L${rightOuter.x},${rightOuter.y} L${rightMid.x},${rightMid.y} L${right.x},${right.y} Z`;
              })()} />
              <g className={`maj-star-title maj-star-title-${dossier.id}`} role="button" tabIndex={0} aria-label={`Sélectionner le dossier ${dossier.title}`} onClick={() => setActive(dossier.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setActive(dossier.id); }}>
                <text x={point(dossier.angle, 405).x} y={point(dossier.angle, 405).y + 4} textAnchor={dossier.angle === 0 ? "start" : dossier.angle === 180 ? "end" : "middle"}>{dossier.title}</text>
                <title>Sélectionner {dossier.title}</title>
              </g>
            </g>
          ))}
        </svg>
      </div>

      <div className="maj-star-legend" aria-label="Choisir un dossier">
        {dossiers.map((dossier) => (
          <button key={dossier.id} type="button" className={`maj-star-legend-button ${active === dossier.id ? "is-active" : ""}`} onClick={() => setActive(dossier.id)} aria-pressed={active === dossier.id}>
            <i style={{ background: dossier.color }} />{dossier.title}
          </button>
        ))}
      </div>

      <div className="maj-map-selection" aria-live="polite">
        <div>
          <span className="maj-map-selection-kicker">DOSSIER SÉLECTIONNÉ · {selected.title}</span>
          <strong>{selected.description}</strong>
          <p><b>Ses sous-dossiers :</b> {selected.surfaces.map((surface) => surface.title).join(" · ")}.</p>
          <p><b>Synergie :</b> ce dossier échange des signaux, des contacts et des apprentissages avec les cinq autres dossiers.</p>
        </div>
        <a className="maj-map-selection-link" href={selected.surfaces[0].href}>Ouvrir le dossier <span aria-hidden="true">↗</span></a>
      </div>
      <p className="maj-star-note">Chaque surface permet d’explorer une activité. Les liens représentent des synergies transversales. Emploi et recrutement restent accessibles dans leur rubrique dédiée, hors du schéma.</p>
    </section>
  );
}
