import Link from "next/link";
import PublicHeader from "@/components/public-header";
import { salonEvents } from "@/data/salon-events";

export const metadata = {
  title: "Salons professionnels par région — MajestiOS",
  description: "Repérer les salons professionnels par région pour préparer ses déplacements et sa prospection."
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(value));
}

export default function Page() {
  const regions = [...new Set(salonEvents.map((event) => event.region))].sort((a, b) => a.localeCompare(b, "fr"));
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">OPPORTUNITÉS · FILTRE TERRITORIAL</span>
      <h1>Les salons professionnels <em>par région.</em></h1>
      <p>Préparez vos déplacements et identifiez les rendez-vous proches de vos marchés. Le classement territorial repose sur le lieu annoncé par l’organisateur ; vérifiez l’adresse et les dates sur la fiche de chaque événement.</p>
    </div></section>
    <section className="concept-principles">
      <span className="section-label">RÉGIONS RÉFÉRENCÉES</span><h2>Choisir un territoire</h2>
      <div className="results-list">{regions.map((region) => {
        const events = salonEvents.filter((event) => event.region === region).sort((a, b) => a.startDate.localeCompare(b.startDate));
        return <article className="result-card" key={region}>
          <div className="result-main"><span className="result-category">{events.length} salon(s) référencé(s)</span><h3>{region}</h3>
            {events.map((event) => <p key={event.slug}><Link href={`/opportunites/salons/${event.slug}`}>{event.title}</Link> — {formatDate(event.startDate)} · {event.city}</p>)}
          </div>
        </article>;
      })}</div>
      <p><Link href="/opportunites/salons/calendrier">Consulter le calendrier complet →</Link></p>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/opportunites/salons">Salons professionnels</Link><Link href="/faq">FAQ</Link></footer>
  </main>;
}
