"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type FlowKey = "public" | "private" | "salons" | "emploi" | "business" | "reseau" | "general";
type Flow = { key: FlowKey; label: string; short: string; href: string; state: string; direction: "left" | "right" };

const flows: Flow[] = [
  { key: "public", label: "Marchés publics", short: "PUBLIC", href: "/opportunites/marches-publics", state: "Les annonces vérifiées apparaîtront ici.", direction: "left" },
  { key: "private", label: "Opportunités privées", short: "PRIVÉ", href: "/opportunites/marches-prives", state: "Aucune annonce privée publiée pour le moment.", direction: "left" },
  { key: "salons", label: "Salons professionnels", short: "SALONS", href: "/opportunites/salons", state: "Le calendrier sera alimenté après validation des sources officielles.", direction: "right" },
  { key: "emploi", label: "Emploi & missions", short: "EMPLOI", href: "/opportunites/emploi", state: "Découvrez les missions préparatoires du réseau MajestiOS.", direction: "right" },
  { key: "business", label: "Signaux d’entreprise", short: "BUSINESS", href: "/business", state: "Les signaux d’entreprise seront affichés après validation des sources.", direction: "left" },
  { key: "reseau", label: "Réseau commercial", short: "RÉSEAU", href: "/opportunites", state: "Les signaux qualifiés du réseau seront affichés après validation des sources.", direction: "left" },
  { key: "general", label: "Veille commerciale", short: "VEILLE", href: "/opportunites", state: "Le flux général sera alimenté après validation des sources et des données.", direction: "left" }
];

type PublicTickerItem = { id: string | number; title: string; location?: string; deadline?: string; isOpen?: boolean };

const starterJobs = [
  { title: "Gestionnaire indépendant d’appels d’offres", id: "gestionnaire-appels-offres" },
  { title: "Business developer freelance", id: "business-developer-freelance" },
  { title: "Analyste veille et intelligence commerciale", id: "analyste-veille-commerciale" },
  { title: "Assistant administratif indépendant", id: "assistant-administratif" },
  { title: "Consultant en réponse aux marchés", id: "expert-reponse-marches" }
];

export default function AnnouncementTicker({ flow = "private" }: { flow?: FlowKey }) {
  const item = flows.find((candidate) => candidate.key === flow) ?? flows[1];
  const [publicItems, setPublicItems] = useState<PublicTickerItem[]>([]);
  const [publicMessage, setPublicMessage] = useState("Chargement des avis publics vérifiés…");

  useEffect(() => {
    if (item.key !== "public") return;
    const controller = new AbortController();
    fetch("/api/opportunities?limit=12&openOnly=true", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "La source publique est temporairement indisponible.");
        return payload as { items?: PublicTickerItem[] };
      })
      .then((payload) => {
        const validItems = (payload.items ?? []).filter((notice) => notice.id && notice.title && notice.isOpen);
        setPublicItems(validItems);
        setPublicMessage(validItems.length ? "" : "Aucun avis public ouvert n’est disponible dans ce flux pour le moment.");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setPublicItems([]);
        setPublicMessage(error instanceof Error ? error.message : "La source publique est temporairement indisponible.");
      });
    return () => controller.abort();
  }, [item.key]);

  return <section className={"announcement-band announcement-band-" + item.key} aria-label={"Flux compact : " + item.label}>
    <div className="announcement-band-head"><span className="band-eyebrow">VEILLE EN MOUVEMENT</span><span className="band-note">{item.key === "emploi" ? "Pistes de recrutement MajestiOS · offres à formaliser" : "Découverte compacte · annonces vérifiées uniquement"}</span></div>
    <div className="announcement-flows">
      <div className="announcement-flow" key={item.short}>
        <Link className="announcement-flow-label" href={item.href}><span>{item.short}</span><strong>{item.label}</strong><span aria-hidden="true">↗</span></Link>
        <div className={"announcement-flow-track direction-" + item.direction}>
          {item.key === "public" ? (publicItems.length ? <div className="announcement-job-marquee"><div className="announcement-job-marquee-group">{[...publicItems, ...publicItems].map((notice, index) => <Link className="announcement-job-chip" key={String(notice.id) + "-" + index} href={"/espace-professionnel?" + new URLSearchParams({ intention: "opportunite", source: "boamp", opportunite: String(notice.id), titre: notice.title }).toString()}><span className="flow-status-dot" /><strong>{notice.title}</strong><span aria-hidden="true"> · {notice.location ?? "Territoire à vérifier"} · Étudier ↗</span></Link>)}</div></div> : <div className="announcement-flow-message"><span className="flow-status-dot" />{publicMessage}</div>) : item.key === "emploi" ? <div className="announcement-job-marquee"><div className="announcement-job-marquee-group">{[...starterJobs, ...starterJobs].map((job, index) => <Link className="announcement-job-chip" key={job.id + "-" + index} href={"/creer-espace?" + new URLSearchParams({intention:"candidature",offre:job.id,titre:job.title}).toString()}><span className="flow-status-dot" />{job.title}<span aria-hidden="true"> · Candidater ↗</span></Link>)}</div></div> : <div className={"announcement-flow-message " + (item.key === "salons" ? "ticker-direction-right" : "")}><span className="flow-status-dot" />{item.state}</div>}
        </div>
      </div>
    </div>
  </section>;
}
