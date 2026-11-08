# Cartographie des consommateurs — moteurs de recherche entreprises et CRM — 8 novembre 2026

**Branche examinée :** `feature/crm-atomic-integration`  
**Périmètre :** manifeste de publication, pages HTML, scripts navigateur, client CRM et trois Edge Functions liées à la recherche/import d'entreprises.  
**Nature :** audit statique en lecture seule ; aucune modification applicative ou Supabase.

## 1. Conclusion

La cartographie confirme qu'un parcours navigateur actif dans le code versionné utilise encore directement le moteur historique `MajestiosCompanyTargeting` :

- page : `qualification-entreprises.html` ;
- script : `company-targeting-page.js` ;
- moteur : `company-targeting.js` ;
- services appelés directement depuis le navigateur : API Recherche d’Entreprises et API Géo des communes.

Ce parcours n'utilise pas `prospection-search-member`. Il contourne donc le nouveau contrat serveur et transporte dans les objets JavaScript des propriétés de provenance et le payload amont.

Les fonctions `search-official-companies` et `import-official-company` existent dans le dépôt, mais la recherche statique effectuée n'a pas identifié d'appel explicite depuis les pages et scripts inspectés. Il ne faut pas conclure qu'elles ne sont utilisées nulle part en production : les bundles déployés, les appels externes et les consommateurs non indexés n'ont pas été inspectés.

Le client CRM constitue un deuxième chantier autonome : ses lectures génériques `select("*")` et ses champs de provenance exposent ces colonnes aux utilisateurs autorisés par RLS, même sans affichage systématique.

## 2. Matrice des consommateurs observés

| Composant | Consommateur / producteur | Appel ou donnée | Exposition constatée | Statut |
|---|---|---|---|---|
| `qualification-entreprises.html` | Charge `company-targeting.js` et `company-targeting-page.js` | Page de préqualification publique versionnée dans le manifeste | Le texte de présentation nomme explicitement l'API Recherche d’Entreprises | Consommateur confirmé |
| `company-targeting-page.js` | Appelle `MajestiosCompanyTargeting.searchCompanies()` ou `searchCompaniesNearPoint()` | Reçoit candidats, compteurs, date de collecte et données de qualification | N'affiche pas explicitement le nom du fournisseur sur les cartes, mais reçoit les objets riches du moteur | Consommateur confirmé |
| `company-targeting.js` | Interroge directement `recherche-entreprises.api.gouv.fr` et `geo.api.gouv.fr` | Construit les URLs et les requêtes depuis le navigateur | Conserve `source`, `source_url`, `sourceUrl`, `sourceId`, `collectedAt`, `requests`, `query` et `raw` | Fuite de métadonnées dans l'état applicatif confirmée |
| `prospection-search-member/index.ts` | Endpoint serveur membre | Reçoit POST JSON, contrôle JWT/organisation/rôle puis appelle le noyau serveur | Réponse `items/page/partial`, sans champs fournisseur dans le contrat membre | Endpoint cible présent en Git ; absence de raccordement frontend confirmée dans les pages/scripts inspectés |
| `search-official-companies/index.ts` | Endpoint serveur historique | GET avec JWT ; appelle l'API amont | Réponse renvoie `source`, `source_url`, `searched_at` et payload `data` | Endpoint présent ; consommateur frontend explicite non trouvé dans la recherche statique |
| `import-official-company/index.ts` | Endpoint serveur d'import | POST SIREN + organization_id ; vérifie `can_import_official_company`, utilise service role côté serveur | Réponse renvoie `source`, `imported_at`, données entreprise et `result` ; erreurs détaillées possibles | Endpoint présent ; consommateur frontend explicite non trouvé dans la recherche statique |
| `crm-client.js` | Pages CRM internes | Lectures paginées et détail via `select("*")` ; écritures via listes de colonnes autorisées | Colonnes `source_label`, `source_url`, `source_type`, `source_external_id`, `source_published_at` transitent par le client | Consommateur CRM confirmé |
| `crm-page.js` | Page `crm.html` | Appelle les méthodes du client CRM et construit les fiches | Le profil contact rend actuellement `source_label` sous l'étiquette « Provenance » | Exposition UI explicite confirmée |
| `site-files.json` | Manifeste du build | Publie `company-targeting.js`, `company-targeting-page.js`, `qualification-entreprises.html`, `crm-client.js`, `crm-page.js` | Confirme que les composants historiques font partie des ressources publiques prévues pour le build | Inclusion manifeste confirmée |

