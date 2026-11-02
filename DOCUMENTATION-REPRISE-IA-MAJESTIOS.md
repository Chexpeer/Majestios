# MajestiOS — dossier de reprise pour toute IA ou équipe technique

Version : 2026-11-01  
Branche de travail documentaire actuelle : `refonte-architecture-dossiers-charte-majestios-2026-11-01`  
Statut : guide de continuité ; il décrit la vision, les décisions déjà établies, les états vérifiés et les précautions de reprise. Ce document ne vaut ni validation finale du cahier des charges par le Fondateur, ni autorisation de mise en production.

## 1. Mission de ce document

Toute IA, développeur ou prestataire qui reprend MajestiOS doit pouvoir comprendre le produit, ses décisions, ses contraintes, l'état réel du prototype et la prochaine action sans demander à l'utilisateur de répéter l'historique. Lire ce document puis les références liées avant de modifier le dépôt. En cas de contradiction, ne pas choisir silencieusement : relever l'écart et respecter les décisions explicites les plus récentes du Fondateur.

## 2. Vision produit

MajestiOS est un outil de **développement commercial assisté par IA** et de prospection proactive/inversée. Il ne doit pas rester un simple agrégateur de liens ou d'annonces. Il doit aider à détecter des signaux, les vérifier, qualifier les opportunités, identifier les professionnels concernés, préparer des actions et capitaliser les résultats.

Chaîne métier de référence : **Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser.**  
Chaîne opérationnelle des signaux : détecter → vérifier la source et la date → contextualiser → distinguer faits et hypothèses → qualifier humainement si nécessaire → proposer une action traçable → suivre le résultat.

Formulations de marque à préserver lorsque le contexte le permet :
- « MajestiOS, l’outil qui donne une conscience à votre intelligence »
- « L’alliance de l’intelligence numérique et de la prospection intelligente… »
- « MajestiOS, l’ADN qui transmet l’information stratégique »
- « l’intelligence qui saute aux yeux »
- « l’outil qui vous en fait voir de toutes les couleurs »
- ton professionnel pour le cœur commercial ; humour utilisé avec mesure.

Employer « développement commercial » dans l’interface, pas « intelligence commerciale ».

## 3. Décisions de navigation et d'expérience à préserver

### Accueil
La page d'accueil doit rester épurée et centrée sur :
1. navigation discrète : Accueil ; Développement commercial ; Salon virtuel ; Nous rejoindre ; Espace membre ; FAQ ;
2. immeuble interactif directement intégrée à l'accueil ;
3. moteur de recherche multicritère visible ;
4. accès discret au chatbot/formulaire d'aide ;
5. exceptionnellement, bandeau horizontal lent et discret de démonstration, clairement marqué comme fictif tant qu'aucun flux réel validé n'est alimenté.

Ne pas réintroduire de longues sections blanches, de listes d'annonces en cartes sur l'accueil, de blocs répétitifs, de formulaires permanents ni de navigation en arborescence encombrante. La zone virtuelle ne doit pas devenir un simple lien de navigation. Les pages de rubriques doivent être distinctes : éviter les clics qui renvoient à une ancre de la même page lorsque la navigation doit ouvrir un dossier dédié.

### Zone virtuelle
Préserver la zone existante. Les libellés de navigation attendus sont « Street View », « Navigation aérienne » et « Carte interactive ». Ne pas réintroduire les anciens libellés de marque/appareil interdits dans l'interface. Toute modification de la scène doit être isolée et anti-régression ; ne pas la refondre dans un chantier qui n'en a pas besoin.

### Hiérarchie documentaire
Le produit vise de vrais niveaux de navigation (dossiers, sous-dossiers, pages), et non une page unique interminable. L'arborescence doit pouvoir accueillir des modules futurs sans surcharger l'accueil.

## 4. Périmètre fonctionnel consolidé

