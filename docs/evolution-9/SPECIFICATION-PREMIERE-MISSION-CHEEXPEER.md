# Première mission Cheexpeer — diagnostic contrôlé du worker

**Branche :** Evolution-9  
**Date :** 11 novembre 2026  
**Version :** 1.0  
**Statut :** handler implémenté dans le dépôt ; registre désactivé ; parcours complet non déployé et non recetté.

## 1. Objectif

Livrer une première mission réelle, mais sans effet métier ni communication avec un tiers, afin de valider progressivement le cycle durable de Cheexpeer avant d'autoriser les connecteurs CRM, LinkedIn, Drive, SEO ou les outils de prospection.

**Nom technique :** `worker_self_check`  
**Libellé :** Diagnostic de disponibilité du worker  
**Autonomie :** A0 — observation technique uniquement  
**Effets métier :** aucun  
**Validation humaine :** obligatoire avant exécution  
**État d'activation initial :** désactivé dans le registre.

Cette mission vérifie le runtime Node, l'identité technique du worker, le format de l'URL Supabase et la validité du bail de la mission. Le succès de la requête au pont, nécessaire pour réclamer la mission, prouve également que le worker a pu joindre le pont à cet instant. Le diagnostic ne vérifie pas la santé générale de Supabase, les droits métier, la disponibilité de toutes les fonctions Edge ni l'isolation multi-tenant.

## 2. Déroulement fonctionnel cible

1. L'administrateur ouvre le futur centre de commande Cheexpeer et demande un diagnostic du worker.
2. L'API vérifie le JWT et identifie l'utilisateur côté serveur.
3. Le serveur vérifie que l'utilisateur est owner/admin de l'organisation cible. L'identifiant de l'acteur provient exclusivement de la session vérifiée ; il n'est jamais accepté depuis le navigateur.
4. Le serveur crée une mission `worker_self_check`, autonomie 0, effet `read`, avec approbation obligatoire et clé d'idempotence.
5. La mission apparaît en attente de validation. L'administrateur voit l'objectif, les contrôles, les limites et l'absence d'effet externe.
6. Après décision explicite, le worker ne peut réclamer la mission que si le registre autorise le type et si l'approbation est valide.
7. Le worker renouvelle le bail avant le diagnostic. Si le renouvellement échoue, il n'annonce aucun succès.
8. Le handler effectue les contrôles locaux bornés, sans lire ni modifier les données CRM, sans consulter des documents et sans contacter de tiers.
9. Le worker enregistre le résultat dans la mission et le journal append-only. Le statut final utilisé par le schéma SQL actuel est `succeeded`.
10. L'administrateur consulte le résultat, les horodatages, les événements et les limites. L'historique reste conservé dans les tables de mission et d'événements.

## 3. Contrat du résultat

Le handler retourne un objet structuré :

- `status` : `passed` ou `attention_required` ;
- `checks` : au plus quatre contrôles identifiés ;
- `external_effects` : toujours `false` ;
- `secrets_exposed` : toujours `false` ;
- `checked_at` : date UTC ISO ;
- `executor` : `cheexpeer-worker-self-check`.

Les contrôles portent sur :
- version majeure Node >= 22 ;
- présence et forme bornée de l'identité worker ;
- URL HTTPS sur un domaine Supabase attendu ;
- bail encore valide au moment du diagnostic.

Aucune valeur de secret, clé, token, contenu d'environnement ou URL avec identifiants ne doit être incluse dans le résultat ou les journaux.

Un contrôle en échec produit `attention_required` : la mission technique peut être terminée avec un diagnostic négatif, mais le tableau de bord ne doit pas afficher un état de disponibilité réussie.

## 4. Garde-fous

- L'entrée du handler est vide ; aucune instruction libre n'est interprétée.
- Le type de mission et le niveau A0 doivent correspondre exactement.
- Le registre SQL est préparé avec `enabled = false`, `requires_approval = true`, `autonomy_max = 0`, `effects = read`.
- Le handler renouvelle le bail et refuse de finaliser si la réservation n'est plus détenue.
- Les missions inconnues continuent d'être refusées par défaut.
- Aucun accès aux tables CRM ou aux documents client.
- Aucun email, publication, scraping, appel API tiers, écriture métier, dépense ou changement de droits.
- L'activation du registre ne peut intervenir qu'après revue du SQL, déploiement coordonné et recette contrôlée sur `MajestiOS-Test`.

Les écritures de cycle de vie (renouvellement du bail, résultat, statut et événements) sont des écritures techniques internes à la mission ; elles ne constituent pas une écriture métier dans les données des clients.

## 5. État technique vérifié dans Evolution-9

| Élément | État |
|---|---|
| Handler de diagnostic | Implémenté dans `services/cheexpeer-worker/src/index.mjs` et `policy.mjs` |
| Tests unitaires du résultat et des limites | Ajoutés |
| Contrat du renouvellement avant complétion | Test statique ajouté |
| Migration d'enregistrement du tool | Créée ; outil désactivé par défaut |
| CI worker sur Evolution-9 | Déclenchée par les changements worker, pont et migrations Cheexpeer |
| API authentifiée de création de mission | Absente |
| API authentifiée de décision d'approbation | Absente |
| API de consultation du statut et du résultat | Absente |
| Interface centre de commande reliée aux missions | Absente |
| Pont et worker déployés/coordonnés sur MajestiOS-Test | Non vérifié dans cette passe |
| Registre distant activé | Non ; aucune écriture distante effectuée |
| Recette bout en bout | Non exécutée |

