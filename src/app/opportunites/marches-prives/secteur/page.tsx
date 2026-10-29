import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
 title: "Marchés privés par secteur — MajestiOS",
 description: "Qualifier les opportunités privées par activité, source, degré de confirmation et adéquation avec l’entreprise."
};

const checks = [
 {title:"Activité et périmètre",text:"Identifier le secteur, la prestation ou la fourniture concernée, les compétences requises et les limites du besoin publié."},
 {title:"Statut de l’information",text:"Distinguer une consultation explicite d’une annonce commerciale, d’une relation de sous-traitance possible ou d’une hypothèse à vérifier."},
 {title:"Compatibilité de l’entreprise",text:"Évaluer les capacités, les références, la zone d’intervention, les délais et les contraintes avant de mobiliser des ressources."},
 {title:"Prochaine action proportionnée",text:"Choisir entre vérifier, demander une précision, préparer une prise de contact ou écarter la piste si elle n’est pas suffisamment étayée."}
];

export default function MarchesPrivesSecteurPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">OPPORTUNITÉS · MARCHÉS PRIVÉS</span><h1>Le secteur donne un contexte, <em>pas une preuve de besoin.</em></h1><p>Le classement sectoriel aide à organiser la veille, mais ne suffit pas à établir qu’un acheteur cherche un prestataire. Chaque piste doit conserver sa source, sa date, son degré de confirmation et les éléments encore inconnus.</p></div></section>
  <section className="concept-principles"><span className="section-label">QUALIFICATION SECTORIELLE</span><h2>Quatre contrôles avant de se positionner.</h2><ol className="bodacc-steps">{checks.map((d,i)=><li key={d.title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{d.title}</h3><p>{d.text}</p></div></li>)}</ol></section>
  <section className="concept-principles"><h2>Ne pas confondre signal et commande.</h2><p>Une entreprise qui ouvre un chantier, change d’adresse ou remporte un marché peut présenter une piste de prospection, mais cela ne prouve pas un besoin d’achat ou de sous-traitance. MajestiOS doit expliciter cette incertitude et ne diffuser une consultation privée que si la source et le droit de diffusion le permettent.</p><p>Cette page présente la méthode de qualification. Elle ne signifie pas que l’ensemble des sources privées est connecté ou que chaque secteur dispose d’annonces actives.</p><p><Link href="/opportunites/marches-prives">Vue d’ensemble des marchés privés →</Link></p></section>
  <section className="concept-principles">
   <span className="section-label">CROISER LES SIGNAUX</span>
   <h2>Relier le secteur à une piste vérifiable.</h2>
   <p>Le secteur aide à cadrer la recherche ; il faut ensuite confronter la piste à une source, à une entreprise identifiable et à un motif commercial réel.</p>
   <div className="route-actions">
    <Link className="search-submit concept-cta" href="/opportunites/marches-publics">Comparer avec les marchés publics ↗</Link>
    <Link className="search-submit concept-cta" href="/business/veille-bodacc">Examiner les signaux BODACC ↗</Link>
    <Link className="search-submit concept-cta" href="/developpement-commercial/prospection/ciblage">Définir les critères de ciblage ↗</Link>
   </div>
  </section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/developpement-commercial/prospection">Méthode de prospection</Link><Link href="/faq">FAQ</Link></footer>
 </main>;
}
