"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Item = { id: string | number; title: string; type: string; location: string; buyer?: string; deadline?: string; publishedAt?: string; sourceUrl?: string; officialStatus?: string; isOpen?: boolean };
type SearchMeta = { total?: number; totalAvailable?: number | null };

export default function PublicTendersPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [meta, setMeta] = useState<SearchMeta>({});
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(e?: React.FormEvent, queryOverride?: string, locationOverride?: string, typeOverride?: string) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const p = new URLSearchParams({ q: queryOverride ?? q, location: locationOverride ?? location, type: typeOverride ?? type });
      const r = await fetch("/api/opportunities?" + p.toString(), { cache: "no-store" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "La source est indisponible.");
      setItems(d.items || []);
      setMeta(d.meta || {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement.");
      setItems([]);
      setMeta({});
    } finally {
      setLoading(false);
    }
  }

  // Le chargement initial reprend les critères envoyés depuis l’accueil ou une fiche catégorie.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incomingQuery = (params.get("q") ?? "").slice(0, 160);
    const incomingLocation = (params.get("location") ?? "").slice(0, 80);
    const incomingType = params.get("type") ?? "all";
    const allowedType = ["all", "Travaux", "Services", "Fournitures"].includes(incomingType) ? incomingType : "all";
    setQ(incomingQuery);
    setLocation(incomingLocation);
    setType(allowedType);
    void search(undefined, incomingQuery, incomingLocation, allowedType);
  }, []);

  return <main className="public-site concept-page domain-opportunites">
    <nav className="breadcrumbs" aria-label="Fil d’Ariane">
      <Link href="/">Accueil</Link><span><b>/</b><Link href="/opportunites">Opportunités</Link></span>
      <span><b>/</b><Link href="/opportunites/marches-publics">Marchés publics</Link></span>
      <span><b>/</b><strong>Appels d’offres</strong></span>
    </nav>
    <section className="how-section concept-hero"><div>
      <span className="section-label">DOSSIER · MARCHÉS PUBLICS</span>
      <h1>Rechercher les <em>appels d’offres.</em></h1>
      <p>Filtrez les avis disponibles selon vos mots-clés, votre territoire et leur catégorie. Ouvrez ensuite la fiche dédiée et vérifiez les conditions sur la source officielle.</p>
      <p><Link href="/opportunites/marches-publics">← Retour au dossier Marchés publics</Link></p>
    </div></section>
    <section className="concept-principles">
      <span className="section-label">SOUS-DOSSIERS</span><h2>Choisir une catégorie</h2>
      <div className="results-list">
        {[
          { label: "Travaux", href: "/opportunites/marches-publics/appels-offres/travaux", text: "Chantiers, lots, assurances et capacités techniques." },
          { label: "Services", href: "/opportunites/marches-publics/appels-offres/services", text: "Prestations, livrables, niveaux de service et critères." },
          { label: "Fournitures", href: "/opportunites/marches-publics/appels-offres/fournitures", text: "Spécifications, quantités, conformité et logistique." }
        ].map((item) => <article className="result-card" key={item.href}><div className="result-main"><h3>{item.label}</h3><p>{item.text}</p></div><div className="result-actions"><Link className="result-action" href={item.href}>Ouvrir le dossier {item.label} →</Link></div></article>)}
      </div>
    </section>
    <section className="concept-principles">
      <h2>Recherche ciblée</h2>
      <form className="tender-search" onSubmit={search}>
        <label className="search-field"><span>Mots-clés</span><input value={q} onChange={e => setQ(e.target.value)} placeholder="Nettoyage, travaux, informatique…" /></label>
        <label className="search-field"><span>Département</span><input value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex. : 68" /></label>
        <label className="search-field"><span>Catégorie</span><select value={type} onChange={e => setType(e.target.value)}><option value="all">Toutes</option><option value="Travaux">Travaux</option><option value="Services">Services</option><option value="Fournitures">Fournitures</option></select></label>
        <button className="search-submit" type="submit">Rechercher</button>
      </form>
    </section>
    <section className="concept-principles">
      <div className="results-heading"><div><span className="section-label">RÉSULTATS</span><h2>Les avis correspondants</h2></div><span className="results-count">{loading ? "Recherche…" : meta.totalAvailable != null && meta.totalAvailable > items.length ? `${items.length} avis affichés sur ${meta.totalAvailable} disponibles` : `${items.length} résultat(s)`}</span></div>
      {error && <p role="alert">{error}</p>}
      {!loading && !error && items.length === 0 && <p>Aucun avis à afficher pour ces critères. Essayez une recherche plus large ou vérifiez la disponibilité de la source.</p>}
      <div className="results-list">{items.map(item => <article className="result-card" key={item.id}>
        <div className="result-main"><span className="result-category">{item.type} · BOAMP / DILA</span><h3>{item.title}</h3><p>{item.buyer || "Acheteur non renseigné"} · {item.location}</p><small>Publication : {item.publishedAt || "non renseignée"} · Échéance : {item.deadline || "à vérifier"}</small><small>Statut : {item.officialStatus || "à vérifier"}</small></div>
        <div className="result-actions">
          <Link className="result-action" href={"/opportunites/marches-publics/" + encodeURIComponent(String(item.id)) + "/repondre?" + new URLSearchParams({ title: item.title, buyer: item.buyer || "", deadline: item.deadline || "" }).toString()}>Préparer une demande ↗</Link>
          <Link className="result-action" href={"/opportunites/marches-publics/" + encodeURIComponent(String(item.id)) + "?" + new URLSearchParams({ q, location, type, title: item.title, buyer: item.buyer || "", deadline: item.deadline || "", category: item.type || "", department: item.location || "", publishedAt: item.publishedAt || "", status: item.officialStatus || "" }).toString()}>Fiche détaillée ↗</Link>
          <a className="result-action" href={item.sourceUrl || "https://www.boamp.fr/"} target="_blank" rel="noreferrer">Source officielle ↗</a>
        </div>
      </article>)}</div>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav><Link href="/opportunites/marches-prives">Opportunités privées</Link><Link href="/nous-rejoindre">Nous rejoindre</Link><Link href="/faq">FAQ</Link><Link href="/mentions-legales">Mentions légales</Link></nav><small>© MajestiOS · Prototype en développement</small></footer>
  </main>;
}
