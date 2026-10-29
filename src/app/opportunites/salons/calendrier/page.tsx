import Link from "next/link";
import PublicHeader from "@/components/public-header";
import { salonEvents } from "@/data/salon-events";

export const metadata = {
  title: "Calendrier des salons professionnels — MajestiOS",
  description: "Consulter les salons professionnels à venir, leurs dates, leurs lieux et les informations officielles des organisateurs."
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(value));
}

export default function Page() {
  const events = [...salonEvents].sort((a, b) => a.startDate.localeCompare(b.startDate));
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero">
      <div>
        <span className="section-label">OPPORTUNITÉS · AGENDA PROFESSIONNEL</span>
        <h1>Calendrier des <em>salons professionnels.</em></h1>
        <p>Repérez les rendez-vous à venir, préparez vos objectifs de prospection et vérifiez les conditions pratiques auprès de chaque organisateur. Les dates ci-dessous ont été contrôlées le 29 octobre 2026 ; elles peuvent évoluer.</p>
      </div>
    </section>
    <section className="concept-principles">
      <div className="results-heading"><div><span className="section-label">AGENDA VÉRIFIÉ</span><h2>Les prochains rendez-vous</h2></div><span className="results-count">{events.length} salons référencés</span></div>
      {events.length === 0 ? <p>Aucun salon vérifié n’est actuellement publié. Cette liste sera alimentée à mesure que les dates officielles seront confirmées.</p> :
        <div className="results-list">{events.map((event) => <article className="result-card" key={event.slug}>
          <div className="result-main">
            <span className="result-category">SALON PROFESSIONNEL · {event.city.toLocaleUpperCase("fr")}</span>
            <h3>{event.title}</h3>
            <p><strong>{formatDate(event.startDate)}{event.endDate && event.endDate !== event.startDate ? ` — ${formatDate(event.endDate)}` : ""}</strong></p>
            <p>{event.venue}, {event.city}</p>
            <p>{event.summary}</p>
            <small>Informations vérifiées le {formatDate(event.verifiedAt)}. Confirmez les détails auprès de l’organisateur avant de vous déplacer.</small>
          </div>
          <div className="result-actions">
            <Link className="result-action" href={`/opportunites/salons/${event.slug}`}>Fiche du salon</Link>
            <a className="result-action" href={event.officialUrl} target="_blank" rel="noreferrer">Site officiel ↗</a>
          </div>
        </article>)}</div>}
    </section>
    <section className="concept-principles">
      <h2>Préparer une visite utile</h2>
      <p>Avant le salon, définissez les types de clients ou partenaires à rencontrer, les services que vous pouvez proposer et les questions qui permettront de qualifier les besoins. Après la visite, consignez les échanges et les prochaines actions commerciales.</p>
      <Link href="/opportunites/salons" className="result-action">Retour aux salons professionnels</Link>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/faq">FAQ</Link><small>Les informations de l’organisateur font foi.</small></footer>
  </main>;
}
