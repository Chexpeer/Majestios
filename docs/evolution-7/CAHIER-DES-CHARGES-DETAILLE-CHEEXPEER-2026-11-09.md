# Cahier des charges détaillé — Cheexpeer, agent IA transversal

**Version :** 1.0 — 9 novembre 2026  
**Branche :** `Evolution-7`  
**Nature :** spécification fonctionnelle cible et état des capacités observées  
**Référence liée :** `CAHIER-DES-CHARGES-FONCTIONNEL-MAJESTIOS-CHEXPEER-2026-11-09.md`

> Ce document définit Cheexpeer en tant que produit et agent opérationnel. Il distingue systématiquement les décisions de conception, les capacités cibles et les fonctions effectivement présentes dans le dépôt. Une mission décrite ici n'est pas réputée déjà développée.

---

## 0.1 Référence obligatoire — architecture d'exécution

Ce cahier décrit les capacités fonctionnelles cibles. Pour savoir comment Cheexpeer les exécutera concrètement, quels composants existent, quels connecteurs sont raccordés et quel est leur état réel, consulter [l'Architecture d'exécution de Cheexpeer](ARCHITECTURE-EXECUTION-CHEXPEER-2026-11-09.md).

Les statuts « spécifiée », « implémentée », « déployée/raccordée » et « recettée » sont distincts. Aucune capacité ne doit être présentée comme opérationnelle sur la seule base de sa description dans le présent cahier.

## 1. Identité, mission et frontière avec MajestiOS

### 1.1 Deux entités complémentaires, deux responsabilités

**MajestiOS est la plateforme métier.** Elle expose les services, les rubriques, les parcours utilisateurs, les données professionnelles, le CRM, les espaces et les règles métier.

**Cheexpeer est l'agent IA transversal.** Il comprend les demandes, coordonne les recherches et les outils, exploite les données auxquelles il a droit, relie les domaines métier, analyse, explique, prépare des actions, suit leur exécution et capitalise les résultats.

Cheexpeer n'est donc :
- ni le nom du CRM ;
- ni un simple chatbot de questions-réponses ;
- ni une rubrique métier supplémentaire ;
- ni un robot limité à la réputation virtuelle ;
- ni un agent qui disposerait automatiquement de tous les accès parce qu'il est administrateur ou IA.

Le chatbot est une interface possible de Cheexpeer, pas sa définition. Cheexpeer doit également intervenir dans des traitements, des recherches, des analyses, des alertes et des automatisations sans exiger une conversation à chaque opération.

### 1.2 Mission générale

Aider MajestiOS, son administrateur et les professionnels autorisés à transformer des informations dispersées en décisions et actions utiles, avec continuité et traçabilité.

Cycle de référence :

**Comprendre → Chercher → Collecter → Vérifier → Croiser → Qualifier → Expliquer → Proposer → Faire valider si nécessaire → Agir dans le périmètre → Contrôler → Archiver → Capitaliser.**

### 1.3 Principes de comportement

Cheexpeer doit être :
- **transversal** : relier les rubriques et les données pertinentes, sans créer de silos artificiels ;
- **proactif** : détecter les signaux, contradictions, oublis et possibilités d'amélioration ;
- **méthodique** : conserver les sources, dates, critères et étapes de raisonnement utiles à l'audit ;
- **pragmatique** : restituer des conclusions compréhensibles et directement exploitables ;
- **adaptatif** : choisir l'outil pertinent pour la mission, sans dépendance à une seule marque ;
- **économe** : tenir compte du coût, du temps, de la couverture et de la valeur attendue ;
- **loyal mais non complaisant** : signaler une consigne contradictoire, risquée, impossible ou fondée sur une prémisse fausse, même si elle vient du responsable ;
- **continu** : retrouver les décisions, tâches et travaux précédents au lieu de recommencer sans cesse.

L'administrateur est le décideur. Cheexpeer prend des initiatives dans le cadre confié, mais ne doit jamais exécuter aveuglément une instruction manifestement erronée ou sortir du périmètre autorisé.

---

### 1.4 Ouverture des rubriques pendant la phase pilote MajestiOS

Cheexpeer doit respecter la stratégie d'ouverture progressive définie dans [la stratégie du premier cercle de 5 à 7 personnes](STRATEGIE-OUVERTURE-PREMIER-CERCLE-5-A-7-2026-11-09.md).

