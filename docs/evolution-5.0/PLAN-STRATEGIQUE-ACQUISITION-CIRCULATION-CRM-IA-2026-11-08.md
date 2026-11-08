# Plan stratégique — acquisition, circulation entre rubriques, CRM et intelligence

**Date de consolidation :** 8 novembre 2026  
**Branche examinée :** `feature/crm-atomic-integration`  
**Commit de référence au début de l'audit :** `f4b03c6d3417e6143ac24e34aa97994aaa8ca877`  
**Dernière correction de test pendant cet audit :** `a5f16f25770804dfc351e8e98943dca7dd8c26f9`  
**Statut :** feuille de route stratégique proposée ; les arbitrages produit et le nom de l'IA restent ouverts.

Ce document organise la prochaine étape de MajestiOS. Il distingue les acquis vérifiables, les défauts identifiés, la cible fonctionnelle et les décisions qui doivent rester entre les mains du fondateur. Il ne vaut ni autorisation de production ni validation d'une automatisation commerciale.

## 1. Synthèse de l'audit au 8 novembre

### 1.1 Acquis observés dans la branche

- Le site est construit comme un ensemble de rubriques reliées à l'immeuble interactif. Le principe « le schéma reflète l'arborescence » demeure la règle de navigation.
- Le moteur transversal de l'accueil et des rubriques est injecté par `rubric-search.js`. La rubrique Prospection dispose en plus d'un moteur métier propre, orienté entreprises, activité APE/NAF et territoire. Le commit `f4b03c6` empêche l'injection du moteur générique dans `prospection-active.html` afin de supprimer le doublon observé. Un contrôle navigateur de non-régression a ensuite été ajouté : il vérifie qu'un seul formulaire de recherche est présent, que `#advanced-search-form` et `.rubric-search-card` ne sont pas injectés et que le bouton de critères métier reste présent.
- Le parcours d'opportunités interroge BOAMP et BODACC. Le dernier workflow audité a exécuté avec succès les tests de fumée réels : trois avis BOAMP et trois annonces BODACC ont été échantillonnés. Cet échantillon confirme l'accessibilité des API au moment du test, pas l'exhaustivité ni la qualité métier de toutes les annonces.
- Le moteur de ciblage d'entreprises, les suggestions APE/NAF et les contrôles de qualification disposent de tests automatisés réussis dans le workflow examiné.
- Le code du CRM interne utilise Supabase et vérifie la session ainsi que l'appartenance à une organisation interne. Le client CRM expose des fonctions pour les entreprises, contacts, opportunités et activités ; les fiches entreprise peuvent charger leurs éléments associés par pages.
- Le ciblage depuis le poste CRM est documenté comme une sélection opérateur de candidats, avec détection des doublons SIREN/SIRET et création au statut « à examiner ». Cette fonction doit rester explicitement soumise à la recette du parcours réel et aux droits du rôle.
- L'administration et les recherches ciblées verrouillent le poste sans session. Le module Administration n'a pas été supprimé par les derniers changements ; le défaut observé concernait le masquage de sa navigation et un test de parcours devenu incohérent avec le texte réel de la page.

### 1.2 Vérification CI et anomalie corrigée dans le test

Le workflow `42458915680`, déclenché sur `f4b03c6`, a exécuté avec succès les contrôles de syntaxe, ciblage, qualification, ressources de prospection, suggestions APE/NAF, build, architecture, liens, appels réels BOAMP/BODACC, immeuble interactif, recherche, navigation et formulaire de contact.

**Le seul échec du run se situait dans le test navigateur du verrouillage Administration / Recherches ciblées.** À la ligne 73, le test attendait sur `admin-recherches.html` le texte « Identifiez-vous par l’accès VIP », alors que cette page présente réellement une porte d'accès « Accès réservé », un message de vérification et un lien « Connexion collaborateurs ». Le test vérifiait donc un libellé emprunté à un autre écran, pas le contrat réel de cette page.

Le test a été corrigé sur la branche pour vérifier les éléments fonctionnels stables : porte d'accès visible, lien de connexion interne vers `espace-interne.html?returnTo=admin-recherches.html`, espace de travail masqué et navigation interne masquée sans session.

