# Instructions de travail pour les agents IA — MajestiOS

Ce fichier est le point d'entrée canonique pour tout assistant ou agent intervenant dans ce dépôt.

## 1. Lecture obligatoire

Pour toute intervention sur la branche active `evolution-5.0`, lire dans cet ordre :
1. `README.md` et les instructions du dossier concerné ;
2. `docs/evolution-5.0/README.md` ;
3. `docs/evolution-5.0/ARBORESCENCE-CIBLE-V5.md` ;
4. `docs/evolution-5.0/EXPERIENCE-IMMERSIVE-ET-ETAGES.md` ;
5. `docs/evolution-5.0/ARCHITECTURE-FONCTIONNELLE-CIBLE.md` et `ROADMAP-ET-GOUVERNANCE.md` ;
6. les documents hérités de référence : `docs/evolution-2.0/CAHIER-DES-CHARGES-FONDATEUR.md`, `AUDIT-EXISTANT-PHASE-1.md`, `CARTOGRAPHIE-FONCTIONNELLE-FLUX.md` et `GOUVERNANCE-INTERVENTIONS.md` ;


Ne jamais se fier uniquement aux conversations ou à la documentation ancienne. Vérifier l'état réel du dépôt, les tests et les limites de vérification.

## 2. Branches et préservation

- `evolution-2.0` est conservée comme sauvegarde de référence ; ne pas y apporter les évolutions de la V5.
- `evolution-3.0` est conservée comme base de référence ; `evolution-5.0` est la branche de travail active pour les évolutions V5.
- Ne jamais réécrire l'historique, supprimer ou écraser une branche de référence.
- Ne pas fusionner, promouvoir ou déployer sans autorisation explicite.
- Aucun changement de production ou de configuration Vercel sans autorisation spécifique.

## 3. Méthode obligatoire

Avant toute modification : auditer l'existant et les changements récents, lire les documents actifs, vérifier faisabilité et dépendances, identifier contradictions, risques, coûts et impacts, puis définir une méthode réversible et testable. Distinguer faits, résultats vérifiés, hypothèses, propositions et décisions validées.

Après autorisation : limiter le périmètre, préserver les acquis, exécuter les contrôles pertinents, comparer au résultat initial, documenter les écarts et rapporter exactement les fichiers, tests, limites et risques. Ne jamais masquer un échec.

## 4. Règles de conception MajestiOS

- Le CRM est le référentiel commercial central de MajestiOS, mais le CRM interne est strictement distinct des espaces clients.
- Publication, CRM, Veille et Prospection active sont des circuits distincts. Aucun transfert automatique par défaut.
- Toute transmission conserve provenance, date, motif, finalité, règle d'autorisation, destination, statut et résultat.
- Les codes APE/NAF ne prouvent ni compétence ni capacité à répondre à un marché.
- Les annonces utilisateurs sont soumises à contrôle et modération ; leur publication n'autorise pas la réutilisation générale des données de l'auteur.
- Les espaces clients sont cloisonnés entre eux et du CRM interne.
- MajestiOS V.5 est l'intelligence centrale du site : elle coordonne les fonctionnalités, les analyses, les automatisations et les interactions sous les permissions et validations du projet.
- SEO et visibilité : considérer la veille des moteurs, l'audit continu, les recommandations et l'amélioration contrôlée comme des capacités transversales de l'administration IA, pas comme un simple contenu éditorial.
- Les offres d'emploi MajestiOS proviennent des utilisateurs ou de l'équipe ; les sources externes Cadremploi, France Travail et APEC restent différées.
- BODACC : le périmètre métier V5 comprend les créations et débuts d'activité, ventes/cessions/reprises, modifications, difficultés et procédures collectives, ainsi que radiations et cessations. Ces familles sont exposées dans le catalogue ; leur couverture réelle doit être vérifiée par famille et par filtre. L'immobilier professionnel reste une piste prévue, non active tant qu'une source fiable et autorisée n'est pas raccordée.
- Les cinq catégories BOAMP doivent être choisies après mesure réelle des volumes puis validées par le porteur du projet.

## 5. Règles techniques et vérité

- L'architecture cible 3.0 est une proposition documentaire, pas un système implémenté.
- Ne pas annoncer une API, une base, une authentification, un CRM ou un événement métier comme opérationnel sans preuve.
- Ne pas exposer de secrets fournisseurs dans le frontend.
- Appliquer authentification et autorisation côté serveur ; tester explicitement les accès interdits.
- Ne pas choisir de technologie majeure, de stratégie multi-tenant ou de fournisseur sans audit comparatif et validation.
- Les diagrammes Mermaid représentent la cible, pas l'état du prototype.
- Les contrats OpenAPI proposés doivent être distingués des endpoints réellement disponibles.

## 6. Documentation

La référence centrale active V5 est `docs/evolution-5.0/MAJESTIOS-V5-REFERENCE.md`. Son index est `docs/README.md`. Les documents `docs/evolution-3.0/` restent une référence historique de la base. Les documents `docs/evolution-2.0/` sont les références fonctionnelles héritées et la sauvegarde documentaire de l'étape précédente. L'historique est consultatif et ne réintroduit aucune ancienne orientation sans arbitrage.

Les documents et comptes rendus sont rédigés en français clair. `AGENTS.md` reste la source canonique des consignes.
