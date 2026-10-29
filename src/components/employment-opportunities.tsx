"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PublicHeader from "@/components/public-header";
import AnnouncementTicker from "@/components/announcement-ticker";
import ResourceCards from "@/components/resource-cards";
import SectionInteractiveMap from "@/components/section-interactive-map";

type Job = { id: string; title: string; contract: "Freelance" | "Indépendant" | "CDD" | "CDI"; region: string; remote: "Télétravail" | "Hybride" | "Sur site"; category: string; summary: string; source: string };

const jobs: Job[] = [
  { id: "gestionnaire-appels-offres", title: "Gestionnaire indépendant d’appels d’offres", contract: "Indépendant", region: "France", remote: "Hybride", category: "Appels d’offres", summary: "Analyser les consultations, organiser les pièces du dossier et accompagner les entreprises dans la préparation de leur réponse.", source: "Recrutement MajestiOS — offre à formaliser" },
  { id: "business-developer-freelance", title: "Business developer freelance", contract: "Freelance", region: "France", remote: "Télétravail", category: "Développement commercial", summary: "Qualifier les opportunités, identifier les bons interlocuteurs et développer un réseau commercial utile aux membres.", source: "Recrutement MajestiOS — offre à formaliser" },
  { id: "analyste-veille-commerciale", title: "Analyste veille et intelligence commerciale", contract: "Freelance", region: "France", remote: "Télétravail", category: "Veille commerciale", summary: "Repérer les signaux d’affaires, vérifier les sources et contribuer à la qualification des opportunités.", source: "Recrutement MajestiOS — offre à formaliser" },
  { id: "assistant-administratif", title: "Assistant administratif indépendant", contract: "Freelance", region: "France", remote: "Hybride", category: "Administration", summary: "Aider à structurer les dossiers, contrôler les pièces administratives et fluidifier le parcours des membres.", source: "Recrutement MajestiOS — offre à formaliser" },
  { id: "expert-reponse-marches", title: "Consultant en réponse aux marchés", contract: "Indépendant", region: "France", remote: "Télétravail", category: "Appels d’offres", summary: "Apporter une expertise métier pour analyser les exigences d’une consultation et préparer une réponse adaptée.", source: "Recrutement MajestiOS — offre à formaliser" },
];

export default function EmploymentOpportunities() {
  const [q, setQ] = useState("");
  const [contract, setContract] = useState("all");
  const [region, setRegion] = useState("all");
  const [remote, setRemote] = useState("all");
  const [category, setCategory] = useState("all");
  const results = useMemo(() => jobs.filter((job) => {
    const haystack = [job.title, job.summary, job.category, job.region].join(" ").toLocaleLowerCase("fr");
    return (!q.trim() || haystack.includes(q.trim().toLocaleLowerCase("fr")))
      && (contract === "all" || job.contract === contract)
      && (region === "all" || job.region === region)
      && (remote === "all" || job.remote === remote)
      && (category === "all" || job.category === category);
  }), [q, contract, region, remote, category]);

  return <main className="public-site concept-page employment-page">
    <PublicHeader />
    <AnnouncementTicker flow="emploi" />
    <section className="how-section concept-hero"><div>
      <span className="section-label">EMPLOI · MISSIONS · RÉSEAU MAJESTIOS</span>
      <h1>Les compétences qui font avancer <em>les opportunités.</em></h1>
      <p>Retrouvez les missions et profils recherchés pour construire le réseau MajestiOS. Les premières annonces décrivent des besoins de recrutement à formaliser ; les conditions définitives seront précisées avant toute candidature effective.</p>
    </div></section>
    <SectionInteractiveMap title="Emploi et missions" items={[{label:"Offres d’emploi",href:"/opportunites/emploi/offres",description:"Explorer les offres par métier et région."},{label:"Missions",href:"/opportunites/emploi/missions",description:"Découvrir les missions ponctuelles et freelance."},{label:"Conseils",href:"/opportunites/emploi/conseils",description:"Préparer une candidature ou un recrutement."}]} />
    <section className="employment-search" aria-labelledby="employment-search-title">
      <div className="employment-search-heading"><span className="section-label">RECHERCHE MULTICRITÈRE</span><h2 id="employment-search-title">Trouvez une mission adaptée</h2><p>Combinez métier, contrat, localisation et organisation du travail.</p></div>
      <form className="employment-filter-grid" onSubmit={(event) => event.preventDefault()}>
        <label>Mot-clé ou compétence<input type="search" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Ex. : appels d’offres, prospection" /></label>
        <label>Famille de métier<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">Tous les métiers</option><option>Appels d’offres</option><option>Développement commercial</option><option>Veille commerciale</option><option>Administration</option></select></label>
        <label>Type de contrat<select value={contract} onChange={(event) => setContract(event.target.value)}><option value="all">Tous les contrats</option><option>Freelance</option><option>Indépendant</option><option>CDD</option><option>CDI</option></select></label>
        <label>Zone géographique<select value={region} onChange={(event) => setRegion(event.target.value)}><option value="all">Toutes les zones</option><option>France</option></select></label>
        <label>Organisation du travail<select value={remote} onChange={(event) => setRemote(event.target.value)}><option value="all">Toutes</option><option>Télétravail</option><option>Hybride</option><option>Sur site</option></select></label>
      </form>
      <div className="employment-results-heading"><h3>Offres et missions</h3><span>{results.length} annonce(s)</span></div>
      <div className="employment-results">{results.map((job) => <article className="employment-card" key={job.id}>
        <div className="employment-card-top"><span className="employment-tag">{job.category}</span><span className="employment-tag employment-contract">{job.contract}</span></div>
        <h3>{job.title}</h3><p>{job.summary}</p>
        <div className="employment-meta"><span>{job.region}</span><span>{job.remote}</span></div>
        <small>{job.source}. Fiche de recrutement préparatoire, non assimilable à une offre contractuelle finalisée.</small>
        <Link className="search-submit employment-apply" href={"/creer-espace?"+new URLSearchParams({intention:"candidature",offre:job.id,titre:job.title}).toString()}>Créer mon espace et déposer mon CV ↗</Link>
      </article>)}</div>
      <p className="ticker-disclaimer">Les annonces affichées sont des besoins préparatoires de MajestiOS, pas des postes externes vérifiés. Le dépôt de CV sera activé après mise en place du stockage sécurisé et du traitement des candidatures.</p>
    </section>
    <ResourceCards scope="emploi" />
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav aria-label="Liens de pied de page"><Link href="/opportunites/marches-publics">Marchés publics</Link><Link href="/opportunites/marches-prives">Marchés privés</Link><Link href="/comprendre/faq">FAQ</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/mentions-legales">Mentions légales</Link></nav><small>© MajestiOS · Recrutement en préparation</small></footer>
  </main>;
}
