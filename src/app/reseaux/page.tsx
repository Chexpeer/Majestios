import Link from "next/link";
import SiteHeader from "@/components/navigation/site-header";
import SiteFooter from "@/components/navigation/site-footer";

export const metadata = {
  title: "Réseaux professionnels — MajestiOS",
  description: "Découvrez la vision MajestiOS pour relier entreprises, interlocuteurs, décideurs et partenaires professionnels.",
};

const pillars = [
  { number: "01", title: "Entreprises", text: "Structurer les informations utiles sur les organisations : activité, secteur, localisation, événements publiés et relations professionnelles, avec une provenance identifiable." },
  { number: "02", title: "Interlocuteurs", text: "Organiser les informations professionnelles disponibles sur les personnes en lien avec une entreprise, en tenant compte de leur pertinence, de leur actualité et des règles d'utilisation." },
  { number: "03", title: "Décideurs", text: "Aider à comprendre qui intervient dans une décision commerciale lorsque des informations fiables sont disponibles, sans inventer de fonction ni présenter une déduction comme un fait." },
  { number: "04", title: "Partenariats", text: "Préparer à terme la découverte de fournisseurs, partenaires et possibilités de collaboration, avec des demandes de mise en relation explicites et contrôlées." },
];

export default function NetworksPage() {
  return <main className="public-site concept-page">
    <SiteHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">RÉSEAUX PROFESSIONNELS</span>
      <h1>Comprendre les relations pour <em>mieux agir.</em></h1>
      <p>MajestiOS vise à relier la connaissance des entreprises à celle des interlocuteurs, des décideurs et des partenaires. L&apos;objectif n&apos;est pas de multiplier les contacts, mais de mieux comprendre le contexte d&apos;une relation commerciale.</p>
    </div></section>
    <section className="network-intro"><span className="section-label">LE MODÈLE MAJESTIOS</span><h2>Entreprise <span>→</span> Interlocuteur <span>→</span> Décideur</h2><p>Ce modèle doit permettre de passer d&apos;une information sur une organisation à une démarche commerciale mieux préparée. Chaque relation devra être justifiée par des données accessibles, contextualisées et suffisamment fiables.</p></section>
    <section className="concept-grid" aria-label="Piliers des réseaux professionnels">
      {pillars.map(item => <article key={item.number}><span>{item.number}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}
    </section>
    <section className="concept-principles"><h2>Un domaine en construction</h2><p>Cette page présente la cible fonctionnelle. Elle ne constitue pas encore un annuaire opérationnel ni un service de mise en relation. Les recherches, profils, relations et permissions devront être développés et testés avant d&apos;être annoncés comme disponibles.</p><Link className="search-submit concept-cta" href="/comment-et-pourquoi">Découvrir le fonctionnement</Link></section>
    <SiteFooter />
  </main>;
}
