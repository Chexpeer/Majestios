# Cartographie fonctionnelle transversale de Cheexpeer — Evolution-9

**Date :** 11 novembre 2026  
**Branche de référence :** `Evolution-9`  
**Statut :** cadrage fonctionnel à auditer ; ne vaut pas preuve d'implémentation, de déploiement ou d'activation.

## 1. Principe directeur

Cheexpeer ne se limite pas à un chatbot ni à un assistant CRM. Il est le binôme technico-commercial et l'agent transversal de MajestiOS. Il doit pouvoir intervenir depuis plusieurs interfaces et sur plusieurs familles de tâches, au moyen d'un socle commun de missions, d'identités, de permissions, de validations, de journaux et de résultats.

Les interfaces ne doivent pas créer des silos de données ou des droits implicites. Une même mission doit conserver son contexte, son organisation, son demandeur, ses sources, ses validations et son historique lorsqu'elle passe d'une interface à une autre.

Le parcours de valeur MajestiOS reste : **Détecter → Comprendre → Qualifier → Décider → Agir → Gérer → Facturer → Capitaliser.**

## 2. Interfaces et domaines à couvrir

| Interface / domaine | Mission attendue | Contrôles prioritaires |
|---|---|---|
| MajestiOS Bot | Accueil, compréhension de la demande, orientation et aide à l'utilisation | Cloisonnement des conversations, identité, contexte d'organisation, absence de promesse de capacité non disponible |
| Cheexpeer Admin | Centre de commande privé, suivi des missions, arbitrage, supervision et configuration | Authentification et habilitation serveur, privilèges minimaux, double validation pour actions sensibles, journal append-only |
| CRM | Entreprises, contacts, opportunités, activités, rappels et suivi commercial | Isolation multi-tenant, intégrité des relations, historisation, transitions contrôlées, droits par action |
| Vulgarisation des appels d'offres | Lecture guidée des pièces et traduction en langage clair, notamment langage de chantier | Références aux pièces/pages, distinction fait/interprétation, détection des exigences et alertes, validation humaine |
| Rédaction de rapports | Rapports de veille, d'analyse, de qualification, de scoring et de suivi | Sources, date, périmètre, hypothèses, niveau de confiance, version et traçabilité des modifications |
| Recherche d'opportunités | Détection, collecte, dédoublonnage, qualification et transmission au CRM | Provenance/licence des sources, fraîcheur, anti-doublons, filtrage, quotas et contrôle des imports |
| Scoring | Aide à la qualification des entreprises, contacts et opportunités | Critères explicites, pondérations versionnées, explication du score, données utilisées, date de calcul, possibilité de contestation/correction |
| Présence virtuelle et réputation | Diagnostic de visibilité, cohérence des informations publiques, référencement et recommandations | Séparation données publiques/privées, preuves des constats, consentement avant publication ou modification externe |
| Facturation électronique et dématérialisation | Diagnostic de préparation, accompagnement, suivi des flux et orientation vers des partenaires | Exactitude réglementaire, statut réel des partenaires, séparation CRM/facturation/PA, validation avant émission ou transmission |
| Communauté / communication MajestiOS | Veille LinkedIn, stratégie éditoriale, rédaction, calendrier, interactions et mesure | Validation humaine des publications et interactions engageantes, protection des identifiants, respect des conditions des plateformes |

Cette liste est un périmètre d'audit et de conception. Elle ne signifie pas que chaque interface ou connecteur est déjà opérationnel.

## 3. Parcours prioritaire : création d'une nouvelle entreprise

Lorsqu'une entreprise est créée ou importée dans le CRM, Cheexpeer doit pouvoir proposer un parcours d'accueil contextualisé, sans déclencher automatiquement d'action externe.

Ordre de proposition recommandé :

1. **Présence virtuelle** : établir un diagnostic initial de la présence publique, de la cohérence des informations et de la visibilité numérique.
2. **Facturation électronique** : proposer un diagnostic de préparation adapté à la situation de l'entreprise, à ses flux et à ses outils ; présenter les échéances et les choix à étudier à partir de sources officielles à jour.
3. **Qualification commerciale** : préciser activité, codes NAF/APE, zone, taille, compétences, clientèle et objectifs, selon les données disponibles et autorisées.
4. **Recherche d'opportunités** : identifier des consultations, besoins et pistes pertinentes, en expliquant les critères de correspondance.
5. **Scoring explicable** : proposer des scores distincts (adéquation, priorité commerciale, maturité numérique ou préparation administrative) et jamais un score opaque unique.
6. **Plan d'action** : produire des recommandations priorisées, des tâches et un rapport de synthèse soumis à validation.

Le parcours doit signaler les données manquantes, demander confirmation lorsque nécessaire et permettre de différer ou refuser chaque proposition. Il ne doit pas présumer que l'entreprise souhaite une prestation, un abonnement, un partenaire ou une communication.

