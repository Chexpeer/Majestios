import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Préparer le dépôt de CV — MajestiOS",
  description: "Comprendre le parcours de dépôt de CV prévu et préparer les informations utiles sans transmettre de données personnelles."
};

export default function DeposerCVPage() {
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">EMPLOI · CANDIDATURE</span>
      <h1>Préparer votre profil professionnel <em>avant de partager votre CV.</em></h1>
      <p>Un CV contient des données personnelles. Avant tout dépôt, MajestiOS doit préciser la finalité de leur utilisation, les personnes autorisées à les consulter, la durée de conservation et les modalités de suppression.</p>
      <div className="hero-actions"><Link className="button-primary" href="/opportunites/emploi/offres">Consulter la méthode de lecture des offres <span aria-hidden="true">→</span></Link><Link className="button-secondary" href="/opportunites/emploi/metiers">Explorer les métiers</Link></div>
    </div></section>
    <section className="concept-principles">
      <span className="section-label">AVANT LE DÉPÔT</span><h2>Les informations à préparer</h2>
      <ol className="bodacc-steps">
        <li><span>01</span><div><h3>Votre objectif</h3><p>Précisez le type de poste ou de mission recherché, le territoire et vos disponibilités.</p></div></li>
        <li><span>02</span><div><h3>Vos compétences vérifiables</h3><p>Présentez vos expériences, savoir-faire, qualifications et habilitations pertinentes pour l’objectif visé.</p></div></li>
        <li><span>03</span><div><h3>Vos préférences de contact</h3><p>Ne partagez que les coordonnées nécessaires et vérifiez les destinataires avant tout envoi.</p></div></li>
      </ol>
    </section>
    <section className="concept-principles">
      <h2>État actuel du service</h2>
      <p><strong>Le dépôt sécurisé de CV n’est pas encore activé.</strong> Cette page ne téléverse aucun fichier et ne collecte aucune candidature. N’envoyez pas de CV ni de données sensibles ici.</p>
      <p>Le parcours pourra être ouvert après mise en place du stockage privé, des contrôles d’accès, de l’information sur les données personnelles et d’une procédure de suppression.</p>
      <div className="route-actions"><Link className="search-submit concept-cta" href="/opportunites/emploi">Retour à l’espace emploi ↗</Link><Link className="search-submit concept-cta" href="/confidentialite">Consulter les informations de confidentialité ↗</Link></div>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/opportunites">Opportunités</Link><Link href="/faq">FAQ</Link></footer>
  </main>;
}
