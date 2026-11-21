# MajestiOS — architecture du registre commercial : annonces, besoins et provenance

**Date :** 6 novembre 2026  
**Branche de travail :** `evolution-5.0-admin-cockpit`  
**Statut :** cadrage fonctionnel et technique — aucun schéma Supabase modifié  
**Périmètre :** CRM interne, dossier entreprise et futurs points d'entrée de l'aspirateur à leads.

## 1. Décision structurante

Le dossier entreprise est le centre de gravité du CRM, mais il ne doit pas devenir un fourre-tout. Il doit relier des objets métier distincts et conserver leur origine.

MajestiOS ne se limite pas à enregistrer des entreprises qui répondent à des appels d'offres. Il doit capter et qualifier des signaux provenant de plusieurs portes d'entrée : marchés publics et privés, BODACC, annuaires, annonces publiées sur MajestiOS, recommandations, prospection et saisies manuelles.

**Règle : une annonce, un besoin, une entreprise, un contact, une opportunité et une activité sont des objets différents.** Ils peuvent être reliés, mais ne doivent pas être confondus.

## 2. Ce que le socle actuel permet réellement

La migration initiale `20261105163901_majestios_core_multitenant_foundation.sql` définit déjà :

- `businesses` : identité juridique/commerciale, SIREN/SIRET, APE/NAF, localisation, qualification, source et lien source ;
- `contacts` : personnes et coordonnées, entreprise éventuellement associée, source et statut de consentement ;
- `opportunities` : pipeline commercial, entreprise/contact associés, type de source, identifiant externe, URL, date de publication, département, statut et qualification ;
- `activities` : historique append-only, entreprise/contact/opportunité associés, date, type et métadonnées JSON ;
- `client_requests` : demandes adressées à MajestiOS, mais pas un registre général d'annonces publiques.

Le dossier entreprise affiche déjà l'identité et la provenance disponibles, ainsi que les contacts, opportunités et activités liées, avec pagination relationnelle côté serveur.

### Limites constatées

Le schéma ne contient pas encore d'objet dédié aux annonces publiées par les membres ou visiteurs, ni de registre structuré des besoins et disponibilités. Les colonnes `source_label`, `source_url` et les métadonnées d'activité ne remplacent pas un historique de provenance complet : elles ne suffisent pas à représenter les différentes versions, dates de collecte, preuves, consentements et relations d'une annonce.

En conséquence, aucune interface ne doit présenter aujourd'hui ces fonctions comme déjà opérationnelles dans le CRM.

## 3. Modèle fonctionnel cible

### A. Annonce

Une annonce est une publication structurée, créée manuellement ou importée depuis une source autorisée.

Familles envisagées :

- offre de sous-traitance ;
- recherche de sous-traitance ;
- offre d'emploi ;
- recherche d'emploi ou candidature ;
- mission ;
- demande de renfort ;
- disponibilité d'équipe ou de matériel ;
- compétence ou savoir-faire proposé ;
- besoin d'une entreprise ou d'un donneur d'ordre.

Champs fonctionnels à prévoir : type, titre, description, métier/compétence, APE/NAF indicatifs, zone géographique, rayon ou départements, dates de validité, statut de publication, auteur, organisation propriétaire, visibilité, date de création et de mise à jour.

Une annonce publiée sur MajestiOS doit pouvoir être gratuite selon les règles produit définies, sans que sa gratuité implique une diffusion publique illimitée des coordonnées personnelles.

### B. Besoin

Le besoin exprime ce qu'un acteur économique cherche à obtenir : compétence, prestation, sous-traitant, renfort, recrutement, mission ou capacité de production.

Il peut être :
- exprimé directement par une entreprise ou un contact ;
- déduit comme signal à examiner d'une annonce ou d'une source externe ;
- proposé par MajestiOS comme hypothèse à confirmer.

Un besoin détecté automatiquement doit toujours être identifié comme **signal à qualifier**, jamais comme une demande certaine de l'entreprise.

### C. Provenance / signal

Chaque signal doit conserver au minimum :
- source et type de source ;
- URL ou identifiant externe lorsque disponible ;
- date de publication de la source ;
- date et heure de collecte par MajestiOS ;
- méthode de détection ;
- extrait ou éléments justificatifs utiles ;
- statut de vérification humaine ;
- niveau de confiance et motif ;
- statut de fraîcheur / dernière vérification.

