"use client";

import Link from "next/link";
import { useState } from "react";

const poles = [
  { id:"public", label:"Marchés publics", detail:"Appels d’offres · travaux · services · fournitures", href:"/opportunites/marches-publics", x:"18%", y:"20%", color:"blue", icon:"⌂", group:"OPPORTUNITÉS" },
  { id:"prive", label:"Marchés privés", detail:"Consultations · sous-traitance · besoins publiés", href:"/opportunites/marches-prives", x:"82%", y:"20%", color:"green", icon:"↗", group:"OPPORTUNITÉS" },
  { id:"entreprises", label:"Radar des entreprises", detail:"Ciblage · qualification · signaux d’activité", href:"/opportunites/radar-entreprises", x:"10%", y:"45%", color:"mint", icon:"▥", group:"INTELLIGENCE" },
  { id:"signaux", label:"Veille économique", detail:"BODACC · créations · implantations · évolutions", href:"/business/veille-bodacc", x:"90%", y:"45%", color:"gold", icon:"⌕", group:"INTELLIGENCE" },
  { id:"salons", label:"Salons professionnels", detail:"Calendrier · secteurs · régions · préparation", href:"/opportunites/salons", x:"18%", y:"72%", color:"orange", icon:"▦", group:"RÉSEAU" },
  { id:"reseaux", label:"Réseaux professionnels", detail:"Annuaire · interlocuteurs · mise en relation", href:"/reseaux", x:"82%", y:"72%", color:"purple", icon:"♧", group:"RÉSEAU" },
  { id:"prospection", label:"Prospection commerciale", detail:"Ciblage · argumentaires · suivi des contacts", href:"/developpement-commercial/prospection", x:"35%", y:"92%", color:"teal", icon:"↗", group:"ACTION" },
  { id:"ao", label:"Accompagnement AO", detail:"Préparer · rédiger · analyser les résultats", href:"/developpement-commercial/accompagnement-appels-offres", x:"65%", y:"92%", color:"blue", icon:"▤", group:"ACTION" },
  { id:"emploi", label:"Emploi & recrutement", detail:"Offres · missions · CV · recrutement", href:"/emploi", x:"50%", y:"7%", color:"red", icon:"◎", group:"RESSOURCES" },
];

const links = [
  ["public","prive"],["public","entreprises"],["prive","signaux"],
  ["entreprises","signaux"],["entreprises","salons"],["signaux","reseaux"],
  ["salons","prospection"],["reseaux","prospection"],["public","ao"],
  ["prive","ao"],["ao","prospection"],["emploi","reseaux"],
  ["emploi","entreprises"],["public","prospection"]
];

export default function MajestiOSOpportunityMap() {
  const [active,setActive] = useState("public");
  const selected = poles.find((pole)=>pole.id===active) ?? poles[0];
  const coords = (id:string) => {
    const pole = poles.find((item)=>item.id===id)!;
    return {x:Number.parseFloat(pole.x),y:Number.parseFloat(pole.y)};
  };
  return (
    <section className="maj-map" aria-labelledby="maj-map-title">
      <div className="maj-map-heading">
        <span className="section-label">L’ÉCOSYSTÈME MAJESTIOS</span>
        <h2 id="maj-map-title">Une intelligence connectée, de l’opportunité à l’action.</h2>
        <p>Explorez les dossiers et leurs connexions. Sélectionnez un pôle pour en voir le rôle, puis ouvrez sa rubrique.</p>
      </div>
      <div className="maj-map-legend" aria-label="Légende du schéma">
        <span><i className="legend-opportunity" /> Opportunités</span>
        <span><i className="legend-intelligence" /> Intelligence économique</span>
        <span><i className="legend-action" /> Action commerciale</span>
        <span><i className="legend-network" /> Réseau & ressources</span>
      </div>
      <div className="maj-map-canvas">
        <div className="maj-map-orbit maj-map-orbit-outer" aria-hidden="true" />
        <div className="maj-map-orbit maj-map-orbit-inner" aria-hidden="true" />
        <svg className="maj-map-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {links.map(([from,to],i)=>{ const a=coords(from), b=coords(to); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />; })}
        </svg>
        <Link className="maj-map-core" href="/opportunites" aria-label="Explorer les opportunités MajestiOS">
          <span className="maj-map-core-mark" aria-hidden="true">
            <svg className="majesti-crown" viewBox="0 0 32 22" focusable="false"><path d="M3 18 1 5l8 5 7-9 7 9 8-5-2 13Z" fill="currentColor"/><path d="M4 20h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            <svg className="majesti-triangle" viewBox="0 0 36 30" focusable="false"><path d="M18 2.5 33.5 27H2.5Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg>
          </span>
          <strong>MajestiOS</strong><small>DÉTECTER · QUALIFIER · TRANSFORMER</small>
        </Link>
        {poles.map((pole)=>(
          <Link key={pole.id} className={`maj-map-node ${pole.color} ${active===pole.id?"is-active":""}`} style={{left:pole.x,top:pole.y}} href={pole.href} onMouseEnter={()=>setActive(pole.id)} onFocus={()=>setActive(pole.id)} onTouchStart={()=>setActive(pole.id)} aria-label={`Explorer ${pole.label} : ${pole.detail}`}>
            <span className="maj-map-node-group">{pole.group}</span>
            <span className="maj-map-node-icon" aria-hidden="true">{pole.icon}</span>
            <strong>{pole.label}</strong>
            <span className="maj-map-node-detail">{pole.detail}</span>
          </Link>
        ))}
      </div>
      <div className="maj-map-selection" aria-live="polite">
        <div><span className="maj-map-selection-kicker">DOSSIER SÉLECTIONNÉ · {selected.group}</span><strong>{selected.label}</strong><p>{selected.detail}</p></div>
        <Link href={selected.href} className="maj-map-selection-link">Ouvrir le dossier <span aria-hidden="true">↗</span></Link>
      </div>
      <nav className="maj-map-quicklinks" aria-label="Accès directs aux pôles MajestiOS">
        {poles.map((pole)=><Link key={pole.id} href={pole.href}>{pole.label}</Link>)}
      </nav>
    </section>
  );
}
