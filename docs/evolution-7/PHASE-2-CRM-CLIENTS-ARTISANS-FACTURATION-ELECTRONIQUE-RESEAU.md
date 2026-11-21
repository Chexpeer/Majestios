# Phase 2 — CRM clients, artisans, facturation électronique et réseau partenaires

**Référentiel :** branche `Evolution-7`  
**Statut :** orientation stratégique validée par le porteur du projet ; conception détaillée et partenariats à instruire.  
**Horizon :** deuxième phase de développement de MajestiOS.  
**Règle de lecture :** ce document décrit une cible et des décisions de cadrage. Il ne signifie pas que les fonctions, les intégrations ou les partenariats sont déjà réalisés.

---

## 1. Décision stratégique

La deuxième phase de MajestiOS doit étendre la plateforme vers un **CRM client simple, accessible et particulièrement adapté aux artisans et petites entreprises**, avec une stratégie de diffusion gratuite et des options payantes activables selon les besoins.

La facturation électronique et la dématérialisation constituent un **levier d'acquisition et un service différenciant** de cette offre. MajestiOS étudiera un partenariat avec une plateforme agréée (PA) afin d'intégrer les échanges réglementaires sans chercher, à ce stade, à devenir lui-même une PA.

Cette phase est distincte des priorités de la première phase. Elle doit être préparée dans la documentation et l'architecture, mais ne doit pas détourner les ressources des travaux prioritaires déjà engagés sur Evolution-7.

## 2. Positionnement de l'offre artisan

**Promesse de travail :** un outil simple pour gérer l'activité quotidienne d'une petite entreprise, avec un parcours guidé et une facturation électronique intégrée via un partenaire qualifié.

Le logiciel doit être compréhensible sans formation, utilisable en priorité sur téléphone et conçu autour des tâches réelles de l'artisan.

### 2.1 Socle gratuit envisagé

Le périmètre gratuit est une hypothèse de produit à consolider. Il doit représenter un outil réellement utilisable, et non une démonstration limitée destinée à imposer rapidement un abonnement.

Fonctions candidates :
- fichier clients et contacts ;
- création et suivi des devis ;
- factures et suivi des règlements, sous réserve du périmètre réglementaire couvert par le partenaire ;
- suivi simple des chantiers, interventions et tâches ;
- agenda et rappels ;
- classement des documents ;
- tableau de bord synthétique : devis en attente, interventions à venir, factures et règlements à suivre.

Les limites éventuelles du gratuit (volumes, utilisateurs, stockage, assistance ou services tiers) devront être explicites, raisonnables et annoncées avant inscription.

### 2.2 Options payantes envisagées

Les options payantes doivent apporter un gain identifiable et rester indépendantes autant que possible :
- automatisations et relances avancées ;
- gestion d'équipe et droits multi-utilisateurs ;
- tableaux de bord et analyses de rentabilité ;
- assistance Cheexpeer renforcée ;
- préparation de courriers, comptes rendus et documents ;
- prospection, enrichissement d'entreprises et détection d'opportunités ;
- accompagnement métier et services partenaires.

Aucun tarif, quota ou engagement commercial n'est fixé dans ce document.

## 3. Facturation électronique : principe d'intégration

MajestiOS ne doit pas se présenter comme une plateforme agréée tant qu'il ne dispose pas lui-même du statut réglementaire correspondant.

La cible privilégiée est une **intégration avec une plateforme agréée partenaire**, via une API et un contrat adaptés à un éditeur de logiciel. Selon les possibilités négociées, le partenariat pourra prendre la forme d'une intégration technique, d'une offre revendeur ou d'une marque blanche. Aucun partenaire n'est sélectionné à ce stade.

### 3.1 Répartition des responsabilités cible

**MajestiOS**
- fournit l'interface utilisateur et les fonctions de gestion commerciale ;
- prépare les données de facture et contrôle leur cohérence fonctionnelle ;
- recueille les choix et validations de l'entreprise ;
- transmet les opérations à la PA via une intégration sécurisée ;
- restitue les statuts, anomalies et preuves de traitement ;
- conserve les références et journaux nécessaires à la traçabilité, selon les responsabilités contractuelles et légales applicables.

**Plateforme agréée partenaire**
- assure les fonctions réglementaires relevant de son agrément et du contrat ;
- prend en charge les échanges réglementaires et les flux qui lui incombent ;
- restitue les statuts et rejets ;
- documente ses formats, API, niveaux de service, règles de conservation et responsabilités.

La répartition exacte doit être confirmée par analyse juridique, technique et contractuelle. Le partenaire ne transfère pas automatiquement à MajestiOS ses obligations réglementaires, et inversement.

### 3.2 Points de contrôle avant sélection du partenaire