Une modification ultérieure de la fiche entreprise ne doit pas effacer l'origine du signal ni réécrire l'historique de collecte.

### D. Relations

Le modèle doit pouvoir relier explicitement :
- une annonce à son auteur et à son organisation ;
- une annonce à une entreprise, si celle-ci est identifiée avec suffisamment de certitude ;
- un besoin à une entreprise et éventuellement à un contact ;
- un signal à une annonce, un besoin, une entreprise ou une opportunité ;
- une opportunité à un ou plusieurs signaux déclencheurs ;
- les actions commerciales à l'entreprise, au contact, à l'opportunité et, si pertinent, au signal d'origine.

Les liens doivent pouvoir rester incomplets tant que l'identification n'est pas fiable. Ne jamais rattacher automatiquement une personne ou une annonce à une entreprise sur la seule base d'une ressemblance de nom.

## 4. Parcours attendu dans le dossier entreprise

Le dossier doit évoluer progressivement vers les rubriques suivantes :

1. **Identité** — données légales, commerciales et territoriales déjà disponibles.
2. **Contacts** — personnes liées, coordonnées et statut de consentement.
3. **Besoins et annonces** — demandes, offres, disponibilités et publications reliées.
4. **Signaux et provenance** — événements détectés, sources, dates, preuves et validation.
5. **Opportunités** — pistes commerciales qualifiées et étapes de transformation.
6. **Activités et historique** — appels, courriels, rendez-vous, notes et décisions.
7. **Potentiel relationnel** — rapprochements suggérés, complémentarités et prochaines actions à confirmer.

Les rubriques futures doivent afficher un état honnête : « à construire », « aucun élément enregistré » ou « données à qualifier ». Une rubrique non alimentée ne doit jamais laisser croire qu'une recherche exhaustive a été effectuée.

## 5. Règles de qualification et d'intelligence commerciale

- Séparer le fait observé, l'hypothèse algorithmique et la décision humaine.
- Afficher la source et la date de chaque signal.
- Ne pas transformer automatiquement un signal en opportunité qualifiée.
- Ne pas confondre une annonce publiée avec un consentement à recevoir une campagne commerciale.
- Ne pas déduire une intention d'achat certaine d'un recrutement, d'un changement administratif ou d'une publication.
- Permettre de corriger, invalider, fusionner sous contrôle ou archiver un rapprochement, sans détruire la trace d'origine.
- Respecter les oppositions, les finalités annoncées, les durées de conservation et les règles applicables aux données personnelles.
- Prévoir une validation humaine avant toute prise de contact issue d'un signal détecté.

## 6. Proposition de découpage technique — sans migration immédiate

Les futurs objets de données pourront être étudiés autour de trois registres distincts :

- **annonces** : publication et cycle de vie ;
- **besoins** : demande ou capacité exprimée / à confirmer ;
- **signaux de provenance** : collecte, source, justification, confiance et historique.

Des tables de liaison dédiées pourront être nécessaires pour relier plusieurs entreprises, contacts, annonces, besoins et opportunités sans imposer une relation artificiellement unique.

Avant toute migration, le modèle devra préciser :
- les frontières multi-tenant et la visibilité publique/privée ;
- les rôles autorisés à publier, modérer, consulter et retirer ;
- les politiques RLS et les contrôles d'écriture ;
- le cycle de vie, l'expiration et la modération des annonces ;
- la gestion du consentement et des coordonnées personnelles ;
- les clés d'idempotence et règles anti-doublons pour les imports ;
- les index de recherche et la pagination ;
- les règles de rattachement et de dé-rattachement des entreprises ;
- les obligations de journalisation et de suppression/archivage.

Aucune table, colonne, politique RLS, fonction, migration ou donnée ne doit être ajoutée avant validation de ce modèle et de ses scénarios de sécurité.

## 7. Séquence de réalisation proposée

1. **Stabiliser le dossier entreprise existant** : vérifier les données réelles et les relations, sans ajouter de faux indicateurs.
2. **Définir le registre d'annonces** : types, auteur, visibilité, modération, expiration et parcours de publication.
3. **Définir le registre des besoins** : distinguer demande explicite et signal inféré.
4. **Définir la provenance** : sources, dates, preuves, fraîcheur, confiance et validation.
5. **Concevoir le schéma multi-tenant et RLS** : revue des accès avant toute écriture.
6. **Construire les API et tests** : tenant isolation, rôles, idempotence, pagination, rattachements et audit.
7. **Intégrer les rubriques au dossier entreprise** : uniquement après disponibilité de données réelles.
8. **Ajouter les suggestions de potentiel relationnel** : explicables, sourcées et validées par un humain.

