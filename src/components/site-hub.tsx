import Link from "next/link";
import HomepageNavigation from "@/components/homepage-navigation";
import { findSiteNode } from "@/data/site-tree";

type DetailGuide = { title: string; purpose: string; checks: string[]; next: string };

const dedicatedGuides: Record<string, DetailGuide> = {
  "/opportunites/marches-publics/travaux": {
    title: "Qualifier un marché de travaux",
    purpose: "Vérifier la nature des travaux, le site d’exécution et les exigences techniques avant d’engager une réponse.",
    checks: ["Lots, quantités et périmètre exact des travaux", "Qualifications, assurances, références et moyens requis", "Visite éventuelle, calendrier, pénalités et contraintes du site"],
    next: "Ne retenir une consultation qu’après vérification du dossier complet, des éventuels rectificatifs et de la capacité réelle à exécuter le marché."
  },
  "/opportunites/marches-publics/services": {
    title: "Évaluer une consultation de services",
    purpose: "Mesurer l’adéquation entre la prestation attendue, les compétences mobilisables et les niveaux de service demandés.",
    checks: ["Périmètre, livrables et résultats attendus", "Compétences, continuité de service et délais", "Critères de jugement, prix et méthode de suivi"],
    next: "Construire la décision de répondre à partir des exigences vérifiables, du coût complet et des ressources disponibles."
  },
  "/opportunites/marches-publics/fournitures": {
    title: "Vérifier un marché de fournitures",
    purpose: "Comparer précisément les caractéristiques des produits, les quantités et les contraintes de livraison.",
    checks: ["Spécifications et équivalences acceptées", "Volumes, fréquence et lieux de livraison", "Garanties, conformité, délais et coût logistique"],
    next: "Éviter de se baser uniquement sur le montant estimé : vérifier la conformité technique et la capacité à respecter les conditions de livraison."
  },
  "/opportunites/marches-prives/secteur": {
    title: "Qualifier un besoin privé par secteur",
    purpose: "Utiliser le secteur d’activité comme point de départ d’une qualification, jamais comme preuve qu’une entreprise a un besoin ouvert.",
    checks: ["Activité et contexte de l’annonceur", "Besoin explicitement exprimé, calendrier et zone", "Source, autorisation de diffusion et niveau de confidentialité"],
    next: "Ne transformer le signal en prise de contact qu’après recoupement et vérification de la pertinence de l’offre proposée."
  },
  "/opportunites/salons/calendrier": {
    title: "Choisir les salons utiles à son développement",
    purpose: "Le calendrier sert à sélectionner les événements selon les objectifs commerciaux, la zone géographique et les publics réellement rencontrés.",
    checks: ["Dates, lieu et informations confirmés par l’organisateur", "Secteurs, exposants et visiteurs visés", "Coût, disponibilité et objectif concret de visite"],
    next: "Confirmer les conditions auprès du site officiel de l’événement et définir les résultats attendus avant de réserver ou de se déplacer."
  },
  "/opportunites/salons/preparer": {
    title: "Préparer une visite à finalité commerciale",
    purpose: "Transformer une présence à un salon en démarche organisée : objectif clair, rencontres pertinentes et suivi consenti.",
    checks: ["Objectif mesurable et profils à rencontrer", "Questions de qualification et proposition de valeur", "Prochaine étape convenue et autorisation de conserver les coordonnées"],
    next: "La préparation est une méthode. Elle ne signifie pas qu’une inscription, un agenda de rendez-vous ou un CRM MajestiOS est actuellement activé."
  },
  "/developpement-commercial/prospection/ciblage": {
    title: "Construire un ciblage défendable",
    purpose: "Définir un groupe d’entreprises à partir de critères liés à l’offre, au territoire et à des signaux vérifiables, plutôt que d’envoyer des messages indifférenciés.",
    checks: ["Profil d’entreprise et périmètre géographique", "Signal daté, source et niveau de confiance", "Motif précis de pertinence et règles de prospection applicables"],
    next: "Documenter pourquoi chaque cible est pertinente, limiter les données aux besoins justifiés et réviser les critères selon les retours."
  },
  "/developpement-commercial/prospection/argumentaires": {
    title: "Relier l’argumentaire au contexte du prospect",
    purpose: "Un message commercial utile explique pourquoi la proposition peut compter pour ce destinataire, sans inventer un besoin ni prétendre connaître sa situation.",
    checks: ["Fait ou signal qui justifie le contact", "Bénéfice concret et preuve à l’appui", "Formulation transparente et possibilité simple de ne plus être sollicité"],
    next: "Personnaliser sur la base d’informations pertinentes et licitement utilisées, puis mesurer les retours sans confondre ouverture et intérêt commercial."
  },
  "/developpement-commercial/prospection/suivi": {
    title: "Organiser les relances et capitaliser",
    purpose: "Le suivi doit conserver le contexte, les engagements et les retours afin d’améliorer les prochaines actions et d’éviter les sollicitations répétitives.",
    checks: ["Date, canal et objet du dernier échange", "Prochaine action convenue et échéance", "Réponse, refus, préférence de contact et statut de la relation"],
    next: "Respecter les refus et préférences exprimés. Une absence de réponse n’est ni un accord ni une preuve d’intérêt."
  },
  "/developpement-commercial/etudes-de-marche/methodologie": {
    title: "Définir une méthode d’étude avant la collecte",
    purpose: "Une étude commence par une décision à éclairer, un périmètre précis et des critères de preuve adaptés à la question.",
    checks: ["Question, territoire, période et segment étudiés", "Sources primaires/secondaires et date de consultation", "Hypothèses, limites, scénarios et décision attendue"],
    next: "Séparer systématiquement les observations, les interprétations et les hypothèses. Signaler les données manquantes plutôt que les remplacer par des estimations non vérifiées."
  },
  "/developpement-commercial/etudes-de-marche/sources": {
    title: "Évaluer une source d’information commerciale",
    purpose: "La valeur d’une source dépend de son autorité, de son actualité, de son périmètre et des conditions dans lesquelles l’information peut être réutilisée.",
    checks: ["Émetteur d’origine et traçabilité", "Date, fréquence de mise à jour et couverture", "Limites, droits de réutilisation et recoupement indépendant"],
    next: "Conserver la provenance et la date de vérification avec chaque donnée importante. Une source publique n’implique pas que tous ses contenus puissent être réutilisés sans condition."
  },
  "/developpement-commercial/e-reputation/surveiller": {
    title: "Mettre en place une veille des avis",
    purpose: "La veille repère les tendances et les sujets récurrents sans tirer de conclusion sur la base d’un avis isolé.",
    checks: ["Plateforme, date et contexte", "Récurrence d’un thème et éléments vérifiables", "Priorité de traitement et responsable de réponse"],
    next: "Respecter les règles des plateformes, ne pas publier de données personnelles et ne jamais fabriquer ou acheter de faux avis."
  },
  "/developpement-commercial/e-reputation/repondre-aux-avis": {
    title: "Répondre à un avis avec méthode",
    purpose: "Une réponse publique doit être factuelle, mesurée et orientée vers la résolution, tout en protégeant les informations confidentielles.",
    checks: ["Comprendre le grief et vérifier les faits", "Reconnaître ce qui peut l’être sans exposer de données privées", "Proposer un canal adapté pour résoudre le problème"],
    next: "Ne pas divulguer d’informations personnelles ni entrer dans une polémique. Corriger les causes récurrentes plutôt que chercher à masquer les critiques."
  },
  "/developpement-commercial/accompagnement-appels-offres/preparer": {
    title: "Décider si l’entreprise doit répondre",
    purpose: "La préparation commence par une décision de positionnement qui tient compte des exigences, des ressources, des délais et des chances raisonnables d’exécution.",
    checks: ["Éligibilité et exigences éliminatoires", "Capacité, références, charge et coût de réponse", "Calendrier, pièces et risques d’exécution"],
    next: "Formaliser une décision de répondre ou de renoncer, avec ses raisons. Une réponse complète ne garantit pas l’attribution."
  },
  "/developpement-commercial/accompagnement-appels-offres/rediger": {
    title: "Structurer un dossier de réponse",
    purpose: "Le dossier doit répondre aux critères de l’acheteur, prouver les capacités de l’entreprise et rester cohérent avec les engagements réellement tenables.",
    checks: ["Respect de la structure et des consignes du dossier", "Preuves adaptées à chaque critère de jugement", "Cohérence entre mémoire technique, prix, délais et moyens"],
    next: "Contrôler les versions, les pièces obligatoires, les signatures éventuelles et les modalités de dépôt auprès de la source officielle."
  },
  "/developpement-commercial/accompagnement-appels-offres/apres-un-resultat": {
    title: "Tirer parti du résultat d’un appel d’offres",
    purpose: "Un résultat doit être transformé en apprentissage commercial, que l’entreprise ait remporté le marché ou non.",
    checks: ["Résultat et motifs de décision disponibles", "Écarts entre l’offre, les critères et la concurrence si l’information est accessible", "Actions de suivi, de recours éventuel ou de capitalisation"],
    next: "Ne pas déduire de motifs non communiqués. Enregistrer les faits connus, les questions ouvertes et les améliorations à tester au prochain dossier."
  }
};

