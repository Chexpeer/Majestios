import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Préparer la cession d’une entreprise — MajestiOS", description: "Organiser les informations et les étapes d’une transmission d’entreprise en protégeant la confidentialité." };

const steps = [
 {title:"Clarifier les objectifs et le calendrier",text:"Définir les raisons du projet, l’horizon envisagé, le rôle du dirigeant après la cession et les contraintes de continuité d’activité."},
 {title:"Préparer une documentation fiable",text:"Rassembler les éléments financiers, commerciaux, opérationnels et juridiques utiles, en distinguant les chiffres validés des estimations."},
 {title:"Identifier les facteurs de dépendance",text:"Documenter les relations clients et fournisseurs, les personnes clés, les contrats, les équipements et les savoir-faire dont dépend l’activité."},
 {title:"Encadrer la confidentialité",text:"Définir quelles informations peuvent être partagées, avec qui, à quel stade et sous quelles conditions. Éviter de publier des données sensibles dans une annonce générale."},
 {title:"Préparer les échanges et les vérifications",text:"Anticiper les questions d’un repreneur et prévoir un examen professionnel des conséquences juridiques, fiscales, sociales et financières."}
];

export default function VendreEntreprisePage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">ACHAT ET CESSION · TRANSMISSION</span><h1>Préparer une cession, c’est <em>préparer une transmission maîtrisée.</em></h1><p>La qualité de la préparation facilite la compréhension de l’activité et réduit les incertitudes évitables. Elle ne garantit ni un prix, ni un délai, ni la réalisation de la cession.</p></div></section>
  <section className="concept-principles"><span className="section-label">PRÉPARER LE PROJET</span><h2>Cinq chantiers à organiser.</h2><ol className="bodacc-steps">{steps.map((s,i)=><li key={s.title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{s.title}</h3><p>{s.text}</p></div></li>)}</ol></section>
  <section className="concept-principles"><h2>La confidentialité est une condition de confiance.</h2><p>Une cession peut concerner des informations stratégiques sur les clients, les équipes, les prix et les contrats. Leur partage doit être limité au strict nécessaire et organisé avec des interlocuteurs autorisés.</p><p><strong>État du service :</strong> cette page décrit une méthode de préparation. Elle ne publie pas d’annonces de cession et ne met pas automatiquement en relation vendeurs et repreneurs.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/business/achat-cession/evaluer-une-entreprise">Comprendre la valeur de l’entreprise ↗</Link><Link className="search-submit concept-cta" href="/business/achat-cession">Retour au parcours reprise / cession ↗</Link></div></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/business/veille-bodacc">Veille économique</Link><Link href="/faq">FAQ</Link></footer>
 </main>;
}
