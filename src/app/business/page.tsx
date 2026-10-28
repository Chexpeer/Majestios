"use client";

import PublicHeader from "@/components/public-header";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type BodaccItem = { id: string; company: string; kind: string; summary: string; date: string; siren: string; location: string; source: string; sourceUrl: string; isDemo: false };

export default function BusinessPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [items, setItems] = useState<BodaccItem[]>([]);
  const [searched, setSearched] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const incomingQuery = new URLSearchParams(window.location.search).get("q");
    if (incomingQuery) setQuery(incomingQuery.slice(0, 120));
  }, []);

  async function searchBodacc(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim().length < 2) { setSearchError("Saisissez au moins deux caractères."); return; }
    setSearching(true); setSearchError(""); setSearched(true); setItems([]);
    try {
      const response = await fetch(`/api/bodacc?q=${encodeURIComponent(query.trim())}`, { cache: "no-store" });
      const payload = await response.json() as { items?: BodaccItem[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "La recherche BODACC a échoué.");
      setItems(payload.items ?? []);
      if (!(payload.items ?? []).length) setSearchError("Aucun résultat renvoyé pour cette recherche. Essayez un nom d’entreprise, une ville ou une activité.");
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "La recherche BODACC est momentanément indisponible.");
    } finally { setSearching(false); }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("https://formspree.io/f/xykkyadq", { method: "POST", body: new FormData(event.currentTarget), headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("L’envoi a échoué. Vérifiez les champs et réessayez.");
      window.location.assign("/merci");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d’envoyer le formulaire."); setLoading(false);
    }
  }

  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div><span className="section-label">ESPACE BUSINESS · BODACC</span><h1>Comprendre les mouvements du <em>marché.</em></h1><p>Le BODACC devient une source centrale du pôle Business : annonces de cession et de vente, créations, modifications et procédures collectives, consultées depuis la source officielle pour éclairer les projets de reprise et les démarches commerciales.</p></div></section>
    <section className="business-form-wrap">
      <div className="business-form-intro"><span className="section-label">RADAR BUSINESS</span><h2>Rechercher dans les annonces BODACC</h2><p>Recherchez un nom d’entreprise, une ville, un secteur ou un mot-clé pour repérer des signaux utiles à l’achat, la cession, la reprise et la qualification commerciale.</p><ul><li>Ventes et cessions d’entreprises ou de fonds</li><li>Créations, immatriculations et modifications</li><li>Procédures collectives et autres signaux à interpréter avec prudence</li><li>Accès à la source officielle pour vérifier chaque avis</li></ul><p><strong>Important :</strong> une annonce légale est un signal, pas une recommandation d’achat ni une preuve de solvabilité.</p></div>
      <div className="business-form">
        <form onSubmit={searchBodacc} className="bodacc-search-form">
          <label htmlFor="bodacc-query">Nom, activité, ville ou mot-clé</label>
          <div className="bodacc-search-row"><input id="bodacc-query" value={query} onChange={e=>setQuery(e.target.value)} maxLength={120} minLength={2} required placeholder="Ex. : boulangerie, cession, Mulhouse…" /><button className="search-submit" type="submit" disabled={searching}>{searching ? "Recherche…" : "Rechercher au BODACC ↗"}</button></div>
        </form>
        {searchError && <p role={searched ? "status" : "alert"}>{searchError}</p>}
        {items.length > 0 && <section aria-live="polite" className="bodacc-results"><h3>{items.length} résultat(s) retourné(s)</h3>{items.map(item=><article className="bodacc-result" key={item.id}><span className="section-label">{item.kind}</span><h4>{item.company}</h4><p>{item.summary}</p><small>{item.date}{item.location ? ` · ${item.location}` : ""}{item.siren ? ` · SIREN ${item.siren}` : ""}</small><div className="result-actions"><Link className="result-action" href={`/espace-professionnel?intention=opportunite&source=bodacc&opportunite=${encodeURIComponent(item.id)}&titre=${encodeURIComponent(item.company)}`}>Me positionner / créer mon espace ↗</Link><a className="result-action" href={item.sourceUrl} target="_blank" rel="noreferrer">Vérifier l’avis officiel ↗</a></div></article>)}</section>}
        <small>Source : BODACC / DILA, API publique gratuite. Les données peuvent contenir des informations personnelles ; leur usage doit rester proportionné et conforme au cadre applicable.</small>
      </div>
    </section>
    <section className="business-form-wrap">
      <div className="business-form-intro"><span className="section-label">ANALYSE ACCOMPAGNÉE</span><h2>Préparer votre projet Business</h2><p>La recherche BODACC sert de point de départ. Pour préparer un cadrage commercial, décrivez votre entreprise et votre objectif ; l’analyse ne doit pas remplacer une vérification juridique, comptable ou financière.</p></div>
      <form className="business-form" onSubmit={handleSubmit}>
        <label>Nom de l’entreprise<input required name="company" minLength={2} maxLength={150} placeholder="Nom de l’entreprise"/></label>
        <label>Activité principale<input required name="activity" maxLength={200} placeholder="Ex. : maintenance industrielle"/></label>
        <label>Site web (facultatif)<input name="website" type="url" maxLength={300} placeholder="https://…"/></label>
        <label>Zone géographique<select name="region" defaultValue="" required><option value="" disabled>Choisir une zone</option><option value="Locale / départementale">Locale / départementale</option><option value="Régionale">Régionale</option><option value="Nationale">Nationale</option><option value="Internationale">Internationale</option></select></label>
        <label>Votre priorité<select name="goal" defaultValue="clients"><option value="clients">Trouver de nouveaux clients</option><option value="markets">Développer un marché</option><option value="partners">Trouver des partenaires</option><option value="tenders">Répondre à des appels d’offres</option><option value="reputation">Améliorer l’e-réputation</option><option value="buy">Reprendre une entreprise</option><option value="sell">Céder une entreprise</option></select></label>
        <label>Contexte complémentaire<textarea name="context" rows={4} maxLength={1500} placeholder="Votre cible, vos enjeux ou les questions à explorer…"/></label>
        <input type="hidden" name="_subject" value="Nouvelle demande — Espace Business MajestiOS"/>
        {error && <p role="alert">{error}</p>}
        <button className="search-submit" type="submit" disabled={loading}>{loading ? "Envoi en cours…" : "Envoyer ma demande ↗"}</button>
        <small>Les informations saisies sont transmises à Formspree. N’envoyez pas de données confidentielles ou sensibles.</small>
      </form>
    </section>
    <section className="concept-principles"><h2>De l’annonce à l’intelligence commerciale</h2><p>MajestiOS doit relier le signal BODACC à l’entreprise concernée, ses interlocuteurs, son contexte sectoriel et les prochaines actions possibles. Cette qualification assistée devra conserver la source, la date, les limites et une validation humaine.</p><Link className="search-submit concept-cta" href="/opportunites/radar-entreprises">Ouvrir le Radar entreprises ↗</Link><Link className="search-submit concept-cta" href="/faq">Consulter la FAQ ↗</Link></section>
  </main>;
}
