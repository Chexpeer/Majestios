"use client";

import Link from "next/link";
import { useState } from "react";

const axes = [
  { id: "commercial", label: "Développement commercial", group: "DOMAINE STRATÉGIQUE", description: "Développer l’activité, identifier les marchés porteurs et transformer les opportunités en relations commerciales durables.", href: "/developpement-commercial", point: "top" },
  { id: "public", label: "Marchés publics", group: "DOMAINE STRATÉGIQUE", description: "Détecter et qualifier les appels d’offres publics, comprendre les exigences et préparer le positionnement.", href: "/opportunites/marches-publics", point: "left" },
  { id: "private", label: "Marchés privés", group: "DOMAINE STRATÉGIQUE", description: "Repérer les consultations privées, les besoins de sous-traitance et les opportunités moins visibles.", href: "/opportunites/marches-prives", point: "right" },
  { id: "qualification", label: "Qualification & prospection", group: "LEVIER OPÉRATIONNEL", description: "Qualifier les opportunités et les entreprises, identifier les bons interlocuteurs, puis organiser une prospection ciblée.", href: "/developpement-commercial/prospection", point: "upper-left" },
  { id: "events", label: "Salons & événements professionnels", group: "LEVIER OPÉRATIONNEL", description: "Repérer les rencontres utiles, développer le réseau professionnel et détecter de nouveaux besoins commerciaux.", href: "/opportunites/salons", point: "upper-right" },
  { id: "support", label: "Accompagnement", group: "LEVIER OPÉRATIONNEL", description: "Structurer la démarche et accompagner l’entreprise dans la qualification, le positionnement et la réponse aux opportunités.", href: "/developpement-commercial/accompagnement-appels-offres", point: "bottom" },
];

export default function MajestiOSOpportunityMap() {
  const [active, setActive] = useState("commercial");
  const selected = axes.find((axis) => axis.id === active) ?? axes[0];

  return (
    <section className="maj-map maj-star-map" aria-labelledby="maj-map-title">
      <div className="maj-map-heading">
        <span className="section-label">LE CŒUR DU FONCTIONNEMENT MAJESTIOS</span>
        <h2 id="maj-map-title">Six axes. <em>Une stratégie en étoile.</em></h2>
        <p>À l’origine de tout engagement : un besoin réel, un budget compatible et un climat de confiance. Dans la grammaire MajestiOS, chaque triangle représente une page, chaque côté une communication entre pages et chaque croisement une page d’information dédiée aux éléments qui s’y rencontrent.</p>
      </div>
      <div className="maj-star-legend" aria-label="Les deux dimensions de la stratégie">
        <span><i className="legend-strategy" /> Domaines stratégiques</span>
        <span><i className="legend-operational" /> Leviers opérationnels</span>
      </div>
      <div className="maj-star-stage">
        <svg className="maj-star-lines" viewBox="0 0 600 560" role="img" aria-label="Deux triangles de taille presque identique se croisent pour former une étoile à six branches">
          <polygon className="maj-star-triangle maj-star-strategy" points="300,26 55,455 545,455" />
          <polygon className="maj-star-triangle maj-star-operational" points="300,534 55,105 545,105" />
          <circle className="maj-star-crossing" cx="300" cy="280" r="48" />
        </svg>
        {axes.map((axis) => (
          <button
            key={axis.id}
            type="button"
            className={`maj-star-axis maj-star-${axis.point} ${active === axis.id ? "is-active" : ""}`}
            onClick={() => setActive(axis.id)}
            onFocus={() => setActive(axis.id)}
            aria-pressed={active === axis.id}
          >
            <span className="maj-star-axis-group">{axis.group}</span>
            <strong>{axis.label}</strong>
            <span className="maj-star-axis-open">Explorer ↗</span>
          </button>
        ))}
        <div className="maj-star-core" aria-label="MajestiOS, centre de coordination de la stratégie">
          <span className="maj-star-core-mark">M</span>
          <strong>MajestiOS</strong>
          <small>Intelligence commerciale proactive</small>
        </div>
      </div>
      <div className="maj-star-selection" aria-live="polite">
        <div>
          <span className="maj-star-selection-kicker">{selected.group}</span>
          <h3>{selected.label}</h3>
          <p>{selected.description}</p>
        </div>
        <Link href={selected.href} className="maj-star-selection-link">Ouvrir la rubrique <span aria-hidden="true">↗</span></Link>
      </div>
      <p className="maj-star-note">Triangle = page MajestiOS. Côté = communication entre pages. Croisement = page d’information MajestiOS où les informations reliées se rencontrent. MajestiOS veille à la cohérence de ces communications et à la pertinence des informations qui en résultent. La rubrique Emploi est organisée séparément.</p>
    </section>
  );
}
