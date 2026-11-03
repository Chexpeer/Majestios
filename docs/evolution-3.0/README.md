# Documentation — Évolution 3.0

La branche `evolution-3.0` est la branche de travail des évolutions critiques de MajestiOS. La branche `evolution-2.0` est conservée comme sauvegarde de référence.

## Documents actifs de cette étape

- [Dossier de migration et décisions de cadrage](MIGRATION-EVOLUTION-3.0.md) — audit préalable, état de migration, décisions reprises et arbitrages ouverts.
- [Architecture API cible](ARCHITECTURE-API-CIBLE.md) — architecture logique, modèle conceptuel, API, événements, sécurité, flux et migration technique.
- [Étape A — Architecture fonctionnelle et frontières des modules](ETAPE-A-ARCHITECTURE-FONCTIONNELLE.md) — responsabilités, périmètres de confiance, échanges autorisés et arbitrages à valider.\n- [Audit comparatif des choix techniques](AUDIT-COMPARATIF-TECHNIQUE.md) — comparaison backend, base, authentification, isolation multi-tenant, événements, exploitation et recommandation à valider.

## Références fonctionnelles héritées

Les documents fondateurs de 2.0 sont conservés et référencés sans être réécrits :

- [Cahier des charges fondateur](../evolution-2.0/CAHIER-DES-CHARGES-FONDATEUR.md)
- [Audit de l'existant — phase 1](../evolution-2.0/AUDIT-EXISTANT-PHASE-1.md)
- [Cartographie fonctionnelle des flux](../evolution-2.0/CARTOGRAPHIE-FONCTIONNELLE-FLUX.md)
- [Gouvernance des interventions](../evolution-2.0/GOUVERNANCE-INTERVENTIONS.md)

## Règle de priorité

Les décisions explicites les plus récentes du porteur de projet priment. Les documents 2.0 restent la référence fonctionnelle héritée ; les documents 3.0 précisent la cible technique et les évolutions validées. Toute contradiction est signalée pour arbitrage. Une proposition d'architecture n'est pas une décision technique tant qu'elle n'est pas validée.

Aucun document de ce dossier ne signifie que l'API, le CRM, l'authentification, la base de données ou les flux sont déjà opérationnels.
