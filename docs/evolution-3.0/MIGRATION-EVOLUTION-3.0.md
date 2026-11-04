# Évolution 3.0 — Dossier de migration et décisions de cadrage

**Date :** 3 novembre 2026  
**Branche :** `evolution-3.0`  
**Base :** commit `6a609b3b83904032fee1c0bacb254529658520f5` de `evolution-2.0`  
**Statut :** migration documentaire initiale réalisée ; architecture proposée, arbitrages techniques à valider.

## 1. Objet

La branche `evolution-3.0` devient la branche de travail pour les évolutions critiques de MajestiOS. La branche `evolution-2.0` est conservée comme sauvegarde de référence et ne doit plus recevoir les évolutions de cette nouvelle étape.

La migration 3.0 poursuit la vision fonctionnelle de 2.0 et la complète par une architecture API cible, un modèle conceptuel, des événements métier, des règles de sécurité et une stratégie de migration du prototype.

## 2. Résultat de l'audit préalable

### 2.1 Intégrité des branches

Vérification GitHub du 3 novembre 2026 :

- `evolution-2.0` pointe sur `6a609b3b83904032fee1c0bacb254529658520f5`.
- `evolution-3.0` pointe sur le même commit.
- La comparaison des deux références renvoie `identical`, zéro commit d'écart et zéro fichier modifié.
- La branche 3.0 est donc une copie exacte de l'état 2.0 au moment de sa création.

### 2.2 État technique constaté dans l'audit 2.0

L'audit de phase 1 décrit notamment :

- prototype web statique HTML, CSS et JavaScript natif ;
- build Node.js et contrôles automatisés existants ;
- absence de serveur applicatif, base de données, persistance et authentification ;
- appels BOAMP, BODACC et Recherche d'Entreprises déclenchés depuis le navigateur ;
- CRM, Veille, Prospection, espaces clients et recherche documentaire principalement sous forme de pages de présentation ;
- absence de transmissions métier persistantes entre modules ;
- appels réels aux sources non vérifiés depuis l'environnement de l'audit, en raison de restrictions réseau ;
- tests de build, de structure et tests métier/navigateur décrits comme réussis après les corrections consignées dans l'audit.

Ces constats sont ceux du document d'audit daté ; ils doivent être revalidés avant toute migration de code.

### 2.3 Écarts majeurs à traiter

1. Aucune persistance ni référentiel CRM.
2. Pas d'identité, de rôles ni de cloisonnement client.
3. Pas de collecte serveur, de cache maîtrisé ou de journalisation des sources.
4. Pas de cycle complet de dépôt, modération et publication des annonces.
5. Pas de flux contrôlés Publication ↔ CRM ↔ Veille ↔ Prospection.
6. Pas d'historique des actions commerciales, d'opposition ou de désinscription.
7. Pas d'OpenAPI ni de contrats intermodules formalisés.
8. Pas de mécanisme événementiel ni de reprise sur erreur.

### 2.4 Limite documentaire identifiée

Le fichier Markdown synthétique `ARCHITECTURE-API-CIBLE.md` partagé par un lien Skype n'a pas pu être téléchargé dans l'environnement. Le dossier d'architecture 3.0 a donc été reconstruit à partir des documents effectivement présents dans le dépôt et des sept diagrammes proposés dans la conversation. Il ne faut pas le présenter comme une intégration fidèle ou une révision ligne à ligne du fichier externe. Le fichier source devra être ajouté au dépôt pour comparaison et rapprochement.

## 3. Décisions fonctionnelles reprises de 2.0

- Le CRM est le référentiel commercial central de MajestiOS.
- Les marchés publics servent aussi à détecter de nouveaux clients et des marchés de sous-traitance.
- Recherche publique initiale : BOAMP ; cinq catégories à sélectionner après mesure réelle des volumes, puis validation du porteur.
- Recherche privée BODACC : créations, ventes et cessions, modifications.
- Procédures collectives, radiations et immobilier exclus du périmètre initial du moteur.
- « Je publie mon annonce » reçoit emploi, sous-traitance, demande, offre et autres annonces professionnelles pertinentes.
- Les offres d'emploi affichées dans MajestiOS proviennent uniquement des utilisateurs et de l'équipe.
- Cadremploi, France Travail et APEC restent différés ; leur éventuelle consultation/cache et transmission à la Veille sera réexaminée plus tard.
- APE/NAF est un critère de présélection, pas une preuve de compétence ou de capacité.
- Publication, CRM, Veille et Prospection sont des circuits distincts.
- Toute transmission dépend de la provenance, de la finalité, des droits et d'une règle explicite.
- Le CRM interne MajestiOS est distinct des espaces clients. Aucun client ne voit le CRM interne ni les données d'un autre client.
- le corpus documentaire reste un périmètre documentaire indépendant, sans accès implicite au CRM.
- L'harmonisation graphique du prototype est conservée comme acquis ; aucune refonte visuelle n'est impliquée par ce dossier d'architecture.

## 4. Orientation technique 3.0

