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
  deadline?: string;
  sourceUrl?: string;
};

const privateTeasers = [
  { id: "private-services", title: "Prestations de services", location: "Grand Est" },
  { id: "private-works", title: "Travaux professionnels", location: "Île-de-France" },
  { id: "private-supplies", title: "Fournitures professionnelles", location: "France entière" },
];

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [searchDomain, setSearchDomain] = useState("public");
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("all");
  const [publicItems, setPublicItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function loadTicker() {
      try {
        const response = await fetch("/api/opportunities?limit=8", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload: { items?: Opportunity[] } = await response.json();
        if (!controller.signal.aborted) setPublicItems(payload.items ?? []);
      } catch {
        // Le flux reste utilisable même si la source publique est momentanément indisponible.
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadTicker();
    return () => controller.abort();
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = keyword.trim();
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
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (searchDomain === "public") {
      if (location.trim()) params.set("location", location.trim());
      if (type !== "all") params.set("type", type);
    }
    router.push(params.size ? `${destination}?${params.toString()}` : destination);
  }

  const feedItems: Array<
    | { kind: "public"; key: string; title: string; location: string; href: string }
    | { kind: "private"; key: string; title: string; location: string; href: string }
  > = [
    ...publicItems.slice(0, 8).map((item) => ({
      kind: "public" as const,
      key: `public-${item.id}`,
      title: item.title,
      location: item.location,
      href: `/appels-offres-publics/${encodeURIComponent(String(item.id))}`,
    })),
    ...privateTeasers.map((item) => ({
      kind: "private" as const,
      key: item.id,
      title: item.title,
      location: item.location,
      href: "/appels-offres-prives",
    })),
  ];
  const movingItems = feedItems.length ? [...feedItems, ...feedItems] : [];

  return (
    <main className="public-site home-hub">
      <PublicHeader />

      <section className="public-hero home-hero-compact" id="recherche">
        <div className="hero-content">
          <span className="public-eyebrow"><span /> INTELLIGENCE COMMERCIALE B2B</span>
          <h1>Les opportunités<br />au bon <em>endroit.</em></h1>
          <p className="public-intro">
            Repérez les signaux utiles, explorez les pôles MajestiOS et poursuivez chaque démarche dans son espace dédié.
          </p>
          <form className="tender-search central-opportunity-search" onSubmit={handleSearch}>
            <label className="search-field search-keyword" htmlFor="home-search-keyword">
              <span>Que recherchez-vous ?</span>
              <input id="home-search-keyword" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Une entreprise, un marché, une mission…" autoComplete="off" />
            </label>
            <label className="search-field search-domain" htmlFor="home-search-domain">
              <span>Rubrique</span>
              <select id="home-search-domain" value={searchDomain} onChange={(event) => setSearchDomain(event.target.value)}>
                <option value="public">Marchés publics</option>
                <option value="business">Business · BODACC</option>
                <option value="companies">Entreprises</option>
                <option value="private">Opportunités privées</option>
                <option value="jobs">Emploi & missions</option>
                <option value="network">Réseaux professionnels</option>
                <option value="sources">Sources & veille</option>
              </select>
            </label>
            <button className="search-submit" type="submit">Rechercher <span aria-hidden="true">↗</span></button>
            <button className="advanced-search-toggle" type="button" aria-expanded={advancedSearchOpen} aria-controls="home-advanced-filters" onClick={() => setAdvancedSearchOpen((open) => !open)}>
              {advancedSearchOpen ? "Masquer les filtres" : "Filtres avancés"} <span aria-hidden="true">{advancedSearchOpen ? "−" : "+"}</span>
            </button>
            {advancedSearchOpen && (
              <div className="advanced-search-panel" id="home-advanced-filters">
                <label className="search-field" htmlFor="home-search-location">
                  <span>Ville ou département</span>
                  <input id="home-search-location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Ex. : 68, Mulhouse…" />
                </label>
                {searchDomain === "public" && (
                  <label className="search-field" htmlFor="home-search-type">
                    <span>Type de marché public</span>
                    <select id="home-search-type" value={type} onChange={(event) => setType(event.target.value)}>
                      <option value="all">Tous les types</option>
                      <option value="Travaux">Travaux</option>
                      <option value="Services">Services</option>
                      <option value="Fournitures">Fournitures</option>
                    </select>
                  </label>
                )}
                <button className="search-reset" type="button" onClick={() => { setLocation(""); setType("all"); }}>Réinitialiser</button>
              </div>
            )}
          </form>
          <p className="search-note">La recherche ouvre la rubrique correspondante. Les annonces détaillées restent dans leur espace dédié.</p>
        </div>
      </section>

      <section className="maj-map-home-section" aria-label="Carrefour interactif des rubriques MajestiOS">
        <MajestiOSOpportunityMap />
      </section>

      <section className="home-opportunity-flow" aria-label="Flux transversal d'opportunités">
        <div className="home-flow-label">
          <span className="ticker-live-dot" />
          <div><strong>Le flux MajestiOS</strong><small>Un aperçu qui circule, sans envahir les espaces</small></div>
          <Link href="/opportunites">Explorer <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="home-flow-window">
          {movingItems.length > 0 ? (
            <div className="home-flow-track">
              {movingItems.map((item, index) => (
                <Link className="home-flow-item" key={`${item.key}-${index}`} href={item.href}>
                  <span className={item.kind === "public" ? "public-label" : "private-label"}>{item.kind === "public" ? "PUBLIC" : "PRIVÉ · EXEMPLE"}</span>
                  <strong>{item.title}</strong>
                  <small>{item.location}</small>
                  <span className="home-flow-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="home-flow-empty">{loading ? "Chargement des opportunités disponibles…" : "Le flux sera enrichi au fur et à mesure du raccordement des sources."} Les exemples privés sont clairement identifiés et ne sont pas des annonces réelles.</p>
          )}
        </div>
        <p className="home-flow-note">Les avis publics renvoient vers leur fiche MajestiOS. Les exemples privés sont uniquement illustratifs. Aucune annonce n’est créée ni enregistrée par ce bandeau.</p>
      </section>

      <footer className="home-minimal-footer">
        <span>© MajestiOS · Plateforme en construction progressive</span>
        <nav aria-label="Liens utiles"><Link href="/comment-et-pourquoi">Le concept</Link><Link href="/faq">FAQ</Link><Link href="/mentions-legales">Mentions légales</Link></nav>
      </footer>
    </main>
  );
}
