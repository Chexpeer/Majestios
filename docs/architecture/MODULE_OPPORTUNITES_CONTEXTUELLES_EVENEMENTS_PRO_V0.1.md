# MajestiOS — Module d’opportunités contextuelles et événements professionnels

- **Version :** 0.1
- **Date :** 28 octobre 2026
- **Branche de travail :** `architecture-v0-1`
- **Statut :** cadrage fonctionnel et architectural proposé ; aucune fonctionnalité décrite ici n’est déclarée livrée.
- **Portée :** préparer une intégration modulaire dans MajestiOS, sans refonte générale et sans migration de base à ce stade.

## 1. Décision produit

MajestiOS pourra intégrer des événements professionnels — salons, expositions, rencontres sectorielles, conférences et événements comparables — dans les flux de recherche auxquels ils sont réellement pertinents.

**Principe retenu : intégrer l’opportunité au flux naturel plutôt que déclencher un pop-up intrusif.**

Exemple : au milieu des résultats d’appels d’offres du bâtiment à Nantes, le flux peut proposer une carte consacrée à un salon du bâtiment dans la même zone, si sa date, son existence et sa pertinence sont vérifiées.

Cette fonction prolonge le positionnement de MajestiOS comme plateforme d’intelligence commerciale : les appels d’offres restent une source d’opportunités parmi d’autres.

## 2. Objectifs et limites

### Objectifs
- Recommander des événements en lien avec le secteur, la localisation, la période et l’intention de recherche.
- Présenter l’événement dans une carte cohérente avec le flux existant, sans bloquer ni masquer les résultats principaux.
- Permettre de consulter les détails et, selon les possibilités de l’organisateur, de s’inscrire depuis MajestiOS ou de suivre un lien officiel.
- Préparer une monétisation transparente par visibilité sponsorisée et, si un accord commercial le permet, par apport d’inscriptions.
- Concevoir les interfaces de manière à pouvoir recommander d’autres catégories d’opportunités plus tard.

### Hors périmètre initial
- Pas de pop-up imposé, de redirection automatique ni d’inscription automatique.
- Pas de billetterie ni d’encaissement développé dans la première étape.
- Pas d’API commerciale à destination de plateformes tierces dans la première étape.
- Pas d’appel obligatoire à une IA payante : le premier classement peut reposer sur des règles explicites.
- Pas de collecte ou de transmission de données personnelles sans information claire, base appropriée et autorisation requise.

## 3. Parcours utilisateur cible

1. L’utilisateur effectue une recherche habituelle.
2. MajestiOS identifie, lorsque l’information est disponible, le contexte utile : mots-clés, secteur, zone géographique, période et type d’intention.
3. Le moteur recherche des événements éligibles dans un catalogue dont la provenance et la date de vérification sont conservées.
4. Une carte événement peut être insérée dans le flux si elle atteint le seuil de pertinence.
5. L’utilisateur peut ouvrir les détails, enregistrer l’événement pour plus tard ou s’inscrire si le parcours est disponible.
6. L’interface indique clairement si l’événement est sponsorisé.
7. Le système mesure les événements d’affichage et de clic de façon proportionnée, selon les choix de confidentialité et les règles applicables.

Une recommandation non pertinente ne doit pas être insérée uniquement parce qu’elle est sponsorisée. La pertinence est une condition d’éligibilité ; le sponsoring peut influencer la sélection parmi les contenus éligibles, avec une mention explicite.

## 4. Parcours d’inscription

Trois modes sont prévus dans la conception, sans imposer leur livraison simultanée :

- **Lien officiel :** l’utilisateur est redirigé vers la page de l’organisateur. Mode de démarrage le plus simple.
- **Demande d’inscription via MajestiOS :** un formulaire est présenté dans la plateforme lorsque l’organisateur autorise ce fonctionnement et qu’un traitement sécurisé est disponible.
- **Inscription ou réservation intégrée :** évolution ultérieure, uniquement après accord technique et commercial avec l’organisateur ; le paiement éventuel exige un cadrage dédié.

Le système doit distinguer au minimum : clic vers l’organisateur, demande envoyée, inscription confirmée et paiement confirmé le cas échéant. Un clic ne doit jamais être présenté comme une inscription confirmée. Les confirmations ne peuvent être déclarées que si elles sont reçues ou vérifiées.

## 5. Modèle fonctionnel modulaire proposé

Noms conceptuels provisoires, à adapter aux conventions réelles du dépôt :

- **Context Analyzer** : normalise le contexte de recherche sans supposer qu’une intention est certaine.
- **Opportunity Catalog** : fournit les événements et, plus tard, d’autres opportunités depuis des sources autorisées.
- **Relevance Rules** : applique des critères explicites et testables (secteur, zone, date, type d’opportunité).
- **Recommendation Selector** : sélectionne les cartes éligibles, limite la répétition et préserve la priorité des résultats recherchés.
- **Feed Card Renderer** : affiche une carte accessible et cohérente avec les composants existants.
- **Registration Adapter** : oriente vers le lien officiel ou, ultérieurement, vers un flux d’inscription autorisé.
- **Measurement** : suit les événements de consultation et de conversion autorisés, avec minimisation des données.

