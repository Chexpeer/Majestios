import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Préparer un salon professionnel — MajestiOS",
  description: "Préparer une visite de salon comme une action de développement commercial : objectifs, interlocuteurs, qualification et suivi."
};

const phases = [
  { title: "Avant : décider ce que l’on cherche", items: ["Choisir un objectif prioritaire : rencontrer des acheteurs, identifier des fournisseurs, rechercher des sous-traitants ou observer un marché.", "Définir les secteurs, fonctions et types d’organisation pertinents.", "Préparer une présentation courte de son offre, des références vérifiables et des questions ouvertes.", "Vérifier les dates, le lieu, les conditions d’accès et les éventuelles modalités de rendez-vous auprès de l’organisateur."] },
  { title: "Pendant : qualifier, sans présumer", items: ["Noter le contexte professionnel et les besoins réellement exprimés, en distinguant les faits de ses propres interprétations.", "Demander l’autorisation avant de conserver ou réutiliser des coordonnées personnelles.", "Clarifier le rôle de l’interlocuteur, le calendrier, les critères de décision et la prochaine étape si un intérêt est confirmé.", "Ne pas considérer une carte de visite ou une conversation cordiale comme une opportunité commerciale validée."] },
  { title: "Après : transformer la rencontre en suite utile", items: ["Envoyer un message de suivi qui rappelle le contexte réel de l’échange.", "Respecter les engagements pris et les préférences de contact exprimées.", "Classer les résultats : suite convenue, information à vérifier, veille future ou absence de suite.", "Évaluer les retombées par rapport à l’objectif initial, pas uniquement au nombre de contacts collectés."] }
];

export default function PreparerSalonPage() {
  return <main className="public-site concept-page"><PublicHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">DÉVELOPPEMENT COMMERCIAL · SALONS</span>
      <h1>Faire d’un salon <em>une démarche commerciale préparée.</em></h1>
      <p>Un salon devient utile lorsque la visite répond à un objectif, que les échanges sont qualifiés et que les suites sont organisées. Le nombre de cartes de visite ne mesure pas à lui seul la valeur commerciale d’un événement.</p>
      <div className="hero-actions"><Link className="button-primary" href="/opportunites/salons/calendrier">Consulter le calendrier <span aria-hidden="true">→</span></Link><Link className="button-secondary" href="/developpement-commercial/prospection">Méthode de prospection</Link></div>
    </div></section>
    {phases.map((phase, index) => <section className="concept-principles" key={phase.title}><span className="section-label">ÉTAPE {String(index + 1).padStart(2, "0")}</span><h2>{phase.title}</h2><ul>{phase.items.map(item => <li key={item}>{item}</li>)}</ul></section>)}
    <section className="concept-principles"><span className="section-label">PRINCIPE MAJESTIOS</span><h2>Le salon est un signal, pas une garantie de marché.</h2><p>La présence d’une entreprise à un événement ne prouve ni son intention d’achat, ni l’existence d’un besoin de sous-traitance. Toute opportunité doit être confirmée à partir de faits et d’un échange approprié. Cette page décrit une méthode de travail ; elle ne signifie pas qu’un service automatisé d’inscription, de prise de rendez-vous ou de CRM événementiel est déjà activé.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/opportunites/salons/secteur">Explorer par secteur ↗</Link><Link className="search-submit concept-cta" href="/opportunites/salons/region">Explorer par région ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/prospection/suivi">Organiser le suivi commercial ↗</Link></div></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/opportunites/salons">Salons professionnels</Link><Link href="/faq">FAQ</Link></footer>
  </main>;
}
