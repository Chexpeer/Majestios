# Cahier des charges — veille stratégique et nouveaux signaux MajestiOS

Version : 2026-11-01  
Statut : spécification et préparation d'architecture — aucun module décrit ici n'est déclaré opérationnel.  
Branche : chantier-recherche-donnees-gardes-fous-2026-11-01

## 1. Finalité

Faire évoluer MajestiOS vers un outil de développement commercial capable de détecter, qualifier et contextualiser des signaux économiques utiles aux entreprises, artisans, PME et professionnels spécialisés. La valeur attendue réside dans le rapprochement raisonné de sources, la traçabilité des faits, la formulation d'hypothèses explicites et la préparation d'actions commerciales vérifiables.

## 2. Principes non négociables

- Préserver la immeuble interactif existante.
- Ne pas dégrader les recherches BOAMP/BODACC ni confondre leurs finalités.
- Ne pas ajouter de moteur de recherche d'emploi au moteur d'opportunités commerciales.
- Distinguer fait sourcé, donnée transformée, hypothèse et validation humaine.
- Ne pas inventer de disponibilité, d'annonce, de contact ou de besoin commercial.
- Vérifier droits de réutilisation, qualité et limites de chaque source avant automatisation.
- Protéger les données personnelles et documents, notamment les CV.
- Déclarer toute nouvelle page dans le build et les contrôles anti-régression.
- Aucun merge ou déploiement en production n'est autorisé par ce cahier des charges.

## 3. Sources et signaux à évaluer

| Famille | Signaux possibles | Pistes à qualifier |
|---|---|---|
| BOAMP / commande publique | consultations et résultats/attributions disponibles | fournisseurs, prestataires, sous-traitance potentielle |
| BODACC | créations/immatriculations publiées, cessions, procédures collectives, modifications, radiations | nouveaux prospects, transmission, changements d'activité |
| Sirene / INSEE | créations, transferts, établissements actifs/fermés selon les champs disponibles | implantation, démarrage, changements de besoins |
| Urbanisme / aménagement | autorisations et projets non résidentiels accessibles | travaux, équipements, services aux bâtiments |
| Données d'entreprise autorisées | changement d'adresse, d'activité ou de structure | actualisation CRM et prise de contact à vérifier |
| Offres d'emploi autorisées | postes, compétences, localisation, dates | compétences recherchées et tendances sectorielles |
| Sources immobilières autorisées | annonces explicites de vente/location, locaux et transactions | immobilier professionnel et mise en relation |
| Données territoriales | agrégations temporelles, géographiques et métiers | analyse des évolutions et priorisation commerciale |

Aucun événement isolé ne prouve automatiquement un besoin, une croissance, une sous-traitance ou une disponibilité immobilière.

Le registre `REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md` détaille les ressources candidates, leurs usages pour le CRM, leurs limites d’accès et les statuts de validation. Il complète le présent inventaire sans déclarer les sources connectées.

## 4. Module Emploi

### 4.1 Candidatures — Nous rejoindre
Prévoir un formulaire avec identité, courriel, téléphone facultatif, profil, compétences, domaine, type de collaboration, message et CV facultatif. Limiter la collecte au besoin annoncé. Le dépôt de CV nécessite validation serveur, formats et taille contrôlés, stockage privé, accès restreint, durée de conservation, information de confidentialité et procédure de suppression. Ne jamais afficher une confirmation si l'enregistrement n'a pas réussi.

### 4.2 Dépôt et veille d'offres
Dossier autonome permettant aux employeurs de proposer des offres et à MajestiOS de suivre les offres de sources dont la réutilisation est autorisée. Champs à prévoir : poste, missions, compétences, secteur, localisation, contrat, dates, employeur, provenance et lien officiel. Cycle : brouillon → à vérifier → validée → publiée → expirée ou retirée.