### 4.1 Marchés publics
- Recherche d'opportunités publiques, notamment à partir du BOAMP.
- Filtres cohérents (mots-clés, catégories, type de marché, territoire) et résultats pertinents.
- Exclure les avis expirés lorsque la date limite valide est passée ; ne pas inventer une expiration si la date manque.
- Conserver source officielle, date, critères de recherche, état d'erreur et absence de résultat.
- BOAMP signifie marché/appel d'offres public. Ne pas le confondre avec les signaux d'entreprises du BODACC.

### 4.2 Marchés privés et signaux d'entreprises
- Préparer l'exploitation des annonces et signaux d'entreprises, dont le BODACC : création, cession, procédures collectives, changements de situation et autres événements publiés.
- Le BODACC n'est pas un moteur d'appels d'offres : c'est une source de signaux pouvant alimenter des hypothèses de prospection après qualification.
- Les signaux peuvent intéresser différents métiers : fournisseurs, artisans, partenaires, agents commerciaux, professionnels de l'immobilier d'entreprise, etc.
- Exemple : une procédure collective peut motiver une recherche complémentaire de locaux ou d'actifs, mais ne prouve jamais à elle seule qu'un local est à vendre ou disponible.

### 4.3 Accompagnement aux appels d'offres — fonction déjà prévue
Ce service fait partie du périmètre produit initial et ne doit pas être présenté comme une nouveauté. Il associe assistance numérique, expertise technique et accompagnement humain selon le besoin :
- comprendre l'avis et le dossier de consultation (DCE) ;
- repérer les conditions d'éligibilité et critères de sélection ;
- préparer/contrôler les pièces de candidature ;
- comprendre les exigences techniques ;
- structurer l'offre et le mémoire technique ;
- vérifier la cohérence et la présence des pièces ;
- planifier les tâches et échéances ;
- accompagner le dépôt selon la procédure et la plateforme ;
- suivre la réponse et capitaliser le retour.
Ne pas garantir l'obtention d'un marché. Toute validation finale des éléments techniques ou contractuels doit relever des personnes compétentes et de l'entreprise candidate.

### 4.4 Diffusion ciblée des appels d'offres par code APE/NAF
Fonction métier demandée et à documenter comme un parcours central :
1. qualifier un appel d'offres (objet, lots, exigences, lieu d'exécution, échéance, contraintes) ;
2. identifier les codes APE/NAF et activités susceptibles de correspondre ;
3. rechercher les entreprises par département ou territoire pertinent ;
4. affiner la sélection avec spécialités, taille/capacités/références lorsque ces informations sont accessibles et licitement réutilisables ;
5. dédoublonner et classer les entreprises selon une pertinence explicable ;
6. viser **environ dix entreprises pertinentes par département et par opportunité**, sans compléter artificiellement la liste si le nombre d'entreprises adéquates est inférieur ;
7. diffuser l'information sur le marché avec sa source officielle, son échéance et les critères utiles ;
8. joindre en parallèle une proposition d'accompagnement MajestiOS à la candidature/réponse ;
9. suivre les envois, retours, demandes d'accompagnement, désinscriptions et résultats dans le futur CRM.
Le code APE/NAF est un filtre initial, jamais une preuve suffisante de capacité à répondre. Respecter les règles applicables à la prospection professionnelle, à la protection des données, aux préférences de contact, aux oppositions/désinscriptions et aux licences des sources. Ne pas lancer de campagne réelle sans validation distincte.

### 4.5 Veille emploi — interne et discrète
Le projet prévoit une veille emploi en arrière-plan pour comprendre les tendances de recrutement et identifier d'éventuels signaux commerciaux, pas un moteur public d'emploi sur la page d'accueil et pas un mélange dans les résultats BOAMP/BODACC.
Sources candidates à instruire : France Travail, APEC, Cadremploi, agentCo, HelloWork, Indeed, Welcome to the Jungle, LinkedIn, Meteojob, Choisir le service public, APECITA, La Bonne Alternance et sources sectorielles/institutionnelles pertinentes. Cette liste ne signifie pas que des API, licences ou connecteurs sont disponibles ou actifs.
Ne pas conclure automatiquement qu'un recrutement prouve une croissance, un besoin de sous-traitance ou une intention d'achat.