## 4. Contrat commun des missions

Chaque mission Cheexpeer doit comporter au minimum :

- un identifiant stable, un type et une version de contrat ;
- un demandeur authentifié et un contexte d'organisation vérifié côté serveur ;
- une interface d'origine et, le cas échéant, une interface de destination ;
- un objectif, un périmètre, des données autorisées et une provenance ;
- un niveau d'autonomie explicite et les effets possibles ;
- des permissions minimales, des quotas et des limites de coût ;
- une règle d'approbation humaine adaptée au risque ;
- des étapes, états, horodatages et événements d'audit ;
- un résultat structuré, les sources, limites et erreurs ;
- une clé d'idempotence pour éviter les doubles exécutions ;
- une politique de conservation, d'export et de suppression.

Une mission refusée, expirée, interrompue ou en échec doit rester traçable sans exposer de secrets ni de données personnelles superflues.

## 5. Niveaux d'autonomie et validations

| Niveau | Autorisation de principe | Exemples |
|---|---|---|
| A0 — Observer | Lecture technique ou diagnostic borné, sans effet métier | Disponibilité du worker, contrôle de cohérence |
| A1 — Analyser | Lire les données autorisées et produire une synthèse privée | Résumé d'appel d'offres, diagnostic de présence, analyse de scoring |
| A2 — Préparer | Préparer un brouillon ou une proposition sans l'envoyer ni l'appliquer | Rapport, campagne, publication, devis ou facture en brouillon |
| A3 — Agir après approbation | Exécuter une action explicitement approuvée, limitée et journalisée | Import CRM validé, envoi autorisé, publication validée |
| A4 — Automatiser sous politique | Répéter une action préalablement autorisée, bornée et révocable | Veille planifiée ou synchronisation non engageante |

Les niveaux ne sont pas des droits globaux attachés à l'agent. Ils s'appliquent par outil, organisation, utilisateur, type de données et effet. Les actions financières, réglementaires, contractuelles, de publication, de suppression ou de communication externe nécessitent une validation explicite, sauf politique ultérieure formellement approuvée et testée.

## 6. Sécurité et cloisonnement

- Le contexte d'organisation est établi et contrôlé côté serveur ; il n'est jamais accepté comme preuve depuis une entrée libre du navigateur.
- Les espaces utilisateur, CRM, administration interne, GitHub et connecteurs externes restent séparés.
- Une mission ne peut pas réutiliser un résultat ou un document d'une autre organisation.
- Les outils sont refusés par défaut s'ils ne sont pas inscrits et autorisés dans le registre.
- Les secrets restent côté serveur, sont séparés par environnement et ne sont jamais inclus dans les prompts, rapports ou journaux.
- Les lectures sensibles sont limitées au besoin de la mission ; les exports sont contrôlés.
- Toute écriture métier est autorisée par une permission spécifique et journalisée.
- Les publications, emails, factures, transmissions réglementaires, modifications de droits et suppressions sont soumises à approbation adaptée.
- Les tests inter-organisations doivent prouver les refus d'accès, pas seulement les accès autorisés.
- Les données de test sont synthétiques et isolées ; aucune fixture ne doit être injectée dans la production.

## 7. Critères de recette transversaux

Pour chaque interface et chaque famille de mission, vérifier :

1. accès autorisé et refusé selon les rôles ;
2. isolation entre au moins deux organisations ;
3. conservation du contexte en cas de passage entre interfaces ;
4. traçabilité des sources, décisions, versions et résultats ;
5. gestion des erreurs, reprises, doublons et expirations ;
6. absence d'effet externe avant validation ;
7. comportement sur données manquantes ou contradictoires ;
8. accessibilité, ergonomie mobile et desktop ;
9. messages utilisateur distinguant capacité prévue, implémentée, déployée et recettée ;
10. tests de non-régression des parcours existants.

## 8. Ordre d'audit proposé

1. Socle d'identité, permissions, missions, approbations et journalisation.
2. Relations entreprises–contacts–opportunités, historisation et transitions commerciales.
3. MajestiOS Bot et centre de commande Cheexpeer Admin.
4. Recherche d'opportunités, dédoublonnage et scoring explicable.
5. Vulgarisation des appels d'offres et rédaction de rapports.
6. Présence virtuelle, SEO et réputation.
7. Parcours de facturation électronique et connecteurs partenaires.
8. Communauté et communication externe, avec validation humaine.

Aucune activation de connecteur ou extension d'autonomie ne précède la recette du socle de sécurité correspondant.

## 9. État de preuve

