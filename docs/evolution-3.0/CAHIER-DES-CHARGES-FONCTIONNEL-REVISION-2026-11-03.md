# Cahier des charges fonctionnel — Révision du 3 novembre 2026

**Projet :** MajestiOS 3.0  
**Branche de référence :** `evolution-3.0`  
**Statut :** cadrage fonctionnel consolidé — à compléter et arbitrer avant implémentation  
**Périmètre de cette révision :** moteur de recherche, publication de demandes, compréhension des appels d'offres, vulgarisation de l'information économique et Show Room.

> Ce document formalise les évolutions exprimées lors des échanges du 3 novembre 2026. Il complète la documentation existante ; il ne remplace pas les décisions d'architecture et de sécurité déjà validées. Son intégration documentaire n'autorise ni développement, ni modification du prototype, ni changement de schéma, ni déploiement.

---

## 1. Objectifs généraux

MajestiOS doit dépasser la simple consultation d'annonces et devenir un outil d'aide au développement commercial qui permet aux entreprises de :

1. repérer des opportunités ;
2. comprendre rapidement ce qui est réellement demandé ou ce qui s'est produit ;
3. évaluer leur capacité à se positionner ;
4. identifier les moyens ou partenaires nécessaires ;
5. publier leurs propres besoins et propositions ;
6. transformer une information économique en décision ou en démarche commerciale pertinente.

La vulgarisation doit rendre l'information accessible sans altérer sa portée juridique, contractuelle ou économique.

## 2. Moteur de recherche transversal

### 2.1 Présentation et ergonomie

Le moteur présent dans les rubriques doit reprendre **la même taille, les mêmes proportions et le même comportement que le moteur de la page d'accueil**.

Exigences :
- positionnement à gauche du contenu de la rubrique ;
- format compact, occupant le minimum d'espace nécessaire ;
- composant cohérent et identique dans toutes les rubriques concernées ;
- aucune version agrandie ou envahissante dans les pages intérieures ;
- conservation de l'accès au moteur sans masquer le contenu principal.

La page d'accueil reste la référence visuelle. Toute adaptation responsive devra préserver cette compacité et la lisibilité.

### 2.2 Trois entrées principales

Le moteur présente trois entrées distinctes :

1. **Appels d'offres publics**
   - recherche et consultation de marchés publics ;
   - accès aux informations et pièces disponibles ;
   - qualification et aide à la compréhension.

2. **Appels d'offres privés**
   - recherche et consultation d'opportunités privées ;
   - chantiers, contrats, besoins d'acheteurs et annonces privées ;
   - affichage selon les droits d'accès applicables.

3. **Publier ma demande**
   - accès à un parcours de dépôt et de qualification d'une demande ou proposition ;
   - orientation vers la bonne catégorie ;
   - distinction entre annonce destinée à la communauté et demande confidentielle adressée à MajestiOS.

Le choix de l'une de ces entrées doit conduire vers un parcours dédié et compréhensible, sans mélanger les résultats de recherche et les formulaires de publication.

## 3. Publier ma demande

### 3.1 Catégories initialement envisagées

Le parcours doit pouvoir couvrir notamment :

| Catégorie | Intention |
|---|---|
| Offre de sous-traitance | Une entreprise propose ses compétences comme sous-traitant. |
| Recherche de sous-traitance | Une entreprise recherche un prestataire pour une partie de ses travaux ou prestations. |
| Offre d'emploi | Une entreprise recherche un salarié ou collaborateur. |
| Recherche d'emploi / proposition de compétences | Une personne présente ses compétences ou recherche une opportunité. |
| Recherche de partenaire | Une entreprise recherche une autre entreprise pour collaborer. |
| Recherche d'associé | Un porteur de projet ou une entreprise recherche un associé. |
| Estimation d'entreprise | Un dirigeant demande une estimation ou un accompagnement relatif à la valeur de son entreprise. |
| Autre demande | L'utilisateur décrit un besoin qui ne correspond pas aux catégories proposées. |

