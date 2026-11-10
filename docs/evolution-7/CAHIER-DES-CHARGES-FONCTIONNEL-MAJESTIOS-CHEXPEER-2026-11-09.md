# Cahier des charges fonctionnel — MajestiOS & Cheexpeer

**Version :** 0.1 — cadrage initial consolidé le 9 novembre 2026  
**Branche de référence :** `Evolution-7`  
**Statut :** document de travail fonctionnel ; les décisions explicitement validées sont distinguées des capacités à concevoir ou à réaliser.  
**Objet :** décrire le produit attendu, ses utilisateurs, ses parcours, ses services et le rôle de Cheexpeer. Ce document prime pour le cadrage fonctionnel à venir ; il ne constitue pas une preuve de réalisation technique.

---

## 1. Vision produit

**MajestiOS est une plateforme professionnelle de développement commercial et d'intelligence économique.** Elle aide les entreprises, indépendants et professionnels à détecter des possibilités, comprendre leur environnement, identifier les acteurs pertinents, préparer leurs démarches et transformer les informations en décisions et en résultats.

MajestiOS rassemble dans un même environnement des services métier, des données, des outils, un réseau professionnel, un CRM et un accompagnement intelligent. Ce n'est ni un simple annuaire, ni un agrégateur d'annonces, ni un CRM générique.

**Cheexpeer est l'agent IA transversal de MajestiOS.** Il apporte la capacité de rechercher, comprendre, rapprocher, vérifier, analyser, synthétiser, anticiper et assister les actions. MajestiOS porte le produit et les services ; Cheexpeer les relie et les augmente. L'administrateur et les professionnels gardent la maîtrise des décisions.

Parcours de valeur commun :

**Détecter → Comprendre → Qualifier → Décider → Agir → Capitaliser.**

## 2. Publics et besoins

| Public | Besoin principal | Valeur attendue |
|---|---|---|
| Visiteur / entreprise intéressée | Comprendre rapidement ce que MajestiOS peut lui apporter | Orientation claire, accès direct aux services et prise de contact simple |
| Dirigeant / indépendant | Trouver des marchés, des clients, des partenaires et des relais de croissance | Recherche, veille, qualification et pistes concrètes |
| Équipe commerciale | Organiser la prospection et suivre les relations | Informations rapprochées, CRM, tâches, historique et priorisation |
| Professionnel répondant à des marchés | Comprendre les attentes et préparer une réponse | Lecture pratique des dossiers, exigences, compétences et échéances |
| Membre / client | Retrouver ses services et son espace de travail | Parcours personnalisés, dossiers et suivi selon les services ouverts |
| Administrateur MajestiOS | Piloter la plateforme, les activités et les évolutions | Cockpit, indicateurs, alertes, dialogue privé avec Cheexpeer et validations |

## 3. Organisation fonctionnelle de MajestiOS

La navigation globale doit rester simple, permanente, cohérente et accessible sur ordinateur comme sur mobile. Elle doit conduire vers de vraies pages et sous-pages : un clic sur une destination métier ouvre son espace dédié, et non une simple ancre qui fait défiler une page unique.

La structure de navigation Evolution-7 regroupe les entrées en grandes familles. Le détail exact des sous-menus doit rester synchronisé avec l'inventaire réel des pages et leurs parcours.

### 3.1 Domaines métier

1. **Appels d'offres et marchés publics** — rechercher les consultations, comprendre les avis, repérer les échéances et préparer une réponse.
2. **Marchés et opportunités privés** — repérer les signaux d'activité, besoins, cessions, reprises, projets et occasions de coopération.
3. **Développement commercial** — structurer la démarche commerciale, identifier des cibles, préparer la prospection, suivre les résultats et développer la visibilité. La réputation en ligne est une sous-rubrique de ce domaine.
4. **Prospection** — rechercher et sélectionner des entreprises selon l'activité, le territoire et des critères métier ; expliquer les résultats sans présenter un code APE/NAF comme une preuve de compétence.
5. **Réseau** — développer les relations professionnelles, coopérations, mises en relation, salons, séminaires et sous-traitance.
6. **Entreprises et Business** — consulter et qualifier des entreprises ; proposer un parcours « Évaluer mon entreprise » pour les demandes de vente ou de transmission d'entreprise, de fonds, de locaux ou d'équipements. Les volumes annoncés devront être sourcés avant toute communication.
7. **Emploi** — présenter les offres et demandes réellement disponibles sur la plateforme ; distinguer les annonces publiées par les membres des sources externes non raccordées.
8. **Accompagnement** — aider les professionnels à comprendre les démarches, préparer leurs dossiers et mobiliser les services pertinents.
9. **Espaces et services** — espace membre, espace client, espace privé et services associés, selon le statut et les droits de chacun.

