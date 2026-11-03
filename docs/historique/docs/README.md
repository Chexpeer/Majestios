# Documentation MajestiOS

**Index documentaire — 2 novembre 2026**  
**Périmètre :** prototype statique et conception de la future plateforme.

Cet index désigne le document de référence par sujet. Les documents restent à la racine pour préserver les liens historiques. Le classement ci-dessous est logique ; aucun déplacement ni suppression n'est effectué dans cette passe.

## 1. Références faisant autorité

| Sujet | Référence principale | Documents complémentaires |
|---|---|---|
| Vision, positionnement, arbitrages produit | [Cahier des charges maître](../CAHIER-DES-CHARGES-MAITRE-MAJESTIOS.md) | [Reprise IA](../DOCUMENTATION-REPRISE-IA-MAJESTIOS.md) |
| Continuité de projet et consignes de reprise | [Reprise IA](../DOCUMENTATION-REPRISE-IA-MAJESTIOS.md) | README, cahier des charges maître |
| Parcours et comportements attendus | [Spécification fonctionnelle détaillée](../SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md) | [Parcours depuis une annonce](../SPEC-PARCOURS-DEPUIS-ANNONCE-MAJESTIOS.md) |
| Pages, navigation et dépendances du site | [Arborescence](../ARBORESCENCE-MAJESTIOS.md) | [Dossiers fonctionnels](../DOSSIERS-MAJESTIOS.md) |
| Exigences, statut et preuves de validation | [Matrice de traçabilité](../MATRICE-TRAÇABILITE-EXIGENCES-MAJESTIOS.md) | Rapports d'audit datés |
| Collecte, normalisation et traitement des signaux | [Traitement des opportunités](../TRAITEMENT-OPPORTUNITES-MAJESTIOS.md) | [Cahier des charges de veille](../CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md), [BODACC](../BODACC-TRAITEMENT-SIGNAUX-COMMERCIAUX.md) |
| Sources et alimentation du CRM | [Registre des ressources CRM](../REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md) | Cahier de veille |
| Modèle métier CRM partagé | [Modèle commun de données CRM](../MODELE-COMMUN-DONNEES-CRM-MAJESTIOS.md) | [Modèle appels d'offres](../MODELE-DONNEES-APPELS-OFFRES.md), [Cartographie données](../CARTOGRAPHIE-DONNEES-STATISTIQUES-MAJESTIOS.md) |
| Statistiques et qualité des indicateurs | [Cartographie des données statistiques](../CARTOGRAPHIE-DONNEES-STATISTIQUES-MAJESTIOS.md) | [Plan pilote](../PLAN-PILOTE-STATISTIQUES-MAJESTIOS.md), [Modèle de valorisation](../MODELE-VALORISATION-DONNEES-ET-ETUDES-COMMERCIALES-MAJESTIOS.md) |

## 2. Ordre de lecture recommandé

1. [README du dépôt](../README.md) — démarrage du prototype et limites techniques.
2. [Documentation de reprise IA](../DOCUMENTATION-REPRISE-IA-MAJESTIOS.md) — contexte et consignes.
3. [Cahier des charges maître](../CAHIER-DES-CHARGES-MAITRE-MAJESTIOS.md) — vision et décisions produit.
4. [Spécification fonctionnelle détaillée](../SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md) — parcours et critères.
5. [Arborescence](../ARBORESCENCE-MAJESTIOS.md) — organisation du site.
6. [Matrice de traçabilité](../MATRICE-TRAÇABILITE-EXIGENCES-MAJESTIOS.md) — état et preuves.
7. Consulter ensuite les documents spécialisés du tableau de référence ci-dessus selon le sujet traité.

## 3. Classement complet des documents

### Produit et expérience
- [Cahier des charges maître](../CAHIER-DES-CHARGES-MAITRE-MAJESTIOS.md)
- [Documentation de reprise IA](../DOCUMENTATION-REPRISE-IA-MAJESTIOS.md)
- [Spécification fonctionnelle détaillée](../SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md)
- [Parcours depuis une annonce](../SPEC-PARCOURS-DEPUIS-ANNONCE-MAJESTIOS.md)
- [Dossiers fonctionnels](../DOSSIERS-MAJESTIOS.md)
- [Arborescence du site](../ARBORESCENCE-MAJESTIOS.md)

### Veille, collecte et signaux
- [Cahier des charges de veille stratégique](../CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md)
- [Traitement des signaux BODACC](../BODACC-TRAITEMENT-SIGNAUX-COMMERCIAUX.md)
- [Traitement des opportunités](../TRAITEMENT-OPPORTUNITES-MAJESTIOS.md)

### Données, CRM et qualification
- [Modèle commun de données CRM](../MODELE-COMMUN-DONNEES-CRM-MAJESTIOS.md)
- [Modèle de données des appels d'offres](../MODELE-DONNEES-APPELS-OFFRES.md)
- [Registre des ressources d'alimentation CRM](../REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md)
- [Plan de chantier recherche et données CRM](../PLAN-CHANTIER-RECHERCHE-DONNEES-CRM.md)
- [Suivi de la dynamique économique des entreprises](../SPEC-SUIVI-DYNAMIQUE-ECONOMIQUE-ENTREPRISES-MAJESTIOS.md)

### Statistiques et valorisation
- [Cartographie des données et statistiques](../CARTOGRAPHIE-DONNEES-STATISTIQUES-MAJESTIOS.md)
- [Plan pilote statistiques](../PLAN-PILOTE-STATISTIQUES-MAJESTIOS.md)
- [Modèle de valorisation des données et études commerciales](../MODELE-VALORISATION-DONNEES-ET-ETUDES-COMMERCIALES-MAJESTIOS.md)

### Gouvernance et audit
- [Matrice de traçabilité des exigences](../MATRICE-TRAÇABILITE-EXIGENCES-MAJESTIOS.md)
- [Rapport d'audit lot 01 — 1er novembre 2026](../RAPPORT-AUDIT-LOT-01-2026-11-01.md)

## 4. Chevauchements repérés et règle de résolution

Ces documents traitent de sujets voisins, mais ne doivent pas être fusionnés aveuglément :

- **README / reprise IA / cahier des charges maître** : le README décrit comment lancer le prototype ; la reprise IA transmet le contexte et les consignes ; le cahier maître porte la vision et les décisions produit.
- **Spécification fonctionnelle / parcours depuis une annonce / traitement des opportunités** : la première définit les parcours transversaux ; le document « annonce » détaille un parcours précis ; « traitement » décrit la chaîne de données et les opérations internes.
- **Arborescence / dossiers fonctionnels** : l'arborescence décrit les pages et dépendances actuelles ; les dossiers décrivent les domaines fonctionnels. Les dossiers ne sont pas des répertoires CRM persistants.
- **Modèle appels d'offres / modèle commun CRM / cartographie statistiques** : le premier normalise les annonces et résultats ; le second définit les objets métier partagés ; la cartographie identifie les champs, lacunes et prérequis statistiques.
- **Registre ressources / cahier de veille** : le registre suit les sources et leur état ; le cahier de veille définit le périmètre des signaux à étudier.

La règle est de corriger le document de référence puis de faire pointer les documents complémentaires vers lui. Ne pas maintenir plusieurs versions concurrentes d'une même décision.

## 5. Règles de statut et de mise à jour

- **Décision produit** : seule une décision explicitement validée doit être marquée comme établie. Une proposition reste une proposition.
- **Fonctionnalité** : une description ou une maquette ne prouve pas l'implémentation. Vérifier le code, les tests et les parcours.
- **Source de données** : distinguer source candidate, source testée, connecteur actif et données effectivement persistées.
- **Rapport daté** : un audit est un instantané. Le conserver avec sa date et son commit ; ne pas le présenter comme l'état actuel sans revalidation.
- **Modification documentaire** : mettre à jour le document de référence, la date/version, les liens entrants et la matrice si le statut d'une exigence change.
- **Archivage** : aucune suppression avant comparaison intégrale, vérification des références et conservation de l'historique Git.

## 6. Limites de cette passe

Cette passe clarifie la hiérarchie et les recouvrements visibles. Elle ne réécrit pas encore le contenu de fond des documents spécialisés, ne valide pas les arbitrages du Fondateur et n'archive aucun fichier. Les contradictions factuelles éventuelles doivent être résolues par comparaison des passages concernés et du code actuel.
