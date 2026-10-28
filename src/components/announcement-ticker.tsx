"use client";

import Link from "next/link";

type FlowKey = "public" | "private" | "salons" | "emploi";
type Flow = { key: FlowKey; label: string; short: string; href: string; state: string; direction: "left" | "right" };

const flows: Flow[] = [
  { key: "public", label: "Marchés publics", short: "PUBLIC", href: "/opportunites/marches-publics", state: "Les annonces vérifiées apparaîtront ici.", direction: "left" },
  { key: "private", label: "Opportunités privées", short: "PRIVÉ", href: "/opportunites/marches-prives", state: "Aucune annonce privée publiée pour le moment.", direction: "left" },
  { key: "salons", label: "Salons professionnels", short: "SALONS", href: "/opportunites/salons", state: "Le calendrier sera alimenté après validation des sources officielles.", direction: "right" },
  { key: "emploi", label: "Emploi & missions", short: "EMPLOI", href: "/opportunites/emploi", state: "Aucune offre publiée pour le moment.", direction: "right" }
];

export default function AnnouncementTicker({ flow = "private" }: { flow?: FlowKey }) {
  const item = flows.find((candidate) => candidate.key === flow) ?? flows[1];
  return <section className="announcement-band" aria-label={`Flux compact : ${item.label}`}>
    <div className="announcement-band-head"><span className="band-eyebrow">VEILLE EN MOUVEMENT</span><span className="band-note">Découverte compacte · annonces vérifiées uniquement</span></div>
    <div className="announcement-flows">
      <div className="announcement-flow" key={item.short}>
        <Link className="announcement-flow-label" href={item.href}><span>{item.short}</span><strong>{item.label}</strong><span aria-hidden="true">↗</span></Link>
        <div className={`announcement-flow-track direction-${item.direction}`}><div className="announcement-flow-message"><span className="flow-status-dot" />{item.state}</div></div>
      </div>
    </div>
  </section>;
}
