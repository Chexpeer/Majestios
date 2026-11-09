# Lot Cheexpeer — raccordement du parcours d’audit — 9 novembre 2026

**Branche :** `Evolution-7`  
**Périmètre :** code GitHub uniquement. Aucun déploiement Supabase, aucune configuration distante et aucune clé fournisseur ajoutée.

## 1. Résultat du lot

Le parcours de la page Réputation virtuelle est maintenant raccordé au handler Edge Function authentifié :

1. Le membre prépare le dossier entreprise dans la page.
2. Le bouton « Lancer l’audit Cheexpeer » devient actif.
3. Le navigateur vérifie la session Supabase et appelle `reputation-audit-context`.
4. L’Edge Function authentifie le JWT avec `auth.getUser(token)`.
5. Le serveur authentifie le JWT et vérifie l’appartenance à au moins un espace MajestiOS via `organization_members` et les politiques RLS.
6. Le serveur collecte le contexte d’identité d’entreprise et les annonces BODACC.
7. Si le fournisseur IA est configuré côté serveur, le handler transmet les seules preuves collectées au module Cheexpeer.
8. Le module valide le schéma, les références de preuves et les liens entre constats et recommandations.
9. Le navigateur affiche les éléments, les constats, les recommandations et les lacunes avec insertion DOM en texte, sans interpréter les réponses comme du HTML.

## 2. Fichiers modifiés ou ajoutés

- `reputation-virtuelle.html` : module ES, champ SIREN facultatif, bouton de lancement et information sur la transmission au service.
- `reputation-virtuelle.js` : client Supabase, appel authentifié, restitution du rapport et activation conditionnelle du bouton.
- `supabase/functions/_shared/reputation-audit-handler.mjs` : orchestration collection → analyse optionnelle → DTO de restitution.
- `supabase/functions/_shared/reputation-audit-provider.mjs` : nouvel adaptateur serveur pour API compatible Chat Completions et JSON Schema strict.
- `supabase/functions/reputation-audit-context/index.ts` : lecture des variables d’environnement IA, contrôle d'appartenance et consommation du quota par RPC avec le client utilisateur.
- `supabase/migrations/20261109193000_cheexpeer_reputation_audit_quotas.sql` : quota atomique de 5 audits par membre et 25 par organisation, par jour UTC ; migration non appliquée.
- `tests/reputation-audit-access-contract.test.mjs` : test du contrôle d'appartenance serveur.\n- `tests/reputation-audit-connectors.test.mjs` et `tests/reputation-audit-analysis.test.mjs` : tests de rapprochement SIREN et de résistance aux instructions présentes dans les preuves.
- `tests/reputation-audit-handler.test.mjs` : cas analyse active et cas fournisseur absent.
- `tests/reputation-audit-provider.test.mjs` : authentification fournisseur, JSON Schema strict, erreurs et endpoint HTTPS.
- `tests/reputation-virtuelle.browser.cjs` : mock du SDK Supabase et tests d’état du bouton.
- `.github/workflows/verify-site.yml` : contrôles de syntaxe et tests fournisseur.

## 3. Configuration requise avant une analyse IA réelle

Variables d’environnement à définir comme secrets de l’Edge Function, jamais dans les fichiers publics :

- `CHEEXPEER_AI_API_KEY` : clé privée du fournisseur compatible.
- `CHEEXPEER_AI_MODEL` : identifiant exact d’un modèle prenant en charge la sortie JSON Schema stricte.
- `CHEEXPEER_AI_BASE_URL` : facultatif ; URL HTTPS du endpoint compatible. Par défaut, endpoint OpenAI Chat Completions.

Aucun fournisseur ni modèle n’a été activé par ce lot. En leur absence, la fonction retourne explicitement `collection_only`, avec les preuves et un message indiquant que l’analyse IA n’est pas configurée. Elle ne simule pas un rapport.

Le choix du fournisseur, du modèle, du budget, de la politique de conservation et des modalités contractuelles reste à valider avant configuration. La clé API ne doit jamais être placée dans `supabase-config.js`, dans un script navigateur ou dans le dépôt.

## 4. Limites fonctionnelles actuelles

- La collecte reste limitée aux connecteurs d’identité officielle et BODACC déjà présents.
- Il ne s’agit pas encore d’une couverture automatisée exhaustive de Google Web, Google Maps, des avis, des réseaux sociaux ou des sites concurrents.
- Le dossier est conservé dans `sessionStorage` ; aucun rapport durable ni historique par organisation n’est créé.
- L’accès est authentifié par session Supabase et le quota journalier est préparé en SQL ; la migration n'est pas appliquée. Le stockage multi-tenant des dossiers/rapports, le rate limit à court terme, le suivi financier par jetons et la traçabilité durable des audits restent à construire.
- L’analyse, si configurée, est préparatoire et doit être validée humainement. Aucun score global ni action externe automatique n’est autorisé.
- Le fournisseur doit réellement prendre en charge le format strict demandé ; les incompatibilités remontent une erreur contrôlée et aucun rapport n’est produit.

## 5. Contrôles et recette

Tests ajoutés au workflow :

- analyse Cheexpeer active et absence de fournisseur ;
- adaptateur IA : secret côté serveur, schéma strict, endpoint HTTPS, réponses et erreurs ;
- interface : bouton actif après préparation du dossier et inactif après réinitialisation ;
- vérification de syntaxe du module navigateur, de l’adaptateur et des tests.

**Statut de suivi :** le workflow GitHub `42653244123` (run `4070`, commit `8a2775e51207888d530395d5e2fb1d19037c7752`) est terminé avec succès. Il couvre la syntaxe, les tests unitaires Cheexpeer, le contrôle d'appartenance, les connecteurs, l'analyse et le parcours navigateur de Réputation virtuelle. Cela valide la suite automatisée du dépôt, pas le déploiement ni la recette multi-comptes dans l'environnement Supabase réel. Aucun appel au fournisseur IA, aucune migration, aucun déploiement Edge Function et aucune modification du projet Supabase hébergé n’ont été réalisés.

## 6. Prochaine étape contrôlée

1. Choisir le fournisseur et le modèle compatibles avec JSON Schema strict.
2. Vérifier coûts, conditions d’utilisation, localisation et conservation des données, et exigences de confidentialité.
3. Définir les secrets dans l’environnement de test Supabase autorisé.
4. Déployer uniquement dans cet environnement après autorisation explicite.
5. Exécuter une recette avec compte membre de test, SIREN de test et preuves vérifiables ; vérifier les erreurs, les limites de débit et la restitution.
6. Définir ensuite le modèle de persistance des dossiers et rapports par organisation, avec RLS et durée de conservation.

**Ne pas annoncer « audit automatique opérationnel » avant la configuration du fournisseur, le déploiement et la recette réelle.**
