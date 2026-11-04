# MajestiOS — matrice de traçabilité des exigences et état de réalisation

Version : 2026-11-01  
Branche de référence : `chantier-recherche-donnees-gardes-fous-2026-11-01`  
Objet : permettre à une IA ou à une équipe de relier chaque exigence à sa documentation, aux fichiers concernés et à une preuve de validation attendue.

## Comment lire les statuts

- **Présent dans le prototype (à revalider)** : le code correspondant a été inspecté ou le comportement est décrit dans le code ; ne vaut pas validation complète après tous les commits.
- **Documenté / à développer** : exigence connue, mais aucune preuve suffisante d'implémentation complète.
- **À connecter / valider** : interface ou préparation existante, mais intégration externe, autorisation ou validation opérationnelle non démontrée.
- **À vérifier** : il faut inspecter le dépôt, lancer le test ciblé ou vérifier la source avant de conclure.
- **Garde-fou** : contrainte à conserver dans tous les lots.

Ne pas convertir « documenté » en « livré ». Chaque mise à jour de statut doit s'appuyer sur un commit, un fichier, un résultat de test ou une validation métier vérifiable.

## Matrice principale

| ID | Exigence | Référence fonctionnelle | Code / zone concernée connue | Statut au 2026-11-01 | Preuve / critère de sortie |
|---|---|---|---|---|---|
| GOV-01 | Ne pas déployer en production, fusionner dans main ou lancer une campagne sans autorisation explicite | Guide de reprise §7 ; Plan de chantier §4 | Gouvernance GitHub/Vercel et diffusion | Garde-fou | Autorisation explicite ; journaliser l'action réalisée et sa preuve |
| MVP-01 | Périmètre MVP limité aux parcours accueil, recherche BOAMP/BODACC, résultats/catégories et traçabilité ; extensions exclues jusqu’à validation | Cahier maître §10 bis ; Plan de chantier §3 et §6 | `index.html`, `opportunity-search.js`, `resultats-recherche.html`, pages catégories et tests associés | Proposition de cadrage à valider ; réalisation à revalider | Vérifier chaque critère de sortie MVP, exécuter build/vérification/tests concernés et consigner les preuves avant toute annonce de livraison |
| UX-01 | Accueil épuré : immeuble interactif, moteur multicritère, navigation discrète, chatbot et bandeau fictif clairement annoncé | Cahier maître §2 ; Arborescence §1 ; Guide de reprise §3 | `index.html`, `index.html`, `styles.css`, scripts associés | Présent dans le prototype (à revalider) | Contrôle visuel + test navigateur anti-régression ; aucune liste d'annonces fictives en cartes sur l'accueil |
| UX-02 | Immeuble interactif directement visible et distincte du Salon virtuel | Arborescence §2 ; Guide de reprise §3.2 | `index.html`, `index.html`, test de l’immeuble | Présent dans le prototype (à revalider) | Test des liens, libellés et rendu ; vérifier que la immeuble ne disparaît pas de l'accueil |
| SEARCH-01 | Recherche multicritère et conservation des critères au retour | Spécification §3 ; Arborescence §5 | `index.html`, `search-results.js`, `rubric-search.js` | Présent dans le prototype (à revalider) | Test des paramètres URL, du retour et des destinations catégorie |
| SEARCH-02 | Catégories cohérentes et absence de faux positifs évidents | Spécification §3 | `opportunity-search.js`, `tests/opportunity-search.browser.cjs` | Présent dans le prototype (à revalider) | Cas négatifs par catégorie ; notamment plomberie exclue des services numériques |
| PUB-01 | Recherche BOAMP dédiée aux appels d'offres publics, filtrage par nature, zone et échéance | Spécification §3 ; Modèle de données § | `opportunity-search.js`, tests navigateur | Tests de recherche déjà effectués selon confirmation du Fondateur ; ne pas réauditer sans régression | Réutiliser les tests existants si le connecteur ou les filtres sont modifiés ; toute anomalie doit être reproductible et consignée |
| PRIV-01 | BODACC utilisé comme source de signaux d'entreprises, et non comme moteur d'appels d'offres | Cahier veille §3, §7 ; Guide §4.2 | `opportunity-search.js` et pages de résultats | Tests de recherche déjà effectués selon confirmation du Fondateur ; ne pas réauditer sans régression | Réutiliser les tests existants si le connecteur ou les filtres sont modifiés ; préserver la distinction entre signal, fait vérifié et hypothèse |
| DATA-01 | Provenance, date de publication/collecte, distinction fait/hypothèse et gestion des erreurs | Spécification §6, §11 ; Guide §5 | Adaptateurs de sources, cartes et futures fiches de données | Partiel / à vérifier | Vérifier les champs effectivement conservés et affichés pour chaque source |
| TENDER-01 | Accompagnement humain et technique aux réponses aux appels d'offres | Cahier maître §13 ; Spécification §4 | Parcours métier, formulaires et futur espace dossier | Documenté / à développer | Démontrer le parcours DCE → checklist → pièces → mémoire technique → relecture → échéances → dépôt guidé → suivi |
| TARGET-01 | Associer activités et codes APE/NAF aux lots et exigences du marché | Cahier maître §13 ; Spécification §5 | `company-targeting.js` (brique de scoring ; table métier sourcée encore à construire) | Brique de calcul initiale présente ; table de correspondance métier non intégrée | Ajouter une table APE/NAF ↔ activités versionnée, justifiée et testée sur des marchés réels ; ne pas déduire une capacité du code seul |
| TARGET-02 | Rechercher, dédoublonner et classer les entreprises par département ; cible indicative d'environ dix par département et par opportunité | Spécification §5 ; Plan de chantier § lot métier transversal | `company-targeting.js`, `company-targeting-page.js`, `qualification-entreprises.html`, `tests/company-targeting.test.cjs`, `build.js` | Brique de normalisation, dédoublonnage, scoring, adaptateur API et page de préqualification ajoutés ; tests écrits mais non exécutés ici ; accès réel et interface à valider | Exécuter les tests et les contrôles de build ; vérifier l’accès navigateur en conditions réelles ; tester la page sur petits et grands écrans ; prouver provenance et résultats ; conserver moins de dix candidats si c'est tout ce que les données justifient |
| CAMPAIGN-01 | Diffuser le marché avec proposition d'accompagnement et suivi des retours | Spécification §5 ; Plan de chantier § lot métier transversal | Futur module campagne/CRM | Documenté / à développer | Validation humaine avant envoi ; statut d'envoi véridique ; opposition/désinscription respectée |
| JOB-01 | Veille emploi interne et discrète ; sources candidates multiples, aucune supposée connectée | Cahier veille §4 ; Guide §4.5 | Futur connecteur / registre des sources | Documenté / à valider | Fiche de source complète ; vérifier API/licence/conditions et résultats avant intégration |
| RE-01 | Veille immobilière professionnelle à partir de signaux d'entreprises, sans affirmer une disponibilité non vérifiée | Cahier maître §4.4 ; Cahier veille §5 ; Spécification §6 | Futur rapprochement signaux/établissements/actifs | Documenté / à développer | Chaque piste est sourcée, présentée comme hypothèse et soumise à vérification |
| CRM-01 | CRM : entreprises, contacts, opportunités, actions, campagnes, demandes d'accompagnement et résultats | Cahier maître ; Spécification §10 | Architecture backend non confirmée comme active | Documenté / à développer | Modèle validé, droits, journalisation, conservation, tests d'accès et de cycle de vie |
| CRM-02 | Alimentation du CRM par des sources externes et interactions internes, avec provenance, statut d'accès et dédoublonnage | Registre ressources CRM ; Cahier veille §3 ; Spécification §13 | `REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md`, futurs adaptateurs et backend | Registre créé ; sources candidates, non déclarées connectées | Pour chaque source : accès/licence validés, champs et fraîcheur contrôlés, provenance conservée, tests réels consignés ; imports idempotents et oppositions respectées |
| FORM-01 | Formulaires honnêtes sur l'état réel de transmission/enregistrement | Guide §4.7 ; Spécification §8 | `app.js`, `nous-rejoindre.html`, `espace-membre.html` | Prototype non connecté selon le code examiné | Test : l'interface indique explicitement qu'aucune donnée n'est transmise/enregistrée si aucun backend ne le fait |
| BOT-01 | Chatbot discret, réponses sourcées et orientation vers des pages exactes | Cahier maître ; Spécification §8 | Module chatbot / navigation à inspecter | À vérifier | Tests de destination, absence d'invention, réponse de repli et demande de contact |
| BUILD-01 | Build à liste explicite, vérification des fichiers et de l'intégrité de la copie | Guide §6 | `build.js`, `verify-site.js` | Présent dans le prototype (à revalider) | Exécuter le build et le vérificateur sur le commit exact ; conserver les sorties |
| TEST-01 | Tests ciblés et anti-régression par lot ; état CI rapporté honnêtement | Plan de chantier §4 ; Guide §6–8 | `verify-site.js`, `tests/opportunity-search.browser.cjs`, `tests/company-targeting.test.cjs`, test zone | Syntaxe des scripts et tests ciblés simulés du module de ciblage vérifiés dans cette session ; suite Node/build/navigateur non exécutée | Exécuter les tests Node, le build et les contrôles navigateur ; consigner commande, commit SHA, code de sortie et anomalies ; ne pas déclarer l’API réelle validée sans appel réel concluant |
| DOC-01 | Documentation suffisante pour reprise indépendante par une IA | Guide de reprise ; Spécification ; Cahier maître ; README | Documents de référence du dépôt | Consolidation commencée ; exhaustivité historique à vérifier | Réconciliation des anciennes versions, liens contrôlés et exigences sans document repérées |

