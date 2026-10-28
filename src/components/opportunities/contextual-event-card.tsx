"use client";

import type { ContextualEvent } from "@/lib/contextual-opportunities/catalog";

type Props = { event: ContextualEvent };

export default function ContextualEventCard({ event }: Props) {
  const demo = event.status === "demo";
  return (
    <article className="contextual-event-card" aria-label="Opportunité contextuelle">
      <div className="contextual-event-top">
        <span className="contextual-event-kicker">OPPORTUNITÉ COMPLÉMENTAIRE</span>
        {event.sponsored && <span className="contextual-event-sponsored">Sponsorisé</span>}
      </div>
      <h3>{event.title}</h3>
      <p>{event.summary}</p>
      <div className="contextual-event-meta">
        <span>{event.locationLabel}</span>
        <span>{event.startsAt} – {event.endsAt}</span>
      </div>
      {demo ? (
        <p className="contextual-event-disclaimer">Démonstration uniquement : cet événement est fictif et ne peut pas faire l’objet d’une inscription.</p>
      ) : event.officialUrl ? (
        <a href={event.officialUrl} target="_blank" rel="noopener noreferrer">Consulter l’événement ↗</a>
      ) : null}
    </article>
  );
}
