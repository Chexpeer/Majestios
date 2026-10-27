"use client";
import PublicHeader from "@/components/public-header";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function BusinessPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://formspree.io/f/xykkyadq", {
        method: "POST",
        body: new FormData(event.currentTarget),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("L’envoi a échoué. Vérifiez les champs et réessayez.");
      window.location.assign("/merci");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d’envoyer le formulaire.");
      setLoading(false);
    }
  }

  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div><span className="section-label">ESPACE BUSINESS</span><h1>Évaluer mon <em>entreprise.</em></h1><p>Préparez un premier cadrage de votre besoin commercial. L’évaluation complète devra s’appuyer sur des sources vérifiables, des critères explicites et une validation humaine.</p></div></section>
    <section className="business-form-wrap"><div className="business-form-intro"><h2>Votre entreprise et vos objectifs</h2><p>Votre demande sera transmise à l’équipe MajestiOS via Formspree.</p><ul><li>Comprendre le positionnement et le secteur</li><li>Identifier les marchés et opportunités à explorer</li><li>Faire ressortir les informations manquantes</li><li>Préparer des prochaines actions commerciales</li></ul></div>
      <form className="business-form" onSubmit={handleSubmit}>
        <label>Nom de l’entreprise<input required name="company" minLength={2} maxLength={150} placeholder="Nom de l’entreprise"/></label>
        <label>Activité principale<input required name="activity" maxLength={200} placeholder="Ex. : maintenance industrielle"/></label>
        <label>Site web (facultatif)<input name="website" type="url" maxLength={300} placeholder="https://…"/></label>
        <label>Zone géographique<select name="region" defaultValue="" required><option value="" disabled>Choisir une zone</option><option value="Locale / départementale">Locale / départementale</option><option value="Régionale">Régionale</option><option value="Nationale">Nationale</option><option value="Internationale">Internationale</option></select></label>
        <label>Votre priorité<select name="goal" defaultValue="clients"><option value="clients">Trouver de nouveaux clients</option><option value="markets">Développer un marché</option><option value="partners">Trouver des partenaires</option><option value="tenders">Répondre à des appels d’offres</option><option value="reputation">Améliorer l’e-réputation</option></select></label>
        <label>Contexte complémentaire<textarea name="context" rows={4} maxLength={1500} placeholder="Votre cible, vos enjeux ou les questions à explorer…"/></label>
        <input type="hidden" name="_subject" value="Nouvelle demande — Évaluer mon entreprise (MajestiOS)"/>
        {error && <p role="alert">{error}</p>}
        <button className="search-submit" type="submit" disabled={loading}>{loading ? "Envoi en cours…" : "Envoyer ma demande ↗"}</button>
        <small>Les informations saisies sont transmises à Formspree pour recevoir votre demande. N’envoyez pas de données confidentielles ou sensibles.</small>
      </form>
    </section>
  </main>;
}
