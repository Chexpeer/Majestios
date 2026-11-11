# Registre des anomalies — Evolution-9

**Branche :** `Evolution-9`  
**Base :** commit `53a780e7f8c3817197611c4cb9948b3c544a90a5` d'Evolution-8  
**Statut initial :** reprise et requalification en cours.

## 1. Règle

Une anomalie n'est clôturée que si la cause est comprise, la correction est présente sur Evolution-9, le test pertinent a été exécuté, le résultat est conservé et les limites restantes sont écrites. Un correctif de code seul n'est pas une preuve de recette.

## 2. Anomalies héritées prioritaires

| ID | Priorité | Domaine | Constat hérité | Statut initial sur Evolution-9 |
|---|---|---|---|---|
| AUTH-01 | P0 ciblé | OTP / provisionnement | Le code source `supabase/functions/provision-client-workspace/index.ts` et la migration RPC sont présents dans le dépôt ; la fonction n'était pas déployée sur les deux projets Supabase inspectés lors de l'audit Evolution-7. Le parcours OTP reste non recetté de bout en bout. | Ouvert — vérifier le déploiement actuel et réaliser une recette E2E avant ouverture des comptes |
| AUTH-02 | P1 | Consentement / preuve | La fonction de provisionnement vérifie `user_metadata.privacy_notice_acknowledged` et `privacy_notice_version`, données modifiables par l'utilisateur ; l'enregistrement actuel ne constitue pas à lui seul une preuve robuste d'un consentement recueilli. | Ouvert — concevoir un reçu serveur horodaté, versionné et traçable, puis tester le parcours et les règles de conservation |
| AN-04 | P1 | Parité Supabase | 22 migrations sur `majestios-crm` contre 38 sur `MajestiOS-Test` dans l'audit du 11 novembre | Ouvert — comparaison détaillée requise |
| AN-14 | P1 critique | RLS / schéma privé | Alerte RLS sur `private.reputation_audit_usage` dans le projet de test | Ouvert — vérifier exposition, privilèges et politiques |
| AN-07 | P1 | Auth | Protection contre les mots de passe compromis désactivée sur le projet utilisé par le site | Ouvert — arbitrage après recette OTP |
| AN-06 | P1 | Cheexpeer | Worker de test limité à `readiness_probe`, pont Edge et worker métier non déployés | Ouvert — non opérationnel métier |
| AN-02 | P1 | Multi-tenant | Tests réels owner/admin/member et inter-organisations non démontrés | Ouvert — tests d'intégration nécessaires |
| AN-13 | P1 | RPC CRM | `complete_crm_reminder` SECURITY DEFINER, recette réelle des rôles manquante | Ouvert — vérifier refus member et succès owner/admin |
| AN-05 | P1 | Dépôt public | Identifiant administrateur codé en dur dans une fonction d'initialisation | Ouvert — revue d'exposition et externalisation |
| AN-10 | P1 | Sauvegardes | Sauvegarde manuelle incomplète (Auth, paramètres, secrets, Storage non inclus) | Ouvert — définir et tester restauration |
| CRM-06 | P0 conditionnel | Import officiel VIP | Frontière VIP préparée dans le code, migration non appliquée et recette multi-rôles non démontrée | Bloqué avant activation de l'import privilégié |
| CHEEXPEER-01 à 04 | P1 | Agent IA | Appartenance, quotas, rapprochement entreprise, prompt injection et transparence ; déploiement/recette à vérifier | Ouverts selon preuves Evolution-7 |

Les constats proviennent des registres Evolution-7 et Evolution-8 ; ils doivent être revalidés sur le code et les environnements actuels avant toute correction ou clôture.

## 3. Anomalie corrigée dans la branche précédente

| ID | Priorité | Domaine | Cause | Correction Evolution-8 | Statut |
|---|---|---|---|---|---|
| NAV-01 | P1 CI | Navigation | Le menu comptait 20 entrées et 18 destinations uniques, mais `verify-architecture.js` attendait encore 18 et 17. | Vérificateur aligné, route facturation ajoutée ; commit `4f471c06e7bf5dbbf9c88339a2ea0ed23d2f03c8`. Build Vercel Evolution-8 READY sur commit ultérieur, 81 fichiers. | Code corrigé ; exécution du workflow GitHub Actions après correction non confirmée. Rejouer le contrôle sur Evolution-9. |