### 3.2 Fonctions transversales

- **Recherche transversale :** point d'entrée commun vers les domaines disponibles ; les résultats s'ouvrent dans les pages dédiées et conservent les critères de recherche.
- **CRM :** référentiel opérationnel des entreprises, contacts, opportunités, activités, relances et relations commerciales.
- **Business Intelligence :** indicateurs, tendances, rapprochements et aide à la décision à partir des données disponibles et qualifiées.
- **Administration :** supervision de la plateforme, des services, des contenus, des utilisateurs, des tâches et des résultats.
- **Cheexpeer :** agent IA transversal, accessible dans les espaces prévus et relié progressivement aux outils métier.
- **Automatisations :** traitements récurrents, alertes, synchronisations et tâches préparées ou exécutées dans un périmètre défini.

### 3.3 Écart entre la navigation actuelle et la cible métier

**État observé dans `navigation-tiroirs.js` sur Evolution-7 :** six groupes sont actuellement construits : Appels d’offres, Développement commercial, Réseau, Réputation virtuelle, Espaces privés et Explorer davantage. Les liens actuellement associés sont :

| Groupe actuel | Pages actuellement reliées |
|---|---|
| Appels d’offres | Marchés publics, marchés privés, accompagnement appels d’offres |
| Développement commercial | Vue d’ensemble, prospection, accompagnement appels d’offres, suivi commercial, qualification des entreprises |
| Réseau | Réseau et synergies, salons et séminaires |
| Réputation virtuelle | Présence et visibilité, intelligence économique |
| Espaces privés | Espace client, Accès VIP · Administration |
| Explorer davantage | Veille des marchés, veille BODACC, sous-traitance, Nous rejoindre |

**Décisions de cadrage déjà exprimées par le porteur du projet :**

- La **Réputation virtuelle** doit être rattachée au **Développement commercial** comme sous-rubrique, et non rester un grand domaine autonome de premier niveau.
- Employer **Réseau** plutôt que « Partenaires » ou « Partenaire » comme intitulé de navigation.
- Prévoir un domaine **Business / Entreprises**, avec un parcours « Évaluer mon entreprise » pour les demandes de vente ou de transmission d'une entreprise, d'un fonds, de locaux ou d'équipements.
- Conserver **Accès VIP · Administration** dans **Espaces privés** ; cet accès admin doit rester repérable et visuellement distinct, sans être déplacé dans une rubrique publique.
- Épurer **Explorer davantage** pour ne pas submerger le visiteur. Préserver néanmoins ses destinations utiles et le lien d'accès VIP à son emplacement décidé dans Espaces privés.
- Distinguer les **offres d'emploi proposées sur MajestiOS** de la page **Nous rejoindre**, qui concerne les candidatures à l'équipe MajestiOS.

**Écarts à traiter dans la conception de la navigation :**

1. Réorganiser Réputation virtuelle sous Développement commercial et vérifier les liens internes qui y conduisent.
2. Concevoir le domaine Business / Entreprises et son formulaire d'évaluation ; ne pas inventer de volume d'entreprises disponibles ni annoncer un service opérationnel avant validation.
3. Définir une vraie rubrique Offres d'emploi si elle est retenue dans le périmètre ; ne pas détourner « Nous rejoindre » pour remplir cette fonction.
4. Réexaminer le contenu d'Explorer davantage et répartir les pages dans les domaines naturels, sans supprimer de contenu utile.
5. Vérifier que chaque page existante conserve une destination explicite, y compris les pages secondaires, les espaces réservés et les pages d'information.

Ces écarts sont des **évolutions fonctionnelles et de navigation**, pas des anomalies de sécurité. La modification du menu ne doit intervenir qu'après validation de l'arborescence cible et de la correspondance page par page.

## 4. Parcours fonctionnels prioritaires

