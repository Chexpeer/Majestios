# Automatisation du ciblage et de la diffusion des marchés publics — MajestiOS

- **Version :** 0.1
- **Date :** 27 octobre 2026
- **Statut :** cadrage fonctionnel proposé, à valider
- **Implémentation :** non réalisée ; ce document n'active aucun envoi automatique

## 1. Objectif

Automatiser autant que possible la chaîne qui transforme un appel d'offres en une campagne de diffusion ciblée vers des entreprises susceptibles d'être intéressées, dans un territoire défini. Le système doit réduire le travail manuel sans envoyer de messages non contrôlés, sans présenter un ciblage approximatif comme une certitude et sans enfreindre les conditions des sources ou les règles de prospection.

## 2. Parcours cible de bout en bout

1. **Surveiller les sources** : collecter périodiquement les nouveaux avis et mises à jour à partir de sources autorisées, en conservant l'identifiant et l'URL officielle.
2. **Qualifier le marché** : extraire l'objet, les catégories, le lieu d'exécution, les échéances, l'acheteur, les lots et les conditions utiles lorsqu'elles sont disponibles.
3. **Détecter les changements** : distinguer un nouvel avis, une modification, une annulation, une échéance dépassée et un avis d'attribution.
4. **Proposer des codes APE/NAF pertinents** : partir de règles explicables associant le vocabulaire, la catégorie et la nature du marché à plusieurs activités potentielles. Les codes proposés doivent être révisables et versionnés.
5. **Rechercher les entreprises** : utiliser l'Annuaire des Entreprises et/ou des sources publiques appropriées selon leurs possibilités d'accès, champs disponibles, quotas et conditions de réutilisation. Filtrer par code d'activité et territoire ; conserver les identifiants légaux lorsqu'ils sont disponibles.
6. **Calculer la pertinence** : combiner activité, proximité, objet du marché et autres critères validés. Afficher les raisons du score et les incertitudes ; le code APE/NAF ne suffit pas à prouver la capacité réelle à répondre.
7. **Dédupliquer et exclure** : éviter les doublons d'entreprises et de destinataires ; respecter les listes d'opposition, désinscriptions, adresses invalides et autres règles d'exclusion.
8. **Préparer une campagne** : générer un résumé utile, l'échéance, le lien officiel et une explication du ciblage. Personnaliser avec des données fiables seulement.
9. **Passer les contrôles nécessaires** : vérifier la qualité de la liste, les règles de prospection, la base légale applicable, l'information du destinataire, les conditions des sources et les limites d'envoi.
10. **Diffuser et suivre** : selon le niveau d'automatisation autorisé, proposer un envoi pour validation ou envoyer automatiquement dans un périmètre explicitement approuvé. Tracer les envois, erreurs, désinscriptions et retours.
11. **Mesurer et apprendre** : suivre les avis envoyés, délivrés, consultés si la mesure est légitime, clics, retours, inscriptions et demandes. Ajuster les règles sur la base de résultats réels, sans confondre engagement et attribution d'un marché.

## 3. Niveaux d'automatisation

### Niveau A — Préparation assistée
- Collecte et qualification automatiques.
- Suggestions de codes APE/NAF et d'entreprises.
- Liste et message préparés automatiquement.
- Validation humaine avant tout envoi.

### Niveau B — Campagnes sous règles approuvées
- Automatisation du ciblage et de la préparation.
- Envoi autorisé uniquement pour des segments, sources, volumes et modèles approuvés à l'avance.
- Pause automatique en cas d'erreur, de source indisponible, de données insuffisantes ou de seuil d'anomalie.

### Niveau C — Optimisation progressive
- Ajustement des critères selon les résultats mesurés.
- Explications visibles des changements de ciblage.
- Toute nouvelle règle ayant un effet important sur les destinataires reste traçable et peut être désactivée.

**Principe de lancement :** commencer au niveau A, vérifier la qualité sur des campagnes pilotes, puis n'activer le niveau B que lorsque les données, les exclusions, la conformité, la délivrabilité et la traçabilité sont contrôlées. Le niveau C vient après des résultats suffisants.

## 4. Paramètres de campagne

Prévoir, dans le futur outil :
- territoire : région, département ou distance ;
- marché ou catégories de marchés ;
- codes APE/NAF inclus et exclus ;
- taille/forme d'entreprise ou autres critères uniquement si justifiés et disponibles ;
- niveau minimal de pertinence ;
- date limite et fraîcheur de l'avis ;
- nombre maximal de destinataires ;
- règles d'exclusion et d'opposition ;
- modèle de message approuvé ;
- mode : simulation, validation obligatoire ou envoi automatique autorisé.

Les paramètres doivent être explicites, modifiables et enregistrés pour chaque campagne.

## 5. Données et modèle fonctionnel à prévoir

