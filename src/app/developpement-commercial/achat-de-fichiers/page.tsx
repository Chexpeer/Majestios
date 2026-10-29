import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Achat de fichiers professionnels — MajestiOS",
  description: "Définir un besoin de contacts professionnels par secteur, territoire et volume, avec des critères de qualité et de conformité."
};

export default function AchatFichiersPage() {
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">DÉVELOPPEMENT COMMERCIAL · FICHIERS PROFESSIONNELS</span>
      <h1>Un fichier de contacts doit répondre à <em>un besoin précis.</em></h1>
      <p>Décrivez votre cible avant de rechercher un fichier : activité, territoire, type d’organisation et volume souhaité. L’objectif est de cadrer une demande pertinente, pas de vendre un volume de contacts sans vérifier sa provenance ni son adéquation.</p>
    </div></section>
    <section className="concept-principles"><span className="section-label">DÉFINIR LE BESOIN</span><h2>Les critères qui permettent de qualifier votre demande.</h2>
      <div className="concept-grid">
        <article><span>01 · ACTIVITÉ</span><h3>Secteur et métiers</h3><p>Précisez les secteurs recherchés, les activités à inclure ou exclure et, si vous le connaissez, le code NAF/APE pertinent.</p></article>
        <article><span>02 · TERRITOIRE</span><h3>Zone géographique</h3><p>Département, région ou périmètre national ; indiquez si une zone prioritaire est nécessaire.</p></article>
        <article><span>03 · VOLUME</span><h3>Nombre de contacts</h3><p>Indiquez le volume souhaité et si vous privilégiez une cible resserrée et qualifiée plutôt qu’une liste plus large.</p></article>
        <article><span>04 · USAGE</span><h3>Objectif commercial</h3><p>Expliquez brièvement l’offre concernée et l’usage envisagé afin d’évaluer la pertinence et les conditions applicables.</p></article>
      </div>
    </section>
    <section className="concept-principles"><span className="section-label">FORMULAIRE DE CONTACT · PREMIÈRE ÉTAPE</span><h2>Préparer votre demande</h2>
      <p>Ce formulaire de cadrage illustre les informations à réunir. <strong>Il n’envoie pas encore de demande</strong> : le traitement de contact doit être raccordé avant sa mise en service.</p>
      <form className="tender-search file-request-form">
        <label className="search-field"><span>Nom et prénom</span><input name="name" autoComplete="name" placeholder="Votre nom" required /></label>
        <label className="search-field"><span>Entreprise</span><input name="company" autoComplete="organization" placeholder="Nom de l’entreprise" /></label>
        <label className="search-field"><span>Email professionnel</span><input name="email" type="email" autoComplete="email" placeholder="vous@entreprise.fr" required /></label>
        <label className="search-field"><span>Téléphone</span><input name="phone" type="tel" autoComplete="tel" placeholder="Votre numéro" /></label>
        <label className="search-field"><span>Secteur d’activité</span><input name="sector" placeholder="Ex. : bâtiment, informatique…" required /></label>
        <label className="search-field"><span>Territoire souhaité</span><input name="territory" placeholder="Ex. : département 68, Grand Est…" required /></label>
        <label className="search-field"><span>Nombre de contacts souhaité</span><select name="quantity" defaultValue=""><option value="" disabled>Choisir un volume</option><option>Moins de 100</option><option>100 à 500</option><option>500 à 1 000</option><option>Plus de 1 000</option><option>À définir ensemble</option></select></label>
        <label className="search-field"><span>Votre objectif</span><input name="objective" placeholder="Décrivez brièvement votre besoin" /></label>
        <button className="search-submit" type="submit" disabled>Demande bientôt disponible</button>
      </form>
      <p>Avant toute fourniture, MajestiOS devra préciser la source, la date de vérification, les champs disponibles, les limites de qualité et les conditions d’utilisation. Aucune disponibilité de fichier ni aucun tarif ne sont garantis à ce stade.</p>
    </section>
    <section className="concept-principles"><h2>Pour aller plus loin</h2><p><Link href="/developpement-commercial/prospection">Découvrir la méthode de prospection →</Link></p><p><Link href="/developpement-commercial">Retour au développement commercial →</Link></p></section>
  </main>;
}
