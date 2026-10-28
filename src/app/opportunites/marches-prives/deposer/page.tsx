import Link from "next/link";
import PublicHeader from "@/components/public-header";
import AnnouncementTicker from "@/components/announcement-ticker";

export const metadata = {
  title: "Déposer une opportunité privée — MajestiOS",
  description: "Préparer la soumission d’une opportunité privée à validation avant publication sur MajestiOS.",
};

export default function Page() {
  return <main className="public-site concept-page">
    <PublicHeader />
    <AnnouncementTicker flow="private" />
    <section className="how-section concept-hero"><div>
      <span className="section-label">MARCHÉS PRIVÉS · CONTRIBUTION</span>
      <h1>Proposer une opportunité <em>privée.</em></h1>
      <p>MajestiOS prévoit un parcours de soumission pour les entreprises et donneurs d’ordre qui souhaitent faire connaître un besoin professionnel. Chaque annonce devra être vérifiée et autorisée avant toute diffusion.</p>
    </div></section>
    <section className="concept-principles">
      <h2>Préparer votre soumission</h2>
      <p>Le formulaire de dépôt et le contrôle de l’identité de l’annonceur ne sont pas encore activés. Pour le moment, cette page permet de comprendre les éléments à préparer ; elle ne transmet ni ne publie aucune annonce.</p>
      <ul>
        <li>Nom de l’entreprise et coordonnées professionnelles de l’interlocuteur habilité.</li>
        <li>Description claire du besoin, secteur concerné, localisation et calendrier souhaité.</li>
        <li>Confirmation que l’annonceur est autorisé à diffuser les informations communiquées.</li>
        <li>Exclusion des données personnelles non nécessaires et des informations confidentielles.</li>
      </ul>
      <h3>Étapes prévues</h3>
      <ol>
        <li>Soumission des informations et des coordonnées professionnelles.</li>
        <li>Vérification de l’annonceur, de la source et de l’autorisation de diffusion.</li>
        <li>Modération avant publication, puis affichage clair de la date et des modalités de contact.</li>
      </ol>
      <p className="ticker-disclaimer">Aucune annonce n’est créée ou enregistrée depuis cette page à ce stade.</p>
      <p><Link className="search-submit concept-cta" href="/opportunites/marches-prives">← Retour aux opportunités privées</Link></p>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/comprendre/faq">FAQ</Link><Link href="/mentions-legales">Mentions légales</Link></footer>
  </main>;
}