Entités candidates, à valider avec le modèle CRM canonique :
- **TenderNotice** : avis, source, URL, dates, statut, objet, lots.
- **Company** : entreprise normalisée et identifiants fiables.
- **ActivityCode** : code APE/NAF, version de nomenclature et provenance.
- **MatchingResult** : entreprise/avis, critères, score explicable, version de règle, date.
- **Campaign** : périmètre, critères, modèle, approbation et statut.
- **CampaignRecipient** : entreprise/contact destinataire, état d'exclusion, état de livraison et motif.
- **DeliveryEvent** : date, résultat, identifiant du prestataire et erreurs.
- **Suppression/Preference** : opposition, désinscription et préférences nécessaires.
- **AuditEvent** : changements de critères, approbations, décisions et actions automatiques.

Ces noms sont conceptuels et ne constituent pas un schéma SQL validé.

## 6. Sécurité, conformité et confiance

- Les données publiques ne donnent pas automatiquement le droit d'en faire tout usage commercial.
- Vérifier les conditions de chaque source, les quotas et la possibilité de réutiliser les champs récupérés.
- Définir et documenter la base légale et les obligations applicables aux campagnes B2B avant l'envoi réel ; fournir l'information nécessaire et un moyen d'opposition/désinscription adapté.
- Minimiser les données collectées et ne pas aspirer de coordonnées non nécessaires.
- Ne jamais inventer de coordonnées ou affirmer qu'une entreprise est intéressée sans preuve.
- Séparer données source, décisions de ciblage et hypothèses générées.
- Ne pas envoyer de dossier complet si un lien officiel suffit.
- Mettre en place des limites de débit, une gestion des erreurs, une protection contre les envois répétés et un coupe-circuit global.
- Enregistrer les critères, versions de règles, listes finales, approbations et résultats.
- Ne pas utiliser de secrets côté navigateur et ne pas ajouter de fournisseur d'envoi avant décision explicite.
- Prévoir des contrôles de sécurité et de conformité avant tout envoi à grande échelle.

## 7. Tests d'acceptation

- Un avis nouveau déclenche une seule qualification initiale ; une mise à jour n'est pas confondue avec un nouvel avis.
- Un avis annulé ou expiré ne déclenche pas une nouvelle campagne.
- Les codes proposés sont explicables et modifiables.
- Le filtrage territorial donne des résultats cohérents et respecte le périmètre sélectionné.
- Les entreprises dupliquées sont dédupliquées sans fusion risquée.
- Un score faible ou des données insuffisantes conduisent à une revue, pas à un envoi aveugle.
- Les destinataires opposés ou désinscrits sont exclus avant chaque envoi.
- Une campagne en mode simulation n'envoie aucun message.
- Les erreurs et limites du fournisseur interrompent ou suspendent l'envoi de façon contrôlée.
- Les doublons d'envoi sont empêchés même après une relance technique.
- Les compteurs et résultats affichés proviennent d'événements réels et leur définition est documentée.
- Un audit permet de retrouver pourquoi une entreprise a été ciblée et quel message elle a reçu.

## 8. Déploiement progressif

1. Vérifier les champs et la stabilité des sources d'avis et d'entreprises.
2. Construire un prototype de ciblage en lecture seule, sans collecte persistante ni envoi.
3. Tester sur un territoire et quelques familles de marchés ; comparer manuellement les résultats.
4. Définir les règles de conformité, les exclusions et le modèle de message.
5. Tester une campagne pilote avec validation humaine et un groupe limité.
6. Mesurer la qualité du ciblage, les erreurs et les retours.
7. Activer l'envoi automatique uniquement pour les cas approuvés, avec plafonds et arrêt d'urgence.
8. Étendre progressivement à d'autres territoires et familles de marchés.

## 9. Dépendances et décisions ouvertes

- Schéma réel des avis d'attribution et des avis initiaux dans les sources disponibles.
- Couverture et limites de l'API de l'Annuaire des Entreprises.
- Règles de correspondance entre types de marchés, mots-clés et codes APE/NAF.
- Critères de pertinence et seuils de revue humaine.
- Sources de coordonnées professionnelles et conditions de réutilisation.
- Fournisseur d'envoi et politique de délivrabilité, à choisir ultérieurement.
- Définition des métriques et conservation des événements.
- Validation juridique du dispositif de prospection.
- Modèle CRM canonique et persistance, à cadrer avant implémentation.

## 10. Traçabilité

- **ID proposé :** OI-CAMP-001
- **Exigence :** automatiser la détection des appels d'offres, le ciblage régional par activités APE/NAF, la préparation des campagnes et leur diffusion contrôlée.
- **Priorité proposée :** axe stratégique majeur ; commencer par le prototype de ciblage en lecture seule après stabilisation du connecteur de source.
- **Statut :** spécifié au niveau fonctionnel, non implémenté, aucun message envoyé.
