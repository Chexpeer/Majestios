# Cahier des charges — veille stratégique et nouveaux signaux MajestiOS

Version : 2026-11-01  
Statut : spécification et préparation d'architecture — aucun module décrit ici n'est déclaré opérationnel.  
Branche : chantier-recherche-donnees-gardes-fous-2026-11-01

## 1. Finalité

Faire évoluer MajestiOS vers un outil de développement commercial capable de détecter, qualifier et contextualiser des signaux économiques utiles aux entreprises, artisans, PME et professionnels spécialisés. La valeur attendue réside dans le rapprochement raisonné de sources, la traçabilité des faits, la formulation d'hypothèses explicites et la préparation d'actions commerciales vérifiables.

## 2. Principes non négociables

- Préserver la zone artisanale/industrielle virtuelle existante.
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

## 4. Module Emploi

### 4.1 Candidatures — Nous rejoindre
Prévoir un formulaire avec identité, courriel, téléphone facultatif, profil, compétences, domaine, type de collaboration, message et CV facultatif. Limiter la collecte au besoin annoncé. Le dépôt de CV nécessite validation serveur, formats et taille contrôlés, stockage privé, accès restreint, durée de conservation, information de confidentialité et procédure de suppression. Ne jamais afficher une confirmation si l'enregistrement n'a pas réussi.

### 4.2 Dépôt et veille d'offres
Dossier autonome permettant aux employeurs de proposer des offres et à MajestiOS de suivre les offres de sources dont la réutilisation est autorisée. Champs à prévoir : poste, missions, compétences, secteur, localisation, contrat, dates, employeur, provenance et lien officiel. Cycle : brouillon → à vérifier → validée → publiée → expirée ou retirée.

### 4.3 Limites
Aucun moteur de recherche d'emploi public n'est demandé. Emploi reste hors des catégories du moteur commercial de l'accueil. Le flux horizontal peut accueillir les offres validées, sourcées et non expirées. Les offres peuvent nourrir des analyses de compétences et de secteurs, en distinguant observation et interprétation.

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

- Développement commercial : Marchés publics (BOAMP); événements d'entreprises et annonces commerciales (BODACC); prospection inversée; sous-traitance et partenaires; veille économique et sectorielle; analyse territoriale; transmission et cession; suivi commercial/CRM.
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

Pour chaque lot, relever branche, commit et fichiers touchés; vérifier que la zone industrielle et son code restent inchangés; lancer contrôles de syntaxe, build, vérification de site et tests navigateur pertinents; tester erreurs de source, résultats vides, doublons, données obsolètes et liens; confirmer que les nouvelles pages sont incluses dans le build. Aucun module n'est déclaré opérationnel sans test réel. Aucune fusion ni publication de production sans autorisation explicite.