**Résultat après correction — vérifié :** le workflow `42459412213` s'est terminé avec succès sur `b329277`. Le test d'accès Administration / Recherches ciblées est donc passé après correction du sélecteur. Un second workflow, `42459487276`, a également réussi sur `6c399b4`. Enfin, le contrôle navigateur spécifique à l'unicité du moteur Prospection a été exécuté dans le workflow `42459563891` sur `1802247f7e75b79f824ca263c4283f7b706585cb` : succès. Les 20 étapes du job sont terminées sans échec. La Preview précédente est READY : `https://majestios-jc8g-18qdglxui-majistr.vercel.app` ; elle contient le même code applicatif, le dernier commit `1802247` n'ajoutant qu'un test de non-régression. Aucun changement de production n'a été effectué.

### 1.3 Limites à ne pas masquer

- Le smoke test BOAMP/BODACC porte sur un petit échantillon à un instant donné ; il ne mesure pas la couverture exhaustive des catégories, des périodes ou des départements.
- Les connecteurs SIRENE/INSEE, RNE/INPI et plusieurs organismes de qualification restent à configurer ou à tester réellement. Leur présence dans un catalogue ou derrière une URL de proxy ne signifie pas qu'ils sont connectés.
- Les formulaires publics de contact, de candidature et de positionnement ne constituent pas encore une chaîne de réception et de persistance CRM validée de bout en bout.
- Le raccordement du CRM à Supabase ne suffit pas à prouver la recette complète des flux d'inscription, d'e-mail, de droits, de données et de sauvegarde sur un parcours réel.
- Les résultats de recherche et les signaux économiques ne doivent pas être transformés automatiquement en prospects qualifiés ni déclencher un contact externe.

## 2. Objectif : consolider une chaîne d'acquisition complète

La valeur de MajestiOS doit se mesurer à sa capacité à faire circuler une information utile jusqu'à une action commerciale maîtrisée, puis à capitaliser le résultat.

**Chaîne directrice :**

**Détecter → Qualifier → Identifier → Préparer → Faire valider → Contacter → Transformer → Capitaliser.**

La chaîne doit relier les rubriques de l'immeuble et le CRM sans fusionner leurs responsabilités.

### 2.1 Parcours cible depuis une rubrique

1. **Entrée par l'immeuble :** le visiteur ou collaborateur ouvre le bon étage, dossier ou sous-dossier. Chaque porte mène à une destination réelle et cohérente.
2. **Recherche dans le contexte métier :** le moteur de la rubrique conserve ses critères propres. Les sources restent invisibles dans les interfaces de Prospection ; l'orchestration des fournisseurs demeure interne.
3. **Résultat traçable :** chaque résultat garde son identifiant d'origine, sa source, sa date, son URL officielle, ses critères de recherche et les limites de fiabilité connues.
4. **Qualification :** l'utilisateur distingue les faits publiés, les données déclarées, les rapprochements calculés, les hypothèses et les recommandations.
5. **Préparation d'une transmission :** un bouton explicite propose de préparer l'entrée dans le CRM. Il ne crée rien à lui seul.
6. **Revue avant écriture :** l'utilisateur voit les données qui seront reprises, les champs manquants, les doublons potentiels, la provenance et le motif de transfert ; il confirme ou annule.
7. **Capitalisation CRM :** après validation et autorisation, une entreprise, une opportunité, un contact ou une activité est créé ou relié au dossier existant. Une fiche importée commence par un statut prudent, par exemple « à examiner ».
8. **Suivi :** le CRM organise le responsable, l'étape, la prochaine action, l'échéance et l'historique. Le contact externe reste une action distincte qui requiert validation et base légitime.
9. **Retour vers la rubrique :** depuis la fiche CRM, un lien de contexte ramène à la page d'origine, aux critères de recherche et au résultat source, si ces informations sont toujours disponibles et autorisées.

### 2.2 Circulation dans les deux sens

La circulation ne doit pas être un simple transfert à sens unique.

