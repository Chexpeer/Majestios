# MajestiOS — Vision produit « CRM tout-en-un »
 
**Référentiel de préparation :** branche `Evolution-7`  
**Version :** cadrage stratégique et fonctionnel préparatoire à Evolution-8  
**Date :** 11 novembre 2026  
**Statut :** vision produit à instruire ; ce document ne vaut ni spécification finale, ni déclaration de fonctionnalités disponibles.

---

## 1. Ambition

MajestiOS ambitionne de devenir un **CRM tout-en-un orienté développement, gestion et accompagnement des entreprises**, particulièrement accessible aux artisans, TPE et petites structures, sans exclure les organisations qui disposent déjà de leurs propres outils.

La formule de positionnement de travail est :

> **MajestiOS — Le CRM tout-en-un pour développer, gérer et faire grandir son entreprise.**

L'expression « premier vrai CRM tout-en-un » peut servir d'ambition éditoriale interne. Elle ne doit pas être publiée comme affirmation factuelle de primauté ou de supériorité tant qu'une étude concurrentielle sérieuse ne l'a pas établie.

MajestiOS ne doit pas être conçu comme une simple juxtaposition de logiciels. Sa valeur vient de la continuité des informations et des parcours : détecter, comprendre, qualifier, décider, agir, gérer, facturer, accompagner et capitaliser.

## 2. Le problème client à résoudre

Les petites entreprises utilisent souvent plusieurs outils qui communiquent peu : tableur ou carnet de contacts, logiciel de devis, outil de facturation, agenda, stockage documentaire, plateformes de dématérialisation, outils de prospection et messageries.

Cette fragmentation entraîne notamment :
- ressaisies et doublons ;
- perte d'historique entre prospection, devis, chantier et facture ;
- manque de visibilité sur les actions à effectuer et les règlements ;
- difficulté à comprendre et anticiper les obligations de dématérialisation ;
- dépendance à plusieurs interfaces et abonnements ;
- difficulté à obtenir une aide contextualisée.

MajestiOS doit réduire cette fragmentation, sans promettre une interconnexion universelle avec tous les logiciels du marché.

## 3. Publics et portes d'entrée

### 3.1 Entreprise sans CRM structuré

Elle peut adopter le CRM client MajestiOS comme environnement principal, avec un parcours guidé et une prise en main progressive.

### 3.2 Entreprise déjà équipée

Elle conserve son CRM ou logiciel métier lorsque cela répond à ses besoins. MajestiOS propose les services compatibles : accompagnement, veille, intelligence commerciale, orientation vers une PA, connecteurs disponibles et services partenaires.

### 3.3 Entreprise qui souhaite évoluer

Elle peut commencer par un service précis, puis activer progressivement les modules MajestiOS. La migration des données ne doit jamais être une condition cachée d'accès aux services.

**Principe commercial :** ne pas imposer le CRM MajestiOS ; démontrer son utilité et permettre au client de choisir son niveau d'intégration.

## 4. Architecture fonctionnelle cible

Les domaines suivants constituent une cible produit. Leur présence dans cette liste ne signifie pas qu'ils sont déjà implémentés ou déployés.

| Domaine | Rôle cible | Exemples de fonctions |
|---|---|---|
| Développement commercial | Trouver et qualifier des opportunités | Prospection, veille, entreprises, marchés publics et privés |
| CRM & relation client | Organiser les relations et le pipeline | Entreprises, contacts, opportunités, activités, tâches, relances |
| Gestion opérationnelle | Suivre le travail réalisé | Devis, chantiers, interventions, agenda, documents |
| Facturation | Gérer le cycle financier documentaire | Factures, avoirs, échéances, règlements, impayés |
| Facturation électronique | Assurer les échanges réglementaires via une PA | Émission, réception, statuts, rejets et flux applicables |
| Dématérialisation | Fluidifier les documents et processus | Classement, circulation, archivage, préparation des dossiers |
| Réseau partenaires | Orienter vers des services complémentaires | PA, logiciels, experts et prestataires référencés |
| Intelligence & pilotage | Aider à comprendre et décider | Indicateurs, synthèses, analyses et alertes |
| Cheexpeer | Assistant transversal | Aide, recherche, préparation, automatisations autorisées |
| Accompagnement | Aider à franchir les étapes | Appels d'offres, facturation électronique, organisation et prise en main |

Les modules doivent être activables progressivement, avec des frontières claires, des interfaces cohérentes et des contrats d'échange documentés.

## 5. Architecture d'offre : trois composants complémentaires

### 5.1 MajestiOS CRM

Le CRM natif de MajestiOS, destiné aux entreprises qui souhaitent un environnement unifié. Il pourra intégrer les fonctions commerciales et opérationnelles retenues après étude des usages artisans.

