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
4. [Spécification cible CRM, facturation et facturation électronique](SPECIFICATION-CIBLE-FACTURATION-CRM-ELECTRONIQUE.md)
5. [Registre des anomalies Evolution-9](REGISTRE-ANOMALIES-EVOLUTION-9.md)
6. [Architecture cible CRM tout-en-un Evolution-8](../evolution-8/ARCHITECTURE-CIBLE-CRM-TOUT-EN-UN.md)
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
- une vérification des liens locaux des documents canoniques via `node verify-doc-links.js` ;
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


## 8. Avancement documentaire — 11 novembre 2026

- Branche `Evolution-9` créée depuis le commit exact `53a780e7f8c3817197611c4cb9948b3c544a90a5` d'Evolution-8.
- Vision stratégique 2026–2028, plan de réalisation, plan de synthèse documentaire et registre d'anomalies créés.
- `docs/README.md` raccourci et réorganisé autour des références canoniques Evolution-9 ; les documents historiques restent conservés.
- `AGENTS.md` et le dossier central des anomalies critiques pointent désormais vers la branche active.
- Script `verify-doc-links.js` ajouté ; le workflow `verify-site.yml` l'exécute après les contrôles de site. Son exécution a réussi dans la suite GitHub Actions du commit `2438d8fd96f8e1d10676b8d193a5e99247096c67`.
- Aucun document historique n'a été supprimé ni déplacé.


## 10. Prévisualisation Evolution-9

**URL de prévisualisation de branche :** https://majestios-git-evolution-9-majistr.vercel.app

**Déploiement READY du commit testé :** https://majestios-l9b0ne1i9-majistr.vercel.app

Le déploiement de prévisualisation Vercel du commit `f87cc16fa9c4c155b73483e2059a72c9f487ef31` est `READY`. Le build confirme 81 fichiers copiés depuis `site-files.json` sans différence avec les sources. Le projet Vercel utilisé est `majestios`, seul projet relié au dépôt dans l'équipe consultée.

Cette prévisualisation confirme le build du site sur son commit source. La suite GitHub Actions a également réussi sur ce même commit `f87cc16fa9c4c155b73483e2059a72c9f487ef31`. Aucune promotion en production n'a été effectuée.


## 11. Audit CRM et Supabase — 11 novembre 2026

Le contrôle en lecture seule des deux projets Supabase, de la configuration frontend, des migrations, des tables/RLS, des fonctions Edge et des RPC est consigné dans [AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md](AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md). Le site pointe actuellement vers `majestios-crm` (22 migrations), tandis que `MajestiOS-Test` en possède 39 ; les environnements ne sont pas synchronisés. Aucun changement distant n'a été effectué.

**CI Evolution-9 :** run [43011364291](https://github.com/Chexpeer/Majestios/actions/runs/43011364291), commit `0c919df639cef0849508445e63c1f6aa6eb78f83`, conclusion `success`.


## 12. Clarification des environnements Supabase — 11 novembre 2026

`MajestiOS-Test` est l'environnement de test/recette et `majestios-crm` est le projet actuellement ciblé par le frontend. Leurs 39 et 22 migrations reflètent des périmètres différents ; cet écart n'est pas à corriger par synchronisation automatique. Le CRM du projet principal reste verrouillé VIP owner/admin ; le socle multi-tenant et le worker Cheexpeer en mode `readiness_probe` sont sur le projet de test. Voir l'addendum du rapport d'audit pour les droits RPC et les limites précises. Aucune écriture distante n'a été effectuée.

## 13. Points bloquants CRM confirmés — 11 novembre 2026

Le contrôle SQL des privilèges et triggers précise deux écarts sur le projet actuellement utilisé par le site (majestios-crm) : les droits UPDATE du rôle authenticated restent larges sur les colonnes des tables entreprises, contacts et opportunités ; les triggers d'historisation des modifications CRM ne sont pas présents. Les migrations de restriction des colonnes et d'historisation atomique sont donc à valider sur MajestiOS-Test avant toute promotion contrôlée. Ne pas les appliquer directement au projet principal sans revue, sauvegarde et autorisation.


## 14. Facturation intégrée au CRM — cadrage phase 2

La facturation est un domaine métier constitutif du CRM tout-en-un, préparé dès maintenant mais développé dans la deuxième phase. Le parcours cible relie devis, commande/prestation, facture, transmission électronique via PA partenaire, statuts/rejets, règlement et archivage.

Trois modes doivent être prévus : CRM natif MajestiOS, CRM/logiciel externe conservé par le client, ou mode hybride. Une source de référence est définie pour chaque catégorie de données afin d'éviter les doubles factures et les divergences. Le moteur de facturation reste indépendant de l'écran CRM et de tout partenaire PA particulier.

Référence fonctionnelle : [Spécification cible CRM, facturation et facturation électronique](SPECIFICATION-CIBLE-FACTURATION-CRM-ELECTRONIQUE.md). Cette cible n'est pas une capacité opérationnelle actuelle : aucun module de facturation connecté à une PA n'a été démontré lors de l'audit.

## 15. Protocole de recette CRM — préparé, non exécuté

Le protocole [PROTOCOLE-RECETTE-CRM-MAJESTIOS-TEST.md](PROTOCOLE-RECETTE-CRM-MAJESTIOS-TEST.md) définit les scénarios de recette sur `MajestiOS-Test` : rôles, création et relations CRM, historisation, relances, permissions SQL et isolation entre deux organisations. Il sépare les tests du CRM interne VIP de ceux du futur CRM client multi-tenant.

**Statut : préparé / NOT RUN.** Aucune donnée distante n'a été créée et aucune migration n'a été appliquée. L'exécution nécessite des identités synthétiques, la vérification préalable des objets réellement déployés et une validation explicite du plan d'écriture et de nettoyage.

## 16. Provisionnement des identités de recette CRM

La procédure [PROVISIONNEMENT-IDENTITES-RECETTE-CRM.md](PROVISIONNEMENT-IDENTITES-RECETTE-CRM.md) décrit la création Auth, les memberships administratifs et les garde-fous. L'intégration actuelle ne disposant pas d'une action Auth Admin, aucune identité n'est créée automatiquement et aucun contournement SQL de `auth.users` n'est admis.


## 17. Audit de non-régression Evolution-7

La référence fonctionnelle et visuelle reste Evolution-7. L'audit [AUDIT-NON-REGRESSION-FONCTIONNELLE-EVOLUTION-7.md](AUDIT-NON-REGRESSION-FONCTIONNELLE-EVOLUTION-7.md) documente la comparaison des fichiers, la restauration de l'accueil centré sur la recherche, l'harmonisation des menus, la matrice de conservation des rubriques et les preuves CI. La facturation électronique s'ajoute sans remplacer le socle existant. La recette visuelle page par page et la recette CRM multi-identités restent des conditions de clôture.