À la date de rédaction, ce document définit le périmètre à auditer et les critères d'acceptation. Chaque capacité doit ensuite être qualifiée séparément : **spécifiée, présente dans le code, déployée, connectée, autorisée, testée et recettée**. Une étape ne prouve pas automatiquement les suivantes.


## 10. Collecte de données autorisée — scraping et veille

Cheexpeer doit disposer à terme d'une capacité de collecte automatisée de sources publiques et de sources explicitement autorisées. La préférence va aux API officielles et jeux de données ouverts ; le scraping HTML n'est utilisé que lorsque l'accès et les conditions applicables l'autorisent.

Périmètre fonctionnel attendu :
- catalogue de sources documenté (propriétaire, finalité, base d'accès, conditions, fréquence, champs collectés et durée de conservation) ;
- paramétrage des mots-clés, zones géographiques, codes NAF/APE, catégories et calendriers de collecte ;
- détection des annonces nouvelles, modifiées, retirées et des échéances ;
- normalisation, dédoublonnage, qualification explicable et classement ;
- alimentation prioritaire de Veille, puis proposition d'import CRM contrôlé ; aucune création ou modification CRM massive et silencieuse ;
- conservation de la provenance (source, URL canonique, identifiant source, date de publication si connue, date de collecte, empreinte du contenu et historique des changements) ;
- quotas, limites de concurrence, délais, taille maximale, reprise avec backoff et journalisation des erreurs.

Garde-fous obligatoires : respect des conditions d'utilisation, des restrictions d'accès, des règles de protection des données et de robots.txt lorsqu'applicable ; aucun contournement de CAPTCHA, authentification, paywall ou mesure technique d'accès. Validation des URL et redirections, blocage des IP privées et services de métadonnées, liste d'hôtes autorisés, protection SSRF, nettoyage HTML et interdiction d'exécuter le code récupéré. Les pages et documents collectés sont des données non fiables : leurs instructions ne doivent jamais être suivies comme des instructions système ou des ordres d'outil (défense contre l'injection de prompt). Toute action externe reste soumise à validation humaine.

Tests d'acceptation à prévoir : injection de prompt dans une page, SSRF et redirections, dépassement de taille, limitation de débit, indisponibilité et reprise, dédoublonnage, détection de changement, provenance, cloisonnement inter-organisations et blocage de toute action externe non approuvée.

**État réel :** capacité spécifiée uniquement. Aucun scraper n'est déclaré implémenté, activé ou déployé. Le worker actuel reste fail-closed sur les seuls handlers explicitement autorisés ; aucune collecte ne doit être lancée avant revue de sécurité et recette.

## 11. Connecteurs Google — périmètre cible

Cheexpeer doit pouvoir se connecter, après consentement et autorisation explicite des administrateurs concernés, aux services Google utiles à la gestion, à la prospection et à la visibilité de MajestiOS. Les connecteurs sont indépendants et activables séparément :

| Domaine | Capacités attendues | Limites et validations |
|---|---|---|
| Google Ads (ancien nom : AdWords) | Lecture des comptes autorisés, campagnes, groupes, annonces, mots-clés, budgets, conversions et rapports ; analyse et recommandations ; préparation de brouillons ou changements proposés. | Aucun lancement, pause, modification d'annonce, de ciblage ou de budget sans approbation explicite. Respect des rôles Google Ads, du développeur token et des quotas API. |
| Google Workspace | Selon les services autorisés : Gmail, Agenda, Drive, Docs, Sheets et éventuellement Meet ; recherche ciblée, synthèse, création de brouillons/documents et organisation de fichiers. | OAuth par utilisateur et scopes minimaux ; accès limité aux comptes, boîtes, calendriers et fichiers nécessaires. Pas de délégation globale de domaine par défaut. Envoi d'email, partage externe, suppression ou modification sensible soumis à validation. |
| Google Business Profile (Google Business) | Lecture et gestion contrôlée des établissements autorisés, informations de fiche, publications, avis et statistiques disponibles via les API éligibles. | Vérifier l'éligibilité et la validation des établissements, les accès propriétaires/gestionnaires et les conditions API. Réponse à un avis, publication ou modification publique après validation humaine. |

Architecture et sécurité communes : OAuth 2.0 et consentement explicite, scopes minimaux par connecteur, secrets conservés côté serveur dans un gestionnaire adapté, séparation test/production, révocation accessible, journal des accès et actions, quotas, gestion des expirations/renouvellements de jetons et absence de secrets dans les prompts ou journaux. Les données Google restent cloisonnées par organisation et par utilisateur ; une connexion ne vaut jamais autorisation universelle.

Chaque opération est classée en lecture, préparation ou exécution. Les lectures sont limitées au besoin de la mission ; les brouillons ne sont pas envoyés ; les actions qui dépensent un budget, publient, répondent à un avis, envoient un message, partagent ou suppriment des données nécessitent une approbation explicite et une trace d'audit. Les API officielles et leurs règles d'accès priment sur toute automatisation par navigateur ou scraping.