## Prochaine étape de réalisation

Ne pas reprendre l’audit général des recherches BOAMP/BODACC : les tests de recherche ont été effectués selon confirmation du Fondateur. La première brique `company-targeting.js` est ajoutée pour normaliser les fiches, dédoublonner, attribuer un score explicable et sélectionner les candidats sans quota artificiel. Les tests `tests/company-targeting.test.cjs` sont écrits mais pas exécutés dans cette session. Prochaines étapes : exécuter les tests, brancher une source officielle avec paramètres validés, puis relier le service à une interface de qualification. Aucune campagne réelle ne doit être déclenchée.

## Fichiers et références de code connus

- `index.html` : accueil, recherche principale, bandeau de démonstration.
- `opportunity-search.js` : requêtes et filtrage des sources BOAMP/BODACC, rendu des résultats.
- `search-results.js` : restitution des critères et retour vers la recherche.
- `rubric-search.js` : recherche depuis les pages de rubrique.
- `catalogue-majestios.js` : catalogue de rubriques/catégories et territoires.
- `app.js` : interactions et prévisualisation de certains formulaires.
- `build.js` : copie contrôlée des ressources vers `dist/`.
- `verify-site.js` : contrôles statiques du site.
- `tests/opportunity-search.browser.cjs` : tests navigateur de recherche.
- `tests/immeuble-interactif.browser.cjs` : garde-fous de la immeuble interactif, à confirmer dans la branche au moment de l'exécution.
- `MODELE-DONNEES-APPELS-OFFRES.md` : structure des résultats d'opportunités.
- `CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md` : sources candidates et veille transverse.