### 4.3 Limites
Aucun moteur de recherche d'emploi public n'est demandé. Emploi reste hors des catégories du moteur commercial de l'accueil. Le bandeau horizontal de l'accueil demeure exclusivement fictif et ne diffuse aucune offre réelle. Les offres de sources autorisées peuvent alimenter une veille interne et des analyses de compétences et de secteurs, en distinguant observation et interprétation.

## 5. Immobilier professionnel et foncier d'entreprise

Prévoir un dossier autonome futur, distinct du moteur d'appels d'offres. Signaux possibles : cessation/transfert d'établissement, cession de fonds, procédure collective, projet d'aménagement et annonce immobilière explicite.

Distinguer impérativement les murs commerciaux/professionnels, le fonds de commerce, le droit au bail, la vente/location du bien, la cession d'actifs ou de titres et la simple cessation.

Une cessation, une liquidation ou une cession ne prouve pas que les locaux sont à vendre ou à louer. Avant de qualifier un bien de disponible, vérifier séparément la propriété ou le mandat, la disponibilité, le statut du bail, l'annonce explicite et la provenance. Les signaux non confirmés restent des pistes internes à vérifier.

Publics potentiels : agents immobiliers d'entreprise, gestionnaires de locaux, investisseurs et professionnels de la transmission, selon la pertinence et les autorisations applicables.

## 6. Autres pistes stratégiques

1. Détecter les consultations publiques et les besoins potentiels des acheteurs.
2. Croiser marchés attribués et capacités locales pour proposer des pistes de sous-traitance, sans les présenter comme certaines.
3. Repérer les créations d'entreprise et qualifier les besoins de démarrage possibles.
4. Détecter transferts et ouvertures d'établissements pour anticiper des besoins d'implantation, travaux, équipements et services.
5. Étudier les projets de construction/aménagement comme signaux de chantiers futurs.
6. Qualifier les transmissions d'entreprises en distinguant fonds, titres et immobilier.
7. Suivre les changements publics concernant les entreprises du CRM et proposer des tâches de vérification.
8. Analyser les évolutions sectorielles et territoriales à partir de données datées et traçables.
9. Croiser les compétences recherchées dans les offres d'emploi avec les tendances sectorielles, sans déduire automatiquement une intention d'achat.
10. Préparer une veille territoriale par zone d'activité, en gardant l'expérience visuelle séparée des connecteurs de données.

## 7. Chaîne commune de traitement

Collecte → provenance → normalisation → contrôle qualité → dédoublonnage → fraîcheur/statut → détection → qualification humaine → CRM/action → analyse.

Chaque signal doit comporter au minimum : type, source, URL source, identifiant source si disponible, dates de publication/collecte/vérification, territoire, entreprise/établissement concerné si identifié, fait observé, hypothèse éventuelle, niveau de confiance, statut, expiration ou date de réexamen, droits d'accès et historique.

États recommandés : détecté, à compléter, à vérifier, qualifié, validé, publié (si diffusion autorisée), écarté, expiré, retiré.

## 8. Arborescence fonctionnelle cible

- Développement commercial : Marchés publics (BOAMP); événements d'entreprises et annonces commerciales (BODACC); prospection active; sous-traitance et partenaires; veille économique et sectorielle; analyse territoriale; transmission et cession; suivi commercial/CRM.
- Emploi (dossier autonome, sans moteur de recherche) : déposer une offre; veille des offres autorisées; qualification/validation; analyse des compétences et signaux sectoriels.
- Immobilier professionnel (dossier autonome futur) : signaux de locaux potentiellement libérés; transactions et cessions à qualifier; projets de construction/aménagement; vérification de disponibilité.
- Nous rejoindre : candidature; dépôt sécurisé de CV; collaboration et partenariat.
- Socle commun : sources/provenance; qualification; CRM; analyses; historique et gouvernance.

Cette structure est logique et ne nécessite pas de déplacer immédiatement les fichiers HTML existants. L'accueil conserve sa structure simple; aucun nouvel encart ou moteur ne doit y être ajouté au titre de ce cahier des charges.

