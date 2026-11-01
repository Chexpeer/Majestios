# MajestiOS — cahier des charges maître

Version : 2026-11-01  
Statut : document de cadrage à valider par le Fondateur. Il consolide les exigences produit et sépare les décisions établies, les périmètres futurs et les points restant à arbitrer.  
Branche de travail : `chantier-recherche-donnees-gardes-fous-2026-11-01`  
Documents complémentaires : `CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md`, `PLAN-CHANTIER-RECHERCHE-DONNEES-CRM.md`, `ARBORESCENCE-MAJESTIOS.md`, `REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md`.

## 1. Vision du produit

MajestiOS est un outil de développement commercial assisté par IA. Sa fonction centrale est d'aider une entreprise à détecter des signaux utiles, comprendre leur contexte, qualifier des opportunités et préparer des actions commerciales pertinentes.

Chaîne fonctionnelle cible :

**Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser.**

La valeur ne se limite pas à agréger des annonces ou à rediriger vers des sites tiers. MajestiOS doit progressivement rapprocher des sources autorisées, structurer les informations, faire ressortir les liens utiles et aider les équipes à préparer une décision ou une action vérifiable.

Formulations de positionnement à préserver dans les futurs travaux de communication :
- « MajestiOS, l’outil qui donne une conscience à votre intelligence. »
- « L’alliance de l’intelligence numérique et de la prospection intelligente. »
- « MajestiOS, l’ADN qui transmet l’information stratégique. »

Le ton du site doit rester professionnel, accessible et parfois humoristique avec mesure. La terminologie produit à privilégier est **développement commercial**.

## 2. Décisions produit à préserver

1. La page d’accueil reste compacte : navigation principale, zone artisanale/industrielle virtuelle, moteur de recherche avancé et bandeau horizontal de démonstration très discret, lent et clairement signalé comme fictif.
2. La zone virtuelle reste directement visible sur l’accueil et n’est pas transformée en entrée de navigation supplémentaire.
3. Navigation principale : Accueil ; Développement commercial ; Salon virtuel ; Nous rejoindre ; Espace membre ; FAQ.
4. Aucun empilement de cartes d’annonces fictives sur l’accueil.
5. Les recherches publiques de marchés et les signaux d’entreprises BODACC sont des fonctions distinctes et doivent être identifiées comme telles.
6. L’emploi constitue une veille discrète et un dossier autonome. Il ne devient pas une catégorie du moteur principal d’opportunités commerciales ni un moteur public d’emploi sur l’accueil.
7. L’immobilier professionnel constitue un dossier autonome futur, alimenté par des signaux à vérifier et des annonces immobilières autorisées.
8. Chaque donnée conserve sa provenance et son statut. Un fait publié, une transformation, une hypothèse commerciale et une validation humaine ne doivent jamais être confondus.
9. Les pages, formulaires, moteurs, analyses et CRM ne sont déclarés opérationnels qu’après connexion et tests réels.
10. Aucun merge vers `main`, déploiement en production, campagne externe ou collecte automatisée supplémentaire sans autorisation distincte.

## 3. Publics et besoins à servir

### Public prioritaire
Artisans, TPE et PME, en particulier les entreprises qui ont une activité saine mais manquent de temps ou de ressources pour faire une veille commerciale structurée.

### Publics spécialisés à prendre en compte
- Entreprises qui répondent aux marchés publics.
- Entreprises qui cherchent des partenaires ou des possibilités de sous-traitance.
- Agents commerciaux indépendants et apporteurs d’affaires.
- Cabinets de conseil et professionnels du développement commercial.
- Agents immobiliers d’entreprise, gestionnaires de locaux et professionnels de la transmission.
- Recruteurs et entreprises qui souhaitent suivre les compétences recherchées.
- Investisseurs et partenaires, selon les modules futurs et les droits applicables.

Les fonctionnalités doivent être conçues à partir de besoins professionnels concrets, sans multiplier prématurément les interfaces publiques.

## 4. Périmètre fonctionnel