## 3. Analyse du parcours de qualification navigateur

### 3.1 Chaîne fonctionnelle

`qualification-entreprises.html` charge les scripts de recherche et de qualification. Lors de la soumission du formulaire, `company-targeting-page.js` appelle directement :

- `searchCompanies()` pour les recherches par codes APE/NAF et territoire ;
- `searchCompaniesNearPoint()` pour les recherches par rayon.

Le moteur appelle l'API de recherche et le service de géolocalisation directement depuis le navigateur. Il enrichit chaque enregistrement avec le fournisseur, son URL, la date de collecte et les critères de requête, puis renvoie également les requêtes effectuées, les compteurs et les filtres appliqués.

Le composant de page ne rend pas ces métadonnées de fournisseur dans les cartes de résultat ; toutefois, elles restent présentes dans la réponse et dans les objets manipulés en mémoire. Le masquage visuel n'est donc pas une protection.

### 3.2 Informations divulguées dans le texte de la page

Le paragraphe introductif de `qualification-entreprises.html` mentionne explicitement « l’API publique Recherche d’Entreprises ». Cette formulation révèle le service utilisé et ne correspond pas à la règle d'invisibilité des fournisseurs.

### 3.3 Limite fonctionnelle à conserver lors de la migration

Le formulaire historique expose davantage de critères que le contrat actuel de `prospection-search-member` :
- plusieurs codes APE/NAF ;
- département ou région ;
- rayon géographique ;
- filtres de chiffre d'affaires ;
- labels RGE, Qualiopi, EPV et ESS ;
- tranche d'effectif ;
- ancienneté, catégorie juridique et recherche sur le nom ;
- exclusion des entreprises non actives ;
- limite de résultats et score de rapprochement.

Le contrat du nouvel endpoint accepte une partie de ces critères, mais pas tous. Les filtres `revenue_bands` sont actuellement refusés lorsqu'ils sont renseignés, et le moteur serveur ne reproduit pas encore l'ensemble des filtres locaux historiques.

**Conséquence :** le raccordement ne doit pas être un simple remplacement de fonction. Il faut d'abord décider quels critères sont indispensables et compléter le contrat/serveur de façon contrôlée, sans changer le moteur global de l'accueil ni perdre silencieusement des critères de recherche.

## 4. Analyse du CRM

### 4.1 Lectures

Le client `crm-client.js` utilise `select("*")` dans les méthodes de lecture des entreprises, des listes de travail, des fiches associées, des listes génériques et dans la lecture préalable aux modifications. Les résultats sont filtrés par `organization_id` dans le client ; la protection inter-organisation doit continuer à reposer sur RLS et les contrôles serveur, jamais sur ce seul filtre client.

### 4.2 Affichage

Dans `crm-page.js`, le profil contact inclut explicitement `row.source_label` sous le libellé « Provenance ». C'est une exposition directe dans l'interface CRM, et pas seulement une propriété reçue dans le réseau.

Les écrans d'entreprise et d'opportunité inspectés n'affichent pas nécessairement tous les champs de provenance, mais les lectures génériques les ramènent au navigateur.

### 4.3 Écritures

La liste `editableColumns` du client CRM autorise des champs de provenance :
- entreprises : `source_label`, `source_url` ;
- contacts : `source_label` ;
- opportunités : `source_type`, `source_external_id`, `source_url`, `source_published_at`.

Les politiques de privilèges historiques accordent également certaines permissions d'écriture sur ces colonnes aux utilisateurs authentifiés éditeurs. La migration de correction devra distinguer la provenance technique générée par le moteur des informations métier saisies manuellement, et ne pas casser l'historique ni les imports existants.

## 5. Architecture de migration proposée

### Étape A — Contrat de recherche

1. Faire de `prospection-search-member` la porte d'entrée serveur du parcours membre.
2. Compléter son schéma de validation et son noyau pour les critères réellement retenus : multi-NAF, géographie, effectifs, ancienneté, catégorie juridique, labels et chiffre d'affaires si les données le permettent.
3. Ne pas accepter un critère que le serveur ignore silencieusement : le valider, le traiter, ou renvoyer une erreur métier explicite.
4. Garder les sources et fournisseurs uniquement dans la couche interne.
5. Maintenir la projection DTO positive et ajouter des tests anti-fuite sur les objets imbriqués, réponses d'erreur et résultats partiels.

### Étape B — Adaptateur frontend

