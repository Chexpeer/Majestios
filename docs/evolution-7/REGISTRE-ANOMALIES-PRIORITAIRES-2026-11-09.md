# Registre des risques et anomalies — MajestiOS Evolution-7

**Date :** 9 novembre 2026  
**Branche :** `Evolution-7`

Ce document ne doit pas devenir une liste de toutes les fonctionnalités manquantes. Il distingue :
- **Anomalies / risques à traiter** : défauts constatés ou contrôles indispensables avant ouverture.
- **Évolutions produit** : capacités non encore prévues ou non développées ; elles relèvent de la feuille de route, pas d'une correction urgente.
- **Recettes à effectuer** : vérifications nécessitant un environnement réel et une autorisation.

## A. Anomalies et risques à traiter

| ID | Priorité | Domaine | Constat vérifié | Action / statut |
|---|---|---|---|---|
| AUTH-01 | **P0 — avant ouverture aux membres** | OTP / espace membre | Le front appelle `signInWithOtp()` et `verifyOtp()`, mais aucun test de bout en bout ne prouve l'envoi réel, la validation, l'expiration, les limites de débit et le provisionnement de l'espace. Le déploiement de `provision-client-workspace` en environnement de test n'est pas confirmé. | **À vérifier — recette E2E isolée.** Aucun changement Auth, migration, déploiement de fonction ou donnée de test dans Supabase métier sans autorisation. |
| CRM-02 | **P1 — traçabilité** | Création de fiches CRM | La fonction générique `create()` insère entreprises, contacts et opportunités sans créer d'activité historique. Les migrations inspectées ne montrent pas de journalisation automatique de ces créations. | **À corriger après choix technique.** Définir une écriture atomique ou une stratégie compensatoire et tester les créations et imports. |

## B. Évolutions produit — hors registre des erreurs

Ces éléments sont des limites ou des fonctions non développées, pas des défauts de code à corriger immédiatement. Ils restent dans la feuille de route.

| ID de suivi | Domaine | État actuel | Évolution éventuelle |
|---|---|---|---|
| ROADMAP-01 | Contact | Formulaire explicitement en mode prévisualisation ; aucun envoi annoncé. | Activer un canal de réception lorsque la destination est décidée et autorisée. |
| ROADMAP-02 | Candidatures | La page indique que le dépôt de CV n'est pas ouvert. | Concevoir un parcours de candidature et un stockage sécurisé si cette fonction est retenue. |
| ROADMAP-03 | Circulation vers CRM | Import manuel DINUM depuis le CRM présent ; transferts BOAMP/BODACC et prospection publique vers CRM non démontrés. | Étudier des actions d'import avec revue humaine, provenance et anti-doublon. |
| ROADMAP-04 | Couverture BODACC | Le moteur traite jusqu'à 100 annonces récentes sans pagination dans ce parcours. | Étudier pagination et filtres serveur selon les besoins métier. |
| ROADMAP-05 | Résultats mixtes | Le plafond actuel répartit 10 résultats, soit 5 maximum par source. | Étudier pagination ou chargement progressif. |
| ROADMAP-06 | Familles privées | Immobilier, emploi et sous-traitance sont déclarés non connectés et renvoient un état d'indisponibilité. | Connecter des sources adaptées ou maintenir un affichage explicite « à venir ». |

## C. Détail de la recette AUTH-01

Le code de `auth-espace-membre.js` appelle Supabase Auth pour demander et vérifier un code à six chiffres. Le test `tests/auth-espace-membre-otp.test.cjs` est un test de contrat statique : il vérifie la présence des appels et des éléments de formulaire, pas l'envoi effectif d'un e-mail ni la validation contre un service Auth réel.

La documentation `docs/evolution-6/AUTHENTIFICATION-OTP-ESPACE-MEMBRE-2026-11-09.md` indique qu'il reste à faire : test d'intégration Supabase local, vérification du modèle e-mail et des paramètres OTP distants, déploiement de la fonction de provisionnement en environnement de test, tests Auth/RLS multi-identités et validation avant activation métier.

**Décision :** ne pas annoncer le système OTP comme opérationnel tant que ces critères ne sont pas validés. Ne pas modifier la configuration Auth, appliquer de migration, déployer de fonction ni créer de données de test dans le projet Supabase métier sans autorisation explicite.

## D. Précision sur l'import CRM

Le contrôle de `crm-page.js` confirme un import manuel depuis le ciblage APE/NAF dans le poste CRM interne : sélection des candidats, contrôle SIREN/SIRET via `findBusinessesByIdentifiers`, puis appel à `MajestiosCRM.createBusiness`. La fiche conserve la source DINUM, les critères, les motifs et le statut `to_review`. Les doublons détectés sont refusés et les échecs sont remontés.

En revanche, `prospection-active.html` ne charge pas `crm-client.js`, et le moteur `opportunity-search.js` ne référence ni `MajestiosCRM`, ni `createOpportunity`, ni `createBusiness`. Les transferts directs des annonces BOAMP/BODACC vers le CRM ne sont donc pas démontrés.

## E. Règles de mise à jour

- N'ajouter au registre A que les défauts constatés ou risques bloquants.
- Mettre les nouvelles fonctionnalités et améliorations dans la feuille de route.
- Distinguer « présent dans le code », « testé automatiquement » et « validé en environnement réel ».
- Statuts de traitement : Ouvert, En cours, Corrigé à vérifier, Validé, Bloqué.
- Conserver commit, preuve et date pour chaque correction.
