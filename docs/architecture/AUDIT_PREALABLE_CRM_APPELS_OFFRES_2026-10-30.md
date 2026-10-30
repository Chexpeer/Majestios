# Audit préalable CRM et gestion des appels d’offres — 30 octobre 2026

- **Branche auditée :** `refonte-profondeur-flux`
- **Référence du dépôt :** `Chexpeer/Majestios`
- **Statut :** constat effectué à partir de l’arborescence GitHub et des documents accessibles ; aucune exécution locale, compilation ou test navigateur n’a été réalisé.
- **But :** déterminer ce qui peut être implémenté sans confondre pages de présentation, flux d’annonces et espace métier persistant.

## 1. Constat principal

Le dépôt contient déjà des parcours publics d’opportunités et des documents de cadrage du CRM. En revanche, l’audit de l’arborescence de la branche ne fait apparaître ni répertoire `supabase/`, ni migrations SQL, ni tests RLS, ni fichiers identifiables de schéma de base de données. Les recherches ciblées n’ont pas non plus retrouvé de middleware d’authentification à la racine ou sous `src/`.

Ce constat est limité au contenu visible sur cette branche et aux chemins recherchés : il ne prouve pas qu’aucun service externe ou paramètre ne puisse exister ailleurs dans l’infrastructure. Il signifie toutefois qu’il n’est pas possible, à ce stade, de considérer le CRM persistant et l’espace client sécurisé comme déjà établis par les fichiers examinés.

## 2. Capacités constatées

### Présentes dans le dépôt
- Recherche publique d’appels d’offres via `src/app/api/opportunities/route.ts`, qui interroge le jeu de données BOAMP et renvoie des annonces normalisées.
- Pages publiques dédiées aux opportunités et aux dossiers de marchés.
- Formulaire de présentation d’entreprise dont la documentation et l’interface indiquent que les données restent dans le navigateur et ne sont pas envoyées à un serveur.
- Pages et éléments de navigation Emploi, Salons, marchés publics et marchés privés.
- Documents de cadrage du back-office/CRM et d’enrichissement par les marchés attribués.

### Non démontrées par l’audit
- Persistance réelle des entreprises, interlocuteurs, activités, tâches ou dossiers propres à un client.
- Authentification et appartenance active à une organisation cliente pour les routes de l’espace de travail.
- Isolation entre organisations par RLS ou mécanisme équivalent testé.
- Stockage privé et contrôle d’accès aux documents.
- Envoi effectif des formulaires, dépôt sécurisé de CV ou dépôt d’une réponse à une consultation.
- Collecte complète des avis d’attribution et rapprochement vérifié des attributaires avec des entreprises CRM.

## 3. Conséquence pour le modèle de données

Le modèle commun décrit dans `MODELE_DONNEES_CRM_APPELS_OFFRES_V0.1.md` reste une proposition métier. Il ne faut pas en déduire que les entités sont déjà implémentées physiquement.

La matrice `MATRICE_CORRESPONDANCE_MODELE_V0.1.md` signale des distinctions importantes à conserver avant toute migration :
- tenant et utilisateur ;
- membership et rôle ;
- organisation cliente et entreprise référencée commercialement ;
- dossier d’opportunité et mission ;
- activité, tâche et affectation ;
- document et version ;
- faits sourcés, rapprochements et hypothèses IA.

Il serait risqué de créer des tables directement à partir de noms simplifiés comme `companies` et `organizations` sans résoudre ces distinctions.

## 4. État du connecteur d’appels d’offres

Le point d’entrée `src/app/api/opportunities/route.ts` appelle l’API de données BOAMP, applique des filtres, extrait des champs, calcule un état d’ouverture et renvoie la provenance de la source. Il ne suffit pas, à lui seul, à démontrer :
- l’import et la persistance de dossiers client ;
- la couverture de tous les avis d’attribution ;
- l’extraction fiable de tous les attributaires ;
- la création de signaux CRM ;
- le rapprochement avec une entreprise déjà connue.

Le connecteur de recherche public et le futur service d’enrichissement CRM par attribution doivent rester deux responsabilités distinctes.

## 5. Ordre de travail recommandé

1. **Réconcilier les exigences métier** : confronter le modèle commun et la matrice de correspondance au référentiel maître qui fait autorité.
2. **Établir la base technique réellement disponible** : confirmer l’environnement de données, les dépendances, l’authentification, les rôles et la configuration DEV. Ne jamais supposer la présence de clés ou de projets.
3. **Valider l’isolation** : définir tenant/membership, politique d’accès et tests négatifs avant d’exposer des données client.
4. **Construire un incrément vertical** : une entreprise, un interlocuteur, une opportunité suivie et une activité, persistés et protégés de bout en bout.
5. **Étendre au dossier d’appel d’offres** : échéances, pièces, acteurs, décision et historique.
6. **Ajouter l’enrichissement sourcé** : avis d’attribution, dédoublonnage et revue humaine, après validation de la source et des règles de rapprochement.

## 6. Critères de sortie avant d’annoncer un CRM opérationnel

- Une session authentifiée et un membership actif sont vérifiés côté serveur.
- Une entreprise et une opportunité peuvent être créées, relues et modifiées après rechargement.
- Un utilisateur du tenant A ne peut pas lire ni modifier les données du tenant B.
- Les actions et changements de statut sont tracés.
- Les données externes gardent leur source et leur date de vérification.
- Les tests automatisés pertinents passent dans un environnement de développement.
- Les limites fonctionnelles restantes sont affichées clairement dans l’interface.

## 7. Conclusion

La priorité immédiate n’est pas d’ajouter un tableau de bord décoratif ni de multiplier les pages. C’est de vérifier et d’établir les fondations de données et d’accès nécessaires à un espace client réel. Tant que la persistance et l’isolation ne sont pas prouvées, les pages CRM doivent être considérées comme du cadrage ou de la présentation, pas comme un outil de gestion opérationnel.
