import Link from "next/link";
import SiteHeader from "@/components/navigation/site-header";
import SiteFooter from "@/components/navigation/site-footer";

export const metadata = {
  title: "Espace membre — MajestiOS",
  description: "Accès à l'espace professionnel MajestiOS et état des fonctions de compte en préparation.",
};

export default function MemberPage() {
  return <main className="public-site concept-page">
    <SiteHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">ESPACE MEMBRE</span>
      <h1>Votre espace professionnel <em>MajestiOS.</em></h1>
      <p>À terme, cet espace réunira vos opportunités enregistrées, vos recherches, vos contacts et vos activités commerciales dans un environnement organisé par compte et par organisation.</p>
    </div></section>
    <section className="concept-grid">
      <article><span>01 · PROFIL</span><h2>Mon profil professionnel</h2><p>Informations de profil et rattachement à une organisation, selon les droits attribués.</p><span className="feature-status">Prévu — non disponible</span></article>
      <article><span>02 · OPPORTUNITÉS</span><h2>Mes opportunités</h2><p>À terme : enregistrer des résultats, conserver les sources et retrouver les opportunités à examiner.</p><span className="feature-status">Prévu — non disponible</span></article>
      <article><span>03 · SUIVI</span><h2>Mon suivi commercial</h2><p>À terme : organiser les contacts, tâches, rendez-vous et prochaines actions.</p><span className="feature-status">Prévu — non disponible</span></article>
      <article><span>04 · MÉMOIRE</span><h2>Ma mémoire d'entreprise</h2><p>À terme : retrouver les informations et comptes rendus autorisés liés à l&apos;activité de votre organisation.</p><span className="feature-status">Prévu — non disponible</span></article>
    </section>
    <section className="concept-principles"><h2>Pourquoi l&apos;accès n&apos;est-il pas encore ouvert ?</h2><p>La création de compte, la connexion et la protection des données doivent être raccordées à un système d'authentification et à des règles d&apos;accès testées. Cette page n&apos;enregistre aucun compte et ne demande aucun mot de passe.</p><div className="faq-actions"><Link className="search-submit concept-cta" href="/aide/faq">Consulter la FAQ</Link><Link className="faq-secondary" href="/nous-rejoindre">Découvrir Nous rejoindre</Link></div></section>
    <SiteFooter />
  </main>;
}
