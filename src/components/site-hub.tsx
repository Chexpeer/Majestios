import Link from "next/link";
import PublicHeader from "@/components/public-header";
import AnnouncementTicker from "@/components/announcement-ticker";
import { findSiteNode, flattenSiteTree } from "@/data/site-tree";

type EditorialSection = { title: string; body: string; bullets?: string[] };
type EditorialPage = { lead: string; sections: EditorialSection[] };

const editorialPages: Record<string, EditorialPage> = {
  "/comprendre/concept": {
    lead: "MajestiOS associe intelligence artificielle, veille économique et développement commercial. L’objectif n’est pas d’accumuler des données : c’est de repérer des opportunités, de comprendre leur contexte et de rapprocher les acteurs qui pourraient avoir intérêt à travailler ensemble.",
    sections: [
      { title: "Le réseautage intelligent", body: "Un appel d’offres, une création d’entreprise, un salon professionnel ou une évolution d’activité peuvent révéler un besoin commercial. MajestiOS vise à relier ces signaux aux entreprises, fournisseurs, sous-traitants et interlocuteurs pertinents.", bullets: ["Détecter les signaux et conserver leur source.", "Qualifier la pertinence avant de recommander une action.", "Identifier les acteurs susceptibles d’être complémentaires.", "Préparer la prise de contact et apprendre des retours."] },
      { title: "Le parcours MajestiOS", body: "Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser. Chaque étape doit permettre de passer de l’information à une décision commerciale mieux documentée." },
      { title: "IA et expertise humaine", body: "L’IA peut assister la recherche, le classement et la préparation. La validation des informations, la relation commerciale et les prestations réellement proposées doivent rester explicites. Une piste identifiée n’est ni une mise en relation garantie ni une promesse de contrat." }
    ]
  },
  "/comprendre/faq": {
    lead: "Les réponses ci-dessous expliquent la logique de MajestiOS et distinguent l’ambition du produit des fonctions qui doivent encore être activées ou vérifiées.",
    sections: [
      { title: "MajestiOS est-il uniquement un moteur d’appels d’offres ?", body: "Non. Les appels d’offres constituent une porte d’entrée. La vision est plus large : intelligence commerciale proactive et réseautage intelligent, pour identifier des besoins, qualifier des opportunités et faciliter les relations d’affaires." },
      { title: "Que signifie « réseautage intelligent » ?", body: "Relier des signaux économiques à des acteurs potentiellement complémentaires, puis préparer des rapprochements pertinents au lieu de simplement afficher un annuaire ou une liste de prospects." },
      { title: "MajestiOS garantit-il l’obtention d’un marché ?", body: "Non. La décision appartient au donneur d’ordre et dépend notamment de la concurrence et de la qualité de la réponse. MajestiOS vise à améliorer la détection, la qualification et la préparation commerciale, sans garantir un résultat." },
      { title: "Les annonces affichées sont-elles toutes vérifiées ?", body: "Une annonce ne doit être présentée comme réelle que si sa source est identifiable et son contenu contrôlé. Les données non disponibles ou les fonctions en préparation doivent être signalées comme telles." },
      { title: "Les équipes commerciales interviennent-elles ?", body: "Le positionnement prévoit une complémentarité entre IA et business developers. Le périmètre exact d’un accompagnement doit être indiqué clairement pour chaque service effectivement ouvert." }
    ]
  },
  "/comprendre/glossaire": {
    lead: "Un vocabulaire commun aide à transformer les informations économiques en démarches commerciales concrètes.",
    sections: [
      { title: "Intelligence commerciale proactive", body: "Démarche qui cherche des signaux utiles avant même qu’un prospect ne formule directement un besoin, puis organise leur qualification et leur exploitation commerciale." },
      { title: "Réseautage intelligent", body: "Identification raisonnée de connexions potentielles entre entreprises, donneurs d’ordre, sous-traitants, fournisseurs, prestataires et autres interlocuteurs professionnels." },
      { title: "Qualification", body: "Vérification de la fiabilité, de l’actualité, de la pertinence et des conditions d’exploitation d’une opportunité avant d’engager du temps ou des ressources." },
      { title: "Prospection inversée", body: "Partir d’un signal de besoin — par exemple un marché publié ou une activité qui évolue — pour rechercher les entreprises capables d’y répondre et organiser une démarche de contact." },
      { title: "Capitalisation", body: "Conserver les résultats, les réponses et les enseignements d’une démarche pour améliorer les ciblages et actions ultérieurs." }
    ]
  },
  "/opportunites/marches-publics": {
    lead: "Les marchés publics peuvent révéler des besoins précis, des calendriers d’achat et des possibilités de développement pour les entreprises capables d’y répondre. La bonne démarche commence par la recherche, puis par l’analyse du dossier original.",
    sections: [
      { title: "Rechercher avant de parcourir", body: "Les annonces détaillées doivent apparaître dans les résultats d’une recherche multicritère ou dans un flux compact. Les filtres peuvent notamment porter sur le mot-clé, la famille d’achat, le territoire et l’échéance, selon les données réellement disponibles." },
      { title: "Qualifier un marché", body: "Avant de se positionner, vérifier le besoin, les critères d’attribution, les pièces demandées, les capacités requises et la date limite dans les documents officiels." },
      { title: "Au-delà de la réponse directe", body: "Un marché peut aussi signaler des besoins indirects en fournitures, location de matériel, recrutement ou sous-traitance. Ces pistes restent des hypothèses à confirmer, pas des commandes garanties." }
    ]
  },
  "/opportunites/marches-prives": {
    lead: "Les consultations privées peuvent offrir des occasions de développement commercial différentes des procédures publiques. Leur publication et le niveau de détail partagé doivent respecter l’autorisation de l’émetteur et les conditions applicables.",
    sections: [
      { title: "Un flux de découverte, pas un catalogue permanent", body: "Les annonces peuvent être présentées dans un flux compact. Une recherche multicritère doit permettre de préciser le secteur, la zone et le type de besoin avant d’afficher les résultats disponibles." },
      { title: "Vérifier la source et les droits de diffusion", body: "Avant de publier une opportunité, vérifier qui l’a émise, si elle est toujours d’actualité et quelles informations peuvent être rendues publiques. Ne pas inventer de coordonnées ni masquer des informations sans base légitime." },
      { title: "Se positionner", body: "Le parcours cible consiste à permettre à un professionnel intéressé de manifester son intérêt et de poursuivre dans un espace sécurisé, lorsque cette fonctionnalité sera opérationnelle." }
    ]
  },
  "/opportunites/salons": {
    lead: "Un salon professionnel est à la fois un rendez-vous sectoriel, une occasion de rencontrer des décideurs et une source de signaux sur les besoins du marché.",
    sections: [
      { title: "Découvrir les événements", body: "Un flux compact peut signaler les prochains rendez-vous. La recherche doit ensuite aider à filtrer par secteur, région et date, avec des informations vérifiées auprès des organisateurs." },
      { title: "Préparer le réseautage", body: "Définir les objectifs, les catégories d’interlocuteurs à rencontrer et les questions à poser. Après l’événement, consigner les échanges et planifier les suites commerciales." },
      { title: "Inscription et accompagnement", body: "Lorsqu’un lien d’inscription ou un service d’accompagnement est proposé, préciser son origine et ses conditions. Aucun partenariat avec un organisateur ne doit être suggéré sans confirmation." }
    ]
  },
  "/opportunites/emploi": {
    lead: "Les offres d’emploi et les missions peuvent aider à suivre les besoins des entreprises, mais aussi à rapprocher les compétences disponibles et les besoins de recrutement.",
    sections: [
      { title: "Des annonces accessibles par recherche", body: "Le flux d’offres reste compact. Les résultats détaillés sont affichés après recherche, avec des filtres adaptés aux données disponibles : métier, région, type de contrat ou mission." },
      { title: "Vérifier avant de candidater", body: "Contrôler l’employeur, la source, la date de publication, le lieu, le contrat et les conditions annoncées. Une offre dont la source ne peut être vérifiée ne doit pas être présentée comme confirmée." },
      { title: "Protéger les candidatures", body: "La collecte de CV et de coordonnées nécessite un parcours sécurisé, une information claire sur l’utilisation des données et une durée de conservation définie." }
    ]
  },
  "/business": {
    lead: "Les événements qui touchent une entreprise — création, changement d’activité, évolution géographique, cession ou acquisition — peuvent révéler des besoins et des opportunités de relation commerciale.",
    sections: [
      { title: "Lire les signaux avec prudence", body: "Les publications publiques peuvent aider à repérer un changement, mais elles ne décrivent pas toujours les besoins réels ni la situation actuelle. Chaque signal doit être daté, sourcé et qualifié." },
      { title: "Du signal à la connexion", body: "Une nouvelle implantation peut suggérer un besoin de fournisseurs ou de services ; une transmission peut appeler un accompagnement spécialisé. Ce sont des hypothèses à vérifier avant toute prise de contact." },
      { title: "BODACC et données d’entreprise", body: "Les sources publiques peuvent fournir des informations utiles sur la vie des entreprises. Leur usage doit respecter les conditions de réutilisation, la protection des données et les règles applicables à la prospection." }
    ]
  },
  "/developpement-commercial": {
    lead: "Le développement commercial MajestiOS repose sur le réseautage intelligent : repérer un signal, comprendre le besoin potentiel, identifier les bons acteurs et organiser une action commerciale suivie.",
    sections: [
      { title: "Des données à une démarche", body: "Une liste de contacts n’est qu’un point de départ. Il faut préciser pourquoi une entreprise est ciblée, quelle hypothèse de besoin justifie le contact et quelle prochaine action est pertinente." },
      { title: "Le rôle des business developers", body: "L’ambition est de compléter l’analyse assistée par IA par une qualification commerciale humaine et un accompagnement clairement défini. Les prestations doivent être présentées selon leur disponibilité réelle." },
      { title: "Mesurer et apprendre", body: "Suivre les contacts tentés, les réponses, les rendez-vous, les suites données et les résultats permet d’améliorer les ciblages. Les indicateurs doivent refléter des données observées, pas des objectifs présentés comme des résultats acquis." }
    ]
  },
  "/developpement-commercial/prospection": {
    lead: "La prospection intelligente part d’une hypothèse de besoin argumentée, plutôt que d’un envoi indifférencié de messages.",
    sections: [
      { title: "Cibler", body: "Définir les critères de pertinence : activité, territoire, taille, signaux récents et adéquation avec l’offre. Écarter les contacts dont la source ou la base de contact n’est pas suffisamment claire." },
      { title: "Personnaliser", body: "Relier le message à un élément vérifiable et expliquer la valeur proposée. Éviter les affirmations non prouvées et les promesses de résultat." },
      { title: "Suivre et capitaliser", body: "Consigner les réponses et respecter les refus, les oppositions et les règles de prospection applicables. Un refus sur une proposition donnée ne doit pas être interprété comme une autorisation de recontacter sans discernement." }
    ]
  },
  "/developpement-commercial/accompagnement-appels-offres": {
    lead: "Répondre à un appel d’offres demande de décider si le marché convient, de comprendre les exigences et de préparer un dossier cohérent dans les délais.",
    sections: [
      { title: "Décider de se positionner", body: "Comparer le besoin du donneur d’ordre avec les capacités, les références, les moyens, le calendrier et les risques de l’entreprise." },
      { title: "Structurer la réponse", body: "Établir une liste de pièces, un calendrier de préparation, une matrice de conformité et une répartition claire des responsabilités. Les exigences définitives sont celles des documents officiels." },
      { title: "Capitaliser après le résultat", body: "Conserver les dates, les éléments déposés et les retours obtenus. Une réponse perdue peut produire des enseignements utiles pour les consultations suivantes." }
    ]
  },
  "/developpement-commercial/accompagnement-appels-offres/preparer": {
    lead: "Avant de rédiger une réponse, il faut décider si l’entreprise peut et souhaite réellement exécuter le marché. Cette étape évite de mobiliser des ressources sur une consultation mal comprise ou inadaptée.",
    sections: [
      { title: "Lire les pièces dans le bon ordre", body: "Commencer par l’avis, le règlement de consultation et les dates clés, puis examiner le cahier des charges, les pièces financières et les annexes. Les intitulés varient : le dossier officiel fait foi." },
      { title: "Construire une matrice de conformité", body: "Pour chaque exigence, noter la pièce concernée, la preuve à fournir, le responsable et l’échéance interne. Repérer immédiatement les critères éliminatoires, les certifications et les contraintes de visite." },
      { title: "Prendre une décision documentée", body: "Comparer les compétences, les moyens, la disponibilité, les risques, la rentabilité prévisionnelle et les éventuels besoins de partenaires. Toute incertitude majeure doit être clarifiée avant de s’engager." }
    ]
  },
  "/developpement-commercial/accompagnement-appels-offres/rediger": {
    lead: "Une réponse solide doit être conforme, lisible, étayée et adaptée au besoin du donneur d’ordre. Elle ne doit pas simplement recopier le cahier des charges.",
    sections: [
      { title: "Répondre à chaque exigence", body: "Organiser la réponse selon les critères et sous-critères annoncés. Relier chaque engagement à une méthode, une ressource, une preuve ou un livrable concret." },
      { title: "Rendre la proposition crédible", body: "Illustrer les capacités avec des références vérifiables, des moyens réalistes, un calendrier cohérent et des responsabilités clairement réparties. Ne jamais inventer de références ou de certifications." },
      { title: "Contrôler avant le dépôt", body: "Vérifier les formats, signatures, pièces obligatoires, cohérence des montants, versions des fichiers et modalités de transmission. Prévoir une marge avant l’heure limite indiquée dans le dossier." }
    ]
  },
  "/developpement-commercial/accompagnement-appels-offres/apres-un-resultat": {
    lead: "La réponse à un appel d’offres produit des enseignements, que le marché soit gagné, perdu, déclaré infructueux ou que la candidature soit écartée.",
    sections: [
      { title: "Conserver une trace fiable", body: "Archiver la version déposée, la date et la preuve de transmission, les échanges et la décision reçue, selon les règles de conservation de l’entreprise." },
      { title: "Analyser sans supposer", body: "Comparer le résultat aux critères publiés et exploiter les retours officiellement communiqués. Ne pas inventer les raisons d’un échec ni tirer de conclusion à partir d’informations absentes." },
      { title: "Capitaliser pour la prochaine consultation", body: "Actualiser les modèles, les références, le calendrier de préparation et les critères de sélection interne. Un refus sur un marché n’implique pas que tous les marchés futurs soient inadaptés." }
    ]
  },
  "/developpement-commercial/prospection/ciblage": {
    lead: "Le ciblage sert à prioriser les entreprises pour lesquelles une démarche commerciale a une raison concrète d’exister.",
    sections: [
      { title: "Définir des critères utiles", body: "Croiser activité, territoire, taille, besoins probables, capacités et signaux économiques récents. Les critères doivent correspondre à l’offre réelle de l’entreprise et rester révisables." },
      { title: "Séparer faits et hypothèses", body: "Enregistrer la source, la date et le fait observé, puis formuler séparément l’hypothèse commerciale. Une création, un marché remporté ou un changement d’adresse ne prouve pas à lui seul un besoin." },
      { title: "Prioriser plutôt que sur-solliciter", body: "Attribuer une priorité explicable, tenir compte de la pertinence et des contacts antérieurs, puis respecter les oppositions et règles applicables à la prospection." }
    ]
  },
  "/developpement-commercial/prospection/argumentaires": {
    lead: "Un argumentaire pertinent relie un fait vérifiable à un problème que l’entreprise peut réellement aider à résoudre.",
    sections: [
      { title: "Partir d’un contexte réel", body: "S’appuyer sur une information publique et pertinente, en mentionnant sa source lorsque c’est utile. Éviter de prétendre connaître les besoins internes d’une entreprise sans confirmation." },
      { title: "Exprimer une valeur précise", body: "Présenter le service, le résultat visé et la prochaine étape proposée en termes simples. Adapter le message au rôle de l’interlocuteur et au contexte du contact." },
      { title: "Préparer plusieurs suites", body: "Prévoir une réponse aux questions courantes, une demande de précision, un refus et une absence de réponse. Respecter les préférences de contact et ne pas multiplier les relances de façon intrusive." }
    ]
  },
  "/developpement-commercial/prospection/suivi": {
    lead: "Le suivi commercial permet de savoir ce qui a été tenté, ce qui a reçu une réponse et quelle action est justifiée ensuite.",
    sections: [
      { title: "Consigner l’essentiel", body: "Noter la date, le canal, le motif du contact, le résultat factuel et la prochaine action convenue. Limiter les données aux informations nécessaires à la relation commerciale." },
      { title: "Interpréter correctement les signaux", body: "Une ouverture d’email ou une visite ne prouve ni un intérêt ni une intention d’achat. Ces indicateurs peuvent orienter une analyse, mais ne remplacent pas une réponse explicite." },
      { title: "Améliorer la démarche", body: "Analyser les réponses et les suites concrètes par segment, offre et période. Distinguer les volumes d’activité des résultats commerciaux effectivement constatés." }
    ]
  },
  "/developpement-commercial/etudes-de-marche/methodologie": {
    lead: "Une étude de marché utile commence par une question précise et une méthode proportionnée à la décision à prendre.",
    sections: [
      { title: "Définir la question", body: "Préciser le produit ou service étudié, la zone, les clients visés, l’horizon temporel et la décision que l’étude doit éclairer." },
      { title: "Croiser les sources", body: "Associer, lorsque c’est pertinent, statistiques publiques, publications sectorielles, informations d’entreprise et retours de terrain. Documenter les dates, définitions et limites de chaque source." },
      { title: "Présenter les limites", body: "Séparer les observations, les estimations et les hypothèses. Signaler les données manquantes et éviter de présenter une extrapolation comme un fait établi." }
    ]
  },
  "/developpement-commercial/etudes-de-marche/sources": {
    lead: "La valeur d’une étude dépend autant de la qualité de ses sources que de la pertinence de son analyse.",
    sections: [
      { title: "Privilégier les sources primaires", body: "Lorsque c’est possible, remonter aux publications des organismes publics, des acheteurs, des organisateurs ou des entreprises concernées plutôt que de s’appuyer uniquement sur une reprise secondaire." },
      { title: "Tracer chaque information", body: "Conserver le titre de la source, son URL, la date de consultation, la période couverte et les éventuelles restrictions de réutilisation." },
      { title: "Contrôler l’actualité", body: "Une donnée ancienne peut éclairer une tendance, mais ne doit pas être utilisée comme si elle décrivait la situation actuelle. Vérifier les dates et les définitions avant comparaison." }
    ]
  },
  "/business/radar-bodacc": {
    lead: "Le BODACC publie des annonces relatives à la vie des entreprises. Ces publications peuvent révéler un événement à examiner, mais elles ne constituent pas automatiquement une intention d’achat ou un besoin commercial.",
    sections: [
      { title: "Repérer le fait publié", body: "Identifier la nature de l’annonce, la date, l’entreprise concernée et la publication originale. Distinguer les informations administratives des interprétations commerciales." },
      { title: "Chercher une pertinence réelle", body: "Un événement peut justifier une recherche complémentaire sur l’activité, le territoire ou les besoins possibles. Toute hypothèse doit être confirmée avant d’être utilisée dans une prise de contact." },
      { title: "Prospecter de manière responsable", body: "Respecter les règles de protection des données, les conditions de réutilisation de la source et les règles applicables au canal de prospection choisi." }
    ]
  },
  "/reseaux": {
    lead: "Le réseau MajestiOS doit servir à créer des connexions professionnelles utiles, fondées sur la complémentarité des compétences, des besoins et des opportunités détectées.",
    sections: [
      { title: "Un réseau orienté vers l’action", body: "L’objectif n’est pas seulement de réunir des profils : il s’agit de faciliter des rapprochements pertinents entre entreprises, experts, fournisseurs, sous-traitants et professionnels du développement commercial." },
      { title: "Des mises en relation qualifiées", body: "Chaque rapprochement doit s’appuyer sur une raison explicite, des informations vérifiables et le respect du consentement des personnes concernées." },
      { title: "Contribuer à l’écosystème", body: "Les modalités d’accès à l’annuaire, aux événements et aux contributions seront précisées au fur et à mesure de l’ouverture effective des services." }
    ]
  }
};

