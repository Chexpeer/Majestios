# Instructions de travail pour les agents IA — MajestiOS

Ce fichier est le point d'entrée canonique pour tout assistant ou agent intervenant dans ce dépôt.

## 1. Lecture obligatoire

Pour toute intervention sur la branche active `evolution-5.0`, lire dans cet ordre :
1. `README.md` et les instructions du dossier concerné ;
2. `docs/README.md` ;
3. `docs/evolution-5.0/README.md` ;
4. `docs/evolution-5.0/MAJESTIOS-V5-REFERENCE.md` ;
5. `docs/evolution-5.0/FILIATION-DOCUMENTAIRE-V2-A-V5.md` ;
6. les documents V5 utiles au lot concerné.

Pour comprendre une décision historique, consulter directement la branche source correspondante. Ne pas recopier les anciens dossiers dans V5 et ne pas prendre une proposition historique pour une décision actuelle.

Ne jamais se fier uniquement aux conversations ou à la documentation ancienne. Vérifier l'état réel du dépôt, les tests et les limites de vérification.

## 2. Branches et préservation

- `evolution-2.0`, `evolution-3.0` et `evolution-4.0` sont des branches sources historiques ; ne pas les modifier dans le cadre des travaux V5.
- `evolution-5.0` est la branche de travail active pour les évolutions V5.
- Ne jamais réécrire l'historique, supprimer ou écraser une branche de référence.
- Ne pas fusionner, promouvoir ou déployer sans autorisation explicite.
- Aucun changement de production ou de configuration Vercel sans autorisation spécifique.

## 3. Méthode obligatoire

Avant toute modification : auditer l'existant et les changements récents, lire les documents actifs, vérifier faisabilité et dépendances, identifier contradictions, risques, coûts et impacts, puis définir une méthode réversible et testable. Distinguer faits, résultats vérifiés, hypothèses, propositions et décisions validées.

Après autorisation : limiter le périmètre, préserver les acquis, exécuter les contrôles pertinents, comparer au résultat initial, documenter les écarts et rapporter exactement les fichiers, tests, limites et risques. Ne jamais masquer un échec.

## 4. Règles de conception MajestiOS

- Le CRM est le référentiel commercial central de MajestiOS, mais le CRM interne est strictement distinct des espaces clients.
- Publication, CRM, veille et Prospection sont des circuits distincts. Aucun transfert automatique par défaut.
- Toute transmission conserve provenance, date, motif, finalité, règle d'autorisation, destination, statut et résultat.
- Les codes APE/NAF ne prouvent ni compétence ni capacité à répondre à un marché.
- Les annonces utilisateurs sont soumises à contrôle et modération ; leur publication n'autorise pas la réutilisation générale des données de l'auteur.
- Les espaces clients sont cloisonnés entre eux et du CRM interne.
- MajestiOS V.5 est l'intelligence centrale du site : elle coordonne les fonctionnalités, les analyses, les automatisations et les interactions sous les permissions et validations du projet.
- SEO et visibilité : considérer la veille des moteurs, l'audit continu, les recommandations et l'amélioration contrôlée comme des capacités transversales de l'administration de MajestiOS V.5, pas comme un simple contenu éditorial.
- Les offres d'emploi MajestiOS proviennent des utilisateurs ou de l'équipe ; les sources externes Cadremploi, France Travail et APEC restent différées.
- BODACC : le périmètre métier V5 comprend les créations et débuts d'activité, ventes/cessions/reprises, modifications, difficultés et procédures collectives, ainsi que radiations et cessations. Ces familles sont exposées dans le catalogue ; leur couverture réelle doit être vérifiée par famille et par filtre. L'immobilier professionnel reste une piste prévue, non active tant qu'une source fiable et autorisée n'est pas raccordée.
- Les cinq catégories BOAMP doivent être choisies après mesure réelle des volumes puis validées par le porteur du projet.

## 5. Règles techniques et vérité

- Les architectures et modèles documentés sont des cibles tant que leur réalisation n'est pas prouvée.
- Ne pas annoncer une API, une base, une authentification, un CRM ou un événement métier comme opérationnel sans preuve.
- Ne pas exposer de secrets fournisseurs dans le frontend.
- Appliquer authentification et autorisation côté serveur ; tester explicitement les accès interdits.
- Ne pas choisir de technologie majeure, de stratégie multi-tenant ou de fournisseur sans audit comparatif et validation.
- Les diagrammes Mermaid représentent la cible, pas l'état du prototype.
- Les contrats OpenAPI proposés doivent être distingués des endpoints réellement disponibles.

## 6. Documentation

La référence centrale active V5 est `docs/evolution-5.0/MAJESTIOS-V5-REFERENCE.md`. Son index est `docs/README.md`. La filiation documentaire est décrite dans `docs/evolution-5.0/FILIATION-DOCUMENTAIRE-V2-A-V5.md`. Les sources V2, V3 et V4 restent sur leurs branches historiques et ne sont pas recopiées dans V5. Le dossier `docs/historique/` conserve des archives thématiques consultatives ; il ne remplace pas les branches sources.

Les documents et comptes rendus sont rédigés en français clair. `AGENTS.md` reste la source canonique des consignes.

## 7. Nettoyage, sauvegardes et continuité

Appliquer systématiquement le protocole `docs/evolution-5.0/MAINTENANCE-ET-CONTINUITE.md` : identifier branche et HEAD, examiner le diff et les contrôles récents, sécuriser un point de retour avant une intervention risquée, travailler par lots maîtrisés, vérifier le résultat et actualiser la documentation. Ne jamais supprimer, réinitialiser, forcer une branche ou revenir en arrière sans avoir examiné l'historique et identifié une restauration sûre.

**Règle de conduite :** « Si tu commets une erreur, regarde le rétroviseur avant de faire marche arrière. » Comprendre l'origine avant de corriger ; sauvegarder avant de risquer ; vérifier avant d'affirmer. Toute IA doit laisser un compte rendu vérifiable des changements, tests, limites et suites.
