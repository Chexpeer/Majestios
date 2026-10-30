# MajestiOS — plateforme de développement commercial assisté par IA

**Branche de travail pour le schéma en étoile :** `etoile-coeur-majestios`  
**Statut :** prototype en construction. Les pages Next.js et l’arborescence sont présentes, mais les parcours doivent encore être vérifiés route par route et les fonctions métier ne sont pas toutes opérationnelles.

## 1. Cap produit

MajestiOS est une plateforme d’**intelligence commerciale proactive** et de **prospection inversée assistée par IA**. Sa mission suit le parcours :

**Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser**

La navigation doit exprimer progressivement la profondeur du produit : page d’accueil, rubriques autonomes, sous-rubriques, puis pages de détail. Éviter de remplacer cette architecture par des liens d’ancrage vers des paragraphes d’une page unique.

Principes :
- les sources externes alimentent MajestiOS ; le parcours utilisateur reste dans MajestiOS lorsque cela est possible ;
- distinguer les faits sourcés, les hypothèses et les données fictives ;
- l’IA aide à proposer et qualifier ; l’humain décide et valide les actions sensibles ;
- construire de façon modulaire sans présenter une maquette comme une fonctionnalité livrée.

## 2. État de la structure

L’application Next.js se trouve sous `src/app`. La page d’accueil actuelle (`src/app/page.tsx`) utilise `PublicHeader`, `AnnouncementTicker` et `MajestiOSOpportunityMap`. Les pôles du schéma renvoient vers des routes internes, et l’arborescence est centralisée dans `src/data/site-tree.ts`.

Des fichiers historiques de site statique coexistent à la racine : `index.html`, `app.js`, `build.js` et `styles.css`. **Ne pas les supprimer ou les déplacer sans vérifier leur usage.** La configuration Vercel présente `framework: nextjs`, mais le projet et la branche réellement reliés au domaine de production doivent être confirmés avant toute opération de déploiement.

## 3. Priorité fonctionnelle immédiate : profondeur et cohérence des liens

Avant d’ajouter de nouvelles fonctionnalités :
1. inventorier les liens de la navigation, du schéma central, des bandeaux et des pages ;
2. vérifier que chaque destination existe et affiche une page distincte, et pas seulement une ancre ou une page générique ;
3. corriger les routes obsolètes, les redirections en chaîne et les liens incohérents ;
4. harmoniser les libellés de navigation avec les noms des rubriques ;
5. tester les parcours sur ordinateur et mobile, clavier compris ;
6. documenter les pages en préparation et les fonctions réellement disponibles.

La présence d’une route dans `site-tree.ts` ne prouve pas à elle seule qu’une page est complète ou opérationnelle. L’inventaire doit comparer les liens à `page.tsx` réels et tester les réponses obtenues.

## 4. Connecteur BOAMP : état et limites

La route `GET /api/opportunities` interroge le jeu de données BOAMP exposé par OpenDataSoft et transforme les enregistrements en résultats affichables.

Paramètres annoncés :
- `q` : recherche textuelle ;
- `location` : code département validé ;
- `type` : `all`, `Travaux`, `Services` ou `Fournitures`.

Le code gère les erreurs de la source externe et ne doit pas les remplacer silencieusement par des résultats fictifs.

**À vérifier avant de considérer la fonction comme opérationnelle :**
1. tester la route avec plusieurs mots-clés, catégories et départements, notamment `68`, `2A` et un code invalide ;
2. confirmer la syntaxe combinée des filtres et les champs du schéma réel ;
3. vérifier les URLs des avis, leurs statuts et leurs échéances ;
4. tester la recherche, les filtres et les erreurs sur l’environnement cible.

La présence du connecteur dans le code ne constitue pas une preuve de fonctionnement en production.

## 5. Fonctions non encore attestées

Ne pas présenter comme opérationnels sans vérification :
- les opportunités privées réelles si elles ne proviennent pas d’une source validée ;
- l’enregistrement durable des demandes et formulaires ;
- l’authentification et les comptes clients ;
- un CRM persistant, une mémoire d’entreprise connectée ou la facturation ;
- un assistant relié à un modèle d’IA et aux documents internes.

Les formulaires de démonstration doivent indiquer clairement s’ils transmettent ou non les données. La route `/api/health` est un contrôle technique, pas une preuve de disponibilité des fonctions métier.

## 6. Assistant et données

L’assistant transversal ne doit être présenté comme une aide d’orientation que tant que son accès au corpus autorisé, aux outils métier et à un modèle d’IA n’est pas validé. Avant toute connexion à la base documentaire, définir le corpus, les droits, l’indexation, les références de citation et la mise à jour des documents.