### 5.2 MajestiOS Facturation

Un module de facturation conçu pour être utilisable :
- dans le CRM MajestiOS ;
- depuis un CRM externe au moyen d'un connecteur lorsque son éditeur expose une interface adaptée ;
- via un parcours d'import/export structuré ou un accompagnement lorsque la connexion directe n'est pas disponible.

Le module doit être conçu autour d'un noyau métier indépendant de l'écran CRM. Les fonctions candidates comprennent devis, factures, avoirs, clients de facturation, suivi des règlements, statuts, anomalies, pièces justificatives et historique.

### 5.3 MajestiOS Connect

Une couche d'intégration et d'interopérabilité entre MajestiOS, les logiciels tiers et les plateformes agréées. Elle porte les connecteurs, les transformations de données, les contrôles, les notifications, la traçabilité et les mécanismes de reprise.

Ces trois composants forment une architecture cible, pas trois produits déjà disponibles.

## 6. Facturation électronique : règles de conception

MajestiOS ne se présente pas comme une plateforme agréée (PA) en l'absence d'immatriculation correspondante. La cible à instruire est une intégration avec une ou plusieurs PA partenaires, selon les contrats, les API et les cas d'usage effectivement couverts.

Le système doit distinguer :
- le logiciel de gestion ou de facturation ;
- la solution compatible éventuellement utilisée par le client ;
- la plateforme agréée qui assure les fonctions réglementaires relevant de son statut ;
- les responsabilités contractuelles et légales de chaque intervenant.

Une transmission directe n'est possible que si une intégration technique et contractuelle est réellement disponible. Un PDF envoyé par courriel n'est pas, à lui seul, une facture électronique réglementaire.

Les exigences à instruire comprennent les flux d'émission et de réception, les statuts et rejets, les avoirs et corrections, les données nécessaires au e-reporting selon les cas, les preuves de traitement, la sécurité, la continuité et la réversibilité. Les obligations et formats devront être revérifiés auprès des sources officielles et du partenaire au moment de la conception et de la mise en production.

Aucun partenaire, prix, quota, SLA ou engagement de gratuité n'est validé à ce stade.

## 7. Expérience utilisateur recherchée

La complexité technique doit rester invisible pour l'utilisateur.

Principes :
1. une interface claire, mobile-first et accessible ;
2. une navigation organisée par tâches métier, pas par architecture technique ;
3. un tableau de bord utile dès la première connexion ;
4. une seule saisie lorsque les données peuvent être réutilisées légalement et techniquement ;
5. une source de référence clairement identifiée pour chaque donnée ;
6. des statuts compréhensibles et des erreurs explicables ;
7. des imports guidés et des exports réversibles ;
8. une activation progressive des modules ;
9. une aide contextuelle et une validation humaine pour les actions engageantes.

Pour un artisan, les parcours doivent partir des tâches quotidiennes : trouver un client, préparer un devis, planifier une intervention, facturer, suivre le paiement et retrouver le document.

## 8. Rôle de Cheexpeer

Cheexpeer est l'assistant IA transversal de MajestiOS. Il peut à terme assister les utilisateurs et les équipes dans les différents modules : recherche, qualification, synthèse, préparation documentaire, suivi des échéances, explication de dossiers et aide à la décision.

Ses capacités doivent être graduées et démontrées :
- lire et expliquer ;
- rechercher et synthétiser avec sources ;
- proposer et préparer ;
- agir uniquement dans un périmètre autorisé ;
- demander une validation humaine pour les actions externes ou engageantes.

Cheexpeer ne doit pas être présenté comme capable d'émettre, transmettre, modifier ou payer une facture tant que les intégrations, habilitations, contrôles et recettes correspondants ne sont pas démontrés. Les données d'un client ne doivent jamais être accessibles à un autre client par l'intermédiaire de l'agent.

## 9. Modèle économique à étudier

Le modèle peut associer :
- un socle CRM gratuit réellement utile, si son coût d'exploitation est soutenable ;
- des options payantes correspondant à des gains identifiables ;
- des services d'accompagnement ;
- des intégrations ou services partenaires ;
- des offres professionnelles adaptées au volume, à l'équipe et au niveau d'assistance.

Le coût des services tiers, notamment celui de la PA, doit être explicite. La gratuité du CRM ne signifie pas que les prestations réglementaires du partenaire sont gratuites ou illimitées.

Aucun tarif, volume inclus ou niveau de service n'est arrêté ici. Une étude économique devra intégrer hébergement, stockage, support, coûts IA, coûts PA, maintenance des connecteurs, sécurité et acquisition.

## 10. Séparation des espaces et des données

La cible impose de distinguer au minimum :