### 4.1 Développement commercial et opportunités
- Rechercher des marchés publics à partir de sources adaptées, dont BOAMP.
- Rechercher séparément les annonces commerciales et événements d’entreprise publiés, notamment via BODACC.
- Qualifier les informations selon activité, localisation, échéance, entreprise, nature du signal et fiabilité.
- Préparer des pistes de prospection inversée et de sous-traitance, explicitement présentées comme des hypothèses tant qu’elles ne sont pas confirmées.
- Permettre à terme le suivi des dossiers et des actions dans le CRM.

### 4.2 Veille stratégique transverse
MajestiOS doit pouvoir exploiter, après validation de chaque source, plusieurs familles de signaux :
- commande publique, consultations et résultats/attributions ;
- événements d’entreprise : création, immatriculation publiée, cession, procédure collective, modification, transfert ou radiation ;
- données autorisées sur les entreprises et établissements ;
- projets de construction et d’aménagement accessibles légalement ;
- annonces immobilières professionnelles explicites ;
- offres d’emploi et référentiels de métiers/compétences autorisés ;
- tendances sectorielles et territoriales ;
- changements concernant des entreprises déjà suivies dans le CRM.

### 4.3 Emploi — veille discrète
L’emploi doit rester un module distinct du moteur d’opportunités commerciales. Il doit permettre de préparer une veille sur les offres et compétences recherchées, d’analyser les tendances sectorielles et d’identifier des signaux de recrutement, sans prétendre qu’un recrutement prouve une intention d’achat.

Sources à instruire, sans présumer d’intégration active : France Travail (API Offres, Marché du travail, ROME 4.0 et événements selon disponibilité), La Bonne Alternance, APEC, Cadremploi, agentCo, HelloWork, Indeed, Welcome to the Jungle, LinkedIn, Meteojob, Choisir le service public, APECITA, plateformes sectorielles et jeux de données publics. Pour chacune, vérifier l’accès officiel, les conditions de réutilisation, la licence, la fréquence, les limites et l’attribution avant automatisation. L’accès visible sur un site web n’équivaut pas à une autorisation de collecte ou de republication.

Le bandeau horizontal de l’accueil est exclusivement un flux de démonstration lent, discret et explicitement fictif. Il ne diffuse pas d’offres réelles, y compris des offres d’emploi. Les résultats réels se consultent à la demande dans les parcours de recherche appropriés. Une éventuelle diffusion réelle future nécessiterait une décision distincte, un emplacement et un périmètre dédiés, ainsi que la validation des sources et des droits.

### 4.4 Immobilier professionnel et foncier d’entreprise
Préparer un dossier dédié pour repérer des pistes concernant les locaux professionnels, commerces et actifs immobiliers, notamment à partir :
- d’annonces explicites de vente ou location ;
- de cessions de fonds de commerce ou de droits au bail ;
- de transferts ou fermetures d’établissements ;
- de procédures collectives ;
- de projets de construction ou d’aménagement accessibles.

**Règle impérative :** une cessation, une liquidation, une radiation ou une cession d’entreprise ne prouve pas que ses locaux sont disponibles, à vendre ou à louer. Ces événements sont des signaux à investiguer, pas des annonces immobilières.

Les informations doivent distinguer les murs, le fonds de commerce, le droit au bail, la vente/location du bien, la cession de titres et la cession d’actifs. Avant toute diffusion comme bien disponible, vérifier la disponibilité réelle, la provenance, la propriété ou le mandat, le statut du bail et l’existence d’une annonce explicite ou d’une confirmation fiable.

### 4.5 Salon virtuel / showroom
Le salon virtuel est un espace de présentation collective et de mise en relation, distinct des moteurs de veille. À terme, chaque entreprise pourra présenter ses savoir-faire, réalisations, capacités, références, certifications et possibilités de coopération. Les fonctionnalités immersives ou augmentées par l’IA restent évolutives et ne doivent pas être présentées comme disponibles avant leur réalisation.

### 4.6 Espace membre, formulaires et CRM
- Préparer la personnalisation des pages et des préférences d’un compte.
- Prévoir des formulaires avec validation côté client et serveur, états explicites et protection anti-abus.
- Ne jamais afficher un message de succès si les données n’ont pas réellement été enregistrées ou transmises.
- Le dépôt de CV doit rester désactivé jusqu’à la mise en place d’un stockage sécurisé, d’accès restreints, d’une politique de conservation et d’une procédure de suppression.
- Le futur CRM devra distinguer entreprises, établissements, interlocuteurs, décideurs, opportunités, tâches et interactions ; appliquer l’isolation des comptes, les rôles et permissions côté serveur, l’historique d’audit et les règles de conservation.