La proposition est de placer une API versionnée entre le frontend et les fonctions sensibles. Les adaptateurs de sources sont exécutés côté serveur. Les modules sont organisés en domaines fonctionnels avec des contrats explicites. Une architecture modulaire simple est privilégiée au départ ; la séparation en services déployés distincts n'est pas décidée.

Les données doivent être traçables, les transferts contrôlés, les événements idempotents et les permissions vérifiées côté serveur. Le modèle physique, le fournisseur d'identité, la base, le runtime, le stockage, la file d'événements et les coûts restent des décisions ouvertes.

Le détail est dans [Architecture API cible](ARCHITECTURE-API-CIBLE.md).

## 5. Diagrammes retenus

Le document d'architecture comprend les sept vues proposées et enrichies :

1. Architecture globale.
2. Flux métier principal.
3. Modèle conceptuel CRM et traçabilité.
4. Cycle de vie d'une annonce.
5. Flux Veille → CRM → Prospection.
6. Structure de l'API.
7. Architecture événementielle.

Les diagrammes représentent la cible et non des fonctionnalités existantes.

## 6. Plan de migration proposé

| Lot | Objet | Résultat attendu | Garde-fou |
|---|---|---|---|
| 0 | Préserver et vérifier la référence | Build et tests de référence reproductibles | Ne pas altérer la sauvegarde 2.0 |
| 1 | Arbitrer architecture et sécurité | Choix techniques, contrats et rôles validés | Aucun choix technologique implicite |
| 2 | Socle API, identité, persistance | API isolée, permissions et audit | Tests négatifs d'accès obligatoires |
| 3 | Adaptateurs de sources | BOAMP/BODACC/entreprises côté serveur | Provenance, quotas, conditions et erreurs |
| 4 | CRM et événements | Référentiel, rapprochements, historique | Idempotence et revue humaine |
| 5 | Publication et espaces clients | Dépôt, modération, publication, tenant | Tests d'isolation inter-clients |
| 6 | Prospection active | Actions, relances, opposition, résultats | Vérification d'éligibilité avant action |
| 7 | Recherche documentaire et intégrations complémentaires | Corpus et interfaces autorisés | Aucun accès implicite aux données CRM |
| 8 | Validation et livraison | Tests complets, prévisualisation contrôlée | Production uniquement après autorisation |

Les lots ne sont pas une autorisation automatique de développer. Chaque changement de code doit rester dans le périmètre explicitement autorisé et respecter la gouvernance.

## 7. Arbitrages à obtenir avant implémentation

- Choix du backend, runtime et modèle d'hébergement.
- Choix de la base et stratégie de séparation multi-tenant.
- Choix du fournisseur d'identité et matrice des rôles.
- Modèle physique des données, déduplication et rétention.
- Conditions d'utilisation, quotas, cache et fréquence de collecte des sources.
- Cinq catégories BOAMP après mesure et validation.
- Identification des auteurs, modération, signalement, expiration et retrait des annonces.
- Champs publics, internes et confidentiels des annonces.
- Règles de transmission des annonces au CRM et à la Veille.
- Règles d'éligibilité, opposition et désinscription pour la prospection.
- Périmètre et permissions des corpus documentaires.
- Coûts, sauvegardes, restauration, observabilité et critères de mise en production.

## 8. Gouvernance des branches

- `evolution-2.0` : sauvegarde de référence, conservée sans évolution 3.0.
- `evolution-3.0` : branche de travail active pour cette étape.
- Pas de fusion, promotion, déploiement ou modification de configuration de production sans autorisation explicite.
- Toute intervention doit être précédée d'un audit adapté, limitée, vérifiée et documentée.

## 9. État de cette migration

**Réalisé :**
- audit documentaire et technique préalable à partir des fichiers accessibles de la branche 2.0 ;
- comparaison Git confirmant que la branche 3.0 était initialement identique à 2.0 ;
- création du dossier documentaire 3.0 ;
- formalisation de l'architecture cible et de ses sept diagrammes Mermaid ;
- mise à jour des points d'entrée documentaires pour orienter les agents vers 3.0.

**Non réalisé :**
- aucune migration de code applicatif ;
- aucune création de backend, API, base, authentification ou CRM ;
- aucun changement de catégorie ou de comportement du site ;
- aucun test d'exécution de l'architecture cible, puisqu'elle n'est pas implémentée ;
- aucun déploiement ni changement Vercel.

## 10. Références

- [Architecture API cible](ARCHITECTURE-API-CIBLE.md)
- [Cahier des charges fondateur 2.0](../evolution-2.0/CAHIER-DES-CHARGES-FONDATEUR.md)
- [Audit existant phase 1](../evolution-2.0/AUDIT-EXISTANT-PHASE-1.md)
- [Cartographie fonctionnelle des flux](../evolution-2.0/CARTOGRAPHIE-FONCTIONNELLE-FLUX.md)
- [Gouvernance des interventions](../evolution-2.0/GOUVERNANCE-INTERVENTIONS.md)
