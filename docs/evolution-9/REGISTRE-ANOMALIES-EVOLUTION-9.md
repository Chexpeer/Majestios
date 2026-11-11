# Registre des anomalies — Evolution-9

**Branche :** `Evolution-9`  
**Base :** commit `53a780e7f8c3817197611c4cb9948b3c544a90a5` d'Evolution-8  
**Statut initial :** reprise et requalification en cours.

## 1. Règle

Une anomalie n'est clôturée que si la cause est comprise, la correction est présente sur Evolution-9, le test pertinent a été exécuté, le résultat est conservé et les limites restantes sont écrites. Un correctif de code seul n'est pas une preuve de recette.

## 2. Anomalies héritées prioritaires

| ID | Priorité | Domaine | Constat hérité | Statut initial sur Evolution-9 |
|---|---|---|---|---|
| AUTH-01 | P0 ciblé | OTP / provisionnement | `provision-client-workspace` appelée par le front mais absente des deux projets Supabase inspectés ; parcours OTP non recetté de bout en bout | Ouvert — blocage avant ouverture des comptes |
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

## 5. État de vérification

À l'ouverture de cette branche :
- les fichiers de tests appelés par `.github/workflows/verify-site.yml` ont été vérifiés présents par lecture GitHub ;
- le vérificateur de navigation Evolution-8 a été corrigé ;
- le build Vercel de prévisualisation Evolution-8 est READY ;
- les tests GitHub Actions post-correction, les tests navigateur et la recette Supabase restent à confirmer.

Aucune donnée Supabase, migration distante, configuration Auth, secret ou production n'a été modifié lors de l'ouverture de cette branche.