### PF-01 — Découvrir et s'orienter
1. Le visiteur arrive sur un accueil synthétique.
2. Il comprend la promesse de MajestiOS et identifie les grands domaines.
3. Il utilise la recherche ou choisit une rubrique.
4. Il accède à une véritable page métier, avec ses informations, ses outils et ses appels à l'action.
5. Si nécessaire, il est orienté vers un formulaire ou un contact humain.

**Acceptation :** aucun lien principal ne mène vers une destination vide, une ancre de substitution ou un contenu sans rapport ; les parcours sont utilisables au clavier et sur mobile.

### PF-02 — Rechercher une information ou une opportunité
1. L'utilisateur saisit un mot-clé et choisit les critères pertinents.
2. Le système présente uniquement les catégories et filtres adaptés au type de recherche.
3. Les résultats sont affichés dans l'espace dédié, avec source, date, lien d'origine et état de fraîcheur lorsque disponibles.
4. L'utilisateur peut affiner, consulter le détail, enregistrer ou préparer une suite.

**Acceptation :** les critères restent visibles et réutilisables ; une source indisponible est signalée ; aucun résultat fictif n'est présenté comme réel.

### PF-03 — Qualifier une piste et la préparer dans le CRM
1. L'utilisateur sélectionne un résultat précis.
2. MajestiOS prépare une fiche de transmission avec les informations disponibles et leur provenance.
3. Les doublons et correspondances possibles sont présentés.
4. Les faits, données déclarées, calculs, inférences et avis IA sont distingués.
5. L'utilisateur confirme la création ou le rattachement dans le CRM.
6. Le CRM conserve le lien vers la source et le parcours d'origine.

**Acceptation :** aucune piste n'est qualifiée automatiquement sur la seule base de son intitulé ou d'un code d'activité ; aucune transmission en masse implicite ; le retour vers la source reste possible.

### PF-04 — Organiser le développement commercial
Le CRM permet de gérer les entreprises, établissements, contacts, opportunités, activités, relances, responsables, étapes, échéances et historiques. Il doit donner une vision claire de la relation et de la prochaine action utile.

Le CRM interne MajestiOS reste distinct des espaces de travail propres aux clients. Les fonctions offertes à chaque catégorie de compte sont définies par le produit et non supposées identiques.

**Acceptation :** une fiche permet de comprendre qui est l'entreprise, d'où viennent les informations, quelle relation existe, ce qui a été fait et quelle est la prochaine étape.

### PF-05 — Comprendre un appel d'offres en langage opérationnel
Cheexpeer doit pouvoir analyser les pièces accessibles d'un dossier et restituer :
- l'objet concret des travaux ou prestations ;
- les lots, quantités et lieux lorsqu'ils sont documentés ;
- les compétences, moyens et qualifications explicitement attendus ;
- les contraintes d'exécution, délais et échéances ;
- les pièces administratives et techniques à fournir ;
- les critères de sélection et de jugement ;
- les points de vigilance, ambiguïtés et informations manquantes ;
- les références précises aux pages ou passages sources.

**Acceptation :** séparer les exigences du dossier de leur explication pratique et des recommandations ; ne jamais inventer une quantité, une obligation ou une date ; signaler les éléments non trouvés.

### PF-06 — Développer le réseau et les coopérations
L'utilisateur peut identifier des entreprises ou professionnels pertinents, consulter les informations de présentation disponibles, repérer des salons ou événements et préparer une mise en relation contextualisée.

**Acceptation :** une mise en relation ou un message externe constitue une action distincte ; les informations utilisées et le motif de la proposition sont présentés.

### PF-07 — Évaluer une entreprise ou un actif professionnel
Le parcours « Évaluer mon entreprise » permet de décrire une entreprise, une activité, des locaux, un fonds ou des équipements proposés à la vente ou à la transmission. Il recueille les informations utiles, permet de joindre les pièces nécessaires lorsque le service est ouvert et transmet une demande à l'équipe habilitée.

**Acceptation :** le formulaire explique ce qui sera transmis, confirme la réception uniquement si celle-ci est réellement enregistrée et oriente vers un suivi humain.

### PF-08 — Utiliser son espace membre ou client
L'utilisateur retrouve ses informations, demandes, dossiers, services souscrits ou ouverts, échanges et prochaines étapes. L'interface n'affiche que les fonctions réellement disponibles pour son profil.