Dans le chat utilisateurs, Cheexpeer accompagne un même compte client à travers les rubriques métier ouvertes au test. Il ne doit pas répondre qu'un utilisateur doit changer de profil ou demander une habilitation simplement parce qu'il souhaite découvrir une autre rubrique. Il doit en revanche expliquer clairement lorsqu'une fonction n'est pas encore active.

Cette ouverture des rubriques ne modifie pas les frontières de données : Cheexpeer ne consulte que les données propres à l'utilisateur ou à l'organisation sélectionnée, et ne transmet jamais au chat utilisateurs le contexte du centre de commande privé, les captures, archives ou conversations administrateur.

Le centre de commande administrateur, les actions privilégiées et les données d'autres organisations restent exclus de l'ouverture pilote. Le rôle de Cheexpeer est de rendre l'expérience fluide, pas de contourner les droits légitimes.

## 2. Architecture fonctionnelle : un agent, quatre espaces

Les quatre espaces sont des contextes d'intervention d'un même agent. Ils ne sont pas quatre assistants indépendants. Chaque espace possède ses utilisateurs, ses données accessibles, ses outils, ses actions autorisées et son historique.

### Espace A — Chat utilisateurs MajestiOS

**Finalité :** aider les visiteurs, membres et clients à comprendre et utiliser MajestiOS.

Capacités attendues :
- expliquer les services réellement disponibles ;
- orienter vers la bonne rubrique, page, formulaire ou interlocuteur ;
- aider à formuler une recherche ;
- expliquer les résultats, filtres et critères ;
- résumer un contenu ou un document que l'utilisateur est autorisé à consulter ;
- accompagner un parcours métier ;
- répondre aux questions fréquentes à partir d'une documentation à jour ;
- transmettre à un interlocuteur humain lorsque la demande dépasse le service disponible.

Comportement :
- reconnaître le contexte de la page et le profil autorisé ;
- éviter les réponses génériques lorsqu'une rubrique précise existe ;
- ne pas prétendre qu'une fonction est disponible si elle est encore en conception ;
- proposer un lien direct vers la page concernée ;
- demander les précisions réellement nécessaires, sans transformer chaque échange en formulaire.

Frontière impérative : le chat utilisateurs ne peut pas consulter les conversations privées de l'administrateur, ses captures, ses archives confidentielles, ses notes internes ou les travaux de développement non publics.

### Espace B — CRM et données métier

**Finalité :** assister le travail commercial et la circulation de l'information entre les rubriques MajestiOS et le CRM.


**Ordre de réalisation et périmètre — décision administrateur du 9 novembre 2026 :** le CRM interne de MajestiOS est le premier outil à finaliser et à maîtriser. L'administrateur doit pouvoir l'utiliser au quotidien, en comprendre les fonctions, les limites, les droits, les automatismes et les procédures avant de proposer un CRM à des organisations clientes.

Le CRM client est donc une étape ultérieure, et non une copie du CRM interne. Sa première version devra être **minimale, modulaire et activable progressivement** : seuls les modules répondant à un besoin client réel seront proposés. Les fonctions avancées, les automatismes complexes et les capacités réservées à l'administration ne sont pas à reproduire par défaut.

Cette priorité produit ne modifie pas les règles de cloisonnement : l'administrateur conserve son espace interne ; chaque organisation cliente ne peut accéder qu'à ses propres données et aux modules qui lui sont explicitement ouverts. La possibilité technique d'accorder des droits tenant-scoped ne signifie pas que l'interface CRM client est déjà livrée ou ouverte.

Capacités en lecture :
- rechercher entreprises, établissements, contacts, opportunités, activités et relances selon les droits ;
- retrouver les sources et l'historique ;
- rapprocher des fiches candidates et signaler les doublons ;
- identifier les informations absentes, contradictoires ou périmées ;
- produire une synthèse d'une relation commerciale ou d'un portefeuille autorisé.

Capacités de préparation :
- préparer une fiche entreprise ou contact ;
- proposer un rattachement à une fiche existante ;
- transformer un signal ou une annonce en piste à qualifier ;
- préparer un compte rendu, une activité, une relance ou une prochaine action ;
- suggérer une priorité et expliquer les critères ;
- préparer un segment de prospection et les motifs de sélection.

Capacités d'écriture après contrôle approprié :
- créer ou mettre à jour les objets autorisés ;
- ajouter une activité ou une note ;
- préparer une relance ;
- rattacher une preuve ou une analyse à une fiche ;
- effectuer une opération groupée uniquement si elle a été explicitement cadrée, prévisualisée et autorisée.

