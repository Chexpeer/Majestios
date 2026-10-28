"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PublicHeader from "@/components/public-header";

const examples = [
  { title: "Business Developer B2B", type: "Collaboration envisagée", area: "Développement commercial", note: "Modalités à définir avant ouverture" },
  { title: "Assistance indépendante — veille", type: "Mission envisagée", area: "Suivi des appels d’offres", note: "Modalités à définir avant ouverture" },
  { title: "Partenaires commerciaux", type: "Partenariat", area: "Développement de réseau", note: "Appel à partenaires en préparation" },
  { title: "Contributeurs spécialisés", type: "Collaboration", area: "Expertise professionnelle", note: "Périmètre à préciser" },
];

export default function EmploymentPage() {
  const [query, setQuery] = useState("");
  useEffect(() => {
    const incomingQuery = new URLSearchParams(window.location.search).get("q");
    if (incomingQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery(incomingQuery.slice(0, 120));
    }
  }, []);
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero employment-hero">
      <div><span className="section-label">EMPLOI · MISSIONS · COLLABORATIONS</span><h1>Les bonnes rencontres professionnelles commencent par <em>la bonne opportunité.</em></h1><p>Cette rubrique a vocation à rapprocher les besoins des entreprises et les compétences disponibles : missions, emploi, partenariats et collaborations indépendantes.</p></div>
    </section>
    <section className="concept-principles employment-search-entry">
      <h2>Rechercher un emploi, une mission ou une collaboration</h2>
      <form className="tender-search" onSubmit={(event) => event.preventDefault()}>
        <label className="search-field" htmlFor="employment-query"><span>Métier ou compétence</span><input id="employment-query" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={120} placeholder="Ex. : comptable, assistante administrative, business developer…" /></label>
        <button className="search-submit" type="button" disabled>Recherche externe en préparation</button>
      </form>
      <p role="status">Les connecteurs d’offres externes ne sont pas encore activés. Cette recherche prépare votre critère, mais ne prétend pas fournir des offres en direct.</p>
      <Link className="search-submit concept-cta" href="/espace-professionnel?intention=cv">Créer mon espace personnel / déposer mon CV ↗</Link>
    </section>
    <section className="employment-ticker-section">
      <div className="employment-ticker-heading"><div><span className="section-label">LE FIL DES OPPORTUNITÉS</span><h2>Les missions et collaborations</h2><p>Défilement de gauche à droite : un aperçu des formats que la rubrique accueillera.</p></div><span className="prelaunch-badge">RUBRIQUE EN PRÉPARATION</span></div>
      <div className="employment-ticker-window"><div className="employment-ticker-track">{[...examples,...examples].map((item,index)=><article className="employment-ticker-card" key={item.title+index}><span className="employment-card-type">{item.type}</span><h3>{item.title}</h3><p>{item.area}</p><small>{item.note}</small></article>)}</div></div>
      <p className="ticker-disclaimer">Les cartes ci-dessus illustrent les catégories envisagées ; elles ne constituent pas des offres d’emploi ouvertes. Les annonces réelles seront publiées après validation de leur statut, de leurs conditions et de leur mode de candidature.</p>
    </section>
    <section className="employment-principles">
      <article><span>01</span><h2>Des annonces clairement qualifiées</h2><p>Chaque publication devra préciser sa nature : emploi salarié, mission indépendante, partenariat ou autre forme de collaboration.</p></article>
      <article><span>02</span><h2>Des informations vérifiables</h2><p>Le secteur, le périmètre, la localisation, les conditions et l’identité de l’émetteur devront être contrôlés avant publication.</p></article>
      <article><span>03</span><h2>Un parcours transparent</h2><p>Les modalités de candidature et de contact seront affichées explicitement. Aucun formulaire de candidature n’est activé à ce stade.</p></article>
    </section>
    <section className="concept-principles"><h2>Vous souhaitez proposer une mission ou rejoindre le réseau ?</h2><p>La rubrique Nous rejoindre présente les besoins de collaboration identifiés pour le développement de MajestiOS. Les candidatures ne sont pas encore ouvertes.</p><Link className="search-submit concept-cta" href="/espace-professionnel?intention=collaboration">Créer mon espace personnel ↗</Link><Link className="search-submit concept-cta" href="/nous-rejoindre">Voir les collaborations envisagées ↗</Link><Link className="search-submit concept-cta" href="/faq">Consulter la FAQ ↗</Link></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav aria-label="Liens de pied de page"><Link href="/appels-offres-publics">Marchés publics</Link><Link href="/appels-offres-prives">Opportunités privées</Link><Link href="/faq">FAQ</Link></nav><small>© MajestiOS · Site en construction</small></footer>
  </main>;
}
