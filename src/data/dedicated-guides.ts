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
  }
};
