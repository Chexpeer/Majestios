import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Créations et implantations d’entreprises — MajestiOS",
  description: "Méthode MajestiOS pour comprendre les créations d’entreprises et nouvelles implantations, vérifier les signaux et qualifier des pistes commerciales."
};

const checks = [
  { title: "Confirmer l’existence du signal", text: "Identifier la publication ou le registre d’origine, vérifier la date et distinguer la date de l’événement de celle de sa diffusion." },
  { title: "Identifier la bonne entité", text: "Comparer les identifiants disponibles, la dénomination, l’adresse et l’activité. Une enseigne, un établissement et une société ne sont pas nécessairement la même entité." },
  { title: "Comprendre le contexte local", text: "Examiner le territoire, l’activité déclarée, la nature de l’implantation et les informations complémentaires accessibles de façon licite." },
  { title: "Évaluer la pertinence métier", text: "Relier le signal à une offre, une compétence ou une zone de service précise. Une ouverture ne prouve pas qu’un achat ou un prestataire est recherché." },
  { title: "Choisir une suite proportionnée", text: "Selon le niveau de preuve, approfondir la recherche, préparer une mise en relation pertinente ou différer la prise de contact." }
];

export default function CreationsImplantationsPage() {
  return <main className="site-page">
    <PublicHeader />
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span><b>/</b><Link href="/business">Business</Link></span><span><b>/</b><Link href="/business/intelligence-entreprises">Intelligence entreprises</Link></span><span><b>/</b><strong>Créations et implantations</strong></span></nav>
      <section className="page-hero bodacc-hero">
        <span className="eyebrow">BRAINIOS · SIGNAUX TERRITORIAUX</span>
        <h1>Voir ce qui s’installe, <span>comprendre ce qui change.</span></h1>
        <p>Une création ou une nouvelle implantation peut ouvrir une piste de développement commercial. MajestiOS doit aider à comprendre le signal, à vérifier l’entreprise concernée et à déterminer si une action est réellement pertinente.</p>
        <div className="page-hero-meta"><span className="status-chip"><i />Qualification territoriale</span><span>Signal vérifié · contexte local · hypothèse métier</span></div>
      </section>
      <section className="content-panel">
        <span className="eyebrow">POURQUOI C’EST UTILE</span><h2>Une implantation est un indice, pas une commande.</h2>
        <p>Une entreprise qui démarre ou s’installe peut devoir organiser ses locaux, ses équipements, ses fournitures, ses services ou son recrutement. Ces possibilités dépendent de son activité, de sa taille, de son calendrier et de ce qu’elle a déjà prévu. MajestiOS ne doit donc pas transformer automatiquement chaque création en prospect qualifié.</p>
        <div className="bodacc-principle-grid">
          <div><strong>Ce qui est établi</strong><span>La création ou l’implantation attestée par une source identifiable.</span></div>
          <div><strong>Ce qui reste à vérifier</strong><span>La réalité opérationnelle, le périmètre d’activité et l’actualité du signal.</span></div>
          <div><strong>Ce qui peut être envisagé</strong><span>Une piste de service ou de mise en relation justifiée par le contexte.</span></div>
        </div>
      </section>
      <section className="bodacc-section">
        <div className="section-heading"><span className="eyebrow">PROTOCOLE DE QUALIFICATION</span><h2>Cinq vérifications avant d’agir.</h2><p>Une méthode commune évite les confusions d’identité, les contacts prématurés et les conclusions commerciales sans preuve.</p></div>
        <ol className="bodacc-steps">{checks.map((item,index)=><li key={item.title}><span>{String(index+1).padStart(2,"0")}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol>
      </section>
      <section className="content-panel">
        <span className="eyebrow">PISTES À CROISER</span><h2>Donner du relief au signal.</h2>
        <p>Lorsque les règles d’accès et de réutilisation le permettent, BrainiOS peut rapprocher une création d’autres informations documentées : activité déclarée, implantation géographique, événements professionnels, consultations pertinentes ou compétences disponibles dans le réseau. Chaque rapprochement doit garder sa provenance et son degré d’incertitude.</p>
        <ul><li>Ne pas confondre la date administrative et le début réel de l’activité.</li><li>Ne pas déduire les moyens financiers, les intentions d’achat ou les difficultés d’une entreprise sans preuve.</li><li>Privilégier une prochaine étape utile et mesurée plutôt qu’un démarchage automatique.</li></ul>
      </section>
      <section className="bodacc-next-actions"><div><span className="eyebrow">POURSUIVRE</span><h2>Relier le territoire à l’action commerciale.</h2><p>La piste devient utile lorsqu’elle correspond à une offre réelle et qu’elle peut être vérifiée.</p></div><div className="bodacc-next-links"><Link href="/business/intelligence-entreprises">Intelligence entreprises <span>→</span></Link><Link href="/business/veille-bodacc">Veille BODACC <span>→</span></Link><Link href="/developpement-commercial/prospection/ciblage">Ciblage commercial <span>→</span></Link></div></section>
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/faq">Besoin d’aide ?</Link></footer>
    </div>
  </main>;
}
