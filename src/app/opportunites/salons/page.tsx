import Link from "next/link";
import PublicHeader from "@/components/public-header";
import { salonEvents } from "@/data/salon-events";

export const metadata = {
  title: "Salons professionnels — MajestiOS",
  description: "Repérer les salons professionnels, préparer ses rencontres et transformer une visite en opportunités commerciales."
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(value));
}

export default function Page() {
  const todayParts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Europe/Paris" }).formatToParts(new Date());
  const today = `${todayParts.find((part) => part.type === "year")?.value}-${todayParts.find((part) => part.type === "month")?.value}-${todayParts.find((part) => part.type === "day")?.value}`;
  const nextEvents = [...salonEvents].filter((event) => event.endDate ? event.endDate >= today : event.startDate >= today).sort((a, b) => a.startDate.localeCompare(b.startDate)).slice(0, 3);
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero">
      <div>
        <span className="section-label">OPPORTUNITÉS · RENCONTRES PROFESSIONNELLES</span>
        <h1>Un salon n’est pas seulement un événement. C’est un <em>terrain de prospection.</em></h1>
        <p>MajestiOS vous aide à repérer les rendez-vous professionnels pertinents, à préparer les rencontres et à relier les contacts aux objectifs de développement commercial. Les salons sont intégrés au flux d’annonces de l’accueil, sans pop-up intrusif.</p>
        <div className="hero-actions">
          <Link className="button-primary" href="/opportunites/salons/calendrier">Consulter le calendrier <span aria-hidden="true">→</span></Link>
          <Link className="button-secondary" href="/opportunites/salons/region">Explorer par région</Link>
          <Link className="button-secondary" href="/opportunites/salons/secteur">Explorer par secteur</Link>
          <Link className="button-secondary" href="/developpement-commercial">Découvrir le développement commercial</Link>
        </div>
      </div>
    </section>
    <section className="concept-principles">
      <div className="results-heading"><div><span className="section-label">PROCHAINS RENDEZ-VOUS</span><h2>À surveiller</h2></div><span className="results-count">{salonEvents.length} salons référencés</span></div>
      {nextEvents.length === 0 ? <p>Aucun événement à venir n’est actuellement référencé. Consultez à nouveau le calendrier lorsque de nouvelles dates officielles auront été confirmées.</p> :
        <div className="results-list">{nextEvents.map((event) => <article className="result-card" key={event.slug}>
          <div className="result-main">
            <span className="result-category">{event.city.toLocaleUpperCase("fr")} · SALON PROFESSIONNEL</span>
            <h3>{event.title}</h3>
            <p><strong>{formatDate(event.startDate)}{event.endDate && event.endDate !== event.startDate ? ` — ${formatDate(event.endDate)}` : ""}</strong></p>
            <p>{event.summary}</p>
          </div>
          <div className="result-actions"><Link className="result-action" href={`/opportunites/salons/${event.slug}`}>Voir la fiche</Link></div>
        </article>)}</div>}
      <p><Link href="/opportunites/salons/calendrier">Voir tous les salons référencés et leurs informations pratiques →</Link></p>
    </section>
    <section className="concept-grid">
      <article><span>01 · AVANT</span><h2>Préparer la visite</h2><p>Définir les secteurs à cibler, les types d’interlocuteurs à rencontrer et les questions qui permettront de qualifier un besoin réel.</p></article>
      <article><span>02 · PENDANT</span><h2>Qualifier les rencontres</h2><p>Repérer les projets, les besoins exprimés et les suites convenues. Un échange ne devient une opportunité que si son contexte est compris.</p></article>
      <article><span>03 · APRÈS</span><h2>Transformer en action</h2><p>Organiser les relances, documenter les prochaines étapes et relier les contacts aux services ou marchés pertinents. Les fonctionnalités de suivi avancé seront signalées comme disponibles lorsqu’elles seront opérationnelles.</p></article>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/opportunites">Toutes les opportunités</Link><Link href="/faq">FAQ</Link><small>Les dates et modalités sont à confirmer auprès de l’organisateur.</small></footer>
  </main>;
}