Cette liste est un socle initial et pourra être enrichie depuis l'administration.

### 3.2 Distinguer publication et demande confidentielle

Dès le dépôt, l'utilisateur doit pouvoir être orienté vers la nature de sa démarche :
- **annonce destinée à la communauté MajestiOS** ;
- **demande confidentielle adressée à MajestiOS** (ex. estimation d'entreprise, demande d'accompagnement ou autre prestation).

Une demande confidentielle ne doit pas être publiée par défaut. Elle ne doit pas être transformée en annonce publique par simple changement d'affichage ou par automatisme.

### 3.3 Cycle de vie et modération

Le cycle doit rester compatible avec les principes B-06 déjà documentés :
- rédaction / brouillon ;
- soumission ;
- contrôles et modération ;
- demande de correction ou refus, si nécessaire ;
- validation pour diffusion privée ;
- demande de publication publique, si l'auteur la souhaite ;
- décision de l'administrateur du projet ;
- publication, refus ou retrait selon la décision.

L'auteur peut demander une publication, mais ne peut pas autoriser seul la publication publique. **Seul l'administrateur du projet approuve cette publication.**

La validation d'une annonce privée, son éventuelle publication publique et tout partage de données CRM sont trois décisions distinctes. La publication ne vaut pas autorisation de transfert CRM, de prospection, ni d'ingestion dans le corpus documentaire.

### 3.4 Informations et contrôles à prévoir

Le formulaire devra être adapté à la catégorie et recueillir uniquement les données nécessaires. Les champs obligatoires, pièces jointes, contrôles, durées, modalités de retrait, notifications et règles de visibilité restent à spécifier dans un lot de conception détaillée.

Les informations confidentielles, coordonnées privées, données de tiers et éléments issus du CRM ne doivent jamais être exposés dans une annonce publique sans autorisation explicite et contrôle approprié.

## 4. Compréhension simplifiée des appels d'offres

### 4.1 Finalité

Le langage administratif, juridique et technique peut décourager les petites entreprises. MajestiOS doit proposer une lecture accessible qui aide l'utilisateur à comprendre ce que l'acheteur attend concrètement.

Cette fonction est particulièrement utile pour les marchés privés, sans être limitée à ceux-ci.

### 4.2 Deux présentations complémentaires

Pour chaque opportunité éligible :

- **Document / version originale** : contenu officiel de l'acheteur, conservé sans altération ;
- **Lecture simplifiée par l'IA** : reformulation pédagogique, structurée et compréhensible.

La version simplifiée ne remplace jamais le document original et ne constitue pas une version contractuelle.

### 4.3 Informations à expliquer

Selon les données effectivement présentes dans le dossier, l'IA peut expliquer :
- l'objet du marché et le besoin réel de l'acheteur ;
- les travaux ou prestations attendus ;
- les compétences, qualifications et moyens requis ;
- les conditions d'accès et éventuelles conditions éliminatoires ;
- les documents à fournir ;
- les dates limites, délais d'exécution et contraintes de calendrier ;
- les critères de sélection et leur pondération lorsqu'elle est connue ;
- les contraintes techniques, administratives, financières et opérationnelles ;
- les points ambigus, incohérences ou informations absentes à vérifier.

L'IA doit distinguer clairement les exigences obligatoires, les critères de notation, les recommandations et ses propres explications.

### 4.4 Traçabilité et fidélité

Chaque élément important de la synthèse doit pouvoir être rapproché du document source : référence, page, paragraphe ou extrait lorsque cette information est disponible.

L'IA doit :
- signaler les informations absentes ou ambiguës ;
- ne pas inventer de dates, montants, qualifications ou obligations ;
- signaler les contradictions entre pièces ;
- inviter à vérifier le dossier officiel avant toute décision ou dépôt ;
- conserver la date et la version des documents analysés.

L'utilisateur doit pouvoir revenir facilement à la source officielle.

### 4.5 Questions à l'assistant

