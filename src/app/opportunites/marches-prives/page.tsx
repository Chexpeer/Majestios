import Link from "next/link";

export const metadata = {
  title: "Marchés privés et opportunités confidentielles — MajestiOS",
  description: "Comprendre comment MajestiOS peut repérer, vérifier et qualifier des consultations privées et d'autres signaux d'affaires, dans le respect des droits de diffusion."
};

const families = [
  {
    number: "01",
    title: "Consultations et besoins privés",
    text: "Repérer les besoins publiés par des entreprises, donneurs d’ordre, réseaux professionnels ou plateformes autorisées. La pertinence dépend de l’activité, du territoire, du calendrier et des conditions d’accès.",
    action: "Explorer par secteur",
    href: "/opportunites/marches-prives/secteur"
  },
  {
    number: "02",
    title: "Travaux induits et sous-traitance",
    text: "Un marché attribué peut générer des besoins de renfort, de location de matériel, de fournitures ou de sous-traitance. Ce sont des pistes à investiguer, jamais des besoins confirmés sans élément complémentaire.",
    action: "Consulter les marchés publics",
    href: "/opportunites/publiques"
  },
  {
    number: "03",
    title: "Cession, reprise et transmission",
    text: "Une annonce de cession ou une évolution d’entreprise peut relever d’un projet de reprise, d’un besoin d’accompagnement ou d’une mise en relation. Le contexte et l’autorisation de diffusion doivent être vérifiés.",
    action: "Explorer la veille BODACC",
    href: "/business/veille-bodacc"
  }
];

const steps = [
  ["Tracer la source", "Conserver l’origine, la date, les conditions d’accès et, si nécessaire, la preuve d’autorisation de publication."],
  ["Vérifier l’actualité", "Contrôler que la consultation ou l’annonce est toujours ouverte et que ses modalités n’ont pas changé."],
  ["Qualifier la compatibilité", "Comparer le besoin explicite avec les métiers, capacités, territoires et contraintes de l’entreprise."],
  ["Décider d’une suite proportionnée", "Préparer une mise en relation, demander une vérification complémentaire ou écarter la piste si les éléments sont insuffisants."]
];

export default function MarchesPrivesPage() {
  return <main className="site-page">
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link>
        <span><b>/</b><Link href="/opportunites">Opportunités</Link></span>
        <span><b>/</b><Link href="/opportunites/privees">Opportunités privées</Link></span>
        <span><b>/</b><strong>Marchés privés</strong></span>
      </nav>
      <section data-dossier-symbol="↗" className="page-hero bodacc-hero">
        <span className="eyebrow">MAJESTIOS · OPPORTUNITÉS PRIVÉES</span>
        <h1>Les marchés privés, <span>qualifiés avant d’être proposés.</span></h1>
        <p>MajestiOS ne doit pas seulement diffuser des annonces. Sa valeur est de rapprocher un besoin ou un signal vérifiable des entreprises qui ont réellement les compétences pour y répondre, puis d’organiser une prochaine étape commerciale pertinente.</p>
        <div className="page-hero-meta"><span className="status-chip status-chip-preparing"><i />Flux privé en préparation</span><span>Flux de consultations privées : en préparation</span><span>Source · actualité · adéquation · action</span></div>
      </section>
      <section className="content-panel">
        <span className="eyebrow">TROIS FAMILLES DE SIGNAUX</span>
        <h2>Ne pas confondre annonce, indice et opportunité confirmée.</h2>
        <p>Les consultations privées, les travaux induits et les opérations de cession n’ont ni la même source ni le même parcours. MajestiOS doit les distinguer tout en permettant de les rapprocher lorsque ce croisement est justifié.</p>
        <div className="bodacc-signal-grid">{families.map((item)=><article className="bodacc-signal-card" key={item.number}><span className="eyebrow">{item.number} · FAMILLE</span><h3>{item.title}</h3><p>{item.text}</p><Link href={item.href}>{item.action} <span aria-hidden="true">→</span></Link></article>)}</div>
      </section>
      <section className="bodacc-section">
        <div className="section-heading"><span className="eyebrow">MÉTHODE DE QUALIFICATION</span><h2>Quatre contrôles avant toute action.</h2><p>Une annonce non vérifiée n’est pas une opportunité prête à transmettre à une entreprise.</p></div>
        <ol className="bodacc-steps">{steps.map((item,index)=><li key={item[0]}><span>{String(index+1).padStart(2,"0")}</span><div><h3>{item[0]}</h3><p>{item[1]}</p></div></li>)}</ol>
      </section>
      <section className="content-panel">
        <span className="eyebrow">GARDE-FOUS</span><h2>La confiance fait partie du produit.</h2>
        <ul>
          <li>Ne pas publier une annonce privée sans base légitime et autorisation de diffusion appropriée.</li>
          <li>Ne pas présenter une hypothèse de sous-traitance comme un besoin exprimé par le donneur d’ordre.</li>
          <li>Ne pas exposer les coordonnées sensibles avant que le parcours et les règles d’accès soient définis.</li>
          <li>Indiquer les dates, les sources et les incertitudes ; retirer ou actualiser les annonces périmées.</li>
        </ul>
        <p>Les rubriques ci-dessous décrivent la méthode et les parcours du produit. Elles ne signifient pas que toutes les sources privées sont déjà connectées ni qu’un flux exhaustif est actuellement disponible.</p>
      </section>
      <section className="bodacc-next-actions"><div><span className="eyebrow">PASSER À L’ÉTAPE SUIVANTE</span><h2>Du signal à la rencontre utile.</h2><p>La prochaine action dépend du type d’opportunité et de son niveau de vérification.</p></div><div className="bodacc-next-links"><Link href="/opportunites/marches-prives/secteur">Marchés privés par secteur <span>→</span></Link><Link href="/developpement-commercial/prospection">Méthode de prospection <span>→</span></Link><Link href="/business/intelligence-entreprises">Intelligence entreprises <span>→</span></Link></div></section>
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/faq">Besoin d’aide ?</Link></footer>
    </div>
  </main>;
}