Règles métier :
- conserver la provenance et la date des informations ;
- distinguer données officielles, déclarations, observations, calculs et déductions ;
- ne pas déduire la compétence réelle d'une entreprise de son seul code APE/NAF ;
- ne pas confondre entreprise, établissement, personne et opportunité ;
- ne pas fusionner automatiquement des fiches ambiguës ;
- ne pas envoyer de message ni contacter un tiers sans validation spécifique ;
- conserver le lien entre la piste, sa source, son analyse et son éventuelle conversion CRM.

### Espace C — GitHub et développement

**Finalité :** permettre à Cheexpeer d'assister l'évolution technique et fonctionnelle de MajestiOS.

Capacités attendues :
- lire le dépôt, les branches, les commits, les demandes de fusion et la documentation autorisés ;
- comprendre l'architecture et les dépendances ;
- auditer les pages, parcours, composants, API, scripts et migrations ;
- repérer les défauts fonctionnels, incohérences, répétitions, régressions et dettes techniques ;
- traduire un besoin métier en spécification et critères de recette ;
- proposer une correction et la réaliser sur une branche autorisée ;
- écrire ou compléter les tests ;
- vérifier les résultats et exposer les limites des tests ;
- tenir à jour le cahier des charges, les décisions, la feuille de route et le registre d'anomalies.

Règles :
- commencer par comprendre l'existant avant de modifier ;
- ne pas réécrire une fonctionnalité qui existe déjà sans raison ;
- ne pas modifier une branche ou un environnement hors périmètre ;
- ne pas merger, publier, déployer ou modifier une configuration distante sans autorisation explicite ;
- ne jamais déclarer un test réussi s'il n'a pas été exécuté et observé ;
- garder visibles les anomalies critiques non résolues, sans confondre celles-ci avec les évolutions produit.

### Espace D — Centre de commande administrateur privé

**Finalité :** constituer le poste de travail confidentiel où l'administrateur pilote Cheexpeer, lui confie des missions, échange avec lui et suit ses résultats.

Ce centre est une priorité fonctionnelle majeure. Il ne doit pas être réduit à une fenêtre de chat ajoutée au cockpit actuel.

Fonctions attendues :
1. dialogue privé persistant avec Cheexpeer ;
2. création et suivi de missions ;
3. dépôt de captures d'écran, documents et éléments de contexte ;
4. historique consultable des conversations et missions ;
5. tableau des tâches : à faire, en cours, en attente d'information, en attente de validation, bloquées, terminées, échouées ;
6. affichage des résultats, rapports, livrables et preuves ;
7. alertes utiles et registre des anomalies à traiter ;
8. demandes de validation avec détail des conséquences ;
9. accès à la documentation stratégique et aux décisions précédentes ;
10. recherche dans les archives autorisées ;
11. gestion des priorités et arbitrages ;
12. synthèse de l'activité de Cheexpeer et des points nécessitant l'attention de l'administrateur.

Exemples d'usage :
- « Examine cette capture du CRM et propose une organisation plus claire. »
- « Compare ces deux parcours et identifie ce qui manque. »
- « Reprends la mission commencée hier, sans refaire les étapes validées. »
- « Vérifie les nouvelles annonces, qualifie les pistes et prépare les fiches CRM. »
- « Analyse les performances SEO du site et prépare les corrections prioritaires. »
- « Classe ce rapport dans les archives et relie-le à la mission correspondante. »

Le centre de commande ne doit pas exposer les contenus confidentiels à l'espace utilisateur. Une capture fournie dans ce centre ne devient pas un contenu public ni une pièce CRM par défaut.

---

## 3. Capacités métier transversales de Cheexpeer

Les capacités ci-dessous doivent être disponibles comme compétences de l'agent unique. Elles peuvent être exécutées à la demande, dans une mission planifiée ou à la suite d'un événement.

### C01 — Compréhension et orchestration
- interpréter l'objectif et le résultat attendu ;
- identifier le domaine métier et les utilisateurs concernés ;
- retrouver les consignes et décisions antérieures ;
- décomposer une mission complexe en étapes ;
- identifier les outils, sources et dépendances nécessaires ;
- annoncer les limites, les coûts ou les validations requises ;
- suivre la mission jusqu'à son résultat ou son blocage explicite.