**Acceptation :** navigation claire, état des demandes compréhensible, absence de promesses de service non encore activé.

### PF-09 — Phase de mise au point avec un premier cercle de 5 à 7 personnes de confiance

La stratégie d'ouverture progressive est définie dans [Stratégie d'ouverture progressive — premier cercle de 5 à 7 personnes](STRATEGIE-OUVERTURE-PREMIER-CERCLE-5-A-7-2026-11-09.md).

Pendant cette phase, un même compte client peut circuler librement entre toutes les rubriques métier ouvertes au test et évaluer les fonctions disponibles. Les habilitations ne doivent pas être multipliées artificiellement par rubrique. L'ouverture des parcours ne donne toutefois aucun accès aux données d'autres organisations, au cockpit VIP ni aux archives confidentielles de l'administrateur.

La création de compte conserve une authentification et une information adaptées. Une fois le compte créé, l'exploration des rubriques ne doit pas déclencher de demandes d'autorisation répétitives. Les actions sensibles et les accès aux données restent contrôlés à leur niveau propre.

Le premier cercle réunit 5 à 7 personnes de confiance (amis, collègues ou investisseurs) pour éprouver le produit et formuler des retours. Il ne constitue ni une cohorte commerciale ni un seuil de fermeture ; la suite dépend des retours, de la maturité du produit, des coûts et des incidents constatés.

## 5. Cahier des charges de Cheexpeer

Cheexpeer est l'agent IA transversal de MajestiOS. Sa spécification détaillée — identité, missions, quatre espaces, compétences métier, fonctionnement des missions, autonomie, mémoire, archives, centre de commande, connecteurs, notifications, critères de recette, priorités et état réel du dépôt — est maintenue dans un document dédié :

**[Cahier des charges détaillé de Cheexpeer](CAHIER-DES-CHARGES-DETAILLE-CHEXPEER-2026-11-09.md).**

Les principes directeurs sont actés :
- un seul agent, avec une identité et une continuité de travail ;
- quatre espaces distincts : chat utilisateurs, CRM/données métier, GitHub/développement, centre de commande administrateur privé ;
- un centre de commande privé prioritaire, avec dialogue persistant, missions, captures, historique, archives, alertes, livrables et validations ;
- une capacité transversale de recherche, collecte, vérification, rapprochement, analyse, qualification, préparation d'actions, automatisation et capitalisation ;
- une autonomie progressive et définie par action, sans exécution aveugle ;
- des connexions à Google Workspace / Drive, CRM, GitHub et sources web à concevoir et valider avant de les déclarer opérationnelles.

Le document détaillé sépare explicitement les fonctions déjà observées dans le dépôt des fonctions cibles à construire. Le chatbot local à mots-clés et le parcours limité de Réputation virtuelle ne constituent pas encore l'agent transversal complet.

## 6. Automatisation et amélioration continue

MajestiOS doit évoluer d'un ensemble de pages et d'outils vers une plateforme qui réduit les manipulations répétitives.

Automatisations fonctionnelles à concevoir par priorité :
- surveillance planifiée des sources et détection de nouveaux signaux ;
- actualisation des données et détection des doublons ;
- alertes sur les échéances, changements d'état et nouvelles opportunités ;
- préparation des dossiers et comptes rendus ;
- rappels et prochaines actions CRM ;
- archivage des rapports, preuves et décisions ;
- veille SEO périodique de MajestiOS : indexation, contenus, liens, performance, visibilité et recommandations ;
- contrôle périodique des parcours et liens du site ;
- rapports synthétiques destinés à l'administrateur.

Chaque automatisation doit préciser son déclencheur, sa fréquence, ses sources, son résultat attendu, son responsable, son statut en cas d'échec et les actions nécessitant validation.

## 7. Principes d'expérience utilisateur