## 5. Matrice de valeur — du signal à l’action

| Signal observé | Question à qualifier | Pistes professionnelles possibles | Vérification indispensable |
|---|---|---|---|
| Marché public publié | L’entreprise ciblée dispose-t-elle des compétences et de la zone d’intervention requises ? | Réponse directe, groupement, partenariat, sous-traitance potentielle | Avis original, échéance, lot, critères et statut |
| Marché attribué | Le titulaire peut-il avoir besoin de partenaires ou de capacités complémentaires ? | Prospection de sous-traitance ou de partenariat | Attribution officielle et confirmation humaine du besoin |
| Création d’entreprise | Quels services sont nécessaires au démarrage ? | Comptabilité, informatique, télécoms, équipement, assurance, locaux ou accompagnement | Existence, activité, localisation et date du signal |
| Transfert ou ouverture d’établissement | Des besoins d’installation, travaux ou équipement sont-ils plausibles ? | Artisans, installateurs, fournisseurs, déménageurs, immobilier professionnel | Établissement concerné, date et nature exacte de l’événement |
| Cessation, liquidation ou procédure collective | Existe-t-il des actifs, un fonds, des locaux ou une opportunité de transmission à examiner ? | Professionnels de la transmission, mandataires, agents immobiliers d’entreprise, investisseurs | Ne jamais conclure automatiquement à la disponibilité d’un bien ; vérifier chaque actif et chaque mandat |
| Annonce explicite de vente/location de local professionnel | Le bien correspond-il à la zone, au type d’activité et au besoin recherché ? | Mise en relation immobilière ou recherche d’implantation | Annonce actuelle, adresse, statut, disponibilité et interlocuteur autorisé |
| Projet d’urbanisme ou d’aménagement | Quels travaux, équipements ou services pourraient être nécessaires ? | Entreprises du bâtiment, bureaux d’études, fournisseurs et prestataires | Source publique, stade du projet, calendrier et périmètre |
| Offre d’emploi publiée | Quelles compétences, fonctions ou évolutions sectorielles sont observées ? | Analyse des compétences, tendances de marché, identification prudente d’entreprises à approcher | Source autorisée, fraîcheur, dédoublonnage ; ne pas assimiler recrutement et intention d’achat |
| Besoin d’agent commercial ou d’apporteur d’affaires | Le besoin correspond-il au secteur, à la zone et au profil d’un professionnel ? | Mise en relation commerciale ou qualification d’une mission | Offre source, conditions, date et autorisation de réutilisation |
| Changement public touchant une entreprise suivie | Le dossier CRM doit-il être révisé ? | Tâche de vérification, mise à jour de fiche, prise de contact adaptée | Concordance d’identité, date, source et validation humaine |

Cette matrice est une base fonctionnelle. Elle ne vaut ni automatisation des actions commerciales ni garantie qu’un signal se transforme en opportunité.

## 6. Modèle commun d’un signal

Chaque signal doit pouvoir porter, selon les champs réellement disponibles :
- identifiant interne et identifiant de la source ;
- famille et type de signal ;
- source, URL originale, propriétaire et conditions de réutilisation ;
- dates de publication, collecte, dernière vérification et prochaine révision ;
- entreprise ou établissement concerné, avec niveau de confiance de l’identification ;
- territoire, secteur, activité et éléments factuels observés ;
- transformation réalisée et hypothèse commerciale, séparées du fait source ;
- niveau de confiance, limites et éléments manquants ;
- état de traitement, responsable de qualification et historique ;
- expiration, retrait ou motif d’exclusion ;
- règles d’accès, durée de conservation et éventuelles contraintes de diffusion.

Cycle d’état cible : **détecté → à compléter → à vérifier → qualifié → validé → publié ou transmis si autorisé → expiré/retiré**. Un signal peut aussi être écarté, avec motif traçable.

