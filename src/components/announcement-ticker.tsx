"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

type StreamItem = {
  id: string;
  category: "Marché public" | "Marché privé" | "Salon" | "Emploi";
  title: string;
  detail: string;
  href: string;
  state?: boolean;
  demo?: boolean;
};

function formatEventDate(startDate: string, endDate?: string) {
  const format = (value: string) => new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", timeZone: "Europe/Paris" }).format(new Date(value));
  return endDate && endDate !== startDate ? `${format(startDate)} – ${format(endDate)}` : format(startDate);
}

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

function stableDailyOrder(items: StreamItem[], day: string) {
  const score = (value: string) => {
    let hash = 2166136261;
    for (const character of `${day}:${value}`) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
    return hash >>> 0;
  };
  return [...items].sort((a, b) => score(a.id) - score(b.id));
}

export default function AnnouncementTicker() {
  const [tenders, setTenders] = useState<TenderItem[]>([]);
  const [today] = useState(() => {
    const parts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Europe/Paris" }).formatToParts(new Date());
    return `${parts.find((part) => part.type === "year")?.value}-${parts.find((part) => part.type === "month")?.value}-${parts.find((part) => part.type === "day")?.value}`;
  });
  const [tenderFeedState, setTenderFeedState] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/opportunities?limit=8&openOnly=true", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Flux public indisponible");
        const payload = await response.json();
        return Array.isArray(payload.items) ? payload.items as TenderItem[] : [];
      })
      .then((items) => { if (active) { setTenders(items); setTenderFeedState("ready"); } })
      .catch(() => { if (active) { setTenders([]); setTenderFeedState("unavailable"); } });
    return () => { active = false; };
  }, []);

  const streamItems = useMemo(() => {
    const upcomingSalons = today ? salonEvents.filter((event) => event.endDate ? event.endDate >= today : event.startDate >= today) : [];
    const items: StreamItem[] = [
      ...tenders.map((item) => ({
        id: `public-${item.id}`,
        category: "Marché public" as const,
        title: item.title,
        detail: [item.location, item.deadline].filter(Boolean).join(" · "),
        href: tenderHref(item)
      })),
      ...upcomingSalons.map((event) => ({
        id: `salon-${event.slug}`,
        category: "Salon" as const,
        title: event.title,
        detail: `${event.city} · ${formatEventDate(event.startDate, event.endDate)}`,
        href: `/opportunites/salons/${event.slug}`
      })),
      {
        id: "private-demo-1",
        category: "Marché privé",
        title: "Exemple fictif : recherche d’un sous-traitant pour un chantier",
        detail: "DÉMONSTRATION · annonce non réelle",
        href: "/opportunites/privees",
        demo: true
      },
      {
        id: "private-demo-2",
        category: "Marché privé",
        title: "Exemple fictif : une entreprise recherche un prestataire de maintenance",
        detail: "DÉMONSTRATION · annonce non réelle",
        href: "/opportunites/privees",
        demo: true
      },
      {
        id: "jobs-demo-1",
        category: "Emploi",
        title: "Exemple fictif : offre d’emploi pour un technicien polyvalent",
        detail: "DÉMONSTRATION · offre non réelle",
        href: "/opportunites/emploi",
        demo: true
      },
      {
        id: "jobs-demo-2",
        category: "Emploi",
        title: "Exemple fictif : mission de renfort administratif",
        detail: "DÉMONSTRATION · mission non réelle",
        href: "/opportunites/emploi",
        demo: true
      }
    ];
    if (tenderFeedState !== "loading" && tenders.length === 0) {
      items.push({
        id: "public-state",
        category: "Marché public",
        title: tenderFeedState === "unavailable" ? "Flux public momentanément indisponible" : "Aucun avis ouvert remonté dans le flux",
        detail: "Consulter la recherche dédiée",
        href: "/opportunites/publiques",
        state: true
      });
    }
    if (upcomingSalons.length === 0 && today) {
      items.push({ id: "salon-state", category: "Salon", title: "Aucun salon à venir référencé", detail: "Consulter le calendrier", href: "/opportunites/salons", state: true });
    }
    return stableDailyOrder(items, today || "initial");
  }, [today, tenders, tenderFeedState]);

  const duplicatedItems = streamItems.length > 1 ? [...streamItems, ...streamItems] : streamItems;

  return <section className="announcement-band" aria-label="Fil continu des opportunités">
    <div className="announcement-stream-heading"><span className="band-eyebrow">VEILLE EN MOUVEMENT</span><span className="band-note">Public · privé · emploi — exemples fictifs signalés</span></div>
    <div className="announcement-stream-window">
      <div className="announcement-stream-track" aria-label="Annonces et événements">
        {duplicatedItems.map((item, index) => <Link
          className={`announcement-stream-card category-${item.category.toLowerCase().replace(" ", "-")}${item.state ? " is-status" : ""}${item.demo ? " is-demo" : ""}`}
          href={item.href}
          key={`${item.id}-${index}`}
          aria-hidden={index >= streamItems.length ? true : undefined}
          tabIndex={index >= streamItems.length ? -1 : undefined}
          title={item.title}
        >
          <span className="announcement-stream-category">({item.category}{item.demo ? " · DÉMO" : ""})</span>
          <strong>{item.title}</strong>
          {item.detail ? <span className="announcement-stream-detail">{item.detail}</span> : null}
          <span className="announcement-stream-arrow" aria-hidden="true">↗</span>
        </Link>)}
      </div>
    </div>
  </section>;
}