## 8. Critères d'acceptation avant mise en production

- Un membre ne voit que les annonces et besoins auxquels son rôle et leur visibilité lui donnent accès.
- Une annonce publique ne révèle pas automatiquement les coordonnées privées de son auteur.
- Chaque signal externe conserve sa source, son identifiant, ses dates et sa justification.
- Une hypothèse automatique est visuellement distinguée d'un fait confirmé.
- Un signal non vérifié ne déclenche aucun contact automatique.
- Les doublons sont détectés sans écrasement silencieux d'une fiche existante.
- Les liens entre annonce, besoin, entreprise, contact et opportunité sont traçables et corrigibles.
- Les recherches et listes sont paginées côté serveur et restent tenant-scoped.
- Les tests couvrent les rôles, l'isolation inter-tenant, les accès publics, les retraits, les expirations et les scénarios d'erreur.

## 9. Protection du périmètre actuel

Ce document est une spécification préparatoire. Il ne déclare aucune fonctionnalité nouvelle comme implémentée.

Aucun changement de code applicatif, schéma Supabase, migration, RLS, compte, rôle, donnée ou configuration n'est effectué dans ce lot documentaire. Aucun merge, déploiement ou promotion n'est demandé. L'immeuble interactif reste strictement hors périmètre.

## 10. Principe directeur

**MajestiOS ne doit pas seulement savoir qui est une entreprise. Il doit comprendre, avec des éléments vérifiables, ce qu'elle propose, ce qu'elle recherche, ce qui change autour d'elle et avec qui elle pourrait utilement entrer en relation.**

L'objectif n'est pas de surveiller les entreprises ni de fabriquer des intentions. Il est de transformer des informations dispersées en possibilités de coopération et de développement commercial, dans un cadre transparent, maîtrisé et réciproque.


## 11. Axe stratégique majeur — vulgariser et démocratiser les appels d'offres

La mission de MajestiOS va plus loin que publier des annonces ou rapprocher des entreprises : **MajestiOS doit rendre les appels d'offres compréhensibles, accessibles et exploitables par les petites entreprises, les artisans et les TPE/PME qui n'ont pas nécessairement les ressources administratives ou commerciales d'un grand groupe.**

Il ne s'agit pas de simplifier artificiellement les exigences ni de masquer les contraintes d'un marché. Il s'agit de traduire le langage administratif et technique en informations claires, hiérarchisées et directement utiles à la décision.

### Ce que MajestiOS doit rendre lisible

Pour chaque consultation, l'expérience devra progressivement permettre de comprendre :

- **L'objet réel du marché** : ce que l'acheteur veut concrètement faire réaliser, au-delà de l'intitulé administratif.
- **Les compétences attendues** : métiers, spécialités, qualifications, certifications et savoir-faire concernés, avec distinction entre exigences obligatoires et éléments simplement souhaités.
- **Le territoire** : lieu d'exécution, départements concernés, déplacements et contraintes d'intervention.
- **Les conditions d'accès** : critères de candidature, capacités demandées, références, assurances, moyens humains et matériels.
- **Les pièces du dossier** : rôle du règlement de consultation, du CCTP, du CCAP, du BPU, du DQE, du DPGF et des autres documents, expliqués en langage courant.
- **Les critères de sélection** : ce qui sera évalué, leur pondération lorsqu'elle est publiée, et les conséquences pratiques pour construire une réponse.
- **Le calendrier** : date limite, visites obligatoires, questions/réponses, délais et étapes importantes.
- **Les risques et points de vigilance** : clauses sensibles, pénalités, allotissement, variantes, sous-traitance, exigences disproportionnées ou points à faire vérifier.
- **La décision de se positionner** : adéquation entre le marché et les capacités connues de l'entreprise, éléments manquants et questions à résoudre avant de mobiliser du temps.

### Traduire, expliquer, orienter — sans déformer

Chaque explication doit distinguer clairement :
1. **Le texte officiel** : la formulation exacte issue de la consultation et de ses pièces.
2. **La traduction MajestiOS** : une reformulation pédagogique, sans altérer la portée juridique.
3. **L'interprétation ou le conseil** : une aide à la compréhension qui doit être présentée comme telle.
4. **Le point à confirmer** : toute ambiguïté nécessitant une vérification dans le dossier ou auprès de l'acheteur.

