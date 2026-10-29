import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
 title: "Réseautage professionnel intelligent — MajestiOS",
 description: "Relier entreprises, compétences et opportunités autour d’un motif de collaboration clair, avec une qualification et un contact respectueux."
};

const steps = [
 {n:"01",title:"Définir le besoin ou l’apport",text:"Préciser ce que l’entreprise recherche ou peut apporter : compétence, capacité, connaissance d’un secteur, sous-traitance, partenariat ou retour d’expérience."},
 {n:"02",title:"Identifier une complémentarité",text:"Relier les profils à partir d’éléments professionnels pertinents et vérifiables, pas seulement d’un intitulé, d’une proximité ou d’une liste de contacts."},
 {n:"03",title:"Vérifier le contexte",text:"Contrôler l’actualité de l’information, le rôle de l’interlocuteur et la raison pour laquelle une mise en relation pourrait être utile."},
 {n:"04",title:"Proposer une mise en relation",text:"Expliquer le motif du contact et laisser aux personnes concernées le choix d’accepter, de refuser ou de demander des précisions."},
 {n:"05",title:"Capitaliser avec mesure",text:"Documenter la suite convenue et les résultats professionnels utiles, en respectant les préférences de communication et les règles de conservation."}
];

export default function ReseauxPage() {
 return <main className="public-site concept-page domain-reseaux"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">MAJESTIOS · RÉSEAUX PROFESSIONNELS</span><h1>Le bon contact, <em>pour la bonne raison, au bon moment.</em></h1><p>Le réseautage intelligent ne consiste pas à accumuler des coordonnées. Il consiste à comprendre les besoins et les capacités, à repérer une complémentarité crédible, puis à proposer une mise en relation contextualisée et respectueuse du choix de chacun.</p><div className="hero-actions"><Link className="button-primary" href="/reseaux/rejoindre">Découvrir comment rejoindre le réseau <span aria-hidden="true">→</span></Link><Link className="button-secondary" href="/opportunites/salons">Préparer les rencontres en salon</Link></div></div></section>
  <section className="concept-principles"><span className="section-label">LA MÉTHODE DE MISE EN RELATION</span><h2>De la complémentarité à une action utile.</h2><ol className="bodacc-steps">{steps.map(s=><li key={s.n}><span>{s.n}</span><div><h3>{s.title}</h3><p>{s.text}</p></div></li>)}</ol></section>
  <section className="concept-principles"><span className="section-label">EXEMPLES DE COMPLÉMENTARITÉS</span><h2>Le réseau prend de la valeur quand il répond à un besoin concret.</h2><div className="bodacc-principle-grid"><div><strong>Renfort de capacité</strong><span>Une entreprise identifie un besoin de sous-traitance possible ; cette piste doit être confirmée avant de la présenter comme une demande réelle.</span></div><div><strong>Compétence complémentaire</strong><span>Deux professionnels peuvent étudier une coopération si les compétences, disponibilités et responsabilités sont clairement établies.</span></div><div><strong>Rencontre sectorielle</strong><span>Un salon ou un événement peut offrir un contexte de contact ; la présence d’un acheteur ou un besoin précis ne doit pas être présumé.</span></div><div><strong>Transmission de savoir-faire</strong><span>Un profil expérimenté peut apporter un conseil ou une expertise lorsque l’objectif et les modalités sont convenus.</span></div></div></section>
  <section className="concept-principles"><h2>Un réseau fondé sur la confiance.</h2><p>Les coordonnées et informations professionnelles ne doivent pas être exposées sans base légitime. Le motif de contact doit être transparent, les données limitées au nécessaire et les préférences de communication respectées. Un signal commercial ne vaut ni consentement au démarchage ni preuve d’un besoin d’achat.</p><p><strong>État actuel :</strong> cette page décrit la doctrine de réseautage de MajestiOS. Elle ne prétend pas qu’un annuaire complet, un moteur de matching ou un système automatisé de mise en relation est déjà actif.</p></section>
  <section className="concept-principles"><h2>Choisir la suite.</h2><div className="results-list"><article className="result-card"><div className="result-main"><h3>Rejoindre le réseau</h3><p>Comprendre les profils recherchés et les principes de contribution.</p></div><div className="result-actions"><Link className="result-action" href="/reseaux/rejoindre">Découvrir le parcours →</Link></div></article><article className="result-card"><div className="result-main"><h3>Annuaire professionnel</h3><p>Le répertoire ne doit être ouvert que lorsque les profils et les règles d’accès sont définis.</p></div><div className="result-actions"><Link className="result-action" href="/reseaux/annuaire">Consulter l’état de l’annuaire →</Link></div></article></div></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/opportunites">Opportunités</Link><Link href="/faq">FAQ</Link></footer>
 </main>;
}
