"use client";

import { useState } from "react";

type Answer = { title: string; text: string; sources: string[]; next?: { label: string; href: string }[] };

const knowledge: { terms: string[]; answer: Answer }[] = [
  { terms:["opportunité","appel d'offre","marché public","boamp"], answer:{title:"Détecter une opportunité",text:"Le parcours prévu consiste à définir la cible et les critères, consulter des sources autorisées, conserver la provenance et la date, qualifier le signal, puis soumettre l’opportunité à une validation humaine. La recherche BOAMP existe dans le prototype ; son fonctionnement complet doit encore être vérifié.",sources:["Cahier des charges fonctionnel et technique V1.1 — Opportunity Intelligence","README du dépôt — connecteur BOAMP à tester"],next:[{label:"Rechercher des appels d’offres",href:"/appels-offres-publics"}]}},
  { terms:["entreprise","évaluer","evaluation","diagnostic"], answer:{title:"Évaluer une entreprise",text:"L’évaluation doit partir d’informations identifiables : activité, secteur, zone, signaux observés et sources consultables. Les faits doivent rester séparés des hypothèses ; un score éventuel doit expliquer ses facteurs et ne pas être présenté comme une probabilité de conversion garantie. Le formulaire d’évaluation du site est un parcours de démonstration tant qu’aucun traitement serveur n’est raccordé.",sources:["Cahier des charges fonctionnel et technique V1.1 — modèle Opportunity Intelligence","Doctrine fondatrice — PF-01, PF-02 et PF-03"],next:[{label:"Évaluer mon entreprise",href:"/business"}]}},
  { terms:["contact","décideur","prospection","client"], answer:{title:"Préparer une démarche commerciale",text:"Le parcours cible relie entreprise, interlocuteurs et décideurs, puis aide à préparer un argumentaire, des questions de qualification et une prochaine action. Les coordonnées ne doivent jamais être inventées. Les actions et résultats réels doivent être historisés ; l’assistant propose, l’utilisateur décide.",sources:["MAJESTIOS.pdf — parcours fonctionnel de référence, développement commercial","Doctrine fondatrice — souveraineté de la décision humaine"],next:[{label:"Développement commercial",href:"/developpement-commercial"}]}},
  { terms:["marché","étude","secteur","région"], answer:{title:"Étudier un marché",text:"Une étude doit préciser la question, le périmètre géographique et sectoriel, la période, les sources et leurs limites. Il faut distinguer les données observées des interprétations et signaler les informations manquantes plutôt que combler les lacunes par des faits supposés.",sources:["Cahier des charges fonctionnel et technique V1.1 — sources et qualification","Doctrine fondatrice — qualité et traçabilité de la donnée"],next:[{label:"Études de marché",href:"/etudes-de-marche"}]}},
  { terms:["e-réputation","ereputation","réputation","avis en ligne","mention"], answer:{title:"Surveiller l’e-réputation",text:"L’e-réputation est une sous-rubrique du développement commercial. Le parcours cible consiste à définir les sources autorisées, surveiller des mentions, vérifier les homonymes, conserver lien et date, puis préparer une réponse soumise à validation humaine. Aucune veille continue n’est annoncée comme active dans ce prototype.",sources:["Doctrine fondatrice — PF-01 à PF-05","Cahier des charges — catalogue et conditions d’utilisation des sources"],next:[{label:"Ouvrir l’e-réputation",href:"/developpement-commercial/e-reputation"}]}},
  { terms:["partenaire","partenariat","collaboration","investisseur"], answer:{title:"Construire un partenariat",text:"MajestiOS peut aider à qualifier un besoin de collaboration, documenter les organisations concernées et préparer une prise de contact. La pertinence d’un partenaire reste une hypothèse jusqu’à vérification et décision humaine. Le site ne prétend pas encore disposer d’un réseau de partenaires connecté.",sources:["MAJESTIOS — Document Commercial & Potentiel Stratégique","Doctrine fondatrice — modélisation relationnelle et facilitation"],next:[{label:"Espace partenaires",href:"/partenaires"}]}},
  { terms:["brainios","cahier des charges","référentiel","source","mémoire"], answer:{title:"Comment j’utilise le référentiel",text:"Je m’appuie sur les principes documentés dans les références de conception : données qualifiées, sources traçables, séparation entre faits et hypothèses, confidentialité par organisation et décision humaine. Cette version du chatbot utilise un extrait métier embarqué dans le prototype ; elle n’interroge pas encore automatiquement les fichiers du dossier Brainios. Une vraie connexion documentaire devra indexer les documents autorisés, conserver les références et respecter les droits d’accès.",sources:["Doctrine fondatrice V1.0 — principes PF-01 à PF-07","Cahier des charges fonctionnel et technique V1.1 — référentiel de travail"],next:[{label:"Découvrir MajestiOS",href:"/comment-et-pourquoi"}]}}
];

