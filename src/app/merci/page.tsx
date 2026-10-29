"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PublicHeader from "@/components/public-header";

export default function MerciPage() {
  const [isPreparation, setIsPreparation] = useState(false);
  useEffect(() => {
    setIsPreparation(new URLSearchParams(window.location.search).get("mode") === "preparation");
    const timer = window.setTimeout(() => { window.location.href = "/"; }, 7000);
    return () => window.clearTimeout(timer);
  }, []);
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero">
      <div>
        <span className="section-label">PARCOURS TERMINÉ</span>
        <h1>Merci pour votre <em>intérêt.</em></h1>
        <p>{isPreparation ? "Votre parcours a été préparé. Cette version de MajestiOS ne transmet ni n’enregistre encore les informations saisies : aucune demande réelle n’a été envoyée à l’équipe." : "Merci de votre visite. Les formulaires connectés seront activés lorsque le traitement sécurisé des demandes sera disponible."}</p>
        <p>Vous allez être redirigé vers l’accueil dans quelques secondes.</p>
        <Link className="search-submit concept-cta" href="/">Retour immédiat à l’accueil ↗</Link>
        <p><Link href="/opportunites">Explorer les rubriques MajestiOS</Link></p>
      </div>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav><Link href="/comprendre/faq">FAQ</Link><Link href="/mentions-legales">Mentions légales</Link></nav><small>© MajestiOS · Site en construction</small></footer>
  </main>;
}