## 6. Travaux bloquants avant la première exécution

### A. API d'orchestration authentifiée

Créer une Edge Function dédiée, distincte du pont worker :
- authentifier chaque requête avec le JWT utilisateur ;
- dériver `user_id` depuis le JWT vérifié ;
- vérifier membership et rôle owner/admin dans l'organisation ;
- créer la mission avec `worker_self_check`, A0 et approbation obligatoire ;
- générer/valider une clé d'idempotence ;
- retourner uniquement l'identifiant et le statut utiles.

Ne jamais réutiliser le secret partagé du worker comme authentification de l'administrateur.

### B. Approbation humaine

Créer un endpoint distinct qui :
- authentifie le JWT ;
- récupère l'organisation de la mission ;
- vérifie le rôle owner/admin dans cette organisation ;
- dérive `decision_by` du JWT vérifié côté serveur ;
- appelle la RPC privée de décision ;
- empêche toute falsification d'identité depuis le navigateur.

La RPC SQL actuelle est privée et réservée à `service_role` ; aucun endpoint utilisateur sûr n'est actuellement livré.

### C. Consultation / historique

Créer une lecture serveur limitée au tenant et au rôle autorisé pour exposer :
- état, demande, objectif, dates et résultat ;
- décision et note d'approbation ;
- événements utiles du journal ;
- codes d'erreur compréhensibles et limites.

Ne jamais exposer les secrets, payloads internes inutiles, clés de service ou détails d'autres organisations.

### D. Déploiement et recette

Sur `MajestiOS-Test` uniquement, après autorisation ciblée :
1. comparer l'état distant aux migrations versionnées ;
2. sauvegarder et appliquer les migrations revues ;
3. déployer l'API et le pont avec les secrets dans le gestionnaire adapté ;
4. installer le worker dans un hébergement dédié ;
5. laisser le registre désactivé pendant les contrôles d'accès ;
6. exécuter les tests owner/admin, member, utilisateur externe et inter-organisations ;
7. activer le seul outil `worker_self_check` après validation ;
8. soumettre une mission, approuver, exécuter, consulter et vérifier les événements ;
9. tester doublon d'idempotence, bail expiré, worker arrêté, erreur du pont et résultat négatif ;
10. désactiver le tool et arrêter le worker en cas d'écart.

Aucune étape de cette section n'est réputée exécutée par la présence de code dans Git.

## 7. Écarts d'architecture à normaliser

- Le schéma SQL utilise `succeeded` comme statut final positif, alors que certains documents historiques parlent de `completed`. Pour Evolution-9, le contrat canonique de persistance est `succeeded`; l'interface pourra afficher « Terminée ».
- La table `cheexpeer_mission_steps` existe, mais le worker actuel ne réserve ni n'exécute les étapes. Cette première mission est donc atomique au niveau mission ; l'exécution multi-étapes ne doit pas être annoncée comme livrée.
- Le moteur ne possède pas encore d'API utilisateur de soumission, d'approbation et de consultation. Le pont actuel est réservé au worker serveur et ne doit pas devenir une API navigateur.

## 8. Critères d'acceptation

La première mission ne sera déclarée recettée que si :
- un owner/admin authentifié peut la soumettre et l'approuver dans sa propre organisation ;
- un member ne peut ni la soumettre si le périmètre est admin-only, ni l'approuver ;
- un utilisateur d'une autre organisation ne peut consulter ni approuver la mission ;
- les identifiants d'acteur envoyés par le client sont ignorés ou rejetés ;
- une double soumission avec la même clé ne crée pas deux missions ;
- seul le handler exact A0 est exécutable ;
- le worker renouvelle le bail avant le résultat ;
- le résultat est conservé et visible avec ses événements ;
- les secrets sont absents du résultat et des logs ;
- le diagnostic négatif n'est pas affiché comme une disponibilité réussie ;
- aucune donnée métier ni aucun service tiers n'a été modifié ou contacté.

**Décision de sécurité actuelle :** handler préparé, tool désactivé, aucune migration appliquée, aucune mission créée à distance, aucun worker ou pont activé par cette modification Git.


## 9. Écart runtime confirmé sur MajestiOS-Test — 11 novembre 2026

Le contrôle en lecture seule de la base de recette a confirmé que le socle privé d'exécution est présent, mais que le registre distant contient uniquement `test_executor` désactivé. La migration `20261111160000_cheexpeer_worker_self_check_tool.sql` n'apparaît pas dans le journal distant ; le dernier numéro de migration observé est `20261109205855`.

**Conséquence :** le handler `worker_self_check` présent dans Evolution-9 n'est pas encore enregistré dans le registre de cette base. Il ne peut donc pas être considéré comme disponible ou exécutable dans l'environnement distant.

La revue a également confirmé l'absence des API utilisateur authentifiées de soumission, décision d'approbation et consultation. La RPC de décision est réservée à `service_role` : l'identité de l'approbateur doit être dérivée du JWT vérifié par une future API serveur, jamais d'un UUID transmis par le navigateur.

**Blocage inchangé :** aucune mission réelle, aucun worker, aucune migration supplémentaire et aucune activation du registre avant réconciliation dépôt/base, livraison des API et recette owner/admin/member/inter-organisation. Le pont worker reste serveur-à-serveur.
