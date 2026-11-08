# Audit de rapprochement Git / ledger / schéma Supabase — 8 novembre 2026

**Dépôt :** `Chexpeer/Majestios`  
**Branche :** `feature/crm-atomic-integration`  
**HEAD contrôlé :** `2a90e38f3cd1c4c6ee7ecb71f3407925842fb7e3`  
**Projet Supabase :** `majestios-crm` — `qxaghcifdhugfskuscoc` — `eu-west-3`  
**Méthode :** lectures GitHub, ledger Supabase et catalogues PostgreSQL ; aucune écriture distante.

## 1. Conclusion exécutive

Le rapprochement confirme **21 entrées dans le ledger Supabase et 21 fichiers SQL dans Git**. Les noms conceptuels correspondent un à un, mais les 12 premières versions ne portent pas les mêmes préfixes temporels. Les neuf dernières versions sont identiques entre Git et le ledger.

L'inspection du schéma hébergé confirme la présence de nombreux effets attendus des migrations historiques : tables CRM, rôles et helpers, politiques d'accès, relances, index, triggers et tâche pg_cron. Cela constitue une preuve de compatibilité fonctionnelle de plusieurs changements, **pas une preuve d'identité octet pour octet des SQL historiques**.

Le rapprochement est donc **partiel, pas certifié**. Il n'est pas prudent de renommer les fichiers, de réparer le ledger ou d'appliquer des migrations.

## 2. Correspondance des 21 migrations

| Ledger Supabase | Fichier Git | Nom conceptuel | État |
|---|---|---|---|
| 20261107065846 | 20261105163901 | majestios_core_multitenant_foundation | Nom identique, version divergente |
| 20261107065848 | 20261105163922 | harden_private_authorization_and_fk_indexes | Nom identique, version divergente |
| 20261107065849 | 20261105163953 | enforce_tenant_relationship_integrity | Nom identique, version divergente |
| 20261107065851 | 20261105164403 | add_private_consent_records | Nom identique, version divergente |
| 20261107065854 | 20261105164411 | replace_consent_placeholder_with_privacy_acknowledgments | Nom identique, version divergente |
| 20261107065855 | 20261105164732 | harden_privacy_acknowledgment_access | Nom identique, version divergente |
| 20261107065858 | 20261106031500 | bootstrap_first_internal_admin | Nom identique, version divergente |
| 20261107065900 | 20261106074500 | enforce_crm_editor_roles | Nom identique, version divergente |
| 20261107065902 | 20261106090000 | atomic_client_workspace_provisioning | Nom identique, version divergente |
| 20261107065910 | 20261106100000 | persistent_crm_reminders | Nom identique, version divergente |
| 20261107065912 | 20261106110000 | sync_crm_reminder_lifecycle | Nom identique, version divergente |
| 20261107065914 | 20261106120000 | complete_crm_reminder_with_activity | Nom identique, version divergente |
| 20261107065916 | 20261107065916 | grant_crm_record_updates | Version identique |
| 20261107065932 | 20261107065932 | harden_crm_reminder_permissions_and_indexes | Version identique |
| 20261107065956 | 20261107065956 | official_company_registry_and_sources | Version identique |
| 20261107070006 | 20261107070006 | restrict_source_sync_run_visibility | Version identique |
| 20261107070144 | 20261107070144 | register_open_company_search_api | Version identique |
| 20261107070313 | 20261107070313 | atomic_official_company_import | Version identique |
| 20261107070340 | 20261107070340 | validate_official_import_identifiers | Version identique |
| 20261107070406 | 20261107070406 | harden_import_permission_and_sync_index | Version identique |
| 20261107070905 | 20261107070905 | expose_internal_admin_bootstrap_service_role_only | Version identique |

Les 21 fichiers sont présents dans l'arborescence de la branche. Les SHA Git des fichiers ont été relevés. Les 12 premiers fichiers contiennent plusieurs commentaires historiques indiquant « GitHub uniquement » ou « non appliquée en production », alors que le ledger hébergé contient une migration du même nom conceptuel. Ces commentaires sont donc à réconcilier avec l'historique réel ; ils ne doivent pas être considérés comme une preuve de non-déploiement.

## 3. Éléments de schéma confirmés en production

Lecture des catalogues PostgreSQL hébergés :

