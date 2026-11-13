# Plan de synthèse documentaire — MajestiOS

**Branche :** `Evolution-9`  
**État :** consolidation en cours  
**Mise à jour :** 13 novembre 2026

## 1. Objectif

Réduire la dispersion et les contradictions documentaires sans perdre les décisions, les preuves techniques, les identifiants d'anomalies ni l'historique. La synthèse doit rendre immédiatement visibles la source canonique, l'état réel et les limites de vérification.

La synthèse ne constitue ni une refonte du site ni une autorisation de modifier les fonctionnalités, les pages, les styles ou les parcours.

## 2. Hiérarchie canonique

| Niveau | Document | Rôle |
|---|---|---|
| 1 | `AGENTS.md` | Consignes de travail, autorisations et méthode |
| 2 | `docs/CRITIQUES/README.md` | Point d'entrée des risques critiques |
| 3 | `docs/README.md` | Index général et ordre de lecture |
| 4 | `docs/evolution-9/README.md` | État courant, mandat et priorités Evolution-9 |
| 5 | `docs/evolution-9/REGISTRE-ANOMALIES-EVOLUTION-9.md` | Anomalies détaillées, preuves, statuts et critères de clôture |
| 6 | Spécifications et audits spécialisés | Détails métier/techniques et preuves datées |
| 7 | Dossiers Evolution-5.0 à Evolution-8 et historique | Sources historiques, propositions et décisions antérieures |

La vision stratégique et le plan de réalisation restent les références produit. L'architecture CRM tout-en-un Evolution-8 demeure une référence détaillée héritée ; elle ne doit pas être réécrite avant comparaison complète avec les décisions Evolution-9.

## 3. Règles de consolidation

- Un sujet possède une référence canonique actuelle ; les autres documents renvoient vers elle.
- Les documents historiques ne sont pas supprimés, déplacés ou réécrits pour masquer une ancienne décision.
- Les audits datés conservent leur date, leur SHA, leurs sources et leurs limites.
- Les statuts distinguent : prévu, spécifié, présent dans Git, déployé, testé, recetté.
- Une synthèse ne ferme jamais une anomalie et ne remplace jamais une preuve.
- Les chiffres ne sont publiés qu'avec leur périmètre et leur date.
- Les constats d'un audit tiers sont revalidés dans le code ou clairement étiquetés comme non confirmés.
- Les modifications documentaires canoniques sont suivies de `node verify-doc-links.js`.

## 4. Consolidation effectuée le 13 novembre

- `docs/README.md` recentré sur l'ordre de lecture, les références canoniques et l'état réel.
- `docs/evolution-9/README.md` recentré sur le mandat actif, les corrections prouvées et les sujets complexes ouverts.
- `docs/CRITIQUES/README.md` aligné sur le registre Evolution-9 et les risques actuels.
- `AGENTS.md` précise le périmètre de stabilisation et interdit les clones partiels, les refontes de site et les opérations distantes non autorisées.
- Le registre conserve l'historique et reçoit un addendum daté ; aucun identifiant historique n'est supprimé.

## 5. Repères de comptage vérifiés

Au 13 novembre 2026, sur le contenu de la branche `Evolution-9` :
- `site-files.json` contient **93 chemins**, dont **39 fichiers HTML**.
- `verify-architecture.js` attend **21 entrées secondaires** et **19 destinations uniques**.
- Le nombre de 81 fichiers est une preuve de build historique sur un commit antérieur ; 86 n'est pas le compte du manifeste courant.
- Le dépôt contient 392 entrées dans l'arbre Git au SHA contrôlé avant le lot documentaire ; ce nombre n'est pas un indicateur de fichiers publiés.

## 6. Sujets complexes à conserver ouverts

1. **Supabase / CRM :** doublons de triggers, policies tenant-scoped et frontière VIP, droits effectifs, historique atomique, état distant des migrations et recette multi-rôles.
2. **Bootstrap admin :** identité administrateur codée en dur, CORS permissif, configuration et stratégie de bootstrap à revoir sans verrouillage.
3. **CI :** vérifier le workflow principal, les contrôles Edge et les tests externes sur le SHA final ; distinguer échec applicatif et incident réseau.
4. **Navigation et contenus :** menus statiques différents, destinations divergentes et libellés obsolètes ; aucune modification de site dans le lot courant.
5. **Fichiers non chargés directement :** analyser les imports dynamiques et usages serveur avant toute suppression.
6. **Documentation spécialisée :** ajouter progressivement des en-têtes de statut et des liens canoniques, sans opération massive sur les archives.

## 7. Rapport de conservation

- **Conservés :** tous les dossiers Evolution-5.0 à Evolution-8, audits datés, spécifications et historique.
- **Réorganisés :** les points d'entrée canoniques seulement.
- **Non supprimés :** aucun fichier historique, aucune page, aucun style, aucun script, aucune migration.
- **Non fusionnés :** aucun changement de branche, merge ou promotion.
- **À arbitrer :** architecture héritée, policies SQL, statut des fichiers non publiés et corrections de contenu sur le site.

## 8. Critère de fin

La synthèse sera considérée stable lorsque les liens canoniques sont vérifiés, les statuts contradictoires sont résolus ou explicitement datés, les anomalies restent traçables et chaque document spécialisé renvoie vers la bonne source. L'achèvement documentaire ne vaut pas validation du produit ni recette de ses environnements.
