import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Offres d’emploi vérifiées — MajestiOS",
  description: "Explorer les offres d’emploi avec une lecture structurée de la source, du poste, du contrat et des critères de candidature."
};

const checks = [
  { title: "Fiabilité de l’annonce", text: "Identifier l’employeur ou le recruteur, retrouver la publication d’origine et contrôler la date ainsi que le statut de l’offre." },
  { title: "Compatibilité du poste", text: "Lire les missions, les compétences indispensables, le niveau d’expérience, le lieu, le rythme de travail et le type de contrat." },
  { title: "Conditions et échéances", text: "Repérer la rémunération lorsqu’elle est communiquée, les horaires, les déplacements éventuels et les modalités de candidature." }
];

export default function OffresEmploiPage() {
  return <main className="site-page"><PublicHeader /><div className="page-container">
    <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span><b>/</b><Link href="/opportunites">Opportunités</Link></span><span><b>/</b><Link href="/opportunites/emploi">Emploi et missions</Link></span><span><b>/</b><strong>Offres d’emploi</strong></span></nav>
    <section className="page-hero bodacc-hero"><span className="eyebrow">MAJESTIOS · EMPLOI</span><h1>Des offres lisibles, <span>des candidatures mieux préparées.</span></h1><p>Une annonce doit permettre de comprendre le poste, son émetteur et les conditions avant de mobiliser du temps pour candidater. MajestiOS vise à organiser cette lecture et à distinguer les informations vérifiées des éléments encore à confirmer.</p><div className="page-hero-meta"><span className="status-chip"><i />Source et conditions à contrôler</span><span>Aucune annonce fictive n’est affichée comme réelle.</span></div></section>
    <section className="content-panel"><span className="eyebrow">LECTURE D’UNE OFFRE</span><h2>Trois contrôles avant de candidater.</h2><div className="bodacc-principle-grid">{checks.map((item)=><div key={item.title}><strong>{item.title}</strong><span>{item.text}</span></div>)}</div></section>
    <section className="content-panel"><span className="eyebrow">ÉTAT DU SERVICE</span><h2>Un catalogue seulement lorsque les données sont disponibles.</h2><p>Cette page décrit la méthode de qualification. Les offres ne doivent apparaître que si leur source, leur date et leur statut peuvent être contrôlés. Tant qu’un flux d’offres vérifiées n’est pas connecté, l’absence de résultats doit être annoncée clairement plutôt que compensée par des exemples inventés.</p><p>Le dépôt de CV nécessite un parcours distinct avec finalité définie, accès restreints, durée de conservation et règles de suppression. Aucun document personnel ne doit être collecté par un formulaire provisoire non sécurisé.</p></section>
    <section className="bodacc-next-actions"><div><span className="eyebrow">AUTRES PARCOURS</span><h2>Choisir le bon type d’opportunité.</h2><p>Une offre d’emploi et une mission professionnelle ne répondent pas aux mêmes critères.</p></div><div className="bodacc-next-links"><Link href="/opportunites/emploi/missions">Missions professionnelles <span>→</span></Link><Link href="/opportunites/emploi">Vue d’ensemble emploi <span>→</span></Link><Link href="/developpement-commercial/prospection">Développement commercial <span>→</span></Link></div></section>
    <footer className="page-footer"><span>MAJESTIOS · INFORMATION VÉRIFIÉE AVANT ACTION</span><Link href="/faq">Besoin d’aide ?</Link></footer>
  </div></main>;
}