MajestiOS doit conserver un accès direct aux documents et passages sources. L'IA peut expliquer, résumer, comparer et signaler des incohérences, mais ne doit jamais inventer une exigence, garantir l'éligibilité ou se substituer à une validation juridique ou technique nécessaire.

### Rendre possible la réponse, même seul ou à plusieurs

La vulgarisation doit aider une entreprise à identifier plusieurs voies réalistes :

- répondre seule lorsqu'elle possède les capacités requises ;
- répondre à un lot précis plutôt qu'à l'ensemble du marché ;
- identifier les compétences ou pièces qui lui manquent ;
- rechercher un cotraitant, un groupement ou un sous-traitant complémentaire ;
- proposer ses compétences à une entreprise mieux dimensionnée pour porter la réponse ;
- détecter une opportunité de sous-traitance en amont ou en aval du marché.

C'est ici que le registre des annonces, des besoins, des entreprises et des compétences devient stratégique : il ne sert pas seulement à stocker des publications. Il permet de transformer un marché difficile à décoder en occasions de coopération concrètes.

### Parcours pédagogique cible

1. **Je découvre** — présentation claire du besoin de l'acheteur.
2. **Je comprends** — traduction des termes, documents et contraintes.
3. **Je vérifie** — exigences obligatoires, critères, calendrier et points de vigilance.
4. **Je mesure** — adéquation avec mes compétences, moyens, références et territoire.
5. **Je choisis** — répondre seul, sur un lot, en groupement, en sous-traitance ou ne pas candidater.
6. **Je m'entoure** — identification de partenaires complémentaires et préparation des mises en relation.
7. **Je prépare ma réponse** — checklist et accompagnement méthodologique, sans promesse de résultat.
8. **Je capitalise** — conservation des décisions, partenaires, réponses et retours d'expérience dans le CRM.

### Principe d'équité commerciale

Un appel d'offres ne doit plus être perçu comme un document opaque réservé aux entreprises déjà équipées d'un service commercial ou d'un bureau d'études. MajestiOS doit contribuer à réduire cette barrière de compréhension et à donner aux petites structures les moyens de voir où elles peuvent légitimement prendre leur place.

**La vulgarisation des appels d'offres est donc un axe produit à part entière, au même niveau stratégique que la détection des opportunités, le registre commercial et la mise en relation.** Elle doit guider les parcours, les contenus, les outils d'analyse et l'accompagnement, et non rester une simple rubrique d'aide.


## 12. Fonction IA centrale — traduire un appel d'offres en langage de chantier

L'IA intégrée ne doit pas s'arrêter à un résumé administratif. Elle doit traduire l'appel d'offres et ses pièces en langage de chantier : expliquer concrètement les travaux, les corps d'état concernés, les compétences, les lots, les contraintes, le calendrier et les conditions de candidature. Chaque explication doit rester reliée au passage source. Les faits du dossier, les reformulations pédagogiques, les hypothèses et les points à confirmer doivent être clairement distingués.

À partir de cette lecture, l'IA transforme le besoin en critères de recherche compréhensibles : métiers et compétences réellement nécessaires ; qualifications et certifications exigées ou pertinentes ; zone géographique et capacité d'intervention ; moyens humains et matériels adaptés ; références et assurances demandées ; capacités économiques et financières explicitement requises.

Les codes APE/NAF servent d'indices de recherche, jamais de preuve suffisante de compétence. Une qualification RGE n'est recherchée que pour les travaux et domaines où elle est pertinente ou explicitement demandée ; son domaine et sa validité doivent être vérifiés.

### Exemple de scénario de référence

> « Recherche entreprises de rénovation certifiées RGE, comptabilité saine, pour petits travaux sur la maison d'enfants de Boucé dans l'Orne. Vérifier votre éligibilité et construire votre dossier en créant votre espace personnel. »

L'IA analyse le contenu réel du marché pour déterminer les corps d'état et les exigences. Elle ne présume pas que tous les travaux nécessitent le RGE ni n'interprète « comptabilité saine » comme un jugement opaque. Les informations financières doivent être disponibles légalement, datées, sourcées et qualifiées : comptes publiés, évolution d'indicateurs, procédures collectives connues, données manquantes ou documents transmis volontairement. L'absence de comptes publiés ne prouve pas une mauvaise santé financière. Aucun résultat ne constitue un audit ou une garantie de solvabilité.

