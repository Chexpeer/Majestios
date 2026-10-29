export type DetailGuide = { title: string; purpose: string; checks: string[]; next: string };

export const dedicatedGuides: Record<string, DetailGuide> = {
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
  },
  "/business/veille-bodacc": {
    title: "Exploiter les signaux du BODACC avec méthode",
    purpose: "Les annonces du BODACC peuvent signaler une création, une cession ou une évolution juridique. Elles servent à repérer un contexte à examiner, mais ne prouvent pas à elles seules l’existence d’un besoin commercial.",
    checks: ["Nature exacte de l’annonce et date de publication", "Entreprise concernée, établissement et activité réellement visés", "Recoupement avec des sources récentes et pertinentes pour l’offre proposée"],
    next: "Documenter le signal et son origine, vérifier qu’il est toujours pertinent, puis décider si une prise de contact professionnelle est justifiée. Ne pas présenter une hypothèse comme un fait établi."
  },
  "/business/intelligence-entreprises/creations-implantations": {
    title: "Repérer les créations et nouvelles implantations",
    purpose: "Une création ou une implantation peut générer des besoins en équipements, services, travaux ou recrutement. Le besoin doit toutefois être qualifié selon l’activité, le calendrier et les informations réellement disponibles.",
    checks: ["Date, localisation et nature de l’événement", "Activité de l’entreprise et stade probable du projet", "Adéquation entre le signal et une offre que l’entreprise peut effectivement fournir"],
    next: "Croiser les informations, préciser le motif de contact et privilégier une approche utile au contexte de l’entreprise plutôt qu’une sollicitation générique."
  },
  "/business/intelligence-entreprises/evolutions-activite": {
    title: "Qualifier une évolution d’activité",
    purpose: "Une évolution d’activité, un changement d’adresse ou une extension peut constituer un signal commercial. Sa valeur dépend de la fraîcheur de l’information, de sa fiabilité et de son lien avec une proposition concrète.",
    checks: ["Évolution observée, date et source", "Périmètre concerné : entreprise, établissement ou activité", "Hypothèse de besoin formulée et éléments qui la soutiennent"],
    next: "Séparer les faits des interprétations et ne contacter l’entreprise que si le signal peut être relié à une proposition pertinente et vérifiable."
  },
  "/business/intelligence-entreprises": {
    title: "Construire une lecture commerciale d’une entreprise",
    purpose: "L’intelligence entreprises rapproche des données de contexte pour mieux choisir qui contacter, quand et pour quelle raison. Elle ne doit ni fabriquer des besoins ni remplacer la qualification humaine.",
    checks: ["Identité et activité de l’entreprise", "Signaux datés, sources et niveau de confiance", "Lien explicite entre les informations collectées et la proposition commerciale"],
    next: "Conserver la provenance de chaque signal important, réviser les hypothèses quand de nouvelles informations apparaissent et respecter les règles applicables à l’utilisation des données."
  },
  "/opportunites/emploi/offres": {
    title: "Évaluer une offre d’emploi avant de candidater",
    purpose: "Une offre doit être examinée à partir de son émetteur, de son contenu et de sa date. La présence d’une annonce dans une veille ne signifie pas que le poste est encore ouvert ni que MajestiOS transmet déjà des candidatures.",
    checks: ["Employeur et source d’origine identifiables", "Missions, compétences, lieu et conditions annoncées", "Date de publication et moyen de candidature encore valide"],
    next: "Confirmer l’offre auprès de sa source d’origine et préparer une candidature adaptée. Le dépôt de CV via MajestiOS ne doit être annoncé comme actif que lorsqu’un parcours sécurisé est opérationnel."
  },
  "/opportunites/emploi/missions": {
    title: "Qualifier une mission professionnelle",
    purpose: "Une mission se qualifie par son périmètre, ses livrables, son calendrier et les conditions de réalisation. Un intitulé seul ne permet pas de conclure à sa compatibilité avec un profil.",
    checks: ["Résultat attendu, livrables et responsabilités", "Durée, lieu, disponibilité et modalités contractuelles", "Identité du donneur d’ordre et conditions de rémunération"],
    next: "Clarifier les points manquants avant de s’engager et vérifier les conditions auprès de l’émetteur. Une mise en relation n’est effective que si elle est explicitement organisée."
  },
  "/opportunites/marches-prives/deposer": {
    title: "Préparer le dépôt d’une opportunité privée",
    purpose: "Une annonce privée n’est utile que si le besoin est réel, l’émetteur identifiable et la diffusion autorisée. La modération et la protection des informations confidentielles sont indispensables.",
    checks: ["Identité et qualité du déposant", "Description du besoin, secteur, zone et échéance", "Autorisation de publication et niveau d’information pouvant être rendu public"],
    next: "Préparer les éléments vérifiables sans publier de coordonnées ou de pièces confidentielles non nécessaires. Le dépôt ne vaut pas publication tant que le formulaire et la modération ne sont pas opérationnels."
  },
  "/opportunites/marches-publics/departement": {
    title: "Filtrer les marchés par zone géographique",
    purpose: "Le département peut aider à réduire le volume de consultations, mais il faut distinguer le lieu d’exécution, le siège de l’acheteur et les zones couvertes par le marché.",
    checks: ["Département et lieu réel d’exécution", "Éventuels lots ou interventions multi-départementales", "Capacité logistique et conditions de déplacement de l’entreprise"],
    next: "Vérifier le lieu d’exécution dans le dossier officiel. Le filtre géographique ne doit être considéré comme fiable que si les données de localisation sont correctement normalisées."
  },
  "/comment-et-pourquoi": {
    title: "Comprendre la logique de MajestiOS",
    purpose: "MajestiOS organise une démarche d’intelligence commerciale proactive : repérer un signal, le qualifier, identifier les acteurs pertinents, préparer une prise de contact, puis capitaliser sur les résultats.",
    checks: ["Distinguer une information, un signal et une opportunité qualifiée", "Comprendre le rôle de la vérification humaine dans les décisions", "Relier chaque action à un objectif commercial concret"],
    next: "Partez d’un besoin précis et progressez étape par étape. Une information repérée par un outil ne constitue pas, à elle seule, une recommandation ni une preuve de besoin."
  },
  "/comprendre/glossaire": {
    title: "Comprendre les termes de l’intelligence commerciale",
    purpose: "Ce glossaire doit clarifier les notions utilisées dans la veille, les appels d’offres, la qualification d’entreprise et la prospection, avec des définitions liées à leur contexte métier.",
    checks: ["Lire chaque terme dans le contexte où il est employé", "Distinguer les notions proches et leurs conséquences pratiques", "Vérifier auprès d’une source officielle les termes juridiques ou réglementaires"],
    next: "Si un terme a plusieurs sens, privilégiez celui qui correspond au parcours concerné. Les définitions réglementaires doivent être vérifiées auprès de l’organisme compétent."
  },
  "/espace-professionnel": {
    title: "Préparer son espace professionnel",
    purpose: "L’espace professionnel a vocation à rassembler les informations nécessaires pour suivre les opportunités et les démarches de l’entreprise, sans demander de données inutiles avant qu’un service en ait besoin.",
    checks: ["Identifier l’entreprise et le rôle de la personne qui la représente", "Préparer uniquement les documents requis pour le parcours choisi", "Vérifier les conditions d’accès, de confidentialité et de mise à jour"],
    next: "Ne transmettez pas de pièce sensible par un canal non prévu à cet effet. Un parcours de compte ou de dépôt doit être considéré comme disponible uniquement lorsque son formulaire sécurisé est effectivement activé."
  },
  "/opportunites/emploi/conseils": {
    title: "Préparer une candidature adaptée à une opportunité",
    purpose: "Une candidature pertinente relie les exigences explicites de l’offre aux compétences et expériences réellement démontrables du candidat.",
    checks: ["Vérifier l’employeur, la date et la validité de l’annonce", "Sélectionner les expériences et compétences directement liées au poste", "Préparer des éléments factuels et une prochaine étape claire"],
    next: "Adapter le CV et le message sans exagérer les qualifications. Si l’offre renvoie vers un site tiers, vérifiez les conditions de dépôt et la politique de confidentialité de ce site."
  },
  "/opportunites/emploi/deposer-une-offre": {
    title: "Préparer la publication d’une offre d’emploi",
    purpose: "Une offre doit être suffisamment précise pour permettre aux candidats d’évaluer le poste, et suffisamment vérifiable pour protéger les candidats comme l’employeur.",
    checks: ["Employeur ou recruteur identifiable et autorisé à publier", "Intitulé, missions, lieu, contrat et conditions présentés clairement", "Date de validité, canal de candidature et traitement des données des candidats"],
    next: "Le dépôt ne doit être présenté comme actif que si le formulaire de publication est opérationnel. Avant diffusion, contrôler les informations et limiter la collecte de données personnelles au nécessaire."
  },
  "/opportunites/emploi/metiers": {
    title: "Explorer les métiers à partir des compétences",
    purpose: "Une exploration métier utile rapproche les activités réellement exercées, les compétences attendues et les conditions d’accès, plutôt que de s’arrêter à un intitulé de poste.",
    checks: ["Missions et compétences centrales du métier", "Expérience, formation ou habilitations éventuellement nécessaires", "Secteurs, conditions de travail et évolutions possibles"],
    next: "Comparer plusieurs offres réelles et récentes pour vérifier les attentes du marché. Les intitulés peuvent varier selon les employeurs et ne remplacent pas l’analyse des missions."
  },
  "/reseaux/rejoindre": {
    title: "Rejoindre le réseau professionnel MajestiOS",
    purpose: "Le réseau vise à faciliter des collaborations utiles entre compétences complémentaires, dans un cadre où les rôles, les attentes et les conditions de mise en relation sont explicites.",
    checks: ["Présenter ses compétences et sa contribution possible avec précision", "Définir les secteurs, territoires et types de collaboration recherchés", "Préciser les informations qui peuvent être partagées et avec quel consentement"],
    next: "Une candidature au réseau ne vaut ni admission automatique ni promesse de mission. Les mises en relation doivent rester pertinentes, consenties et vérifiables."
  }