Une interface de questions-réponses peut permettre au client d'interroger le dossier en langage courant. Les réponses doivent être fondées sur les pièces accessibles et citer les passages utiles. Si les documents ne permettent pas de répondre, l'assistant doit le dire explicitement plutôt que supposer.

## 5. QCM intelligent de préqualification

### 5.1 Objectif

Après analyse du dossier, l'IA peut proposer un questionnaire personnalisé afin d'aider l'entreprise à déterminer rapidement si elle semble en mesure de se positionner.

Le QCM est généré à partir des exigences identifiées dans le dossier et non à partir d'un questionnaire générique unique.

### 5.2 Exemples de thèmes

Selon le marché :
- métiers et prestations réellement maîtrisés ;
- qualifications ou certifications exigées ;
- expériences et références comparables ;
- effectifs, matériel et capacités disponibles ;
- zone géographique d'intervention ;
- capacité à respecter les délais ;
- assurances, attestations et pièces requises ;
- capacité à répondre seul ou avec un partenaire / sous-traitant.

Les réponses doivent pouvoir inclure « Oui », « Non », « En cours », « À vérifier » ou « Avec un partenaire », lorsque ces choix sont pertinents.

### 5.3 Résultat indicatif

Le résultat peut être présenté en trois niveaux :
- **Compatible** : les éléments déclarés semblent satisfaire les principales exigences identifiées ;
- **Compatible sous conditions** : des éléments doivent être complétés, vérifiés ou couverts avec un partenaire ;
- **Peu adapté** : une ou plusieurs exigences essentielles semblent ne pas être satisfaites.

Le résultat doit expliquer les raisons, les réponses déterminantes, les points restant à vérifier et les passages sources correspondants.

### 5.4 Limites impératives

Le QCM constitue une préqualification indicative. Il ne garantit ni la recevabilité juridique de la candidature, ni l'attribution du marché, ni les chances de succès.

Il faut distinguer :
- les exigences éliminatoires ;
- les critères de sélection ou de notation ;
- les informations déclarées par l'utilisateur mais non vérifiées ;
- les informations documentées et vérifiées.

L'IA ne doit pas présenter une simple insuffisance de preuve comme une impossibilité certaine de candidater.

### 5.5 Suites proposées

Si l'entreprise ne couvre pas seule tous les besoins, MajestiOS peut suggérer, sans engager automatiquement l'entreprise :
- rechercher un partenaire ;
- rechercher un sous-traitant ;
- envisager un groupement d'entreprises ;
- demander un accompagnement pour préparer la réponse.

Toute mise en relation, transmission de coordonnées ou partage de dossier reste soumis aux droits, au consentement et aux règles de cloisonnement applicables.

## 6. Vulgarisation des informations économiques et annonces privées

### 6.1 Finalité

MajestiOS doit traduire les formulations administratives, juridiques ou économiques en langage courant, particulièrement pour les informations issues du BODACC et d'autres sources officielles.

Le but est de rendre les événements compréhensibles et de faire ressortir leurs éventuelles implications commerciales, sans dramatisation ni embellissement trompeur.

### 6.2 Trois niveaux de lecture

1. **Information officielle**
   - intitulé et nature de l'événement tels que publiés ;
   - source, date, référence et données officielles disponibles.

2. **Explication en langage courant**
   - ce qui s'est passé ;
   - ce que le terme signifie ;
   - ce que l'information permet réellement de conclure ;
   - ce qui reste inconnu.

3. **Lecture commerciale**
   - opportunités ou signaux commerciaux possibles ;
   - acteurs ou métiers potentiellement concernés ;
   - pistes de prospection à examiner ;
   - précautions et vérifications avant toute prise de contact.

### 6.3 Exemples de reformulation prudente

