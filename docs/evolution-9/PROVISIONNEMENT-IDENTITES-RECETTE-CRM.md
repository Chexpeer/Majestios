# Provisionnement des identités de recette CRM — Evolution-9

**Projet unique :** `MajestiOS-Test` — `qrlnnfjstoeliymxtkbk`  
**Branche documentaire :** `Evolution-9`  
**Statut :** procédure préparée ; aucun utilisateur ni tenant créé.

## 1. Pourquoi le provisionnement est séparé

La recette doit éprouver les politiques RLS avec de vraies identités Supabase Auth et de vrais JWT. Une insertion SQL directe dans `auth.users`, un JWT fabriqué, ou une simulation de `auth.uid()` ne constituent pas une recette d'authentification et risquent de masquer des défauts.

L'intégration Supabase disponible pour cette session permet la lecture SQL et les migrations, mais ne fournit pas d'action Auth Admin pour créer/inviter des utilisateurs. Le provisionnement des identités doit donc passer par le tableau de bord Supabase ou par un flux Admin API exécuté par le propriétaire du projet, sans transmettre de clé `service_role` dans le chat.

## 2. Comptes à préparer

Utiliser des adresses dédiées, contrôlées par le propriétaire du projet, et accessibles pour recevoir les liens de confirmation / connexion. Ne pas utiliser les adresses personnelles des clients ou les comptes de production.

| Compte | Organisation | Rôle | But |
|---|---|---|---|
| A-owner | RECETTE-E9-A | owner | droits complets tenant A |
| A-admin | RECETTE-E9-A | admin | vérifier l'administration A |
| A-member | RECETTE-E9-A | member | lecture/écriture tenant A |
| A-viewer | RECETTE-E9-A | viewer | lecture seule A |
| B-owner | RECETTE-E9-B | owner | tenant B indépendant |
| B-member | RECETTE-E9-B | member | vérifier l'isolation croisée |

Minimum de départ : A-owner, A-member, A-viewer, B-owner. A-admin et B-member complètent la matrice de rôles.

## 3. Création des identités Auth

Dans le tableau de bord du projet **MajestiOS-Test uniquement** :

1. ouvrir Authentication → Users ;
2. créer/inviter les comptes de test avec les adresses dédiées convenues ;
3. confirmer les comptes par le parcours normal de l'environnement ;
4. relever les UUID Auth générés (pas les mots de passe, tokens ou liens magiques) ;
5. vérifier qu'aucun compte n'est créé dans `majestios-crm`.

Ne jamais coller de clé `service_role`, mot de passe, access token, refresh token ou lien de connexion dans un ticket, un commit ou une conversation.

## 4. Création des organisations et memberships

Les tables `public.organizations` et `public.organization_members` ont RLS activée. Les politiques actuellement observées sont en lecture seule pour les membres ; elles ne permettent pas à un utilisateur de s'ajouter lui-même à une organisation. Le commentaire de table confirme que les memberships sont provisionnés par un flux administratif de confiance.

Après création Auth et validation explicite de la liste UUID, le provisionnement doit être exécuté par un administrateur du projet via SQL Editor (rôle postgres), dans une transaction unique et limitée à ces objets. Il devra :

- créer `RECETTE-E9-A` et `RECETTE-E9-B`, `kind='client'`, avec des slugs uniques ;
- insérer les memberships A/B selon la matrice ;
- créer les profils si aucun trigger Auth ne les crée automatiquement ;
- vérifier que chaque utilisateur appartient uniquement à l'organisation prévue ;
- vérifier les comptes, memberships et contraintes avant COMMIT ;
- utiliser ROLLBACK si une vérification échoue.

Le SQL définitif sera généré à partir des UUID réellement créés. Aucun UUID, email ou mot de passe ne doit être inventé dans le dépôt. Aucune requête de provisionnement ne doit être exécutée avant validation des identités et du récapitulatif des insertions.

## 5. Contrôles avant provisionnement

Contrôles en lecture seule déjà réalisés :

- projet cible : `qrlnnfjstoeliymxtkbk` ;
- 39 migrations appliquées au contrôle du 11 novembre 2026 ;
- une organisation interne existante, aucun membre ;
- aucune organisation client/partenaire ;
- tables CRM sans données de recette ;
- RLS activée sur organizations, organization_members, profiles et tables CRM contrôlées ;
- `can_read_crm_org` : tout membre d'un tenant non interne peut lire ; dans le tenant interne, owner/admin seulement ;
- `can_edit_crm_org` : owner/admin/member peuvent écrire dans un tenant non interne ; owner/admin seulement dans le tenant interne ;
- l'adhésion est nécessaire pour lire organisations et memberships ; aucune auto-adhésion n'est permise par les politiques observées.

## 6. Séquence de recette après provisionnement

1. authentifier chaque compte par le parcours normal ;
2. appeler les API avec chaque JWT utilisateur réel ;
3. vérifier les lectures/écritures autorisées pour chaque rôle ;
4. tenter les accès croisés A ↔ B sur des UUID connus ;
5. vérifier que viewer ne peut ni créer ni modifier ;
6. vérifier qu'un membre client ne peut ni lire ni modifier le CRM interne ;
7. vérifier que les opérations et l'historisation sont cohérentes ;
8. tester le RPC de relance avec sessions valides et invalides ;
9. consigner les preuves expurgées et les résultats PASS/FAIL.

Les tests multi-tenant ne sont PASS qu'après exécution avec au moins deux comptes réels de deux organisations distinctes.

## 7. Nettoyage

Avant toute suppression, produire la liste exacte des UUID de test et des dépendances. Faire valider le nettoyage. Ne jamais exécuter de suppression globale, de TRUNCATE ou de cascade non bornée. Aucun objet de `majestios-crm` ne fait partie de cette recette.

## 8. Blocage opérationnel actuel

Pour créer les identités, il faut les adresses dédiées qui recevront les invitations ou confirmations. Elles doivent être fournies/validées par le propriétaire du projet et créées dans Authentication du projet de test. L'action Auth Admin n'étant pas exposée à cette session, cette étape ne peut pas être automatisée ici sans contourner le mécanisme de sécurité.

**Aucun utilisateur, tenant, membership ou enregistrement CRM n'a été créé à la date de rédaction.**
