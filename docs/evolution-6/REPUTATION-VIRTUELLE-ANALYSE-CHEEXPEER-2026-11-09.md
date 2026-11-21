# Contrat d'analyse Cheexpeer — Réputation virtuelle — 9 novembre 2026

## Objet

Ajouter une couche d'analyse structurée entre les preuves collectées et le rapport. Le module est indépendant du fournisseur de modèle : Cheexpeer reçoit un adaptateur d'analyse injecté, puis valide intégralement sa réponse avant de produire un rapport.

## Règles non négociables

- Chaque constat cite un ou plusieurs identifiants de preuves présents dans le dossier.
- Un fait exige une correspondance du sujet confirmée.
- Les interprétations et hypothèses sont distinguées des faits.
- Une annonce BODACC est un fait de publication neutre ; elle ne prouve pas à elle seule une mauvaise réputation, une faute ou une incapacité.
- Les données administratives d'identité ne prouvent ni avis clients, ni visibilité, ni satisfaction.
- Les recommandations doivent référencer un constat valide.
- Sans preuve suffisante, l'analyse retourne zéro constat et décrit les lacunes.
- Aucun score global de réputation n'est produit dans cette version.
- Toute analyse reste soumise à validation humaine.

## Module

`supabase/functions/_shared/reputation-audit-analysis.mjs` fournit :
- prompt système Cheexpeer ;
- schéma de sortie structuré ;
- indexation des preuves en références temporaires E001, E002… ;
- validation stricte des propriétés, types, niveaux, références et liens entre constats/recommandations ;
- rapport `analysis_ready` avec validation obligatoire.

Les références E001… sont locales à un rapport ; elles ne remplacent pas les identifiants persistants des preuves.

## Limites

- Aucun fournisseur de modèle IA n'est configuré ou appelé dans ce lot.
- Le module attend un adaptateur `analyze(request)` qui sera raccordé à l'environnement d'exécution de Cheexpeer.
- Le prompt et le schéma sont testés avec des réponses simulées ; cela ne prouve pas encore la qualité d'un modèle en production.
- Aucun score, aucune action automatique, aucune persistance ni aucun déploiement ne sont activés.

## Tests

Les tests vérifient les références d'évidence, la distinction fait/interprétation, le rejet d'un constat de réputation basé uniquement sur des données administratives, l'interdiction de recommandations orphelines, la gestion du JSON invalide et le maintien de la validation humaine.