## 7. Principes de qualité, conformité et gouvernance

1. Évaluer chaque source individuellement avant tout connecteur : accès, authentification, licence, attribution, fréquence, couverture, champs, quotas, données personnelles, conservation, reprise sur erreur et contact.
2. Conserver les liens et identifiants d’origine lorsque disponibles.
3. Dédupliquer sans effacer les provenances multiples pertinentes.
4. Distinguer donnée absente, donnée inconnue, donnée invalide et donnée expirée.
5. Afficher les états de source : opérationnelle, retardée, en erreur ou non configurée.
6. Prévoir une validation humaine avant publication d’un signal sensible ou déclenchement d’une action commerciale.
7. Ne pas scraper, republier ou envoyer des campagnes à partir d’une source sans vérifier les conditions applicables.
8. Minimiser les données personnelles et prévoir les règles de conservation, d’accès et de suppression.
9. Toute recommandation générée par IA doit indiquer ses faits d’appui, ses hypothèses et ses limites.

## 8. Arborescence fonctionnelle cible

- **Accueil** : zone virtuelle, recherche commerciale transversale, navigation discrète.
- **Développement commercial** :
  - marchés publics ;
  - événements et annonces d’entreprise BODACC ;
  - prospection inversée ;
  - sous-traitance et partenaires ;
  - veille économique et sectorielle ;
  - analyse territoriale ;
  - transmission et cession ;
  - suivi commercial et CRM.
- **Emploi** — dossier autonome, non intégré aux filtres du moteur commercial :
  - sources et veille d’offres autorisées ;
  - dépôt et validation d’offres ;
  - métiers et compétences ;
  - analyse des tendances ;
  - candidatures et CV sécurisés lorsque le backend le permet.
- **Immobilier professionnel** — dossier autonome futur :
  - annonces immobilières explicites ;
  - locaux potentiellement libérés à vérifier ;
  - fonds, droit au bail, murs et actifs ;
  - projets de construction/aménagement ;
  - vérification de disponibilité et mise en relation autorisée.
- **Salon virtuel** : showrooms et exposants.
- **Nous rejoindre** : contributions, collaborations, candidatures et partenariats.
- **Espace membre** : profil, préférences, dossiers, tâches et futur CRM.
- **Socle transverse** : sources, provenance, normalisation, qualification, analyse, historique et gouvernance.

Cette arborescence est fonctionnelle : elle ne prescrit pas de déplacer immédiatement les fichiers HTML. Les pages nouvelles seront ajoutées seulement lorsqu’un parcours et ses critères d’acceptation seront définis.

## 9. Phasage proposé

### Phase A — Cahier des charges et décisions
- Valider le périmètre MVP et la distinction entre fonctions actuelles, fonctions préparées et extensions.
- Fixer le modèle commun des signaux et les statuts.
- Valider les parcours utilisateurs et les critères d’acceptation.

### Phase B — Fiabilité des sources de base
- Stabiliser les recherches BOAMP et BODACC existantes.
- Valider les états de chargement, résultats, absence de résultat, erreur, fraîcheur et liens officiels.
- Ne pas ajouter de nouvelles sources avant que leurs règles d’accès et leurs objectifs soient documentés.

### Phase C — Qualification interne
- Définir la fiche de qualification d’un signal.
- Définir le traitement humain, les motifs d’exclusion, l’historique et les actions possibles.
- Préparer le rapprochement avec les entreprises et activités, sans envoi automatique.

### Phase D — Dossiers Emploi et Immobilier professionnel
- Inventorier et évaluer les sources autorisées.
- Définir les champs, cycles de vie, vérifications et règles de diffusion.
- Tester sur des données de démonstration clairement marquées, puis sur des données autorisées lorsque l’accès est validé.

### Phase E — Espace membre, analyses et CRM
- Définir les profils, permissions, préférences et formulaires.
- Définir les indicateurs d’analyse et leur provenance.
- Construire le CRM sur un modèle de données validé, avec isolation des comptes et journalisation.

### Phase F — Extensions
- Personnalisation avancée, recommandations IA, showrooms enrichis, outils de mise en relation et modules additionnels après validation de la valeur et des contraintes.

