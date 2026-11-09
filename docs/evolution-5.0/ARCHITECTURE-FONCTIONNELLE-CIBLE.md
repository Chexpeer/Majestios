# Architecture fonctionnelle cible — MajestiOS 5.0

## 1. Statut

MajestiOS est la plateforme : elle porte les rubriques, les services, le CRM, les données, les utilisateurs, l'administration et les règles métier. Cheexpeer est l'agent IA transversal intégré à cette plateforme ; il intervient au travers des services et capacités autorisés, sans se substituer à l'administration, au CRM ou aux règles métier. Cette architecture fonctionnelle est une cible ; le prototype ne démontre pas à lui seul que toutes ces capacités sont opérationnelles.

Ce document définit des domaines fonctionnels à étudier. Il ne choisit pas encore le fournisseur backend, la base de données, le moteur vectoriel, le framework frontend ou l'orchestrateur IA. Les décisions techniques seront prises après inventaire de la 3.0 et contre-audit indépendant.

## 2. Domaines fonctionnels

1. **Expérience et navigation** : panorama, immeuble, ascenseur, destinations, accessibilité, mobile.
2. **Recherche et opportunités** : taxonomie, sources publiques/privées, filtres, résultats, provenance et fraîcheur.
3. **Développement commercial** : qualification, identification, prospection, suivi des interactions et transformation.
4. **Accompagnement AO** : préparation, valorisation des compétences et références, aide à la réponse ; les fonctions d'appels d'offres restent accessibles même si elles ne sont plus un étage de premier niveau.
5. **Réseau, salons et séminaires** : mise en relation, événements, communautés et partenariats ; périmètres à clarifier.
6. **Réputation virtuelle** : visibilité locale, établissement, présence cartographique, avis et accompagnement, selon les API et conditions réelles. Cas d'usage à concevoir : à partir d'une création BODACC, rapprocher l'activité et l'adresse de l'entreprise, vérifier sa présence sur Google Maps et les informations/avis publics accessibles par des moyens autorisés, puis qualifier un éventuel besoin d'accompagnement visibilité. Toute prise de contact est préparée et soumise à validation humaine ; aucune prospection automatique par défaut.
7. **Offre commerciale CRM** : conseil, sélection, intégration et accompagnement de solutions CRM.
8. **CRM interne MajestiOS** : données commerciales propres à MajestiOS.
9. **CRM des clients** : données tierces cloisonnées et traitées selon mandat.
10. **Cheexpeer — agent IA transversal** : veille, recherche, analyse, qualification, synthèse, préparation d'actions et capitalisation contrôlée, au travers des services autorisés de MajestiOS.
11. **Business Intelligence** : indicateurs, analyses, tendances et aide à la décision.
12. **SEO et visibilité MajestiOS** : audit technique, indexation, contenu, veille, recommandations et mesure.
13. **Administration pilotée par l'IA** : cockpit interne, supervision technique et métier, qualité des données, SEO, maintenance, documentation, mémoire opérationnelle et préparation de tâches.
14. **Gouvernance et sécurité** : utilisateurs, rôles, permissions, journaux d'audit, coûts, conformité, approbations et contrôle des capacités d'action de l'IA.

La doctrine transversale, les rôles spécialisés et l'orchestration sont définis dans [VISION-IA-TRANSVERSALE.md](VISION-IA-TRANSVERSALE.md). Le détail du cockpit est défini dans [MODULE-ADMIN-IA.md](MODULE-ADMIN-IA.md).

## 3. Flux métier de référence

**Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser.**

Le flux doit être traçable : un signal externe n'est pas automatiquement un prospect qualifié ; une recommandation IA n'est pas une action exécutée ; un contact préparé n'est pas un message envoyé.

## 4. Principes de données

- Identifiants stables pour entreprises, établissements, contacts, opportunités et activités.
- Séparation entre données sources, données normalisées, enrichissements et inférences IA.
- Provenance, date de collecte, fraîcheur et statut de vérification.
- Déduplication explicable et résolution d'identité avec seuils de confiance.
- Historique des changements et audit des opérations.
- Cloisonnement tenant / entreprise / utilisateur / rôle.
- Règles de conservation et suppression propagées aux index et données dérivées.
- Minimisation et accès au strict nécessaire.

## 5. Responsabilités IA / logique déterministe

La logique déterministe reste responsable des permissions, règles métier explicites, calculs reproductibles, transitions d'état, validation des schémas et exécution d'actions.

L'IA peut assister la compréhension du langage, la classification, l'extraction, le rapprochement probabiliste, la synthèse, la priorisation et la préparation d'actions. Ses sorties doivent être contrôlées avant toute écriture sensible.

## 6. Intégrations et frontières

Les connecteurs externes doivent être isolés derrière des adaptateurs. Chaque source possède :
- un contrat et une version ;
- des quotas et limites ;
- des règles de cache et de rafraîchissement ;
- une provenance ;
- une gestion des erreurs et indisponibilités ;
- une revue de licence et de conditions d'utilisation.

Les intégrations de fournisseurs IA sont également isolées. Les secrets sont côté serveur. Les données transmises sont minimisées et adaptées au fournisseur.

## 7. Questions d'architecture à instruire

- Monolithe modulaire ou services séparés ?
- Backend et hébergement adaptés au trafic et au niveau de confidentialité ?
- Base relationnelle et éventuelle recherche vectorielle ?
- Authentification, SSO, rôles et multi-tenant ?
- File de tâches et traitements asynchrones ?
- Stockage des conversations, indexation et rétention ?
- Observabilité, tests, sauvegardes, restauration et reprise après incident ?
- Stratégie de coûts et de limites par modèle IA ?
- Intégration CRM tiers ou CRM natif hybride ?

## 8. Conditions avant données réelles

Aucune conversation sensible, donnée CRM client ou donnée personnelle à grande échelle ne doit être collectée avant validation de l'identité, des autorisations, des finalités, de la conservation, du cloisonnement, de la sécurité, des contrats fournisseurs et du processus de suppression.

## Moteur de recherche transversal — composant unique

Le moteur de recherche est un composant transversal unique. La page d’accueil constitue la référence fonctionnelle et visuelle. Toutes les pages de rubrique réutilisent le même formulaire, les mêmes identifiants de champs, les mêmes interactions, le même catalogue de catégories et de départements, le même traitement de soumission et le même habillage. Aucun moteur local ou formulaire alternatif ne doit être créé par rubrique.

Le parcours est identique partout : (1) saisie du mot-clé ; (2) révélation du type de marché au focus ; (3) révélation des catégories adaptées au type choisi ; (4) révélation du département après le choix de catégorie ; (5) soumission vers les résultats dédiés. Le contexte de la rubrique peut guider le texte d’introduction, mais ne verrouille pas le type de marché et ne modifie pas le parcours commun.

Critères d’acceptation : mêmes champs et identifiants sur l’accueil et les rubriques ; mêmes étapes progressives ; mêmes catégories publiques BOAMP et privées BODACC/immobilier/emploi/sous-traitance ; mêmes départements ; mêmes règles de sources connectées ou à connecter ; mêmes paramètres transmis aux pages de résultats ; contrôles navigateur sur plusieurs rubriques desktop et mobile. Toute évolution du moteur doit être faite une fois dans le composant commun, puis vérifiée sur toutes les destinations.