function answerFor(value: string): Answer {
  const q=value.toLocaleLowerCase("fr");
  const match=knowledge.find(item=>item.terms.some(term=>q.includes(term)));
  return match?.answer ?? {title:"Précisons votre besoin",text:"Je peux vous guider sur la détection d’opportunités, l’évaluation d’entreprise, le développement commercial, les études de marché, l’e-réputation et les partenariats. Décrivez votre objectif ou choisissez une rubrique. Je signalerai les fonctions encore en conception plutôt que de prétendre qu’une action a été exécutée.",sources:["Référentiel stratégique MajestiOS — vision et parcours métier"],next:[{label:"Développement commercial",href:"/developpement-commercial"},{label:"Évaluer mon entreprise",href:"/business"},{label:"Partenaires",href:"/partenaires"}]};
}

export default function MajestiosAssistant() {
  const [open,setOpen]=useState(false);
  const [question,setQuestion]=useState("");
  const [answer,setAnswer]=useState<Answer|null>(null);
  const [history,setHistory]=useState<string[]>([]);
  function ask(value:string){const q=value.trim();if(!q)return;setHistory(old=>[...old,q]);setAnswer(answerFor(q));setQuestion("");}
  return <div className="majestios-chat">
    {open && <section className="chat-window" aria-label="Assistant MajestiOS">
      <header className="chat-header"><div><strong>Assistant MajestiOS</strong><small>Référentiel métier · prototype</small></div><button type="button" onClick={()=>setOpen(false)} aria-label="Fermer le chat">×</button></header>
      <div className="chat-body">
        <p className="chat-disclaimer">Je vous guide selon les références MajestiOS. Les analyses restent à vérifier et les décisions vous appartiennent.</p>
        {history.map((q,i)=><p className="chat-question" key={i}>{q}</p>)}
        {answer ? <article className="chat-answer"><strong>{answer.title}</strong><p>{answer.text}</p><small>Références mobilisées</small><ul>{answer.sources.map(s=><li key={s}>{s}</li>)}</ul><nav>{answer.next?.map(n=><a key={n.href} href={n.href}>{n.label} ↗</a>)}</nav></article> : <div className="chat-prompts"><span>Que souhaitez-vous faire ?</span>{["Trouver des opportunités","Évaluer mon entreprise","Préparer ma prospection","Surveiller l’e-réputation","Comprendre Brainios"].map(p=><button key={p} type="button" onClick={()=>ask(p)}>{p} ↗</button>)}</div>}
      </div>
      <form className="chat-compose" onSubmit={e=>{e.preventDefault();ask(question);}}><input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Décrivez votre besoin…" aria-label="Votre question" maxLength={1000}/><button type="submit" disabled={!question.trim()}>Envoyer</button></form>
      <p className="chat-status">Prototype guidé par des extraits du référentiel — pas encore connecté à une IA ni aux fichiers Brainios en direct.</p>
    </section>}
    <button className="chat-launcher" type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open}><span aria-hidden="true">✦</span>{open?"Fermer l’assistant":"Parler à MajestiOS"}</button>
  </div>;
}
