import Link from "next/link";
import SiteHub from "@/components/site-hub";

export const metadata = {
  title: "Publier une offre — MajestiOS",
  description: "Préparer la publication d’une offre d’emploi ou d’une mission professionnelle."
};

export default function PublishEmploymentOfferPage() {
  return (
    <main className="public-site concept-page">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link><span><b>/</b><Link href="/opportunites">Opportunités</Link></span>
        <span><b>/</b><Link href="/opportunites/emploi">Emploi &amp; recrutement</Link></span>
        <span><b>/</b><strong>Publier une offre</strong></span>
      </nav>
      <SiteHub
        pathname="/opportunites/emploi/deposer-une-offre"
        eyebrow="EMPLOI & RECRUTEMENT · PUBLICATION"
        intro="Préparez une annonce destinée à présenter un poste ou une mission. Le formulaire de dépôt et le contrôle des annonces ne sont pas encore activés : aucune offre n’est transmise ni publiée depuis cette page."
        checklist={[
          "Préciser si l’annonce concerne un emploi salarié ou une mission professionnelle.",
          "Préparer l’identité de l’employeur, le lieu, les conditions et les compétences recherchées.",
          "Ne pas inclure de données personnelles de candidats dans une annonce.",
          "La publication ne sera ouverte qu’après activation d’un formulaire sécurisé et d’un processus de vérification."
        ]}
      />
      <section className="concept-principles">
        <h2>Préparer votre démarche</h2>
        <p>En attendant l’ouverture du dépôt, vous pouvez consulter les parcours et leurs critères de qualification.</p>
        <div className="route-actions">
          <Link className="search-submit concept-cta" href="/opportunites/emploi/offres">Consulter les offres ↗</Link>
          <Link className="search-submit concept-cta" href="/opportunites/emploi/missions">Explorer les missions ↗</Link>
          <Link className="search-submit concept-cta" href="/opportunites/emploi">Retour à Emploi &amp; recrutement ↗</Link>
        </div>
      </section>
    </main>
  );
}
