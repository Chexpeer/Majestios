"use client";

import Link from "next/link";
import { useState } from "react";

const dossiers = [
  {
    id: "commercial",
    title: "Développement commercial",
    position: "top",
    color: "gold",
    href: "/developpement-commercial",
    description: "Anticiper les marchés, comprendre les secteurs et entretenir la mémoire des relations commerciales.",
    rubrics: [
      { title: "Veille & prospective", href: "/developpement-commercial", level: "main" },
      { title: "CRM & relations", href: "/developpement-commercial/crm", level: "secondary" },
      { title: "Études de marché", href: "/developpement-commercial/etudes-de-marche", level: "secondary" },
    ],
    links: ["qualification", "public", "private", "events", "support"],
  },
  {
    id: "qualification",
    title: "Qualification & prospection",
    position: "upper-left",
    color: "teal",
    href: "/developpement-commercial/prospection",
    description: "Transformer les signaux détectés en opportunités évaluées, entreprises identifiées et démarches ciblées.",
    rubrics: [
      { title: "Qualification des opportunités", href: "/developpement-commercial/prospection", level: "main" },
      { title: "Identification des entreprises", href: "/developpement-commercial/prospection", level: "secondary" },
      { title: "Prospection commerciale", href: "/developpement-commercial/prospection", level: "secondary" },
    ],
    links: ["commercial", "public", "private", "events", "support"],
  },
  {
    id: "events",
    title: "Salons & événements professionnels",
    position: "upper-right",
    color: "blue",
    href: "/opportunites/salons",
    description: "Préparer les rencontres professionnelles, identifier les interlocuteurs et exploiter les contacts recueillis.",
    rubrics: [
      { title: "Salons & événements", href: "/opportunites/salons", level: "main" },
      { title: "Agenda professionnel", href: "/opportunites/salons", level: "secondary" },
      { title: "Réseautage professionnel", href: "/opportunites/salons", level: "secondary" },
    ],
    links: ["commercial", "qualification", "public", "private", "support"],
  },
  {
    id: "public",
    title: "Marchés publics",
    position: "lower-left",
    color: "navy",
    href: "/opportunites/marches-publics",
    description: "Rechercher des appels d’offres publics, les qualifier et repérer les possibilités de sous-traitance.",
    rubrics: [
      { title: "Appels d’offres publics", href: "/opportunites/marches-publics", level: "main" },
      { title: "Qualification des appels d’offres", href: "/opportunites/marches-publics", level: "secondary" },
      { title: "Sous-traitance potentielle", href: "/opportunites/marches-publics", level: "secondary" },
    ],
    links: ["commercial", "qualification", "private", "events", "support"],
  },
  {
    id: "private",
    title: "Marchés privés",
    position: "lower-right",
    color: "green",
    href: "/opportunites/marches-prives",
    description: "Détecter les besoins des donneurs d’ordre privés et suivre les opportunités jusqu’à l’action commerciale.",
    rubrics: [
      { title: "Opportunités privées", href: "/opportunites/marches-prives", level: "main" },
      { title: "Donneurs d’ordre", href: "/opportunites/marches-prives", level: "secondary" },
      { title: "Suivi des opportunités", href: "/opportunites/marches-prives", level: "secondary" },
    ],
    links: ["commercial", "qualification", "public", "events", "support"],
  },
  {
    id: "support",
    title: "Accompagnement",
    position: "bottom",
    color: "violet",
    href: "/developpement-commercial/accompagnement-appels-offres",
    description: "Passer d’une opportunité retenue à une réponse préparée, structurée et contrôlée.",
    rubrics: [
      { title: "Accompagnement aux appels d’offres", href: "/developpement-commercial/accompagnement-appels-offres", level: "main" },
      { title: "Préparation des réponses", href: "/developpement-commercial/accompagnement-appels-offres", level: "secondary" },
      { title: "Conformité des dossiers", href: "/developpement-commercial/accompagnement-appels-offres", level: "secondary" },
    ],
    links: ["commercial", "qualification", "public", "private", "events"],
  },
];

