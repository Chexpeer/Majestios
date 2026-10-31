# Traitement des opportunités — parcours client et chaîne interne MajestiOS

Version : 2026-10-31  
Statut : spécification fonctionnelle à mettre en œuvre progressivement. La connexion BOAMP du prototype fournit une première recherche publique ; les marchés privés, le profil d'entreprise, les alertes, le CRM persistant et la qualification assistée restent à développer.

## 1. Principes non négociables

1. Une annonce n'est dite réelle que si elle provient d'une source consultée et identifiable.
2. Chaque fiche conserve sa source, son URL officielle, son identifiant source, la date de publication et la date de récupération.
3. Le texte de la source, les données normalisées, les inférences automatiques et les décisions humaines sont des objets distincts.
4. Un score de pertinence ne prouve ni l'éligibilité du client ni ses chances de gagner.
5. Une échéance manquante ou ambiguë déclenche une vérification ; elle ne doit jamais être inventée.
6. Les annonces expirées, retirées, en doublon ou non vérifiées sont exclues des résultats présentés comme opportunités ouvertes.
7. Aucun contact commercial externe, envoi d'e-mail ou dépôt de candidature n'est déclenché automatiquement par une hypothèse générée par l'IA.
8. Le prototype ne prétend pas conserver durablement les décisions tant que la base de données et l'authentification ne sont pas raccordées.

## 2. Chaîne interne MajestiOS

### A. Collecter
- Interroger chaque source selon ses conditions d'accès et sa fréquence de mise à jour.
- Enregistrer la source, l'horodatage de récupération et l'identifiant d'origine.
- Conserver un état de connecteur distinct : opérationnel, retardé, en erreur, non configuré.

### B. Normaliser
Transformer chaque annonce vers `schemas/opportunite.schema.json` : titre, résumé, catégorie, type de marché, acheteur publié, localisation, publication, échéance, URL source, pièces et statut.

### C. Dédupliquer
1. Identifiant source + source.
2. À défaut, empreinte contrôlée fondée sur titre normalisé, acheteur, dates et localisation.
3. Ne jamais fusionner silencieusement deux avis liés mais distincts : conserver les relations entre avis quand elles sont identifiables.

### D. Contrôler et qualifier
- Vérifier la présence d'une URL officielle, la cohérence des dates, le statut et la fraîcheur.
- Classer : à vérifier, exploitable, expirée, retirée, doublon, rejetée.
- La catégorie automatique est une suggestion à confirmer lorsque la confiance est insuffisante.
- Journaliser les corrections et la raison du changement de statut.

### E. Rapprocher avec une entreprise
Lorsque le profil entreprise sera disponible, comparer les critères de l'annonce avec les informations fournies par le client : activités, mots-clés, zone d'intervention, taille/capacités, références et certifications déclarées. N'utiliser que les données nécessaires et autorisées.

Un éventuel score doit être explicable (par exemple : activité, géographie, délai restant, exigences déclarées). Afficher les critères qui augmentent ou diminuent la correspondance, les données manquantes et les limites. Ne pas transformer ce score en promesse d'éligibilité ou de succès.

### F. Publier et suivre
Seules les annonces suffisamment vérifiées sont présentées comme ouvertes. Les mises à jour de source doivent pouvoir modifier leur statut. Garder l'historique de publication et de fermeture pour éviter de réafficher une opportunité expirée.

## 3. Vue client

Chaque carte de résultat devrait présenter :
- intitulé clair et type de marché ;
- acheteur ou donneur d'ordre tel que publié par la source ;
- territoire, si connu ;
- date de publication et échéance de réponse ;
- source et date de dernière vérification ;
- résumé factuel, lots/pièces lorsqu'ils sont disponibles ;
- bouton vers l'avis officiel ;
- actions MajestiOS futures : enregistrer, recevoir une alerte, demander un accompagnement, préparer une réponse.

Les actions « enregistrer », « alerter » ou « demander un accompagnement » doivent afficher leur statut réel. Avant connexion du compte et du backend, elles ne doivent pas laisser croire que la demande est enregistrée ou envoyée.

États d'interface obligatoires : chargement, résultats, aucun résultat, source indisponible, critères trop restrictifs, données incomplètes, échéance à vérifier et source non connectée. Les marchés publics et privés doivent rester distincts : l'absence de source privée ne doit jamais être masquée par des résultats BOAMP.

## 4. Vue interne MajestiOS

Prévoir une file de traitement interne séparée de la page publique, avec au minimum :
- source et date de récupération ;
- identifiant source et détection des doublons ;
- statut de vérification ;
- qualité et complétude des champs ;
- échéance et risque d'expiration ;
- catégorie proposée et justification ;
- erreurs de collecte / transformation ;
- historique des corrections, validations et retraits ;
- raison d'exclusion ou de publication.

Statuts internes suggérés : `received`, `normalized`, `duplicate_review`, `to_verify`, `approved`, `published`, `expired`, `withdrawn`, `rejected`, `source_error`. Ces statuts de traitement ne remplacent pas le statut officiel de l'annonce.

## 5. Ordre d'implémentation

1. Première source publique BOAMP : recherche, rendu des résultats, provenance et lien officiel.
2. Tests navigateur : critères conservés, résultat rendu, absence de résultat, source indisponible, échéance passée, marchés privés non mélangés.
3. Validation des champs BOAMP et des règles de classification avant d'élargir la taxonomie.
4. Stockage centralisé, historique et déduplication serveur.
5. Connecteurs supplémentaires après vérification de leurs conditions d'accès.
6. Profil entreprise, rapprochement explicable, alertes et espace personnel.
7. File interne de qualification et CRM uniquement après mise en place de l'authentification, des autorisations et de la politique de conservation.

## 6. Limites actuelles à afficher

Le prototype interroge le jeu BOAMP depuis le navigateur et n'a pas encore de cache serveur ni de file de traitement persistante. Les résultats privés ne sont pas raccordés. Les critères de catégorie hors type de marché reposent encore sur des correspondances textuelles simples : ils devront être validés avant d'être considérés comme une classification fiable. La recherche BOAMP ne couvre pas à elle seule l'ensemble des marchés publics, et encore moins les marchés privés.