Comparer au minimum :
1. statut d'agrément vérifiable sur la liste officielle à jour ;
2. couverture des cas d'usage visés par MajestiOS et des obligations applicables ;
3. API documentée, sandbox, webhooks et mécanismes de reprise ;
4. formats, statuts de cycle de vie, gestion des rejets et e-reporting lorsqu'applicable ;
5. sécurité, hébergement, sous-traitants, réversibilité et portabilité ;
6. prix par entreprise, utilisateur, facture ou volume, frais fixes et coûts cachés ;
7. possibilité de marque blanche, revente ou co-commercialisation ;
8. support, disponibilité, SLA, continuité et gestion des incidents ;
9. responsabilités, assurances, protection des données et conditions de sortie ;
10. possibilité de changer de partenaire sans enfermer les données ni l'expérience client.

La liste officielle des plateformes agréées et les règles en vigueur devront être revérifiées au moment de toute décision ou communication commerciale.

### 3.3 Principe économique

La gratuité de MajestiOS ne signifie pas que les services de la PA sont gratuits. Le modèle devra établir qui supporte les frais du partenaire : MajestiOS, l'utilisateur, un forfait payant, une enveloppe de volumes négociée ou une combinaison transparente de ces mécanismes.

Aucune promesse de facturation électronique gratuite et illimitée ne doit être publiée avant validation du contrat, des coûts, des quotas et du périmètre réglementaire.

### 3.4 Vigilances réglementaires

- Distinguer facture électronique réglementaire, simple PDF, dématérialisation documentaire et transmission de données de transaction.
- Vérifier les obligations selon le type d'entreprise, la transaction, le client (professionnel ou particulier), le territoire et les éventuelles exclusions.
- Prévoir les statuts, rejets, corrections, avoirs, annulations et preuves de transmission.
- Ne pas présenter un devis ou un PDF comme une facture électronique conforme par simple changement de format.
- Faire valider les textes, parcours et responsabilités par des personnes compétentes avant mise en production.

## 4. Acquisition : la réforme comme porte d'entrée, pas comme unique promesse

La facturation électronique peut constituer un **argument de prospection initial** : aider les artisans à comprendre la réforme, à s'équiper et à organiser leur transition.

Elle ne doit pas être l'unique raison de rester sur MajestiOS. La fidélisation doit reposer sur l'utilité quotidienne du CRM : clients, devis, factures, chantiers, agenda et suivi de trésorerie.

Parcours cible :
1. contenu pédagogique et diagnostic d'orientation sur la facturation électronique ;
2. découverte de MajestiOS Artisan et création d'un espace ;
3. prise en main du socle de gestion gratuit ;
4. raccordement au partenaire PA lorsque l'offre et le cas d'usage sont éligibles ;
5. adoption progressive des options et services à valeur ajoutée ;
6. accompagnement humain ou assistance Cheexpeer selon les besoins.

Les messages commerciaux doivent être exacts : MajestiOS est une solution logicielle connectée à une PA partenaire, et non une PA, sauf évolution réglementaire et décision distincte.

## 5. Accompagnement appels d'offres : nouvelle thématique

La rubrique **Accompagnement appels d'offres** devra pouvoir proposer une thématique spécifique :

**« Accompagnement vers la facturation électronique et la dématérialisation »**

Cette thématique complète l'accompagnement aux marchés et ne doit pas être confondue avec une prestation de réponse à un appel d'offres.

Contenus et services à instruire :
- explication pédagogique des obligations et du calendrier applicable ;
- diagnostic d'organisation et des flux de factures ;
- cartographie des outils et échanges de l'entreprise ;
- aide au choix d'une solution et orientation vers les partenaires ;
- préparation à la dématérialisation des documents et processus ;
- accompagnement à la prise en main de MajestiOS et de la PA partenaire ;
- checklist de préparation et suivi des étapes ;
- orientation vers un expert-comptable, conseil ou prestataire compétent lorsque nécessaire.

Le contenu devra distinguer information générale, accompagnement opérationnel et conseil juridique/comptable réglementé. MajestiOS ne devra pas se substituer à un professionnel habilité.

Cette thématique devra être accessible depuis les parcours d'accompagnement liés aux appels d'offres et depuis les pages pertinentes de développement commercial, sans créer une navigation redondante.

## 6. Rubrique Réseau : valorisation des plateformes partenaires

La rubrique **Réseau** pourra présenter et valoriser les plateformes et prestataires partenaires qui contribuent aux services de MajestiOS.

Chaque fiche partenaire pourra comprendre :
- identité et domaine d'intervention ;
- rôle précis dans l'écosystème MajestiOS ;
- services et publics concernés ;
- statut et périmètre de qualification vérifiés ;
- modalités d'accès ou de mise en relation ;
- conditions commerciales connues, lorsqu'elles peuvent être publiées ;
- date de vérification et contact ou lien officiel ;
- mention claire de la nature de la relation : partenaire contractuel, partenaire technique, membre du réseau, prestataire référencé ou simple ressource.

La présence dans la rubrique Réseau ne devra jamais laisser croire à une certification, une recommandation exclusive ou une garantie de MajestiOS qui n'aurait pas été expressément établie. Les éventuelles rémunérations, commissions ou relations commerciales devront être transparentes.

La rubrique Réseau est une vitrine de l'écosystème et un outil de mise en relation ; elle ne remplace ni le contrat partenaire, ni le contrôle qualité, ni les obligations de conformité.

