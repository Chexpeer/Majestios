import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Merci pour votre demande — MajestiOS",
  description: "Confirmation de réception de votre demande par MajestiOS.",
};

export default function MerciPage() {
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero">
      <div>
        <span className="section-label">DEMANDE TRANSMISE</span>
        <h1>Merci pour votre <em>confiance.</em></h1>
        <p>Le service de formulaire a accepté l’envoi de votre demande. La réception et le traitement par l’équipe MajestiOS dépendent de la configuration du service et des coordonnées de destination.</p>
        <p>Cette confirmation ne signifie pas qu’une analyse automatique de votre entreprise a déjà été réalisée.</p>
        <Link className="search-submit concept-cta" href="/">Retour à l’accueil ↗</Link>
        <p><Link href="/business">Envoyer une autre demande</Link></p>
      </div>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav><Link href="/developpement-commercial">Développement commercial</Link><Link href="/mentions-legales">Mentions légales</Link></nav><small>© MajestiOS · Prototype en développement</small></footer>
  </main>;
}