## 9. Ordre de réalisation

- E0 : inventaire des sources, risques, contrats de données et critères d'acceptation.
- E1 : stabilisation des recherches BOAMP/BODACC.
- E2 : contrat commun des signaux (provenance, typologie, qualité, statuts, déduplication, fraîcheur).
- E3 : dossier Emploi et formulaire Nous rejoindre; CV inactif tant que le stockage sécurisé n'est pas configuré.
- E4 : veille immobilière et matrice signal → vérifications, sans présenter les signaux comme des biens disponibles.
- E5 : connecteurs source par source après validation des conditions d'accès et de réutilisation.
- E6 : CRM, flux et analyses alimentés uniquement par des données validées.

## 10. Critères anti-régression

Pour chaque lot, relever branche, commit et fichiers touchés; vérifier que la immeuble interactif et son code restent inchangés; lancer contrôles de syntaxe, build, vérification de site et tests navigateur pertinents; tester erreurs de source, résultats vides, doublons, données obsolètes et liens; confirmer que les nouvelles pages sont incluses dans le build. Aucun module n'est déclaré opérationnel sans test réel. Aucune fusion ni publication de production sans autorisation explicite.


## 11. Inventaire initial des ressources de veille Emploi

### Objectif fonctionnel
La veille Emploi est un traitement discret en arrière-plan. Elle ne crée pas de moteur public de recherche d'emploi sur la page d'accueil et ne doit pas être confondue avec le moteur principal des opportunités commerciales. Les annonces et signaux retenus peuvent alimenter des analyses sectorielles, territoriales et de compétences ; une diffusion dans le bandeau général reste facultative, après contrôle de pertinence, fraîcheur et droits de réutilisation.

### Sources à instruire — aucune intégration ne doit être présumée opérationnelle

| Ressource | Apport attendu | État / garde-fou |
|---|---|---|
| France Travail — API Offres d'emploi | Offres individuelles et données de recrutement | L'exposition publique de l'API a été signalée comme suspendue pendant une revue des conditions de diffusion et de réutilisation. Demander les modalités d'accès avant tout développement dépendant de cette API. |
| France Travail — API Marché du travail | Tendances par métier, secteur, compétences, tensions et embauches | Ressource d'analyse statistique ; ne pas la présenter comme un flux temps réel d'annonces individuelles. |
| France Travail — ROME 4.0 | Référentiel pour normaliser métiers, compétences et appellations | Étudier le schéma et les conditions d'accès avant implémentation. |
| France Travail — Mes Événements Emploi | Forums, job datings, événements emploi/formation | Source complémentaire d'événements, pas un substitut aux offres d'emploi. |
| La Bonne Alternance | Offres d'alternance et entreprises susceptibles de recruter | Étudier l'API, les habilitations, la licence et les limites d'usage ; ressource particulièrement intéressante pour détecter des entreprises qui recrutent potentiellement. |
| APEC | Emplois cadres et signaux de recrutement de profils qualifiés | Source candidate ; vérifier les possibilités officielles de flux/API et les conditions de réutilisation. |
| Cadremploi | Recrutements de cadres et profils expérimentés | Source candidate à qualifier ; aucune collecte automatisée sans voie d'accès et droits confirmés. |
| agentCo | Missions d'agents commerciaux indépendants, apporteurs d'affaires et besoins de force de vente | Source spécialisée prioritaire pour le développement commercial ; vérifier les conditions d'utilisation et obtenir une autorisation adaptée avant toute automatisation. |
| HelloWork, Indeed, Welcome to the Jungle, LinkedIn, Meteojob | Couverture généraliste, profils, secteurs et signaux d'embauche | Sources candidates, à évaluer séparément ; ne pas assimiler l'accès visible sur le web à une autorisation de collecte ou de republication. |
| Choisir le service public | Recrutements des fonctions publiques | Vérifier les jeux de données, la fréquence de mise à jour et la licence de chaque ressource retenue. |
| APECITA et plateformes sectorielles (BTP, industrie, transport/logistique, agriculture, santé, hôtellerie-restauration, intérim) | Couverture de métiers spécialisés | À sélectionner selon les secteurs ciblés et les voies de réutilisation autorisées. |
| Jeux de données emploi sur data.gouv.fr | Séries statistiques et fichiers publiés par des organismes publics | Vérifier la date de mise à jour de chaque jeu ; un jeu trimestriel ou historique ne doit pas alimenter un flux d'offres présenté comme récent. |

