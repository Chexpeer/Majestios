"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Notice = { id: string | number; title: string; location?: string; deadline?: string; isOpen?: boolean };
type FeedItem = { key: string; title: string; detail: string; href: string; intention: string; source: string };

const preparationItems: FeedItem[] = [
  { key: "private", title: "Marchés privés", detail: "Rubrique en préparation", href: "/creer-espace?intention=opportunite&source=flux-prive", intention: "opportunite", source: "flux-prive" },
  { key: "salons", title: "Salons professionnels", detail: "Calendrier en préparation", href: "/creer-espace?intention=opportunite&source=flux-salons", intention: "opportunite", source: "flux-salons" },
  { key: "jobs", title: "Emploi et missions", detail: "Offres à formaliser", href: "/creer-espace?intention=candidature&source=flux-emploi", intention: "candidature", source: "flux-emploi" },
  { key: "business", title: "Signaux d’entreprise", detail: "Sources à connecter", href: "/creer-espace?intention=opportunite&source=flux-business", intention: "opportunite", source: "flux-business" },
  { key: "network", title: "Réseautage intelligent", detail: "Mise en relation en préparation", href: "/creer-espace?intention=espace&source=flux-reseau", intention: "espace", source: "flux-reseau" },
];

export default function AnnouncementTicker(_props?: { flow?: string }) {
  const [notices, setNotices] = useState<Notice[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/opportunities?limit=12&openOnly=true", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error("Source momentanément indisponible");
        return payload as { items?: Notice[] };
      })
      .then((payload) => setNotices((payload.items ?? []).filter((item) => item.id && item.title && item.isOpen)))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setNotices([]);
      });
    return () => controller.abort();
  }, []);

  const realItems: FeedItem[] = notices.map((notice) => ({
    key: String(notice.id),
    title: notice.title,
    detail: [notice.location, notice.deadline ? "Échéance : " + notice.deadline : ""].filter(Boolean).join(" · ") || "Avis public à vérifier",
    href: "/creer-espace?" + new URLSearchParams({ intention: "opportunite", source: "boamp", opportunite: String(notice.id), titre: notice.title }).toString(),
    intention: "opportunite",
    source: "boamp",
  }));
  const items = [...realItems, ...preparationItems];

  return (
    <section className="announcement-band announcement-band-general" aria-label="Flux commun des annonces MajestiOS">
      <span className="ticker-accessible-label">Annonces MajestiOS</span>
      <div className="announcement-flow-track direction-left">
        <div className="announcement-job-marquee">
          <div className="announcement-job-marquee-group">
            {[...items, ...items].map((item, index) => (
              <Link className="announcement-job-chip" key={item.key + "-" + index} href={item.href} aria-label={item.title + " — " + item.detail}>
                <span className="flow-status-dot" aria-hidden="true" />
                <strong>{item.title}</strong>
                <span aria-hidden="true"> · {item.detail} · Voir ↗</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