## 10. Critères de réussite produit

MajestiOS progresse lorsque l’utilisateur professionnel peut :
1. comprendre ce qui est recherché et pourquoi ;
2. retrouver la source d’un fait ;
3. distinguer un fait publié d’une hypothèse ;
4. filtrer les informations selon son activité et son territoire ;
5. comprendre si une information est récente, vérifiée, expirée ou indisponible ;
6. qualifier un signal et conserver le résultat de cette qualification ;
7. préparer une action commerciale sans que le système prétende l’avoir exécutée ;
8. retrouver l’historique et éviter les doublons ;
9. utiliser des formulaires dont l’état réel est explicite ;
10. évoluer vers un espace personnalisé et un CRM sans reconstruire l’architecture.

## 10 bis. Proposition de périmètre MVP — à valider

**Statut : proposition de cadrage, pas décision de livraison ni preuve que les fonctions sont déjà opérationnelles.** L’objectif est de terminer un premier parcours commercial utile avant d’ouvrir de nouveaux chantiers.

### Inclus dans le MVP fonctionnel cible
1. **Accueil stable** : zone artisanale virtuelle visible, moteur de recherche commercial multicritère, navigation discrète, accès au chatbot et bandeau lent de démonstration exclusivement fictif.
2. **Recherche de marchés publics** : interrogation BOAMP, filtres réellement appliqués, échéances, source officielle, états chargement/résultats vides/erreur et distinction des avis expirés.
3. **Recherche de signaux d’entreprises** : parcours BODACC distinct, typologie du signal clairement affichée, source d’origine et avertissement contre les conclusions automatiques.
4. **Résultats et catégories** : conservation des critères de recherche, destinations cohérentes, affichage de la provenance et gestion des résultats absents ou incomplets.
5. **Demande d’accompagnement** : parcours décrit et interface préparée ; il ne sera annoncé comme actif que lorsque l’enregistrement serveur, la confirmation réelle et la protection des données auront été testés.
6. **Socle de traçabilité** : contrat commun de données, statut des sources, dates, dédoublonnage à la réception lorsque réalisable et séparation entre faits, hypothèses et validation humaine.
7. **Documentation et tests** : critères d’acceptation, tests anti-régression de la zone d’accueil, tests des filtres et des erreurs, procédure de retour arrière.

### Hors MVP — préparation documentaire seulement
- Collecte automatique d’offres d’emploi et publication d’offres réelles.
- Recherche ou publication de biens immobiliers à partir de portails privés.
- CRM complet avec comptes clients, rôles, historique et automatisations.
- Enrichissement massif d’entreprises et ciblage de listes par département.
- Campagnes d’e-mails, candidatures, prises de contact ou autres actions externes automatiques.
- Personnalisation avancée, analyses prédictives et extensions immersives de la zone.

Ces fonctions restent dans la vision et les chantiers futurs ; elles ne doivent ni encombrer l’accueil ni être présentées comme disponibles avant réalisation, autorisations et tests.

### Critères de sortie du MVP
- Aucun filtre affiché n’est ignoré silencieusement ; chaque filtre est appliqué ou explicitement indiqué comme indisponible pour la source.
- Les résultats BOAMP et BODACC restent séparés et renvoient à leur source.
- Les cas de réponse vide, erreur HTTP, donnée incomplète, échéance dépassée et doublon ont un comportement défini et testé.
- La zone artisanale et la navigation ne régressent pas.
- Aucun formulaire ne simule un enregistrement réussi ; aucune action externe n’est déclenchée sans autorisation explicite.
- Build, vérification du site et tests navigateur concernés passent ; les preuves et le commit sont consignés.
- Le statut des fonctions est affiché sans ambiguïté : opérationnelle, partielle, non configurée ou future.

### Décision à prendre
Le Fondateur confirme ou ajuste ce périmètre avant toute implémentation qui l’élargirait. En attendant, ce cadrage sert de proposition de travail pour prioriser les corrections P0 BOAMP/BODACC et la validation des parcours existants.

## 11. Registre de décisions et de points à valider