export default function SiteHub({ pathname, title, intro, eyebrow = "EXPLORER MAJESTIOS", checklist = [] }: { pathname: string; title?: string; intro?: string; eyebrow?: string; checklist?: string[] }) {
  const found = findSiteNode(pathname);
  const node = found?.node;
  const children = node?.children ?? [];
  const editorial = editorialPages[pathname];
  const siblings = found?.ancestors.at(-1)?.children?.filter((item) => item.href !== pathname) ?? [];
  const related = siblings.length ? siblings.slice(0, 4) : flattenSiteTree().filter((item) => item.href !== pathname && item.href !== "/" && !item.children?.length).slice(0, 4);
  const pageTitle = node?.label ?? title ?? "Explorer MajestiOS";
  const pageIntro = editorial?.lead ?? intro ?? node?.description ?? "Explorez les rubriques et les parcours de MajestiOS.";
  const tickerFlow = pathname.startsWith("/opportunites/marches-publics") ? "public" : pathname.startsWith("/opportunites/marches-prives") ? "private" : pathname.startsWith("/opportunites/salons") ? "salons" : pathname.startsWith("/opportunites/emploi") ? "emploi" : null;
  return <main className="site-page">
    <PublicHeader />
    {tickerFlow ? <AnnouncementTicker flow={tickerFlow} /> : null}
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link>{found?.ancestors.map((ancestor) => <span key={ancestor.href}><b>/</b><Link href={ancestor.href}>{ancestor.label}</Link></span>)}{!found && pathname.startsWith("/opportunites/") ? <span><b>/</b><Link href="/opportunites">Opportunités</Link></span> : null}<span><b>/</b><strong>{pageTitle}</strong></span></nav>
      <section className="page-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{pageTitle}<span>.</span></h1>
        <p>{pageIntro}</p>
        <div className="page-hero-meta"><span className="status-chip"><i />Rubrique dédiée</span><span>Une rubrique dédiée, une URL dédiée.</span></div>
      </section>
      {pathname === "/opportunites/marches-publics" ? <section className="content-panel search-entry-panel"><span className="eyebrow">PASSER À LA RECHERCHE</span><h2>Rechercher des avis selon vos critères</h2><p>Précisez les mots-clés, le territoire et la catégorie, puis examinez les résultats disponibles. La fiche officielle reste la référence pour vérifier le dossier et les échéances.</p><Link className="search-submit" href="/appels-offres-publics">Lancer la recherche multicritère ↗</Link></section> : null}
      {pathname === "/opportunites/marches-prives" ? <section className="content-panel search-entry-panel"><span className="eyebrow">CATALOGUE PRIVÉ</span><h2>Consulter l’espace des opportunités privées</h2><p>Le catalogue privé n’est pas encore connecté à une source d’annonces vérifiées. Vous pouvez consulter son état actuel ; aucune annonce de démonstration ne sera présentée comme réelle.</p><Link className="search-submit" href="/appels-offres-prives">Accéder à l’espace privé ↗</Link></section> : null}
      {editorial?.sections.map((section, index) => <section className="content-panel editorial-panel" key={section.title}>
        <span className="eyebrow">REPÈRE {String(index + 1).padStart(2, "0")}</span>
        <h2>{section.title}</h2>
        <p>{section.body}</p>
        {section.bullets?.length ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
      </section>)}
      {children.length > 0 ? <section className="hub-grid" aria-label={`Sous-rubriques de ${node?.label}`}>{children.map((child, index) => <Link href={child.href} className="hub-card" key={child.href}><span className="hub-card-index">{String(index + 1).padStart(2, "0")}</span><div><h2>{child.label}<span aria-hidden="true">↗</span></h2><p>{child.description}</p></div><span className="hub-card-bottom">EXPLORER LA RUBRIQUE <b>→</b></span></Link>)}</section> : null}
      {checklist.length > 0 ? <section className="content-panel"><span className="eyebrow">POINTS DE CONTRÔLE</span><h2>Avant de passer à l’action</h2><ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
      {!editorial && children.length === 0 ? <section className="content-panel"><span className="eyebrow">INFORMATIONS DE SERVICE</span><h2>Une démarche documentée et vérifiable</h2><p>Les informations et fonctionnalités seront présentées selon leur disponibilité réelle. Les annonces doivent renvoyer à une source identifiable ; les fonctions en préparation ne doivent pas être confondues avec un service déjà ouvert.</p></section> : null}
      <section className="related-section"><div><span className="eyebrow">POUR ALLER PLUS LOIN</span><h2>Rubriques associées</h2></div><div className="related-links">{related.map((item) => <Link href={item.href} key={item.href}>{item.label}<span>↗</span></Link>)}</div></section>
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/comprendre/faq">Besoin d’aide ?</Link></footer>
    </div>
  </main>;
}
