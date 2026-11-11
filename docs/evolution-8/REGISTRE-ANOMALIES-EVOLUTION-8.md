# Registre des anomalies — Evolution-8

**Branche :** `Evolution-8`  
**Date de reprise :** 11 novembre 2026  
**Source historique :** [registre détaillé Evolution-7](../evolution-7/REGISTRE-ANOMALIES-PRIORITAIRES-2026-11-09.md)  
**Audit courant :** [audit de l'existant](../evolution-7/AUDIT-EXISTANT-PREPARATION-EVOLUTION-8-2026-11-11.md)

Ce registre reprend les risques encore ouverts au démarrage d'Evolution-8. Il ne clôture aucune anomalie historique. Les preuves détaillées et les historiques restent dans le registre Evolution-7 jusqu'à leur reprise et leur validation explicite ici.

## 1. Priorités immédiates

| ID | Priorité | Domaine | Constat au 11 novembre 2026 | Statut / condition de sortie |
|---|---|---|---|---|
| AUTH-01 | **P0** | Auth OTP / espace membre | Le front invoque `provision-client-workspace` après OTP ; cette Edge Function n'est déployée sur aucun des deux projets Supabase inspectés. | **Bloqué.** Déployer en test après revue CORS/droits ; tester émission, validation, expiration, limites, provisionnement et isolation avant ouverture. |
| AN-04 | **P1** | Parité Supabase | `majestios-crm` (cible du frontend) a 22 migrations ; `MajestiOS-Test` en a 38. | **Bloquant avant synchronisation.** Comparer ledger, SQL, schémas, fonctions et données ; plan de retour arrière obligatoire. |
| AN-14 | **P1 — avis critique Supabase** | RLS / table privée | RLS désactivée sur `private.reputation_audit_usage` dans `MajestiOS-Test`. Les privilèges directs anon/authenticated observés ne donnaient pas accès en lecture/écriture, mais l'avis Supabase reste critique. | **Ouvert.** Vérifier l'exposition du schéma, définir les politiques puis tester accès autorisés et interdits. Ne pas activer RLS sans politique adaptée. |
| AN-07 | **P1** | Authentification | La protection contre les mots de passe compromis est désactivée sur le projet Supabase utilisé par le site. | **Ouvert.** Arbitrer et activer après recette du parcours Auth. |
| AN-06 | **P1** | Exécution Cheexpeer | Le worker de test ne traite que `readiness_probe`; le pont `cheexpeer-worker-bridge` et le worker conteneurisé ne sont pas déployés ; aucun outil métier n'est activé. | **Non opérationnel métier.** Parité des environnements, déploiement contrôlé et tests requis. |
| AN-02 | **P1** | RLS / multi-tenant | Les tests présents sont principalement des tests de contrat statiques ; les tests réels multi-identités et inter-organisations ne sont pas démontrés. | **Ouvert.** Ajouter des tests d'intégration avec sessions owner/admin/member et deux organisations. |
| AN-13 | **P1** | RPC CRM | `complete_crm_reminder` est SECURITY DEFINER et callable par authenticated sur test ; le code vérifie `private.is_org_admin()`, mais les tests réels par rôle manquent. | **À recetter.** Vérifier refus member et succès owner/admin via appel RPC direct. |
| AN-05 | **P1** | Dépôt public | Le dépôt est public et une fonction d'initialisation contient un identifiant administrateur codé en dur. | **Décision requise.** Examiner l'exposition, externaliser l'autorisation et revoir la publication des détails sensibles. |
| AN-10 | **P1** | Sauvegardes | Le workflow de sauvegarde est manuel ; Auth, paramètres de projet, secrets et fichiers Storage ne sont pas inclus dans l'archive SQL. | **Ouvert.** Définir une sauvegarde complète et une recette de restauration. |

## 2. Risques complémentaires repris

| ID | Priorité | Sujet | État |
|---|---|---|---|
| AUTH-02 | P1 | Preuve de prise de connaissance et métadonnées de consentement | Contrôle serveur et preuve juridique à compléter |
| CRM-02 | P1 | Journalisation atomique des créations CRM | Migration présente dans Git ; parité et recette distante à vérifier |
| CRM-03 | P1 | Privilèges UPDATE par colonnes | Migration présente dans Git ; privilèges distants à vérifier |
| CRM-04 | P1 | Contrôle du RPC de relance | Tests multi-rôles à effectuer |
| CRM-05 | P1 | Cohérence relationnelle et unicité SIRET | Migration et données préexistantes à vérifier |
| CRM-06 | P0 conditionnel | Frontière VIP de l'import officiel | Ne pas activer l'import privilégié avant migration et recette |
| CHEEXPEER-01 à 04 | P1 | Autorisations, quotas, identité des entreprises et garde-fous d'instructions | Déploiement, limites et tests réels à démontrer |
| AN-08 | P2 | Recherche officielle, CORS, quotas et exposition des erreurs fournisseur | Revue sécurité à poursuivre |
| AN-09 | P2 | Réception des demandes publiques | Canal de réception et recette manquants |
| AN-11 | P3 | CSP, images et nettoyage des règles historiques | À traiter après inventaire des dépendances |

## 3. Lacunes produit — à ne pas confondre avec des bugs

- Aucun CRM client complet n'est déployé.
- Aucun module devis/factures/avoirs/règlements n'est opérationnel.
- Aucun partenaire PA n'est sélectionné ou connecté.
- Aucun connecteur universel de CRM externe n'est démontré.
- Aucun bucket Storage métier n'existe sur les deux projets inspectés.
- Le site ne présente pas encore le positionnement tout-en-un.
- Cheexpeer n'a pas d'outil métier activé et ne doit pas exécuter d'action externe.

Ces éléments relèvent de la feuille de route, sauf lorsqu'ils révèlent un risque technique ou une promesse publique inexacte.

## 4. Règles de clôture

Une anomalie n'est clôturée que si :
1. la correction est présente dans la branche Evolution-8 ;
2. les migrations ou fonctions nécessaires sont déployées dans l'environnement explicitement ciblé ;
3. les tests adaptés ont été exécutés ;
4. les rôles autorisés et interdits ont été vérifiés ;
5. la preuve, le commit et les limites sont enregistrés.

Aucune opération distante sensible n'est autorisée par le présent registre.


## 5. Anomalie détectée pendant la reprise — 11 novembre 2026

| ID | Priorité | Domaine | Constat | Correction / preuve | Statut |
|---|---|---|---|---|---|
| NAV-01 | **P1 — CI bloquante** | Contrat de navigation | Après l'ajout de la page facturation électronique dans deux familles de navigation, `navigation-tiroirs.js` expose 20 entrées secondaires et 18 destinations uniques, mais `verify-architecture.js` attendait encore 18 entrées et 17 destinations. Le test navigateur avait déjà été porté à 20/18 : les contrôles statiques et navigateur n'étaient plus cohérents. | Correction du vérificateur sur Evolution-8 : ajout de `facturation-electronique.html` aux routes requises ; attentes portées à 20 entrées et 18 destinations uniques. Commit : `4f471c06e7bf5dbbf9c88339a2ea0ed23d2f03c8`. | **Corrigé dans le code ; exécution CI après correction à confirmer.** Ne pas clôturer avant résultat vert du workflow. |

### Prévention ajoutée

- Les nombres attendus sont définis par le menu réellement configuré, et non par une ancienne version de la navigation.
- Toute nouvelle entrée de menu doit être ajoutée aux routes requises et aux tests navigateur dans le même lot.
- Le contrôle de publication vérifie que chaque destination existe et figure dans `site-files.json`.
- Le résultat du build Vercel ne remplace pas les tests de contrat ni les tests navigateur.
