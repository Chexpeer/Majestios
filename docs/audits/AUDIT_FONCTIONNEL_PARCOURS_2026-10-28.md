# Audit fonctionnel des parcours — 28 octobre 2026

## Portée et méthode

Contrôle statique des fichiers de la branche `developpement` via l’API GitHub : existence des routes du menu, destinations principales, traitement des paramètres de recherche, liens entre flux et fiches, et indications visibles sur l’état des fonctionnalités.

**Limite importante :** ce contrôle n’est pas un test navigateur, un build, un test automatisé ni une validation en production. Les résultats décrivent le code consulté sur la branche `developpement` au moment de l’audit.

## Résultats vérifiés

### Navigation
- Les 16 destinations principales définies dans `src/components/public-header.tsx` correspondent à des fichiers de page présents dans `src/app`.
- La carte interactive propose des destinations distinctes pour les marchés publics, les opportunités privées, le radar entreprises, le développement commercial, les réseaux, Business et Emploi.
- La page d’accueil utilise un flux compact et renvoie les annonces publiques vers une route de détail dédiée.

### Marchés publics / BOAMP
- `/api/opportunities` interroge la source BOAMP et renvoie des résultats explicitement identifiés comme données réelles, sans basculer vers des exemples fictifs en cas d’erreur.
- Le paramètre de localisation est traité comme un code département ; une valeur invalide renvoie une erreur explicite au lieu de lancer une recherche nationale.
- La route `/appels-offres-publics/[id]` existe et construit une URL de vérification officielle BOAMP à partir de l’identifiant de l’avis.
- La page de détail est actuellement une fiche de vérification générique : elle n’affiche pas encore les champs complets de l’avis (objet, acheteur, échéance, pièces). Elle renvoie vers la source officielle et rappelle de vérifier les données.
- Le formulaire `/appels-offres-publics/[id]/repondre` prépare un récapitulatif dans le navigateur. Le code indique qu’il ne transmet ni n’enregistre la demande et ne dépose pas de candidature.

### BODACC / Business
- La page `/business` transmet le critère de recherche à `/api/bodacc` et affiche des liens vers la source officielle.
- Le formulaire de cadrage Business envoie ses champs vers un endpoint Formspree codé en dur. La page avertit que les données sont transmises à Formspree ; la destination et la configuration du compte Formspree doivent être vérifiées par le propriétaire avant usage public. Ne pas envoyer de données confidentielles tant que ce contrôle n’est pas réalisé.
- La page `/merci` précise que l’acceptation par le service ne garantit pas que l’équipe MajestiOS a reçu ou traité la demande.

### Fonctionnalités explicitement en préparation
- Les cartes privées sont identifiées comme exemples non réels et le catalogue privé est annoncé comme non connecté.
- La rubrique Emploi & missions utilise des exemples et indique que le parcours de candidature n’est pas activé.
- L’espace professionnel précise que la création de compte, le dépôt sécurisé de CV et l’enregistrement dans un compte ne sont pas encore activés.
- Les liens qui préparent une intention via des paramètres d’URL ne doivent donc pas être interprétés comme une inscription ou une demande enregistrée.

## Priorités recommandées

1. **Priorité haute — vérifier Formspree** : confirmer que l’endpoint est contrôlé par MajestiOS, que les destinataires sont corrects, que la politique de confidentialité couvre ce traitement et que le formulaire ne demande que les données nécessaires. Ne pas remplacer l’endpoint sans validation du propriétaire.
2. **Priorité haute — enrichir la fiche BOAMP** : récupérer et afficher les champs réels d’un avis à partir de son identifiant, avec gestion des avis introuvables, des délais et des erreurs ; garder le lien officiel et les avertissements de vérification.
3. **Priorité moyenne — tester en navigateur** : tester recherche sans filtre, recherche par département valide/invalide, ouverture d’un résultat BOAMP, retour avec filtres, lien d’accompagnement, recherche BODACC, et parcours depuis les cartes privées/emploi vers l’espace professionnel.
4. **Priorité moyenne — tester les liens** : effectuer un contrôle automatisé de toutes les routes et des ancres FAQ après installation des dépendances et lancement du projet.
5. **Ne pas supprimer de branche sur la base de cet audit de routes** : les décisions de nettoyage de branches doivent rester fondées sur les différences Git et la sauvegarde préalable des éléments uniques.

## Statut

Audit statique réalisé ; aucun test navigateur, build, déploiement ou envoi de formulaire n’a été effectué dans le cadre de ce document.


## Correctifs de parcours appliqués après le premier audit

À la suite de l’audit statique, un défaut de parcours a été identifié : le formulaire de recherche d’accueil permettait de choisir « Entreprises », « Réseaux professionnels » ou « Développement commercial », mais le mot-clé n’était pas transmis à toutes ces rubriques, ou n’était pas clairement signalé comme non traité.

Correctifs commités dans `developpement` :
- La recherche d’accueil transmet maintenant le mot-clé aux destinations Entreprises, Réseaux et Développement commercial.
- Le Radar entreprises conserve le mot-clé dans l’URL et indique explicitement que la recherche de signaux n’est pas encore connectée ; un raccourci vers la recherche BODACC est proposé.
- La rubrique Réseaux affiche le mot-clé reçu et précise qu’aucune recherche de partenaires ni mise en relation n’a été effectuée.
- La rubrique Développement commercial affiche le mot-clé reçu et précise qu’aucune recherche transversale automatisée n’a été exécutée, avec raccourcis vers BODACC et les marchés publics.

Ces correctifs évitent de laisser croire qu’une recherche a été effectuée lorsqu’elle ne l’a pas été. Ils ont été enregistrés sur la branche `developpement`, mais n’ont pas encore été validés par un build ou un test navigateur.


### Fiche d’avis BOAMP : amélioration du contexte affiché

- Le lien « Fiche détaillée » transmet désormais le titre, l’acheteur, la catégorie, la localisation, la date de publication, l’échéance et le statut présents dans le résultat de recherche.
- La fiche dédiée affiche ces informations lorsqu’elles ont été transmises, avec un avertissement explicite : ce résumé est contextuel et doit être vérifié sur l’avis officiel.
- Les filtres de recherche initiaux restent conservés pour le retour à la liste.
- Limite restante : ces champs sont transmis dans l’URL depuis le résultat ; ils ne constituent pas une nouvelle interrogation indépendante de BOAMP et ne doivent pas être considérés comme une vérification en temps réel. Les accès directs à la fiche peuvent ne pas avoir le résumé.


### Recherche BODACC : couverture de tests renforcée

- Ajout de deux cas à `src/lib/bodacc/search-query.test.ts` : suppression des caractères non pris en charge et conservation des caractères accentués dans les critères métier.
- Ces tests complètent les cas déjà présents sur les requêtes génériques, les villes, les cessions et les noms d’entreprises.
- État de validation : les tests ont été ajoutés au dépôt, mais leur exécution locale/CI n’a pas pu être confirmée depuis cette session. Ne pas considérer cela comme une validation réussie.
