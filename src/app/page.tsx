import Link from "next/link";

const metrics = [
  { label: "Opportunités suivies", value: "—", note: "Données à connecter" },
  { label: "Entreprises ciblées", value: "—", note: "Votre portefeuille" },
  { label: "Actions commerciales", value: "—", note: "Votre activité" },
];
const steps = [
  { number: "01", title: "Détecter", text: "Centralisez les opportunités professionnelles issues de sources identifiées." },
  { number: "02", title: "Qualifier", text: "Reliez les besoins aux entreprises et aux interlocuteurs pertinents." },
  { number: "03", title: "Agir", text: "Transformez vos pistes en actions commerciales traçables." },
];

export default function HomePage() {
  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Navigation principale">
        <Link className="brand" href="/" aria-label="MajestiOS, accueil">
          <span className="brand-mark">M</span><span><strong>MajestiOS</strong><small>INTELLIGENCE COMMERCIALE</small></span>
        </Link>
        <div className="nav-caption">ESPACE PROFESSIONNEL</div>
        <nav className="navigation">
          <a className="nav-item active" href="#overview"><span>◫</span> Vue d’ensemble</a>
          <a className="nav-item" href="#opportunities"><span>⌕</span> Opportunités</a>
          <a className="nav-item" href="#companies"><span>▦</span> Entreprises</a>
          <a className="nav-item" href="#contacts"><span>♙</span> Interlocuteurs</a>
          <a className="nav-item" href="#activities"><span>↗</span> Activités commerciales</a>
          <a className="nav-item" href="#knowledge"><span>◈</span> Connaissance d’entreprise</a>
        </nav>
        <div className="sidebar-bottom"><span className="status-dot" /><div><strong>Socle applicatif</strong><small>Première version en construction</small></div></div>
      </aside>
      <section className="main-panel" id="overview">
        <header className="topbar">
          <div className="breadcrumb">MajestiOS <span>/</span> Vue d’ensemble</div>
          <div className="profile"><span className="avatar">P</span><span><strong>Espace de démonstration</strong><small>Mode prototype</small></span></div>
        </header>
        <div className="content">
          <div className="eyebrow"><span className="eyebrow-line" /> PLATEFORME COLLABORATIVE D’INTELLIGENCE COMMERCIALE</div>
          <div className="hero-row">
            <div><h1>Les opportunités<br /><em>deviennent des actions.</em></h1><p className="intro">Détectez les signaux commerciaux, identifiez les bons interlocuteurs et organisez votre prospection depuis un espace de travail unique.</p></div>
            <div className="hero-symbol" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="symbol-core">M</div><span className="node node-one" /><span className="node node-two" /><span className="node node-three" /></div>
          </div>
          <div className="notice" role="note"><span className="notice-icon">i</span><p><strong>Prototype initial</strong> — cette interface est une base de travail. Les chiffres, comptes et données commerciales ne sont pas encore connectés à une base réelle.</p></div>
          <section className="metrics" aria-label="Indicateurs">{metrics.map((metric) => <article className="metric-card" key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.note}</small></article>)}</section>
          <section className="section-block" id="opportunities">
            <div className="section-heading"><div><span className="section-kicker">LE CYCLE COMMERCIAL</span><h2>De la détection à l’action</h2></div><span className="phase-badge">Fondations du MVP</span></div>
            <div className="steps-grid">{steps.map((step) => <article className="step-card" key={step.number}><span className="step-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p><span className="step-arrow" aria-hidden="true">↗</span></article>)}</div>
          </section>
          <section className="section-block pillars" id="companies">
            <div className="section-heading"><div><span className="section-kicker">LE MODÈLE MÉTIER</span><h2>Relier les informations utiles</h2></div></div>
            <div className="relationship">
              <div className="relationship-item"><span className="relation-icon">▦</span><strong>Entreprise</strong><small>Marché et organisation</small></div><span className="relation-arrow">→</span>
              <div className="relationship-item"><span className="relation-icon">♙</span><strong>Interlocuteur</strong><small>Contact professionnel</small></div><span className="relation-arrow">→</span>
              <div className="relationship-item"><span className="relation-icon">◎</span><strong>Décideur</strong><small>Rôle à qualifier</small></div>
            </div>
          </section>
          <section className="section-block" id="contacts">
            <div className="section-heading"><div><span className="section-kicker">RELATIONS COMMERCIALES</span><h2>Interlocuteurs et décideurs</h2></div><span className="phase-badge">Module à connecter</span></div>
            <div className="module-panel">
              <div className="module-copy"><span className="module-icon">♙</span><div><h3>Qualifier les personnes, pas seulement les entreprises</h3><p>Préparer un contact commercial implique de distinguer l’interlocuteur, sa fonction, son influence et son rôle dans une décision. Les informations devront être sourcées et leur niveau de fiabilité explicite.</p></div></div>
              <div className="module-points"><span>Fonction et rôle à confirmer</span><span>Source et date de vérification</span><span>Historique des interactions</span></div>
            </div>
          </section>
          <section className="section-block" id="activities">
            <div className="section-heading"><div><span className="section-kicker">EXÉCUTION ET SUIVI</span><h2>Activités commerciales</h2></div><span className="phase-badge">Module à connecter</span></div>
            <div className="activity-grid">
              <article className="activity-card"><span className="activity-label">01 · PRÉPARER</span><h3>Prochaine action</h3><p>Définir une action de suivi liée à une opportunité ou à un interlocuteur.</p><small>Agenda et tâches non connectés</small></article>
              <article className="activity-card"><span className="activity-label">02 · TRACER</span><h3>Historique d’activité</h3><p>Conserver les appels, rendez-vous, notes et décisions dans une chronologie lisible.</p><small>Aucune activité réelle enregistrée</small></article>
              <article className="activity-card"><span className="activity-label">03 · APPRENDRE</span><h3>Retour terrain</h3><p>Capitaliser les résultats, objections et signaux utiles pour améliorer les prochaines actions.</p><small>Workflow de clôture à construire</small></article>
            </div>
          </section>
          <section className="section-block" id="knowledge">
            <div className="section-heading"><div><span className="section-kicker">MÉMOIRE D’ENTREPRISE</span><h2>Connaissance commerciale capitalisée</h2></div><span className="phase-badge">Fondation prévue</span></div>
            <div className="knowledge-panel">
              <div><span className="knowledge-mark">◈</span><h3>Une mémoire exploitable et traçable</h3><p>Les informations utiles devront être organisées, datées et reliées à leur contexte : ce qui est connu, ce qui reste incertain et ce qui doit être vérifié.</p></div>
              <div className="knowledge-status"><strong>Règle de conception</strong><p>Une hypothèse produite par l’IA ne devient pas automatiquement une opportunité commerciale validée. Une décision humaine doit pouvoir être tracée.</p></div>
            </div>
          </section>
          <footer className="footer"><span>MajestiOS · Architecture applicative V0.1</span><span>Une base de travail — pas encore un service connecté</span></footer>
        </div>
      </section>
    </main>
  );
}
