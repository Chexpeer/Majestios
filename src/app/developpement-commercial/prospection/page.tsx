import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Prospection intelligente et ciblage commercial — MajestiOS",
  description: "Partir de signaux vérifiables, qualifier les entreprises et préparer une démarche commerciale pertinente."
};

const stages = [
  { title: "Détecter un signal", text: "Repérer un marché, un événement, une évolution d’entreprise ou une demande publiée. Enregistrer la source, la date et le contexte." },
  { title: "Qualifier l’opportunité", text: "Vérifier l’adéquation entre le signal, l’activité ciblée, le territoire, les compétences proposées et les éléments réellement disponibles." },
  { title: "Identifier les bons interlocuteurs", text: "Rechercher des coordonnées professionnelles adaptées à la démarche et conserver la provenance ainsi que la date de vérification." },
  { title: "Préparer une approche utile", text: "Construire un message contextualisé qui explique la pertinence du contact, sans prétendre connaître un besoin qui n’a pas été exprimé." },
  { title: "Suivre et capitaliser", text: "Documenter la réponse, la prochaine étape et le résultat. Un refus sur une proposition donnée ne vaut pas nécessairement refus de toute relation future." }
];

export default function ProspectionPage() {
  return <main className="site-page">
    <PublicHeader />
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span><b>/</b><Link href="/developpement-commercial">Développement commercial</Link></span><span><b>/</b><strong>Prospection</strong></span></nav>
      <section className="page-hero bodacc-hero">
        <span className="eyebrow">INTELLIGENCE COMMERCIALE PROACTIVE</span>
        <h1>Ne pas prospecter au hasard. <span>Partir d’un signal.</span></h1>
        <p>La prospection inversée assistée par IA consiste à partir d’un événement ou d’une opportunité documentée, puis à rechercher les entreprises pour lesquelles ce signal peut avoir une pertinence réelle. MajestiOS vise à préparer une relation commerciale mieux informée, pas à multiplier les messages indifférenciés.</p>
        <div className="page-hero-meta"><span className="status-chip"><i />Méthode de prospection</span><span>Détecter · qualifier · identifier · contacter · apprendre</span></div>
      </section>
      <section className="content-panel">
        <span className="eyebrow">LE PRINCIPE</span><h2>La bonne cible se déduit d’un contexte, puis se vérifie.</h2>
        <p>Un appel d’offres, une attribution de marché, une implantation, un événement professionnel ou une évolution d’activité peuvent révéler une piste. Mais un signal n’est ni une preuve de besoin, ni une autorisation automatique de contacter. La qualification doit expliquer pourquoi l’entreprise est pertinente et ce qui reste à confirmer.</p>
        <div className="bodacc-principle-grid">
          <div><strong>Signal observable</strong><span>Une information datée et rattachée à une source identifiable.</span></div>
          <div><strong>Adéquation métier</strong><span>Un lien argumenté entre le signal et une offre ou compétence réelle.</span></div>
          <div><strong>Action proportionnée</strong><span>Une vérification, une introduction ou un contact adapté au contexte et aux règles applicables.</span></div>
        </div>
      </section>
      <section className="bodacc-section">
        <div className="section-heading"><span className="eyebrow">PARCOURS OPÉRATIONNEL</span><h2>De la détection au retour d’expérience.</h2><p>Chaque étape doit laisser une trace compréhensible et permettre de reprendre le dossier sans perdre le contexte.</p></div>
        <ol className="bodacc-steps">{stages.map((stage,index)=><li key={stage.title}><span>{String(index+1).padStart(2,"0")}</span><div><h3>{stage.title}</h3><p>{stage.text}</p></div></li>)}</ol>
      </section>
      <section className="content-panel">
        <span className="eyebrow">POINTS D’ENTRÉE</span><h2>Plusieurs signaux, une méthode commune.</h2>
        <div className="bodacc-signal-grid">
          <article className="bodacc-signal-card"><span className="bodacc-number">01</span><h3>Appels d’offres</h3><p>Analyser le périmètre et les exigences, repérer les entreprises pertinentes et étudier les besoins de compétences ou de sous-traitance sans les présumer.</p><div><Link href="/opportunites/marches-publics">Explorer les marchés publics <span>↗</span></Link></div></article>
          <article className="bodacc-signal-card"><span className="bodacc-number">02</span><h3>Événements économiques</h3><p>Mettre en contexte les créations, implantations et évolutions documentées pour déterminer si une piste mérite une vérification.</p><div><Link href="/business/intelligence-entreprises">Intelligence entreprises <span>↗</span></Link></div></article>
          <article className="bodacc-signal-card"><span className="bodacc-number">03</span><h3>Réseau professionnel</h3><p>Rechercher une complémentarité, une compétence ou une introduction utile, en respectant les attentes et les choix des personnes concernées.</p><div><Link href="/reseaux">Explorer les réseaux <span>↗</span></Link></div></article>
        </div>
      </section>
      <section className="content-panel bodacc-integrity"><span className="eyebrow">QUALITÉ ET CONFIANCE</span><h2>La pertinence prime sur le volume.</h2><ul><li>Ne pas présenter une hypothèse comme un besoin confirmé.</li><li>Conserver la source, la date, les critères de qualification et les raisons de la recommandation.</li><li>Éviter les doublons et les sollicitations répétées sans raison légitime.</li><li>Respecter les règles applicables aux données, à la prospection et aux demandes de non-contact.</li><li>Capitaliser sur les retours sans enfermer durablement une entreprise dans une étiquette ou un refus ponctuel.</li></ul></section>
      <section className="bodacc-next-actions"><div><span className="eyebrow">PASSER À L’ÉTAPE SUIVANTE</span><h2>Affiner le ciblage avant la prise de contact.</h2><p>Une démarche efficace commence par une offre claire, un périmètre pertinent et une hypothèse vérifiable.</p></div><div className="bodacc-next-links"><Link href="/developpement-commercial/prospection/ciblage">Méthode de ciblage <span>→</span></Link><Link href="/developpement-commercial/prospection/argumentaires">Préparer un argumentaire <span>→</span></Link><Link href="/developpement-commercial/prospection/suivi">Organiser le suivi <span>→</span></Link></div></section>
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/faq">Besoin d’aide ?</Link></footer>
    </div>
  </main>;
}