Les clés API restent côté serveur. Les quotas, la consommation, la traçabilité et l’isolation des données entre organisations doivent être conçus avant l’ouverture à des utilisateurs. Toute action externe sensible doit être soumise aux permissions requises et à une validation humaine lorsque nécessaire.

## 7. CRM et gestion des appels d’offres : état réel

Les décisions de conception et les limites constatées sont consignées dans :
- `docs/architecture/MODELE_DONNEES_CRM_APPELS_OFFRES_V0.1.md` — modèle métier commun proposé ;
- `docs/architecture/AUDIT_PREALABLE_CRM_APPELS_OFFRES_2026-10-30.md` — audit de ce qui est présent ou non démontré dans le dépôt ;
- `docs/architecture/REGISTRE_ARBITRAGES_CRM_APPELS_OFFRES_V0.1.md` — décisions bloquantes, recommandations et conditions de passage au schéma SQL.

À ce stade, la recherche BOAMP est un parcours public distinct d’un CRM persistant. Le formulaire de présentation d’entreprise prépare un récapitulatif local, sans envoi serveur. L’exemple de variables Supabase ne prouve pas qu’un projet DEV soit configuré ; aucune migration ni ouverture d’espace client ne doit être déduite de ces fichiers.

Avant de développer les écrans CRM comme des fonctions opérationnelles, confirmer le référentiel maître, l’environnement de données et l’authentification, puis implémenter et tester l’isolation entre organisations.

## 8. Contrôles de développement

Prérequis : version de Node.js compatible avec les dépendances du projet.

```bash
npm install
npm run dev
```

Contrôles disponibles :

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Le workflow GitHub Actions exécute les tests, ESLint, TypeScript et le build. Ces contrôles ne remplacent pas les tests fonctionnels du connecteur, des formulaires, de la navigation ni les tests de sécurité.

Le verrouillage des dépendances doit être vérifié. S’il manque un fichier de lock, en générer un et le valider avant d’adopter `npm ci`.

## 9. Déploiement et données de production

Plusieurs projets Vercel ont été créés pendant les essais. Un déploiement marqué `Ready` ne prouve ni que le bon projet est utilisé ni que les fonctions métier sont validées.

Avant tout changement, identifier le projet d’aperçu, le projet de production, les domaines associés, la branche de déploiement et la commande de build. **Ne pas modifier les projets, domaines, déploiements, variables ou paramètres de production sans vérification préalable et autorisation explicite.**

Aucune migration de base de données ne doit être créée avant la validation des tomes de référence, des objets métier et des règles d’accès. Confirmer l’identité de l’environnement Supabase DEV avant toute opération.

## 10. Ordre de travail

1. Consolider la profondeur de navigation et auditer toutes les destinations.
2. Harmoniser l’interface et les menus, puis tester les parcours responsive.
3. Valider le connecteur BOAMP sur des réponses réelles.
4. Retrouver les tomes de référence et faire correspondre exigences, écrans, routes et objets métier.
5. Verrouiller les dépendances et fiabiliser les contrôles CI.
6. Définir puis tester les permissions et l’isolation entre organisations.
7. Livrer progressivement les fonctions métier, sans confondre prototype et service opérationnel.

**Règle permanente :** aucun secret dans le dépôt ou le navigateur ; aucune donnée fictive présentée comme réelle ; provenance vérifiable ; respect des droits d’utilisation des sources ; traçabilité des actions d’administration.


## Doctrine de navigation et d’identité des dossiers
La règle de conception des dossiers, des filigranes et des liens internes est définie dans [`docs/architecture/DOCTRINE_IDENTITE_DOSSIERS_ET_NAVIGATION_V1.0.md`](docs/architecture/DOCTRINE_IDENTITE_DOSSIERS_ET_NAVIGATION_V1.0.md). Elle interdit notamment les liens internes qui ramènent à la page de départ et impose des destinations utiles, distinctes et vérifiables.


## Doctrine fondatrice de l'architecture

Le triangle symbolise la rencontre d'un besoin ou d'une demande, d'un budget compatible et d'un climat de confiance. La doctrine qui relie ce principe au schéma interactif, aux six axes et à l'arborescence fonctionnelle est formalisée dans [docs/architecture/DOCTRINE_FONDATRICE_TRIANGLES_ET_ARBORESCENCE_MAJESTIOS_V1.0.md](docs/architecture/DOCTRINE_FONDATRICE_TRIANGLES_ET_ARBORESCENCE_MAJESTIOS_V1.0.md). Ce document est la référence à consulter avant toute évolution de la géométrie, des rubriques ou de leurs interconnexions.
