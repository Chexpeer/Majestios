# Documentation MajestiOS — index de référence

Ce dossier contient la doctrine produit, la feuille de route, les spécifications d’architecture, les audits et les notes de veille. Comme plusieurs documents ont été rédigés à des étapes différentes, **leur ordre de priorité doit être explicite**.

## Ordre de référence

1. **[Feuille de route centrale](FEUILLE_DE_ROUTE_MAJESTIOS.md)** — référence actuelle pour l’organisation du site, les priorités et les critères d’acceptation.
2. **[Doctrine de l’intelligence apprenante](DOCTRINE_INTELLIGENCE_APPRENANTE.md)** — principes de confiance, de pédagogie, de traçabilité et d’apprentissage.
3. **[Audit structure, navigation et liens — 29 octobre 2026](audits/AUDIT_STRUCTURE_NAVIGATION_2026-10-29.md)** — état des contrôles, corrections et limites de validation.
4. **Documents d’architecture** — détails métier et propositions de conception ; ils doivent être relus à la lumière des deux références ci-dessus avant toute implémentation.
5. **Audits et notes historiques** — traces d’un état ou d’une décision à une date donnée, pas une preuve que la fonction correspondante est encore active.

## Documents d’architecture utiles

- `architecture/ARBORESCENCE_VITRINE_MODULAIRE.md` — organisation modulaire des rubriques.
- `architecture/ARCHITECTURE_CIBLE_V0.1.md` — vision technique cible.
- `architecture/RECHERCHE_CENTRALE_ET_CONVERSION_V1.md` — recherche et parcours de conversion.
- `architecture/CENTRE_CONTROLE_INTEGRATIONS.md` — intégrations et secrets.
- `architecture/INTEGRATION_BODACC_BUSINESS_V0_1.md` — signaux BODACC et module Business.
- `architecture/REGLES_IA_HYPOTHESES_INTERDITES_V0.1.md` — garde-fous de qualification et d’inférence.

## Règles de maintenance documentaire

- Une évolution importante commence par vérifier la feuille de route et la doctrine.
- Tout document de conception doit distinguer **actif**, **en préparation**, **proposé** et **historique**.
- Une source, une API ou une fonction ne peut être marquée « active » sans vérification technique correspondante.
- Les anciennes propositions ne sont pas supprimées automatiquement : elles sont conservées comme historique, mais ne doivent pas contredire silencieusement la référence actuelle.
- Après une modification structurelle, mettre à jour la feuille de route ou l’audit concerné et ajouter les contrôles pertinents aux tests automatisés.