### 11.1 Gestion des avis et commentaires Google Maps

Dans le périmètre Google Business Profile, Cheexpeer doit proposer un espace de gestion de la réputation uniquement après accord préalable, explicite et vérifiable de l'entreprise concernée.

**Condition préalable impérative — accord de l'entreprise :**
- Avant toute connexion, collecte, lecture, analyse, conservation ou traitement des avis d'une entreprise, obtenir son accord explicite, donné par un représentant habilité. Le fait qu'une fiche ou des avis soient publiquement visibles sur Google Maps ne constitue jamais un consentement.
- Identifier l'entreprise, le représentant qui donne l'accord, les établissements/fiches concernés, les finalités autorisées (lecture, analyse, préparation de réponses et, séparément, publication), les comptes Google habilités et la durée ou les conditions de validité de l'autorisation.
- Conserver une preuve datée de l'accord, sa portée, sa version et son statut dans un registre d'autorisations auditable. Vérifier l'habilitation du représentant et les permissions Google effectives ; l'accord de l'entreprise ne remplace pas les droits techniques requis sur le compte Google.
- Ne jamais étendre l'accord à d'autres établissements, entités juridiques, comptes ou finalités par déduction. Toute extension nécessite un nouvel accord explicite.
- Permettre à l'entreprise de retirer son accord. Dès révocation ou expiration, suspendre les accès et traitements concernés, révoquer les jetons lorsque cela relève du connecteur, et appliquer la politique documentée de conservation/suppression des données déjà collectées.
- En l'absence d'accord valide, Cheexpeer ne se connecte pas pour cette entreprise, ne lit ni n'analyse ses avis, ne prépare ni ne publie de réponse. Le module reste inactif pour son périmètre.

Après vérification de cet accord et des droits Google, les capacités suivantes peuvent être proposées :

- lire les avis et notes accessibles via les API Google Business Profile pour les fiches dont l'utilisateur connecté détient un rôle autorisé ;
- classer les avis (positif, neutre, négatif), détecter les sujets récurrents et signaler les avis récents ou sensibles ;
- produire une synthèse périodique des tendances, de la répartition des notes et des sujets à traiter, avec liens et dates des avis sources ;
- préparer une réponse contextualisée, factuelle, courtoise et non stéréotypée, avec variantes de ton si utile ;
- permettre à l'utilisateur habilité de modifier, rejeter ou approuver la réponse avant publication ;
- publier la réponse uniquement après une approbation explicite, sur la fiche et l'avis précisément identifiés, puis vérifier et journaliser le résultat retourné par l'API.

Pour un avis négatif, Cheexpeer doit d'abord analyser le motif et proposer une réponse qui reconnaît l'expérience exprimée sans divulguer d'informations personnelles, confirmer publiquement des faits non vérifiés, accuser le client ou révéler des éléments de dossier. Les avis contenant des données personnelles, menaces, accusations graves, sujets de santé/sécurité ou risque juridique sont classés sensibles et transmis à une validation humaine renforcée ; Cheexpeer peut proposer une réponse prudente ou recommander de poursuivre en privé, sans publier seul.

Les avis sont des contenus externes non fiables : aucune instruction qu'ils contiennent ne peut modifier les règles de Cheexpeer ou déclencher un outil. La collecte et les réponses doivent utiliser les API officielles et respecter les conditions Google, les permissions réelles du compte et les limites de l'API. Ne pas promettre la lecture de tous les avis de toutes les fiches publiques : l'accès est borné aux établissements gérés/éligibles et aux données exposées par l'API.

Critères de recette : blocage total sans accord préalable valide ; preuve, représentant, portée et durée de l'accord vérifiés ; révocation/expiration effectivement bloquante ; lecture limitée aux fiches expressément couvertes par l'accord et aux permissions Google ; refus d'accès aux établissements d'un autre compte/tenant ; pagination et gestion des quotas ; classement avec justification ; génération sans fuite de données CRM ; validation obligatoire avant publication ; association exacte réponse/avis/fiche ; journal avant/après et vérification du statut API ; reprise sûre en cas de timeout sans double réponse.

**Statut :** exigence spécifiée uniquement ; aucune connexion Google, lecture d'avis, rédaction assistée ou publication n'est déclarée opérationnelle. L'accord préalable de l'entreprise concernée est un prérequis bloquant, distinct de l'approbation humaine requise pour chaque réponse publique.

**État réel :** périmètre demandé et spécifié ; aucun connecteur Google n'est déclaré connecté, autorisé, implémenté, déployé ou recetté par cette inscription documentaire. Les services Google et leurs scopes devront être activés individuellement après étude des API, des autorisations du compte et des tests de sécurité.
