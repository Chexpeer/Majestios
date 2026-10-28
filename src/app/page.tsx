"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PublicHeader from "@/components/public-header";
import MajestiOSOpportunityMap from "@/components/majestic-opportunity-map";

type Opportunity = {
  id: number | string;
  type: string;
  location: string;
  source: "public" | "private";
  title: string;
  sourceUrl?: string;
};

const privateTeasers: Opportunity[] = [
  { id: "private-1", type: "Prestations de services", location: "Grand Est", source: "private", title: "Opportunité privée — exemple" },
  { id: "private-2", type: "Travaux professionnels", location: "Île-de-France", source: "private", title: "Opportunité privée — exemple" },
  { id: "private-3", type: "Fournitures professionnelles", location: "Auvergne-Rhône-Alpes", source: "private", title: "Opportunité privée — exemple" },
  { id: "private-4", type: "Maintenance et conseil", location: "France entière", source: "private", title: "Opportunité privée — exemple" },
];

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [searchDomain, setSearchDomain] = useState("public");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("all");
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [publicExamples, setPublicExamples] = useState<Opportunity[]>([]);
  const [loadingExamples, setLoadingExamples] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function loadTicker() {
      try {
        const response = await fetch("/api/opportunities?q=&location=&type=all", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Source indisponible");
        const payload: { items?: Opportunity[] } = await response.json();
        setPublicExamples((payload.items ?? []).map((item) => ({ ...item, source: "public" })).slice(0, 8));
      } catch {
        if (!controller.signal.aborted) setPublicExamples([]);
      } finally {
        if (!controller.signal.aborted) setLoadingExamples(false);
      }
    }
    void loadTicker();
    return () => controller.abort();
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    if (type !== "all") params.set("type", type);

    const destinations: Record<string, string> = {
      public: "/appels-offres-publics",
      business: "/business",
      companies: "/opportunites/radar-entreprises",
      private: "/appels-offres-prives",
      jobs: "/offres-emploi",
      network: "/reseaux",
      sources: "/intelligence-commerciale",
    };
    const destination = destinations[searchDomain] ?? "/opportunites";
    const query = params.toString();
    router.push(query ? `${destination}?${query}` : destination);
  }

  const tickerItems = [...publicExamples, ...privateTeasers];

  return (
    <main className="public-site">
      <PublicHeader />

      <section className="public-hero" id="recherche">
        <div className="hero-content">
          <span className="public-eyebrow"><span /> VEILLE ET OPPORTUNITÉS PROFESSIONNELLES</span>
          <h1>Transformez les signaux<br />en <em>opportunités.</em></h1>
          <p className="public-intro">MajestiOS aide les professionnels à repérer des occasions de développer leur activité, trouver les bons contacts et préparer leurs prochaines actions commerciales.</p>
          <form className="tender-search central-opportunity-search" onSubmit={handleSearch}>
            <label className="search-field search-keyword" htmlFor="search-keyword">
              <span>Que recherchez-vous ?</span>
              <input id="search-keyword" name="keyword" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Une entreprise, une opportunité, un marché…" autoComplete="off" />
            </label>
            <label className="search-field search-domain" htmlFor="search-domain">
              <span>Rubrique</span>
              <select id="search-domain" name="domain" value={searchDomain} onChange={(event) => setSearchDomain(event.target.value)}>
                <option value="public">Marchés publics</option>
                <option value="business">Business · BODACC</option>
                <option value="companies">Entreprises</option>
                <option value="private">Opportunités privées</option>
                <option value="jobs">Emploi & missions</option>
                <option value="network">Réseaux professionnels</option>
                <option value="sources">Sources & veille</option>
              </select>
            </label>
            <button className="search-submit" type="submit"><span aria-hidden="true">⌕</span> Rechercher</button>
            <button className="advanced-search-toggle" type="button" aria-expanded={advancedSearchOpen} aria-controls="advanced-search-filters" onClick={() => setAdvancedSearchOpen((open) => !open)}>
              {advancedSearchOpen ? "Masquer les filtres avancés" : "Filtres avancés"} <span aria-hidden="true">{advancedSearchOpen ? "−" : "+"}</span>
            </button>
            {advancedSearchOpen && <div className="advanced-search-panel" id="advanced-search-filters">
              <label className="search-field" htmlFor="search-location"><span>Localisation</span><input id="search-location" name="location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Ville ou département" autoComplete="off" /></label>
              {searchDomain === "public" && <label className="search-field search-type" htmlFor="search-type"><span>Type de marché public</span><select id="search-type" name="type" value={type} onChange={(event) => setType(event.target.value)}><option value="all">Tous les types</option><option value="Travaux">Travaux</option><option value="Services">Services</option><option value="Fournitures">Fournitures</option></select></label>}
              {(keyword || location || type !== "all") && <button className="search-reset" type="button" onClick={() => { setKeyword(""); setLocation(""); setType("all"); }}>Effacer les filtres</button>}
            </div>}
          </form>
          <p className="search-note">La recherche et les rubriques s’ouvrent dans leur espace dédié. Les annonces restent dans le flux et ne s’ajoutent pas à cette page.</p>
        </div>
        <div className="hero-aside"><div className="aside-orbit"><span className="orbit-dot dot-a" /><span className="orbit-dot dot-b" /><span className="orbit-dot dot-c" /><div className="orbit-center">M</div></div><p><strong>Repérez.</strong> Qualifiez. Passez à l’action.</p></div>
      </section>

      <section className="maj-map-home-section" aria-label="Carte interactive des rubriques MajestiOS">
        <MajestiOSOpportunityMap />
      </section>

      <section className="public-opportunity-ticker" aria-label="Flux transversal d’opportunités">
        <div className="public-ticker-label"><span className="ticker-live-dot" /><strong>Flux d’opportunités</strong><Link href="/opportunites">Explorer ↗</Link></div>
        <div className="public-ticker-window">
          <div className="public-ticker-track">
            {tickerItems.length > 0 ? [...tickerItems, ...tickerItems].map((item, index) => (
              <Link className="public-ticker-item" key={`${item.source}-${item.id}-${index}`} href={item.source === "public" ? `/appels-offres-publics/${encodeURIComponent(String(item.id))}` : "/appels-offres-prives"}>
                <span className={item.source === "public" ? "public-label" : "private-label"}>{item.source === "public" ? "PUBLIC" : "PRIVÉ · EXEMPLE"}</span>
                <strong>{item.title}</strong><small>{item.location}</small>
              </Link>
            )) : <span className="public-ticker-empty">{loadingExamples ? "Chargement du flux d’opportunités…" : "Les opportunités apparaîtront ici lorsque les sources seront disponibles."}</span>}
          </div>
        </div>
      </section>

      <footer className="public-footer">
        <Link className="footer-brand" href="/">MajestiOS</Link>
        <div className="footer-links">
          <div><strong>Explorer</strong><Link href="/appels-offres-publics">Marchés publics</Link><Link href="/appels-offres-prives">Opportunités privées</Link><Link href="/offres-emploi">Emploi et missions</Link><Link href="/reseaux">Réseaux professionnels</Link></div>
          <div><strong>Développement commercial</strong><Link href="/developpement-commercial/prospection">Prospection</Link><Link href="/developpement-commercial/etudes-de-marche">Études de marché</Link><Link href="/developpement-commercial/accompagnement-appels-offres">Accompagnement aux appels d’offres</Link><Link href="/developpement-commercial/e-reputation">E-réputation</Link></div>
          <div><strong>MajestiOS</strong><Link href="/comment-et-pourquoi">Comment et pourquoi</Link><Link href="/faq">FAQ</Link><Link href="/mentions-legales">Informations légales</Link></div>
        </div>
        <small>© MajestiOS · Plateforme en construction</small>
      </footer>
    </main>
  );
}