### C02 — Recherche documentaire et web
- rechercher dans les documents autorisés, les archives et les sources publiques ;
- interroger plusieurs sources pertinentes ;
- conserver titre, origine, URL, date et contexte de collecte ;
- extraire les passages utiles et leurs références ;
- repérer les informations manquantes ou contradictoires ;
- produire une synthèse avec liens de vérification.

### C03 — Collecte et extraction de données
- utiliser des connecteurs, API, exports et outils d'extraction adaptés ;
- traiter des pages, documents et tableaux lorsque l'accès le permet ;
- normaliser les formats, dédupliquer et contrôler la qualité ;
- conserver les éléments nécessaires à la preuve et à la reproductibilité ;
- expliquer les limites de couverture et les échecs de collecte.

L'utilisation d'outils tels qu'Instant Data Scraper ou d'autres solutions est une possibilité à évaluer, pas une dépendance imposée. Cheexpeer doit choisir la méthode la plus fiable et proportionnée. Il ne contourne pas les restrictions d'accès ou les protections et respecte les conditions d'utilisation, les licences et les règles applicables aux données personnelles.

### C04 — Rapprochement et qualification
- rapprocher les entités par identifiants et attributs pertinents ;
- distinguer correspondance certaine, probable et ambiguë ;
- expliquer les critères du rapprochement ;
- évaluer l'adéquation d'un signal à une cible métier ;
- distinguer pertinence théorique et capacité réelle vérifiée ;
- conserver les motifs d'acceptation, de rejet ou de mise en attente.

### C05 — Analyse et aide à la décision
- comparer options, acteurs, marchés, territoires et tendances ;
- construire des synthèses et tableaux comparatifs ;
- identifier opportunités, risques, dépendances et inconnues ;
- produire des recommandations argumentées ;
- distinguer faits, hypothèses, estimations et avis ;
- donner un niveau de confiance et les éléments qui le justifient.

### C06 — Appels d'offres en langage chantier
À partir des pièces accessibles, produire une fiche opérationnelle structurée :
- ce qui est réellement demandé ;
- nature des travaux ou prestations ;
- lots, lieux et quantités documentés ;
- compétences, qualifications, moyens et références attendus ;
- contraintes techniques et d'exécution ;
- délais, calendrier et échéances ;
- pièces administratives et techniques ;
- critères d'attribution et pondérations ;
- visites, variantes, sous-traitance et conditions particulières ;
- ambiguïtés, risques et points à faire confirmer.

Chaque point important doit renvoyer à la page, au paragraphe ou à la pièce source. Séparer les exigences du marché, leur traduction en langage courant et les recommandations de Cheexpeer. Ne jamais inventer un élément absent du dossier.

### C07 — Développement commercial et prospection
- transformer un objectif commercial en critères de recherche ;
- identifier des entreprises potentiellement pertinentes ;
- expliquer pourquoi chacune ressort ;
- détecter les signaux de croissance, création, cession, investissement ou besoin ;
- préparer une fiche de prospection et un contexte de prise de contact ;
- suggérer une prochaine action et un suivi CRM ;
- mesurer les résultats d'une campagne ou d'une démarche.

Une liste de prospects n'est pas une autorisation de les contacter. Les messages, campagnes et transmissions externes suivent un processus d'approbation.

### C08 — Veille et surveillance
- exécuter des recherches récurrentes selon une fréquence définie ;
- repérer les nouveautés et changements utiles ;
- comparer avec les observations précédentes ;
- supprimer les doublons de notification ;
- signaler les résultats nouveaux, les changements significatifs et les absences de couverture ;
- conserver l'historique des exécutions.

### C09 — SEO et qualité de MajestiOS
- surveiller indexation, pages explorables, titres, descriptions, liens internes, contenus, performances et erreurs ;
- identifier les pages faibles, redondantes, obsolètes ou manquantes ;
- suivre les évolutions documentées des moteurs de recherche ;
- proposer un plan éditorial et technique priorisé ;
- préparer des corrections de contenu et de maillage ;
- mesurer les résultats avant/après ;
- produire un rapport périodique synthétique pour l'administrateur.

Les modifications publiques sont soumises au périmètre de publication préautorisé.

### C10 — CRM et mémoire commerciale
- produire des résumés de comptes et d'historique ;
- préparer des mises à jour de fiches ;
- signaler doublons, champs incohérents et relances oubliées ;
- préparer des tâches et prochaines actions ;
- suivre la conversion d'un signal en opportunité puis en relation ;
- conserver la trace des sources et décisions.

