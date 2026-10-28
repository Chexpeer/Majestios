# État des lieux initial et matrice de traçabilité — MajestiOS

- **Version :** 0.1
- **Date :** 27 octobre 2026
- **Branche examinée :** `architecture-v0-1`
- **Référence de départ :** commit `c932a3ff216eca2f4da219b397cd0f08768b60b6`
- **Statut :** inventaire documentaire initial — contrôles fonctionnels de bout en bout non exécutés dans cette étape

## 1. Objet et limites

Ce document établit un premier état des lieux à partir des fichiers présents dans la branche. Il ne constitue pas une certification de fonctionnement, de sécurité ou de conformité. Lorsqu'un test n'a pas été exécuté, le résultat est indiqué comme **non vérifié**.

Aucune modification du code applicatif n'a été effectuée pour établir cet inventaire. Aucun service de base de données n'a été connecté.

## 2. Inventaire technique initial

| Élément | Constat dans le dépôt | Statut initial | Suite nécessaire |
|---|---|---|---|
| Application Next.js | Pages et API présentes sous `src/app` | Présence constatée | Exécuter lint/build et parcours navigateur |
| Ancienne application statique | `index.html`, `app.js`, `build.js`, `styles.css` à la racine | Retirée de la branche assainie ; les commandes npm actives ciblent Next.js | Réexaminer uniquement si une dépendance explicite et documentée est découverte |
| Dépendances | Next.js, React, TypeScript, ESLint déclarés dans `package.json` | Présence constatée | Vérifier installation reproductible et compatibilité de l'environnement |
| Verrouillage npm | Aucun `package-lock.json` visible dans l'arborescence examinée | Écart constaté | Préparer un verrouillage reproductible dans une étape dédiée |
| CI GitHub Actions | Workflow qui installe, exécute lint et build | Présence constatée | Vérifier les exécutions réelles et compléter les tests fonctionnels |
| Tests métier dédiés | Aucun dossier de tests dédié identifié dans l'arborescence examinée | Non identifiés | Confirmer et ajouter des tests ciblés |
| Route de santé | Retourne le statut du prototype et `databaseConnected: false` | Réponse codée constatée | Tester la route dans un environnement exécuté |
| API BOAMP | Route `GET /api/opportunities` avec recherche, filtres, transformation des résultats et erreurs explicites | Implémentation présente ; fonctionnement réel non vérifié ici | Tests directs de bout en bout contre la source et l'interface |
| Formulaire de démonstration privé | Soumission locale avec message indiquant qu'aucun envoi n'a lieu | Comportement codé constaté | Tester la compréhension du message et l'accessibilité |
| Annonces privées | Cartes de présentation statiques, annoncées comme illustratives | Démonstration, pas un flux réel | Conserver un avertissement clair jusqu'à raccordement autorisé |
| Recrutement / candidatures | Pages et cartes présentes ; collecte connectée non attestée | Parcours de présentation | Ne pas annoncer de collecte réelle |
| Authentification / CRM persistant | Non attestés par les fichiers examinés | Non démontrés | À cadrer selon le périmètre MVP |
| Base de données | Aucune connexion opérationnelle attestée ; route santé indique false | Non connectée selon le code de santé | Ne pas introduire Supabase pour le moment |
| Mentions légales | Page présente avec contenu signalé comme à compléter/valider | Incomplète selon le contenu actuel | Audit juridique séparé avant exploitation réelle |

## 3. Matrice initiale exigence → réalisation → preuve

