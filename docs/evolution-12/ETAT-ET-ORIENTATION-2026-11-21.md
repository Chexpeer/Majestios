# État réel et orientation — 21 novembre 2026 (soir)

**Branche active :** `evolution-12` (copie de travail de test). Sauvegardes : `backup-evolution-10-2026-11-21` et `backup-evolution-11-2026-11-21`. **Rien n'est fusionné ni en production.** Projet Supabase concerné : Test uniquement.

## 1. Ce qui est fait et vérifié

| Sujet | État | Preuve |
|---|---|---|
| Arborescence | 42 pages HTML rangées dans `pages/{rubriques,marches,developpement,reseau,solutions,infos,espaces}/` ; seules `index.html` et `resultats-recherche.html` restent à la racine. Adresses publiées inchangées (146). | `chemins-site.cjs`, test des adresses, `dist/` identique à evolution-10 (sauf l'ordre du sitemap), CI verte |
| Connexion et espaces | Pages d'espace membre, interne, administration, CRM et invitation rangées sans changer leurs adresses : retours Google / LinkedIn / e-mail et lien d'invitation inchangés. | 155 tests unitaires, 16 tests navigateur (espaces, admin, CRM, invitations) |
| Marchés attribués | Base Test : 139 822 marchés (6 mois), 54 014 titulaires ; lecture publique sous 3 s ; annuaire des gagnants (entreprises réelles seulement) ; bouton Rechercher ; chargement DECP par GitHub Actions (secrets posés). | Appels REST réels via pg_net, tests, page en ligne |
| Navigation | 5 menus validés par le propriétaire : Marchés (7 entrées) · Développement (6) · Réseau (2) · Solutions (2) · Mon espace (2). Aucune page retirée ; menu de repli sans JavaScript identique sur toutes les pages ; présent aussi sur le tableau de bord admin, le CRM, l'accueil interne, l'espace membre et l'invitation. | `navigation-tiroirs.js`, `verify-architecture`, tests navigation (3) |
| Moteurs | Recherche BOAMP/BODACC (navigateur), recherche par catégorie, marchés attribués : tests navigateur passés. Résultats réels à recetter par le propriétaire. | `opportunity-search`, `resultats-categorie`, `marches-attribues` |
| Base Test | Conseillers de sécurité Supabase : rien de bloquant. Les fonctions publiques (marchés attribués, annonces publiées, demande d'introduction) sont volontairement ouvertes ; les autres vérifient le rôle. Un point d'attention : « protection des mots de passe compromis » désactivée (réglage Supabase Auth, à activer par le propriétaire). | Conseiller de sécurité du 21/11/2026 |

## 2. Orientation stratégique (inchangée dans son sens, précisée)

Ambition : devenir l'outil de développement commercial le plus professionnel et le plus efficace pour le bâtiment et ses services (voir la synthèse). La structure en familles prépare les extensions sans multiplier les pages à la racine : **Marchés · Développement · Réseau · Solutions · Mon espace**.

Pistes inspirées de l'étude des plateformes de veille de marchés (aucune n'est commencée, décision du propriétaire) :
1. Marchés attribués : tri et vue tableau, filtres supplémentaires, « attributions de mes concurrents ».
2. Fiche entreprise (marchés gagnés, acheteurs, évolution).
3. Recherches enregistrées et alertes.
4. Suivi d'opportunités (de la détection à la réponse).
5. Assistant Cheexpeer intégré aux pages de recherche.

## 3. Reste à faire

- **É6** : contrôle complet, sauvegarde finale, décision de fusion (propriétaire).
- **Production, au moment de la fusion décidée** : rejouer les migrations 20261120190000, 20261121160000, 20261121180000, 20261121190000, 20261121200000 ; déployer `provision-client-workspace` v4 ; régler Google/LinkedIn et le secret `INTERNAL_ADMIN_EMAIL` avant le bootstrap admin ; poser les secrets du chargement DECP. Le rechargement quotidien ne tourne qu'une fois la branche fusionnée (planification limitée à la branche par défaut).
- **Test de connexion réelle** sur l'aperçu d'evolution-12 : l'adresse d'aperçu étant nouvelle, elle peut devoir être ajoutée aux adresses autorisées (Supabase, Google, LinkedIn).
- Décisions anciennes en attente : fonds de 7 pages, carte « Salons et séminaires », transparence ailleurs.
