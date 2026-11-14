# Journal Evolution-9 — corrections techniques et dossiers consignés (13 novembre 2026)

Archive déplacée depuis `docs/evolution-9/README.md` le 14 novembre 2026 pour alléger le référentiel. Contenu conservé ; l'état à jour est dans [la synthèse](../SYNTHESE-MAJESTIOS.md).

**Branche de test (14 novembre) :** une copie de travail, `test-ecriture-claude`, a reçu des évolutions du site autorisées explicitement (fonds par rubrique, navigation allégée à 17 entrées, BODACC, renvoi vers l'espace personnel). `Evolution-9` n'est pas modifiée. Écarts et trajectoire : [ETAT-REEL-SITE-ET-TRAJECTOIRE-2026-11-14.md](../evolution-9/ETAT-REEL-SITE-ET-TRAJECTOIRE-2026-11-14.md).

## 4. Corrections techniques du lot du 13 novembre

| Sujet | Correction | Preuve / limite |
|---|---|---|
| Ressource de build supprimée | Le blob Git exact de la ressource requise a été restauré depuis le parent du commit qui l'avait supprimée. | Build, vérificateur d'architecture et suite anti-régression réussis sur le SHA final `007c6c2` ; aucune recette visuelle exhaustive n'est revendiquée. |
| Géocodage par code postal | La regex de cinq chiffres de `company-targeting.js` a été corrigée ; le test vérifie maintenant le paramètre officiel `codePostal=72000`. | Test ciblé et workflow complet du site réussis sur le SHA final `007c6c2`. |
| Vérificateur d'architecture | Le motif de détection des sélecteurs CSS historiques a été corrigé pour interpréter les points et classes comme prévu. | `verify-architecture.js` passé dans les workflows anti-régression et site sur `007c6c2`. |
| CI anti-régression | Le workflow inclut désormais `Evolution-9` dans ses déclencheurs push et pull request. | Workflow anti-régression réussi sur le SHA final `007c6c2`. |
| Contrat Prospection | Le workflow de contrat déclenche aussi sur push Evolution-9. | Workflow de contrat réussi sur `26c1ef9` ; le workflow anti-régression final passe aussi sur `007c6c2`. |
| Syntaxe Edge | Le workflow principal vérifie aussi les trois fonctions Edge identifiées comme déployées dans l'audit : recherche officielle, import officiel et bootstrap admin. | Contrôle ajouté et workflow principal du site réussi sur le SHA final `007c6c2`. |

Aucun fichier HTML/CSS, libellé public, parcours, menu, donnée distante ou configuration Supabase n'a été modifié dans ce lot. La restauration de la ressource a rétabli le blob Git antérieur ; elle n'a pas créé un nouveau visuel.

## 5. Dossiers complexes consignés — aucune correction distante

| Sujet | État | Traitement requis |
|---|---|---|
| Triggers d'intégrité CRM en doublon | La chaîne de migrations crée deux noms de triggers par table ; l'état réel distant doit être revérifié. | Comparer migrations, triggers présents et fonctions appelées ; préparer une migration de nettoyage seulement après revue et autorisation. |
| Policies CRM et frontière VIP | Une migration retire les anciennes policies VIP et installe des policies tenant-scoped ; cela ne prouve pas à lui seul une exposition, mais exige une vérification des helpers et rôles. | Tester owner/admin/member et les refus inter-organisations sur les deux périmètres ; ne rien appliquer à distance. |
| Policy UPDATE de `crm_reminders` | Une policy UPDATE est créée puis le privilège UPDATE est révoqué pour `authenticated`. | Clarifier la règle attendue et la cohérence policy/GRANT ; ne pas réécrire les migrations historiques. |
| Bootstrap admin | Le code contient une adresse administrateur codée en dur et un CORS `*`. | Définir une configuration serveur et une liste d'origines autorisées sans risquer de verrouiller l'accès initial ; revue de sécurité avant modification. |
| Navigation statique et contenu | Les menus HTML historiques et certains libellés ne sont pas homogènes ; le contrôleur commun masque une partie des écarts. | Inventaire page par page et correction seulement après autorisation d'un lot site distinct. |
| Fichiers semblant orphelins | Des feuilles et scripts ne sont pas publiés ou chargés directement. | Tracer imports, chargements dynamiques, workflows et usages serveur avant toute suppression. |

Les constats, identifiants et critères de clôture sont consignés dans le [registre détaillé](../evolution-9/REGISTRE-ANOMALIES-EVOLUTION-9.md). Les constats Supabase de l'audit du 11 novembre sont datés : ils ne remplacent pas une nouvelle lecture des environnements.

## 6. État produit à ne pas embellir

- Le frontend est un site statique ; la présence d'un formulaire ou d'un module dans Git ne prouve pas son raccordement.
- Le CRM interne est distinct du futur CRM client multi-tenant.
- Les projets `majestios-crm` et `MajestiOS-Test` ont des rôles différents ; leurs migrations ne doivent pas être synchronisées mécaniquement.
- Le provisionnement OTP, la recette multi-tenant et les droits SQL du CRM principal ne sont pas réputés validés sans preuve de bout en bout.
- Le worker Cheexpeer et ses connecteurs doivent être décrits selon le code réellement déployé, pas seulement selon les fichiers Git.
- La facturation électronique et la connexion à une PA restent des cibles de phase ultérieure.

## 6 bis. Recontrôle Supabase du 13 novembre\n\n- `majestios-crm` : 22 migrations ; policies CRM VIP ; un trigger d'intégrité par table.\n- `MajestiOS-Test` : 39 migrations ; policies tenant-scoped ; doublons de triggers réels sur quatre tables.\n- Défaut P1 à traiter : le RPC `complete_crm_reminder` en production est SECURITY INVOKER, mais le rôle `authenticated` n'a pas UPDATE sur `crm_reminders`; la policy est en outre admin-only alors que le helper admet aussi member.\n- Advisor CRITICAL sur `private.reputation_audit_usage` sans RLS dans le projet de test ; aucun SELECT direct anon/authenticated n'a été observé, mais la défense en profondeur reste insuffisante.\n- Advisor WARN sur le RPC SECURITY DEFINER du projet de test et sur la protection des mots de passe compromis désactivée sur le projet principal.\n\nDétails et limites dans l'[audit comparatif du 13 novembre](../evolution-9/AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md#18-recontrôle-distant-comparatif--13-novembre-2026-lecture-seule). Aucun changement Supabase distant n'a été réalisé.\n\n