- **Rubrique → CRM :** transmettre une piste sélectionnée et qualifiée, jamais un lot entier par défaut.
- **CRM → Rubrique :** revenir au signal ou au dossier d'origine, relancer une recherche avec le contexte utile, ou ouvrir la rubrique adaptée.
- **CRM ↔ Développement commercial :** transformer une fiche entreprise en relation suivie, relier les opportunités et consigner les interactions.
- **CRM ↔ Appels d'offres :** relier un marché aux compétences, références, entreprises et contacts pertinents, sans déduire une capacité à partir du seul code APE/NAF.
- **CRM ↔ Réseau :** préparer une mise en relation contextualisée, avec consentement et visibilité maîtrisée.
- **CRM ↔ Réputation virtuelle :** rattacher une analyse à la bonne entreprise ou au bon établissement, en distinguant les informations publiques des données privées.

Le CRM reste une fonction transversale et un centre opérationnel ; il ne devient pas un étage supplémentaire de l'immeuble. Le plan de navigation doit montrer les portes d'accès utiles sans dupliquer les fonctions métier.

## 3. Contrat commun de circulation des données

Avant d'automatiser les transferts, définir un contrat commun pour les objets métier. Les noms de champs exacts restent à aligner sur le schéma Supabase réellement déployé.

| Objet | Rôle | Informations de traçabilité minimales |
|---|---|---|
| Signal / annonce | Fait publié par une source externe | source, identifiant externe, URL, date de publication, date de collecte, contenu brut ou référence conservée |
| Opportunité | Piste commerciale interprétée à partir d'un signal ou d'une demande | type, statut, résumé, niveau de confiance, motif, responsable, prochaine action |
| Entreprise / établissement | Entité juridique ou établissement identifié | SIREN/SIRET si disponibles, nom, adresse, source et date de vérification |
| Contact | Personne associée à une entreprise | origine, fonction, coordonnées autorisées, statut de consentement/opposition |
| Activité | Événement du suivi commercial | type, date, auteur, objet, résultat et lien vers les entités concernées |
| Transmission | Passage contrôlé entre une rubrique et le CRM | initiateur, origine, destination, finalité, champs transférés, autorisation, horodatage et résultat |

### Règles de données non négociables

- Dédupliquer les entreprises par identifiants robustes, notamment SIREN/SIRET ; ne pas fusionner automatiquement deux fiches sur la seule similarité de nom ou d'adresse.
- Conserver la provenance champ par champ lorsque les sources peuvent se contredire.
- Ne jamais transformer une annonce BODACC en opportunité commerciale certaine sans qualification.
- Ne jamais présenter APE/NAF, effectif déclaré ou score de rapprochement comme preuve de compétence, de disponibilité ou d'éligibilité.
- Respecter les oppositions, la finalité, la minimisation, la durée de conservation et les droits d'accès.
- Distinguer CRM interne, espaces clients, données publiques, données confidentielles et données fournies volontairement.
- Journaliser les créations, mises à jour, exports, fusions, changements de rôle et transmissions.
- Aucun envoi d'e-mail, publipostage, message, prise de rendez-vous ou contact tiers sans autorisation explicite adaptée.

## 4. Rôle de l'intelligence artificielle dans l'écosystème

### 4.1 Architecture fonctionnelle proposée

Conserver une intelligence de coordination commune, mais ne pas lui donner un accès universel indifférencié. Elle délègue des tâches à des capacités spécialisées et limitées par domaine, rôle, finalité et permissions.

