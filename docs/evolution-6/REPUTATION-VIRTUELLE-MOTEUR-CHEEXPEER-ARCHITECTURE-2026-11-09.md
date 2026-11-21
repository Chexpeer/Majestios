# Contrat initial du moteur d'audit interne Cheexpeer — 9 novembre 2026

## Objet du lot

Poser un contrat de données pur et testable pour préparer le futur moteur d'audit de réputation virtuelle. Ce lot ne réalise aucune collecte réseau et n'active aucun audit client. Il évite de confondre un résultat observé, son interprétation et une conclusion.

## Architecture cible

1. **Cadrage** : l'utilisateur fournit l'entité, le site, le territoire, l'activité et les objectifs.
2. **Orchestration interne** : Cheexpeer sélectionne les sources autorisées depuis un registre interne. Les fournisseurs ne sont jamais exposés dans l'interface.
3. **Collecte** : chaque observation conserve URL de référence, horodatage, type, correspondance avec le sujet et limites.
4. **Normalisation** : les connecteurs convertissent leurs réponses vers le contrat d'évidence commun.
5. **Analyse** : Cheexpeer sépare faits observés, interprétations, hypothèses et données manquantes.
6. **Rapport** : constats sourcés, niveau de confiance, limites, recommandations hiérarchisées et validation humaine.

## Implémenté dans ce lot

- `reputation-audit-core.mjs` : création du dossier, normalisation des preuves, DTO d'affichage et rapport préparatoire.
- Les identifiants internes de fournisseur (`source_key`, `source_record_id`) sont conservés dans le modèle interne et exclus du DTO destiné au navigateur.
- Une preuve est une observation datée ; elle ne devient pas automatiquement un constat ou une conclusion.
- Un rapport sans analyse réelle reste explicitement au statut `draft`, sans conclusions ni recommandations inventées.
- Les URL non HTTP(S) sont rejetées ; les champs et tableaux sont bornés.

## Sources déjà repérées dans le dépôt

- API Recherche d'Entreprises (DINUM) : connecteur Edge authentifié `search-official-companies`, qui renvoie actuellement l'identité du fournisseur dans sa réponse. Cette fonction est dédiée à la recherche d'entreprises et ne constitue pas un connecteur de réputation.
- API Recherche d'Entreprises et API Géo : appels utilisés par le moteur de prospection dans `_shared/prospection-search-core.mjs`.
- Catalogue SQL `official_data_sources` : registre de sources commerciales officielles (Annuaire des Entreprises, SIRENE, RNE, BODACC, BOAMP, data.gouv.fr, Journal officiel). Plusieurs entrées sont au statut `assessment` ou `planned`, pas des connecteurs actifs d'audit.
- Google Web/Maps : consultations manuelles dans le prototype Réputation virtuelle ; pas d'API de collecte automatisée ni de preuve qualifiée.

Aucune source ci-dessus ne doit être présentée comme un connecteur d'audit de réputation prêt à l'emploi sans vérification technique et contractuelle spécifique.

## Modèle de preuve

Chaque preuve interne comprend : identifiant de source interne, identifiant amont éventuel, URL, titre, extrait, type d'observation, date de collecte, correspondance au sujet, force indicative et limites. Les niveaux `low/medium/high` expriment la solidité de l'observation, pas la véracité absolue de l'interprétation.

Le rapport public reçoit un DTO sans identifiants de fournisseurs. La référence URL est conservée pour permettre la vérification des éléments cités.

## Sécurité et limites

- Pas de clé secrète dans le navigateur ou dans Git.
- Pas de client `service_role` côté navigateur.
- Pas d'accès aux données CRM VIP ni de modification des rôles/RLS.
- Pas de scraping non autorisé, contournement de paywall, accès à des comptes privés ou collecte de données personnelles non nécessaires.
- Toute future collecte doit documenter base légale/finalité, conditions d'utilisation, quotas, rétention, minimisation et contrôle d'accès.
- Les conclusions et actions correctives devront être soumises à validation humaine.

## Tests et statut

Tests Node natifs : création du dossier, bornage, rejet des URL dangereuses, normalisation, invisibilité des identifiants internes dans le DTO et absence de conclusions fabriquées.

**Statut : contrat de données initial uniquement.** Aucun orchestrateur, connecteur réputation, persistance, analyse IA ou rapport client automatique n'est livré par ce lot.