- 15 tables dans le schéma public, toutes avec RLS activée.
- Tables d'identité : organisations, profils, membres.
- CRM : entreprises, contacts, opportunités, activités, relances.
- Référentiel : registre entreprises, établissements, catalogue de sources, observations, exécutions de synchronisation.
- Tables de demande et de confidentialité présentes.
- Helpers observés : `private.is_org_member`, `private.is_org_editor`, `private.is_org_admin`, `private.is_internal_staff`.
- Fonction de provisionnement client `public.provision_client_workspace` présente.
- Fonction d'import atomique `public.import_official_company_record` présente.
- Fonction de matérialisation des relances présente.
- Triggers d'intégrité tenant et de synchronisation des relances présents.
- Tâche pg_cron `majestios-crm-reminders` active, exécutée toutes les cinq minutes.
- Index et contraintes de relances présents, dont unicité organisation/opportunité/échéance.
- Trois Edge Functions actives : recherche officielle, import officiel, bootstrap administrateur.

Ces observations montrent que plusieurs effets des migrations historiques sont bien présents dans la base. Elles ne permettent pas de prouver que chaque fichier Git est strictement le SQL qui a été exécuté à l'époque.

## 4. Écarts et risques qui ressortent de l'inspection

### 4.1 Visibilité des sources

Les politiques RLS hébergées autorisent actuellement tout utilisateur authentifié à lire :

- `official_data_sources` — catalogue des fournisseurs et connecteurs ;
- `company_source_observations` — observations contenant notamment URL, métadonnées et payload amont.

La politique de `official_source_sync_runs` refuse en revanche la lecture directe aux utilisateurs authentifiés.

Cette exposition est incompatible avec la doctrine produit selon laquelle les sources de Prospection restent invisibles. Le fait que les tables aient RLS activée ne suffit pas : une policy `USING (true)` rend leur contenu lisible par tous les utilisateurs authentifiés. Il faut concevoir un cloisonnement serveur/service-role et un DTO métier, puis faire valider séparément toute modification RLS. **Aucune correction n'a été appliquée dans cet audit.**

### 4.2 Métadonnées de provenance dans le CRM

Le schéma contient encore des colonnes de provenance comme `businesses.source_label`, `businesses.source_url`, ainsi que des champs équivalents sur les opportunités et contacts. Leur présence peut être justifiée pour la traçabilité interne, mais elles ne doivent pas être exposées dans les vues et réponses destinées aux membres si la règle d'invisibilité s'applique à ces écrans.

### 4.3 Authentification

L'advisor de sécurité Supabase signale que la protection contre les mots de passe compromis est désactivée. C'est un avertissement à traiter dans la configuration Auth, sans changement effectué ici.

### 4.4 Périmètre Administration

Les politiques observées confirment des droits organisationnels et un pouvoir interne limité sur le statut des demandes. Elles ne démontrent pas l'existence d'une matrice complète d'administration, d'attribution, de suspension et de délégation.

## 5. Ce qui est établi / ce qui ne l'est pas

### Établi

- 21 entrées de ledger.
- 21 fichiers Git.
- Correspondance univoque des noms conceptuels.
- 12 divergences de préfixes de version.
- Neuf versions identiques.
- Présence en production de nombreux objets structurants attendus.
- RLS activée sur les 15 tables publiques contrôlées.
- Policies d'accès au catalogue et aux observations de sources trop ouvertes au regard de la doctrine d'invisibilité.
- Aucune écriture distante pendant l'audit.

### Non établi

- Identité exacte du SQL de chacun des 12 couples historiques.
- Égalité complète des fonctions, triggers, index, contraintes, grants et policies avec un rejeu Git vierge.
- Équivalence exacte entre tous les objets locaux et hébergés.
- Absence de drift manuel hors migrations.
- Validation de bout en bout du parcours membre en production.

Le ledger Supabase expose les versions et noms, pas le contenu historique SQL exécuté. Pour certifier l'identité du SQL, il faut retrouver les artefacts originaux ayant servi aux déploiements (archives de migrations, commits, journaux de livraison ou sauvegarde de schéma), puis comparer les empreintes et le contenu. Les catalogues PostgreSQL ne remplacent pas cette preuve.

## 6. Décision technique recommandée

1. Ne pas renommer les 12 migrations historiques.
2. Ne pas lancer `db push`, `migration repair`, reset ou modification du ledger.
3. Archiver les sources SQL historiques authentiques si elles sont disponibles.
4. Produire un diff structuré local/production : colonnes, types, défauts, contraintes, index, fonctions et définitions, triggers, policies, grants, extensions et tâches cron.
5. Traiter séparément le problème d'exposition des tables de sources : conception de l'accès serveur et du DTO, tests, puis autorisation explicite avant toute migration distante.
6. Corriger les commentaires historiques des fichiers Git uniquement après preuve de leur statut réel ; ne pas transformer des commentaires ambigus en vérité de déploiement.

**Bilan :** l'état de la base est cohérent avec une grande partie du socle CRM documenté, mais la traçabilité des versions historiques n'est pas encore certifiée. Le prochain lot utile est un diff de définitions SQL ciblé, puis un plan de sécurisation de la visibilité des sources — toujours sans déploiement.