### 4.6 Immobilier professionnel
Préparer des rapprochements prudents entre événements d'entreprises, informations publiques, implantations, locaux professionnels et terrains. Tout résultat doit être une piste à vérifier, pas une affirmation de disponibilité ou d'intention de vente. La qualification humaine et la provenance sont obligatoires.

### 4.7 Espace membre, formulaires, analyses et CRM
Prévoir les profils professionnels, la personnalisation des pages, les dossiers d'entreprise/opportunité, l'historique, les formulaires, les demandes d'accompagnement, les rappels, les analyses et le suivi CRM. Le prototype statique peut seulement prévisualiser des formulaires : ne jamais dire que des données sont sauvegardées/transmises tant qu'un backend réel et ses tests ne le démontrent pas.
Le CRM doit pouvoir relier entreprise, interlocuteur/décideur, signal/opportunité, source, actions, communications, consentements/préférences applicables, état et résultats. Limiter les données aux finalités prévues et définir les droits, la conservation et la suppression.

### 4.8 Chatbot et salon virtuel
Le chatbot doit rester discret, pouvoir orienter vers une page/dossier/article exact, répondre sur la base de contenus disponibles et demander une prise de contact si la réponse n'est pas fiable. Le salon virtuel/showroom est un pilier prévu pour permettre, à terme, aux professionnels de présenter leur activité ; ne pas le confondre avec l’immeuble interactif de l’accueil.

## 5. Sources et traçabilité des données

Chaque source doit avoir une fiche comprenant au minimum : URL officielle, données fournies, mode d'accès (API/flux/export/manuel), authentification, conditions/licence, fréquence autorisée, champs collectés, qualité/limites, attribution, données personnelles, conservation, gestion des erreurs, contact et état de validation technique/juridique.

Chaque donnée ou signal doit conserver autant que possible : source et URL d'origine, identifiant source, date de publication, date de collecte, date de mise à jour, territoire, champs d'origine, transformations appliquées, niveau de confiance et historique de qualification. Distinguer clairement :
- fait explicitement présent dans la source ;
- donnée normalisée/calculée ;
- hypothèse commerciale ;
- validation ou correction humaine.

Aucune source n'est considérée comme connectée uniquement parce qu'elle figure dans un document. Vérifier les accès et les résultats réels.

## 6. Principes techniques de reprise

- Dépôt : `Chexpeer/Majestios`.
- Branche de travail documentaire actuelle : `refonte-architecture-dossiers-charte-majestios-2026-11-01`. Les documents métier de référence peuvent provenir d'un chantier antérieur ; vérifier chaque fichier sur la branche courante avant de s'y fier.
- Prototype actuel : site statique avec scripts JavaScript, `build.js`, `verify-site.js` et tests navigateur présents dans le dépôt. Vérifier les fichiers réels avant toute hypothèse sur la configuration.
- Les choix Next.js, React, Supabase/Postgres et autres briques ont été explorés dans l'historique, mais ne doivent pas être déclarés comme architecture active sans vérification du dépôt et décision explicite.
- Les modules BOAMP/BODACC ont des adaptateurs et règles de filtrage côté prototype ; confirmer les résultats avec les tests et les sources en direct avant de les qualifier de validés.
- Les formulaires d'espace membre et de candidature ne sont pas considérés comme connectés à un backend si le code indique qu'ils ne font que prévisualiser la demande.
- Le build vérifie une liste explicite de fichiers et l'intégrité de la copie. Ne pas supposer l'existence d'un `package.json` ou d'un workflow CI sans le trouver.
- Ne pas inventer les statuts CI/tests : fournir le résultat réel et le commit correspondant.

## 7. Garde-fous de gouvernance