| Capacité spécialisée | Mission cible | Limite d'autorité |
|---|---|---|
| Accueil et orientation | Comprendre la demande, guider vers l'étage, le dossier ou le formulaire pertinent | Ne lit pas les dossiers privés sans authentification |
| Recherche et veille | Aider à formuler les critères, résumer les résultats, signaler les lacunes de couverture | Ne fabrique pas de résultat et ne choisit pas une source non autorisée |
| Qualification | Comparer les éléments disponibles, expliquer les rapprochements et relever les incohérences | Ne prononce pas seule une qualification définitive |
| Prospection | Préparer une cible, un contexte et une proposition d'approche | Ne contacte personne et ne lance pas de campagne sans validation |
| Appels d'offres | Lire et structurer les exigences, relier les compétences et références, préparer une trame de réponse | Ne garantit pas la conformité ni le gain d'un marché |
| CRM | Retrouver les fiches autorisées, proposer une création ou une mise à jour, préparer une activité | Lecture seule par défaut ; toute écriture passe par une confirmation et le contrôle serveur |
| Réseau et réputation | Synthétiser les informations autorisées et préparer une mise en relation | Respecte la confidentialité, les règles de publication et les droits des personnes |
| Business Intelligence | Expliquer les indicateurs, tendances et écarts avec leurs sources | Distingue corrélation, hypothèse et causalité |
| Administration, qualité et SEO | Surveiller les erreurs, tests, performances, documentation et proposer des corrections | Ne modifie ni droits, ni production, ni contenus publics sans approbation |
| Mémoire et continuité | Retrouver décisions, tâches, preuves et résultats utiles | Mémoire structurée, datée, sourcée, révisable et soumise aux règles de conservation |

### 4.2 Niveaux d'autonomie

1. **Observer :** lire uniquement les informations permises et signaler les anomalies.
2. **Analyser :** rapprocher, expliquer, comparer et produire des synthèses sourcées.
3. **Préparer :** proposer des filtres, fiches, activités, messages ou corrections sans les appliquer.
4. **Faire valider :** présenter clairement l'action, ses conséquences, les données utilisées et demander l'approbation requise.
5. **Exécuter sous autorisation :** réaliser uniquement les actions autorisées, dans un périmètre limité et journalisé.
6. **Contrôler et capitaliser :** vérifier le résultat, signaler les échecs et consigner les enseignements.

Le mode par défaut du premier déploiement métier doit rester **lecture, analyse et préparation**. Les écritures et actions externes viennent après la validation des permissions, de la traçabilité et des contrôles.

## 5. Nom de l'IA : séparation à étudier, décision non prise

Le nom « MajestiOS » désigne d'abord la plateforme et son univers. Utiliser exactement le même nom pour l'agent conversationnel peut créer une ambiguïté : parle-t-on du site, de l'ensemble du système, du CRM ou de son assistant ?

**Proposition à arbitrer :**
- conserver **MajestiOS** comme nom de la plateforme ;
- conserver **V.5** comme repère de version et d'architecture interne, pas nécessairement comme nom public de l'assistant ;
- attribuer éventuellement à l'intelligence un nom propre distinct, qui identifie son rôle sans la présenter comme une seconde plateforme ;
- garder une intelligence centrale commune et ses rôles spécialisés, plutôt que créer plusieurs IA autonomes concurrentes.

Aucun nom n'est retenu dans ce document. Le nom, la personnalité, la portée, les responsabilités et la relation avec les concepts BrainIOS restent ouverts. Les idées BrainIOS du fondateur doivent être exposées et examinées avant de figer une architecture, un rôle ou une connexion. Ne pas renommer les fichiers, routes, modules ou variables avant décision formelle et inventaire des dépendances.

## 6. Feuille de route stratégique proposée

### Lot 0 — Stabilisation et vérité technique
- Terminer la vérification du workflow après le correctif du test d'accès aux recherches ciblées.
- Vérifier la Preview construite sur le dernier commit, en particulier le moteur unique de Prospection sur mobile et desktop.
- Examiner les erreurs restantes de CI, de console navigateur, de liens et de navigation.
- Maintenir une liste des anomalies classées par gravité, cause, preuve, correction et test de non-régression.

**Critère de sortie :** CI verte sur le commit identifié ; Preview correspondante READY ; aucun défaut bloquant connu dissimulé.

### Lot 1 — Cartographie des circulations
- Établir la matrice complète étage → dossier → page → moteur → résultats → action → destination CRM.
- Contrôler les liens directs, retours, fils d'Ariane et accès contextuels.
- Définir pour chaque rubrique ce qui peut être transmis au CRM, ce qui reste consultatif et ce qui n'est pas encore connecté.
- Ajouter des tests de navigation croisée entre rubriques et CRM.

