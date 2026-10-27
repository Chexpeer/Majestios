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
        <a className="brand" href="/" aria-label="MajestiOS, accueil">
          <span className="brand-mark">M</span><span><strong>MajestiOS</strong><small>INTELLIGENCE COMMERCIALE</small></span>
        </a>
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
          <footer className="footer"><span>MajestiOS · Architecture applicative V0.1</span><span>Une base de travail — pas encore un service connecté</span></footer>
        </div>
      </section>
    </main>
  );
}
