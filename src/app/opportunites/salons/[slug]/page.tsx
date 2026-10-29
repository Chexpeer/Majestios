import Link from "next/link";
import PublicHeader from "@/components/public-header";
import { notFound } from "next/navigation";
import { getSalonEvent, salonEvents } from "@/data/salon-events";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return salonEvents.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const event = getSalonEvent(slug);
  return {
    title: event ? `${event.title} — Salons professionnels | MajestiOS` : "Salon professionnel | MajestiOS",
    description: event?.summary ?? "Fiche d’un salon professionnel publié et vérifié par MajestiOS."
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" }).format(new Date(value));
}

export default async function SalonEventPage({ params }: Props) {
  const { slug } = await params;
  const event = getSalonEvent(slug);
  if (!event) notFound();

  return <main className="public-page salon-event-page">
    <PublicHeader />
    <nav aria-label="Fil d’Ariane" className="salon-event-breadcrumb">
      <Link href="/">Accueil</Link><span aria-hidden="true">/</span>
      <Link href="/opportunites">Opportunités</Link><span aria-hidden="true">/</span>
      <Link href="/opportunites/salons">Salons professionnels</Link><span aria-hidden="true">/</span>
      <span>{event.title}</span>
    </nav>
    <article className="salon-event-card">
      <span className="eyebrow">MAJESTIOS · SALON PROFESSIONNEL</span>
      <h1>{event.title}</h1>
      <p className="salon-event-summary">{event.summary}</p>
      <dl className="salon-event-details">
        <div><dt>Date</dt><dd>{formatDate(event.startDate)}{event.endDate ? ` — ${formatDate(event.endDate)}` : ""}</dd></div>
        <div><dt>Lieu</dt><dd>{event.venue}, {event.city}</dd></div>
        <div><dt>Région</dt><dd>{event.region}</dd></div>
        <div><dt>Secteurs concernés</dt><dd>{event.sectors.join(" · ")}</dd></div>
      </dl>
      <p className="salon-event-verification">Informations vérifiées le {formatDate(event.verifiedAt)}. Les dates et conditions pouvant évoluer, consultez la source de l’organisateur avant de vous déplacer.</p>
      <div className="hero-actions">
        {event.registrationUrl && <a className="button-primary" href={event.registrationUrl} target="_blank" rel="noreferrer">Accéder à l’inscription <span aria-hidden="true">↗</span></a>}
        <a className={event.registrationUrl ? "button-secondary" : "button-primary"} href={event.officialUrl} target="_blank" rel="noreferrer">Consulter le site officiel <span aria-hidden="true">↗</span></a>
        <Link className="button-secondary" href="/opportunites/salons/calendrier">Retour au calendrier</Link>
      </div>
    </article>
  </main>;
}
