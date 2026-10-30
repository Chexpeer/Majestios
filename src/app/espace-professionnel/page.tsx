import Link from "next/link";
import CompanyIntakeForm from "@/components/company-intake-form";

export const metadata = {
  title: "Présenter mon entreprise et mes besoins — MajestiOS",
  description: "Décrivez votre activité et vos objectifs pour préparer une qualification commerciale adaptée à votre entreprise."
};

export default function EspaceProfessionnelPage() {
  return <main className="public-site concept-page domain-business">
    <nav className="breadcrumbs" aria-label="Fil d’Ariane">
      <Link href="/">Accueil</Link><span><b>/</b><Link href="/opportunites">Opportunités</Link></span><span><b>/</b><strong>Présenter mon entreprise</strong></span>
    </nav>
    <section className="how-section concept-hero"><div>
      <span className="section-label">ESPACE PROFESSIONNEL · PREMIER CONTACT</span>
      <h1>Présentez votre entreprise. <em>Précisez ce que vous recherchez.</em></h1>
      <p>Vous n’avez pas besoin de parcourir toutes les annonces vous-même. Décrivez votre activité, votre territoire et vos besoins : ce sont les informations de départ pour qualifier les opportunités qui peuvent vous correspondre.</p>
      <p>Marchés publics, consultations privées, recrutement, sous-traitance ou développement commercial : vous choisissez vos objectifs, sans être enfermé dans un parcours unique.</p>
    </div></section>
    <section className="concept-principles">
      <span className="section-label">VOTRE ENTREPRISE · VOS OBJECTIFS</span><h2>Préparer votre dossier de présentation</h2>
      <p>Les champs marqués d’un astérisque sont nécessaires pour préparer le récapitulatif.</p>
      <CompanyIntakeForm />
    </section>
    <section className="concept-principles">
      <h2>Que se passe-t-il ensuite ?</h2>
      <ol className="bodacc-steps">
        <li><span>01</span><div><h3>Présenter</h3><p>Décrire votre activité, votre zone d’intervention et le besoin prioritaire.</p></div></li>
        <li><span>02</span><div><h3>Qualifier</h3><p>Les informations nécessaires à une qualification doivent être examinées avant toute proposition commerciale.</p></div></li>
        <li><span>03</span><div><h3>Identifier</h3><p>Les opportunités et interlocuteurs pertinents doivent être vérifiés avant d’être présentés comme exploitables.</p></div></li>
      </ol>
      <p><strong>Transparence :</strong> pour le moment, cette page prépare un récapitulatif local ; elle ne transmet pas votre dossier à MajestiOS. L’envoi et le suivi sécurisé seront activés après configuration du canal de réception.</p>
      <div className="route-actions"><Link className="search-submit concept-cta" href="/opportunites">Explorer les opportunités ↗</Link><Link className="search-submit concept-cta" href="/faq">Consulter la FAQ ↗</Link></div>
    </section>
  </main>;
}
