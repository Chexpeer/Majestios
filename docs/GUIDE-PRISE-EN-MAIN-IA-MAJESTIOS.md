# Guide de prise en main pour toute IA — MajestiOS / Cheexpeer

**Statut :** guide opérationnel complémentaire à AGENTS.md  
**Branche active de ce chantier :** Evolution-9 uniquement  
**Mise à jour :** 11 novembre 2026

Ce document permet à une IA qui découvre le dépôt de comprendre rapidement le produit, les limites de son mandat, les sources de vérité, les priorités et la méthode de travail. Il ne remplace ni AGENTS.md, ni le registre des anomalies critiques, ni les spécifications métier.

## 1. Démarrage obligatoire — dans cet ordre

1. Lire `AGENTS.md` : mandat, branches, architecture, sécurité et règles de travail.
2. Lire `docs/CRITIQUES/README.md` : anomalies bloquantes et garde-fous.
3. Lire `docs/README.md` : index documentaire et hiérarchie des sources.
4. Lire `docs/evolution-9/README.md` et `docs/evolution-9/REGISTRE-ANOMALIES-EVOLUTION-9.md`.
5. Lire la vision stratégique, le plan de réalisation et le plan de synthèse documentaire Evolution-9.
6. Lire le dossier spécialisé correspondant à la tâche ; consulter les décisions héritées Evolution-7/8 sans modifier ces branches.

Avant toute écriture, vérifier dépôt, branche, HEAD, statut CI, dernier déploiement et fichiers concernés. Pour ce chantier, la seule branche modifiable est `Evolution-9`. Evolution-7/8, main, sauvegardes et autres branches sont en lecture seule.

## 2. Comprendre le produit

MajestiOS est une plateforme de développement commercial, de CRM et d'intelligence économique. Le parcours de valeur est :

**Détecter → Comprendre → Qualifier → Décider → Agir → Gérer → Facturer → Capitaliser.**

Le produit ne doit pas être réduit à un agrégateur d'annonces ou à un chatbot. Les rubriques publiques, le CRM interne, les futurs CRM clients, les espaces privés, la veille, la facturation et les connecteurs ont des finalités et permissions distinctes.

### Séparations à ne jamais casser

- CRM interne MajestiOS ≠ futur CRM de chaque client.
- CRM natif ≠ CRM externe conservé par le client.
- Recherche publique ≠ recherche privée ; un moteur commun peut router vers des parcours distincts.
- Publication ≠ transfert automatique dans le CRM ou la prospection.
- Veille ≠ preuve de qualification commerciale.
- Logiciel compatible ≠ Plateforme Agréée de facturation.
- Spécification ≠ code ≠ déploiement ≠ recette.
- Assistant à mots-clés ≠ Cheexpeer.

## 3. Identité et rôle de Cheexpeer

Cheexpeer est l'agent IA transversal de MajestiOS, conçu comme un binôme technico-commercial, scientifique et économique. Sa cible comporte quatre espaces complémentaires :
1. chat avec les utilisateurs ;
2. cockpit privé d'administration et de supervision, prioritaire pour dialoguer avec l'agent, suivre ses missions et valider les actions sensibles ;
3. CRM / Supabase, avec permissions métier limitées ;
4. GitHub, pour audit, documentation et développement.

Cheexpeer doit progressivement observer, diagnostiquer, rechercher, proposer, exécuter dans son mandat, tester, historiser et capitaliser. Il doit aussi préparer l'amélioration SEO/GEO, la veille, l'éditorial et le community management, dont LinkedIn, mais aucune publication, interaction publique ou action engageante ne doit être effectuée sans validation humaine tant que la délégation explicite et les contrôles ne sont pas opérationnels.

**État réel à ne pas embellir :** le guide conversationnel actuel est local et fondé sur des mots-clés. Le worker présent dans le dépôt n'exécute qu'un diagnostic `readiness_probe` et refuse les autres types de mission. Les parcours authentifiés de soumission, approbation et suivi des missions ne sont pas démontrés comme opérationnels. Le code, le registre et le rapport d'audit déterminent le statut exact à chaque reprise.

## 4. Priorités de travail

Ordre général, à ajuster uniquement si une anomalie P0 impose une interruption :

1. Sécurité, intégrité des données, authentification, droits et isolation multi-tenant.
2. Anomalies critiques visibles et blocages qui empêchent les parcours existants.
3. Non-régression fonctionnelle : balayer les rubriques, liens, formulaires, filtres, états vides, erreurs, responsive et navigation.
4. Fiabilité CRM : entreprises, contacts, opportunités, activités, relances, historique, import/export et droits.
5. Préparation de la phase 2 CRM clients et facturation électronique, sans la présenter comme livrée.
6. Cheexpeer : cockpit, missions durables, validations, worker, outils à privilèges minimaux, journal et reprise.
7. SEO technique, contenu, accessibilité, performance, visibilité dans les moteurs et systèmes IA.
8. Harmonisation visuelle et ergonomique sans supprimer les différences justifiées par les usages.
9. Synthèse documentaire et préparation des lots suivants.

