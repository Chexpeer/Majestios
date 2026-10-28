"use client";

import Link from "next/link";

type Flow = { label: string; short: string; href: string; state: string; direction: "left" | "right" };

const flows: Flow[] = [
  { label: "Marchés publics", short: "PUBLIC", href: "/opportunites/marches-publics", state: "Les annonces vérifiées apparaîtront ici.", direction: "left" },
  { label: "Opportunités privées", short: "PRIVÉ", href: "/opportunites/marches-prives", state: "Aucune annonce privée publiée pour le moment.", direction: "left" },
  { label: "Salons professionnels", short: "SALONS", href: "/opportunites/salons", state: "Le calendrier sera alimenté après validation des sources officielles.", direction: "right" },
  { label: "Emploi & missions", short: "EMPLOI", href: "/opportunites/emploi", state: "Aucune offre publiée pour le moment.", direction: "right" }
];

export default function AnnouncementTicker() {
  return <section className="announcement-band" aria-label="Quatre flux d’opportunités">
    <div className="announcement-band-head"><span className="band-eyebrow">VEILLE EN MOUVEMENT</span><span className="band-note">Quatre portes d’entrée · annonces vérifiées uniquement</span></div>
    <div className="announcement-flows">
      {flows.map((flow) => <div className="announcement-flow" key={flow.short}>
        <Link className="announcement-flow-label" href={flow.href}><span>{flow.short}</span><strong>{flow.label}</strong><span aria-hidden="true">↗</span></Link>
        <div className={`announcement-flow-track direction-${flow.direction}`}><div className="announcement-flow-message"><span className="flow-status-dot" />{flow.state}</div></div>
      </div>)}
    </div>
  </section>;
}