Ces noms décrivent des responsabilités cibles, pas nécessairement des dossiers ou services déjà existants. Avant tout code, repérer les composants, routes, modèles et conventions déjà présents pour éviter les doublons.

## 6. Données minimales à prévoir pour un événement

- Identifiant interne stable.
- Nom de l’événement et description factuelle.
- Organisateur et coordonnées publiques professionnelles utiles.
- Secteurs et types de public concernés.
- Dates de début et de fin, fuseau si nécessaire.
- Lieu et zone géographique.
- URL officielle et mode d’inscription.
- Source de chaque donnée, date de collecte ou vérification et statut de validation.
- Statut de publication et date d’expiration.
- Indication de sponsoring et période de campagne, le cas échéant.
- État d’intégration : lien externe, formulaire autorisé ou intégration confirmée.

Ne pas ajouter de table ni de migration avant d’avoir vérifié le modèle métier de référence et les mécanismes de persistance existants.

## 7. Sources, fiabilité et droits

- Privilégier les données de l’organisateur ou des sources officielles et autorisées.
- Vérifier les conditions d’utilisation, les droits de réutilisation et les limites d’accès de chaque source.
- Ne pas supposer qu’une page consultable peut être copiée, réutilisée ou aspirée librement.
- Conserver la provenance et la date de vérification.
- Expirer ou masquer les événements passés et signaler les informations incertaines.
- Ne pas inventer d’événements, de dates, de tarifs, de places disponibles ou de confirmations d’inscription.

Les sites repérés comme exemples d’inspiration ne sont pas, par défaut, des fournisseurs de données approuvés.

## 8. Modèle économique possible — non validé

- Campagne de visibilité sponsorisée dans des flux pertinents.
- Forfait organisateur pour diffuser et gérer plusieurs événements.
- Rémunération à l’inscription lorsque l’attribution est mesurable et qu’un accord explicite le prévoit.
- Billetterie ou paiement intégré, à étudier séparément.
- Licence ou API pour d’autres plateformes, seulement après validation de l’usage dans MajestiOS.

La viabilité dépendra notamment de l’audience professionnelle réelle, de la pertinence des recommandations, du taux de clic et du nombre d’inscriptions qualifiées. Ces revenus sont des hypothèses, pas des résultats acquis.

## 9. Séquencement recommandé

### Étape 0 — Audit avant code
- Vérifier la branche et l’état actuel du dépôt.
- Repérer les pages et composants de recherche et de flux.
- Examiner les modèles de données et la vision métier de référence.
- Identifier les mécanismes de consentement, de suivi et de sécurité déjà en place.
- Confirmer les sources d’événements réellement réutilisables.

### Étape 1 — Prototype sans IA payante
- Définir un petit catalogue de test clairement étiqueté comme données de démonstration.
- Définir et tester les règles de pertinence.
- Afficher une carte d’événement dans un flux ciblé, si l’architecture actuelle le permet sans refonte.
- Prévoir états vide, erreur, événement expiré et lien indisponible.

### Étape 2 — Source réelle et inscription
- Connecter une source autorisée et vérifiable.
- Tester le cycle de mise à jour et d’expiration.
- Commencer par le lien officiel ; ne créer un formulaire interne que si son traitement complet est prévu et sécurisé.

### Étape 3 — Mesure et monétisation
- Mesurer les affichages et clics nécessaires sans suivi disproportionné.
- Ajouter les campagnes sponsorisées avec signalement visible et règles de pertinence.
- Valider les conditions commerciales avec les organisateurs avant toute facturation à la performance.

### Étape 4 — Extension
- Évaluer d’autres catégories d’opportunités.
- Envisager une API tierce seulement après preuve d’utilité et définition d’un contrat d’intégration stable.

## 10. Critères d’acceptation du premier prototype

- Aucun pop-up intrusif.
- La recherche principale reste lisible et prioritaire.
- Une recommandation apparaît uniquement si les critères de pertinence définis sont satisfaits.
- Les données de démonstration sont clairement identifiées et ne peuvent être confondues avec des événements réels.
- La carte permet de consulter les détails et d’ouvrir le lien de destination attendu.
- Le statut sponsorisé est visible quand il s’applique.
- Les dates passées et les données non vérifiées sont traitées explicitement.
- Les erreurs de source ne génèrent pas de faux événements.
- Le composant peut être désactivé sans casser la recherche existante.
- Les contrôles de lint, de types et de build sont exécutés ; les tests navigateur sont documentés séparément.

## 11. Garde-fous pour toute IA ou personne reprenant ce document

- Ce document est un cadrage : il ne prouve pas que le module existe.
- Ne pas modifier la branche de production, fusionner une PR, déployer ou toucher aux paramètres d’environnement sans autorisation explicite.
- Ne pas créer de migration avant l’audit du modèle de données.
- Ne pas ajouter de clé API ou de secret au dépôt.
- Ne pas promettre de revenus, de portée publicitaire ou d’inscriptions avant mesure.
- Documenter les fichiers modifiés et les tests réellement effectués.
