# Instructions de travail pour les agents IA — MajestiOS

## 0. Alerte prioritaire — anomalies critiques

Avant toute intervention, lire obligatoirement [le dossier central des anomalies critiques](docs/CRITIQUES/README.md), puis le registre détaillé de la branche active. Ce point d'entrée est commun à tous les agents et développeurs ; il centralise les risques, les priorités, les statuts et les règles de correction.

**Chantier en cours au 9 novembre 2026 :** la branche autorisée est `Evolution-7`. Pour ce chantier, ses décisions et documents datés les plus récents prévalent sur les descriptions historiques V5 lorsqu'ils divergent. Ne pas modifier `main`, une branche historique ou une autre branche sans autorisation explicite.

La boucle obligatoire est : **détecter → qualifier → corriger → tester → documenter → enregistrer**. Distinguer systématiquement anomalie confirmée, évolution produit et recette non effectuée. Ne jamais présenter une recette non exécutée comme validée.


Ce fichier est le point d'entrée canonique pour tout assistant ou agent intervenant dans ce dépôt.

## 1. Lecture obligatoire

Avant toute intervention sur la branche autorisée, identifier le dépôt, la branche, le HEAD et la PR éventuelle, puis lire dans cet ordre :
1. `README.md` et les instructions du dossier concerné ;
2. `docs/CRITIQUES/README.md` et le registre détaillé de la branche active ;
3. `docs/README.md` ;
4. `docs/evolution-5.0/README.md` ;
5. `docs/evolution-5.0/MAJESTIOS-V5-REFERENCE.md` comme référence historique et de cadrage, en vérifiant les décisions plus récentes ;
6. `docs/evolution-5.0/FILIATION-DOCUMENTAIRE-V2-A-V5.md` ;
7. les documents utiles au lot et à la branche active.

Pour comprendre une décision historique, consulter directement la branche source correspondante. Ne pas recopier les anciens dossiers dans V5 et ne pas prendre une proposition historique pour une décision actuelle.

Ne jamais se fier uniquement aux conversations ou à la documentation ancienne. Vérifier l'état réel du dépôt, les tests et les limites de vérification.

## 2. Branches et préservation

- `evolution-2.0`, `evolution-3.0` et `evolution-4.0` sont des branches sources historiques ; ne pas les modifier dans le cadre des travaux V5.
- `evolution-5.0` est la branche source V5 d'origine à préserver ; elle porte l'état de construction et les décisions historiques du projet.
- `evolution-5.0-clean-preview` était la reconstruction utilisée pour la PR #38 ; cette PR a été fusionnée dans `main` le 6 novembre 2026. La branche est conservée comme référence historique et ne doit pas être réécrite.
- `evolution-5.0-admin-cockpit` est la branche de réalisation du premier cockpit d’administration, créée depuis le `main` actualisé après la fusion de la PR #38. Elle ne remplace pas la branche source `evolution-5.0`.
- Sur toute autre branche, ne pas présumer qu'elle est la branche de travail autorisée : vérifier son objectif et la PR associée avant d'écrire.
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
- **Cheexpeer est l’agent IA transversal de MajestiOS**, avec une identité unique et quatre espaces complémentaires : chat utilisateurs ; tableau de bord admin privilégié pour dialoguer directement avec l'agent, piloter ses tâches, consulter les alertes et valider les actions ; Supabase/CRM pour les données métier ; GitHub pour le code et le développement. Le tableau de bord admin est le poste de supervision de l'agent, pas un accès implicite à toutes les données ou tous les systèmes.
- Les quatre espaces partagent une orchestration et une capitalisation gouvernée, mais chaque connecteur conserve ses permissions, son contexte, ses journaux et ses limites. Ne jamais exposer une clé `service_role` ou un jeton GitHub au modèle ; passer par des outils serveur à droits minimaux.
- Cheexpeer doit progressivement assurer l'archivage, l'historisation, la recherche dans les décisions et preuves, la capitalisation des enseignements vérifiés, la détection d'anomalies, la préparation de corrections et l'optimisation ergonomique. « Apprentissage » désigne une capitalisation contrôlée, pas un entraînement autonome du modèle ni une modification autonome de ses règles.
- Boucle de travail : observer → comprendre → proposer → agir dans le périmètre autorisé → tester → historiser → capitaliser. Sécurité proportionnée et peu visible : session persistante avec renouvellement automatique, contrôles serveur, messages compréhensibles et reprise guidée. Éviter les reconnexions et confirmations répétées pour les tâches courantes ; demander validation pour les actions sensibles, irréversibles, financières, de diffusion, de droits, de fusion ou de production.
- SEO et visibilité : considérer la veille des moteurs, l'audit continu, les recommandations et l'amélioration contrôlée comme des capacités transversales de l'administration et de Cheexpeer, pas comme un simple contenu éditorial.
- Les offres d'emploi MajestiOS proviennent des utilisateurs ou de l'équipe ; les sources externes Cadremploi, France Travail et APEC restent différées.
- BODACC : le périmètre métier V5 comprend les créations et débuts d'activité, ventes/cessions/reprises, modifications, difficultés et procédures collectives, ainsi que radiations et cessations. Ces familles sont exposées dans le catalogue ; leur couverture réelle doit être vérifiée par famille et par filtre. L'immobilier professionnel reste une piste prévue, non active tant qu'une source fiable et autorisée n'est pas raccordée.
- Les cinq catégories BOAMP doivent être choisies après mesure réelle des volumes puis validées par le porteur du projet.

## 5. Règles techniques et vérité

- **Convention des variables d'environnement Cheexpeer :** utiliser exclusivement le préfixe `CHEEXPEER_*`, notamment `CHEEXPEER_WORKER_SECRET`, `CHEEXPEER_WORKER_ID`, `CHEEXPEER_POLL_MS` et `CHEEXPEER_LEASE_SECONDS`. Toute nouvelle intégration doit reprendre exactement cette graphie. Le secret partagé porte le même nom côté worker et côté fonction Edge. Cette convention est distincte des identifiants de fonctions/tables `cheexpeer_*` et de l'en-tête HTTP `x-cheexpeer-worker-secret`.

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

**Règle de conduite :** « Si tu commets une erreur, regarde le rétroviseur avant de faire marche arrière. » Comprendre l'origine avant de corriger ; sauvegarder avant de risquer ; vérifier avant d'affirmer. Toute IA doit laisser un compte rendu vérifiable des changements, tests, limites et suites. L'audit, l'analyse, l'harmonisation, la correction et l'optimisation forment une boucle intégrée et itérative : constater, comprendre, remettre en cohérence, corriger, améliorer, vérifier et capitaliser. Aucun de ces travaux ne doit être conduit isolément des autres.
