import Link from "next/link";
import PublicHeader from "@/components/public-header";
import { salonEvents } from "@/data/salon-events";

export const metadata = {
  title: "Salons professionnels par secteur — MajestiOS",
  description: "Explorer les salons par secteur professionnel et préparer une veille ciblée."
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(value));
}

export default function Page() {
  const sectors = [...new Set(salonEvents.flatMap((event) => event.sectors))].sort((a, b) => a.localeCompare(b, "fr"));
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">OPPORTUNITÉS · FILTRE MÉTIER</span>
      <h1>Les salons professionnels <em>par secteur.</em></h1>
      <p>Explorez les rendez-vous en fonction des activités, des clients et des marchés que vous souhaitez développer. Les secteurs indiquent des thèmes pertinents pour préparer une visite ; ils ne constituent pas une garantie de présence d’un exposant ou d’un acheteur précis.</p>
    </div></section>
    <section className="concept-principles">
      <span className="section-label">SECTEURS IDENTIFIÉS</span><h2>Choisir un domaine</h2>
      <div className="results-list">{sectors.map((sector) => {
        const events = salonEvents.filter((event) => event.sectors.includes(sector)).sort((a, b) => a.startDate.localeCompare(b.startDate));
        return <article className="result-card" key={sector}>
          <div className="result-main"><span className="result-category">{events.length} salon(s) correspondant(s)</span><h3>{sector}</h3>
            {events.map((event) => <p key={event.slug}><Link href={`/opportunites/salons/${event.slug}`}>{event.title}</Link> — {formatDate(event.startDate)} · {event.city}</p>)}
          </div>
        </article>;
      })}</div>
      <p><Link href="/opportunites/salons/calendrier">Consulter le calendrier complet →</Link></p>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/opportunites/salons">Salons professionnels</Link><Link href="/faq">FAQ</Link></footer>
  </main>;
}
