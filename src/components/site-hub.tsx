import Link from "next/link";
import PublicHeader from "@/components/public-header";
import { findSiteNode, flattenSiteTree } from "@/data/site-tree";

type DetailGuide = { title: string; purpose: string; checks: string[]; next: string };

function getDetailGuide(pathname: string, label: string): DetailGuide {
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
  if (pathname.includes("bodacc") || pathname.includes("business") || pathname.includes("achat-cession")) {
    return {
      title: "Transformer un signal en piste à qualifier",
      purpose: "Les publications économiques peuvent révéler un changement d’entreprise ou un projet de transmission. Elles constituent un signal de veille, pas une preuve automatique d’un besoin commercial.",
      checks: ["Nature et date de la publication", "Entreprise concernée et informations concordantes", "Pertinence du signal au regard du service proposé"],
      next: "Recouper les informations avec des sources autorisées et récentes avant tout contact. Respecter les règles applicables à la prospection et ne pas déduire de besoins non établis."
    };
  }
  if (pathname.includes("radar-entreprises")) {
    return {
      title: "Détecter les signaux d’évolution d’une entreprise",
      purpose: "Le radar entreprises doit aider à repérer des événements vérifiables pouvant justifier une analyse commerciale : création, changement d’activité, évolution de structure ou implantation.",
      checks: ["Nature du signal et date de publication", "Source d’origine et éléments permettant de confirmer l’information", "Compatibilité avec le secteur, le territoire et l’offre de l’entreprise"],
      next: "Un signal ne prouve pas à lui seul l’existence d’un besoin. Il doit être recoupé, daté et qualifié avant d’être utilisé pour personnaliser une prise de contact."
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
  if (pathname.includes("proposer-evenement")) {\n    return {\n      title: "Proposer un événement à l’écosystème MajestiOS",\n      purpose: "Cette porte d’entrée a vocation à recueillir des événements professionnels utiles aux entreprises : rencontres sectorielles, portes ouvertes, conférences, inaugurations, journées techniques ou rendez-vous de réseau.",\n      checks: ["Organisateur identifiable et coordonnées professionnelles vérifiables", "Intitulé, date, lieu, public visé et conditions de participation", "Autorisation de diffusion et éventuelles modalités d’inscription"],\n      next: "Une proposition doit être vérifiée avant publication. Le dépôt d’un événement ne vaut ni validation, ni partenariat, ni inscription automatique ; le formulaire sera annoncé comme disponible uniquement lorsqu’il sera réellement activé."\n    };\n  }\n  if (pathname.includes("evenements-entreprise")) {\n    return {\n      title: "Relier les événements d’entreprise aux opportunités commerciales",\n      purpose: "Les événements d’entreprise peuvent révéler des occasions de comprendre une activité, rencontrer un acteur ou créer une relation professionnelle : inauguration, ouverture de site, portes ouvertes, lancement, anniversaire, démonstration ou journée de recrutement.",\n      checks: ["Nature de l’événement, organisateur et date confirmés", "Public concerné et intérêt concret pour les entreprises membres", "Angle de contact pertinent, sans supposer un besoin qui n’a pas été exprimé"],\n      next: "MajestiOS doit faire de l’événement un point de départ pour une mise en relation contextualisée : comprendre qui organise, pourquoi l’événement compte et quelle contribution utile peut être proposée. La publication et l’inscription dépendent de sources et de parcours vérifiés."\n    };\n  }\n  if (pathname.includes("rencontres-affaires")) {\n    return {\n      title: "Organiser des rencontres d’affaires utiles",\n      purpose: "Une rencontre d’affaires est plus utile lorsqu’elle rapproche des acteurs complémentaires autour d’un objectif clair : recherche de fournisseur, sous-traitance, besoin de compétence, développement territorial ou échange sectoriel.",\n      checks: ["Objectif et format de la rencontre", "Profils attendus et complémentarité possible", "Accord des participants sur le partage de leurs coordonnées et la suite des échanges"],\n      next: "Privilégier des introductions motivées et explicites plutôt qu’un annuaire de contacts sans contexte. Les invitations, inscriptions et mises en relation ne doivent être présentées comme actives que si le parcours correspondant existe."\n    };\n  }\n  if (pathname.includes("salon") || pathname.includes("evenements")) {
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
      purpose: "Le réseau MajestiOS vise à rapprocher des compétences et des besoins professionnels identifiés, plutôt qu’à juxtaposer des contacts sans contexte.",
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
  const related = siblings.length ? siblings.slice(0, 4) : flattenSiteTree().filter((item) => item.href !== pathname && item.href !== "/" && !item.children?.length).slice(0, 4);
  const guide = getDetailGuide(pathname, node?.label ?? "cette rubrique");
  const parent = found?.ancestors.at(-1);
  return <main className="site-page">
    <PublicHeader />
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link>{found?.ancestors.map((ancestor) => <span key={ancestor.href}><b>/</b><Link href={ancestor.href}>{ancestor.label}</Link></span>)}<span><b>/</b><strong>{node?.label ?? "Rubrique"}</strong></span></nav>
      <section className="page-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{node?.label ?? "Explorer MajestiOS"}<span>.</span></h1>
        <p>{intro ?? node?.description ?? "Explorez les rubriques et les parcours de MajestiOS."}</p>
        <div className="page-hero-meta"><span className="status-chip"><i />{children.length ? "Parcours organisé" : "Fiche de cadrage"}</span><span>Rubrique dédiée · {parent ? `Parcours : ${parent.label}` : "Navigation MajestiOS"}</span></div>
      </section>
      {children.length > 0 ? <section className="hub-grid" aria-label={`Sous-rubriques de ${node?.label}`}>{children.map((child, index) => <Link href={child.href} className="hub-card" key={child.href}><span className="hub-card-index">{String(index + 1).padStart(2, "0")}</span><div><h2>{child.label}<span aria-hidden="true">↗</span></h2><p>{child.description}</p></div><span className="hub-card-bottom">EXPLORER LA RUBRIQUE <b>→</b></span></Link>)}</section> : <section className="content-panel">
        <span className="eyebrow">MODE D’EMPLOI</span><h2>{guide.title}</h2><p>{guide.purpose}</p>
        <h3>Les points à examiner</h3><ul>{guide.checks.map((item) => <li key={item}>{item}</li>)}</ul>
        <h3>Avant de passer à l’action</h3><p>{guide.next}</p>
        {checklist.length ? <><h3>Repères complémentaires</h3><ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul></> : null}
      </section>}
      {checklist.length > 0 && children.length > 0 ? <section className="content-panel"><span className="eyebrow">MÉTHODE</span><h2>Avant de passer à l’action</h2><ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
      <section className="related-section"><div><span className="eyebrow">POUR ALLER PLUS LOIN</span><h2>Rubriques associées</h2></div><div className="related-links">{related.map((item) => <Link href={item.href} key={item.href}>{item.label}<span>↗</span></Link>)}</div></section>
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/comprendre/faq">Besoin d’aide ?</Link></footer>
    </div>
  </main>;
}
