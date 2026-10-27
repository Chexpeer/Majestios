# Feuille de route de progression et de traçabilité — MajestiOS

- **Version :** 0.1
- **Date :** 27 octobre 2026
- **Branche de référence :** `architecture-v0-1`
- **Statut :** document de travail — à faire évoluer au fil des constats
- **Objet :** organiser les évolutions, limiter les régressions et permettre à tout intervenant de comprendre les décisions prises.

## 1. Règles de travail

1. **Comprendre avant de modifier.** Lire les fichiers concernés, identifier leurs dépendances et vérifier l'existant avant chaque intervention.
2. **Pas de régression volontaire.** Préserver les comportements validés. Toute suppression ou modification de comportement doit être justifiée, documentée et vérifiable.
3. **Petites étapes vérifiables.** Privilégier des changements cohérents, limités et faciles à relire plutôt qu'une refonte générale.
4. **Traçabilité systématique.** Pour chaque évolution, noter le besoin, les fichiers concernés, la raison, les vérifications effectuées, le résultat et les éventuelles limites.
5. **Ne pas confondre prévu et réalisé.** Une fonctionnalité est indiquée comme opérationnelle seulement si son parcours réel a été vérifié.
6. **Langage accessible.** Employer des mots précis et compréhensibles. Réserver « appel d'offres », « marché », « projet », « mission », « entreprise à reprendre » ou « signal à examiner » au contexte approprié ; éviter d'utiliser « opportunité » comme terme générique.
7. **Modularité utile.** Séparer les responsabilités lorsque cela clarifie le code et facilite l'ajout futur de fonctions, sans multiplier les couches inutilement.
8. **Respect du périmètre.** La sécurité, les coûts, les conditions contractuelles, les chiffres annoncés et la réglementation feront l'objet d'un audit approfondi distinct au stade approprié. Les risques manifestes découverts pendant le développement doivent néanmoins être consignés et signalés.

## 2. Contraintes techniques retenues

- **Supabase : hors périmètre pour le moment.** Ne pas l'installer, le connecter ni bâtir de nouvelles fonctions autour de lui sans décision explicite.
- Ne pas choisir prématurément une base de données ou un fournisseur. Documenter le besoin, les options et les conséquences avant de décider.
- Garder les secrets côté serveur et ne jamais inscrire de clé privée dans le dépôt ou dans le navigateur.
- Ne pas traiter les maquettes, données d'exemple ou fonctions locales comme des services réellement connectés.
- Les déploiements Vercel seront utilisés comme points de contrôle visuels, une fois les étapes correspondantes prêtes. Ils ne constituent pas à eux seuls une preuve de fonctionnement complet.

## 3. Phases de travail

### Phase 0 — État des lieux vérifiable
**But :** établir une référence avant toute modification fonctionnelle.

- Recenser les pages, routes API, scripts, composants, documents et dépendances.
- Distinguer : opérationnel vérifié, partiellement vérifié, démonstratif, prévu, bloqué et inconnu.
- Identifier les tests existants, les commandes de contrôle et les principales dépendances entre modules.
- Relier les exigences du référentiel MajestiOS aux documents d'architecture et au code réellement présent.
- Établir les parcours de référence à ne pas casser, notamment la consultation des appels d'offres publics.

**Livrables :** inventaire daté, matrice de traçabilité initiale, liste priorisée des écarts et risques techniques connus.

**Condition de sortie :** les zones à modifier et les vérifications possibles sont identifiées ; aucune fonctionnalité n'est déclarée validée sans preuve.

### Phase 1 — Clarification du vocabulaire et de l'expérience publique
**But :** rendre le produit plus simple à comprendre sans masquer ses limites.

- Réviser les libellés, titres, descriptions et appels à l'action pour réduire les répétitions.
- Distinguer clairement données réelles, exemples, hypothèses et fonctions en développement.
- Vérifier les parcours de recherche et les messages d'erreur ou de résultat vide.
- Conserver la transparence des formulaires et ne pas laisser croire qu'une demande a été transmise si elle ne l'a pas été.

**Condition de sortie :** les principaux parcours sont compréhensibles et les libellés sont cohérents ; contrôles de build et de navigation réalisés.

### Phase 2 — Stabilisation des fonctions déjà présentes
**But :** consolider avant d'ajouter de nouvelles fonctions.

- Examiner le connecteur des appels d'offres publics : filtres, catégories, dates limites, statuts, liens source, erreurs de la source et limites de résultats.
- Ajouter ou renforcer des tests ciblés avant de modifier les comportements sensibles.
- Vérifier les cas limites et la cohérence des informations affichées avec les données source.
- Documenter les limites restantes au lieu de les dissimuler.

**Condition de sortie :** les cas de test retenus passent ; les limites non résolues sont écrites et visibles dans le registre.

### Phase 3 — Fondations modulaires et documentation continue
**But :** préparer les évolutions sans surarchitecture.

- Définir les responsabilités des modules et leurs frontières.
- Organiser progressivement les documents : fondations, architecture, modules, applications futures et journal des évolutions.
- Maintenir un registre des décisions ouvertes, avec options, conséquences et raison de la décision retenue.
- Éviter migrations, services externes ou nouvelles dépendances tant que le besoin n'est pas confirmé.

**Condition de sortie :** les décisions structurantes sont documentées et les nouveaux modules peuvent être ajoutés sans confusion avec les fonctions existantes.