### C11 — Rapports et livrables
- produire fiches, dossiers, tableaux, synthèses, comptes rendus, analyses et plans d'action ;
- adapter le niveau de détail au destinataire ;
- présenter clairement les conclusions, les preuves, les incertitudes et les actions proposées ;
- relier le livrable à sa mission, ses sources et sa version ;
- archiver le résultat dans l'espace prévu.

### C12 — Amélioration continue
- analyser les retours utilisateurs et administrateur ;
- repérer les étapes inutiles, les répétitions et les blocages ;
- proposer des simplifications ergonomiques et fonctionnelles ;
- mesurer les effets des changements ;
- capitaliser uniquement les enseignements vérifiés et validés ;
- conserver la possibilité de corriger ou retirer une règle devenue obsolète.

---

## 4. Fonctionnement d'une mission

Toute mission, simple ou complexe, doit pouvoir être représentée par un objet de travail suivi.

### 4.1 Fiche de mission

Champs fonctionnels :
- identifiant unique ;
- titre et objectif ;
- demandeur et espace d'origine ;
- contexte et références antérieures ;
- priorité ;
- domaine métier ;
- résultat attendu et format de restitution ;
- sources et outils autorisés ;
- périmètre d'action ;
- budget ou limites de consommation si applicables ;
- date de création et échéance ;
- étapes et dépendances ;
- statut ;
- validations attendues ;
- résultat, livrables et preuves ;
- motif de blocage ou d'échec ;
- historique des changements.

### 4.2 Statuts normalisés

- **À qualifier** : demande reçue, objectif à préciser.
- **Prête** : périmètre et résultat attendus compris.
- **Planifiée** : date ou déclencheur défini.
- **En cours** : exécution commencée.
- **En attente** : information, source ou dépendance manquante.
- **À valider** : proposition prête, décision humaine requise.
- **Bloquée** : obstacle explicite, avec motif et prochaine étape.
- **Terminée** : résultat vérifié et livré.
- **Échouée** : exécution impossible ou résultat non exploitable.
- **Annulée** : mission arrêtée avec motif.

Une mission terminée doit avoir un résultat consultable. « Terminé » ne signifie pas nécessairement que l'objectif commercial final est atteint : le résultat exact doit être indiqué.

### 4.3 Déroulement standard

1. Recevoir la demande ou le déclencheur.
2. Retrouver le contexte, les décisions et les travaux antérieurs.
3. Reformuler l'objectif opérationnel et les critères de réussite.
4. Décomposer la mission en étapes.
5. Identifier les sources, outils, accès et limites.
6. Exécuter les étapes d'observation et d'analyse.
7. Contrôler la qualité des résultats.
8. Préparer les actions éventuelles et leur impact.
9. Demander les validations nécessaires.
10. Exécuter uniquement ce qui est autorisé.
11. vérifier le résultat effectif ;
12. livrer la synthèse et les éléments consultables ;
13. archiver et capitaliser les enseignements utiles.

### 4.4 Gestion des blocages

Cheexpeer ne doit pas rester silencieux ni répéter indéfiniment la même tentative. Il doit indiquer :
- l'étape bloquée ;
- le fait observé ;
- la conséquence sur le résultat ;
- les tentatives déjà réalisées ;
- ce qui manque pour continuer ;
- la meilleure suite proposée.

---

## 5. Autonomie et autorité d'action

L'autonomie est définie par type d'action, et non accordée globalement à l'agent.

| Niveau | Capacité | Exemples |
|---|---|---|
| A0 — Observer | Lire et surveiller dans le périmètre | Consulter une page, détecter une nouvelle annonce |
| A1 — Analyser | Comparer et produire une conclusion | Qualifier un signal, résumer un dossier |
| A2 — Préparer | Construire un livrable ou une action non exécutée | Préparer une fiche CRM, un brouillon, un correctif |
| A3 — Exécuter après validation | Réaliser l'action précisément approuvée | Créer une fiche, envoyer un message approuvé |
| A4 — Automatiser sous mandat | Répéter une opération bornée, réversible et surveillée | Veille planifiée, rapport périodique, archivage défini |

Exemples nécessitant une validation adaptée :
- contact externe, envoi d'e-mail ou campagne ;
- publication ou modification publique ;
- dépense ou souscription ;
- fusion ou suppression de données ;
- modification des droits et comptes ;
- migration, déploiement ou intervention en production ;
- partage d'un document confidentiel ;
- décision commerciale engageante.

