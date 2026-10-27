"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

type Opportunity = {
  id: number;
  type: string;
  location: string;
  source: "public" | "private";
  title: string;
  deadline?: string;
};

const publicExamples: Opportunity[] = [
  { id: 1, type: "Travaux", location: "Grand Est", source: "public", title: "Exemple de résultat — travaux et rénovation", deadline: "Date à récupérer depuis la source" },
  { id: 2, type: "Services", location: "France entière", source: "public", title: "Exemple de résultat — prestations de services", deadline: "Date à récupérer depuis la source" },
  { id: 3, type: "Fournitures", location: "Bourgogne-Franche-Comté", source: "public", title: "Exemple de résultat — fournitures professionnelles", deadline: "Date à récupérer depuis la source" },
];

const privateTeasers: Opportunity[] = [
  { id: 101, type: "Prestations de services", location: "Grand Est", source: "private", title: "Opportunité privée — exemple de présentation" },
  { id: 102, type: "Travaux", location: "Île-de-France", source: "private", title: "Opportunité privée — exemple de présentation" },
  { id: 103, type: "Fournitures professionnelles", location: "Auvergne-Rhône-Alpes", source: "private", title: "Opportunité privée — exemple de présentation" },
  { id: 104, type: "Maintenance", location: "France entière", source: "private", title: "Opportunité privée — exemple de présentation" },
];

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("all");
  const [selectedPrivate, setSelectedPrivate] = useState<Opportunity | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const filteredExamples = useMemo(() => publicExamples.filter((item) => {
    const query = keyword.trim().toLocaleLowerCase("fr");
    const matchesQuery = !query || `${item.title} ${item.type} ${item.location}`.toLocaleLowerCase("fr").includes(query);
    const matchesLocation = !location.trim() || item.location.toLocaleLowerCase("fr").includes(location.trim().toLocaleLowerCase("fr")) || item.location === "France entière";
    const matchesType = type === "all" || item.type === type;
    return matchesQuery && matchesLocation && matchesType;
  }), [keyword, location, type]);

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
            <label className="search-field search-keyword"><span>Que recherchez-vous ?</span><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Ex. : nettoyage, travaux, informatique…" /></label>
            <label className="search-field"><span>Localisation</span><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Ville, département, région…" /></label>
            <label className="search-field search-type"><span>Type d’appel d’offres</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">Tous les types</option><option value="Travaux">Travaux</option><option value="Services">Services</option><option value="Fournitures">Fournitures</option></select></label>
            <button className="search-submit" type="submit"><span aria-hidden="true">⌕</span> Rechercher</button>
          </form>
          <p className="search-note">Recherche publique · Sources et dates à vérifier sur chaque annonce</p>
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

      <section className="results-section" id="resultats">
        <div className="results-heading"><div><span className="section-label">EXPLORER LES CONSULTATIONS</span><h2>Appels d’offres publics</h2><p>Affinez votre recherche et consultez les informations de chaque source.</p></div><span className="results-count">{filteredExamples.length} exemples</span></div>
        <div className="results-list">
          {filteredExamples.length ? filteredExamples.map((item) => (
            <article className="result-card" key={item.id}>
              <div className="result-icon" aria-hidden="true">↗</div><div className="result-main"><span className="result-category">{item.type} <i>·</i> PUBLIC</span><h3>{item.title}</h3><p><span aria-hidden="true">⌖</span> {item.location}</p><small>{item.deadline}</small></div><span className="result-action result-action-disabled" aria-label="Source officielle non disponible pour cet exemple">Source officielle à raccorder</span>
            </article>
          )) : <div className="empty-results">Aucun exemple ne correspond à ces filtres. Essayez d’élargir votre recherche.</div>}
        </div>
        <p className="data-warning" id="sources"><strong>Prototype en cours de raccordement.</strong> Ces lignes sont des exemples d’interface, pas des appels d’offres réels. Les résultats vérifiés apparaîtront lorsque les sources de données seront intégrées.</p>
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
              <label>Nom et prénom<input required name="name" autoComplete="name" placeholder="Votre nom" /></label>
              <label>Entreprise<input required name="company" autoComplete="organization" placeholder="Nom de votre entreprise" /></label>
              <label>Adresse e-mail professionnelle<input required type="email" name="email" autoComplete="email" placeholder="vous@entreprise.fr" /></label>
              <label>Téléphone (facultatif)<input type="tel" name="phone" autoComplete="tel" placeholder="Votre numéro" /></label>
              <label className="consent-check"><input required type="checkbox" /> <span>J’accepte d’être recontacté au sujet de cette opportunité.</span></label>
              <button className="search-submit modal-submit" type="submit">Envoyer ma demande</button>
            </form>
          </> : <div className="request-confirmation"><span className="confirmation-mark">✓</span><h2 id="private-modal-title">Demande de démonstration</h2><p>Le formulaire fonctionne visuellement, mais la demande n’a pas été transmise. Le traitement réel sera activé avec le serveur et la politique de confidentialité.</p><button className="search-submit" onClick={() => setSelectedPrivate(null)}>Fermer</button></div>}
        </section>
      </div>}
    </main>
  );
}
