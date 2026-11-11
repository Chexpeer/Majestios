# Evolution-9 — consolidation stratégique et assainissement MajestiOS

**Branche active :** `Evolution-9`  
**Branche de départ :** `Evolution-8`  
**Commit de départ :** `53a780e7f8c3817197611c4cb9948b3c544a90a5`  
**Date :** 11 novembre 2026  
**Mission :** corriger les régressions vérifiables, prévenir les erreurs récurrentes, consolider la documentation et transformer la vision MajestiOS en trajectoire de réalisation mesurable.

## 1. Intention

Evolution-9 ne doit pas être une nouvelle refonte graphique isolée. Elle doit rendre le projet plus cohérent, plus fiable et plus lisible pour le porteur du projet, les développeurs, les partenaires et les futurs utilisateurs.

L'ambition produit est : **MajestiOS — le CRM tout-en-un pour développer, gérer et faire grandir son entreprise.**  
La formule « le premier vrai CRM tout-en-un » exprime une ambition de différenciation ; elle ne doit pas être présentée comme une supériorité concurrentielle démontrée.

Le parcours de valeur devient :

**Détecter → Comprendre → Qualifier → Décider → Agir → Gérer → Facturer → Capitaliser.**

## 2. Références canoniques Evolution-9

Lire dans cet ordre :
1. [Vision stratégique MajestiOS 2026–2028](VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md)
2. [Plan de réalisation et moyens](PLAN-REALISATION-ET-MOYENS.md)
3. [Plan de synthèse documentaire](PLAN-SYNTHESE-DOCUMENTAIRE.md)
4. [Registre des anomalies Evolution-9](REGISTRE-ANOMALIES-EVOLUTION-9.md)
5. [Architecture cible CRM tout-en-un Evolution-8](../evolution-8/ARCHITECTURE-CIBLE-CRM-TOUT-EN-UN.md)
6. [Audit de l'existant établi sur Evolution-7](../evolution-7/AUDIT-EXISTANT-PREPARATION-EVOLUTION-8-2026-11-11.md)

Les documents datés Evolution-5 à Evolution-8 restent des preuves historiques et des sources de détail. Ils ne doivent pas être supprimés ni considérés automatiquement comme des décisions actuelles.

## 3. Règles de branche et de sécurité

- Travailler exclusivement sur `Evolution-9`.
- Préserver `Evolution-8`, `Evolution-7`, `main` et les branches historiques.
- Ne pas fusionner, rebaser, supprimer ou promouvoir une branche sans autorisation explicite.
- Ne pas modifier Supabase distant, ses migrations appliquées, ses politiques RLS, ses paramètres Auth, ses données ou ses secrets dans ce chantier documentaire et de fiabilisation sans validation spécifique.
- Ne pas déployer en production. Les déploiements autorisés pour Evolution-9 sont des prévisualisations.
- Ne jamais confondre code présent, code déployé, fonction connectée et parcours recetté.
- Ne jamais annoncer une fonction CRM client, facturation, PA ou autonomie Cheexpeer comme opérationnelle sans preuve de bout en bout.

## 4. Boucle obligatoire

**Détecter → Qualifier → Corriger → Tester → Comparer → Documenter → Enregistrer.**

Chaque anomalie doit avoir :
- un identifiant stable ;
- une description reproductible ;
- sa gravité et son périmètre d'impact ;
- une cause racine ou une hypothèse clairement identifiée ;
- une correction minimale et réversible ;
- un test de non-régression ;
- une preuve de commit et de résultat ;
- un statut honnête : ouvert, corrigé dans le code, déployé, recetté ou bloqué.

Une correction de code n'est pas une clôture. Un build Vercel réussi ne prouve ni les tests GitHub Actions, ni le rendu navigateur, ni la sécurité multi-tenant.

## 5. Lots de travail

| Lot | Objet | Livrable / critère |
|---|---|---|
| E9-00 | Reprise des anomalies | Revue du registre Evolution-7/8, tri des doublons, causes racines et priorités |
| E9-01 | Fiabilisation CI et build | Contrats alignés, fichiers de tests présents, vérifications de manifeste et de routes cohérentes |
| E9-02 | Audit transversal du site | Navigation, liens, formulaires, recherche, responsive, accessibilité et SEO |
| E9-03 | Audit CRM et Supabase | Parité des environnements, migrations, RLS, Auth, RPC, stockage, sauvegarde ; sans changement distant non autorisé |
| E9-04 | Audit Cheexpeer | Worker, outils, permissions, coûts, validations, mémoire gouvernée et limites réelles |
| E9-05 | Synthèse documentaire | Index court, vision canonique, architecture, feuille de route et archives reliées |
| E9-06 | Traduction en plan produit | Priorités, dépendances, critères d'acceptation, coûts et indicateurs |
| E9-07 | Prévisualisation et recette | Tests statiques, CI, navigateur, mobile/desktop et rapport des écarts |

## 6. État initial connu

- Evolution-8 a construit une première vitrine et une page d'information sur la facturation électronique.
- Le menu contient 20 entrées secondaires et 18 destinations uniques.
- L'anomalie NAV-01, qui laissait le vérificateur d'architecture sur les anciens nombres 18/17, a été corrigée sur Evolution-8 dans le commit `4f471c06e7bf5dbbf9c88339a2ea0ed23d2f03c8`.
- La correction a été documentée ; le build Vercel de prévisualisation du commit `53a780e7f8c3817197611c4cb9948b3c544a90a5` est READY et copie 81 fichiers.
- Ce build ne vaut pas preuve d'exécution des tests CI ou des tests navigateur.
- Les anomalies Supabase, Auth, multi-tenant et Cheexpeer listées dans les registres antérieurs restent ouvertes tant qu'elles n'ont pas reçu leurs preuves de clôture.
- Le projet Vercel actuellement relié au dépôt dans l'équipe consultée est `majestios`. Les anciens statuts de projets ou contextes ne doivent pas être confondus avec une connexion active.

## 7. Définition de terminé

Evolution-9 est prête à être évaluée lorsque :
1. les erreurs prioritaires ont été corrigées ou explicitement bloquées avec une raison ;
2. les contrôles automatisés pertinents sont verts, ou leurs limites sont expliquées ;
3. le site n'a pas perdu de routes, de fonctions ni de contenus utiles ;
4. les risques Supabase et Cheexpeer sont classés avec des plans de recette ;
5. la documentation stratégique est cohérente, concise et reliée aux spécifications détaillées ;
6. chaque promesse publique correspond à une capacité disponible ou est clairement présentée comme une ambition ;
7. aucune production ni donnée réelle n'a été modifiée par inadvertance.