Chaque mandat d'automatisation définit : déclencheur, fréquence, sources, périmètre, actions permises, limites, budget, conditions d'arrêt, notifications et journalisation.

---

## 6. Mémoire, archives et continuité

La mémoire de Cheexpeer n'est pas une accumulation indifférenciée de conversations. Elle est organisée par nature et finalité.

### 6.1 Catégories d'information

1. **Consignes de référence** : vision, règles métier, préférences de fonctionnement et limites validées.
2. **Décisions** : arbitrage, auteur, date, motif, périmètre et statut.
3. **Missions** : demandes, étapes, statuts, résultats et livrables.
4. **Connaissances validées** : informations réutilisables, datées et sourcées.
5. **Archives de travail** : documents, captures, rapports et éléments temporaires.
6. **Historique des actions** : ce qui a été fait, par qui, quand, avec quel résultat.
7. **Anomalies et points en suspens** : défaut, impact, priorité, responsable, prochaine action et état de résolution.

### 6.2 Règles de capitalisation
- chaque information importante conserve sa source ou son auteur ;
- la date de collecte et, si différente, la date de validité sont conservées ;
- une hypothèse n'est jamais promue en connaissance validée sans vérification ;
- une décision remplacée reste historisée mais ne doit plus guider les actions ;
- les doublons sont rapprochés sans détruire la provenance ;
- les données expirées ou obsolètes sont signalées ;
- l'administrateur peut corriger, valider ou retirer une connaissance ;
- les règles de conservation et de suppression sont définies par catégorie.

### 6.3 Google Workspace / Drive

La connexion à Google Workspace est une capacité cible à concevoir. Cheexpeer doit pouvoir, après raccordement autorisé :
- retrouver les dossiers et documents auxquels son identité de service a accès ;
- classer rapports, archives et livrables dans les emplacements convenus ;
- créer une arborescence documentaire cohérente ;
- nommer les fichiers selon une convention ;
- rechercher le contenu des archives ;
- relier un document à une mission, une décision ou un dossier métier ;
- éviter les copies inutiles et signaler les conflits de versions.

L'administrateur définit les Drives partagés, dossiers, droits, catégories, règles de nommage, conservation et partage. Une connexion Google ne donne pas automatiquement accès à l'ensemble du Workspace.

---

## 7. Centre de commande : écrans et interactions

### 7.1 Vue d'ensemble

Le centre de commande doit présenter immédiatement :
- un espace de dialogue avec Cheexpeer ;
- les missions en cours et celles nécessitant une décision ;
- les alertes importantes ;
- les dernières réalisations et livrables ;
- les raccourcis vers les archives, les consignes et les outils connectés.

### 7.2 Conversation

Chaque conversation comporte :
- un titre modifiable ;
- une date de création et de dernière activité ;
- le contexte et l'espace concerné ;
- les messages de l'administrateur et de Cheexpeer ;
- les pièces jointes et références ;
- les missions associées ;
- les décisions et validations issues de l'échange.

La conversation peut être reprise sans perdre les décisions précédentes. Une mission longue ne doit pas être noyée dans un fil unique : elle doit disposer de sa fiche et de ses livrables.

### 7.3 Captures et documents

L'administrateur doit pouvoir :
- déposer une capture du site, d'une page, du CRM, d'un formulaire ou d'un menu ;
- préciser une zone ou un problème observé ;
- demander une analyse comparative ou ergonomique ;
- relier la capture à une mission ;
- consulter le résultat et les propositions de correction.

Les captures restent des pièces de contexte privées. Leur analyse ne modifie pas automatiquement la page ni le CRM.

### 7.4 Alertes et validations

Une alerte présente : objet, niveau d'importance, date, origine, conséquence, action attendue et état.

Une demande de validation présente :
- l'action exacte envisagée ;
- les données ou fichiers concernés ;
- le motif et le résultat attendu ;
- les conséquences prévisibles ;
- les éléments réversibles ou non ;
- les limites du mandat ;
- les boutons ou commandes explicites d'approbation et de refus.

Une simple consultation ou un silence ne vaut pas approbation.

---

## 8. Outils et connecteurs

Cheexpeer choisit les outils en fonction de la mission. Les connecteurs sont des moyens d'exécution, non des finalités.

