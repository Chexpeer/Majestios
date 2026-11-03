# Spécification fonctionnelle — Parcours depuis une annonce
Date : 1er novembre 2026
Branche : `refonte-moteur-navigation-mobile-2026-11-01`
Statut : **spécification proposée — non intégrée, non connectée**

## 1. Objectif

Permettre à un visiteur de passer d’une annonce ou d’un signal commercial à une action claire dans MajestiOS, sans confondre une annonce officielle, une hypothèse commerciale et une demande effectivement transmise.

Cette spécification prépare le parcours utilisateur. Elle **n’autorise pas** l’envoi de courriels, le dépôt d’une candidature, la création d’un compte, le stockage de données ni l’alimentation du CRM.

## 2. Distinguer les deux familles de résultats

### Marchés publics — BOAMP
La carte présente l’objet, l’acheteur, le territoire, la date de publication et la date limite lorsqu’elles sont disponibles.
- **Consulter l’avis officiel** : ouvre la publication source dans un nouvel onglet.
- **Demander un accompagnement pour répondre** : ouvre le formulaire MajestiOS prérempli avec la référence et le lien source, sans prétendre avoir déposé une candidature.
- **Préparer cette opportunité dans mon espace personnel** : propose le futur parcours d’espace membre ; jusqu’à connexion réelle, il doit être explicitement présenté comme une prévisualisation.

### Signaux commerciaux privés — BODACC
La carte présente l’entreprise, la famille d’annonce, la localisation, la date, la référence et un extrait disponible.
- **Consulter l’annonce officielle** : ouvre la publication source.
- **Étudier cette opportunité avec MajestiOS** : ouvre un formulaire de demande d’analyse ou de qualification, en précisant qu’une annonce BODACC est un signal légal et non un marché à remporter.
- **Préparer cette opportunité dans mon espace personnel** : futur parcours, non opérationnel tant que l’espace membre n’est pas connecté.

Les quatre catégories privées non connectées — immobilier professionnel, emploi et recrutement, offres de sous-traitance, recherche de sous-traitants et partenaires — ne doivent pas afficher de cartes d’annonces réelles tant que leurs sources ne sont pas intégrées et validées.

## 3. Formulaire de demande MajestiOS

Le formulaire, lorsqu’il sera connecté, devra :
1. identifier le type de demande : accompagnement à un marché public, analyse d’un signal BODACC, demande d’information, autre ;
2. reprendre les éléments connus de l’annonce : source, identifiant, URL officielle, titre ou objet, date et critères de recherche utiles ;
3. recueillir uniquement les coordonnées nécessaires et le message de l’utilisateur ;
4. expliquer clairement la finalité de la demande et le traitement des données ;
5. valider les champs côté navigateur **et côté serveur** ;
6. empêcher les doubles envois accidentels et appliquer une protection anti-abus ;
7. afficher une confirmation de transmission uniquement après acceptation effective par le serveur ;
8. afficher une erreur exploitable si la transmission échoue, sans prétendre que la demande est enregistrée.

Aucun consentement marketing ne doit être présumé à partir d’une demande d’accompagnement. Tout usage distinct devra être explicite et approprié.

## 4. Cases et actions à ne pas confondre

Les intentions suivantes sont différentes et doivent rester séparées :
- **Recevoir cette offre par e-mail** : nécessite un mécanisme réel de transmission et une adresse e-mail valide ; ne pas afficher de succès tant que ce service n’existe pas.
- **Demander un accompagnement / préparer une candidature** : crée une demande uniquement après transmission réelle et confirmation serveur. Cela ne dépose pas la candidature auprès de l’acheteur.
- **Créer mon espace personnel** : ouvre le parcours d’inscription dédié ; ne doit pas être traité comme une simple case cochée dans une demande d’accompagnement.
- **Consulter la source officielle** : navigation externe uniquement, sans collecte de coordonnées.

Tant que les traitements correspondants ne sont pas implémentés, les boutons doivent être masqués ou porter une mention explicite « prévisualisation — aucune donnée transmise ». Une simulation ne doit pas ressembler à une inscription, un e-mail ou un dépôt de dossier réussi.

## 5. Confirmation et retour à l’accueil

Le parcours futur pourra afficher une page ou un état de confirmation après réponse positive du serveur, puis proposer un retour à l’accueil après un délai annoncé. Le compte à rebours ne doit démarrer **qu’après une transmission réellement confirmée**. En cas d’échec, rester sur le formulaire et conserver les champs si cela peut être fait sans risque.

La consultation d’une source officielle ne nécessite pas de page de confirmation MajestiOS.

## 6. Préparation future du CRM — sans activation

Le modèle futur pourra prévoir une référence d’opportunité et une demande associée, avec provenance, date de collecte, type de source, URL officielle et statut de qualification. Cette préparation reste documentaire :
- aucune écriture CRM depuis le navigateur ;
- aucun événement ou adaptateur CRM dans le runtime ;
- aucun enregistrement automatique des critères de recherche ;
- aucune campagne ni relance automatique ;
- toute qualification commerciale reste distincte du fait publié et doit être validée par une personne habilitée.

## 7. Critères d’acceptation avant développement

- Les résultats BOAMP et BODACC sont visuellement et sémantiquement distincts.
- Chaque action indique son effet réel.
- La source officielle reste accessible depuis chaque carte.
- Une demande d’accompagnement reprend la référence et l’URL de l’annonce sans les inventer.
- Les intentions e-mail, candidature et création d’espace sont indépendantes.
- Aucun faux message de succès n’est affiché.
- Les erreurs de source et les catégories non connectées ne génèrent pas de résultats fictifs.
- Les tests couvrent validation, erreurs serveur, double envoi, confirmation réelle et navigation mobile.
- Le CRM reste désactivé jusqu’à une décision et une validation distinctes.

## 8. État d’implémentation au moment de la rédaction

Les pages de résultats affichent des cartes avec liens vers les publications officielles. Les formulaires d’espace personnel et de demande observés sont des prototypes/prévisualisations ; aucun traitement serveur complet n’a été démontré lors de cet audit. Cette spécification décrit la cible, pas un service disponible.


## Actualisation du statut — 2 novembre 2026

Cette spécification reste une cible fonctionnelle et non la preuve d'un service disponible. Les cartes et résultats du prototype ne doivent pas être confondus avec un traitement serveur complet. Le test navigateur de recherche MajestiOS échoue encore dans le workflow consulté le 2 novembre, même si les contrôles de connexion API BOAMP/BODACC ont réussi sur le commit testé. Les formulaires d'espace personnel, l'enregistrement CRM, les relances et campagnes automatiques restent non activés. Toute évolution du statut doit être appuyée par un test du parcours complet et une preuve de persistance. [Résultat CI](https://github.com/Chexpeer/Majestios/actions/runs/41460016382).