## 5. Boucle de travail obligatoire

Pour chaque rubrique ou lot :

1. **Observer** : lire la page, scripts, styles, routes, données, dépendances et documentation.
2. **Comprendre** : reconstruire le parcours réel et ses états ; rechercher les usages et effets secondaires.
3. **Qualifier** : anomalie confirmée, risque anticipé, dette technique, amélioration ou évolution produit.
4. **Prioriser** : P0/P1/P2/P3 avec impact, probabilité, portée et dépendances.
5. **Corriger** : préserver les fonctionnalités ; modifier le plus petit périmètre sûr ; ne pas masquer un symptôme en supprimant le parcours.
6. **Tester** : syntaxe, tests unitaires/contrats, architecture, liens, navigateur desktop/mobile et tests de sécurité pertinents.
7. **Documenter** : état initial, cause, correction, fichiers, tests, commit, limites, risques résiduels et suite.
8. **Capitaliser** : mettre à jour registre actif, dossier critique si nécessaire, index et spécification concernée.

Ne pas déclarer une anomalie « validée » sur la seule base d'un diff ou d'un test statique. Utiliser les statuts normalisés du registre.

## 6. Règles de sécurité et autorisations

- Ne jamais modifier un projet Supabase, ses données, migrations, secrets, Auth, RLS ou fonctions distantes sans autorisation explicite adaptée.
- Le projet `MajestiOS-Test` est un environnement de test : ne pas le traiter comme un bac à sable jetable et ne rien y écrire sans autorisation.
- Le frontend utilise actuellement le projet `majestios-crm` selon l'audit daté ; re-vérifier avant toute décision.
- Ne jamais exposer service-role, clés privées, jetons GitHub/Vercel ou secrets au navigateur, aux journaux ou au modèle.
- Les contrôles d'accès doivent être faits côté serveur et testés avec des identités synthétiques.
- Ne pas fusionner, promouvoir en production, supprimer ou réécrire l'historique sans accord explicite.
- Les actions financières, de diffusion publique, d'administration, de droits, de migration et irréversibles exigent approbation humaine.

## 7. SEO et visibilité IA

Pour chaque page publique, contrôler : intention de recherche, titre unique, meta description utile, H1 cohérent, structure H2/H3, URL stable, liens internes, canonical quand le domaine canonique est défini, indexabilité, données structurées pertinentes, partage social, performance, mobile, accessibilité et exactitude des affirmations.

Pour les pages privées, cockpit, administration, CRM, pages de recherche interne et espaces authentifiés, vérifier l'exclusion d'indexation et ne pas compter sur `noindex` comme mécanisme de sécurité.

Ne jamais créer un sitemap ou des canonicals en devinant le domaine principal. Ne pas ajouter de schéma Organization/Product/FAQ si les données ne sont pas exactes et visibles. Pour GEO/IA, privilégier des informations structurées, datées, sourcées, cohérentes et facilement attribuables ; ne pas promettre un classement ni simuler des recommandations.

## 8. Documentation et registre des anomalies

Toute anomalie critique doit être accessible depuis `docs/CRITIQUES/README.md` et détaillée dans le registre Evolution-9. Une synthèse ne peut pas faire disparaître une anomalie. Chaque entrée doit contenir :
- identifiant stable, priorité, domaine et date ;
- constat reproductible, preuve et périmètre ;
- impact, risque et prérequis ;
- correction proposée ou appliquée ;
- statut réel et raison d'un éventuel blocage ;
- tests exécutés, résultats, commit et déploiement ;
- critère explicite de clôture.

Les décisions, contraintes et spécifications doivent être formulées de façon exploitable par une IA qui n'a pas accès aux conversations précédentes : définitions, état réel, règles, exemples, interfaces, dépendances, critères d'acceptation et procédure de vérification.

## 9. Compte rendu de chaque intervention

Toujours rapporter :
- branche et commit ;
- rubriques/fichiers audités ;
- défauts confirmés et améliorations réalisées ;
- tests passés, échoués, non exécutés ;
- état Preview/Production clairement séparé ;
- modifications distantes : aucune, ou liste exacte autorisée ;
- anomalies critiques ouvertes et prochaine action.

**Règle finale :** ne pas refaire le produit, ne pas maquiller les défauts, ne pas promettre ce qui n'existe pas. Assainir, corriger, simplifier, fiabiliser et préparer la vision sans perdre les fonctionnalités acquises.
