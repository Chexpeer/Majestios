# Feuille de route stratégique — préparation du terrain

**Date :** 14 novembre 2026 · **Source :** [vision 2026–2028](VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md) et [plan de réalisation](PLAN-REALISATION-ET-MOYENS.md).  
**Principe :** chaque lot a un prérequis, une preuve de réussite et, si besoin, une autorisation. Rien ici n'est déployé.

## 1. Déjà prêt (fait dans le dépôt)

| Fait | Preuve |
|---|---|
| Site cohérent : menu, liens, repli sans JavaScript, textes d'attente | `verify-liens-site.js`, tests navigation |
| Honnêteté publique : aucune promesse de création d'espace, de PA ou de Cheexpeer actif | pages et contrat Auth OTP |
| SEO de base : `robots.txt`, `sitemap.xml` (domaine provisoire) | build, `generate-sitemap.js` |
| Durcissement du bootstrap admin préparé (non déployé) | `tests/bootstrap-admin-hardening.test.cjs` |
| API de missions Cheexpeer (soumission, approbation, lecture) et worker `worker_self_check` dans Git | `supabase/functions/cheexpeer-*`, spécification première mission |

## 2. Lots

| Lot | Étape du plan | Objectif | Prérequis | Preuve de réussite | Autorisation |
|---|---|---|---|---|---|
| L1 | A | Recette réelle du site (BODACC/BOAMP, 13 fonds, mobile) | Porteur : tests sur appareil réel | Constats consignés au registre | Non |
| L2 | B | Socle : parité Supabase, OTP, RLS, quotas | Copie isolée, sauvegarde, SQL revu | Tests owner/admin/member/inter-organisations réussis | **Oui** (Supabase) |
| L3 | B→J | Ouverture de la création d'espaces | L2 (AUTH-01) | Parcours complet, anti-abus ; remplacer la section `#creation` | **Oui** |
| L4 | C | Valider les usages avec 5 à 7 pilotes | Liste de pilotes (cf. [stratégie premier cercle](../evolution-7/STRATEGIE-OUVERTURE-PREMIER-CERCLE-5-A-7-2026-11-09.md)) | Retours observés, tâches classées, parcours artisan | Non |
| L5 | H | Cheexpeer : première mission `worker_self_check` | Fournisseur IA choisi, secrets, déploiement des 3 API sur `MajestiOS-Test` | Critères d'acceptation §8 de la spécification | **Oui** |
| L6 | D | CRM client minimal (clients, contacts, tâches, devis) | L2 + L4 | Parcours métier, export, isolation | **Oui** |
| L7 | E–F | Noyau de facturation puis choix d'une PA | Modèle métier validé, étude PA | Sandbox émission/réception/rejets | **Oui** + contrats |
| L8 | I | Réseau : fiches partenaires avec statut explicite (contractuel, technique, référencé, à l'étude) | Contrats | Aucune fiche sans statut | Non (contenu) |

## 3. Décisions ouvertes (porteur du projet)

1. **Domaine canonique** (aujourd'hui `majestios.vercel.app`) → permet les balises `canonical` et fixe le sitemap.
2. **Fournisseur et modèle d'IA**, budget, conservation des données → ouvre L5.
3. **Liste des 5 à 7 pilotes** et date de démarrage → L4.
4. **Autorisation Supabase ciblée** sur `MajestiOS-Test` (sauvegarde, migrations revues) → L2, L3, L5.
5. **Reprise dans `Evolution-9`** des évolutions de la branche de test (fusion ou PR) — décision séparée, jamais implicite.
6. **Sort des cinq pages sans lien entrant** (catégories électricité, maintenance, plomberie, rénovation, résultats) : suppression autorisée, mais pages référencées par le catalogue/la recherche ; non supprimées, en attente de confirmation.
7. **Périmètre du premier CRM client** et modèle économique (socle gratuit ou non).

## 4. Prochain pas recommandé

L1 (recette réelle du site) et les décisions 1, 2, 3 et 4 : elles débloquent tout le reste sans risque pour les données.

## 5. Liste des priorités — mise à jour du 14 novembre 2026 (soir)

| Rang | Sujet | Statut | Prochain pas | Qui |
|---|---|---|---|---|
| 1 | **Connexion par e-mail du projet de test** (CONS-04) : lien envoyé vers `localhost:3000`, limite d'envois atteinte | Ouvert | Régler « Site URL » et « Redirect URLs » (Authentication > URL Configuration), attendre la fin de la limite, retester | Porteur (réglage) puis Claude |
| 2 | **Recette de la relecture des annonces** (branche `test-annonces-relecture`) et **de la liste publique** (`test-annonces-liste-publique`) sur MajestiOS-Test | Construit, tests automatiques OK, jamais essayé de bout en bout | Se connecter, déposer une annonce de test, la publier, la voir sur la liste publique | Porteur + Claude |
| 3 | **Recette AUTH-01** (connexion sécurisée, création d'espace personnel) — prérequis de Cheexpeer et des espaces clients | Non recetté | À jouer après le point 1 | Porteur + Claude |
| 4 | **Tests réseau BOAMP/BODACC** (3 tests non exécutables depuis l'environnement de travail) | À rejouer | Lancer depuis le poste du porteur ou la CI | Porteur |
| 5 | **Compte de test créé directement en base** (CONS-05) | À régulariser | Supprimer ou refaire proprement avant tout projet réel | Claude, sur décision |
| 6 | **Harmonisation visuelle** : échelle typographique unique, couleurs lisibles, cube en cristal | Fait sur la branche de test, vérifié en captures et en tests | Validation visuelle du porteur sur l'aperçu ; ajuster couleurs de rubrique si besoin | Porteur |
| 7 | **Fusion des branches annonces** avec la branche principale | Non décidé | Ordre : relecture, liste publique ; conflits attendus sur `site-files.json` et le workflow CI | Porteur (décision) |
| 8 | **SEO des annonces** : une page statique par annonce publiée et plan du site généré | Non commencé | Après la recette (point 2) | Claude |
| 9 | **Planification de `private.expire_announcements()`** | Non planifié | Après la recette | Claude |
| 10 | **Arrivée de Cheexpeer** : première mission `worker_self_check` (désactivée) | Préparée, non déployée | Après AUTH-01 et recette de bout en bout | Porteur + Claude |

