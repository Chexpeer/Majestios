"use client";

import Link from "next/link";

type FlowKey = "public" | "private" | "salons" | "emploi";
type Flow = { key: FlowKey; label: string; short: string; href: string; state: string; direction: "left" | "right" };

const flows: Flow[] = [
  { key: "public", label: "Marchés publics", short: "PUBLIC", href: "/opportunites/marches-publics", state: "Les annonces vérifiées apparaîtront ici.", direction: "left" },
  { key: "private", label: "Opportunités privées", short: "PRIVÉ", href: "/opportunites/marches-prives", state: "Aucune annonce privée publiée pour le moment.", direction: "left" },
  { key: "salons", label: "Salons professionnels", short: "SALONS", href: "/opportunites/salons", state: "Le calendrier sera alimenté après validation des sources officielles.", direction: "right" },
  { key: "emploi", label: "Emploi & missions", short: "EMPLOI", href: "/opportunites/emploi", state: "Découvrez les missions préparatoires du réseau MajestiOS.", direction: "right" }
];

const starterJobs = [
  { title: "Gestionnaire indépendant d’appels d’offres", id: "gestionnaire-appels-offres" },
  { title: "Business developer freelance", id: "business-developer-freelance" },
  { title: "Analyste veille et intelligence commerciale", id: "analyste-veille-commerciale" },
  { title: "Assistant administratif indépendant", id: "assistant-administratif" },
  { title: "Consultant en réponse aux marchés", id: "expert-reponse-marches" }
];

export default function AnnouncementTicker({ flow = "private" }: { flow?: FlowKey }) {
  const item = flows.find((candidate) => candidate.key === flow) ?? flows[1];
  return <section className={"announcement-band announcement-band-" + item.key} aria-label={"Flux compact : " + item.label}>
    <div className="announcement-band-head"><span className="band-eyebrow">VEILLE EN MOUVEMENT</span><span className="band-note">{item.key === "emploi" ? "Pistes de recrutement MajestiOS · offres à formaliser" : "Découverte compacte · annonces vérifiées uniquement"}</span></div>
    <div className="announcement-flows">
      <div className="announcement-flow" key={item.short}>
        <Link className="announcement-flow-label" href={item.href}><span>{item.short}</span><strong>{item.label}</strong><span aria-hidden="true">↗</span></Link>
        <div className={"announcement-flow-track direction-" + item.direction}>
          {item.key === "emploi" ? <div className="announcement-job-marquee"><div className="announcement-job-marquee-group">{[...starterJobs, ...starterJobs].map((job, index) => <Link className="announcement-job-chip" key={job.id + "-" + index} href={"/creer-espace?" + new URLSearchParams({intention:"candidature",offre:job.id,titre:job.title}).toString()}><span className="flow-status-dot" />{job.title}<span aria-hidden="true"> · Candidater ↗</span></Link>)}</div></div> : <div className={"announcement-flow-message " + (item.key === "salons" ? "ticker-direction-right" : "")}><span className="flow-status-dot" />{item.state}</div>}
        </div>
      </div>
    </div>
  </section>;
}