## 4. Risques préventifs à contrôler

- branche, SHA et projet Vercel explicitement vérifiés avant chaque build ;
- un seul projet Vercel relié au dépôt pour la cible de travail, anciens projets non réactivés par erreur ;
- manifeste de publication et routes cohérents ;
- tous les fichiers de tests référencés par les workflows présents ;
- compteurs des menus synchronisés entre contrôles statiques et tests navigateur ;
- scripts Node et Edge Functions validés avec la version Node attendue ;
- secrets absents du dépôt et du navigateur ;
- aucune migration distante sans comparaison, revue et retour arrière ;
- aucune fonction métier déclarée opérationnelle sans preuve de déploiement et recette ;
- liens Markdown et liens HTML vérifiés après synthèse documentaire ;
- aucun document stratégique ne masque une anomalie critique.

## 5. Contrôle documentaire ajouté

Le script `verify-doc-links.js` vérifie les liens locaux des documents canoniques (README, AGENTS, index documentaire, registre critique et dossier Evolution-9). Il est appelé par le workflow `.github/workflows/verify-site.yml`. Son code et son intégration sont présents ; son exécution a été validée par GitHub Actions sur le commit `2438d8fd96f8e1d10676b8d193a5e99247096c67`.


## 6. Corrections réalisées dans Evolution-9 — 11 novembre 2026

| ID | Domaine | Cause constatée | Correction | Preuve |
|---|---|---|---|---|
| E9-CI-01 | Test navigateur | `tests/navigation-classique.browser.cjs` déclarait deux fois `devGroup` dans le même bloc, ce qui interrompait la vérification de syntaxe avant les tests. | Réutilisation de la variable déclarée dans le parcours desktop pour le parcours mobile. | Commit `c2d2e4d1c6bf18199a9bb80467b5f29d0e15696a` ; syntaxe passée ensuite. |
| E9-ARCH-01 | Contrat de page d'accueil | `verify-architecture.js` exigeait encore l'ancien titre SEO et des formulations retirées lors de la refonte. | Assertions alignées sur le titre CRM tout-en-un, la promesse actuelle et l'avertissement des exemples de démonstration. | Commits `b448d44d79b396fa9c9974f1acb506c767f90620` et `f799d217f637d89bda175abe390fe301544704b5` ; vérificateur passé ensuite. |
| E9-UX-01 | Contraste Accès VIP | Une règle CSS générale et une surcharge mobile imposaient un texte or/brun sur fond clair, malgré la signature prévue bleu nuit/or/chrome. | Couleur bleu nuit `#17324f`, filet or `#c5a45e`, fond transparent et repère chrome conservés ; surcharge mobile alignée. | Commits `8a93070600750cd4f112cfcddb73167fbaf8b31b`, `7f9e4f487ba2257fc7fac77dfb34d6e4e2c906b2` et `2438d8fd96f8e1d10676b8d193a5e99247096c67` ; test navigateur passé sur le dernier commit. |

**Validation globale :** GitHub Actions run `43010921140`, commit `f87cc16fa9c4c155b73483e2059a72c9f487ef31`, conclusion `success`. Le run précédent `43010656594` avait également réussi après les corrections de code. Les contrôles de syntaxe, tests unitaires, build, vérifications architecture/site/documentation, tests navigateur, BOAMP/BODACC et contrat de sécurité CRM ont réussi. Cela ne valide pas les migrations, politiques RLS ou parcours réels sur Supabase distant.

## 7. État de vérification

À l'ouverture de cette branche :
- les fichiers de tests appelés par `.github/workflows/verify-site.yml` ont été vérifiés présents par lecture GitHub ;
- le vérificateur de navigation Evolution-8 a été corrigé ;
- le build Vercel de prévisualisation Evolution-8 est READY ;
- la suite GitHub Actions complète a réussi sur le commit `2438d8fd96f8e1d10676b8d193a5e99247096c67` (run `43010656594`) ;
- les tests navigateur de navigation, recherche, Réputation virtuelle, contact et verrouillage sans session ont réussi dans ce run ;
- la recette réelle Supabase et les tests inter-organisations restent à confirmer.

Aucune donnée Supabase, migration distante, configuration Auth, secret ou production n'a été modifié dans cette reprise. Les vérifications de déploiement et de consentement restent en lecture seule.
