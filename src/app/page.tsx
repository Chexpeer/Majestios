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
  isOpen?: boolean;
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
        const response = await fetch("/api/opportunities?q=&location=&type=all&limit=8&openOnly=true", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Source indisponible");
        const payload: { items?: Opportunity[] } = await response.json();
        setPublicExamples((payload.items ?? []).filter((item) => item.isOpen === true).map((item) => ({ ...item, source: "public" as const })).slice(0, 8));
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
    const destinations: Record<string, string> = {
      public: "/appels-offres-publics",
      business: "/business",
      companies: "/opportunites/radar-entreprises",
      private: "/appels-offres-prives",
      jobs: "/offres-emploi",
      network: "/reseaux",
      sources: "/developpement-commercial",
    };
    const destination = destinations[searchDomain] ?? "/opportunites";
    const params = new URLSearchParams();

    // Ne transmettre que les filtres réellement pris en charge par la rubrique cible.
    if (keyword.trim() && ["public", "business", "companies", "private", "jobs"].includes(searchDomain)) {
      params.set("q", keyword.trim().slice(0, 160));
    }
    if (searchDomain === "public") {
      if (location.trim()) params.set("location", location.trim().slice(0, 80));
      if (type !== "all") params.set("type", type);
    }

    const query = params.toString();
    router.push(query ? `${destination}?${query}` : destination);
  }

  const tickerItems = [...publicExamples, ...privateTeasers];

  return (
    <main className="public-site home-hub">
      <PublicHeader />

      <section className="public-hero home-hero-compact" id="recherche">
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
                <option value="sources">Développement commercial</option>
              </select>
            </label>
            <button className="search-submit" type="submit"><span aria-hidden="true">⌕</span> Rechercher</button>
            <button className="advanced-search-toggle" type="button" aria-expanded={advancedSearchOpen} aria-controls="advanced-search-filters" onClick={() => setAdvancedSearchOpen((open) => !open)}>
              {advancedSearchOpen ? "Masquer les filtres avancés" : "Filtres avancés"} <span aria-hidden="true">{advancedSearchOpen ? "−" : "+"}</span>
            </button>
            {advancedSearchOpen && <div className="advanced-search-panel" id="advanced-search-filters">
              {searchDomain === "public" && <label className="search-field" htmlFor="search-location"><span>Département</span><input id="search-location" name="location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Code département (ex. : 68)" autoComplete="off" /></label>}
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

      <section className="home-opportunity-flow" aria-label="Flux transversal d’opportunités">
        <div className="home-flow-label">
          <span className="ticker-live-dot" aria-hidden="true" />
          <div><strong>Flux d’opportunités</strong><small>Les annonces défilent ici, sans encombrer l’accueil.</small></div>
          <Link href="/opportunites">Tout explorer ↗</Link>
        </div>
        <div className="home-flow-window">
          <div className="home-flow-track">
            {tickerItems.length > 0 ? [...tickerItems, ...tickerItems].map((item, index) => (
              <Link className="home-flow-item" key={`${item.source}-${item.id}-${index}`} href={item.source === "public" ? `/appels-offres-publics/${encodeURIComponent(String(item.id))}` : "/appels-offres-prives"}>
                <span className={item.source === "public" ? "public-label" : "private-label"}>{item.source === "public" ? "PUBLIC" : "PRIVÉ · EXEMPLE"}</span>
                <strong title={item.title}>{item.title}</strong><small>{item.location}</small><span className="home-flow-arrow" aria-hidden="true">↗</span>
              </Link>
            )) : <p className="home-flow-empty">{loadingExamples ? "Chargement du flux d’opportunités…" : "Les opportunités apparaîtront ici lorsque les sources seront disponibles."}</p>}
          </div>
        </div>
        <p className="home-flow-note">Les éléments privés affichés comme exemples sont illustratifs, pas des annonces publiées par des membres.</p>
      </section>

      <footer className="home-minimal-footer">
        <span>© MajestiOS · Plateforme en construction progressive</span>
        <nav aria-label="Liens utiles">
          <Link href="/comment-et-pourquoi">Le concept</Link>
          <Link href="/faq">FAQ & aide</Link>
          <Link href="/mentions-legales">Informations légales</Link>
          <Link href="/espace-professionnel">Espace professionnel ↗</Link>
        </nav>
      </footer>
    </main>
  );
}