## 7. Frontières entre CRM interne et CRM clients

La deuxième phase impose de distinguer clairement :
- **CRM interne MajestiOS** : prospection, partenaires, relations commerciales et pilotage de l'activité MajestiOS ;
- **CRM client MajestiOS** : espace de gestion propre à chaque entreprise cliente, avec ses clients, contacts, devis, factures, chantiers, tâches et documents ;
- **données de réseau** : informations qu'une entreprise choisit de rendre visibles ou de partager ;
- **données partenaires** : informations de référencement, contrats, intégrations et suivi de la relation partenaire.

Ces domaines ne doivent pas être fusionnés dans un tenant ou un modèle de permissions unique par commodité. Le cloisonnement multi-entreprises, les rôles, les accès, les exports, les journaux et la réversibilité devront être conçus et testés avant l'ouverture à des données réelles.

Cheexpeer pourra assister les entreprises clientes, mais ses accès devront respecter le cloisonnement de chaque espace. Les actions externes, transmissions de factures, communications et opérations engageantes seront soumises aux validations et habilitations appropriées.

## 8. Place de Cheexpeer

Cheexpeer doit progressivement devenir l'assistant opérationnel du CRM client :
- aide à la création et à la qualification des fiches ;
- préparation de devis, courriers et comptes rendus à partir des informations fournies ;
- détection des relances à effectuer ;
- synthèse de l'activité et des échéances ;
- aide à la préparation des dossiers de dématérialisation ;
- orientation vers les ressources et partenaires pertinents ;
- assistance à la prospection et au développement commercial selon les droits activés.

Une capacité décrite ici est une cible. Aucune émission de facture, transmission réglementaire, relance ou prise de contact ne doit être réputée automatique ou disponible sans intégration, tests, habilitations et validations démontrés.

## 9. Découpage de réalisation proposé

| Lot | Objet | Sortie attendue |
|---|---|---|
| P2-01 | Étude utilisateurs artisans et périmètre gratuit | Parcours simples validés et priorités fonctionnelles |
| P2-02 | Modèle CRM client et cloisonnement | Architecture multi-entreprises, rôles et données validés |
| P2-03 | Étude comparative des plateformes agréées | Shortlist, matrice API/coûts/contrats et recommandation |
| P2-04 | Modèle économique et conditions de partenariat | Coûts, quotas, revenus, responsabilités et réversibilité |
| P2-05 | Prototype CRM Artisan | Parcours mobile testable sur données fictives |
| P2-06 | Intégration sandbox PA | Émission/réception et statuts testés sans production |
| P2-07 | Accompagnement dématérialisation | Contenus, diagnostic et parcours d'orientation |
| P2-08 | Réseau partenaires | Fiches partenaires et règles de référencement |
| P2-09 | Cheexpeer pour CRM client | Missions et outils testés, avec validations et journaux |
| P2-10 | Pilote et ouverture progressive | Recette, conformité, coûts et retours d'un petit groupe pilote |

L'ordre et le contenu de ces lots seront confirmés après la fin des priorités de première phase et un arbitrage de lancement.

## 10. Décisions, hypothèses et points ouverts

### Décisions validées
- Le CRM clients orienté artisans relève de la deuxième phase de développement.
- La simplicité d'usage et une diffusion gratuite constituent le principe d'acquisition.
- La facturation électronique et la dématérialisation sont une thématique à intégrer à l'accompagnement.
- MajestiOS étudiera un partenariat avec une PA plutôt que de chercher à devenir PA à ce stade.
- La rubrique Réseau doit valoriser les plateformes partenaires.
- Le CRM interne et les CRM clients doivent rester clairement séparés.

### Hypothèses à instruire
- périmètre précis et limites du socle gratuit ;
- options payantes et modèle de financement ;
- intégration API, marque blanche ou revente ;
- coûts et quotas supportables ;
- sélection du ou des partenaires ;
- modalités d'accompagnement et de rémunération des partenaires.

### Points non décidés
- aucun partenaire choisi ou contrat conclu ;
- aucune tarification fixée ;
- aucune date de lancement arrêtée ;
- aucune fonction de facturation électronique déclarée opérationnelle ;
- aucune promesse de gratuité illimitée ;
- aucune décision de devenir plateforme agréée.

## 11. Critères de passage en réalisation

La phase ne pourra passer en réalisation qu'après :
1. validation du périmètre utilisateur et de la proposition de valeur ;
2. architecture CRM client et modèle de sécurité documentés ;
3. étude de coûts et modèle économique crédibles ;
4. partenaire PA vérifié et conditions contractuelles examinées ;
5. cartographie des responsabilités et conformité validée ;
6. parcours UX testés avec des artisans ;
7. critères de recette, observabilité, support et réversibilité définis.

**Principe directeur :** offrir aux artisans un outil quotidien simple et utile ; utiliser la facturation électronique comme porte d'entrée et service intégré ; développer la valeur par l'accompagnement, le réseau et Cheexpeer, sans confondre ambition stratégique et capacité déjà livrée.