function getDetailGuide(pathname: string, label: string): DetailGuide {
  const dedicatedGuide = dedicatedGuides[pathname];
  if (dedicatedGuide) return dedicatedGuide;
  if (pathname.includes("marches-publics") || pathname.includes("appels-offres-publics")) {
    return {
      title: "Lire une consultation avant de décider",
      purpose: "Cette rubrique doit aider à comprendre le besoin exprimé, le périmètre du marché et les conditions de réponse avant d’engager du temps commercial ou administratif.",
      checks: ["Objet, lots et lieu d’exécution", "Date limite et modalités de remise", "Critères de sélection, pièces demandées et éventuelles visites"],
      next: "Comparer le besoin aux capacités, références, moyens et contraintes de l’entreprise. Une annonce repérée ne signifie pas que la candidature est recevable ni que le marché est toujours ouvert."
    };
  }
  if (pathname.includes("marches-prives") || pathname.includes("appels-offres-prives")) {
    return {
      title: "Qualifier une opportunité privée",
      purpose: "L’enjeu est de distinguer un besoin professionnel exploitable d’une simple annonce, tout en respectant la confidentialité et les conditions de diffusion fixées par son émetteur.",
      checks: ["Identité et qualité de l’émetteur", "Nature du besoin, zone d’intervention et calendrier", "Niveau d’information publiable et conditions de prise de contact"],
      next: "Les coordonnées ou pièces réservées ne doivent être accessibles qu’au travers d’un parcours clairement expliqué. Toute annonce doit être vérifiée et modérée avant publication."
    };
  }
  if (pathname.includes("emploi") || pathname.includes("missions") || pathname.includes("offres-emploi")) {
    return {
      title: "Évaluer une offre ou une mission",
      purpose: "Cette rubrique sert à rapprocher une proposition d’un profil, de compétences et de contraintes concrètes, sans confondre publication, disponibilité et recrutement effectif.",
      checks: ["Employeur ou donneur d’ordre et source de l’offre", "Compétences, lieu, durée et conditions annoncées", "Date de publication et moyen de candidature"],
      next: "Vérifier que l’offre est encore valable sur sa source d’origine et préparer une candidature adaptée. Les dépôts et mises en relation ne sont actifs que si le formulaire correspondant est disponible."
    };
  }
  if (pathname.includes("business/intelligence-entreprises") || pathname.includes("business/creations-implantations") || pathname.includes("business/evolutions-activite")) {
    return {
      title: "Comprendre une entreprise pour repérer un potentiel commercial",
      purpose: "L’intelligence entreprises consiste à rapprocher des informations économiques vérifiables, des évolutions d’activité et des signaux de marché pour formuler des hypothèses commerciales pertinentes. Elle ne consiste pas à attribuer automatiquement un besoin à une entreprise.",
      checks: ["Événement ou évolution observée, date et source d’origine", "Concordance avec l’activité, le territoire et le profil de l’entreprise", "Lien plausible entre le signal et une offre ou une compétence que l’on peut réellement proposer"],
      next: "Recouper les informations, distinguer les faits des hypothèses et documenter la raison d’une éventuelle prise de contact. Le signal doit améliorer la pertinence de la démarche, jamais remplacer la qualification."
    };
  }
  if (pathname.includes("bodacc") || pathname.includes("business") || pathname.includes("achat-cession")) {
    return {
      title: "Transformer un signal en piste à qualifier",
      purpose: "Les publications économiques peuvent révéler un changement d’entreprise ou un projet de transmission. Elles constituent un signal de veille, pas une preuve automatique d’un besoin commercial.",
      checks: ["Nature et date de la publication", "Entreprise concernée et informations concordantes", "Pertinence du signal au regard du service proposé"],
      next: "Recouper les informations avec des sources autorisées et récentes avant tout contact. Respecter les règles applicables à la prospection et ne pas déduire de besoins non établis."
    };
  }
  if (pathname.includes("e-reputation") || pathname.includes("reputation")) {
    return {
      title: "Organiser une veille de réputation en ligne",
      purpose: "Une démarche d’e-réputation consiste à observer les avis et mentions accessibles, à repérer les sujets récurrents et à préparer des réponses professionnelles sans manipuler les évaluations.",
      checks: ["Plateforme, date et contexte de l’avis", "Faits vérifiables et éventuelles récurrences", "Réponse proportionnée, respectueuse et conforme aux règles de la plateforme"],
      next: "Ne publiez pas de données personnelles ni d’accusations non vérifiées. Une réponse doit traiter le sujet avec mesure et ne jamais chercher à fabriquer de faux avis."
    };
  }
  if (pathname.includes("accompagnement-appels-offres") || pathname.includes("appels-offres")) {
    return {
      title: "Préparer une réponse à un appel d’offres",
      purpose: "L’accompagnement d’une réponse commence par une décision de positionnement réaliste, puis organise les pièces administratives, les éléments techniques et la démonstration de valeur.",
      checks: ["Éligibilité, lots, délais et exigences du dossier de consultation", "Capacité à exécuter le marché et disponibilité des ressources", "Pièces demandées, critères d’attribution et calendrier interne"],
      next: "Vérifier la version complète du dossier et les éventuelles modifications auprès de la source officielle. La préparation assistée ne garantit ni la recevabilité ni l’attribution du marché."
    };
  }
  if (pathname.includes("diagnostic")) {
    return {
      title: "Établir un diagnostic avant de choisir les actions",
      purpose: "Un diagnostic utile relie la situation actuelle, les objectifs, les contraintes et les ressources disponibles. Il sert à hiérarchiser les actions plutôt qu’à produire un constat général.",
      checks: ["Objectifs et indicateurs de départ", "Ressources, contraintes et difficultés observées", "Priorités, responsables et critères de réussite"],
      next: "Distinguer les faits documentés des hypothèses, puis fixer une prochaine action mesurable. Une recommandation doit rester proportionnée aux informations réellement disponibles."
    };
  }
  if (pathname.includes("glossaire")) {
    return {
      title: "Comprendre le vocabulaire professionnel de MajestiOS",
      purpose: "Le glossaire doit donner une définition claire des termes employés dans la veille commerciale, les appels d’offres, la qualification des entreprises et la mise en relation.",
      checks: ["Définition du terme dans son contexte métier", "Différence entre notions proches", "Source ou référence lorsque la définition est réglementaire ou technique"],
      next: "En cas de terme juridique, administratif ou réglementaire, vérifiez la définition auprès de la source officielle pertinente : les usages commerciaux et les définitions légales peuvent différer."
    };
  }
  if (pathname.includes("prospection") || pathname.includes("ciblage") || pathname.includes("argumentaires") || pathname.includes("suivi")) {
    return {
      title: "Structurer une action commerciale utile",
      purpose: "Le travail ne consiste pas à multiplier les contacts, mais à choisir des entreprises pertinentes, formuler une proposition adaptée et apprendre des retours obtenus.",
      checks: ["Critères de ciblage explicites et justifiables", "Message relié à un besoin ou signal identifié", "Historique des échanges, relances et motifs de refus"],
      next: "Conserver la trace des résultats pour améliorer le ciblage. Un refus ponctuel doit être contextualisé et ne pas devenir une exclusion définitive sans raison."
    };
  }
  if (pathname.includes("proposer-evenement")) {
    return {
      title: "Proposer un événement à l’écosystème MajestiOS",
      purpose: "Cette porte d’entrée a vocation à recueillir des événements professionnels utiles aux entreprises : rencontres sectorielles, portes ouvertes, conférences, inaugurations, journées techniques ou rendez-vous de réseau.",
      checks: ["Organisateur identifiable et coordonnées professionnelles vérifiables", "Intitulé, date, lieu, public visé et conditions de participation", "Autorisation de diffusion et éventuelles modalités d’inscription"],
      next: "Une proposition doit être vérifiée avant publication. Le dépôt d’un événement ne vaut ni validation, ni partenariat, ni inscription automatique ; le formulaire sera annoncé comme disponible uniquement lorsqu’il sera réellement activé."
    };
  }
  if (pathname.includes("evenements-entreprise")) {
    return {
      title: "Relier les événements d’entreprise aux opportunités commerciales",
      purpose: "Les événements d’entreprise peuvent révéler des occasions de comprendre une activité, rencontrer un acteur ou créer une relation professionnelle : inauguration, ouverture de site, portes ouvertes, lancement, anniversaire, démonstration ou journée de recrutement.",
      checks: ["Nature de l’événement, organisateur et date confirmés", "Public concerné et intérêt concret pour les entreprises membres", "Angle de contact pertinent, sans supposer un besoin qui n’a pas été exprimé"],
      next: "MajestiOS doit faire de l’événement un point de départ pour une mise en relation contextualisée : comprendre qui organise, pourquoi l’événement compte et quelle contribution utile peut être proposée. La publication et l’inscription dépendent de sources et de parcours vérifiés."
    };
  }
  if (pathname.includes("rencontres-affaires")) {
    return {
      title: "Organiser des rencontres d’affaires utiles",
      purpose: "Une rencontre d’affaires est plus utile lorsqu’elle rapproche des acteurs complémentaires autour d’un objectif clair : recherche de fournisseur, sous-traitance, besoin de compétence, développement territorial ou échange sectoriel.",
      checks: ["Objectif et format de la rencontre", "Profils attendus et complémentarité possible", "Accord des participants sur le partage de leurs coordonnées et la suite des échanges"],
      next: "Privilégier des introductions motivées et explicites plutôt qu’un annuaire de contacts sans contexte. Les invitations, inscriptions et mises en relation ne doivent être présentées comme actives que si le parcours correspondant existe."
    };
  }
  if (pathname.includes("salon") || pathname.includes("evenements")) {
    return {
      title: "Préparer une présence professionnelle",
      purpose: "Un salon ou un événement prend de la valeur lorsqu’il est relié à un objectif commercial précis et à une préparation en amont.",
      checks: ["Organisateur, dates, lieu et source de confirmation", "Secteurs et exposants pertinents", "Objectif de visite et personnes à rencontrer"],
      next: "Confirmer les informations auprès de l’organisateur avant de planifier une visite. Toute inscription via MajestiOS dépend de la disponibilité d’un parcours dédié."
    };
  }
  if (pathname.includes("reseaux") || pathname.includes("annuaire") || pathname.includes("rejoindre")) {
    return {
      title: "Créer des mises en relation pertinentes",
      purpose: "Le réseau MajestiOS vise à rapprocher des compétences, des événements et des besoins professionnels identifiés, plutôt qu’à juxtaposer des contacts sans contexte.",
      checks: ["Rôle et compétences déclarés par le profil", "Contexte et intérêt de la mise en relation", "Consentement et conditions de partage des coordonnées"],
      next: "Une mise en relation doit rester explicite, contextualisée et maîtrisée par les personnes concernées. L’existence d’une rubrique ne signifie pas qu’un annuaire public est déjà ouvert."
    };
  }
  if (pathname.includes("etudes-de-marche") || pathname.includes("sources") || pathname.includes("methodologie")) {
    return {
      title: "Construire une analyse vérifiable",
      purpose: "Une étude exploitable part d’une question précise, délimite son marché et distingue les données observées des hypothèses à tester.",
      checks: ["Question de départ, territoire et période étudiés", "Sources, date de consultation et limites des données", "Hypothèses, critères de comparaison et décisions attendues"],
      next: "Documenter les sources et leurs limites, puis confronter les conclusions au terrain. Les estimations ne doivent pas être présentées comme des données certaines."
    };
  }
  return {
    title: `Utiliser la rubrique « ${label} »`,
    purpose: "Cette page doit expliquer un besoin professionnel précis, les informations utiles pour y répondre et la manière de passer à l’étape suivante dans MajestiOS.",
    checks: ["Définir l’objectif concret recherché", "Vérifier la source, la date et la fiabilité des informations", "Identifier les critères de décision avant d’agir"],
    next: "Les fonctions en préparation sont signalées comme telles. Les informations et résultats devront être vérifiés avant toute décision ou prise de contact."
  };
}

