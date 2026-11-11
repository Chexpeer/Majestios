# Dossier de suivi des anomalies critiques — MajestiOS

> **Point d'entrée obligatoire pour tout agent IA ou développeur intervenant sur MajestiOS.** Lire ce fichier avant toute modification, puis ouvrir le registre détaillé de la branche active.

## 1. Où trouver les informations

- **Registre détaillé Evolution-8 :** [REGISTRE-ANOMALIES-EVOLUTION-8.md](../evolution-8/REGISTRE-ANOMALIES-EVOLUTION-8.md)
- **Historique Evolution-7 :** [REGISTRE-ANOMALIES-PRIORITAIRES-2026-11-09.md](../evolution-7/REGISTRE-ANOMALIES-PRIORITAIRES-2026-11-09.md)
- **Consignes obligatoires des agents :** [AGENTS.md](../../AGENTS.md)
- **Index documentaire général :** [docs/README.md](../README.md)
- **Référentiel Evolution-8 :** [README.md](../evolution-8/README.md)
- **Audit de départ :** [AUDIT-EXISTANT-PREPARATION-EVOLUTION-8-2026-11-11.md](../evolution-7/AUDIT-EXISTANT-PREPARATION-EVOLUTION-8-2026-11-11.md)
- **Décisions de navigation héritées :** [REFONTE-GLOBALE-NAVIGATION-CHATBOT-2026-11-09.md](../evolution-7/REFONTE-GLOBALE-NAVIGATION-CHATBOT-2026-11-09.md)

Le registre Evolution-8 est la source de vérité pour les anomalies de la branche active. Le registre Evolution-7 reste l'historique de l'audit initial ; les identifiants hérités sont conservés et ne sont clôturés qu'après preuve.

## 2. Anomalies actuellement suivies

| ID | Priorité | Domaine | État connu | Règle de traitement |
|---|---|---|---|---|
| AUTH-01 | P0 — avant ouverture aux membres | Authentification OTP et provisionnement | **Recette E2E non démontrée** | Ne pas modifier Auth, migrations, fonctions déployées ou données Supabase métier sans autorisation explicite. |
| AUTH-02 | P1 — conformité / traçabilité | Preuve de prise de connaissance | **Ouvert — contrôle serveur incomplet** | Vérifier côté Edge Function les métadonnées et la version du consentement ; ne pas déployer sans autorisation. |
| CRM-02 | P1 — traçabilité | Journalisation des créations CRM | **Corrigé dans Evolution-7 — migration non appliquée** | Migration `20261109170000_atomic_crm_activity_history.sql` et test de contrat présents dans Git ; recette transactionnelle réelle encore requise. |
| CRM-03 | P1 — intégrité des données | Privilèges UPDATE des tables CRM | **Corrigé dans Evolution-7 — migration non appliquée** | Migration `20261109160000_restrict_crm_update_columns.sql` et test de non-régression ajoutés. Vérifier/appliquer uniquement après autorisation explicite ; ne pas prétendre que les privilèges distants sont déjà corrigés. |
| AN-14 | P1 — sécurité Supabase | RLS désactivée sur `private.reputation_audit_usage` dans `MajestiOS-Test` | **Ouvert — avis Supabase critique** | Vérifier l'exposition du schéma et définir les politiques avant d'activer RLS ; aucune modification distante effectuée. |

Les anomalies AUTH-01, AUTH-02, CRM-02 et CRM-03 sont héritées de l'audit Evolution-7 ; leurs statuts distants ne sont pas réputés validés par leur présence dans Git.

## 3. Règles obligatoires pour chaque agent

1. Identifier le dépôt, la branche et le commit HEAD ; travailler uniquement sur la branche explicitement autorisée.
2. Lire AGENTS.md, ce dossier, le registre détaillé et les décisions récentes liées au périmètre.
3. Vérifier le code actuel avant de reprendre un constat ancien : une anomalie peut avoir été corrigée depuis la dernière mise à jour du registre.
4. Qualifier chaque constat : anomalie confirmée ; évolution produit ; ou recette nécessitant un environnement, des identifiants, une source externe ou une autorisation.
5. Corriger au fur et à mesure uniquement les défauts dont la cause et la correction sont établies. Pour les risques de sécurité, d'authentification, de données ou de droits, arrêter avant toute opération sensible et demander l'autorisation nécessaire.
6. Après chaque correction : ajouter ou ajuster un test pertinent, exécuter les contrôles réellement disponibles, examiner le diff et noter les limites.
7. Mettre à jour le registre détaillé avec l'ID, la priorité, le constat, la preuve, le statut, les fichiers, le commit et les tests.
8. Ne jamais présenter un test statique comme une recette réelle, un déploiement Preview comme une mise en production, ni une fonctionnalité prévue comme opérationnelle.

## 4. Statuts normalisés

- **Ouvert** : anomalie confirmée, non corrigée.
- **En cours** : analyse ou correction commencée.
- **Corrigé à vérifier** : modification effectuée, preuve de validation insuffisante.
- **Validé** : correction et critères de non-régression vérifiés.
- **Bloqué** : une autorisation, un accès, une dépendance ou un environnement manque.

## 5. Autorisations et périmètre de sécurité

Sauf autorisation explicite du porteur du projet, aucun agent ne doit :
- fusionner une branche ou modifier main ;
- déployer ou promouvoir en production ;
- modifier la configuration, les politiques, les migrations ou les données Supabase métier ;
- changer les habilitations, les rôles ou les règles RLS ;
- supprimer une page, une fonctionnalité, une ressource ou une sauvegarde sans analyse de dépendances et point de retour.

## 6. Dernière actualisation

**Dernière actualisation :** 11 novembre 2026 — l'audit initial et le registre détaillé Evolution-7 ont été repris dans Evolution-8. La convention worker est harmonisée dans Git sur `CHEEXPEER_*` ; les déclencheurs CI anti-régression couvrent désormais Evolution-7 et le test d'accès interne. Les contrôles sont réussis sur le commit de migration testé `fa66a8de` : worker [42844050029](https://github.com/Chexpeer/Majestios/actions/runs/42844050029), anti-régression [42844049859](https://github.com/Chexpeer/Majestios/actions/runs/42844049859) et site [42844049806](https://github.com/Chexpeer/Majestios/actions/runs/42844049806). Le worker et son pont Edge restent non déployés selon la documentation ; aucun secret distant ni outil métier n'est activé par ces changements. AUTH-01 est confirmé bloquant : `provision-client-workspace` n'est déployée sur aucun des deux projets Supabase inspectés. AN-04 précise l'écart de 22 migrations sur `majestios-crm` contre 38 sur `MajestiOS-Test` ; AN-06 confirme que le worker test reste limité à `readiness_probe` et que le pont n'est pas déployé ; AN-07 confirme l'alerte de protection des mots de passe compromis sur le projet utilisé par le site ; AN-13 reste soumis à des tests multi-rôles ; AN-14 ajoute l'alerte RLS critique sur `private.reputation_audit_usage`. Aucune action distante n'a été effectuée.
**Branche de travail autorisée dans le chantier en cours :** Evolution-8. Evolution-7 reste préservée comme base d'audit.
**Règle :** actualiser ce point d'entrée et le registre détaillé à chaque évolution significative des anomalies critiques.
