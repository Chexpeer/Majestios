import Link from "next/link";
import SiteHub from "@/components/site-hub";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Espace professionnel — MajestiOS",
  description: "Accéder aux parcours professionnels de MajestiOS et préparer l’étude d’une opportunité.",
};

type SearchParams = Promise<{
  intention?: string;
  source?: string;
  opportunite?: string;
  q?: string;
  location?: string;
  type?: string;
  openOnly?: string;
}>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  if (params.intention !== "opportunite") {
    return <SiteHub pathname="/espace-professionnel" showMap={false} showResources={false} eyebrow="ESPACE PROFESSIONNEL" intro="L’espace professionnel réunira les dossiers, les opportunités suivies et les actions de développement commercial. L’authentification et les autorisations seront configurées avant l’ouverture des fonctions privées." checklist={["Aucun dossier privé ne doit être accessible sans authentification.", "Les rôles et les droits d’accès seront définis avant l’activation.", "Les clés API et secrets resteront exclusivement côté serveur."]} />;
  }

  const source = params.source === "boamp" ? "BOAMP" : params.source === "opportunites-privees" ? "opportunités privées" : "opportunité";
  const id = (params.opportunite ?? "").slice(0, 160);
  const backParams = new URLSearchParams();
  for (const key of ["q", "location", "type", "openOnly"] as const) {
    const value = params[key];
    if (value) backParams.set(key, value);
  }
  const backHref = params.source === "boamp" ? (backParams.size ? "/opportunites/marches-publics?" + backParams.toString() : "/opportunites/marches-publics") : "/opportunites/marches-prives";
  const detailHref = params.source === "boamp" && id ? "/opportunites/marches-publics/" + encodeURIComponent(id) : null;

  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">ESPACE PROFESSIONNEL · PRÉPARATION</span>
      <h1>Étudier une <em>opportunité.</em></h1>
      <p>Vous avez choisi une opportunité issue de {source}. Cette étape aide à préparer votre décision ; elle ne constitue ni une candidature officielle ni un dossier enregistré.</p>
    </div></section>
    <section className="concept-principles">
      <span className="section-label">RÉFÉRENCE SÉLECTIONNÉE</span>
      <h2>{id ? `Avis ${id}` : "Opportunité privée"}</h2>
      <p><strong>Source :</strong> {source}</p>
      <h3>Avant de vous positionner</h3>
      <ul>
        <li>Vérifiez l’annonce complète, les conditions d’accès et les échéances auprès de la source concernée.</li>
        <li>Confirmez que votre activité, vos moyens et vos références correspondent au besoin.</li>
        <li>Préparez les questions ou documents à clarifier avant toute réponse.</li>
      </ul>
      {detailHref ? <p><Link className="search-submit concept-cta" href={detailHref}>Revoir la fiche de l’avis ↗</Link></p> : null}
      <p><Link className="search-submit concept-cta" href={backHref}>← Retour aux opportunités</Link></p>
      <p className="ticker-disclaimer">L’enregistrement dans un espace membre et le suivi de dossier ne sont pas encore activés. Aucune donnée n’a été sauvegardée par cette consultation.</p>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/comprendre/faq">FAQ</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/mentions-legales">Mentions légales</Link></footer>
  </main>;
}
