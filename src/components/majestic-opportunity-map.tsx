"use client";

import Link from "next/link";
import { useState } from "react";

const pillars = [
  { id:"commercial", label:"Développement commercial", subtitle:"LE SOMMET · L’IMPULSION", description:"Ciblage, prospection, qualification et transformation des opportunités en relations commerciales durables.", href:"/developpement-commercial", tone:"commercial", x:50, y:17 },
  { id:"public", label:"Marchés publics", subtitle:"BASE GAUCHE", description:"Détecter et qualifier les appels d’offres publics, comprendre les exigences et préparer le positionnement.", href:"/opportunites/marches-publics", tone:"public", x:23, y:76 },
  { id:"private", label:"Marchés privés", subtitle:"BASE DROITE", description:"Repérer les consultations privées, les besoins de sous-traitance et les opportunités commerciales moins visibles.", href:"/opportunites/marches-prives", tone:"private", x:77, y:76 },
];

const engines = [
  { id:"prospection", label:"Prospection", detail:"Cibler · contacter · relancer", href:"/developpement-commercial/prospection", icon:"↗" },
  { id:"ao", label:"Accompagnement appels d’offres", detail:"Préparer · rédiger · sécuriser", href:"/developpement-commercial/accompagnement-appels-offres", icon:"▤" },
  { id:"emploi", label:"Emploi & recrutement", detail:"Compétences · missions · équipes", href:"/emploi", icon:"◎" },
  { id:"salons", label:"Salons professionnels", detail:"Rencontres · réseau · détection", href:"/opportunites/salons", icon:"✦" },
];

export default function MajestiOSOpportunityMap() {
  const [active,setActive] = useState("commercial");
  const selected = [...pillars, ...engines.map((e)=>({...e, subtitle:"MOTEUR DE SYNERGIE", description:e.detail, tone:"engine", x:50,y:50}))].find((item)=>item.id===active) ?? pillars[0];
  return (
    <section className="maj-map maj-pyramid" aria-labelledby="maj-map-title">
      <div className="maj-map-heading">
        <span className="section-label">LE MODÈLE MAJESTIOS</span>
        <h2 id="maj-map-title">Trois axes. Une seule dynamique commerciale.</h2>
        <p>Le développement commercial relie les marchés publics et privés. Au cœur de la pyramide, les moteurs de MajestiOS font circuler l’information et transforment les opportunités en actions.</p>
      </div>
      <div className="maj-pyramid-legend" aria-label="Les trois axes stratégiques">
        <span className="legend-commercial"><i /> Développement commercial</span>
        <span className="legend-public"><i /> Marchés publics</span>
        <span className="legend-private"><i /> Marchés privés</span>
      </div>
      <div className="maj-pyramid-stage">
        <svg className="maj-pyramid-frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="pyramidStroke" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c99b45"/><stop offset="50%" stopColor="#8aa8b7"/><stop offset="100%" stopColor="#258c78"/></linearGradient></defs>
          <path d="M50 7 L5 91 L95 91 Z" fill="rgba(232,241,245,.46)" stroke="url(#pyramidStroke)" strokeWidth=".7" vectorEffect="non-scaling-stroke"/>
          <path d="M50 7 L50 91 M5 91 L50 49 L95 91 M23 59 L77 59" fill="none" stroke="#b8cbd4" strokeWidth=".28" strokeDasharray="1.2 1.4" vectorEffect="non-scaling-stroke"/>
        </svg>
        <div className="maj-pyramid-core" aria-label="Synergie MajestiOS">
          <span className="maj-pyramid-core-kicker">AU CŒUR DE LA PYRAMIDE</span>
          <strong>SYNERGIE</strong>
          <span className="maj-pyramid-core-caption">Données · acteurs · opportunités</span>
          <div className="maj-pyramid-engines">
            {engines.map((engine)=><button key={engine.id} type="button" onClick={()=>setActive(engine.id)} onFocus={()=>setActive(engine.id)} className={`maj-pyramid-engine ${active===engine.id?"is-active":""}`} aria-pressed={active===engine.id}>
              <span className="maj-pyramid-engine-icon" aria-hidden="true">{engine.icon}</span>
              <span><strong>{engine.label}</strong><small>{engine.detail}</small></span>
            </button>)}
          </div>
        </div>
        {pillars.map((pillar)=><Link key={pillar.id} href={pillar.href} className={`maj-pyramid-pillar ${pillar.tone} ${active===pillar.id?"is-active":""}`} onMouseEnter={()=>setActive(pillar.id)} onFocus={()=>setActive(pillar.id)} onTouchStart={()=>setActive(pillar.id)} style={{left:`${pillar.x}%`,top:`${pillar.y}%`}} aria-label={`Ouvrir ${pillar.label}. ${pillar.description}`}>
          <span className="maj-pyramid-pillar-subtitle">{pillar.subtitle}</span>
          <strong>{pillar.label}</strong>
          <span className="maj-pyramid-pillar-action">Explorer le dossier <b>↗</b></span>
        </Link>)}
      </div>
      <div className="maj-map-selection maj-pyramid-selection" aria-live="polite">
        <div><span className="maj-map-selection-kicker">FOCUS · {selected.subtitle}</span><strong>{selected.label}</strong><p>{selected.description}</p></div>
        {"href" in selected ? <Link href={selected.href} className="maj-map-selection-link">Ouvrir le dossier <span aria-hidden="true">↗</span></Link> : null}
      </div>
      <p className="maj-pyramid-note">Les quatre moteurs ne sont pas des axes supplémentaires : ils alimentent la synergie entre le développement commercial et les marchés publics et privés.</p>
    </section>
  );
}
