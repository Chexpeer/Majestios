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
6. **Sort des cinq pages sans lien entrant** (catégories électricité, maintenance, plomberie, rénovation, résultats).
7. **Périmètre du premier CRM client** et modèle économique (socle gratuit ou non).

## 4. Prochain pas recommandé

L1 (recette réelle du site) et les décisions 1, 2, 3 et 4 : elles débloquent tout le reste sans risque pour les données.
