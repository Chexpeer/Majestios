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
