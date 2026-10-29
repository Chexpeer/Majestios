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
  "/business/creations-implantations": {
    title: "Repérer les créations et nouvelles implantations",
    purpose: "Une création ou une implantation peut générer des besoins en équipements, services, travaux ou recrutement. Le besoin doit toutefois être qualifié selon l’activité, le calendrier et les informations réellement disponibles.",
    checks: ["Date, localisation et nature de l’événement", "Activité de l’entreprise et stade probable du projet", "Adéquation entre le signal et une offre que l’entreprise peut effectivement fournir"],
    next: "Croiser les informations, préciser le motif de contact et privilégier une approche utile au contexte de l’entreprise plutôt qu’une sollicitation générique."
  },
  "/business/evolutions-activite": {
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
  }
};