export default function SiteHub({ pathname, intro, eyebrow = "EXPLORER MAJESTIOS", checklist = [] }: { pathname: string; intro?: string; eyebrow?: string; checklist?: string[] }) {
  const found = findSiteNode(pathname);
  const node = found?.node;
  const children = node?.children ?? [];
  const siblings = found?.ancestors.at(-1)?.children?.filter((item) => item.href !== pathname) ?? [];
  const related = siblings.slice(0, 4);
  const guide = getDetailGuide(pathname, node?.label ?? "cette rubrique");
  const parent = found?.ancestors.at(-1);
  return <main className="site-page site-page-with-sidebar home-layout">
    <HomepageNavigation />
    <div className="site-main">
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link>{found?.ancestors.map((ancestor) => <span key={ancestor.href}><b>/</b><Link href={ancestor.href}>{ancestor.label}</Link></span>)}<span><b>/</b><strong>{node?.label ?? "Rubrique"}</strong></span></nav>
      <section className="page-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{node?.label ?? "Explorer MajestiOS"}<span>.</span></h1>
        <p>{intro ?? node?.description ?? "Explorez les rubriques et les parcours de MajestiOS."}</p>
        <div className="page-hero-meta"><span className={`status-chip ${node?.status === "preparing" ? "status-chip-preparing" : ""}`}><i />{node?.status === "preparing" ? "Parcours en préparation" : children.length ? "Rubriques disponibles" : "Guide pratique"}</span><span>Rubrique dédiée · {parent ? `Parcours : ${parent.label}` : "Navigation MajestiOS"}</span></div>
      </section>
      {children.length > 0 ? <section className="hub-grid" aria-label={`Sous-rubriques de ${node?.label}`}>{children.map((child, index) => <Link href={child.href} className="hub-card" key={child.href}><span className="hub-card-index">{String(index + 1).padStart(2, "0")}</span>{child.status === "preparing" ? <span className="hub-card-status">EN PRÉPARATION</span> : null}<div><h2>{child.label}<span aria-hidden="true">↗</span></h2><p>{child.description}</p></div><span className="hub-card-bottom">EXPLORER LA RUBRIQUE <b>→</b></span></Link>)}</section> : <section className="content-panel">
        <span className="eyebrow">MODE D’EMPLOI</span><h2>{guide.title}</h2><p>{guide.purpose}</p>
        <h3>Les points à examiner</h3><ul>{guide.checks.map((item) => <li key={item}>{item}</li>)}</ul>
        <h3>Avant de passer à l’action</h3><p>{guide.next}</p>
        {checklist.length ? <><h3>Repères complémentaires</h3><ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul></> : null}
      </section>}
      {checklist.length > 0 && children.length > 0 ? <section className="content-panel"><span className="eyebrow">MÉTHODE</span><h2>Avant de passer à l’action</h2><ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
      {related.length > 0 ? <section className="related-section"><div><span className="eyebrow">POUR ALLER PLUS LOIN</span><h2>Rubriques associées</h2></div><div className="related-links">{related.map((item) => <Link href={item.href} key={item.href}>{item.label}<span>↗</span></Link>)}</div></section> : null}
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/faq">Besoin d’aide ?</Link></footer>
    </div>
    </div>
  </main>;
}