### Fiche obligatoire pour chaque source
Avant toute connexion, documenter : propriétaire, URL officielle, type de ressource (API, flux partenaire, jeu de données ou consultation manuelle), authentification, licence/conditions, fréquence, couverture géographique, champs disponibles, limites de volume, attribution requise, données personnelles éventuelles, durée de conservation, stratégie de reprise, contact d'accès et statut de validation juridique/technique.

### Traitement attendu
1. Collecter uniquement par une voie d'accès autorisée.
2. Conserver l'URL d'origine, l'identifiant source, la date de collecte et la date de publication/mise à jour.
3. Normaliser métiers et compétences, dédoublonner et détecter les annonces expirées.
4. Enrichir l'entreprise uniquement à partir de données licites et en conservant la provenance de chaque champ.
5. Distinguer les faits observés des hypothèses commerciales ; ne pas déduire automatiquement qu'un recrutement signifie une croissance certaine ou un besoin de sous-traitance avéré.
6. Soumettre les signaux à des règles de qualité avant toute éventuelle diffusion dans le bandeau.

**Statut au 1er novembre 2026 :** inventaire de cadrage à compléter et à valider. Aucune de ces sources n'est déclarée connectée par le présent document. L’API Offres d’emploi France Travail doit notamment être revalidée, la fiche officielle signalant une suspension de son exposition publique. Aucun moteur public de recherche d'emploi n'est demandé sur l'accueil.


## 12. Ressources qui alimentent le CRM

Le registre `REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md` est le document opérationnel de référence pour l’inventaire des sources candidates et leur statut. Il couvre les référentiels d’entreprises, les sources BOAMP/BODACC, les données d’emploi, les sources immobilières, les annuaires professionnels et les données produites par les interactions internes MajestiOS. Chaque source doit être évaluée individuellement : accès officiel, champs, fraîcheur, licence, réutilisation commerciale, données personnelles et mécanisme de retrait. La mention d’une source ne signifie pas qu’elle est connectée.

## 13. Raccordement au ciblage commercial des appels d'offres

La veille stratégique doit alimenter le parcours déjà prévu d'accompagnement et de diffusion ciblée des marchés. À partir d'un appel d'offres qualifié, MajestiOS doit :
1. extraire les activités, lots, exigences et territoires concernés ;
2. proposer des codes APE/NAF candidats et expliquer leur pertinence ;
3. rechercher des entreprises par département à partir de sources dont l'accès et la réutilisation sont autorisés ;
4. enrichir et dédoublonner les listes sans supposer qu'un code d'activité prouve une capacité ;
5. viser environ dix entreprises pertinentes par département et par opportunité, sans inventer de destinataires si la sélection qualifiée est plus courte ;
6. préparer la diffusion de l'avis avec une proposition simultanée d'accompagnement à la réponse ;
7. enregistrer les actions, retours, demandes d'accompagnement et oppositions dans le futur CRM.

L'accompagnement humain et technique aux réponses aux appels d'offres est une fonction déjà prévue dans le périmètre MajestiOS. La veille est un moyen d'identifier les entreprises à aider ; elle ne remplace pas l'analyse du DCE, la préparation de candidature, le mémoire technique, la relecture ni le suivi des échéances. Toute campagne réelle nécessite une validation séparée des sources, licences, destinataires, contenu et conformité.
