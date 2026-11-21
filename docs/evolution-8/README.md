# Evolution-8 — refonte MajestiOS

**Branche active :** `Evolution-8`  
**Branche de référence préservée :** `Evolution-7`  
**Base exacte :** `bed0dd637367b25780016c0013b24f2a9e452219`  
**Date de lancement :** 11 novembre 2026  
**Objet :** refonte produit et expérience vers le CRM tout-en-un MajestiOS.

## 1. Mission

Faire évoluer MajestiOS d'une plateforme principalement présentée comme outil de développement commercial vers un environnement intégré permettant à une entreprise de :

**développer son activité → gérer ses clients → organiser son travail → facturer → dématérialiser → être accompagnée.**

La formule de positionnement de travail est : **« MajestiOS — Le CRM tout-en-un pour développer, gérer et faire grandir son entreprise. »** La revendication « premier vrai CRM tout-en-un » reste une ambition de communication, pas une affirmation concurrentielle vérifiée.

## 2. Références de départ

Lire avant tout lot :
1. [Audit de l'existant Evolution-7](../evolution-7/AUDIT-EXISTANT-PREPARATION-EVOLUTION-8-2026-11-11.md)
2. [Vision produit CRM tout-en-un](../evolution-7/VISION-PRODUIT-CRM-TOUT-EN-UN-PREPARATION-EVOLUTION-8.md)
3. [Registre des anomalies Evolution-8](REGISTRE-ANOMALIES-EVOLUTION-8.md)
4. [Architecture cible CRM tout-en-un](ARCHITECTURE-CIBLE-CRM-TOUT-EN-UN.md)
5. [Plan de refonte UX](PLAN-REFONTE-UX.md)
6. [Décisions de navigation Evolution-7](../evolution-7/REFONTE-GLOBALE-NAVIGATION-CHATBOT-2026-11-09.md)

Evolution-7 est conservée comme base d'audit et de retour. Aucun commit ne doit y être ajouté dans le cadre de la refonte Evolution-8.

## 3. Règles de travail

- Travailler exclusivement sur `Evolution-8`.
- Préserver `Evolution-7`, `main` et les branches historiques.
- Ne pas modifier les projets Supabase distants, les migrations appliquées, les politiques RLS, les paramètres Auth ou les secrets sans autorisation explicite distincte.
- Ne pas promouvoir ni déployer manuellement en production. Les déploiements Evolution-8 doivent rester des previews Vercel.
- Préserver les pages, routes, contenus, moteurs, filtres, formulaires et interactions existants jusqu'à inventaire des dépendances et tests de non-régression.
- Distinguer systématiquement vision, spécification, code présent, composant déployé et parcours recetté.
- Ne pas annoncer de facturation électronique, de connexion PA, de CRM client complet ou d'autonomie Cheexpeer tant que ces fonctions ne sont pas réalisées et testées.
- Chaque lot doit produire un diff limité, des tests, un état de validation et une mise à jour du registre.

## 4. Ordre de réalisation

| Lot | Objet | Résultat attendu |
|---|---|---|
| E8-00 | Base documentaire et risques | Référentiel Evolution-8, registre et architecture |
| E8-01 | Cartographie fonctionnelle et design system | Inventaire des pages, routes, composants et règles UX |
| E8-02 | Refonte de la vitrine | Promesse, accueil et navigation cohérents avec le CRM tout-en-un |
| E8-03 | Espace de travail client | Parcours et shell d'application, sans activer de fonctions backend non prêtes |
| E8-04 | CRM client natif | Modèle fonctionnel, prototype puis réalisation après validation sécurité |
| E8-05 | MajestiOS Facturation | Noyau métier, documents et flux à spécifier ; pas de transmission PA avant partenaire et tests |
| E8-06 | MajestiOS Connect | Contrats d'API et connecteurs CRM/PA |
| E8-07 | Cheexpeer transversal | Intégration progressive et validations humaines |
| E8-08 | Recette pilote | Tests multi-tenant, sécurité, UX, coûts, support et réversibilité |

## 5. Garde-fous de livraison

L'audit a confirmé une divergence de migrations Supabase (22 sur le projet utilisé par le site contre 38 sur le projet de test), l'absence de la fonction Edge de provisionnement membre sur les deux projets inspectés, une alerte RLS sur une table privée de test et l'absence de bucket Storage métier. Ces sujets sont suivis dans le registre Evolution-8.

Aucune refonte d'écran ne doit masquer ces risques. Les travaux d'interface peuvent avancer sur des données fictives clairement identifiées ou des composants non connectés, mais pas simuler un service opérationnel.


## 6. Avancement initial — 11 novembre 2026

| Lot | État | Preuve / limite |
|---|---|---|
| E8-00 — documentation et risques | **Réalisé** | Vision, audit, architecture cible, plan UX et registre Evolution-8 créés ; consignes de branche actualisées |
| E8-01 — cartographie et design system | **En cours** | Inventaire initial effectué ; direction visuelle et parcours décrits, validation utilisateur encore requise |
| E8-02 — vitrine et navigation | **Première itération construite** | Nouvelle page d'accueil, feuille de style Evolution-8, navigation transparente et sous-menus clairs ; moteur existant conservé ; nouvelle page facturation électronique accessible depuis Appels d'offres et Développement commercial |
| E8-03 à E8-08 | **Non démarrés** | Aucun nouveau CRM client, module de facturation, connecteur PA ou outil métier Cheexpeer n'est déclaré disponible |

**Prévisualisation Vercel Evolution-8 :** [majestios-git-evolution-8-majistr.vercel.app](https://majestios-git-evolution-8-majistr.vercel.app)

Le déploiement de prévisualisation correspondant au commit `f9f84e2e0dba4ec6f5b445160cebf848490961e9` est `READY`. Le build de la version incluant la page `facturation-electronique.html` est `READY` et confirme 81 fichiers copiés depuis `site-files.json` sans différence avec les sources. La prévisualisation reste non promue en production. Cette preuve valide le build et le manifeste, pas le rendu visuel ni les parcours navigateur. Le statut consulté pour le commit ne fournit pas de résultat GitHub Actions ; les tests navigateur et les tests multi-rôles restent à confirmer.

Aucun changement n'a été apporté à Supabase, aux données, aux fonctions Edge ou aux secrets. Aucun déploiement de production ni promotion Vercel n'a été effectué.


### Contrôle complémentaire — cohérence de navigation

Une incohérence entre le vérificateur d'architecture et le test navigateur a été corrigée : le menu Evolution-8 contient désormais 20 entrées secondaires réparties sur 18 destinations uniques. Le contrôle statique inclut également la page facturation électronique dans les routes obligatoires. Voir l'anomalie NAV-01 dans le registre. La correction est commise ; son passage CI doit encore être confirmé.
