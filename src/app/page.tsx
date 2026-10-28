"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import PublicHeader from "@/components/public-header";
import MajestiOSOpportunityMap from "@/components/majestic-opportunity-map";

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
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [appliedLocation, setAppliedLocation] = useState("");
  const [appliedType, setAppliedType] = useState("all");
  const [publicExamples, setPublicExamples] = useState<Opportunity[]>([]);
  const [loadingExamples, setLoadingExamples] = useState(true);
  const [examplesError, setExamplesError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("all");
  const [selectedPrivate, setSelectedPrivate] = useState<Opportunity | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ q: appliedKeyword, location: appliedLocation, type: appliedType });

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
  }, [appliedKeyword, appliedLocation, appliedType, retryCount]);

  const filteredExamples = publicExamples;

  function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="public-site">
      <PublicHeader />

      <section className="public-hero" id="recherche">
        <div className="hero-content">
          <span className="public-eyebrow"><span /> VEILLE ET OPPORTUNITÉS PROFESSIONNELLES</span>
          <h1>Transformez les signaux<br />en <em>opportunités.</em></h1>
          <p className="public-intro">MajestiOS aide les professionnels à repérer des occasions de développer leur activité, trouver les bons contacts et préparer leurs prochaines actions commerciales.</p>
          <form className="tender-search" onSubmit={(event) => { event.preventDefault(); setAppliedKeyword(keyword.trim()); setAppliedLocation(location.trim()); setAppliedType(type); document.getElementById("resultats")?.scrollIntoView({ behavior: "smooth" }); }}>
            <label className="search-field search-keyword" htmlFor="search-keyword"><span>Que recherchez-vous ?</span><input id="search-keyword" name="keyword" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Ex. : nettoyage, travaux, informatique…" autoComplete="off" /></label>
            <label className="search-field" htmlFor="search-location"><span>Localisation</span><input id="search-location" name="location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Code département (ex. : 68)" autoComplete="off" /></label>
            <label className="search-field search-type" htmlFor="search-type"><span>Type d’appel d’offres</span><select id="search-type" name="type" value={type} onChange={(event) => setType(event.target.value)}><option value="all">Tous les types</option><option value="Travaux">Travaux</option><option value="Services">Services</option><option value="Fournitures">Fournitures</option></select></label>
            <button className="search-submit" type="submit"><span aria-hidden="true">⌕</span> Rechercher</button>
            {(keyword || location || type !== "all") && <button className="search-reset" type="button" onClick={() => { setKeyword(""); setLocation(""); setType("all"); setAppliedKeyword(""); setAppliedLocation(""); setAppliedType("all"); }} aria-label="Effacer tous les filtres">Effacer</button>}
          </form>
          <p className="search-note">Recherche publique BOAMP · Filtre géographique par code département · Vérifiez chaque avis sur la source officielle</p>
        </div>
        <div className="hero-aside hero-map-preview"><MajestiOSOpportunityMap /></div>
      </section>

      <section className="public-opportunity-ticker" aria-label="Aperçu des appels d’offres publics">
        <div className="public-ticker-label"><span className="ticker-live-dot" /><strong>Appels d’offres publics</strong><Link href="/appels-offres-publics">Tout explorer ↗</Link></div>
        <div className="public-ticker-window"><div className="public-ticker-track">
          {([...publicExamples.slice(0, 8), ...publicExamples.slice(0, 8)]).map((item, index) => <Link className="public-ticker-item" key={`public-ticker-${item.id}-${index}`} href={`/appels-offres-publics/${encodeURIComponent(String(item.id))}`}><span>PUBLIC</span><strong>{item.title}</strong><small>{item.location}</small></Link>)}
          {!publicExamples.length && <span className="public-ticker-empty">{loadingExamples ? "Chargement des derniers avis officiels…" : "Les avis disponibles apparaîtront ici dès que la source répond."}</span>}
        </div></div>
      </section>

      <section className="private-section" id="prive">
        <div className="private-heading"><div><span className="section-label">À DÉCOUVRIR</span><h2>Les opportunités privées</h2><p>Des exemples pour montrer comment les opportunités privées pourront être présentées.</p></div><span className="private-live"><i /> FIL D’OPPORTUNITÉS</span></div>
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
          <div><span className="section-label">REJOIGNEZ MAJESTIOS</span><h2>Deux besoins prioritaires pour commencer.</h2><p>Nous recherchons des profils indépendants pour le suivi des appels d’offres et le développement commercial.</p></div>
          <Link className="join-badge" href="/nous-rejoindre">Voir les annonces ↗</Link>
        </div>
        <div className="join-grid">
          <article className="join-card">
            <div className="join-card-top"><span className="join-icon" aria-hidden="true">↗</span><span className="join-kind">ASSISTANCE INDÉPENDANTE</span></div>
            <h3>Assistante indépendante — suivi des appels d’offres</h3>
            <p>Veille, suivi des échéances et organisation des dossiers pour aider à repérer et suivre les opportunités pertinentes.</p>
            <div className="join-tags"><span>Organisation</span><span>Veille</span><span>Suivi</span></div>
            <Link className="join-card-status" href="/nous-rejoindre">Consulter la fiche de mission ↗</Link>
          </article>
          <article className="join-card">
            <div className="join-card-top"><span className="join-icon" aria-hidden="true">◎</span><span className="join-kind">DÉVELOPPEMENT COMMERCIAL</span></div>
            <h3>Business Developer — rejoignez notre équipe</h3>
            <p>Contribuer au développement de MajestiOS, identifier des opportunités et participer à l’acquisition de clients.</p>
            <div className="join-tags"><span>Développement B2B</span><span>Relation client</span></div>
            <Link className="join-card-status" href="/nous-rejoindre">Consulter la fiche de mission ↗</Link>
          </article>
        </div>
        <p className="join-disclaimer"><strong>À préciser avant ouverture :</strong> conditions de collaboration, statut et rémunération. Les candidatures ne sont pas encore collectées par un formulaire connecté.</p>
      </section>

      <section className="service-hub" id="developpement-commercial" aria-labelledby="service-hub-title">
        <div className="service-hub-heading">
          <span className="section-label">LE PÔLE MÉTIER CENTRAL</span>
          <h2 id="service-hub-title">Développement commercial</h2>
          <p>Des services complémentaires pour vous aider à trouver des clients, comprendre un marché et choisir vos prochaines actions.</p>
        </div>
        <div className="service-grid">
          <article className="service-card service-card-featured" id="prospection">
            <span className="service-index">01 · DÉTECTER</span><h3>Prospection commerciale</h3>
            <p>Définir une cible, repérer les entreprises pertinentes, qualifier les interlocuteurs et préparer une prise de contact.</p>
            <Link href="/developpement-commercial/prospection">Explorer la prospection ↗</Link>
            <small>Parcours cible — fonctionnalités en développement</small>
          </article>
          <article className="service-card" id="etudes">
            <span className="service-index">02 · ANALYSER</span><h3>Études de marché</h3>
            <p>Structurer une analyse par secteur et territoire, comparer les segments et documenter les sources, limites et hypothèses.</p>
            <Link href="/developpement-commercial/etudes-de-marche">Explorer les études de marché ↗</Link>
            <small>Page de cadrage — moteur d’étude non activé</small>
          </article>
          <article className="service-card" id="accompagnement-appels-offres">
            <span className="service-index">03 · ACCOMPAGNER</span><h3>Accompagnement aux appels d’offres</h3>
            <p>Examiner les critères, les pièces demandées et les échéances, puis organiser les étapes de préparation d’une réponse.</p>
            <Link href="/developpement-commercial/accompagnement-appels-offres">Découvrir l’accompagnement ↗</Link>
            <small>Ne remplace pas les instructions de l’acheteur</small>
          </article>
          <article className="service-card" id="ereputation">
            <span className="service-index">04 · SURVEILLER</span><h3>E-réputation</h3>
            <p>Organiser une veille sourcée, comprendre le contexte des mentions et préparer des actions soumises à validation humaine.</p>
            <Link href="/developpement-commercial/e-reputation">Explorer l’e-réputation ↗</Link>
            <small>Sous-rubrique du développement commercial</small>
          </article>
          <article className="service-card" id="diagnostic-business">
            <span className="service-index">05 · ORIENTER</span><h3>Diagnostic Business</h3>
            <p>Poser le cadre de l’entreprise, ses objectifs et ses priorités pour préparer les prochaines pistes de développement.</p>
            <Link href="/business">Évaluer mon entreprise ↗</Link>
            <small>Formulaire de demande disponible</small>
          </article>
        </div>
      </section>

      <section className="results-section" id="resultats">
        <div className="results-heading"><div><span className="section-label">EXPLORER LES CONSULTATIONS</span><h2>Appels d’offres publics</h2><p>Recherchez par mot-clé, zone géographique ou type de marché. Vérifiez ensuite chaque avis sur le site officiel.</p></div><span className="results-count">{loadingExamples ? "Recherche en cours…" : examplesError ? "Source indisponible" : `${filteredExamples.length} résultat${filteredExamples.length > 1 ? "s" : ""} BOAMP`}</span></div>
        <div className="results-list">
          {loadingExamples ? <div className="empty-results" role="status">Chargement des avis BOAMP…</div> : examplesError ? <div className="empty-results" role="alert"><p>{examplesError}</p><button className="search-submit" type="button" onClick={() => setRetryCount((count) => count + 1)}>Réessayer</button></div> : filteredExamples.length ? filteredExamples.map((item) => (
            <article className="result-card" key={item.id}>
              <div className="result-icon" aria-hidden="true">↗</div><div className="result-main"><span className="result-category">{item.type} <i>·</i> BOAMP / DILA</span><h3>{item.title}</h3><p><span aria-hidden="true">⌖</span> {item.location}</p><small>{item.buyer ? `Acheteur : ${item.buyer} · ` : ""}Publication : {item.publishedAt ?? "date non renseignée"} · {item.deadline}</small><small>Statut source : {item.officialStatus ?? "à vérifier"}{item.isOpen ? " · Échéance future détectée" : " · Ouverture à vérifier"}</small></div><div className="result-actions"><Link className="result-action" href={`/appels-offres-publics/${encodeURIComponent(String(item.id))}`}>Détail MajestiOS ↗</Link><a className="result-action" href={item.sourceUrl ?? "https://www.boamp.fr/"} target="_blank" rel="noreferrer">Avis officiel ↗</a></div>
            </article>
          )) : <div className="empty-results" role="status">Aucun avis BOAMP ne correspond aux filtres actuels. Essayez un autre mot-clé ou élargissez la recherche.</div>}
        </div>
        <p className="data-warning" id="sources"><strong>Source officielle : BOAMP / DILA.</strong> MajestiOS affiche les données retournées par l’API publique. Vérifiez toujours l’annonce officielle, notamment son statut et sa date limite. La recherche actuelle ne couvre pas toutes les sources de marchés publics.</p>
      </section>

      <section className="how-section" id="fonctionnement">
        <div><span className="section-label">AU-DELÀ DE LA RECHERCHE</span><h2>Une opportunité ne s’arrête pas à une annonce.</h2><p>MajestiOS veut vous aider à comprendre une occasion, trouver la bonne personne à contacter et décider de la suite.</p></div>
        <div className="how-flow"><div><span>01</span><strong>Entreprise</strong><small>Comprendre le contexte</small></div><i>→</i><div><span>02</span><strong>Interlocuteur</strong><small>Identifier le bon contact</small></div><i>→</i><div><span>03</span><strong>Décideur</strong><small>Préparer l’action</small></div></div>
      </section>

      <section className="signup-strip" id="demande-acces"><div><h2>Ne manquez pas une opportunité.</h2><p>La création de compte et les alertes personnalisées seront proposées dans la version connectée.</p></div><span className="signup-coming-soon">Les alertes personnalisées seront activées après le raccordement des sources.</span></section>

      <section className="network-section" id="reseaux">
        <div><span className="section-label">ÉCOSYSTÈME PROFESSIONNEL</span><h2>Les opportunités se développent aussi par les réseaux.</h2><p>Découvrez les types de partenaires qui pourraient aider votre entreprise. Toute mise en relation devra être vérifiée et acceptée par les personnes concernées.</p></div>
        <Link className="network-cta" href="/reseaux">Découvrir les réseaux professionnels ↗</Link>
      </section>
      <footer className="public-footer">
        <Link className="footer-brand" href="/">MajestiOS</Link>
        <div className="footer-links">
          <div><strong>Découvrir</strong><Link href="/comment-et-pourquoi">Comment et pourquoi MajestiOS ?</Link><Link href="/appels-offres-publics">Appels d’offres publics</Link><Link href="/appels-offres-prives">Appels d’offres privés</Link></div>
          <div><strong>Nos expertises</strong><Link href="/developpement-commercial">Développement commercial</Link><Link href="/developpement-commercial/prospection">Prospection commerciale</Link><Link href="/developpement-commercial/etudes-de-marche">Études de marché</Link><Link href="/developpement-commercial/accompagnement-appels-offres">Accompagnement aux appels d’offres</Link><Link href="/developpement-commercial/e-reputation">E-réputation</Link></div>
          <div><strong>Rejoindre</strong><Link href="/reseaux">Réseaux professionnels</Link><Link href="/nous-rejoindre">Les deux missions de recrutement</Link></div>
          <div><strong>Informations</strong><Link href="/faq">Questions fréquentes (FAQ)</Link><Link href="/mentions-legales">Mentions légales</Link></div>
        </div>
        <small>© MajestiOS · Site en construction</small>
      </footer>

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