### Décisions déjà établies
- Le développement commercial est le cœur de MajestiOS.
- La zone virtuelle reste sur l’accueil.
- Le moteur commercial ne devient pas un moteur public d’emploi.
- BODACC est une source de signaux d’entreprise, pas une source d’appels d’offres.
- La cessation d’activité ne vaut pas preuve de disponibilité immobilière.
- Les données doivent rester traçables et les hypothèses identifiables.
- Le bandeau horizontal de l’accueil reste fictif ; aucune offre réelle n’y est diffusée.
- Les connecteurs, formulaires, comptes et CRM ne sont pas réputés opérationnels sans réalisation et tests.

### À arbitrer avant implémentation
- Le périmètre exact du MVP commercial et ses critères de sortie.
- Les sources prioritaires après BOAMP/BODACC et les droits associés.
- Le rôle des équipes MajestiOS dans la qualification humaine et la mise en relation.
- La politique d’une éventuelle diffusion réelle future, hors bandeau fictif de l’accueil.
- Les profils d’accès et les règles de conservation pour les données CRM, CV et contacts.
- Le modèle de financement et les éventuelles offres commerciales, sans annoncer de prix ni de disponibilité avant décision.

## 12. Documents de référence

- `CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md` : inventaire et traitement de la veille, emploi et immobilier professionnel.
- `PLAN-CHANTIER-RECHERCHE-DONNEES-CRM.md` : lots techniques, contrôles et ordre de chantier.
- `ARBORESCENCE-MAJESTIOS.md` : pages, navigation et dépendances.
- `MODELE-DONNEES-APPELS-OFFRES.md` et `schemas/opportunite.schema.json` : contrat de données des opportunités existantes.
- `REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md` : ressources candidates, accès, limites, pipeline d’alimentation et statuts de validation.

Ce cahier des charges maître sert de base de consolidation. Les documents complémentaires doivent être harmonisés avec lui au fur et à mesure des décisions, sans faire passer une proposition pour une décision validée. Toute implémentation nouvelle attend la validation du périmètre concerné par le Fondateur.


## 13. Exigence métier détaillée — accompagnement et diffusion ciblée des appels d'offres

Les exigences suivantes font partie du périmètre fonctionnel consolidé ; elles ne doivent pas être requalifiées en nouvelles fonctionnalités à chaque rappel.

### 13.1 Accompagnement humain et technique aux réponses
MajestiOS doit accompagner les entreprises, avec une combinaison adaptée d'assistance numérique, d'expertise technique et d'intervention humaine, dans la compréhension du DCE, l'identification des conditions de candidature, la préparation des pièces, la structuration de l'offre et du mémoire technique, la vérification du dossier et le suivi des échéances jusqu'au dépôt. L'entreprise reste responsable de la réponse finale et aucun résultat d'attribution n'est garanti.

### 13.2 Ciblage des entreprises par APE/NAF et département
Pour chaque appel d'offres qualifié, MajestiOS doit pouvoir identifier les codes APE/NAF et activités pertinentes, rechercher des entreprises par département d'exécution, les dédoublonner et les classer selon des critères explicables. Cible de travail : environ dix entreprises pertinentes par département et par opportunité, uniquement si les données disponibles permettent une sélection de qualité. Le code APE/NAF est un filtre initial, pas une preuve suffisante de capacité.

### 13.3 Diffusion couplée à l'offre d'accompagnement
La diffusion doit présenter l'appel d'offres, sa source officielle, les informations clés et les échéances disponibles, avec une proposition parallèle d'accompagnement MajestiOS. Les envois, retours, demandes de service, oppositions et suites commerciales doivent pouvoir être suivis dans le futur CRM. Aucune campagne externe ne doit être lancée sans autorisation distincte et vérification des sources, droits de réutilisation, destinataires et règles de prospection.

### 13.4 Référence de reprise pour les IA
Toute IA reprenant le projet doit lire DOCUMENTATION-REPRISE-IA-MAJESTIOS.md puis SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md. Ces documents explicitent l'état du prototype, les fonctions prévues, les règles de navigation, les garde-fous et les critères d'acceptation. Ils ne prouvent pas qu'une fonction est déjà opérationnelle.


### État du premier prototype de ciblage — 1er novembre 2026