,
  "/comprendre": {
    title: "Comprendre la logique et les limites de MajestiOS",
    purpose: "Cette rubrique explique comment MajestiOS relie la détection d’un signal, sa qualification, l’identification d’acteurs pertinents et la préparation d’une action commerciale. Elle doit aussi distinguer les parcours documentés des fonctionnalités qui restent en préparation.",
    checks: ["Comprendre les six étapes : détecter, qualifier, identifier, contacter, transformer et capitaliser", "Distinguer une source vérifiable, une interprétation et une hypothèse commerciale", "Repérer l’état réel de chaque parcours avant de transmettre des données ou d’attendre un service"],
    next: "Choisissez ensuite le sous-dossier correspondant à votre question : concept, FAQ ou glossaire. Pour toute fonctionnalité annoncée comme en préparation, ne considérez pas le parcours comme opérationnel tant qu’un accès fonctionnel n’est pas explicitement disponible."
  },
  "/opportunites": {
    "title": "Explorer les opportunités professionnelles",
    "purpose": "Ce dossier rassemble plusieurs portes d’entrée vers le développement commercial : consultations publiques et privées, événements professionnels, emploi et missions. Le bon parcours dépend du type d’opportunité recherché et du niveau de preuve disponible.",
    "checks": [
      "Choisir la famille d’opportunités adaptée à l’objectif : marché, événement ou recrutement",
      "Vérifier la date, la source et les conditions propres à chaque annonce",
      "Distinguer une annonce consultable d’un service de dépôt ou de mise en relation réellement activé"
    ],
    "next": "Commencez par le sous-dossier correspondant à votre besoin, puis affinez par secteur, territoire ou nature de prestation lorsque ces filtres existent. Avant toute décision, contrôlez les informations auprès de la source de référence."
  },
  "/opportunites/marches-publics": {
    "title": "Qualifier une consultation publique avant de répondre",
    "purpose": "Ce dossier aide à repérer des consultations publiques et à organiser une première qualification. Une annonce ne suffit pas à décider : il faut consulter le dossier officiel, vérifier les critères et évaluer la capacité réelle de l’entreprise à exécuter le marché.",
    "checks": [
      "Identifier l’acheteur, l’objet, les lots, le territoire et l’échéance",
      "Vérifier les pièces, critères de sélection, exigences techniques et éventuels rectificatifs",
      "Comparer les exigences avec les capacités, les références, le coût complet et les délais disponibles"
    ],
    "next": "Utilisez les catégories de marchés et les filtres territoriaux pour affiner la recherche, puis vérifiez le dossier complet sur la source officielle avant de décider de répondre. La présence d’une opportunité dans MajestiOS ne garantit ni l’éligibilité ni l’attribution."
  },
  "/opportunites/marches-prives": {
    "title": "Détecter et qualifier des besoins du secteur privé",
    "purpose": "Les marchés privés et signaux de besoins d’entreprises peuvent ouvrir des occasions de sous-traitance, de fourniture ou de prestation. La priorité est de distinguer une annonce autorisée et vérifiable d’un simple indice qui doit encore être confirmé.",
    "checks": [
      "Vérifier l’identité de l’annonceur, la source et l’autorisation de diffusion",
      "Qualifier le besoin, le périmètre, la zone, le calendrier et les conditions de réponse",
      "Ne pas révéler de coordonnées ou de détails confidentiels avant que le parcours le permette légitimement"
    ],
    "next": "Explorez les besoins par secteur et respectez les conditions de diffusion. Le dépôt d’une annonce ou l’accès à des coordonnées ne doit être présenté comme disponible que si le parcours correspondant est effectivement activé."
  },
  "/opportunites/salons": {
    "title": "Transformer les salons en occasions de développement",
    "purpose": "Les salons sont utiles lorsqu’ils sont choisis en fonction d’un objectif commercial, d’un secteur et de personnes à rencontrer. Le dossier doit permettre de passer du repérage d’un événement à une préparation concrète, sans confondre information publiée et inscription confirmée.",
    "checks": [
      "Confirmer les dates, le lieu et les conditions auprès de l’organisateur",
      "Choisir les événements en fonction du secteur, du territoire et des profils recherchés",
      "Préparer un objectif, les rencontres utiles et le suivi après l’événement"
    ],
    "next": "Parcourez le calendrier et les filtres disponibles, puis confirmez directement les informations auprès de l’organisateur. Une inscription ou une mise en relation via MajestiOS n’est acquise que si un parcours dédié est effectivement proposé."
  },
  "/opportunites/emploi": {
    "title": "Explorer les offres, missions et parcours métiers",
    "purpose": "Ce dossier réunit des entrées distinctes pour la recherche d’emploi, les missions ponctuelles, la compréhension des métiers et les démarches de recrutement. Chaque annonce doit être évaluée selon sa fraîcheur, ses conditions et l’identité de l’émetteur.",
    "checks": [
      "Choisir entre offre d’emploi, mission ou information métier selon son besoin",
      "Contrôler la date de publication, l’employeur, le lieu, le contrat et les missions",
      "Distinguer les contenus de conseil des fonctionnalités de candidature ou de dépôt réellement actives"
    ],
    "next": "Affinez la recherche à partir du métier et du territoire, puis vérifiez les conditions sur la source de l’annonce. Les parcours de dépôt signalés en préparation ne doivent pas être considérés comme ouverts."
  },
  "/business": {
    "title": "Lire les signaux économiques des entreprises",
    "purpose": "Le dossier Business vise à relier les informations sur les entreprises à des hypothèses de développement commercial : création, implantation, changement d’activité, transmission ou annonce légale. Ces signaux orientent l’analyse mais ne prouvent pas à eux seuls l’existence d’un besoin.",
    "checks": [
      "Identifier la nature et la date du signal ainsi que l’entreprise concernée",
      "Recouper les informations avec des sources pertinentes et à jour",
      "Formuler une hypothèse commerciale vérifiable avant de préparer une prise de contact"
    ],
    "next": "Choisissez le sous-dossier adapté au signal observé, conservez la provenance des informations et vérifiez leur pertinence actuelle. Une évolution juridique ou économique ne doit jamais être présentée comme un besoin confirmé sans éléments supplémentaires."
  },
  "/business/achat-cession": {
    "title": "Structurer un projet d’achat ou de cession d’entreprise",
    "purpose": "Un projet de reprise ou de transmission exige une progression méthodique : clarifier le projet, comprendre l’activité et les risques, examiner les informations disponibles puis préparer les étapes de négociation et d’accompagnement.",
    "checks": [
      "Définir le projet, les critères, le calendrier et les capacités financières",
      "Examiner l’activité, les actifs, les engagements, les risques et la qualité des informations",
      "Prévoir une évaluation argumentée et des vérifications adaptées avant tout engagement"
    ],
    "next": "Accédez au parcours Acheter, Vendre ou Évaluer selon votre situation. Les guides donnent une méthode de préparation et ne remplacent pas les contrôles juridiques, comptables, fiscaux ou financiers nécessaires."
  },
  "/developpement-commercial": {
    "title": "Organiser une démarche de développement commercial",
    "purpose": "Ce dossier relie plusieurs leviers complémentaires : prospection, études de marché, e-réputation et accompagnement aux appels d’offres. Ils doivent servir une même stratégie, fondée sur des informations qualifiées, des priorités explicites et l’apprentissage tiré des résultats.",
    "checks": [
      "Définir l’objectif commercial et le segment d’entreprise visé",
      "Choisir le levier adapté : comprendre le marché, cibler, répondre à un besoin ou à une consultation",
      "Conserver les sources, décisions, résultats et enseignements pour améliorer les actions suivantes"
    ],
    "next": "Choisissez le sous-dossier correspondant à l’étape où vous vous trouvez. Évitez de lancer une action sans motif documenté, proposition adaptée et prochaine étape mesurable."
  },
  "/developpement-commercial/prospection": {
    "title": "Passer du ciblage à une prospection pertinente",
    "purpose": "La prospection MajestiOS est conçue comme un enchaînement de qualification et de mise en relation, et non comme l’envoi indifférencié de coordonnées. Chaque contact doit être justifié par un contexte, une offre pertinente et des règles de sollicitation respectées.",
    "checks": [
      "Définir le profil de cible, le territoire et les critères de pertinence",
      "Documenter le signal qui justifie le contact et la fiabilité de sa source",
      "Préparer un argumentaire adapté, puis consigner réponses, préférences et refus"
    ],
    "next": "Approfondissez le ciblage, les argumentaires ou le suivi selon votre besoin. Une ouverture de message ne vaut pas preuve d’intérêt et un refus doit être respecté et contextualisé."
  },
  "/developpement-commercial/etudes-de-marche": {
    "title": "Éclairer une décision avec une étude de marché",
    "purpose": "Une étude de marché doit répondre à une décision concrète : identifier un segment, évaluer une zone, comparer des concurrents ou tester une hypothèse. Sa qualité dépend du périmètre, de la traçabilité des sources et de la séparation entre faits et interprétations.",
    "checks": [
      "Formuler la question, le territoire, la période et les segments étudiés",
      "Sélectionner des sources adaptées et consigner leur date, leur couverture et leurs limites",
      "Distinguer données observées, estimations, hypothèses et conclusions"
    ],
    "next": "Utilisez les sous-dossiers Méthodologie et Sources pour préparer l’analyse. Toute conclusion importante doit être proportionnée aux données réellement disponibles et vérifiable avant décision."
  },
  "/developpement-commercial/e-reputation": {
    "title": "Suivre et améliorer l’e-réputation avec méthode",
    "purpose": "L’e-réputation aide à comprendre la perception publique d’une entreprise à partir des avis et retours disponibles. L’enjeu est de repérer les tendances, répondre avec mesure et corriger les causes récurrentes, sans fabriquer d’avis ni exposer d’informations confidentielles.",
    "checks": [
      "Identifier les plateformes, la période et le contexte des avis",
      "Distinguer un cas isolé d’une tendance récurrente corroborée",
      "Définir une réponse factuelle et un processus de résolution respectueux de la confidentialité"
    ],
    "next": "Choisissez la veille ou la réponse aux avis selon le besoin. Respectez les règles des plateformes et ne tirez pas de conclusion sur la qualité globale d’une entreprise à partir d’un avis isolé."
  },
  "/developpement-commercial/accompagnement-appels-offres": {
    "title": "Accompagner une réponse aux appels d’offres de bout en bout",
    "purpose": "L’accompagnement vise à structurer la décision de répondre, préparer un dossier conforme, présenter des preuves adaptées aux critères et capitaliser sur le résultat. Il ne consiste pas à promettre l’attribution d’un marché.",
    "checks": [
      "Analyser l’éligibilité, les exigences, les délais et le coût de réponse",
      "Relier chaque critère de jugement à des éléments de preuve réels",
      "Contrôler la cohérence du dossier et enregistrer les enseignements après le résultat"
    ],
    "next": "Progressez entre Préparer, Rédiger et Après un résultat. Les exigences du dossier officiel prévalent toujours et la décision finale doit tenir compte des moyens réellement disponibles."
  },
  "/reseaux": {
    "title": "Construire un réseau professionnel utile et consenti",
    "purpose": "Le réseau MajestiOS vise à rapprocher des entreprises et des compétences complémentaires autour d’un besoin ou d’une contribution identifiable. Sa valeur repose sur le contexte des mises en relation, la fiabilité des profils et le respect du choix de partager des coordonnées.",
    "checks": [
      "Préciser les compétences, besoins, secteurs et territoires concernés",
      "Établir le motif concret de la mise en relation et vérifier les informations déclarées",
      "Respecter le consentement, la confidentialité et les préférences de contact"
    ],
    "next": "Consultez les informations pour rejoindre le réseau et vérifiez l’état du parcours. L’annuaire est signalé comme en préparation : ne supposez pas qu’un répertoire public ou un service d’introduction est déjà ouvert."
  },
  "/opportunites/salons/secteur": {
    title: "Qualifier les salons par secteur professionnel",
    purpose: "Le classement par secteur sert à repérer les événements susceptibles de réunir des clients, donneurs d’ordre ou partenaires pertinents. Il ne suffit pas à garantir la présence d’un public cible ni l’intérêt commercial d’une participation.",
    checks: [
      "Vérifier les thèmes, exposants et profils de visiteurs annoncés par l’organisateur",
      "Comparer l’événement aux objectifs commerciaux, au territoire et au budget disponible",
      "Contrôler les dates, les conditions d’accès et les possibilités de rendez-vous professionnels"
    ],
    next: "Sélectionnez les événements qui correspondent à un objectif mesurable, puis consultez les informations officielles de l’organisateur avant toute inscription ou dépense."
  },
  "/opportunites/salons/region": {
    title: "Préparer une veille événementielle par région",
    purpose: "Le filtre régional aide à organiser la veille événementielle selon les zones de prospection et les contraintes de déplacement. La localisation seule ne démontre ni la pertinence du salon ni la disponibilité de places.",
    checks: [
      "Confirmer le lieu et les dates auprès de l’organisateur officiel",
      "Évaluer le temps de déplacement, les coûts et les rendez-vous envisageables",
      "Relier chaque événement à un secteur, une cible et un objectif commercial concret"
    ],
    next: "Comparez les événements régionaux retenus, vérifiez les informations à jour et définissez à l’avance les contacts ou résultats qui justifieraient la participation."
  },

  "/business/achat-cession/acheter": {
    title: "Préparer la reprise d’une entreprise",
    purpose: "Un projet de reprise exige d’évaluer la cohérence stratégique, la situation économique, les risques et les conditions de transmission avant tout engagement.",
    checks: [
      "Définir le périmètre recherché, le secteur, le territoire et les critères de taille",
      "Examiner les informations financières, juridiques et opérationnelles disponibles avec les professionnels compétents",
      "Identifier les conditions suspensives, besoins de financement et risques à approfondir"
    ],
    next: "Formalisez les critères de reprise puis organisez une analyse documentée avec les conseils adaptés. Une annonce ou un signal de cession ne constitue ni une validation de la valeur ni une garantie de viabilité."
  },
  "/business/achat-cession/vendre": {
    title: "Préparer la cession d’une entreprise",
    purpose: "La préparation d’une cession vise à clarifier le projet, fiabiliser les informations de l’entreprise et organiser un processus maîtrisé, dans le respect de la confidentialité.",
    checks: [
      "Préciser le périmètre de cession, les actifs concernés et les objectifs du dirigeant",
      "Rassembler les données financières, contrats et éléments opérationnels à faire vérifier",
      "Définir les règles de confidentialité et le niveau d’information à partager à chaque étape"
    ],
    next: "Préparez un dossier cohérent et faites évaluer les aspects financiers, juridiques et fiscaux par des professionnels qualifiés avant de solliciter des repreneurs."
  },
  "/business/achat-cession/evaluer-une-entreprise": {
    title: "Structurer l’évaluation d’une entreprise",
    purpose: "L’évaluation d’une entreprise repose sur plusieurs méthodes et sur la qualité des données disponibles. Un indicateur isolé ou une estimation automatique ne remplace pas une analyse contextualisée.",
    checks: [
      "Examiner les résultats, la trésorerie, l’endettement et les éléments exceptionnels",
      "Comparer les méthodes adaptées à l’activité, aux perspectives et aux actifs",
      "Documenter les hypothèses, la date des données et les limites de l’estimation"
    ],
    next: "Utilisez une première analyse pour préparer les questions à approfondir, puis faites confirmer toute valorisation importante par un professionnel compétent."
  },
  "/business/diagnostic": {
    title: "Établir un diagnostic commercial et économique",
    purpose: "Un diagnostic utile rapproche la situation documentée de l’entreprise, ses objectifs et ses contraintes afin de hiérarchiser des actions réalistes plutôt que d’accumuler des constats génériques.",
    checks: [
      "Rassembler les indicateurs de départ et préciser leur période et leur source",
      "Identifier les forces, contraintes et points à confirmer auprès des responsables",
      "Relier chaque priorité proposée à un objectif mesurable et à un responsable"
    ],
    next: "Transformez les constats vérifiés en plan d’action priorisé, puis fixez un calendrier de suivi et des critères permettant d’évaluer les résultats."
  },
  "/reseaux/annuaire": {
    title: "Évaluer la fiabilité d’un annuaire professionnel",
    purpose: "Un annuaire n’est utile que si les profils sont attribués, les compétences contextualisées et la visibilité choisie par les professionnels respectée. Le nombre de fiches ne suffit pas à mesurer sa qualité.",
    checks: [
      "Distinguer les informations déclarées des qualifications ou références vérifiées",
      "Vérifier la date de mise à jour et la provenance des informations affichées",
      "Respecter les choix de visibilité, les préférences de contact et les demandes de correction"
    ],
    next: "Tant que l’annuaire interactif n’est pas ouvert, utilisez cette page comme référentiel de qualité et ne supposez pas que des profils ou coordonnées sont consultables."
  },
};