| ID | Exigence / objectif | Réalisation repérée | Fichier(s) de référence | Vérification à exécuter | Statut |
|---|---|---|---|---|---|
| TR-001 | Ne pas remplacer une erreur source par des données fictives | La route BOAMP renvoie une erreur et indique qu'aucun résultat de démonstration ne remplace la source | `src/app/api/opportunities/route.ts` | Simuler une source indisponible et vérifier API + interface | À vérifier |
| TR-002 | Permettre la recherche par mot-clé | Paramètre `q` transmis à l'API BOAMP | `src/app/api/opportunities/route.ts`, `src/app/page.tsx` | Tester plusieurs termes, accents, terme sans résultat | À vérifier |
| TR-003 | Filtrer par département sans élargissement silencieux | Validation du code département, erreur 400 si invalide | `src/app/api/opportunities/route.ts` | Tester 68, 2A, 2B, code ultramarin prévu et code invalide | À vérifier |
| TR-004 | Filtrer par type de marché | Valeurs Travaux, Services, Fournitures et filtre transmis à la source | `src/app/api/opportunities/route.ts` | Vérifier la syntaxe de requête, les champs retournés et les catégories réelles | À vérifier |
| TR-005 | Afficher un lien vers l'avis officiel | Utilise `url_avis` ou une URL de recherche de secours | `src/app/api/opportunities/route.ts` | Ouvrir plusieurs liens et confirmer qu'ils pointent vers l'avis attendu | À vérifier |
| TR-006 | Présenter la date limite et le statut avec prudence | Conversion des dates et indicateur `isOpen` calculé dans la route | `src/app/api/opportunities/route.ts`, `src/app/page.tsx` | Tester date seule, date avec heure, échéance du jour, attribution, annulation et valeur absente | À vérifier — point prioritaire |
| TR-007 | Ne pas présenter les annonces privées comme réelles | Bandeau d'exemples et avertissement visible | `src/app/page.tsx`, `src/app/appels-offres-prives/page.tsx` | Vérifier le rendu mobile/desktop et la compréhension des avertissements | À vérifier |
| TR-008 | Ne pas laisser croire qu'une demande de démonstration a été transmise | Message de confirmation précisant qu'aucune transmission n'a eu lieu | `src/app/page.tsx` | Tester le parcours et l'accessibilité du message | À vérifier |
| TR-009 | Distinguer fonctions disponibles et fonctions en développement | Plusieurs sections portent un statut « en développement » | `src/app/page.tsx`, pages dédiées | Revue éditoriale de cohérence sur toutes les pages | À vérifier |
| TR-010 | Construire de manière reproductible | CI exécute `npm install`, lint et build ; lockfile non repéré | `package.json`, `.github/workflows/ci.yml` | Ajouter/valider un lockfile, utiliser `npm ci`, contrôler build propre | Écart constaté |
| TR-011 | Éviter toute dépendance Supabase prématurée | Aucun package Supabase dans le `package.json` examiné ; un document README mentionne encore Supabase comme étape future | `package.json`, `README.md` | Maintenir Supabase hors périmètre et harmoniser la documentation lors d'une modification documentaire dédiée | Décision retenue |
| TR-012 | Préparer une architecture modulaire sans refonte risquée | Architecture et matrice de modèle documentées, code actuel encore limité | `docs/architecture/*` | Confronter les documents aux tomes de référence et aux usages du code | À analyser |
| TR-013 | Conserver une trace de chaque évolution | Feuille de route de traçabilité créée | `docs/architecture/FEUILLE_DE_ROUTE_EVOLUTIONS_ET_TRACABILITE_V0.1.md` | Tenir le journal lors de chaque changement | En place — processus à appliquer |

## 4. Points techniques à examiner en priorité

### P1 — Dates limites et qualification d'un avis ouvert

La route calcule l'ouverture avec une comparaison entre l'horodatage de la date limite et l'heure courante. Si la source fournit une date sans heure, l'interprétation JavaScript peut la placer au début de la journée. Le comportement exact doit être confirmé sur des réponses BOAMP réelles avant toute correction.

**Action :** constituer des exemples connus (échéance future, échéance aujourd'hui, échéance passée, annulation, attribution, date absente) et écrire les tests attendus avant de changer la règle.

### P2 — Catégories et champs de la source

La route applique une correspondance textuelle aux catégories et filtre de nouveau les éléments localement. Le schéma et les valeurs réelles doivent être vérifiés pour s'assurer que le filtrage ne supprime pas des résultats valides ou ne classe pas incorrectement un avis.

**Action :** relever des réponses réelles de l'API pour chaque catégorie et comparer la valeur source à la catégorie affichée.

### P3 — Volume et cohérence des résultats

La requête limite la source à 50 enregistrements. Le champ `meta.total` représente le nombre d'éléments conservés après le filtrage local, alors que `totalAvailable` vient du total annoncé par la source. Ces nombres peuvent donc représenter des périmètres différents.

**Action :** clarifier le sens des compteurs affichés ou renvoyés et documenter l'absence de pagination complète avant d'en promettre davantage.

### P4 — Reproductibilité de l'installation

Aucun fichier de verrouillage npm n'a été identifié dans l'arborescence examinée. Le workflow utilise `npm install`, ce qui ne garantit pas une installation identique à chaque exécution.

**Action :** produire et valider un fichier de verrouillage lors d'une étape dédiée, puis adapter la CI à `npm ci`. Vérifier le diff et le build avant de considérer ce point clos.

### P5 — Cohérence des documents

Le README évoque encore une étape future de confirmation d'un environnement Supabase, alors que la décision actuelle est de ne pas utiliser Supabase pour le moment.

**Action :** conserver cette contradiction comme tâche documentaire explicite ; ne pas lancer de configuration ou de migration Supabase.

## 5. Ordre de travail proposé après cet inventaire

1. Exécuter les contrôles de base dans un environnement de développement : lint et build.
2. Tester le connecteur BOAMP avec des cas réels et des cas limites, en priorité les dates et les catégories.
3. Formaliser les tests avant de modifier le comportement du connecteur.
4. Stabiliser l'installation reproductible.
5. Faire une revue de vocabulaire et de clarté de la vitrine sans modifier la logique métier dans la même intervention.
6. Confronter les documents d'architecture aux tomes de référence avant d'implémenter un nouveau module.
7. Cadrer le parcours Business comme une exigence distincte, sans formulaire présenté comme opérationnel avant que le traitement réel soit défini.

## 6. Journal initial

- **Date :** 27 octobre 2026
- **Action :** inventaire initial en lecture du dépôt et examen des fichiers clés.
- **Code applicatif modifié :** non.
- **Tests de bout en bout exécutés :** non.
- **Points retenus :** garder les fichiers historiques en place jusqu'à compréhension de leur rôle ; ne pas introduire Supabase ; tester en priorité le connecteur BOAMP ; documenter chaque changement.
- **Prochaine étape :** exécuter les contrôles de base si un environnement d'exécution du projet est disponible, puis préparer les premiers tests ciblés du connecteur.