| Terme ou événement source | Explication accessible possible |
|---|---|
| Cession de fonds de commerce | Un commerce change de propriétaire. La continuité de l'activité et l'identité du repreneur doivent être vérifiées. |
| Radiation | L'entreprise est radiée du registre concerné. Cela ne prouve pas, à lui seul, qu'une activité a été reprise. |
| Création / immatriculation | Une nouvelle entreprise vient d'être créée ou immatriculée. |
| Reprise d'activité | Une activité reprend, si cette reprise est explicitement établie par les sources. |
| Redressement judiciaire | L'entreprise fait l'objet d'une procédure destinée à permettre la poursuite de son activité et le traitement de ses difficultés, selon les décisions applicables. |
| Liquidation judiciaire | Une procédure de liquidation a été ouverte. Ne pas la présenter comme une reprise ou une relance sans preuve distincte. |
| Changement de dirigeant | La direction de l'entreprise a changé. |
| Transfert de siège | L'adresse du siège social a été modifiée. |

Une formulation positive ou chaleureuse peut être utilisée uniquement si elle reste factuellement exacte. Exemple : annoncer « l'arrivée d'un nouveau restaurant » exige des éléments établissant effectivement l'ouverture ou la reprise d'un restaurant ; une simple cession ou radiation ne suffit pas.

### 6.4 Garde-fous contre les déformations

L'IA doit distinguer explicitement :
- fait officiel établi ;
- explication pédagogique ;
- hypothèse ou interprétation ;
- piste commerciale éventuelle ;
- information non confirmée.

Elle ne doit jamais :
- transformer une radiation en annonce de reprise ;
- déduire une continuité d'activité d'une simple cession ;
- présenter une procédure collective comme une fermeture ou une relance certaine sans preuve ;
- masquer une difficulté juridique importante par une formulation publicitaire ;
- inventer un repreneur, une ouverture, une date ou une activité.

Les annonces doivent conserver la référence à la source et permettre de consulter l'information officielle.

## 7. Show Room

Supprimer les trois cartes suivantes de la rubrique Show Room :
- « Parcours Tesla » ;
- « Survol hélicoptère » / « Survol Apache » ;
- « Majest COYOT ».

Ces cartes ne doivent pas être remplacées par d'autres cartes sans demande ultérieure. Cette suppression concerne les cartes et leur présentation dans le Show Room ; toute suppression de fonctionnalités ou de code sous-jacent devra être évaluée séparément pour éviter de retirer des éléments encore utilisés ailleurs.

## 8. Cohérence avec les décisions d'architecture et de sécurité existantes

Les nouvelles fonctionnalités doivent respecter les décisions et principes déjà documentés, notamment :
- B-01 : isolation stricte des espaces clients ;
- B-02 : périmètre CRM interne distinct des espaces clients ;
- B-03 : corpus documentaire indépendant, accès explicite aux seuls corpus autorisés ;
- B-04 : rapprochement d'identité d'entreprise sans fusion automatique des dossiers ;
- B-05 : accès des visiteurs, utilisateurs identifiés et contenus pédagogiques selon les droits ;
- B-06 : cycle de validation des annonces et approbation administrative obligatoire pour publication publique ;
- B-07 : rapprochement prudent des signaux économiques avec les entreprises, avec validation humaine pour les correspondances probables.

En particulier :
- le fait d'être identifié ne donne pas automatiquement accès à toutes les annonces privées ;
- les cartes ou annonces verrouillées ne doivent pas divulguer les données sous-jacentes ;
- le contenu pédagogique peut expliquer les méthodes de MajestiOS sans révéler les données confidentielles ou les dossiers d'autres clients ;
- une synthèse IA ou un QCM ne doit pas contourner les droits d'accès aux documents ;
- les résultats issus du CRM ne peuvent être transmis qu'après autorisation explicite et contrôle du périmètre, de la finalité, du destinataire et des données partagées ;
- les données sources, les transformations IA et les décisions humaines doivent rester distinguables et traçables.

## 9. Critères d'acceptation fonctionnelle

Avant validation d'une implémentation, vérifier au minimum :

### Moteur
- même gabarit compact que l'accueil dans les rubriques ;
- position à gauche ;
- trois entrées clairement identifiables ;
- navigation distincte entre recherche publique, recherche privée et publication.

