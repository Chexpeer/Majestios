import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
 title: "Annuaire professionnel — MajestiOS",
 description: "Comprendre les critères nécessaires à un annuaire professionnel utile, vérifié et respectueux de la visibilité choisie par chaque profil."
};

const criteria = [
 {title:"Profil attribué",text:"Chaque profil doit être rattaché à une personne ou une organisation identifiable, avec une source et une date de mise à jour."},
 {title:"Compétences vérifiables",text:"Distinguer les compétences déclarées, les références fournies et les qualifications effectivement vérifiées."},
 {title:"Visibilité maîtrisée",text:"Définir ce qui est public, ce qui est accessible aux membres et ce qui ne peut être partagé qu’après accord."},
 {title:"Finalité de contact",text:"Associer les mises en relation à un motif professionnel clair et respecter les préférences de communication."}
];

export default function AnnuaireReseauPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">RÉSEAUX · ANNUAIRE PROFESSIONNEL</span><h1>Un annuaire utile repose sur <em>des profils fiables et contextualisés.</em></h1><p>Un répertoire ne vaut pas par le nombre de fiches, mais par la qualité des informations, leur actualité, la clarté des compétences et le respect des choix de visibilité des professionnels.</p></div></section>
  <section className="concept-principles"><span className="section-label">CRITÈRES DE QUALITÉ</span><h2>Ce qu’un profil doit permettre de comprendre.</h2><div className="results-list">{criteria.map((item,i)=><article className="result-card" key={item.title}><div className="result-main"><span className="result-category">CRITÈRE {String(i+1).padStart(2,"0")}</span><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></section>
  <section className="concept-principles"><h2>Pas d’annuaire fictif.</h2><p>L’annuaire consultable n’est pas annoncé comme ouvert tant que les profils, le contrôle des informations, les niveaux d’accès et les mécanismes de correction ou de suppression ne sont pas opérationnels. Cette page décrit les exigences fonctionnelles, sans inventer de membres ni exposer des coordonnées.</p><p>La mise en relation doit rester proportionnée : un profil public ne signifie pas que son titulaire a accepté toute sollicitation, ni qu’il existe une relation commerciale en cours.</p><p><Link href="/reseaux/rejoindre">Découvrir comment contribuer au réseau →</Link></p></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/reseaux">Réseautage intelligent</Link><Link href="/confidentialite">Confidentialité</Link></footer>
 </main>;
}
