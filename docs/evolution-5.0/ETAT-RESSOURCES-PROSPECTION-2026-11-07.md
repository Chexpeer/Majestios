# État des ressources du moteur de Prospection — 7 novembre 2026

**Périmètre :** rubrique Prospection uniquement. Aucun changement du moteur transversal, des marchés publics/privés, du CRM ou de Supabase.

## État vérifié du code

| Ressource | Réalisation présente dans cette branche | Limite |
|---|---|---|
| API Recherche d’Entreprises (DINUM) | Recherche par APE/NAF, département/région, chiffre d’affaires et labels disponibles ; recherche géographique par rayon jusqu’à 50 km via `/near_point` | API de recherche ouverte, mais elle ne remplace pas l'accès complet au répertoire SIRENE |
| SIRENE (INSEE) | Connecteur serveur préparé par URL de proxy configurable | Aucun proxy ni identifiant INSEE configuré ; aucune requête SIRENE directe validée |
| RNE (INPI) | Connecteur serveur préparé par URL de proxy configurable | Accès INPI et proxy non configurés ; aucune requête RNE validée |
| ADEME — entreprises RGE | Recherche dédiée et interface ; lecture du schéma du jeu de données avant filtrage | Réponse réelle de l'API non testée depuis ce lot ; le schéma et les noms de champs doivent être confirmés en recette |
| QUALIBAT | Formulaire de vérification par SIRET et connecteur configurable | Proxy fournisseur non configuré ; aucune réponse réelle testée |
| QUALIFELEC | Connecteur configurable et fiche source au catalogue | Accès et droits à confirmer ; non connecté |
| OPQIBI | Connecteur configurable et fiche source au catalogue | Accès et droits à confirmer ; non connecté |
| FNTP | Connecteur configurable et fiche source au catalogue | Accès et droits à confirmer ; non connecté |
| Annuaires professionnels, fédérations et plateformes de sous-traitance | Catalogue de ressources et règles de raccordement par source | Pas d'API universelle ; intégration individuelle après validation des droits, contrats et modalités techniques |
| BODACC | Connecteur et formulaire déjà présents | Hors priorité immédiate ; API réelle à valider séparément |

## Règles techniques

- Les secrets INSEE, INPI et fournisseurs de certification ne sont jamais placés dans le navigateur.
- Les sources authentifiées passent par une URL de proxy serveur fournie dans `MAJESTIOS_PROSPECTING_CONFIG`.
- Le connecteur de qualification accepte uniquement un SIRET à 14 chiffres et une liste fermée de fournisseurs.
- Un fournisseur présent au catalogue n'est pas réputé connecté.
- Les résultats administratifs ou de certification sont des éléments de vérification, pas une preuve automatique de capacité opérationnelle.
- Le rapprochement inter-sources doit utiliser le SIREN/SIRET, conserver la provenance, la date de collecte et l'URL d'origine.

## Vérifications effectuées pour ce lot

- Compilation syntaxique V8 des fichiers JavaScript modifiés : réussie.
- Simulation de normalisation administrative (SIREN, SIRET, département, date de création et tranche d'effectif) : réussie.
- Présence des scripts dans `site-files.json` et des formulaires dans `prospection-active.html` : vérifiée.
- GitHub Actions sur le commit `66cfc8c` : syntaxe JavaScript réussie ; tests `company-targeting`, `company-fit` et `prospecting-resources` réussis.\n- Le workflow s’arrête ensuite sur un échec préexistant du test `naf-suggestions.test.cjs` (assertion sur l’exploitation du descriptif du lot) ; le build, les contrôles d’architecture et les tests navigateur sont donc ignorés dans ce run. Cet échec n’est pas lié au connecteur de ressources, mais bloque la validation globale.\n- Recherche géographique : syntaxe JavaScript et simulation du flux géocodage → `/near_point` validées avec une réponse simulée ; les critères CA/labels sont explicitement bloqués dans ce mode afin d’éviter une recherche silencieusement incomplète ; aucune recherche réelle en navigateur n’a été effectuée.
- Documentation officielle geo.api.gouv.fr consultée ; géocodage par nom/code postal et coordonnées du centre communal confirmés.
- Appels API ADEME, INSEE, INPI et fournisseurs de certification en conditions réelles : non exécutés.
- Aucun déploiement, aucune modification CRM/Supabase.

## Sources officielles de référence

- API Recherche d’Entreprises : https://recherche-entreprises.api.gouv.fr/docs/
- API Découpage administratif / géocodage des communes : https://geo.api.gouv.fr/decoupage-administratif/communes
- Catalogue API INSEE / SIRENE : https://www.insee.fr/fr/information/8184146
- Accès API entreprises INPI / RNE : https://data.inpi.fr/content/editorial/Acces_API_Entreprises
- Liste des entreprises RGE ADEME : https://data.ademe.fr/datasets/liste-des-entreprises-rge-2
- Historique RGE ADEME : https://data.ademe.fr/datasets/historique-rge
- API Certification QUALIBAT : https://www.data.gouv.fr/dataservices/api-certification-qualibat-qualibat-bouquet-api-entreprise
- Sources de l'Annuaire des Entreprises : https://annuaire-entreprises.data.gouv.fr/donnees/sources

**Derniers commits du lot géographique :** `2673358d8cc36a9d33a6b437977e606042e83fc2`, `29c68dffc0b98b924b113cf7d12f0a0ff5a65f28`, `9611a248006622eaf69a2c7f9e05b37fbce37ab5`, `446b56d6fa3d1827eb079759f9998dbb4fa83302`.
