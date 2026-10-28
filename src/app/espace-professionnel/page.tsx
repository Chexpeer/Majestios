"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PublicHeader from "@/components/public-header";

export default function Page() {
  const [intention, setIntention] = useState("");
  const [opportunityTitle, setOpportunityTitle] = useState("");
  const [opportunitySource, setOpportunitySource] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIntention(params.get("intention") || "");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpportunityTitle((params.get("titre") || "").slice(0, 180));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpportunitySource(params.get("source") || "");
  }, []);

  const intentMessage = intention === "cv"
    ? "Vous souhaitez déposer un CV. Le dépôt sécurisé et l’analyse automatique ne sont pas encore activés ; aucun document n’a été transmis."
    : intention === "collaboration"
      ? "Vous souhaitez étudier une collaboration avec MajestiOS. Le parcours de candidature n’est pas encore activé."
      : intention === "opportunite"
        ? "Vous souhaitez vous positionner sur une opportunité. La création de compte et l’enregistrement sécurisé de cette démarche ne sont pas encore activés. Votre sélection est conservée dans cette adresse pour cette visite, mais elle n’a pas été enregistrée dans un compte."
        : "";

  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero">
      <div><span className="section-label">ESPACE PROFESSIONNEL</span><h1>Votre activité commerciale, <em>au même endroit.</em></h1><p>L’espace connecté de MajestiOS est en préparation. Les comptes, les alertes et le suivi des opportunités ne sont pas encore activés sur ce prototype.</p></div>
    </section>
    {intentMessage && <section className="concept-principles" role="status">
      <h2>Votre démarche</h2>
      {opportunityTitle && <p><strong>Élément sélectionné :</strong> {opportunityTitle}</p>}
      {opportunitySource && <p><strong>Source :</strong> {opportunitySource.toUpperCase()}</p>}
      <p>{intentMessage}</p>
      {intention === "cv" || intention === "collaboration" ? <Link href="/offres-emploi">Retour à Emploi & missions ↗</Link> : <Link href={opportunitySource === "bodacc" ? "/business" : "/appels-offres-publics"}>Retour à la recherche ↗</Link>}
    </section>}
    <section className="concept-grid">
      <article><h2>Veille personnalisée</h2><p>À terme : choisir les mots-clés, les régions et les catégories à suivre.</p></article>
      <article><h2>Suivi des opportunités</h2><p>À terme : retrouver les dossiers suivis, les dates importantes et les actions à mener.</p></article>
      <article><h2>Intelligence commerciale</h2><p>À terme : organiser les informations sur les entreprises et préparer les prochaines actions.</p></article>
    </section>
    <section className="concept-principles">
      <h2>Découvrir le prototype</h2><p>En attendant l’ouverture de l’espace connecté, vous pouvez essayer la recherche publique et consulter les pages de présentation.</p>
      <Link className="search-submit concept-cta" href="/appels-offres-publics">Consulter les appels d’offres ↗</Link>
      <Link className="search-submit concept-cta" href="/offres-emploi?intention=cv">Déposer mon CV — parcours en préparation ↗</Link>
      <Link className="search-submit concept-cta" href="/faq#compte">Questions sur le compte et la confidentialité ↗</Link>
      <p><Link href="/developpement-commercial">Découvrir les services commerciaux ↗</Link></p>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav><Link href="/faq">Questions fréquentes</Link><Link href="/mentions-legales">Mentions légales</Link></nav><small>Connexion non disponible à ce stade</small></footer>
  </main>;
}