const relationshipLabels: Record<string, string> = {
  commercial: "veille, études et mémoire CRM",
  qualification: "qualification, ciblage et prospection",
  events: "rencontres, agenda et réseautage",
  public: "appels d’offres et sous-traitance",
  private: "besoins privés et donneurs d’ordre",
  support: "préparation, conformité et capitalisation",
};

export default function MajestiOSOpportunityMap() {
  const [active, setActive] = useState("commercial");
  const selected = dossiers.find((dossier) => dossier.id === active) ?? dossiers[0];

  return (
    <section className="maj-map maj-interactive-architecture" aria-labelledby="maj-map-title">
      <div className="maj-map-heading">
        <span className="section-label">LE CŒUR DU FONCTIONNEMENT MAJESTIOS</span>
        <h2 id="maj-map-title">Six dossiers. <em>Un écosystème connecté.</em></h2>
        <p>Chaque losange est un dossier. Sa surface principale porte l’activité dominante ; ses deux surfaces secondaires ouvrent des rubriques complémentaires.</p>
      </div>

      <div className="maj-architecture" aria-label="Schéma interactif des six dossiers MajestiOS">
        <svg className="maj-architecture-links" viewBox="0 0 1000 720" aria-hidden="true">
          <g>
            <path d="M500 110 L275 250 L165 470 L500 620 L835 470 L725 250 Z" />
            <path d="M500 110 L725 250 L835 470 L500 620 L165 470 L275 250 Z" />
            <path d="M275 250 L725 250 M165 470 L835 470 M275 250 L500 620 M725 250 L500 620" />
          </g>
          {[[500,110],[275,250],[725,250],[165,470],[835,470],[500,620],[500,365]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={i===6?7:4} />)}
        </svg>

        {dossiers.map((dossier) => (
          <article key={dossier.id} className={`maj-dossier maj-dossier-${dossier.position} tone-${dossier.color} ${active === dossier.id ? "is-active" : ""}`}>
            <button className="maj-dossier-heading" type="button" onClick={() => setActive(dossier.id)} aria-pressed={active === dossier.id}>
              <span className="maj-dossier-number">{String(dossiers.findIndex((d) => d.id === dossier.id) + 1).padStart(2,"0")}</span>
              <strong>{dossier.title}</strong>
            </button>
            <div className="maj-dossier-surfaces">
              {dossier.rubrics.map((rubric, index) => (
                <Link
                  key={rubric.title}
                  href={rubric.href}
                  className={`maj-dossier-surface ${rubric.level} surface-${index + 1}`}
                  onFocus={() => setActive(dossier.id)}
                  aria-label={`${rubric.title} — dossier ${dossier.title}`}
                >
                  <span>{rubric.title}</span>
                  {index === 0 ? <small>PRINCIPALE · 60 %</small> : <small>SECONDAIRE · 20 %</small>}
                </Link>
              ))}
            </div>
          </article>
        ))}

        <div className="maj-architecture-core">
          <span>MAJESTIOS</span>
          <strong>Intelligence opérationnelle</strong>
          <small>Connecter · Qualifier · Agir · Capitaliser</small>
        </div>
      </div>

      <div className="maj-relationship-key">
        <span className="maj-relationship-line" /> <span>Les liaisons symbolisent les échanges entre dossiers, pas une hiérarchie imposée.</span>
      </div>

      <div className="maj-map-selection" aria-live="polite">
        <div>
          <span className="maj-map-selection-kicker">DOSSIER SÉLECTIONNÉ · {selected.title.toLocaleUpperCase("fr-FR")}</span>
          <strong>{selected.description}</strong>
          <p><b>Connexions :</b> {selected.links.map((id) => dossiers.find((d) => d.id === id)?.title).filter(Boolean).join(" · ")}.</p>
          <p><b>Contribution :</b> {relationshipLabels[selected.id]}.</p>
        </div>
        <Link href={selected.href} className="maj-map-selection-link">Ouvrir le dossier <span aria-hidden="true">↗</span></Link>
      </div>
      <p className="maj-star-note">Les 18 surfaces constituent des entrées de navigation. Les liaisons représentent les échanges fonctionnels entre domaines ; les destinations restent limitées aux routes prévues et ne signifient pas que toutes les fonctionnalités sont déjà actives. La rubrique Emploi conserve une structure distincte.</p>
    </section>
  );
}
