# Documentation — Évolution 3.0

Ce dossier conserve les documents de référence produits pour la branche `evolution-3.0`. Les évolutions actuelles sont menées sur `evolution-5.0` ; la branche source `evolution-3.0` reste préservée.

## Documents actifs de cette étape

- [Dossier de migration et décisions de cadrage](MIGRATION-EVOLUTION-3.0.md) — audit préalable, état de migration, décisions reprises et arbitrages ouverts.
- [Architecture API cible](ARCHITECTURE-API-CIBLE.md) — architecture logique, modèle conceptuel, API, événements, sécurité, flux et migration technique.
- [Étape A — Architecture fonctionnelle et frontières des modules](ETAPE-A-ARCHITECTURE-FONCTIONNELLE.md) — responsabilités, périmètres de confiance, échanges autorisés et arbitrages à valider.
- [Étape B — Modèle conceptuel des données et cloisonnement](ETAPE-B-MODELE-DONNEES-CLOISONNEMENT.md) — propriété des données, entités, séparation CRM/clients et corpus documentaire, modèle de tenant et tests de sécurité à valider.
- [Étape C — Contrats API, échanges et événements](ETAPE-C-CONTRATS-API-EVENEMENTS.md) — conventions REST/JSON, autorisation, transmissions, enveloppes d'événements, idempotence, reprise et tests contractuels à valider.
- [Audit comparatif des choix techniques](AUDIT-COMPARATIF-TECHNIQUE.md) — comparaison backend, base, authentification, isolation multi-tenant, événements, exploitation et recommandation à valider.

## Références fonctionnelles héritées

Les documents fondateurs de 2.0 restent des références héritées :

- [Cahier des charges fondateur](../evolution-2.0/CAHIER-DES-CHARGES-FONDATEUR.md)
- [Audit de l'existant — phase 1](../evolution-2.0/AUDIT-EXISTANT-PHASE-1.md)
- [Cartographie fonctionnelle des flux](../evolution-2.0/CARTOGRAPHIE-FONCTIONNELLE-FLUX.md)
- [Gouvernance des interventions](../evolution-2.0/GOUVERNANCE-INTERVENTIONS.md)

## Règle de priorité

Les décisions explicites les plus récentes du porteur de projet priment. Les documents 2.0 restent la référence fonctionnelle héritée ; les documents 3.0 précisent la cible technique et les évolutions validées. Toute contradiction est signalée pour arbitrage. Une proposition d'architecture n'est pas une décision technique tant qu'elle n'est pas validée.

Les documents de ce dossier ont été alignés sur la terminologie de référence de la branche V5 ; la branche source `evolution-3.0` reste intacte. Aucun document ne signifie que l'API, le CRM, l'authentification, la base de données ou les flux sont déjà opérationnels.
