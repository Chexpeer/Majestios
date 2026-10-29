import Link from "next/link";
import PublicHeader from "@/components/public-header";
import AnnouncementTicker from "@/components/announcement-ticker";
import ResourceCards from "@/components/resource-cards";
import SectionInteractiveMap from "@/components/section-interactive-map";
import { findSiteNode, flattenSiteTree, siteTree } from "@/data/site-tree";

type EditorialSection = { title: string; body: string; bullets?: string[] };
type EditorialPage = { lead: string; sections: EditorialSection[] };

const editorialPages: Record<string, EditorialPage> = {
  "/opportunites/marches-publics/travaux": {
    lead: "Cette rubrique cible les consultations de travaux : construction, rénovation, entretien, aménagement et interventions techniques. La qualification doit porter autant sur le lot que sur la capacité réelle de l’entreprise à l’exécuter.",
    sections: [
      { title: "Vérifier le périmètre des travaux", body: "Lire l’objet du marché, les lots, le lieu d’exécution, les contraintes de chantier, les certifications éventuelles et les visites obligatoires. Le titre seul ne suffit pas à établir l’adéquation." },
      { title: "Évaluer les moyens nécessaires", body: "Comparer les compétences, les effectifs, les disponibilités, les équipements, les assurances et les références demandées. Repérer les exigences qui nécessiteraient un cotraitant ou un sous-traitant." },
      { title: "Confirmer dans le dossier officiel", body: "Vérifier les pièces, critères, échéances et modalités de dépôt auprès de l’acheteur. Cette sous-rubrique est un point de repère ; elle ne garantit pas qu’un flux filtré par catégorie soit connecté." }
    ]
  },
  "/opportunites/marches-publics/services": {
    lead: "Cette rubrique concerne les prestations de services et missions intellectuelles. L’analyse doit rapprocher le besoin exprimé des compétences, de la méthode, des livrables et des délais que l’entreprise peut réellement proposer.",
    sections: [
      { title: "Identifier les livrables attendus", body: "Relever les objectifs, le périmètre de la mission, les résultats attendus, les indicateurs, les lieux d’intervention et les contraintes de calendrier." },
      { title: "Vérifier les compétences et références", body: "Contrôler les profils requis, les qualifications, les références et les moyens mobilisables. Ne pas déclarer une compétence ou une certification qui ne peut pas être justifiée." },
      { title: "Préparer une réponse conforme", body: "Construire une matrice reliant chaque exigence à une preuve, un responsable et une échéance. Le dossier de consultation fait foi pour toute décision de candidature." }
    ]
  },
  "/opportunites/marches-publics/fournitures": {
    lead: "Les marchés de fournitures portent sur des produits, équipements, consommables et approvisionnements. La pertinence d’une consultation dépend notamment des spécifications, volumes, délais, conditions logistiques et contraintes de maintenance.",
    sections: [
      { title: "Comparer les spécifications", body: "Repérer les caractéristiques obligatoires, normes, compatibilités, quantités, variantes autorisées et modalités d’échantillonnage. Ne pas assimiler une ressemblance commerciale à une conformité technique." },
      { title: "Contrôler la capacité de livraison", body: "Évaluer les stocks, délais d’approvisionnement, transport, installation, service après-vente et continuité d’approvisionnement selon les exigences du marché." },
      { title: "Chiffrer avec prudence", body: "Vérifier les unités, quantités, prix, options, durée, révision éventuelle et coûts logistiques. Les hypothèses de prix doivent être distinguées des engagements fermes." }
    ]
  },
  "/opportunites/marches-publics/departement": {
    lead: "Le filtre territorial aide à réduire le volume de consultations à examiner. Le lieu d’exécution ne doit toutefois pas être confondu avec l’adresse de l’acheteur ou avec une restriction géographique qui ne figure pas dans le dossier.",
    sections: [
      { title: "Choisir un territoire pertinent", body: "Partir des zones réellement couvertes par l’entreprise, de ses moyens de déplacement, de ses sites d’intervention et de ses capacités logistiques." },
      { title: "Vérifier le lieu et les contraintes", body: "Lire les adresses de réalisation, les éventuelles visites, les délais d’intervention et les contraintes d’accès. Un siège d’acheteur situé dans un département ne signifie pas toujours que le marché s’y exécute." },
      { title: "Confirmer la disponibilité du filtre", body: "La page présente la méthode de qualification territoriale. Tant qu’un filtre départemental dédié n’est pas raccordé au moteur de recherche, ne pas interpréter cette page comme un résultat géographique déjà filtré." }
    ]
  },
  "/opportunites/marches-prives/secteur": {
    lead: "Le classement sectoriel des opportunités privées peut faciliter la découverte de besoins publiés par des entreprises ou des donneurs d’ordre. La diffusion d’une annonce privée doit être autorisée et sa source identifiable.",
    sections: [
      { title: "Choisir un secteur utile", body: "Relier le secteur au savoir-faire, aux capacités et à la zone d’intervention de l’entreprise. Un secteur large peut servir au repérage, mais la qualification doit se faire au niveau du besoin précis." },
      { title: "Contrôler l’origine de l’annonce", body: "Vérifier l’émetteur, la date, le périmètre de diffusion, les coordonnées et les conditions de réponse. Ne pas republier des informations confidentielles ou non autorisées." },
      { title: "État actuel du catalogue", body: "Le classement par secteur constitue ici un parcours d’information. Le flux d’annonces privées et son filtrage ne doivent pas être considérés comme actifs tant que leur source et leur modération ne sont pas opérationnelles." }
    ]
  },
  "/opportunites/marches-prives/deposer": {
    lead: "Une annonce privée ne doit être diffusée qu’avec l’accord de son émetteur et après vérification des informations essentielles. Le dépôt, la modération et la publication sont des étapes distinctes.",
    sections: [
      { title: "Préparer les informations", body: "Décrire le besoin, le périmètre, le secteur, la zone, le calendrier, les critères de réponse et un moyen de contact autorisé. Limiter les données personnelles au strict nécessaire." },
      { title: "Prouver l’autorisation de diffusion", body: "Confirmer que la personne qui soumet l’annonce peut en autoriser la publication et préciser les éventuelles restrictions de partage ou de confidentialité." },
      { title: "Ne pas confondre formulaire et publication", body: "Le parcours de contact actuel ne garantit pas encore un dépôt enregistré, une modération ni une publication automatisée. Ces fonctions nécessitent un traitement sécurisé et une validation opérationnelle." }
    ]
  },
  "/opportunites/salons/calendrier": {
    lead: "Un calendrier de salons doit aider à préparer la veille, les rencontres et les actions de suivi. Une date ou un lieu doit être confirmé auprès de l’organisateur avant toute réservation ou planification.",
    sections: [
      { title: "Vérifier les informations pratiques", body: "Confirmer les dates, le lieu, les horaires, le public visé, les conditions d’accès et la date limite d’inscription sur la source officielle de l’organisateur." },
      { title: "Définir l’objectif de visite", body: "Choisir les secteurs, exposants, acheteurs, fournisseurs ou experts à rencontrer. Préparer une proposition de valeur courte et des questions adaptées à chaque rendez-vous." },
      { title: "État du calendrier", body: "Cette page définit les critères d’un calendrier fiable ; elle ne constitue pas à elle seule un agenda actualisé ou un service d’inscription aux événements." }
    ]
  },
  "/opportunites/salons/secteur": {
    lead: "Explorer les salons par secteur permet de rapprocher les événements des marchés ciblés, des innovations et des acteurs à rencontrer. Le classement doit rester lié à l’objectif professionnel recherché.",
    sections: [
      { title: "Définir le secteur et l’objectif", body: "Préciser si la priorité est la veille, la recherche de clients, les fournisseurs, les partenaires de réalisation, le recrutement ou la découverte d’un marché." },
      { title: "Vérifier la pertinence de l’événement", body: "Examiner le programme, la liste des exposants, le profil des visiteurs, les conférences et les modalités de rendez-vous à partir des informations publiées par l’organisateur." },
      { title: "Transformer la visite en réseau", body: "Préparer les contacts utiles, prendre des notes factuelles et convenir d’une suite claire. Ne pas assimiler une présence sur un salon à un accord commercial." }
    ]
  },
  "/opportunites/salons/region": {
    lead: "Le repérage régional des salons aide à organiser les déplacements et à concentrer la veille sur les territoires prioritaires. La région d’un événement ne suffit pas à démontrer sa pertinence commerciale.",
    sections: [
      { title: "Définir le périmètre géographique", body: "Tenir compte du temps de trajet, du coût, des possibilités de rendez-vous et des zones dans lesquelles l’entreprise cherche à développer son activité." },
      { title: "Contrôler la localisation", body: "Confirmer l’adresse, les accès, les dates et les éventuels changements directement auprès de l’organisateur." },
      { title: "État du filtre régional", body: "Cette page expose une méthode de sélection territoriale. Un annuaire de salons actualisé et filtrable doit être raccordé à des données vérifiées avant d’être présenté comme disponible." }
    ]
  },
  "/opportunites/emploi/offres": {
    lead: "La recherche d’offres d’emploi doit permettre de comparer le métier, les compétences, le contrat, le territoire et la date de publication. Une annonce doit être vérifiée avant de transmettre une candidature.",
    sections: [
      { title: "Préciser les critères", body: "Définir le métier, le niveau d’expérience, la zone, le type de contrat, le rythme de travail et les contraintes importantes pour réduire les résultats peu pertinents." },
      { title: "Vérifier l’offre", body: "Contrôler l’employeur, la date, les missions, les conditions, le mode de candidature et la source d’origine. Se méfier des annonces sans émetteur identifiable." },
      { title: "État des offres", body: "Les cartes de rôle présentes dans le prototype ne valent pas confirmation d’un recrutement ouvert. Un flux d’offres externes vérifiées doit être raccordé avant de présenter un catalogue actualisé." }
    ]
  },
  "/opportunites/emploi/missions": {
    lead: "Les missions ponctuelles et indépendantes doivent être qualifiées par leur périmètre, leurs livrables, leur durée, leur statut et leurs conditions de réalisation.",
    sections: [
      { title: "Clarifier le périmètre", body: "Identifier les résultats attendus, le temps estimé, les compétences requises, les outils, le lieu d’intervention et les interlocuteurs décisionnaires." },
      { title: "Sécuriser les conditions", body: "Clarifier le statut contractuel, le budget ou le mode de rémunération, les délais de paiement, la propriété des livrables et les responsabilités." },
      { title: "Confirmer l’existence de la mission", body: "Aucune mission ne doit être considérée comme disponible sur la seule base d’un exemple ou d’un descriptif générique. Vérifier l’émetteur et les conditions avant de s’engager." }
    ]
  },
  "/opportunites/emploi/metiers": {
    lead: "Les repères métiers aident à relier les compétences d’une personne aux besoins d’une entreprise ou à une mission. Les intitulés varient selon les secteurs et doivent être rapprochés des tâches réellement demandées.",
    sections: [
      { title: "Décrire les compétences démontrables", body: "Mettre en avant les activités réalisées, les outils maîtrisés, les certifications vérifiables et les résultats documentables plutôt qu’une liste générique de qualités." },
      { title: "Relier le profil au besoin", body: "Comparer les compétences attendues, le niveau d’autonomie, les contraintes du poste et les possibilités de formation ou d’accompagnement." },
      { title: "Maintenir les repères à jour", body: "Les fiches métiers doivent être révisées à partir de sources professionnelles ou institutionnelles datées. Cette page n’est pas un référentiel exhaustif des métiers." }
    ]
  },
  "/opportunites/emploi/deposer-une-offre": {
    lead: "Une offre d’emploi doit être claire, non trompeuse et suffisamment précise pour permettre aux candidats de comprendre le poste avant de transmettre leurs informations.",
    sections: [
      { title: "Rédiger une annonce complète", body: "Préciser les missions, compétences nécessaires, lieu, contrat, durée, date de prise de poste et modalités de candidature. Distinguer les exigences obligatoires des éléments souhaités." },
      { title: "Protéger les candidats", body: "Ne demander que les données utiles au recrutement, expliquer leur usage et limiter leur accès aux personnes habilitées." },
      { title: "État du dépôt", body: "Le parcours d’intake actuel ne confirme pas encore l’enregistrement, la modération ou la publication d’une offre. Ces étapes doivent être mises en place avant d’annoncer un service de dépôt actif." }
    ]
  },
  "/opportunites/emploi/conseils": {
    lead: "Une candidature ou un recrutement efficace repose sur des informations concrètes, des attentes explicites et un suivi respectueux des personnes.",
    sections: [
      { title: "Pour une candidature", body: "Adapter le CV et le message au poste, illustrer les compétences par des exemples réels et vérifier les coordonnées et pièces jointes avant l’envoi." },
      { title: "Pour un recruteur", body: "Définir les critères utiles au poste, séparer les exigences du souhaitable, conduire une évaluation cohérente et communiquer clairement les étapes du processus." },
      { title: "Garder une trace proportionnée", body: "Consigner les étapes nécessaires au suivi, limiter l’accès aux données des candidats et respecter les obligations applicables à leur conservation." }
    ]
  },
  "/opportunites/radar-entreprises": {
    lead: "Le radar entreprises vise à repérer des signaux publics susceptibles d’éclairer une démarche commerciale : création, changement d’activité, implantation, transmission ou annonce pertinente. Chaque signal doit être vérifié avant interprétation.",
    sections: [
      { title: "Distinguer signal et besoin", body: "Une création ou un changement d’adresse peut ouvrir une question de recherche, mais ne prouve pas qu’une entreprise recherche un fournisseur, un salarié ou un prestataire." },
      { title: "Recouper avant de contacter", body: "Comparer la publication initiale à des sources complémentaires fiables, vérifier la date et l’identité de l’entreprise, puis documenter séparément le fait observé et l’hypothèse commerciale." },
      { title: "Respecter les limites de la veille", body: "Appliquer les règles de réutilisation des sources et de prospection. Le radar ne doit pas être présenté comme un flux opérationnel tant que les sources et le traitement des signaux ne sont pas raccordés." }
    ]
  },
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

function buildContextualEditorial(
  pathname: string,
  node: { label: string; description: string; href: string },
  ancestors: Array<{ label: string; href: string }>
): EditorialPage {
  const parent = ancestors.at(-1);
  const parentLabel = parent?.label ?? "MajestiOS";
  const siblingHint = parent ? `Cette page s’inscrit dans « ${parentLabel} » et complète les autres parcours de cette rubrique.` : "Cette rubrique relie les principales fonctions de MajestiOS.";
  const domain =
    pathname === "/opportunites" ? "opportunites" :
    pathname.startsWith("/opportunites/marches-publics") ? "public" :
    pathname.startsWith("/opportunites/marches-prives") ? "private" :
    pathname.startsWith("/opportunites/salons") ? "salons" :
    pathname.startsWith("/opportunites/emploi") ? "emploi" :
    pathname.startsWith("/opportunites/radar-entreprises") ? "radar" :
    pathname.startsWith("/business/achat-cession") ? "cession" :
    pathname.startsWith("/business") ? "business" :
    pathname.startsWith("/developpement-commercial/etudes-de-marche") ? "etude" :
    pathname.startsWith("/developpement-commercial/e-reputation") ? "reputation" :
    pathname.startsWith("/reseaux") ? "reseau" :
    pathname.startsWith("/comprendre") ? "comprendre" : "general";

  const guidance: Record<string, { lead: string; first: string; second: string; third: string }> = {
    opportunites: {
      lead: "Explorez les marchés publics et privés, les salons professionnels, les offres d’emploi et les signaux d’entreprise depuis un point d’entrée commun. Chaque piste doit être qualifiée avant de devenir une action commerciale.",
      first: "Choisir le type d’opportunité", second: "Filtrer et vérifier les informations", third: "Relier l’opportunité aux autres rubriques MajestiOS"
    },
    public: {
      lead: `${node.description} Cette page aide à préciser la recherche avant d’examiner le dossier de consultation original.`,
      first: "Affiner la recherche", second: "Contrôler les pièces officielles", third: "Relier le marché aux besoins connexes"
    },
    private: {
      lead: `${node.description} Les informations publiées doivent être autorisées, actuelles et suffisamment documentées avant toute prise de contact.`,
      first: "Définir le besoin recherché", second: "Vérifier l’émetteur et les conditions de diffusion", third: "Préparer une démarche de positionnement"
    },
    salons: {
      lead: `${node.description} L’objectif est de transformer un rendez-vous professionnel en occasion de veille et de réseautage préparée.`,
      first: "Vérifier les informations de l’organisateur", second: "Préparer les rencontres utiles", third: "Organiser le suivi après l’événement"
    },
    emploi: {
      lead: `${node.description} Les offres et missions doivent être distinguées des pistes de recrutement encore en préparation.`,
      first: "Préciser le métier et les conditions", second: "Vérifier l’origine et l’actualité de l’offre", third: "Préparer une candidature ou une mission"
    },
    radar: {
      lead: `${node.description} Un signal d’entreprise est un point de départ à vérifier, pas une preuve automatique de besoin ou d’intention d’achat.`,
      first: "Identifier le signal et sa source", second: "Recouper le contexte de l’entreprise", third: "Formuler une hypothèse commerciale vérifiable"
    },
    cession: {
      lead: `${node.description} Une opération de reprise ou de transmission demande de clarifier le projet, les informations disponibles et les vérifications à effectuer.`,
      first: "Définir le projet et son périmètre", second: "Réunir les informations à vérifier", third: "Préparer les prochaines étapes avec les bons interlocuteurs"
    },
    business: {
      lead: `${node.description} Les informations administratives ou économiques doivent être datées, sourcées et séparées des interprétations commerciales.`,
      first: "Décrire le fait observé", second: "Vérifier la source et la date", third: "Évaluer les suites pertinentes sans supposer un besoin"
    },
    etude: {
      lead: `${node.description} Cette étape contribue à une étude exploitable en reliant une question de marché à des sources identifiables et à une méthode explicite.`,
      first: "Définir le périmètre de l’étude", second: "Croiser les sources pertinentes", third: "Documenter les limites et les conclusions"
    },
    reputation: {
      lead: `${node.description} Le suivi de l’e-réputation doit s’appuyer sur des avis accessibles, un contexte vérifié et des réponses proportionnées.`,
      first: "Qualifier l’avis et son contexte", second: "Répondre de façon factuelle et professionnelle", third: "Suivre les tendances sans surinterpréter un avis isolé"
    },
    reseau: {
      lead: `${node.description} Le réseautage intelligent vise des rapprochements utiles entre compétences, besoins et opportunités, dans le respect du choix des personnes.`,
      first: "Préciser la complémentarité recherchée", second: "Vérifier les informations de profil ou d’événement", third: "Proposer une mise en relation claire et consentie"
    },
    comprendre: {
      lead: `${node.description} Cette rubrique explique les principes, les termes et les limites de MajestiOS pour permettre une utilisation éclairée.`,
      first: "Comprendre la méthode", second: "Distinguer vision, fonction active et fonction en préparation", third: "Revenir aux rubriques métier pour appliquer ces repères"
    },
    general: {
      lead: `${node.description} Cette page est un point d’entrée dédié dans le parcours commercial MajestiOS.`,
      first: "Clarifier l’objectif de la démarche", second: "Consulter les informations et sources disponibles", third: "Choisir la prochaine action adaptée"
    }
  };
  const selected = guidance[domain];
  return {
    lead: selected.lead,
    sections: [
      { title: selected.first, body: `Commencez par préciser ce que vous cherchez dans « ${node.label} », le territoire ou le contexte concerné, ainsi que la décision à prendre. Ne retenez que les informations nécessaires à cette démarche.` },
      { title: selected.second, body: `Avant d’agir, contrôlez la source, la date, le périmètre et les éventuelles conditions d’utilisation. Distinguez explicitement les faits constatés, les estimations et les hypothèses. Les fonctions non activées ne doivent pas être présentées comme des services disponibles.` },
      { title: selected.third, body: `${siblingHint} Le parcours doit ensuite conduire vers une action concrète et traçable : approfondir une opportunité, consulter une ressource, préparer un contact ou rejoindre l’espace professionnel si cela est pertinent.` }
    ]
  };
}

export default function SiteHub({ pathname, title, intro, eyebrow = "EXPLORER MAJESTIOS", checklist = [] }: { pathname: string; title?: string; intro?: string; eyebrow?: string; checklist?: string[] }) {
  const found = findSiteNode(pathname);
  const node = found?.node;
  const children = node?.children ?? [];
  const editorial = editorialPages[pathname] ?? (node ? buildContextualEditorial(pathname, node, found?.ancestors ?? []) : undefined);
  const siblings = found ? (found.ancestors.length ? found.ancestors[found.ancestors.length - 1]?.children?.filter((item) => item.href !== pathname) ?? [] : siteTree.filter((item) => item.href !== pathname && item.href !== "/")) : [];
  const relatedByAncestor = found ? [...found.ancestors].reverse().flatMap((ancestor) => ancestor.children?.filter((item) => item.href !== pathname) ?? []) : [];
  const related = siblings.length ? siblings.slice(0, 4) : relatedByAncestor.length ? relatedByAncestor.slice(0, 4) : flattenSiteTree().filter((item) => item.href !== pathname && item.href !== "/" && !item.children?.length).slice(0, 4);
  const pageTitle = node?.label ?? title ?? "Explorer MajestiOS";
  const pageIntro = editorial?.lead ?? intro ?? node?.description ?? "Explorez les rubriques et les parcours de MajestiOS.";
  const tickerFlow = pathname.startsWith("/opportunites/marches-publics") || pathname.startsWith("/developpement-commercial/accompagnement-appels-offres") ? "public" : pathname.startsWith("/opportunites/marches-prives") ? "private" : pathname.startsWith("/opportunites/salons") ? "salons" : pathname.startsWith("/opportunites/emploi") ? "emploi" : pathname.startsWith("/business") || pathname === "/opportunites/radar-entreprises" ? "business" : pathname.startsWith("/reseaux") ? "reseau" : "general";
  const mapItems = children.length > 0 ? children : related;
  const resourceScope = pathname.startsWith("/business") || pathname === "/opportunites/radar-entreprises" ? "business" : pathname.startsWith("/reseaux") || pathname.startsWith("/opportunites/salons") ? "reseaux" : pathname.startsWith("/opportunites/marches-publics") || pathname.startsWith("/developpement-commercial/accompagnement-appels-offres") ? "marches-publics" : pathname.startsWith("/opportunites/marches-prives") ? "marches-prives" : pathname.startsWith("/opportunites/emploi") ? "emploi" : pathname.startsWith("/developpement-commercial/etudes-de-marche") ? "sources" : pathname.startsWith("/developpement-commercial/prospection") ? "prospection" : "general";
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
      {pathname === "/opportunites/marches-publics" ? <section className="content-panel search-entry-panel"><span className="eyebrow">PASSER À LA RECHERCHE</span><h2>Rechercher des avis selon vos critères</h2><p>Précisez les mots-clés, le territoire et la catégorie, puis examinez les résultats disponibles. La fiche officielle reste la référence pour vérifier le dossier et les échéances.</p><Link className="search-submit" href="/opportunites/marches-publics">Lancer la recherche multicritère ↗</Link></section> : null}
      {pathname === "/opportunites/marches-prives" ? <section className="content-panel search-entry-panel"><span className="eyebrow">CATALOGUE PRIVÉ</span><h2>Consulter l’espace des opportunités privées</h2><p>Le catalogue privé n’est pas encore connecté à une source d’annonces vérifiées. Vous pouvez consulter son état actuel ; aucune annonce de démonstration ne sera présentée comme réelle.</p><Link className="search-submit" href="/opportunites/marches-prives">Accéder à l’espace privé ↗</Link></section> : null}
      {editorial?.sections.map((section, index) => <section className="content-panel editorial-panel" key={section.title}>
        <span className="eyebrow">REPÈRE {String(index + 1).padStart(2, "0")}</span>
        <h2>{section.title}</h2>
        <p>{section.body}</p>
        {section.bullets?.length ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
      </section>)}
      <SectionInteractiveMap title={pageTitle} items={mapItems.map((item) => ({ label: item.label, href: item.href, description: item.description }))} />
      {checklist.length > 0 ? <section className="content-panel"><span className="eyebrow">POINTS DE CONTRÔLE</span><h2>Avant de passer à l’action</h2><ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
      {!editorial && children.length === 0 ? <section className="content-panel"><span className="eyebrow">INFORMATIONS DE SERVICE</span><h2>Une démarche documentée et vérifiable</h2><p>Les informations et fonctionnalités seront présentées selon leur disponibilité réelle. Les annonces doivent renvoyer à une source identifiable ; les fonctions en préparation ne doivent pas être confondues avec un service déjà ouvert.</p></section> : null}
      <ResourceCards scope={resourceScope} />
      {children.length > 0 ? <section className="related-section"><div><span className="eyebrow">POUR ALLER PLUS LOIN</span><h2>Rubriques associées</h2></div><div className="related-links">{related.map((item) => <Link href={item.href} key={item.href}>{item.label}<span>↗</span></Link>)}</div></section> : null}
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><nav aria-label="Liens de pied de page"><Link href="/comprendre/faq">Besoin d’aide ?</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/mentions-legales">Mentions légales</Link></nav></footer>
    </div>
  </main>;
}
