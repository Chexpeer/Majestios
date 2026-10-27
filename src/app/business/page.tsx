import Link from "next/link";

export default function BusinessPage() {
  return <main className="public-site concept-page">
    <header className="public-header"><Link className="public-brand" href="/"><span className="public-brand-mark">M</span><span><strong>MajestiOS</strong><small>BUSINESS</small></span></Link><nav className="public-nav"><Link href="/">Accueil</Link><Link href="/developpement-commercial">Développement commercial</Link><Link href="/partenaires">Partenaires</Link></nav></header>
    <section className="how-section concept-hero"><div><span className="section-label">ESPACE BUSINESS</span><h1>Évaluer mon <em>entreprise.</em></h1><p>Préparez un premier cadrage de votre besoin commercial. L’évaluation complète devra s’appuyer sur des sources vérifiables, des critères explicites et une validation humaine.</p></div></section>
    <section className="business-form-wrap"><div className="business-form-intro"><h2>Votre entreprise et vos objectifs</h2><p>Votre demande sera transmise à l’équipe MajestiOS via Formspree.</p><ul><li>Comprendre le positionnement et le secteur</li><li>Identifier les marchés et opportunités à explorer</li><li>Faire ressortir les informations manquantes</li><li>Préparer des prochaines actions commerciales</li></ul></div>
      <form className="business-form" action="https://formspree.io/f/xykkyadq" method="POST">
        <label>Nom de l’entreprise<input required name="company" minLength={2} maxLength={150} placeholder="Nom de l’entreprise"/></label>
        <label>Activité principale<input required name="activity" maxLength={200} placeholder="Ex. : maintenance industrielle"/></label>
        <label>Site web (facultatif)<input name="website" type="url" maxLength={300} placeholder="https://…"/></label>
        <label>Zone géographique<select name="region" defaultValue="" required><option value="" disabled>Choisir une zone</option><option value="Locale / départementale">Locale / départementale</option><option value="Régionale">Régionale</option><option value="Nationale">Nationale</option><option value="Internationale">Internationale</option></select></label>
        <label>Votre priorité<select name="goal" defaultValue="clients"><option value="clients">Trouver de nouveaux clients</option><option value="markets">Développer un marché</option><option value="partners">Trouver des partenaires</option><option value="tenders">Répondre à des appels d’offres</option><option value="reputation">Améliorer l’e-réputation</option></select></label>
        <label>Contexte complémentaire<textarea name="context" rows={4} maxLength={1500} placeholder="Votre cible, vos enjeux ou les questions à explorer…"/></label>
        <input type="hidden" name="_subject" value="Nouvelle demande — Évaluer mon entreprise (MajestiOS)"/>
        <input type="hidden" name="_next" value="https://formspree.io/thanks"/>
        <button className="search-submit" type="submit">Envoyer ma demande ↗</button>
        <small>Les informations saisies sont transmises à Formspree pour recevoir votre demande. N’envoyez pas de données confidentielles ou sensibles.</small>
      </form>
    </section>
  </main>;
}
