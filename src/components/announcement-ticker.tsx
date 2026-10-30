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
  title: string;
  detail: string;
  href: string;
  demo?: boolean;
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

function Flow({ title, eyebrow, items, direction, tone }: { title: string; eyebrow: string; items: StreamItem[]; direction: "left" | "right"; tone: "public" | "private" | "employment" | "salons" }) {
  const duplicated = items.length > 1 ? [...items, ...items] : items;
  return <section className={`announcement-flow flow-${tone}`} aria-label={title}>
    <div className="announcement-flow-label"><span>{eyebrow}</span><strong>{title}</strong><span aria-hidden="true">●</span></div>
    <div className="announcement-flow-track">
      <div className={`announcement-flow-marquee ${direction === "right" ? "direction-right" : ""}`}>
        {[0, 1].map((group) => <div className="announcement-flow-marquee-group" key={group} aria-hidden={group === 1 ? true : undefined}>
          {duplicated.map((item, index) => <Link className="announcement-flow-item" key={`${item.id}-${group}-${index}`} href={item.href} tabIndex={group === 1 ? -1 : undefined} title={item.title}>
            <span className="flow-status-dot" aria-hidden="true" />
            <strong>{item.title}</strong>
            <span>{item.detail}</span>
            {item.demo ? <span>· DÉMO</span> : null}
          </Link>)}
        </div>)}
      </div>
    </div>
  </section>;
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

  const flows = useMemo(() => {
    const upcomingSalons = today ? salonEvents.filter((event) => event.endDate ? event.endDate >= today : event.startDate >= today) : [];
    const publicItems: StreamItem[] = tenders.map((item) => ({
      id: `public-${item.id}`, title: item.title,
      detail: [item.location, item.deadline].filter(Boolean).join(" · "),
      href: tenderHref(item)
    }));
    if (!publicItems.length && tenderFeedState !== "loading") publicItems.push({
      id: "public-state",
      title: tenderFeedState === "unavailable" ? "Flux BOAMP momentanément indisponible" : "Aucun avis ouvert remonté actuellement",
      detail: "Rechercher dans les marchés publics",
      href: "/opportunites/marches-publics/appels-offres",
      state: true
    });

    const privateItems: StreamItem[] = [
      { id: "private-demo-1", title: "Recherche d’un sous-traitant pour un chantier", detail: "Exemple fictif · annonce non réelle", href: "/opportunites/marches-prives", demo: true },
      { id: "private-demo-2", title: "Besoin d’un prestataire de maintenance", detail: "Exemple fictif · annonce non réelle", href: "/opportunites/marches-prives", demo: true }
    ];
    const employmentItems: StreamItem[] = [
      { id: "jobs-demo-1", title: "Technicien polyvalent", detail: "Exemple fictif · offre non réelle", href: "/opportunites/emploi/offres", demo: true },
      { id: "jobs-demo-2", title: "Renfort administratif", detail: "Exemple fictif · mission non réelle", href: "/opportunites/emploi/missions", demo: true }
    ];
    const salonItems: StreamItem[] = upcomingSalons.map((event) => ({
      id: `salon-${event.slug}`, title: event.title,
      detail: `${event.city} · ${formatEventDate(event.startDate, event.endDate)}`,
      href: `/opportunites/salons/${event.slug}`
    }));
    if (!salonItems.length && today) salonItems.push({ id: "salon-state", title: "Aucun salon à venir référencé", detail: "Consulter le calendrier", href: "/opportunites/salons", state: true });

    return {
      public: stableDailyOrder(publicItems, today || "initial"),
      private: stableDailyOrder(privateItems, today || "initial"),
      employment: stableDailyOrder(employmentItems, today || "initial"),
      salons: stableDailyOrder(salonItems, today || "initial")
    };
  }, [today, tenders, tenderFeedState]);

  return <section className="announcement-band" aria-label="Flux distincts d’opportunités">
    <div className="announcement-band-head"><span className="band-eyebrow">VEILLE EN MOUVEMENT</span><span className="band-note">Public · privé · emploi · salons — les exemples fictifs sont signalés</span></div>
    <div className="announcement-flows">
      <Flow title="Marchés publics" eyebrow="PUBLIC" items={flows.public} direction="left" tone="public" />
      <Flow title="Opportunités privées" eyebrow="PRIVÉ" items={flows.private} direction="left" tone="private" />
      <Flow title="Emploi & recrutement" eyebrow="EMPLOI" items={flows.employment} direction="right" tone="employment" />
      <Flow title="Salons professionnels" eyebrow="RÉSEAU" items={flows.salons} direction="left" tone="salons" />
    </div>
  </section>;
}