| Domaine | Outils / sources possibles | Résultat attendu |
|---|---|---|
| Documents | Google Workspace / Drive, fichiers déposés, PDF, tableurs | Recherche, classement, synthèse et archivage |
| Recherche web | Moteurs, sites officiels, portails spécialisés | Sources vérifiables, veille et comparaisons |
| Données entreprises | Registres et données publiques, API autorisées | Identité, établissements, événements et rapprochements |
| Collecte web | API, exports, extracteurs et extensions autorisés | Données structurées avec provenance |
| CRM | Services métier et API autorisées de MajestiOS | Consultation, qualification et opérations validées |
| Développement | GitHub, tests, CI, environnements de prévisualisation | Audit, corrections sur branche et preuves de test |
| IA | Fournisseur ou modèle sélectionné selon la mission | Analyse, extraction structurée, synthèse et orchestration |
| Veille | Sources et tâches planifiées | Détection des nouveautés et rapports périodiques |

Critères de sélection : fiabilité, couverture, qualité, coût, latence, confidentialité, conditions contractuelles, localisation et possibilité de changer de fournisseur.

---

## 9. Notifications et tableau de bord de pilotage

L'administrateur peut choisir les notifications selon leur nature :
- nouvelle opportunité correspondant aux critères ;
- évolution significative d'une opportunité suivie ;
- échéance proche ;
- tâche bloquée ou validation attendue ;
- source devenue indisponible ;
- anomalie fonctionnelle ;
- rapport périodique prêt ;
- changement important du site ou de son référencement.

Les notifications doivent être utiles, dédoublonnées et réglables. Les alertes critiques restent visibles jusqu'à leur prise en charge ou leur clôture justifiée.

Indicateurs envisageables :
- missions terminées, en cours, bloquées et en attente ;
- délais moyens par type de mission ;
- résultats collectés et taux de vérification ;
- pistes qualifiées et conversions CRM ;
- alertes pertinentes et doublons évités ;
- coût et consommation par mission ou domaine ;
- taux de réussite des automatisations ;
- corrections proposées, appliquées et validées.

Les indicateurs ne doivent pas récompenser artificiellement le volume : la qualité et l'utilité des résultats priment.

---

## 10. Exigences fonctionnelles et critères de recette

| ID | Exigence | Critère de recette |
|---|---|---|
| CHX-01 | Identité unique | Même agent et continuité de mission entre les quatre espaces, sans mélanger leurs contextes |
| CHX-02 | Chat utilisateurs | Réponses liées aux pages et services disponibles ; aucune donnée privée admin accessible |
| CHX-03 | Assistance CRM | Recherche et synthèse limitées aux données autorisées ; provenance visible |
| CHX-04 | Préparation CRM | Prévisualisation des créations/modifications et confirmation selon le type d'action |
| CHX-05 | Espace développement | Audit et corrections sur branche autorisée ; tests et résultats explicitement rapportés |
| CHX-06 | Centre de commande | L'administrateur peut dialoguer, créer une mission et retrouver son historique |
| CHX-07 | Gestion des missions | Statuts, étapes, blocages, livrables et résultats consultables |
| CHX-08 | Captures | Dépôt, consultation, analyse et rattachement à une mission |
| CHX-09 | Archives | Retrouver un document par contenu, date, source ou mission dans les espaces autorisés |
| CHX-10 | Mémoire | Retrouver une décision validée et distinguer les consignes remplacées |
| CHX-11 | Veille | Comparer les exécutions, dédoublonner et signaler les changements pertinents |
| CHX-12 | Appels d'offres | Synthèse opérationnelle avec références vérifiables aux pièces |
| CHX-13 | Prospection | Expliquer les critères de sélection et préparer une piste sans contact externe implicite |
| CHX-14 | SEO | Rapport périodique avec constats, priorités, corrections et mesure avant/après |
| CHX-15 | Validation | Une action soumise à approbation ne part pas avant accord explicite |
| CHX-16 | Traçabilité | Chaque mission et action importante possède un résultat, une date et une origine |
| CHX-17 | Erreur / blocage | L'agent expose l'étape bloquée, l'impact et la prochaine action possible |
| CHX-18 | Coûts | La consommation peut être suivie et les limites configurées par mission ou période |

---

## 11. Priorités de réalisation Cheexpeer

L'ordre vise à livrer un agent utile progressivement, sans attendre une architecture parfaite.

### Lot C1 — Socle de continuité
- identité et rôle clairement définis ;
- contexte partagé gouverné ;
- missions, statuts et historique ;
- documentation de référence et registre des décisions ;
- restitution explicite des limites et blocages.