### Publication
- catégories initiales accessibles ;
- parcours annonce communautaire distinct d'une demande confidentielle ;
- aucune publication publique sans approbation de l'administrateur ;
- aucune transmission CRM ou ingestion implicite dans le corpus documentaire.

### Appels d'offres
- original toujours accessible et inchangé ;
- explications simples et structurées ;
- renvoi aux passages sources ;
- absence d'invention lorsque l'information manque ;
- QCM adapté au dossier ;
- résultat motivé et explicitement indicatif ;
- exigences éliminatoires séparées des critères de notation ;
- suggestions de partenaires sans mise en relation automatique non autorisée.

### Information économique
- intitulé officiel et source conservés ;
- traduction en langage courant ;
- lecture commerciale séparée des faits ;
- aucune annonce de reprise, d'ouverture ou de continuité sans preuve ;
- incertitudes et limites clairement signalées.

### Show Room
- les trois cartes désignées ne sont plus affichées ;
- aucun contenu non demandé n'est ajouté en remplacement ;
- aucune régression sur les autres éléments du Show Room.

## 10. Découpage de réalisation proposé

| Lot | Périmètre | Livrable attendu |
|---|---|---|
| F-01 | Ergonomie du moteur transversal | Gabarit compact identique à l'accueil et positionnement à gauche |
| F-02 | Trois entrées du moteur | Parcours distincts public, privé et publication |
| F-03 | Publication des demandes | Catégories, formulaires et distinction annonce / demande confidentielle |
| F-04 | Cycle de vie des annonces | Modération et validation selon B-06 |
| F-05 | Compréhension des appels d'offres | Version simplifiée sourcée et assistant de questions-réponses |
| F-06 | QCM de préqualification | Questionnaire adapté, résultat motivé et pistes de solution |
| F-07 | Vulgarisation économique | Trois niveaux de lecture des événements et signaux |
| F-08 | Show Room | Retrait des trois cartes identifiées |
| F-09 | Sécurité et anti-régression | Tests d'accès, de cloisonnement, de traçabilité et de non-déformation |

Ce découpage est une proposition de planification ; l'ordre définitif, les dépendances et les critères détaillés devront être arbitrés avant chaque lot.

## 11. Points restant à arbitrer

Ce document ne prétend pas figer les choix qui n'ont pas encore été décidés. Les questions suivantes restent ouvertes :

1. Quelles catégories de publication sont proposées dès la première version et lesquelles sont reportées ?
2. Quels types de demandes sont exclusivement confidentiels et lesquels peuvent être proposés à la publication ?
3. Quels champs et pièces justificatives sont requis pour chaque catégorie ?
4. Quelles règles de visibilité s'appliquent aux annonces privées selon le statut du compte ?
5. Quelles sources et quels formats documentaires sont pris en charge pour l'analyse IA ?
6. Quelle méthode de citation des sources (page, paragraphe, extrait) est disponible selon les formats ?
7. Qui peut utiliser le QCM, conserver ses réponses et les réutiliser pour d'autres marchés ?
8. Quel niveau de preuve est requis avant de présenter un événement économique comme une reprise, une ouverture ou une continuité ?
9. Quelles suggestions de mise en relation peuvent être faites automatiquement et lesquelles exigent une validation ou un consentement ?
10. Quels indicateurs permettent de mesurer la qualité des synthèses, la fidélité aux sources et la pertinence des QCM ?

## 12. Règle de conduite pour la suite

La présente révision est un document de cadrage fonctionnel. Avant chaque implémentation :
1. vérifier les décisions d'architecture et de sécurité applicables ;
2. préciser les règles métier et les cas limites ;
3. définir les tests positifs et négatifs ;
4. limiter le changement à un lot identifié ;
5. exécuter les tests et contrôles anti-régression ;
6. documenter le résultat et les éventuels écarts.

Aucun déploiement en production, fusion de branche, modification de données ou élargissement des droits n'est autorisé par le seul fait de ce cahier des charges.
