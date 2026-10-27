"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

type Opportunity = {
  id: number | string;
  type: string;
  location: string;
  source: "public" | "private";
  title: string;
  deadline?: string;
  isDemo?: boolean;
  sourceName?: string;
  sourceUrl?: string;
  buyer?: string;
  publishedAt?: string;
  officialStatus?: string;
  isOpen?: boolean;
};

const privateTeasers: Opportunity[] = [
  { id: 101, type: "Prestations de services", location: "Grand Est", source: "private", title: "Opportunité privée — exemple de présentation" },
  { id: 102, type: "Travaux", location: "Île-de-France", source: "private", title: "Opportunité privée — exemple de présentation" },
  { id: 103, type: "Fournitures professionnelles", location: "Auvergne-Rhône-Alpes", source: "private", title: "Opportunité privée — exemple de présentation" },
  { id: 104, type: "Maintenance", location: "France entière", source: "private", title: "Opportunité privée — exemple de présentation" },
];

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [publicExamples, setPublicExamples] = useState<Opportunity[]>([]);
  const [loadingExamples, setLoadingExamples] = useState(true);
  const [examplesError, setExamplesError] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("all");
  const [selectedPrivate, setSelectedPrivate] = useState<Opportunity | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ q: keyword, location, type });

    async function loadExamples() {
      setLoadingExamples(true);
      setExamplesError("");
      try {
        const response = await fetch(`/api/opportunities?${params.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const payload: { items?: Opportunity[]; error?: string } = await response.json();
        if (!response.ok) throw new Error(payload.error || "La source officielle est indisponible.");
        setPublicExamples(payload.items ?? []);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setExamplesError(error instanceof Error ? error.message : "Erreur de chargement de la source officielle.");
        setPublicExamples([]);
      } finally {
        if (!controller.signal.aborted) setLoadingExamples(false);
      }
    }

    void loadExamples();
    return () => controller.abort();
  }, [keyword, location, type]);

  const filteredExamples = publicExamples;

  function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="public-site">
      <header className="public-header">
        <Link className="public-brand" href="/" aria-label="MajestiOS, accueil">
          <span className="public-brand-mark">M</span>
          <span><strong>MajestiOS</strong><small>LES OPPORTUNITÉS PROFESSIONNELLES</small></span>
        </Link>
        <nav className="public-nav" aria-label="Navigation principale">
          <a href="#recherche">Appels d’offres</a>
          <a href="#prive">Opportunités privées</a>
          <a href="#nous-rejoindre">Nous rejoindre</a>
          <a href="#fonctionnement">Comment ça marche</a>
        </nav>
        <a className="header-login" href="#demande-acces">Connexion / Inscription</a>
      </header>

      <section className="public-hero" id="recherche">
        <div className="hero-content">
          <span className="public-eyebrow"><span /> VEILLE ET OPPORTUNITÉS PROFESSIONNELLES</span>
          <h1>Trouvez votre prochain<br /><em>appel d’offres.</em></h1>
          <p className="public-intro">Recherchez des appels d’offres publics et découvrez des opportunités privées adaptées à votre activité, votre métier et votre zone géographique.</p>
          <form className="tender-search" onSubmit={(event) => { event.preventDefault(); document.getElementById("resultats")?.scrollIntoView({ behavior: "smooth" }); }}>
            <label className="search-field search-keyword" htmlFor="search-keyword"><span>Que recherchez-vous ?</span><input id="search-keyword" name="keyword" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Ex. : nettoyage, travaux, informatique…" autoComplete="off" /></label>
            <label className="search-field" htmlFor="search-location"><span>Localisation</span><input id="search-location" name="location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Code département (ex. : 68)" autoComplete="off" /></label>
            <label className="search-field search-type" htmlFor="search-type"><span>Type d’appel d’offres</span><select id="search-type" name="type" value={type} onChange={(event) => setType(event.target.value)}><option value="all">Tous les types</option><option value="Travaux">Travaux</option><option value="Services">Services</option><option value="Fournitures">Fournitures</option></select></label>
            <button className="search-submit" type="submit"><span aria-hidden="true">⌕</span> Rechercher</button>
            {(keyword || location || type !== "all") && <button className="search-reset" type="button" onClick={() => { setKeyword(""); setLocation(""); setType("all"); }} aria-label="Effacer tous les filtres">Effacer</button>}
          </form>
          <p className="search-note">Recherche publique BOAMP · Filtre géographique par code département · Vérifiez chaque avis sur la source officielle</p>
        </div>
        <div className="hero-aside" aria-label="Les étapes MajestiOS">
          <div className="aside-orbit"><span className="orbit-dot dot-a" /><span className="orbit-dot dot-b" /><span className="orbit-dot dot-c" /><div className="orbit-center">M</div></div>
          <p><strong>Repérez.</strong> Qualifiez. Passez à l’action.</p>
        </div>
      </section>

      <section className="private-section" id="prive">
        <div className="private-heading"><div><span className="section-label">À DÉCOUVRIR</span><h2>Les opportunités privées</h2><p>Un aperçu des opportunités réservées ou diffusées par des acteurs privés.</p></div><span className="private-live"><i /> FIL D’OPPORTUNITÉS</span></div>
        <div className="ticker-window">
          <div className="ticker-track">
            {[...privateTeasers, ...privateTeasers].map((item, index) => (
              <button className="private-teaser" key={`${item.id}-${index}`} onClick={() => { setSelectedPrivate(item); setSubmitted(false); }}>
                <span className="private-label">PRIVÉ</span><strong>{item.type}</strong><span className="teaser-location"><span aria-hidden="true">⌖</span> {item.location}</span><span className="teaser-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </div>
        <p className="ticker-disclaimer">Les éléments présentés ici illustrent le format du bandeau. Les annonces privées réelles seront affichées après raccordement des sources et validation des droits de diffusion.</p>
      </section>


      <section className="join-section" id="nous-rejoindre">
        <div className="join-heading">
          <div><span className="section-label">REJOIGNEZ LE RÉSEAU MAJESTIOS</span><h2>Développons les opportunités ensemble.</h2><p>Des missions pour les professionnels qui savent détecter les marchés, créer des relations et développer l’activité commerciale.</p></div>
          <span className="join-badge">MISSIONS & COLLABORATIONS</span>
        </div>
        <div className="join-grid">
          <article className="join-card">
            <div className="join-card-top"><span className="join-icon" aria-hidden="true">↗</span><span className="join-kind">MISSION FREELANCE</span></div>
            <h3>Veille et appels d’offres</h3>
            <p>Repérer les marchés pertinents, analyser les critères et aider les professionnels à qualifier les opportunités.</p>
            <div className="join-tags"><span>Veille</span><span>Analyse</span><span>Qualification</span></div>
            <span className="join-card-status">Profil recherché — exemple</span>
          </article>
          <article className="join-card">
            <div className="join-card-top"><span className="join-icon" aria-hidden="true">◎</span><span className="join-kind">MISSION FREELANCE</span></div>
            <h3>Développement commercial</h3>
            <p>Contribuer à la prospection B2B, qualifier des prospects et identifier de nouvelles opportunités de collaboration.</p>
            <div className="join-tags"><span>Prospection B2B</span><span>Relation client</span></div>
            <span className="join-card-status">Profil recherché — exemple</span>
          </article>
          <article className="join-card join-card-network">
            <div className="join-card-top"><span className="join-icon" aria-hidden="true">＋</span><span className="join-kind">RÉSEAU PROFESSIONNEL</span></div>
            <h3>Proposer votre expertise</h3>
            <p>Vous avez une compétence utile aux entreprises ? Le réseau pourra accueillir d’autres spécialités au fil de son développement.</p>
            <div className="join-tags"><span>Expertise métier</span><span>Collaboration</span></div>
            <span className="join-card-status">Candidatures en ligne à activer</span>
          </article>
        </div>
        <p className="join-disclaimer"><strong>Prototype :</strong> ces cartes illustrent le futur espace. Les missions ne constituent pas des offres ouvertes confirmées et aucun formulaire de candidature n’est encore connecté. Les annonces publiées seront distinguées des annonces externes, avec leur source et leur statut.</p>
      </section>

      <section className="results-section" id="resultats">
        <div className="results-heading"><div><span className="section-label">EXPLORER LES CONSULTATIONS</span><h2>Appels d’offres publics</h2><p>Affinez votre recherche et consultez les informations de chaque source.</p></div><span className="results-count">{loadingExamples ? "Chargement…" : `${filteredExamples.length} résultats BOAMP`}</span></div>
        <div className="results-list">
          {filteredExamples.length ? filteredExamples.map((item) => (
            <article className="result-card" key={item.id}>
              <div className="result-icon" aria-hidden="true">↗</div><div className="result-main"><span className="result-category">{item.type} <i>·</i> BOAMP / DILA</span><h3>{item.title}</h3><p><span aria-hidden="true">⌖</span> {item.location}</p><small>{item.buyer ? `Acheteur : ${item.buyer} · ` : ""}Publication : {item.publishedAt ?? "date non renseignée"} · {item.deadline}</small><small>Statut source : {item.officialStatus ?? "à vérifier"}{item.isOpen ? " · Échéance future détectée" : " · Ouverture à vérifier"}</small></div><a className="result-action" href={item.sourceUrl ?? "https://www.boamp.fr/"} target="_blank" rel="noreferrer">Voir l’annonce officielle ↗</a>
            </article>
          )) : <div className="empty-results">Aucun exemple ne correspond à ces filtres. Essayez d’élargir votre recherche.</div>}
        </div>
        <p className="data-warning" id="sources"><strong>Source officielle : BOAMP / DILA.</strong> MajestiOS affiche les données retournées par l’API publique. Vérifiez toujours l’annonce officielle, notamment son statut et sa date limite. La recherche actuelle ne couvre pas toutes les sources de marchés publics.</p>
      </section>

      <section className="how-section" id="fonctionnement">
        <div><span className="section-label">AU-DELÀ DE LA RECHERCHE</span><h2>Une opportunité ne s’arrête pas à une annonce.</h2><p>MajestiOS a vocation à aider les professionnels à qualifier les besoins, comprendre les entreprises concernées, repérer les interlocuteurs pertinents et organiser les prochaines actions commerciales.</p></div>
        <div className="how-flow"><div><span>01</span><strong>Entreprise</strong><small>Comprendre le contexte</small></div><i>→</i><div><span>02</span><strong>Interlocuteur</strong><small>Identifier le bon contact</small></div><i>→</i><div><span>03</span><strong>Décideur</strong><small>Préparer l’action</small></div></div>
      </section>

      <section className="signup-strip" id="demande-acces"><div><h2>Ne manquez pas une opportunité.</h2><p>La création de compte et les alertes personnalisées seront proposées dans la version connectée.</p></div><span className="signup-coming-soon">Les alertes personnalisées seront activées après le raccordement des sources.</span></section>

      <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><span>La recherche d’opportunités professionnelles, enrichie par l’intelligence commerciale.</span><small>© MajestiOS · Site en construction</small></footer>

      {selectedPrivate && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedPrivate(null); }}>
        <section className="private-modal" role="dialog" aria-modal="true" aria-labelledby="private-modal-title">
          <button className="modal-close" onClick={() => setSelectedPrivate(null)} aria-label="Fermer">×</button>
          {!submitted ? <>
            <span className="private-label">OPPORTUNITÉ PRIVÉE</span><h2 id="private-modal-title">Demander des informations</h2>
            <p>Indiquez vos coordonnées pour manifester votre intérêt. Le formulaire est ici une démonstration : aucun envoi ni enregistrement n’est encore activé.</p>
            <div className="modal-summary"><strong>{selectedPrivate.type}</strong><span>{selectedPrivate.location}</span><span>PRIVÉ</span></div>
            <form className="access-form" onSubmit={handleRequest}>
              <label htmlFor="request-name">Nom et prénom<input id="request-name" required name="name" autoComplete="name" minLength={2} maxLength={100} placeholder="Votre nom" /></label>
              <label htmlFor="request-company">Entreprise<input id="request-company" required name="company" autoComplete="organization" minLength={2} maxLength={150} placeholder="Nom de votre entreprise" /></label>
              <label htmlFor="request-email">Adresse e-mail professionnelle<input id="request-email" required type="email" name="email" autoComplete="email" maxLength={254} placeholder="vous@entreprise.fr" /></label>
              <label htmlFor="request-phone">Téléphone (facultatif)<input id="request-phone" type="tel" name="phone" autoComplete="tel" inputMode="tel" maxLength={30} placeholder="+33 6 12 34 56 78" /></label>
              <label htmlFor="request-role">Votre fonction (facultatif)<input id="request-role" name="role" autoComplete="organization-title" maxLength={100} placeholder="Ex. : dirigeant, acheteur, responsable…" /></label>
              <label htmlFor="request-message">Précisions (facultatif)<textarea id="request-message" name="message" rows={3} maxLength={1000} placeholder="Décrivez brièvement votre intérêt pour cette opportunité." /></label>
              <label className="consent-check"><input required name="contactConsent" type="checkbox" /> <span>J’accepte d’être recontacté au sujet de cette opportunité. Ce formulaire de démonstration ne transmet pas encore mes informations.</span></label>
              <button className="search-submit modal-submit" type="submit">Envoyer ma demande de démonstration</button>
            </form>
          </> : <div className="request-confirmation"><span className="confirmation-mark">✓</span><h2 id="private-modal-title">Demande de démonstration</h2><p>Le formulaire fonctionne visuellement, mais la demande n’a pas été transmise. Le traitement réel sera activé avec le serveur et la politique de confidentialité.</p><button className="search-submit" onClick={() => setSelectedPrivate(null)}>Fermer</button></div>}
        </section>
      </div>}
    </main>
  );
}
