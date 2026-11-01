# Rapport d’audit MajestiOS — Lot 01
Date : 1er novembre 2026  
Branche : `chantier-recherche-donnees-gardes-fous-2026-11-01`

## Périmètre et preuve d’exécution

Le lot porte sur dix contrôles prioritaires autour de l’accueil, de la recherche, de la séparation des sources et des garde-fous. Le workflow GitHub Actions du commit `abf0b187c2a4df84d1519b9217614af94c6923c3` est terminé avec la conclusion **success**. Le job `verify-static-site` a validé la syntaxe JavaScript, le build, les contrôles statiques, les tests de connexion BOAMP/BODACC, la recherche dans Chromium et la zone industrielle dans Chromium.

Cette réussite décrit le commit testé. Toute nouvelle modification doit déclencher et réussir son propre contrôle avant de pouvoir être considérée comme validée.

## Les dix contrôles

| # | Contrôle | État | Observation / garde-fou |
|---|---|---|---|
| 1 | Accueil compact et présence du moteur | Vérifié par les contrôles statiques et le test navigateur | L’accueil conserve la zone immersive, le formulaire de recherche, la navigation discrète et le guide d’aide. Le flux supérieur indique explicitement qu’aucune annonce réelle n’est diffusée pour le moment. |
| 2 | Transmission des critères de recherche | Testé dans Chromium | Les critères mot-clé, catégorie, type de marché et région sont transmis dans l’URL vers la page de résultats appropriée. |
| 3 | Catégories et faux positifs | Testé dans Chromium | Le test vérifie que la catégorie Services numériques ne présente pas une annonce de plomberie comme résultat numérique. |
| 4 | Filtre géographique | Testé dans Chromium | Le test couvre la région Nouvelle-Aquitaine et vérifie l’application du filtre de département à la requête BOAMP. Les anciennes zones de démonstration ne doivent pas être proposées comme régions réelles disponibles. |
| 5 | Séparation des marchés publics | Testé par le smoke test API et le test navigateur | BOAMP est interrogé pour les appels d’offres publics ; la requête vérifiée limite la recherche aux avis d’appel d’offres. |
| 6 | Séparation des signaux privés | Testé par le smoke test API et le test navigateur | BODACC est utilisé pour les annonces légales et signaux commerciaux. Ces annonces ne sont pas qualifiées de marchés à remporter. |
| 7 | Recherche combinée public + privé | Testé dans Chromium | Les deux sources sont interrogées séparément et leurs résultats restent regroupés par provenance, sans fusion trompeuse. |
| 8 | Provenance, références et échéances | Couvert par les contrôles et tests existants | Les cartes affichent les éléments de provenance disponibles, les références utiles et un avertissement lorsque l’échéance BOAMP est absente. Chaque avis doit être confirmé sur sa publication officielle. |
| 9 | Absence de résultats inventés en cas de problème | Vérifié par les tests de recherche | Les états vides et erreurs indiquent qu’aucun résultat n’est inventé. Les filtres géographiques BODACC non pris en charge sont refusés explicitement au lieu de retourner des résultats non filtrés. |
| 10 | Zone immersive, veille emploi et formulaires | Zone testée ; limites fonctionnelles identifiées | Le test navigateur de la zone est réussi. La veille emploi reste absente des catégories publiques de recherche. La création de compte, l’envoi de candidature et les demandes de contact ne sont pas encore connectés à un backend : aucun envoi ni stockage réel ne doit être promis. |

## Points ouverts à traiter dans les lots suivants

1. **Formulaires et espace membre** : choisir et intégrer une destination réelle pour les demandes, avec validation serveur, consentement adapté, politique de conservation et retour d’erreur fiable. Jusqu’à cette intégration, conserver le libellé de démonstration.
2. **Qualification BODACC** : enrichir les règles par type d’annonce et distinguer clairement le fait publié, l’hypothèse commerciale et l’action proposée. Toute inférence doit être vérifiée par un humain avant prospection.
3. **Fraîcheur et dédoublonnage** : documenter la fenêtre temporelle, la clé de dédoublonnage et le comportement lors d’une indisponibilité de source.
4. **Veille emploi multisource** : maintenir le périmètre interne. Avant toute collecte planifiée, valider pour chaque source l’accès autorisé, les conditions d’utilisation, les limites, l’attribution, la fréquence et les données personnelles.
5. **Intégration Git** : ne pas fusionner en production sur la seule base de ce lot. Évaluer séparément l’écart d’historique de la branche de chantier avec la branche de référence et définir une stratégie d’intégration sûre.
6. **Déploiement** : aucune mise en production n’est déclenchée par ce rapport.

## Règle de validation

Une fonctionnalité n’est déclarée « opérationnelle » que si son parcours réel est testé et si sa dépendance externe est effectivement connectée. Les tests avec réponses simulées vérifient la logique applicative ; ils ne prouvent pas à eux seuls la disponibilité continue d’une source ni l’existence d’un traitement backend.