Sans autorisation explicite du Fondateur :
- pas de déploiement en production ;
- pas de fusion vers `main` ;
- pas d'envoi de campagne externe ;
- pas d'activation de collecte automatisée sur une source non validée ;
- pas de suppression ou de réécriture de branches historiques ;
- pas de changement de vision/nom/navigation de l'accueil.

Travailler par lots limités, réversibles et testables. Éviter les audits sans fin : la clarification du produit et les livrables du cahier des charges priment ; les tests techniques doivent être ciblés sur le lot réalisé.

## 8. Protocole obligatoire pour une IA qui reprend le projet

1. Lire ce document en entier.
2. Lire le cahier des charges maître, la spécification fonctionnelle détaillée, le cahier des charges de veille, l'arborescence et le plan de chantier.
3. Inspecter la branche et les fichiers actuels ; ne pas se fier uniquement à un résumé de conversation.
4. Dresser brièvement l'état constaté : existant, documenté mais non implémenté, à valider, bloqué.
5. Préserver les exigences déjà convenues ; ne pas requalifier une fonction prévue en nouveauté.
6. Ne pas demander au Fondateur de répéter des décisions documentées. Ne poser une question que si un arbitrage réellement bloquant manque.
7. Avant une modification, annoncer le lot et son critère d'acceptation ; après, fournir fichiers/commit et preuves de test.
8. Distinguer strictement les faits vérifiés, les hypothèses et les recommandations.
9. Ne pas prétendre avoir écrit, testé, connecté ou déployé quelque chose sans résultat vérifiable.
10. Maintenir les documents liés cohérents ; toute décision nouvelle doit être consignée dans le registre de décisions.

## 9. Ordre de lecture recommandé

1. `DOCUMENTATION-REPRISE-IA-MAJESTIOS.md` — présent document.
2. `CAHIER-DES-CHARGES-MAITRE-MAJESTIOS.md` — vision, périmètre et décisions.
3. `SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md` — parcours et critères d'acceptation.
4. `CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md` — sources et signaux.
5. `ARBORESCENCE-MAJESTIOS.md` — pages, navigation et dépendances.
6. `PLAN-CHANTIER-RECHERCHE-DONNEES-CRM.md` — lots, risques et garde-fous.
7. `MODELE-DONNEES-APPELS-OFFRES.md` et `schemas/opportunite.schema.json` — contrat des données d'opportunité.
8. `REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md` — sources candidates, accès, limites, pipeline et statuts CRM.

## 10. État de vérité au 1er novembre 2026

- Les documents ci-dessus décrivent le périmètre cible ; ils ne prouvent pas que toutes les fonctions sont développées.
- Les sources d'emploi listées sont à instruire, pas déclarées connectées ; la fiche officielle consultée signale que l’API Offres d’emploi France Travail n’est plus exposée publiquement pendant une analyse de ses modalités de distribution et de réutilisation.
- Le CRM doit être alimenté par un registre de sources traçables et par les interactions internes une fois le backend réalisé. Lire `REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md` avant toute intégration de source.
- Le ciblage APE/NAF, la sélection d'environ dix entreprises par département, la diffusion des marchés avec proposition d'accompagnement et le suivi CRM sont des exigences fonctionnelles à spécifier/implémenter ; ne pas prétendre que la campagne est opérationnelle.
- L'accompagnement humain et technique aux appels d'offres est une fonction déjà prévue dans la vision produit, non une nouveauté.
- L'audit technique précédent n'est pas réputé intégralement terminé ; aucun statut CI récent n'est présumé.
- Ce guide doit être actualisé quand l'état du dépôt ou les décisions du Fondateur changent.

## Matrice de traçabilité et feuille de route
Avant de modifier le code, consulter aussi `MATRICE-TRAÇABILITE-EXIGENCES-MAJESTIOS.md`. Elle relie les exigences aux documents et fichiers connus, distingue prototype/documenté/à développer/à valider et propose les lots suivants. Les statuts y restent prudents : la présence d'un fichier ou d'une exigence ne vaut pas validation d'exécution.
