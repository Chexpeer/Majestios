# Instructions de travail pour les agents IA — MajestiOS

Ce fichier est le point d'entrée commun destiné aux assistants et agents de développement qui interviennent dans ce dépôt.

## 1. Lire avant d'agir

Avant toute analyse ou intervention :
1. Lire `README.md` pour comprendre le dépôt et ses commandes.
2. Lire `docs/evolution-2.0/CAHIER-DES-CHARGES-FONDATEUR.md`.
3. Examiner l'état réel du code et de la branche de travail ; ne jamais déduire l'architecture à partir d'anciennes conversations ou d'hypothèses.
4. Vérifier les instructions complémentaires éventuellement présentes dans les sous-dossiers.

## 2. Règle de préservation

La branche `evolution-2.0` est un espace de travail isolé créé à partir de `chat-est-une-ordure-sans-docs`.

Tant que le porteur du projet n'a pas explicitement autorisé une étape de réalisation :
- ne modifier ni le site existant ni son comportement ;
- ne toucher à aucune branche source ;
- ne fusionner aucune branche ;
- ne déployer aucun changement ;
- ne modifier aucune configuration de production ;
- ne supprimer ni remplacer des acquis existants.

Les modifications documentaires explicitement demandées sont autorisées sur cette branche. Toute modification du code nécessite une autorisation distincte et explicite.

## 3. Règles de vérité

- Distinguer les faits observés, les hypothèses, les propositions et les décisions validées.
- Ne jamais présenter une fonctionnalité comme opérationnelle sans l'avoir vérifiée.
- Ne pas inventer de catégories de recherche, de règles métier, de sources, de tarifs ou de fonctionnalités.
- Signaler les informations manquantes au lieu de les compléter par supposition.
- Préserver les liens entre opportunités, entreprises, sources et actions commerciales.
- Documenter les limites, erreurs, risques et résultats des vérifications.

## 4. Méthode de travail

Pour toute tâche :
1. Reformuler brièvement l'objectif et le périmètre.
2. Inspecter les fichiers concernés avant toute modification.
3. Proposer un plan limité et réversible.
4. Ne modifier que ce qui est autorisé.
5. Exécuter les contrôles pertinents et rapporter ceux qui n'ont pas pu être exécutés.
6. Résumer les fichiers modifiés, les résultats, les risques et les suites proposées.

Ne jamais masquer un échec de test ou une limite d'environnement.

## 5. Architecture et décisions

Le CRM est le référentiel central de la plateforme. Recherche, collecte, veille, analyse, qualification, prospection, publication et espaces clients sont des fonctions coordonnées. Le cahier des charges fondateur précise les principes et les éléments restant à arbitrer.

Ne pas choisir ou introduire une technologie, une base de données, un service externe ou une dépendance majeure sans analyse de compatibilité, de sécurité, de coût et sans validation du porteur du projet.

## 6. Données, sécurité et conformité

- Respecter le cloisonnement entre données internes MajestiOS et espaces clients.
- Ne jamais exposer les données d'un client à un autre.
- Ne pas publier automatiquement toutes les données collectées.
- Vérifier les conditions d'utilisation des sources et les règles applicables aux données personnelles et à la prospection.
- Ne jamais inscrire de secrets, clés ou identifiants dans le dépôt.
- Préserver la provenance et l'historique des données.

## 7. Langue et documentation

La documentation fonctionnelle et les comptes rendus destinés au porteur du projet sont rédigés en français clair. Les noms techniques peuvent rester dans leur langue d'origine.

En cas de contradiction entre une supposition d'agent et une décision explicitement validée par le porteur du projet, la décision validée prévaut. Si deux documents validés se contredisent, signaler le conflit et demander arbitrage plutôt que choisir arbitrairement.

## 8. Compatibilité des agents

`AGENTS.md` est le guide canonique de ce dépôt. Les outils qui ne reconnaissent pas ce format doivent recevoir ces consignes par leur mécanisme d'instructions propre. Les éventuels fichiers d'adaptation (par exemple pour un IDE ou un agent donné) devront renvoyer à ce guide et ne pas créer une seconde source de vérité.