1. Remplacer l'appel direct au moteur navigateur par un adaptateur appelant l'Edge Function membre avec le JWT de session.
2. Faire recevoir à la page des objets métier uniquement.
3. Séparer les champs affichés des métadonnées internes ; ne pas exposer les compteurs de requêtes techniques ou les URLs amont.
4. Conserver le score comme indice de rapprochement et maintenir les avertissements de qualification humaine.
5. Retirer la mention du fournisseur de la page et remplacer les descriptions techniques par une promesse fonctionnelle.

### Étape C — Retrait progressif du moteur historique

1. Inventorier tous les consommateurs de `MajestiosCompanyTargeting`, y compris tests, scripts admin et imports.
2. Migrer et tester chaque consommateur.
3. Conserver temporairement le moteur pur de scoring si ses fonctions sont réutilisées, mais séparer ce code de l'acquisition réseau et du payload brut.
4. Retirer ensuite les appels directs navigateur et les propriétés `source*`, `raw`, `requests`, `query` devenues inutiles.
5. Ne supprimer aucun fichier avant vérification des références dans le build, les tests et les pages publiées.

### Étape D — CRM et endpoints historiques

1. Créer des projections explicites pour chaque liste, détail et retour de mutation CRM.
2. Retirer les champs techniques de provenance des DTO et des champs modifiables par les rôles CRM ordinaires.
3. Garder une provenance interne pour l'audit, avec un accès technique distinct.
4. Cartographier les appels réels aux deux endpoints historiques avant toute modification de leurs contrats.
5. Réduire leurs réponses aux champs métier nécessaires, une fois les consommateurs migrés et testés.

## 6. Ordre de réalisation conseillé

| Ordre | Travail | Livrable / preuve |
|---|---|---|
| 1 | Spécifier le contrat cible complet de recherche membre et arbitrer les critères historiques | Schéma d'entrée/sortie versionné |
| 2 | Ajouter tests du noyau serveur pour chaque filtre conservé | Tests unitaires et validation |
| 3 | Créer l'adaptateur frontend et raccorder la page de qualification | Parcours local fonctionnel |
| 4 | Tester absence de provenance dans réseau, mémoire applicative et DOM | Tests anti-fuite automatisés |
| 5 | Migrer les autres consommateurs identifiés du moteur historique | Matrice de consommateurs soldée |
| 6 | Corriger les DTO CRM et la fiche contact | Tests de lecture/écriture par rôle |
| 7 | Déprécier les endpoints historiques après preuve d'absence de consommateurs | Inventaire final et contrat retiré |
| 8 | Préparer les migrations de droits Supabase et tester localement | Migration et suite RLS locale, sans prod |

## 7. Limites et niveau de preuve

- Les fichiers listés ont été lus sur la branche `feature/crm-atomic-integration`.
- Le manifeste confirme que les scripts historiques et la page de qualification sont dans le périmètre du build.
- La chaîne `qualification-entreprises.html → company-targeting-page.js → company-targeting.js → API amont` est confirmée par lecture directe.
- La fiche contact CRM affiche `source_label` ; les lectures génériques et champs éditables sont confirmés par lecture de `crm-client.js`.
- Les recherches textuelles GitHub n'ont pas retourné de consommateur explicite des noms des Edge Functions historiques. Cette recherche n'est pas une preuve d'absence exhaustive : elle peut manquer des appels construits dynamiquement, des bundles générés, des déploiements antérieurs ou des consommateurs externes.
- Aucun navigateur n'a été exécuté ; aucun trafic réseau de production, bundle Vercel, log Edge ou historique d'utilisation des fonctions n'a été inspecté.
- Aucun test, build, CI ou test RLS n'a été lancé dans ce lot.
- Aucune modification de code, de base, de permission, de secret, de fonction déployée ou de configuration n'a été effectuée.

## 8. Décision

Le premier parcours à migrer est la page de qualification d'entreprises : c'est le consommateur frontend concret et confirmé du moteur direct navigateur. Le nouveau endpoint membre fournit déjà une base de contrat plus sûre, mais il faut d'abord combler les écarts de filtres avant de basculer la page.

Le CRM doit être traité dans un lot séparé, car il s'agit de DTO, d'accès aux colonnes et d'écritures historiques, et non du même parcours de recherche.

Les deux endpoints historiques ne doivent pas être supprimés sur la seule base d'une recherche de code sans résultat. Leur usage réel doit être vérifié sur les versions déployées et dans les logs avant dépréciation.

**Périmètre de sécurité inchangé :** aucune migration distante, aucune modification RLS/Auth, aucun déploiement Edge, aucun merge et aucune suppression de code sans autorisation explicite.
