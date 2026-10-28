import Link from "next/link";
import PublicHeader from "@/components/public-header";
import AnnouncementTicker from "@/components/announcement-ticker";
import MajestiOSOpportunityMap from "@/components/majestic-opportunity-map";

export const metadata = {
  title: "MajestiOS — Intelligence commerciale proactive",
  description: "Détecter, qualifier et transformer les opportunités commerciales grâce à une navigation structurée et des sources vérifiables."
};

const pillars = [
  { number: "01", title: "Détecter", text: "Faire émerger des marchés, des entreprises et des signaux pertinents." },
  { number: "02", title: "Qualifier", text: "Vérifier la source, le contexte et l’adéquation avec votre activité." },
  { number: "03", title: "Transformer", text: "Préparer une prise de contact et capitaliser sur chaque retour." }
];

export default function HomePage() {
  return <main className="home-redesign">
    <PublicHeader />
    <AnnouncementTicker />
    <section className="home-hero-redesign">
      <div className="hero-copy">
        <span className="eyebrow"><i /> INTELLIGENCE COMMERCIALE PROACTIVE</span>
        <h1>Le réseautage intelligent au service de votre développement commercial<span>.</span></h1>
        <p>Nous ne nous contentons pas de signaler des opportunités. MajestiOS associe l’IA et l’expertise de business developers pour qualifier les besoins, identifier les interlocuteurs pertinents et faciliter les connexions commerciales qui peuvent devenir des affaires.</p>
        <div className="hero-actions"><Link className="button-primary" href="/opportunites">Explorer les opportunités <span>↗</span></Link><Link className="button-secondary" href="/comprendre/concept">Comprendre la démarche</Link></div>
        <div className="hero-trust"><span className="trust-mark">✓</span><span><strong>La source avant l’affirmation.</strong><small>Pas d’annonce fictive présentée comme réelle.</small></span></div>
      </div>
      <div className="hero-visual" aria-label="Le parcours MajestiOS"><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="visual-core"><span>✦</span><strong>M</strong><small>MAJESTIOS</small></div><div className="visual-node node-one">DÉTECTER</div><div className="visual-node node-two">QUALIFIER</div><div className="visual-node node-three">TRANSFORMER</div></div>
    </section>
    <section className="mission-strip"><span className="eyebrow">LE PARCOURS</span><div>{["Détecter","Qualifier","Identifier","Contacter","Transformer","Capitaliser"].map((step,index)=><span key={step}><b>{String(index+1).padStart(2,"0")}</b>{step}{index<5?<i>→</i>:null}</span>)}</div></section>
    <section className="home-map-section"><div className="section-heading"><span className="eyebrow">EXPLORER PAR BESOIN</span><h2>Un point d’entrée. <em>Plusieurs chemins.</em></h2><p>Chaque pôle ouvre sa propre rubrique, puis ses sous-rubriques et ses pages de détail.</p></div><MajestiOSOpportunityMap /></section>
    <section className="pillars-section"><div className="section-heading"><span className="eyebrow">LE RÉSEAUTAGE INTELLIGENT</span><h2>De l’information à <em>la relation d’affaires.</em></h2></div><div className="pillars-grid">{pillars.map((pillar)=><article className="pillar-card" key={pillar.number}><span>{pillar.number}</span><h3>{pillar.title}</h3><p>{pillar.text}</p></article>)}</div></section>
    <footer className="redesign-footer"><Link href="/" className="footer-brand">MajestiOS</Link><span>© MajestiOS · Version de refonte indépendante</span><nav><Link href="/comprendre/faq">FAQ</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/mentions-legales">Mentions légales</Link></nav></footer>
  </main>;
}
