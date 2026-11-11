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