La première brique de préqualification est maintenant matérialisée dans le dépôt :
- `qualification-entreprises.html` : formulaire pour saisir des codes APE/NAF validés et des départements ;
- `company-targeting-page.js` : orchestration de la recherche et affichage des résultats ;
- `company-targeting.js` : adaptateur de recherche vers l’API publique Recherche d’Entreprises, normalisation, dédoublonnage et score explicable ;
- `tests/company-targeting.test.cjs` : tests automatisés préparés pour les fonctions de qualification ;
- `build.js` : inclusion de la page et des scripts dans les ressources à construire.

Le score sert uniquement à ordonner des pistes ; il ne prouve pas la capacité à répondre à un marché. Les codes APE/NAF doivent être choisis ou vérifiés à partir des activités et exigences réelles. Le module ne lance aucune campagne et n’enregistre pas de données dans un CRM.

**État de validation :** les fichiers ont été relus après écriture et les vérifications de syntaxe ainsi que des tests ciblés simulés ont réussi dans cette session. Le test Node dédié, le build complet, le test navigateur et l’appel réel à l’API depuis le navigateur restent à exécuter. Le prototype ne doit pas être annoncé comme un service opérationnel avant ces étapes.


## Complément — suggestions explicables de codes APE/NAF (1er novembre 2026)

Le prototype de préqualification dispose désormais d’un moteur lexical de suggestions (naf-suggestions.js). À partir de l’intitulé saisi par l’opérateur, il propose des codes APE/NAF issus d’une table de règles documentée, affiche les mots-clés ayant déclenché chaque proposition et laisse l’opérateur cocher les codes à ajouter au formulaire.

**Garde-fous :** cette fonctionnalité n’analyse pas encore le DCE ni l’intégralité de l’avis, ne garantit pas l’exhaustivité des métiers et ne valide pas la nomenclature à la place d’un humain. Aucun code suggéré n’est sélectionné silencieusement, aucun contact n’est envoyé et aucune donnée n’est enregistrée dans le CRM. Les codes retenus doivent être contrôlés avant toute requête ou qualification commerciale.

Un workflow GitHub Actions de vérification anti-régression a été ajouté sur la branche de chantier : tests du ciblage, tests des suggestions APE/NAF, build statique et contrôle des références internes. Son existence ne vaut pas résultat d’exécution ; les résultats doivent être consultés dans GitHub Actions.


## Qualification explicable des entreprises candidates — ajout du 1er novembre 2026

Le module `company-fit.js` complète le ciblage administratif par une qualification lisible, sans transformer une correspondance de données en validation métier. Il distingue :

- la correspondance exacte ou l'absence de correspondance exacte du code APE/NAF, ou une donnée inconnue ;
- la concordance du département et le cas où le siège est hors périmètre, qui déclenche une vérification d'un éventuel établissement local avant exclusion ;
- le statut administratif actif, inactif/à vérifier ou inconnu ;
- les vérifications humaines restant ouvertes : établissement local, qualifications/certifications, références comparables, moyens humains et matériels, éligibilité au marché et disponibilité.

La sortie reste `manual_review_required` : aucune entreprise n'est déclarée compétente ou éligible sur le seul fondement des données administratives. Les informations inconnues sont signalées, et le score éventuel du moteur de ciblage ne doit jamais masquer un manque de preuve. Les tests dédiés sont dans `tests/company-fit.test.cjs` et doivent être exécutés par le workflow anti-régression avant toute intégration ultérieure.


## Suivi parallèle de la dynamique économique des entreprises

Le ciblage des entreprises candidates pourra être enrichi par un historique de chiffre d'affaires publié, de l'exercice concerné, de la variation sur période comparable, de la source et de la fraîcheur de la donnée. L'absence ou la confidentialité des comptes doit rester explicite : aucune valeur zéro artificielle ni exclusion automatique. Une évolution du chiffre d'affaires ne prouve ni rentabilité, ni trésorerie, ni capacité à exécuter un marché. Voir `SPEC-SUIVI-DYNAMIQUE-ECONOMIQUE-ENTREPRISES-MAJESTIOS.md`. Les sources et droits de réutilisation doivent être validés avant tout connecteur opérationnel.
