# Nettoyage documentaire MajestiOS — 2 novembre 2026

## Périmètre réalisé

- Création de `docs/README.md` comme index documentaire central.
- Simplification du `README.md` racine : présentation du prototype, démarrage, limites fonctionnelles et règles de contribution.
- Classement des documents par domaine et désignation d'une référence principale par sujet.
- Identification des principaux chevauchements documentaires sans fusion ni suppression.

## Références principales retenues

| Sujet | Document de référence |
|---|---|
| Vision et décisions produit | `CAHIER-DES-CHARGES-MAITRE-MAJESTIOS.md` |
| Reprise et continuité | `DOCUMENTATION-REPRISE-IA-MAJESTIOS.md` |
| Comportements et parcours | `SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md` |
| Pages et dépendances | `ARBORESCENCE-MAJESTIOS.md` |
| Exigences et preuves | `MATRICE-TRAÇABILITE-EXIGENCES-MAJESTIOS.md` |
| Chaîne de traitement des signaux | `TRAITEMENT-OPPORTUNITES-MAJESTIOS.md` |
| Sources de données | `REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md` |
| Modèle métier partagé | `MODELE-COMMUN-DONNEES-CRM-MAJESTIOS.md` |
| Qualité et prérequis statistiques | `CARTOGRAPHIE-DONNEES-STATISTIQUES-MAJESTIOS.md` |

## Chevauchements identifiés

1. README, guide de reprise et cahier maître : rôles différents, à maintenir distincts.
2. Spécification fonctionnelle, parcours depuis une annonce et traitement des opportunités : niveaux de détail différents.
3. Arborescence du site et dossiers fonctionnels : structure web actuelle versus organisation métier cible.
4. Modèle appels d'offres, modèle CRM commun et cartographie statistique : schéma source, contrat métier transversal et prérequis analytiques.
5. Cahier de veille et registre de ressources : périmètre de veille versus inventaire et statut des sources.

## Vérifications réalisées

- Indexation de 24 références documentaires et contrôle des liens de l'index : aucun lien cassé détecté.
- Lecture des en-têtes, statuts, plans et sections de clôture des documents principaux.
- Vérification que les documents continuent de distinguer exigences, prototypes, connecteurs, données persistées et fonctions non implémentées.

## Points à traiter dans une passe ultérieure

- Harmoniser les dates et statuts lorsque le texte affirme encore qu'un test ou audit est « à réaliser » alors qu'un résultat plus récent existe.
- Vérifier les références de branches historiques : elles doivent être conservées comme provenance, mais ne pas être présentées comme branches courantes.
- Comparer intégralement les passages qui se répètent avant toute fusion.
- Mettre à jour la matrice de traçabilité uniquement avec des preuves CI ou navigateur vérifiables.
- N'archiver aucun document avant validation des liens entrants et conservation de l'historique.

## Limites

Cette passe est une clarification de navigation documentaire, pas une réécriture exhaustive. Aucun document historique n'a été supprimé ou déplacé. Aucun arbitrage produit non validé n'a été transformé en décision. Aucun code du site n'a été modifié dans cette branche.

## Addendum — état des validations au 2 novembre 2026, 14:15 UTC

Les deux exécutions GitHub Actions associées aux corrections de la page de prospection et du moteur de recherche sont terminées en échec :

- [Exécution après correction du titre](https://github.com/Chexpeer/Majestios/actions/runs/41459665195) : échec du contrôle navigateur du moteur de recherche.
- [Exécution après correction de l'initialisation de la recherche](https://github.com/Chexpeer/Majestios/actions/runs/41460016382) : syntaxe JavaScript, build statique, contrôle architecture, connexion réelle BOAMP, connexion réelle BODACC et test navigateur de l'immeuble interactif réussis ; test navigateur du moteur de recherche toujours en échec.

Le dernier échec concerne l'attente de visibilité du formulaire `#rubric-opportunity-search` dans `tests/opportunity-search.browser.cjs`. La correction de la garde dans `rubric-search.js` n'a donc pas suffi à valider le parcours complet. Il faut examiner le chargement de la page testée, l'ordre d'initialisation et les sélecteurs du test avant une nouvelle modification. La phase 0 reste ouverte.

Cet addendum prévaut sur toute formulation antérieure qui pourrait laisser entendre que la suite de tests est entièrement verte. Les statuts doivent être actualisés à partir des exécutions GitHub Actions, et non d'une hypothèse.