### Phase 4 — Cadrage du parcours Business
**But :** préparer un périmètre réaliste pour la cession d'entreprises, de locaux ou de matériel.

- Définir les parcours séparés : « Céder mon entreprise », « Céder mes locaux » et « Céder mon matériel ».
- Déterminer quelles informations sont indispensables, facultatives ou sensibles.
- Distinguer une première estimation indicative d'une valorisation professionnelle.
- Définir le devenir des demandes et des données avant de créer un formulaire présenté comme fonctionnel.
- Sourcer toute statistique de marché avant publication ; les chiffres non vérifiés restent explicitement à confirmer.

**Condition de sortie :** périmètre, vocabulaire, données demandées, traitement prévu et limites de l'estimation sont validés avant réalisation.

### Phase 5 — Première version fonctionnelle du parcours prioritaire
**But :** mettre en œuvre un seul parcours à la fois, choisi après les phases précédentes.

- Décrire les scénarios nominaux, les erreurs attendues et les critères d'acceptation.
- Implémenter le minimum utile dans l'architecture existante.
- Tester les états de chargement, succès, erreur et absence de résultat.
- Documenter les fonctions réellement connectées et celles qui restent manuelles ou simulées.

**Condition de sortie :** critères d'acceptation satisfaits, contrôles techniques passés et démonstration reproductible.

### Phase 6 — Revue et suite
**But :** décider à partir de preuves plutôt que d'impressions.

- Comparer le résultat au besoin initial.
- Noter les régressions, défauts, écarts et améliorations restantes.
- Décider de poursuivre, corriger ou revenir à l'état précédent.
- Réévaluer les choix techniques à la lumière des besoins désormais démontrés.

## 4. Jalons de démonstration visuelle

Les déploiements sont prévus comme points de contrôle, pas comme engagements de date :

- **Déploiement A — référence visuelle :** après l'état des lieux et les premières corrections sans risque ; objectif : rendre visible l'état de départ consolidé.
- **Déploiement B — parcours public stabilisé :** après les vérifications du parcours des appels d'offres et les améliorations de compréhension ; objectif : permettre une comparaison concrète.
- **Déploiement C — premier parcours métier ciblé :** uniquement après cadrage et validation des critères d'acceptation du parcours retenu.

Avant chaque déploiement : vérifier la compilation, le parcours concerné, les erreurs connues et les éventuelles différences de configuration. Après chaque déploiement : consigner le lien, le commit associé, les contrôles réalisés et les problèmes observés. Aucun déploiement ne doit être annoncé comme validé avant vérification effective.

## 5. Registre de traçabilité des changements

Chaque changement doit être consigné avec les champs suivants :

| Champ | Contenu attendu |
|---|---|
| Identifiant | Référence unique, par exemple `EVOL-001` |
| Date | Date de l'intervention |
| Besoin / origine | Exigence du référentiel, retour utilisateur, défaut constaté ou décision |
| État initial | Comportement observé avant changement |
| Modification | Description claire de ce qui a changé |
| Fichiers / modules | Chemins réellement touchés |
| Risque et dépendances | Ce qui pourrait être affecté |
| Vérifications | Commandes, tests et parcours effectivement exécutés |
| Résultat | Réussi, partiel, échoué ou non vérifié |
| Preuve | Commit, rapport de test, capture ou URL de démonstration |
| Retour arrière | Procédure ou commit permettant de revenir à l'état précédent |
| Suite | Action suivante, décision ouverte ou défaut restant |

Une vérification non exécutée doit être marquée **« non vérifiée »**, jamais « réussie ». Les changements qui touchent plusieurs modules doivent préciser leurs effets croisés.

## 6. Matrice exigence → réalisation

Pour les besoins fonctionnels importants, maintenir une ligne par exigence :

`Exigence du référentiel → objet métier → décision d'architecture → fichier ou module concerné → test d'acceptation → preuve → statut → décision restante`

Statuts autorisés : **À analyser**, **Décidé**, **À développer**, **En cours**, **À vérifier**, **Validé**, **Bloqué**, **Abandonné avec justification**.

## 7. Règle de décision en cas de doute ou d'erreur

1. Suspendre uniquement la modification concernée si poursuivre risque d'aggraver le problème.
2. Reproduire le problème et noter les conditions observées.
3. Comparer le résultat au besoin, au dernier état connu et aux changements récents.
4. Corriger le plus petit périmètre possible.
5. Exécuter les contrôles concernés, puis les contrôles de non-régression.
6. Documenter la cause, la correction, les preuves et les limites résiduelles.
7. Si la correction est incertaine ou provoque une régression, revenir au dernier état validé et reprendre l'analyse.

## 8. Journal de progression

Ajouter une entrée après chaque étape significative :

- **Date / référence :**
- **Objectif :**
- **État de départ :**
- **Travail réalisé :**
- **Fichiers modifiés :**
- **Vérifications exécutées et résultats :**
- **Écarts ou risques découverts :**
- **Décisions prises / à confirmer :**
- **Commit ou preuve :**
- **Prochaine étape :**

## 9. Périmètre de cette version

Cette feuille de route fixe une méthode et un ordre de travail proposés ; elle ne certifie pas l'état actuel du produit et ne remplace pas les audits distincts. Les phases pourront être réordonnées si une preuve technique ou un besoin utilisateur le justifie, avec explication dans le journal. Toute modification du code doit rester ciblée, vérifiable et documentée.
