# Lot D2-B — adaptateur authentifié et projection des résultats — 8 novembre 2026

**Branche :** `feature/crm-atomic-integration`  
**Sauvegarde préalable :** `backup/pre-prospection-d2-2026-11-08`  
**Commit contrôlé par la CI :** `506f0a5cd635e2726d1f34d0e24793c8f954b9c7`  
**Workflow :** `42482122973` — succès.

## 1. Adaptateur préparé

Nouveaux fichiers :
- `prospection-member-adapter.mjs` : adaptateur pur du contrat serveur vers les cartes de qualification ;
- `prospection-member-client.js` : point d'entrée navigateur, utilisant la configuration publique et la session Supabase existante.

L'adaptateur :
- construit strictement le corps accepté par `validateMemberSearch` : `filters.activity_codes`, `filters.departments`, `page.number`, `page.size=10` ;
- exige une session, vérifie le jeton auprès de Supabase Auth et contrôle la cohérence de l'identifiant utilisateur ;
- appelle uniquement `prospection-search-member` via `supabase.functions.invoke` ;
- contrôle la forme de la réponse avant de la transmettre à l'interface ;
- traduit le DTO membre en structure de carte positive, sans propager les propriétés non prévues ;
- convertit les erreurs connues en messages français génériques ;
- conserve `partial` et `has_more` afin qu'une recherche partielle ne soit pas présentée comme exhaustive.

Aucune clé secrète ou `service_role` n'est utilisée côté navigateur.

## 2. Projection et confidentialité

La projection UI conserve uniquement les données métier utiles à la préqualification : identité de l'entreprise, SIREN/SIRET, code et libellé d'activité, département, statut administratif, date de création, forme juridique, tranche d'effectif, adresse, score, motifs et date de vérification.

Les clés de provenance, fournisseur, URL, payload brut, identifiants de requête et détails techniques ne sont pas projetés dans les cartes.

Un statut administratif inconnu reste `active: null`. Il n'est jamais converti en inactif. Le filtre actuel « exclure les entreprises indiquées comme non actives » pourra donc continuer à exclure uniquement `active === false`.

## 3. Correction complémentaire détectée

En contrôlant le contrat HTML/JavaScript du lot D2-A, j'ai relevé que les motifs d'expression régulière des codes APE/NAF et des départements contenaient un double échappement dans le script. Ils pouvaient rejeter des valeurs pourtant valides.

Les deux motifs ont été corrigés et le test de contrat HTML/JS vérifie désormais leur forme exacte. Le test vérifie aussi la présence de `marketDescription`, qui est lu par le module de suggestions lexicales.

## 4. Tests et CI

Nouveau test : `tests/prospection-member-adapter.test.cjs`.

Il couvre :
- normalisation et dédoublonnage des codes APE/NAF et départements ;
- rejet des critères invalides et numéros de page hors limites ;
- projection DTO → carte et exclusion des champs de provenance ;
- conservation d'un statut inconnu ;
- session absente et incohérence d'identité ;
- appel de la fonction avec le corps attendu ;
- traduction d'un refus d'habilitation.

Le workflow ciblé exécute maintenant quatre suites :
1. contrat DTO, validation et habilitations ;
2. moteur membre, filtres et pagination ;
3. cohérence du formulaire et motifs de validation ;
4. adaptateur authentifié et projection des résultats.

**Résultat vérifié :** workflow `42482122973`, run 10, terminé `success` sur le commit `506f0a5cd635e2726d1f34d0e24793c8f954b9c7`. Les quatre étapes de test sont en succès.

## 5. Limites et non-bascule

L'adaptateur est préparé mais volontairement non raccordé à `qualification-entreprises.html` :
- le module navigateur n'est pas chargé par la page ;
- l'ancien moteur reste le seul parcours utilisé ;
- aucune requête réelle à l'endpoint membre n'a été envoyée ;
- le statut de déploiement de l'Edge Function hébergée n'a pas été revalidé dans ce lot ;
- aucune comparaison réelle ancien/nouveau n'a été effectuée.

Ce découplage évite qu'une page utilisateur appelle un endpoint dont la disponibilité et la configuration hébergée n'ont pas été vérifiées. La prochaine étape devra d'abord contrôler le statut de déploiement et les origines CORS autorisées, puis réaliser une recette authentifiée encadrée avant toute bascule.

## 6. Périmètre préservé

- aucune migration, requête SQL ou écriture distante Supabase ;
- aucun changement Auth/RLS ou secret ;
- aucune Edge Function déployée ;
- aucune source, marque, URL ou fournisseur exposé à l'utilisateur ;
- aucun changement du moteur global de recherche de l'accueil ;
- aucun merge ni déploiement Vercel/production.

## 7. Suite proposée — D2-C

1. Vérifier, en lecture seule, la présence et la version de l'Edge Function hébergée ainsi que les origines autorisées.
2. Contrôler le contrat CORS et la compatibilité du client navigateur avec le projet.
3. Préparer un mode de comparaison interne, sans afficher de doublons ni exposer la provenance.
4. Définir la recette avec un compte membre client autorisé et un compte non autorisé.
5. Ne raccorder la page qu'après validation explicite de la disponibilité de l'endpoint et autorisation de bascule.

**Critère de sortie D2-B :** l'adaptateur est testable indépendamment de la page, l'identité de session est vérifiée, la projection UI est positive et les suites CI ciblées passent. Ce critère est atteint ; la recette live et la bascule restent hors périmètre.
