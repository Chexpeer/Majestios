# Audit structure, navigation et liens — 29 octobre 2026

## Périmètre

Audit réalisé sur la branche `fix/homepage-structure-opportunity-flow`, sans déploiement Vercel ni modification de `main`.

État du dépôt au début de l’audit :
- 55 entrées dans l’arborescence centrale `src/data/site-tree.ts` ;
- 56 pages Next.js (`page.tsx`) ;
- 3 routes API sous `src/app/api` ;
- routes dynamiques prévues pour les rubriques évolutives : opportunités, business, développement commercial, compréhension et réseaux ;
- redirections historiques définies dans `next.config.ts`.

## Contrôles automatisés ajoutés

Le test `src/lib/site-navigation.test.ts` contrôle :
1. l’unicité des URL de l’arborescence centrale ;
2. la résolution des destinations du menu, y compris par routes dynamiques Next.js ;
3. la résolution des destinations de redirection ;
4. les liens internes littéraux dans les fichiers source, y compris les routes API.

Le test vérifie la présence d’une route dans le code ; il ne remplace pas un test navigateur de chaque page ni une vérification des droits et données au runtime.

## Corrections effectuées pendant l’audit

- Ajout d’un flux public compact sur la page d’accueil, alimenté par `/api/opportunities` et limité aux avis BOAMP signalés comme ouverts. Les erreurs ou l’absence de résultats sont présentées explicitement ; aucun résultat fictif n’est ajouté.
- Les clics du flux public mènent d’abord au parcours interne d’étude de l’opportunité.
- Ajout d’un flux général de veille pour les pages annexes qui ne relèvent pas d’un domaine plus précis.
- Correction du flux associé aux pages Réseaux : il n’est plus confondu avec le flux des salons.
- Retrait des liens légaux du menu principal pour alléger la navigation ; ajout de liens Confidentialité et Mentions légales dans les pieds de page de l’accueil et des pages annexes.
- Correction de la navigation de secours des pages de premier niveau sans enfants, afin qu’elles proposent des rubriques sœurs pertinentes plutôt qu’une sélection arbitraire de pages profondes.
- Suppression de la répétition des mêmes liens sur les pages feuilles lorsque la carte interactive les présente déjà.
- Correction d’une règle lint préexistante dans le parcours de création d’espace, révélée par le contrôle continu.

## Architecture retenue

### Accueil
Navigation latérale, présentation de la proposition de valeur, recherche multicritère, flocon numérique interactif, flux public/privé/emploi, ressources et accès à l’espace professionnel.

### Pages annexes
Barre de navigation commune, titre et mission de la rubrique, carte interactive spécialisée, flux contextualisé, ressources, actions concrètes et pied de page légal.

### Routes évolutives
Les routes dynamiques sont conservées lorsqu’elles servent de mécanisme d’extension. Elles doivent cependant reconnaître une entrée de l’arborescence centrale et renvoyer une page introuvable pour les adresses inconnues ; une route dynamique ne doit pas servir à faire croire qu’une fonctionnalité métier est déjà active.

## Limites connues

- Les annonces privées, salons, offres de recrutement et signaux BODACC ne sont pas encore reliés à un flux de données vérifiées de la même manière que le flux public BOAMP.
- Les cartes de ressources sont des contenus pédagogiques internes ; leur mise à jour automatique n’est pas implémentée.
- Le formulaire de création d’espace reste une interface de préparation : authentification, enregistrement, stockage sécurisé et dépôt effectif de fichiers ne doivent pas être présentés comme actifs.
- Le contrôle statique des liens ne vérifie pas qu’une source externe est joignable, que ses données sont à jour ou qu’un utilisateur dispose des droits nécessaires.
- Le contrôle visuel en navigateur n’a pas été déclaré réalisé dans cet audit. La validation technique finale dépend du workflow CI.

## Critère de clôture

Clôturer l’audit technique seulement après réussite des tests, du lint, du type-check et du build dans GitHub Actions. Les échecs Vercel liés à la limite de fréquence de construction sont distincts et ne doivent pas être interprétés comme un diagnostic du code.