### Pré-diagnostic d'adéquation

Après création de son espace personnel, l'entreprise peut compléter son profil et transmettre les justificatifs nécessaires. L'IA compare les éléments disponibles aux exigences du marché, lot par lot, et présente :
- **semble correspondre** : éléments connus compatibles, sous réserve des vérifications finales ;
- **à compléter / à vérifier** : pièce absente, donnée incertaine ou information à confirmer ;
- **ne semble pas correspondre** : exigence explicite non satisfaite au vu des éléments connus.

Chaque état est justifié par l'exigence du marché et les informations du profil utilisées. Ce pré-diagnostic ne constitue pas une décision juridique d'admissibilité, laquelle relève de l'acheteur.

### Parcours de conversion et d'accompagnement

Appel à l'action cible :

**« Vérifiez votre éligibilité et construisez votre dossier — Créez votre espace personnel. »**

L'espace personnel permet de vérifier ou compléter la fiche entreprise, sélectionner les lots, renseigner les compétences, déposer les justificatifs, identifier les pièces manquantes, préparer une checklist et structurer les éléments de candidature et d'offre. L'entreprise conserve le contrôle de ses documents et valide explicitement toute transmission à un acheteur, partenaire ou tiers. La création d'un espace ne vaut ni candidature ni dépôt automatique.

## 13. L'espace personnel : une porte d'entrée qui construit le réseau MajestiOS

**La création d'un espace personnel constitue déjà une valeur stratégique pour MajestiOS, même si l'entreprise ne répond finalement pas à l'appel d'offres présenté.** Il ne faut donc pas mesurer le succès du parcours uniquement au nombre de candidatures déposées ou de marchés remportés.

Lorsqu'une entreprise crée son espace pour vérifier son adéquation à un chantier, MajestiOS commence à construire son réseau professionnel : il accueille un nouvel acteur, apprend à connaître son activité et ses compétences, et peut, avec les autorisations appropriées, enrichir progressivement le graphe relationnel de la plateforme.

Cette inscription doit être pensée comme une première relation utile, et non comme une simple collecte de coordonnées.

### Valeur créée dès l'inscription

- L'entreprise crée ou revendique sa fiche et vérifie son identité.
- Elle renseigne ses métiers, compétences, qualifications, territoires et capacités.
- Elle peut compléter son profil progressivement, sans être obligée de fournir immédiatement tous ses documents sensibles.
- Elle peut conserver son profil même si elle ne candidate pas à ce marché précis.
- Elle peut recevoir, selon ses choix et préférences explicites, des opportunités pertinentes à l'avenir.
- Elle peut publier ou consulter des offres, besoins, disponibilités et propositions de coopération selon les règles de visibilité de MajestiOS.
- Elle peut être mise en relation avec des entreprises complémentaires lorsqu'une opportunité concrète le justifie et qu'elle accepte cette mise en relation.

### Construire un réseau qualifié, pas une base de contacts artificielle

Le réseau MajestiOS doit se construire à partir de profils réels, de compétences renseignées, de qualifications vérifiables, de territoires d'intervention et de relations consenties. Il faut distinguer le compte utilisateur, l'entreprise représentée, les compétences et qualifications renseignées ou contrôlées, les documents privés déposés, les préférences de visibilité et les consentements.

L'inscription ne vaut pas consentement général à la prospection, à la publication de données ou au partage de documents. Les paramètres de visibilité, les finalités de traitement, les préférences de contact, les droits d'accès et les possibilités de retrait doivent être explicites.

### Indicateurs de valeur à suivre

Le pilotage MajestiOS devra mesurer notamment :
- les espaces personnels créés à partir d'un parcours d'appel d'offres ;
- les entreprises dont le profil est complété et vérifié ;
- les compétences et qualifications renseignées ;
- les entreprises qui reviennent consulter d'autres opportunités ;
- les mises en relation acceptées ;
- les coopérations ou candidatures effectivement engagées.

**Principe produit : un appel d'offres peut ne pas déboucher sur une candidature, mais il peut faire entrer une entreprise pertinente dans le réseau MajestiOS.** Chaque parcours doit donc offrir une raison concrète de créer son espace personnel, puis une valeur durable pour y rester actif.

La croissance du réseau doit rester un résultat de service rendu et de confiance gagnée, jamais une justification pour collecter des données sans finalité claire.
