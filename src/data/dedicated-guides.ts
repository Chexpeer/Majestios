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

  "/opportunites/marches-publics/departement": {
    title: "Filtrer les marchés par territoire",
    purpose: "Le département est un critère de présélection, pas une preuve suffisante de proximité ni de faisabilité. Il faut distinguer le lieu d’exécution, l’adresse de l’acheteur et les zones couvertes par le marché.",
    checks: ["Département et lieu exact d’exécution dans l’avis", "Lots et éventuelles interventions sur plusieurs territoires", "Délais de déplacement, moyens mobilisables et contraintes locales"],
    next: "Confirmer la zone dans le dossier officiel. Le filtre géographique ne doit pas masquer les marchés multi-sites ni exclure une consultation pertinente sur la seule base d’une adresse administrative."
  },
  "/opportunites/emploi/offres": {
    title: "Examiner une offre d’emploi",
    purpose: "Évaluer la concordance entre le poste, les compétences, les conditions annoncées et la situation du candidat avant d’engager une démarche.",
    checks: ["Employeur, source originale et date de publication", "Missions, compétences, contrat, rémunération et lieu", "Canal de candidature et pièces demandées"],
    next: "Vérifier que l’offre est toujours active auprès de l’employeur ou de la source d’origine. Ne transmettre aucun document sensible via un parcours non sécurisé."
  },
  "/opportunites/emploi/missions": {
    title: "Qualifier une mission professionnelle",
    purpose: "Une mission doit être évaluée comme une prestation définie, avec un périmètre, des livrables, un calendrier et des conditions d’intervention compréhensibles.",
    checks: ["Besoin exprimé, donneur d’ordre et contexte de la mission", "Livrables, durée, lieu, disponibilité et modalités financières", "Cadre contractuel, responsabilités et conditions de paiement"],
    next: "Faire confirmer les conditions par l’émetteur avant tout engagement. Une description sommaire ne suffit pas à établir la faisabilité ni la rentabilité de la mission."
  },
  "/opportunites/emploi/metiers": {
    title: "Explorer un métier par ses compétences",
    purpose: "Une fiche métier doit aider à comprendre les activités réelles, les compétences attendues et les environnements d’exercice, sans réduire un métier à un intitulé.",
    checks: ["Activités et responsabilités courantes", "Compétences techniques et transversales", "Qualifications, conditions d’exercice et évolutions possibles"],
    next: "Croiser les informations avec des référentiels métiers et des offres récentes. Les exigences peuvent varier selon le secteur, l’employeur et la réglementation applicable."
  },
  "/opportunites/emploi/conseils": {
    title: "Préparer une candidature ou un recrutement",
    purpose: "La préparation consiste à relier le besoin du poste aux éléments concrets du parcours, ou à formaliser clairement les critères d’un recrutement.",
    checks: ["Compétences et preuves correspondant au poste", "CV, présentation et pièces réellement demandées", "Questions à clarifier sur les missions et les conditions"],
    next: "Adapter les éléments au poste visé et vérifier l’identité de l’interlocuteur. MajestiOS ne collecte pas de candidature tant qu’un formulaire sécurisé n’est pas explicitement activé."
  },
  "/opportunites/salons/secteur": {
    title: "Choisir un salon selon son secteur",
    purpose: "Le classement sectoriel aide à repérer les événements susceptibles de réunir les acteurs utiles, mais ne garantit ni la présence d’un décideur ni l’existence d’un besoin commercial.",
    checks: ["Secteur principal et secteurs connexes couverts", "Profil des exposants, visiteurs et organisateurs", "Objectif de visite et coût total de participation"],
    next: "Vérifier les informations sur le site officiel de l’organisateur et préparer une liste de sujets ou de rencontres pertinents avant de s’inscrire."
  },
  "/opportunites/salons/region": {
    title: "Repérer les salons par région",
    purpose: "La région permet de cadrer la recherche d’événements selon les déplacements possibles, la zone commerciale et les marchés que l’entreprise souhaite développer.",
    checks: ["Région, ville et lieu exact de l’événement", "Dates confirmées et conditions d’accès", "Temps de déplacement, budget et public professionnel attendu"],
    next: "Confirmer chaque événement auprès de son organisateur. Ne pas considérer une date indicative ou une ancienne édition comme une prochaine occurrence validée."
  },
  "/reseaux/rejoindre": {
    title: "Rejoindre le réseau MajestiOS",
    purpose: "La contribution au réseau commence par un profil professionnel clair et une proposition de valeur compréhensible : compétences, capacité, territoire et types de collaboration recherchés.",
    checks: ["Identité et activité professionnelle présentées sans ambiguïté", "Compétences, secteurs et zone d’intervention", "Types de collaboration recherchés et informations partageables"],
    next: "Ne communiquer que les données nécessaires et préciser les modalités de contact souhaitées. Le parcours d’inscription n’est actif que si un formulaire sécurisé et ses règles de gestion sont disponibles."
  },
  "/reseaux/annuaire": {
    title: "Comprendre les conditions d’accès à l’annuaire",
    purpose: "Un annuaire utile doit présenter des profils suffisamment qualifiés, expliquer l’origine des informations et maîtriser qui peut consulter ou transmettre des coordonnées.",
    checks: ["Critères de validation des profils et actualisation des informations", "Règles d’accès, de visibilité et de retrait", "Motif professionnel de consultation et modalités de prise de contact"],
    next: "L’annuaire est à considérer comme en préparation tant que les profils, les permissions et le parcours de gestion des données n’ont pas été validés. Aucune coordonnée ne doit être exposée par défaut."
  },
  "/business/creations-implantations": {
    title: "Analyser une création ou une implantation",
    purpose: "Une création ou une nouvelle implantation peut constituer un signal à examiner pour certains fournisseurs ou prestataires, mais ne prouve pas qu’un achat est prévu.",
    checks: ["Date de création ou d’implantation et source vérifiable", "Activité déclarée, établissement concerné et zone d’intervention", "Adéquation entre le contexte observé et l’offre commerciale proposée"],
    next: "Recouper les informations récentes et formuler une hypothèse prudente. Avant tout contact, identifier une raison professionnelle concrète et vérifier les règles applicables."
  },
  "/business/evolutions-activite": {
    title: "Interpréter une évolution d’activité",
    purpose: "Un changement publié peut avoir plusieurs explications. L’analyse doit reconstruire le contexte avant de conclure à une croissance, une difficulté ou un besoin d’achat.",
    checks: ["Nature du changement, date d’effet et source d’origine", "Éléments antérieurs et informations concordantes", "Hypothèses alternatives et conséquences commerciales réellement plausibles"],
    next: "Séparer clairement les faits et les interprétations. Ne pas qualifier une entreprise de fragile ni lui attribuer un besoin sans éléments pertinents, actuels et vérifiables."
  },
  "/business/achat-cession/acheter": {
    title: "Préparer un projet de reprise",
    purpose: "Un projet de reprise doit relier les objectifs de l’acquéreur, la capacité de financement, le périmètre recherché et les vérifications à mener avant une décision.",
    checks: ["Secteur, zone, taille et critères de sélection", "Capacité financière, financement et calendrier", "Comptes, contrats, actifs, passifs, risques et accompagnement professionnel requis"],
    next: "Toute décision nécessite une analyse documentaire et des conseils adaptés. Une annonce ou une donnée publique ne remplace ni l’audit de l’entreprise ni la validation juridique et financière."
  },
  "/business/achat-cession/vendre": {
    title: "Préparer la cession d’une entreprise",
    purpose: "La préparation d’une cession consiste à clarifier le périmètre transmis, réunir les informations fiables et organiser les étapes dans des conditions de confidentialité adaptées.",
    checks: ["Périmètre de cession, actifs, contrats et responsabilités", "Informations comptables et opérationnelles à jour", "Niveau de confidentialité, calendrier et interlocuteurs professionnels"],
    next: "Faire vérifier les documents et les modalités par des professionnels compétents. Ne diffuser aucune information sensible sans cadre approprié ni accord de confidentialité lorsque nécessaire."
  },
  "/business/achat-cession/evaluer-une-entreprise": {
    title: "Préparer une évaluation d’entreprise",
    purpose: "Une évaluation s’appuie sur plusieurs méthodes et sur la qualité des données disponibles. Un prix de cession ne peut pas être déduit d’un seul indicateur ou d’une publication isolée.",
    checks: ["Comptes, trésorerie, dettes et éléments exceptionnels", "Actifs, contrats, dépendance clients et risques", "Méthodes retenues, hypothèses et date de valorisation"],
    next: "Présenter les résultats comme une estimation dépendante de ses hypothèses et faire intervenir un professionnel lorsque l’enjeu le justifie. Cette page ne constitue pas une expertise financière."
  },
  "/comprendre/glossaire": {
    title: "Utiliser le glossaire MajestiOS",
    purpose: "Le glossaire doit stabiliser le vocabulaire utilisé dans les parcours afin que les notions de signal, d’opportunité, de qualification et de prospection soient comprises de la même manière.",
    checks: ["Définition dans son contexte métier", "Différence avec les notions proches", "Source de référence pour les termes techniques ou réglementaires"],
    next: "Une définition commerciale ne remplace pas une définition juridique officielle. Pour toute décision réglementaire, vérifier le texte ou la documentation de l’autorité compétente."
  },

  "/business/intelligence-entreprises": { title: "Relier les signaux d’entreprise à une hypothèse commerciale", purpose: "Cette rubrique rassemble des indices économiques qui peuvent aider à choisir où approfondir une recherche commerciale. Un signal ne démontre jamais, à lui seul, qu’une entreprise recherche un fournisseur.", checks: ["Événement économique daté et source vérifiable", "Activité, établissement et zone concernés", "Lien argumenté entre le signal et l’offre que l’entreprise peut proposer"], next: "Recouper les données, noter leur niveau de fiabilité et conserver la raison précise du ciblage. Les fonctions de collecte automatisée restent en préparation tant que les sources et contrôles ne sont pas raccordés." },
  "/business/achat-cession": { title: "Structurer un projet d’achat ou de cession", purpose: "L’achat et la cession d’entreprise sont deux démarches distinctes, mais elles exigent toutes deux un périmètre clair, des données vérifiées et un traitement confidentiel des informations sensibles.", checks: ["Objectif : reprise, vente ou simple évaluation exploratoire", "Périmètre de l’entreprise, actifs, passifs et contrats concernés", "Documents disponibles, calendrier et professionnels à mobiliser"], next: "Choisir le parcours Acheter, Vendre ou Évaluer selon le besoin réel. Une estimation indicative ne remplace pas une expertise comptable, juridique ou financière." },
  "/developpement-commercial/prospection": { title: "Organiser une prospection qui apprend de ses résultats", purpose: "La prospection MajestiOS doit relier un signal ou un besoin identifié à une cible pertinente, puis à un contact contextualisé et à un retour exploitable.", checks: ["Critères de ciblage reliés à l’offre et au territoire", "Motif de contact vérifiable pour chaque entreprise", "Historique des échanges, relances, réponses et motifs de refus"], next: "Commencer par qualifier la cible, préparer l’argumentaire puis organiser le suivi. La prospection automatisée ne doit pas être considérée comme active sans sources, contrôles et outils effectivement raccordés." },
  "/developpement-commercial/etudes-de-marche": { title: "Définir l’étude avant de chercher les données", purpose: "Une étude de marché utile part d’une décision à préparer : quel segment viser, dans quel territoire, auprès de quels clients et sur quel horizon.", checks: ["Question décisionnelle, secteur, territoire et période", "Sources retenues, date de collecte et limites de couverture", "Critères de comparaison et hypothèses à tester sur le terrain"], next: "Les pages Méthodologie et Sources approfondissent ces deux dimensions. Toute conclusion doit distinguer données observées, estimations et hypothèses ; aucune étude complète automatisée n’est promise à ce stade." },
  "/developpement-commercial/e-reputation": { title: "Faire de la veille d’e-réputation un levier d’amélioration", purpose: "La veille de réputation consiste à comprendre des avis publics dans leur contexte, à repérer les tendances récurrentes et à organiser une réponse professionnelle.", checks: ["Plateforme, date et contexte de chaque avis", "Récurrences documentées plutôt qu’un avis isolé", "Réponse factuelle, proportionnée et conforme aux règles de la plateforme"], next: "Les parcours Surveiller et Répondre aux avis détaillent les actions possibles. Ne publiez pas de faux avis, d’accusations non vérifiées ou de données personnelles." },
  "/developpement-commercial/accompagnement-appels-offres": { title: "Organiser l’accompagnement d’une réponse à un appel d’offres", purpose: "L’accompagnement doit aider à décider s’il faut répondre, structurer les pièces et construire une démonstration cohérente avec les critères de l’acheteur.", checks: ["Éligibilité, lots, calendrier et exigences du dossier", "Capacité opérationnelle et coût complet de la réponse", "Pièces administratives, éléments techniques et critères d’attribution"], next: "Les étapes Préparer, Rédiger et Après un résultat forment un parcours distinct. Le soutien méthodologique ne vaut ni dépôt automatique ni garantie d’attribution." },
  "/opportunites/marches-prives/deposer": {
    title: "Préparer une annonce de marché privé",
    purpose: "Une annonce privée doit être suffisamment précise pour permettre une première qualification, tout en respectant les obligations de confidentialité et les droits du donneur d’ordre.",
    checks: ["Identité professionnelle de l’émetteur et autorisation de diffusion", "Objet, secteur, lieu, calendrier et conditions du besoin", "Informations confidentielles à retirer de la version publique"],
    next: "Le dépôt en ligne reste en préparation. Avant toute publication future, l’annonce devra être contrôlée, modérée et validée par son émetteur ; cette page ne constitue pas un formulaire de dépôt actif."
  },
  "/opportunites/emploi/deposer-une-offre": {
    title: "Préparer la publication d’une offre d’emploi",
    purpose: "Une offre publiable doit décrire le poste de manière compréhensible et permettre au candidat de vérifier l’identité de l’employeur et les conditions principales.",
    checks: ["Employeur identifiable et coordonnées professionnelles vérifiables", "Intitulé, missions, lieu, contrat et conditions annoncées", "Canal de candidature sécurisé et informations personnelles strictement nécessaires"],
    next: "Le formulaire de dépôt n’est pas activé. Ne transmettez pas de CV ni de données personnelles par cette page tant qu’un parcours sécurisé n’a pas été mis en service."
  },
  "/business/veille-bodacc": {
    title: "Exploiter la veille BODACC avec discernement",
    purpose: "Les publications BODACC peuvent signaler des événements juridiques ou économiques concernant une entreprise. Leur interprétation dépend de la nature de l’acte, de sa date et du contexte.",
    checks: ["Type de publication et date de l’événement", "Entreprise et établissement précisément identifiés", "Recoupement avec des sources officielles et actualisées"],
    next: "Une publication n’établit pas à elle seule une intention d’achat ni un besoin commercial. Vérifier le contexte avant de qualifier un prospect et respecter les règles applicables à la prospection."
  },
  "/business/diagnostic": {
    title: "Prioriser les actions à partir d’un diagnostic",
    purpose: "Le diagnostic vise à relier les objectifs de l’entreprise, sa situation et ses moyens afin de déterminer les actions qui méritent réellement d’être engagées.",
    checks: ["Objectifs et indicateurs de départ", "Ressources, contraintes et points de blocage documentés", "Priorités, responsable, échéance et critère de réussite"],
    next: "Distinguer les faits des hypothèses et commencer par une action mesurable. Une recommandation ne doit pas être présentée comme un diagnostic complet si les données nécessaires n’ont pas été recueillies."
  },
  "/opportunites/radar-entreprises": {
    title: "Utiliser le radar d’entreprises comme outil de veille",
    purpose: "Un radar commercial doit mettre en évidence des signaux datés et traçables susceptibles de justifier une qualification, sans présenter une hypothèse comme un besoin avéré.",
    checks: ["Signal détecté, date et source consultable", "Entreprise, activité et territoire confirmés", "Raison explicite pour laquelle le signal correspond à l’offre proposée"],
    next: "Le radar automatisé doit être considéré comme en préparation tant que les sources, le classement et les contrôles ne sont pas validés. Toute piste doit être recoupée avant prise de contact."
  },
  "/espace-professionnel": {
    title: "Comprendre l’espace professionnel",
    purpose: "L’espace professionnel a vocation à réunir les démarches et informations utiles à un utilisateur identifié, avec des accès adaptés aux fonctions réellement disponibles.",
    checks: ["Fonctions activées et conditions d’accès", "Données nécessaires à chaque démarche", "Règles de confidentialité, de sécurité et de gestion des accès"],
    next: "Ne considérez pas la création de compte, le dépôt de documents ou le stockage sécurisé comme actifs tant que les formulaires, les contrôles d’accès et le traitement des données n’ont pas été testés."
  },
  "/nous-rejoindre": {
    title: "Contribuer au développement de MajestiOS",
    purpose: "La rubrique présente les différentes formes de contribution possibles au projet et les compétences utiles à son développement professionnel.",
    checks: ["Rôle ou contribution envisagée", "Expérience, compétences et disponibilité", "Canal de contact et informations à partager"],
    next: "Le fait qu’un rôle soit présenté ne signifie pas qu’un recrutement est ouvert. Vérifier les modalités de contact et ne transmettre que les informations nécessaires."
  },
  "/partenaires": {
    title: "Comprendre les partenariats envisagés",
    purpose: "Un partenariat utile doit répondre à un objectif explicite et définir la complémentarité, les responsabilités et les conditions de coopération entre les parties.",
    checks: ["Objectif et valeur apportée à chaque partie", "Périmètre, responsabilités et modalités de coopération", "Conditions de partage des données et autorisation d’usage des marques"],
    next: "Une rubrique de présentation ne constitue pas une preuve de partenariat signé. Toute collaboration doit être confirmée par les parties concernées avant d’être annoncée comme effective."
  }
};