1. **CRM interne MajestiOS** : prospection, clients de MajestiOS, partenaires et pilotage de l'activité propre de MajestiOS.
2. **Espace CRM de chaque entreprise cliente** : données de cette entreprise, de ses collaborateurs et de ses propres clients.
3. **CRM externe du client** : système tiers qui reste sous la maîtrise de son éditeur et de son entreprise.
4. **Référentiel partenaires et connecteurs** : informations de relation, qualification, contrat et configuration technique.
5. **Services Cheexpeer** : missions et traces strictement limitées aux droits et finalités autorisés.

Le multi-tenant, l'isolation des données, les rôles, les habilitations, les journaux d'audit, la gestion des secrets, les sauvegardes, l'export et la suppression doivent être démontrés par des tests. Les accès administratifs et les accès de support doivent être distincts des accès métier ordinaires.

## 11. Principes d'architecture technique pour Evolution-8

Evolution-8 devra examiner, sans préjuger des choix définitifs :

- un noyau métier indépendant des interfaces ;
- des domaines fonctionnels séparés et des contrats d'API explicites ;
- une identité et une autorisation cohérentes entre les espaces ;
- un modèle multi-tenant strict ;
- une couche d'intégration isolant les API des PA et logiciels tiers ;
- des événements et webhooks idempotents, signés, journalisés et rejouables de façon contrôlée ;
- un traitement asynchrone pour les tâches longues ;
- un registre des actions et validations humaines ;
- une gestion des erreurs, des reprises et des incidents ;
- des tests unitaires, d'intégration, de sécurité et de parcours ;
- une observabilité des coûts, de la disponibilité et des performances ;
- des migrations versionnées et réversibles lorsque cela est possible.

Le choix des technologies et les changements du schéma Supabase devront découler de l'audit de l'existant. Aucune migration de production ne doit être déduite de ce document.

## 12. Feuille de route de principe

| Étape | Objet | Condition de sortie |
|---|---|---|
| A | Formalisation de la vision et des parcours | Vision et périmètre arbitrés |
| B | Audit de l'existant | État des lieux vérifié, risques et écarts documentés |
| C | Architecture Evolution-8 | Cible technique, données, sécurité et UX validées |
| D | Fondations transversales | Auth, multi-tenant, contrats, journalisation et tests |
| E | Parcours CRM client | Prototype testé avec un petit groupe pilote |
| F | Noyau facturation | Cycle de facturation testé hors production |
| G | Intégration PA / Connect | Partenaire vérifié, sandbox et flux validés |
| H | Cheexpeer transversal | Capacités et validations testées |
| I | Pilote progressif | Recette, support, coûts et réversibilité acceptés |

Les étapes ne valent pas engagement de calendrier. Les dépendances et priorités seront décidées après l'audit.

## 13. Indicateurs de réussite à définir

Les indicateurs devront mesurer l'utilité réelle :
- temps nécessaire pour créer une fiche, un devis et une facture ;
- taux de ressaisie et de doublons ;
- taux de réussite des imports et transmissions ;
- délai de résolution des rejets ;
- adoption des fonctions essentielles ;
- disponibilité et qualité des données ;
- coût de service par entreprise active ;
- temps de support par entreprise ;
- satisfaction des utilisateurs pilotes ;
- taux d'utilisation des services d'accompagnement.

Les objectifs chiffrés seront fixés après observation des usages et des coûts.

## 14. Décisions acquises et sujets ouverts

### Orientations retenues
- MajestiOS vise un environnement tout-en-un, intégré et évolutif.
- Le client doit pouvoir utiliser le CRM MajestiOS ou conserver son CRM externe.
- La facturation doit être un module métier distinct, connectable selon les possibilités réelles.
- La transmission réglementaire doit passer par une PA partenaire lorsque nécessaire.
- Cheexpeer est un assistant transversal soumis aux droits et validations.
- Le CRM interne et les espaces clients restent strictement séparés.
- L'audit précède les décisions de refonte technique.

### À instruire
- segmentation et besoins prioritaires des utilisateurs ;
- périmètre exact du socle gratuit et options ;
- choix des modules de première livraison ;
- architecture cible et frontières des domaines ;
- choix de PA et conditions contractuelles ;
- stratégie de migration et d'interopérabilité ;
- conformité, responsabilités et conservation ;
- coûts et capacité de support.

### Non acquis
- primauté commerciale sur les concurrents ;
- intégration universelle à tous les CRM ;
- gratuité illimitée ;
- partenaire PA sélectionné ;
- conformité réglementaire d'un module non encore réalisé ;
- date de mise en service.

**Principe directeur :** MajestiOS doit devenir l'environnement qui relie le développement commercial, la gestion quotidienne, la facturation et l'accompagnement de l'entreprise, tout en laissant au client la liberté de conserver ses outils et la maîtrise de ses données.