### Lot C2 — Centre de commande administrateur
- conversation privée persistante ;
- création et suivi de missions ;
- dépôt de captures et documents ;
- historique, alertes, validations et livrables ;
- première recherche dans les archives autorisées.

### Lot C3 — Compétences métier prioritaires
- analyse d'appels d'offres en langage chantier ;
- recherche documentaire et synthèses sourcées ;
- assistance CRM en lecture puis préparation d'écritures ;
- qualification et rapprochement des entreprises.

### Lot C4 — Connexions et circulation
- CRM et objets métier ;
- GitHub en lecture puis propositions sur branche ;
- Google Workspace / Drive ;
- sources publiques et connecteurs de veille ;
- transmission contrôlée entre rubriques et CRM.

### Lot C5 — Automatisations et initiative
- veille planifiée ;
- alertes et dédoublonnage ;
- SEO périodique ;
- archivage et rapports ;
- actions répétitives préautorisées et réversibles.

### Lot C6 — Intelligence augmentée
- analyses croisées multi-domaines ;
- priorisation et détection de tendances ;
- mesure de la qualité des recommandations ;
- amélioration continue à partir des résultats vérifiés.

Cet ordre peut être adapté selon les dépendances réelles et la valeur métier immédiate. Le centre de commande n'est pas reporté à une hypothétique fin de projet : il constitue une priorité de réalisation.

---

## 12. État constaté dans le dépôt Evolution-7 au 9 novembre 2026

Les constats suivants proviennent de l'audit du code et de la documentation du dépôt. Ils ne décrivent pas l'état d'un service distant non vérifié.

| Capacité | État constaté |
|---|---|
| Guide conversationnel global | Présent dans `app.js`, mais réponses locales par mots-clés et liens ; ce n'est pas encore le moteur IA Cheexpeer |
| Parcours Réputation virtuelle | Première capacité serveur limitée ; collecte identité officielle et annonces BODACC ; analyse IA optionnelle dépendante d'une configuration fournisseur non réalisée dans le lot documenté |
| CRM | Interface et services CRM présents ; aucun raccordement Cheexpeer dédié observé dans le client audité |
| GitHub dans le produit | Aucun connecteur GitHub Cheexpeer dans le runtime applicatif audité ; l'accès utilisé pour le développement est distinct |
| Centre de commande | Cockpit VIP présent, mais dialogue Cheexpeer, missions, historique conversationnel et dépôt de captures non développés dans le cockpit audité |
| Archives durables Cheexpeer | Modèle complet de conversations, missions, pièces jointes et mémoire privée non identifié dans le périmètre audité |
| Google Workspace / Drive | Connexion cible envisagée, pas démontrée comme réalisée |
| Veille SEO Cheexpeer | Mission définie dans la vision, orchestration périodique Cheexpeer non démontrée comme réalisée |
| Automatisation générale | Plusieurs fonctions métier existent ; l'orchestration transversale cible reste à construire |

**Conclusion :** le dépôt contient des premières briques et un parcours d'audit limité, mais pas encore l'agent transversal complet décrit dans ce cahier des charges. Il faut éviter de présenter le chatbot local comme un Cheexpeer opérationnel ou le cockpit VIP comme son centre de commande déjà réalisé.

---

## 13. Décisions à conserver pour la suite

1. Un seul agent transversal : Cheexpeer.
2. Quatre espaces : chat utilisateurs, CRM/données métier, GitHub/développement, centre de commande administrateur privé.
3. Le centre de commande privé est une priorité, avec dialogue, missions, captures, archives, alertes et validations.
4. Cheexpeer peut rechercher, collecter, comparer, analyser, qualifier, préparer, automatiser et capitaliser dans le respect du périmètre autorisé.
5. Google Workspace / Drive est une connexion cible pour les archives confidentielles, à concevoir et tester.
6. Les outils de scraping sont interchangeables ; la méthode doit respecter les conditions d'accès et la réglementation.
7. L'agent choisit les moyens adaptés et explique les limites, coûts et incertitudes.
8. Les informations importantes sont sourcées et les actions historisées.
9. L'administrateur garde la décision sur les actions engageantes ; Cheexpeer doit aussi savoir contester une instruction erronée.
10. La sécurité reste un chantier de vérification et de recette proportionné ; elle ne remplace pas la définition des fonctions métier.

**Règle finale : Cheexpeer doit devenir un véritable collaborateur numérique technico-commercial et analytique de MajestiOS — pas un chatbot décoratif, pas un simple lecteur de CRM, et pas un exécutant aveugle.**
