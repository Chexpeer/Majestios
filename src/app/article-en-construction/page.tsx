import Link from "next/link";
import PublicHeader from "@/components/public-header";

type PageProps = {
  searchParams?: {
    titre?: string;
    rubrique?: string;
  };
};

export const metadata = {
  title: "Article en construction — MajestiOS",
  description: "Cette page est réservée à un contenu MajestiOS en cours de préparation.",
};

export default function ArticleEnConstructionPage({ searchParams }: PageProps) {
  const title = typeof searchParams?.titre === "string" ? searchParams.titre.slice(0, 160) : "Contenu à définir";
  const rubrique = typeof searchParams?.rubrique === "string" ? searchParams.rubrique.replace(/-/g, " ") : "MajestiOS";
  return (
    <main className="public-site concept-page">
      <PublicHeader />
      <section className="how-section concept-hero">
        <div>
          <span className="section-label">BIBLIOTHÈQUE MAJESTIOS · {rubrique.toUpperCase()}</span>
          <h1>Article <em>en construction.</em></h1>
          <h2>{title}</h2>
          <p>Le contenu de cet article reste à définir. Cette page est volontairement conservée dans l’arborescence pour faciliter sa rédaction, sa vérification et les futures contributions humaines ou assistées par IA.</p>
          <p>Aucune fonctionnalité n’est annoncée comme active tant qu’elle n’a pas été implémentée et vérifiée.</p>
          <div className="hero-actions">
            <Link className="button-primary" href="/">Retour à l’accueil ↗</Link>
            <Link className="button-secondary" href="/opportunites">Explorer les rubriques</Link>
          </div>
        </div>
      </section>
      <footer className="public-footer">
        <Link className="footer-brand" href="/">MajestiOS</Link>
        <nav aria-label="Liens de pied de page"><Link href="/comprendre/faq">FAQ</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/mentions-legales">Mentions légales</Link></nav>
      </footer>
    </main>
  );
}
