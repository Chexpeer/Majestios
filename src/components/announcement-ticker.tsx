"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { salonEvents } from "@/data/salon-events";

type TenderItem = {
  id: string | number;
  title: string;
  type?: string;
  location?: string;
  buyer?: string;
  deadline?: string;
  publishedAt?: string;
  officialStatus?: string;
};

type Flow = { label: string; short: string; href: string; state: string; direction: "left" | "right" };

function formatEventDate(startDate: string, endDate?: string) {
  const format = (value: string) => new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", timeZone: "Europe/Paris" }).format(new Date(value));
  return endDate && endDate !== startDate ? `${format(startDate)} – ${format(endDate)}` : format(startDate);
}

const flows: Flow[] = [
  { label: "Marchés publics", short: "PUBLIC", href: "/opportunites/marches-publics", state: "Aucune annonce vérifiée disponible actuellement.", direction: "left" },
  { label: "Opportunités privées", short: "PRIVÉ", href: "/opportunites/marches-prives", state: "Aucune annonce privée publiée pour le moment.", direction: "left" },
  { label: "Salons professionnels", short: "SALONS", href: "/opportunites/salons", state: "Aucun salon à venir n’est actuellement référencé.", direction: "right" },
  { label: "Emploi & missions", short: "EMPLOI", href: "/opportunites/emploi", state: "Aucune offre publiée pour le moment.", direction: "right" }
];

function tenderHref(item: TenderItem) {
  const params = new URLSearchParams({
    title: item.title || "",
    buyer: item.buyer || "",
    deadline: item.deadline || "",
    category: item.type || "",
    department: item.location || "",
    publishedAt: item.publishedAt || "",
    status: item.officialStatus || ""
  });
  return `/opportunites/marches-publics/${encodeURIComponent(String(item.id))}?${params.toString()}`;
}

export default function AnnouncementTicker() {
  const [tenders, setTenders] = useState<TenderItem[]>([]);
  const [today, setToday] = useState("");
  const [tenderFeedState, setTenderFeedState] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    const getParisDate = () => {
      const parts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Europe/Paris" }).formatToParts(new Date());
      return `${parts.find((part) => part.type === "year")?.value}-${parts.find((part) => part.type === "month")?.value}-${parts.find((part) => part.type === "day")?.value}`;
    };
    let active = true;
    fetch("/api/opportunities?limit=8&openOnly=true", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("BOAMP indisponible");
        const payload = await response.json();
        return Array.isArray(payload.items) ? payload.items as TenderItem[] : [];
      })
      .then((items) => { if (active) { setToday(getParisDate()); setTenders(items); setTenderFeedState("ready"); } })
      .catch(() => { if (active) { setToday(getParisDate()); setTenders([]); setTenderFeedState("unavailable"); } });
    return () => { active = false; };
  }, []);

  const upcomingSalons = today ? salonEvents.filter((event) => event.endDate ? event.endDate >= today : event.startDate >= today) : salonEvents;

  return <section className="announcement-band" aria-label="Quatre flux d’opportunités">
    <div className="announcement-band-head"><span className="band-eyebrow">VEILLE EN MOUVEMENT</span><span className="band-note">Quatre portes d’entrée · annonces vérifiées uniquement</span></div>
    <div className="announcement-flows">
      {flows.map((flow) => {
        const hasTenders = flow.short === "PUBLIC" && tenders.length > 0;
        const hasSalons = flow.short === "SALONS" && upcomingSalons.length > 0;
        return <div className={`announcement-flow flow-${flow.short.toLowerCase()}`} key={flow.short}>
          <Link className="announcement-flow-label" href={flow.href}><span>{flow.short}</span><strong>{flow.label}</strong><span aria-hidden="true">↗</span></Link>
          <div className="announcement-flow-track">
            {hasTenders ? <div className={`announcement-flow-marquee direction-${flow.direction}`} aria-label="Appels d’offres publics vérifiés">
                <div className="announcement-flow-marquee-group">
                  {tenders.map((item) => <Link className="announcement-flow-item flow-item-public" href={tenderHref(item)} key={String(item.id)} title={item.title}>
                    <span className="flow-status-dot" /><strong>{item.title}</strong><span>{item.location || "Territoire à vérifier"}</span><span aria-hidden="true">↗</span>
                  </Link>)}
                </div>
                <div className="announcement-flow-marquee-group" aria-hidden="true">
                  {tenders.map((item) => <Link className="announcement-flow-item" href={tenderHref(item)} key={String(item.id)} tabIndex={-1} title={item.title}>
                    <span className="flow-status-dot" /><strong>{item.title}</strong><span>{item.location || "Territoire à vérifier"}</span><span aria-hidden="true">↗</span>
                  </Link>)}
                </div>
              </div>
              : hasSalons ? <div className={`announcement-flow-marquee direction-${flow.direction}`} aria-label="Salons professionnels vérifiés">
                <div className="announcement-flow-marquee-group">{upcomingSalons.map((event) => <Link className="announcement-flow-item" href={`/opportunites/salons/${event.slug}`} key={event.slug}><span className="flow-status-dot" /><strong>{event.title}</strong><span>{event.city}</span><span>{formatEventDate(event.startDate, event.endDate)}</span><span aria-hidden="true">↗</span></Link>)}</div>
                <div className="announcement-flow-marquee-group" aria-hidden="true">{upcomingSalons.map((event) => <Link className="announcement-flow-item" href={`/opportunites/salons/${event.slug}`} key={event.slug} tabIndex={-1}><span className="flow-status-dot" /><strong>{event.title}</strong><span>{event.city}</span><span>{formatEventDate(event.startDate, event.endDate)}</span><span aria-hidden="true">↗</span></Link>)}</div>
              </div>
              : <div className="announcement-flow-message"><span className="flow-status-dot" />{flow.short === "PUBLIC" ? tenderFeedState === "loading" ? "Chargement des avis publics…" : tenderFeedState === "unavailable" ? "Flux temporairement indisponible : ouvrez la recherche dédiée." : "Aucun avis ouvert disponible dans le flux. Ouvrez la recherche dédiée." : flow.state}</div>}
          </div>
        </div>;
      })}
    </div>
  </section>;
}
