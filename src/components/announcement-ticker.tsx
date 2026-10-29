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
      }))
    ];
    if (tenderFeedState !== "loading" && tenders.length === 0) {
      items.push({
        id: "public-state",
        category: "Marché public",
        title: tenderFeedState === "unavailable" ? "Flux momentanément indisponible" : "Aucun avis ouvert remonté dans le flux",
        detail: "Consulter la recherche dédiée",
        href: "/opportunites/marches-publics",
        state: true
      });
    }
    if (upcomingSalons.length === 0 && today) {
      items.push({ id: "salon-state", category: "Salon", title: "Aucun salon à venir référencé", detail: "Consulter le calendrier", href: "/opportunites/salons", state: true });
    }
    items.push(
      { id: "private-state", category: "Marché privé", title: "Flux privé en préparation", detail: "Découvrir la démarche", href: "/opportunites/marches-prives", state: true },
      { id: "jobs-state", category: "Emploi", title: "Offres et missions : espace en préparation", detail: "Explorer la rubrique", href: "/opportunites/emploi", state: true }
    );
    return stableDailyOrder(items, today || "initial");
  }, [today, tenders, tenderFeedState]);

  const duplicatedItems = streamItems.length > 1 ? [...streamItems, ...streamItems] : streamItems;

  return <section className="announcement-band" aria-label="Fil continu des opportunités">
    <div className="announcement-stream-heading"><span className="band-eyebrow">VEILLE EN MOUVEMENT</span><span className="band-note">Un fil unique · chaque annonce est catégorisée</span></div>
    <div className="announcement-stream-window">
      <div className="announcement-stream-track" aria-label="Annonces et événements">
        {duplicatedItems.map((item, index) => <Link
          className={`announcement-stream-card category-${item.category.toLowerCase().replace(" ", "-")}${item.state ? " is-status" : ""}`}
          href={item.href}
          key={`${item.id}-${index}`}
          aria-hidden={index >= streamItems.length ? true : undefined}
          tabIndex={index >= streamItems.length ? -1 : undefined}
          title={item.title}
        >
          <span className="announcement-stream-category">({item.category})</span>
          <strong>{item.title}</strong>
          {item.detail ? <span className="announcement-stream-detail">{item.detail}</span> : null}
          <span className="announcement-stream-arrow" aria-hidden="true">↗</span>
        </Link>)}
      </div>
    </div>
  </section>;
}