## Feuille de route priorisée

### Lot A — finir la transmission documentaire (priorité immédiate)
1. Comparer les documents actuels avec les anciennes versions/notes encore présentes dans le dépôt.
2. Relever les exigences orphelines, les contradictions et les références de fichiers obsolètes.
3. Mettre à jour la matrice avec la source de chaque exigence et marquer les points non confirmés.
4. Conserver le registre de décisions dans la section 11 du cahier des charges maître ; ne pas créer un registre parallèle. Harmoniser les autres documents sur les décisions établies.

**Sortie :** références Markdown locales vérifiées sur les documents de cadrage ; contradiction repérée sur le bandeau d’accueil corrigée dans le cahier maître et l’arborescence ; registre de décisions existant confirmé dans le cahier maître. Les anciennes versions externes ou conversations non présentes dans le dépôt ne sont pas considérées comme intégralement réconciliées.

### Lot B — validation technique ciblée
1. Exécuter le build et `verify-site.js` sur le commit exact.
2. Exécuter les tests navigateur de recherche et de zone si l'environnement et les dépendances sont disponibles.
3. Corriger uniquement les régressions confirmées, par petits lots.
4. Enregistrer les résultats, les commandes, le SHA et les limites de l'environnement.

**Sortie :** rapport reproductible ; pas de statut « validé » sans preuve.

### Lot C — sources et contrats de données
1. Maintenir `REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md` comme inventaire maître des sources candidates.
2. Finir les fiches de source BOAMP/BODACC et préparer celles de l'emploi et des annuaires d'entreprises.
2. Valider droits d'accès, licence, fréquence, qualité, données personnelles, attribution et conservation.
3. Définir les schémas pour entreprise, établissement, code APE/NAF, lot, campagne, interaction et demande d'accompagnement.

**Sortie :** contrat de données versionné et sources classées actives, candidates, bloquées ou à vérifier.

### Lot D — ciblage et accompagnement
1. Définir la table APE/NAF ↔ exigences métier.
2. Définir le score explicable et les règles de déduplication.
3. Spécifier le parcours de préparation de réponse aux appels d'offres.
4. Spécifier la campagne avec validation humaine, suivi des retours et opposition.
5. Ne pas envoyer de campagne ni déclarer le module opérationnel avant tests et autorisation.