- Interface professionnelle, claire, sobre et cohérente ; identité visuelle propre à chaque domaine conservée lorsqu'elle a une fonction.
- Accueil synthétique : promesse, recherche et portes d'entrée principales, sans catalogue interminable.
- Navigation commune sur les pages, sous-menus compréhensibles et accès direct aux sous-rubriques.
- Une page = un objectif métier principal ; les explications longues sont placées dans les espaces où elles sont utiles.
- Vocabulaire concret et homogène ; éviter les répétitions et les intitulés vagues.
- Formulaires courts, progressifs et compréhensibles, avec confirmation réelle de réception.
- Affichage responsive, clavier, contrastes et états d'interaction explicites.
- Les fonctions futures ou indisponibles sont signalées comme telles ; aucune interface ne simule une action accomplie.

## 8. Données et objets métier de référence

Les objets fonctionnels communs à organiser sont :
- **Source / signal** : origine, identifiant externe, URL, date de publication, date de collecte, contenu ou référence.
- **Entreprise / établissement** : identité, identifiants disponibles, activité, localisation, sources et date de vérification.
- **Contact** : personne, fonction, coordonnées, origine et statut de validation.
- **Marché / opportunité / projet** : type, besoin, échéances, territoire, statut, critères et source.
- **Dossier** : documents, pièces, annotations, analyses, versions et état d'avancement.
- **Activité / interaction** : action, date, auteur, résultat et prochaine étape.
- **Tâche / alerte** : responsable, échéance, priorité, état, origine et résultat.
- **Rapport / analyse** : question, méthode, preuves, constats, limites, recommandations et validation.
- **Décision** : auteur, date, motif, portée et conséquence.

Les informations observées, déclarées, calculées, déduites et proposées par l'IA doivent rester identifiables.

## 9. Priorisation fonctionnelle proposée

| Lot | Priorité | Résultat attendu |
|---|---|---|
| 1 | Fondations produit | Arborescence claire, pages réelles, navigation cohérente, accueil synthétique, formulaires fiables |
| 2 | Parcours métier | Recherche, filtres, résultats, détails et continuité entre rubriques |
| 3 | CRM opérationnel | Fiches, relations, activités, relances et parcours de qualification compréhensibles |
| 4 | Circulation métier | Préparer, valider et tracer le passage d'un résultat vers le CRM et le retour vers sa source |
| 5 | Cheexpeer utile | Assistance métier, analyse des dossiers, qualification et rapports sourcés |
| 6 | Centre de commande | Dialogue privé admin, tâches, captures, alertes, historique et validations |
| 7 | Automatisation | Veille, alertes, archivage, Drive, SEO et traitements récurrents |
| 8 | Intelligence augmentée | Analyses croisées, tendances, priorisation et amélioration continue mesurée |

Cet ordre est une proposition de séquencement fonctionnel. Il ne signifie pas que les lots précédents sont entièrement réalisés ; chaque lot doit être confronté à l'état réel du produit et aux dépendances.

## 10. Méthode de suivi du cahier des charges

Chaque exigence doit recevoir un identifiant stable et un statut :
- **Validée** : décision explicite du porteur du projet.
- **À préciser** : intention connue, détail opérationnel manquant.
- **Proposée** : recommandation à arbitrer.
- **En conception** : parcours et règles en cours de définition.
- **En réalisation** : développement commencé.
- **À tester** : implémentation présente, recette non achevée.
- **Validée en recette** : critères d'acceptation vérifiés.
- **Différée** : conservée dans la feuille de route, non prioritaire.

Les anomalies techniques restent dans leur registre spécifique. Elles ne doivent pas absorber le cahier des charges fonctionnel ; seules les anomalies qui empêchent directement un parcours métier sont remontées comme blocages de réalisation.

Les décisions nouvelles sont intégrées ici ou dans la fiche fonctionnelle du domaine concerné, puis reportées dans l'index documentaire. Les anciennes propositions contradictoires ne sont pas effacées : elles sont marquées comme remplacées afin de conserver la traçabilité.

---

## 11. Prochain travail fonctionnel

Le cahier des charges doit maintenant être détaillé domaine par domaine, dans cet ordre :
1. arborescence finale et rôle de chaque page ;
2. parcours utilisateur et règles métier de chaque rubrique ;
3. CRM et circulation entre rubriques ;
4. missions détaillées de Cheexpeer et centre de commande ;
5. automatisations, sources, Drive et archivage ;
6. critères de recette par parcours.

**Règle directrice :** construire une plateforme réellement utile et fluide avant de multiplier les raffinements techniques. La technique doit servir les parcours métier, pas devenir le sujet principal du produit.