**Critère de sortie :** chaque parcours dispose d'une destination, d'un retour et d'un comportement documentés et testés.

### Lot 2 — Contrat de transmission vers le CRM
- Aligner les objets signal, opportunité, entreprise, établissement, contact, activité et transmission sur le schéma réel.
- Définir déduplication, provenance, statut initial, droits, consentement, conservation et journal d'audit.
- Prévoir une prévisualisation des données avant toute création ou mise à jour.
- Tester les cas de doublon, données incomplètes, source indisponible, erreur partielle et refus d'autorisation.

**Critère de sortie :** un transfert choisi, explicable, réversible dans ses effets métier et vérifié de bout en bout, sans contact externe automatique.

### Lot 3 — Poste CRM et navigation contextuelle
- Rendre les liens entre entreprises, opportunités, contacts et activités immédiatement compréhensibles.
- Depuis chaque fiche, permettre le retour au dossier source et au résultat initial.
- Depuis chaque rubrique, retrouver les fiches CRM déjà liées sans créer de doublons.
- Clarifier les responsabilités et restrictions de chaque rôle interne.

**Critère de sortie :** un utilisateur autorisé passe de la rubrique au CRM et revient sans perdre le contexte ni élargir ses droits.

### Lot 4 — Définition de l'intelligence et de son identité
- Recueillir les idées du fondateur sur les rôles de l'IA et BrainIOS.
- Distinguer nom de plateforme, nom de l'intelligence, nom des capacités spécialisées et numéro de version.
- Définir une matrice permissions × rôles × données × actions.
- Définir les évaluations de qualité, coûts, latence, traçabilité et mécanismes de repli.

**Critère de sortie :** nom et architecture validés par le fondateur ; aucune ambiguïté entre marque, plateforme et assistant.

### Lot 5 — IA en lecture seule puis préparation
- Commencer par la recherche contextualisée, la synthèse sourcée et l'explication de qualification.
- Ajouter la préparation d'une fiche CRM ou d'une prochaine action sans écriture automatique.
- Évaluer les résultats sur des cas représentatifs et vérifier les erreurs, omissions et hallucinations.
- Introduire ensuite les validations explicites et les écritures limitées.

**Critère de sortie :** qualité mesurée, provenance visible, droits contrôlés et approbation humaine effective.

### Lot 6 — Automatisations maîtrisées et amélioration continue
- Étudier les déclencheurs utiles, les relances et la surveillance des opportunités.
- Introduire des automatisations réversibles, limitées et journalisées.
- Prévoir arrêt d'urgence, reprise après erreur, quotas, coûts et contrôle humain.
- Mesurer le résultat commercial sans confondre activité générée et valeur créée.

**Critère de sortie :** chaque automatisation a un responsable, une finalité, des limites, un historique et un moyen de suspension.

## 7. Ordre des dépendances

Ne pas commencer par un agent IA qui écrit dans le CRM. L'ordre recommandé est :

**stabiliser les erreurs → cartographier les parcours → définir le contrat de données → sécuriser les transferts → fluidifier le CRM → arbitrer le rôle et le nom de l'IA → introduire l'IA en lecture seule → autoriser progressivement les actions.**

Cet ordre évite de bâtir une couche d'intelligence sur des liens incomplets, des objets incohérents ou des permissions insuffisamment testées.

## 8. Points à arbitrer avec le fondateur

1. La frontière exacte entre intelligence centrale et assistants spécialisés.
2. Le nom propre éventuel de l'IA, distinct de MajestiOS, et la place de BrainIOS dans cette réflexion.
3. Les événements qui peuvent proposer un transfert vers le CRM et ceux qui doivent rester purement consultatifs.
4. Le niveau de confirmation requis pour créer, modifier, exporter ou contacter.
5. La navigation contextuelle souhaitée entre rubriques, fiches CRM et résultats d'origine.

**Règle de protection :** ce plan ne modifie pas l'immeuble interactif, les zones cliquables, les libellés, l'arborescence ou les visuels. Aucun changement de schéma Supabase, aucune fusion, aucune promotion en production et aucun renommage global ne sont autorisés par ce document.