**Sortie :** spécification technique, modèle de données, tests d'acceptation et plan de mise en œuvre.

### Lot E — backend et CRM
Choisir/valider l'architecture backend et le modèle de sécurité avant de connecter les formulaires, comptes, documents clients et CRM. Ne pas supposer que des technologies explorées historiquement sont déjà actives.

## Règles de mise à jour de la matrice

À chaque lot :
1. mettre à jour le statut des IDs touchés ;
2. ajouter le commit et le test exact ;
3. noter les échecs, limitations et dépendances ;
4. ne changer « à développer » en « présent » qu'après inspection du code ;
5. ne changer « présent » en « validé » qu'après exécution réussie d'un test adapté ;
6. préserver les statuts « à valider » tant que la licence, la source ou l'autorisation n'est pas confirmée.


## Exigences complémentaires — suggestions APE/NAF (1er novembre 2026)

| ID | Exigence | Implémentation | Vérification | Statut |
|---|---|---|---|---|
| CIB-NAF-01 | Proposer des codes APE/NAF depuis un intitulé | `naf-suggestions.js`, 22 règles lexicales explicables | `tests/naf-suggestions.test.cjs` : rénovation énergétique, électricité, chauffage/climatisation, formation | Prototype ; couverture à valider |
| CIB-NAF-02 | Exiger une sélection explicite des suggestions | `qualification-entreprises.html`, `company-targeting-page.js` | Contrôles ciblés du raccordement et de la syntaxe | Prototype intégré |
| CIB-NAF-03 | Ne pas confondre suggestion et qualification confirmée | Avertissements dans le formulaire et les résultats | Vérification du texte d’interface | Garde-fou présent |
| CIB-NAF-04 | Exécuter automatiquement tests, build et vérification structurelle | `.github/workflows/majestios-anti-regression.yml` | Workflow exécuté le 2 novembre ; résultat détaillé dans l'actualisation ci-dessous | Configuration présente ; exécution effectuée, workflow global en échec sur le test navigateur de recherche |

Les codes suggérés ne doivent jamais déclencher à eux seuls une prise de contact, une inscription CRM ou une décision d’éligibilité.


## Actualisation des statuts — 2 novembre 2026

Cette actualisation complète les lignes datées du 1er novembre ; elle ne réécrit pas rétroactivement les observations faites sur ce commit. Les résultats ci-dessous concernent les commits de correction de la branche `fix/phase-0-prospection-title-2026-11-02` :

| Élément | État observé au 2 novembre | Statut à retenir |
|---|---|---|
| Titre de la page de prospection | Correction du titre principal effectuée dans `prospection-active.html` ; le workflow suivant échoue encore plus loin dans le test de recherche | Corrigé dans la branche ; validation globale non acquise |
| Initialisation du formulaire de recherche des rubriques | Garde de `rubric-search.js` modifiée pour cibler précisément `#rubric-opportunity-search` | Correctif appliqué ; parcours navigateur encore en échec |
| Build et syntaxe JavaScript | Étapes réussies dans l'exécution du 2 novembre | Validés pour le commit testé uniquement |
| Vérification architecture | Étape réussie dans l'exécution du 2 novembre | Validée pour le commit testé uniquement |
| Connecteurs BOAMP et BODACC | Contrôles de connexion réelle réussis dans l'exécution du 2 novembre | Tests de connexion réussis pour le commit testé ; ne vaut pas validation juridique ou disponibilité permanente |
| Immeuble interactif | Test navigateur réussi dans l'exécution du 2 novembre | Test réussi pour le commit testé |
| Recherche navigateur | Échec : attente de visibilité de `#rubric-opportunity-search` | Bloquant ; diagnostic et test de bout en bout à reprendre |
| CRM central, persistance et comptes | Pas de preuve de backend métier complet dans le prototype audité | Documenté / à développer |
| Campagnes et automatisations commerciales | Pas de preuve d'envoi, de suivi persistant ou d'exécution planifiée | Documenté / à développer ; aucune campagne réelle autorisée |
| Recherche documentaire autonome | Page et documentation de cadrage, sans preuve de moteur documentaire autonome | Documenté / à développer |

**Preuve CI :** [workflow du 2 novembre 2026](https://github.com/Chexpeer/Majestios/actions/runs/41460016382), terminé en échec malgré la réussite des étapes précédant le test de recherche.

Ne pas généraliser un résultat de test à des commits ultérieurs. Chaque statut « validé » doit citer le SHA effectivement testé. La correction de la recherche ne sera considérée comme validée qu'après réussite du test navigateur concerné et du workflow complet.
