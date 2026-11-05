# Audit du lot 6 — parcours de conversion, formulaires et CRM

**Date de contrôle :** 5 novembre 2026  
**Commit examiné initialement :** `fc21d09c20a2679eb78a9fb7f9745aabb1533952`  
**Dernière revue de code :** `bd59a4c8a7f253c85bf63d40736955b255bf4c74`  
**Branche :** `evolution-5.0-clean-preview`  
**Périmètre :** accueil, recherche et résultats, espace membre, page « Nous rejoindre », CRM et fonction serveur de provisionnement.  
**Méthode :** lecture du code réellement présent, rapprochement avec `ETAT-BACKEND-SUPABASE.md` et vérification des workflows GitHub sur le HEAD indiqué. Les contrôles automatisés ne valent pas recette réelle des formulaires avec une boîte e-mail ni validation métier complète.

## 1. Synthèse exécutive

Le site possède un parcours d'inscription / connexion à l'espace membre raccordé à Supabase Auth et une fonction serveur de création d'espace client. En revanche, les parcours publics de contact, de candidature et de positionnement sur une opportunité ne sont pas encore des formulaires opérationnels. Le CRM reste une page de présentation.

**Conclusion :** la navigation et la recherche savent conduire un visiteur vers des pages de résultats et vers l'espace membre, mais le tunnel de conversion commercial n'est pas encore fermé. Il ne faut pas présenter les formulaires publics, le dépôt de CV, le CRM ou la prise en charge d'une opportunité comme des services déjà disponibles.

## 2. Constats vérifiés

| ID | Priorité | Constat au HEAD contrôlé | État | Preuve / conséquence |
|---|---|---|---|---|
| F-01 | P1 | Le lien Contact de l'accueil pointe désormais vers `contact.html`. Le formulaire valide et prévisualise localement, mais bloque l'envoi et toute sauvegarde. | Interface corrigée ; transmission réelle en attente. | `index.html`, `contact.html`, `tests/contact-form.browser.cjs` — le visiteur peut préparer sa demande, mais MajestiOS ne la reçoit pas. |
| F-02 | P1 | « Nous rejoindre » ouvre désormais `contact.html?objet=collaboration`, sans détourner le parcours vers l'inscription client. Le dépôt de CV et la candidature persistante restent absents. | Partiellement corrigé. | `nous-rejoindre.html`, `contact.html` — les intentions sont mieux séparées, mais aucune candidature n'est enregistrée. |
| F-03 | P1 | Les cartes BOAMP/BODACC conservent la source officielle et proposent un CTA d'accompagnement qui transmet la référence et les filtres vers Contact. Aucun lead n'est créé. | Interface corrigée ; persistance en attente. | `opportunity-search.js`, `contact.html`, `tests/opportunity-search.browser.cjs` — le positionnement est contextualisé mais non transmis. |
| F-04 | P1 | Le CRM reste une page de présentation, sans fiches actives, pipeline, enregistrement ni suivi opérationnel. | Ouvert. | `crm.html`, `ETAT-BACKEND-SUPABASE.md` — ne pas le présenter comme un CRM opérationnel. |
| F-05 | P1 | Inscription, connexion et récupération de mot de passe sont raccordées au code Supabase Auth et au provisionnement client ; le cycle réel n'a pas été validé de bout en bout. | Raccordement présent ; recette E2E en attente. | `espace-membre.html`, `auth-espace-membre.js`, fonction `provision-client-workspace`. |
| F-06 | P1 | Le provisionnement exige un JWT et une adresse confirmée, puis crée une organisation `kind=client` et son propriétaire. Ce n'est pas un endpoint public de réception de prospects ou de candidatures. | Limite d'architecture documentée, non assimilée à un bug. | Fonction Edge `provision-client-workspace` ; garder séparés Auth, tenant et statut commercial. |
| F-07 | P1 | E-mail réel, redirections, modèles, récupération et protections anti-abus ne sont pas confirmés ; la préparation de l'administration interne reste à vérifier. | Ouvert / non vérifié. | `ETAT-BACKEND-SUPABASE.md` — aucune ouverture de collecte réelle avant recette E2E. |
| F-08 | P2 | Le bouton d'aide de l'accueil est un guide de visite à liens fixes, pas encore un chatbot ni un formulaire conversationnel. | Ouvert. | `index.html` — le contact assisté reste à construire. |
| F-09 | P2 | Le moteur transversal transmet les critères aux résultats ; il ne crée pas de fiche CRM ni de demande persistante. | Recherche disponible ; capitalisation CRM en attente. | `rubric-search.js`, `app.js`, `search-results.js`, `opportunity-search.js`. |
| F-10 | P2 | En connexion, le provisionnement est rappelé même si le nom d'organisation est facultatif ; la fonction Edge valide ce nom avant de rechercher une appartenance existante. | Anomalie déduite du code ; reproduction E2E réelle requise. | `auth-espace-membre.js`, `supabase/functions/provision-client-workspace/index.ts` — voir section 12 ; backend non modifié.

## 3. Éléments déjà présents à préserver

### Espace membre
- Inscription avec prénom, nom, entreprise / nom d'espace, e-mail, téléphone, mot de passe et prise de connaissance de la politique.
- Connexion par e-mail et mot de passe.
- Récupération et mise à jour du mot de passe.
- Vérification de session et affichage d'un état de connexion.
- Appel serveur de provisionnement après confirmation d'adresse.
- Contrôle d'appartenance à un espace et déconnexion.

Le formulaire impose actuellement un mot de passe d'au moins 12 caractères. Le nom de l'organisation est obligatoire à l'inscription et facultatif à la connexion. Les parcours de connexion et d'inscription sont gérés dans le même dialogue ; il faudra tester séparément les états mobile, clavier, erreurs Auth, confirmation d'e-mail et récupération.

### Recherche et résultats
- Le moteur transmet mot-clé, type de marché, catégorie et département.
- Les résultats sont limités par le moteur à dix cartes au total (cinq par source dans une recherche mixte).
- Les annonces BOAMP et les signaux BODACC sont identifiés séparément.
- Les liens vers les sources officielles sont conservés et les familles non connectées sont signalées sans inventer de résultats.

Ces comportements doivent être conservés lors de l'ajout d'un parcours de conversion.

## 4. Écarts par rapport au tunnel commercial attendu

Le tunnel cible doit permettre de passer de la découverte à une demande qualifiée :

1. **Découvrir** : consulter un marché public, un signal privé ou une entreprise.
2. **Vérifier** : conserver l'accès à la source officielle et à sa référence.
3. **Se positionner** : ouvrir un formulaire MajestiOS contextualisé par la source, l'identifiant, la catégorie et les critères de recherche.
4. **Qualifier** : recueillir les coordonnées minimales et le besoin, sans demander de données inutiles.
5. **Orienter** : distinguer prospect, client, membre, partenaire et demande à exclure.
6. **Capitaliser** : préparer la création d'une fiche CRM, avec provenance, date d'observation, consentement et historique.

À ce stade, les étapes 1 et 2 existent pour les sources connectées ; les étapes 3 à 6 ne sont pas encore un flux public persistant.

## 5. Architecture cible des formulaires — sans implémentation backend dans ce lot

Les formulaires devront être séparés par intention :

| Parcours | Objet | Données minimales envisagées | Destination future |
|---|---|---|---|
| Contact général | Poser une question ou demander un échange | Nom, prénom, e-mail, téléphone si nécessaire, objet et message | File de demandes à qualifier |
| Se positionner sur une opportunité | Demander un accompagnement ou signaler un intérêt | Coordonnées minimales, référence de l'annonce, source, besoin | Préqualification CRM |
| Créer un espace client | Créer un compte et un espace de travail | Identité, e-mail, téléphone, organisation, authentification et consentement | Auth + espace client isolé |
| Rejoindre MajestiOS | Proposer une collaboration ou candidater | Coordonnées, profil, objet de la candidature ; CV uniquement après mise en place du stockage sécurisé | File de candidatures distincte |
| Demande partenaire | Proposer une coopération | Organisation, interlocuteur, coordonnées et objet du partenariat | Qualification partenaire |

La liste minimale de contact demandée pour les formulaires de prise de contact reste : téléphone, nom, prénom et e-mail. Les champs complémentaires doivent dépendre de l'intention. La création d'un compte peut légitimement nécessiter des éléments supplémentaires propres à l'authentification.

## 6. Garde-fous de données et de sécurité

- Ne pas utiliser le formulaire d'inscription comme substitut à un formulaire de contact ou de candidature.
- Ne pas collecter de CV ou de KBIS avant définition des règles Storage, accès, conservation et suppression.
- Ne pas envoyer les données du navigateur directement dans les tables CRM avec une clé privilégiée.
- Chaque formulaire public devra passer par un endpoint serveur avec validation stricte, limitation de débit, protection anti-spam, gestion des erreurs et journalisation minimale.
- Définir la finalité, la base juridique, la notice, les champs nécessaires et la durée de conservation avant toute collecte réelle.
- Enregistrer la provenance des annonces et des entreprises ; distinguer faits publiés, hypothèses et décisions humaines.
- Séparer les statuts commerciaux prospect / client / partenaire / exclusion des types d'organisation et des rôles de membre. `organizations.kind` ne doit pas être détourné pour porter le statut commercial.
- Prévoir une liste d'exclusion opposable avant toute automatisation de prospection.
- Tester l'isolation multi-tenant et les autorisations serveur avant ouverture du CRM.

## 7. Ordre de correction recommandé

**Lot 6A — parcours et libellés (site uniquement)**
1. Distinguer clairement « Contact », « Créer mon espace client » et « Nous rejoindre ».
2. Donner au lien « Contact » une vraie destination de contact, sans le faire passer pour une inscription.
3. Prévoir sur les cartes de résultats deux actions complémentaires : consulter l'annonce officielle et demander un accompagnement / se positionner.
4. Conserver un contexte de recherche dans les liens de retour et dans la future demande.

**Lot 6B — contrats fonctionnels et formulaires**
1. Définir les schémas de chaque intention, les validations et les états de confirmation / erreur.
2. Définir le contrat serveur et les protections avant toute collecte.
3. Ajouter les tests navigateur de chaque formulaire et de chaque branche de validation.
4. Valider l'inscription, l'e-mail de confirmation, la connexion, la récupération et la déconnexion avec une vraie boîte de test.

**Lot 6C — raccordement backend (à reprendre après stabilisation du site)**
1. Distinguer prospects, clients, membres, partenaires et exclusions.
2. Créer les endpoints serveur et files d'entrée dédiés.
3. Préparer les dossiers CRM sans confondre données internes et données des espaces clients.
4. Connecter les formulaires progressivement, avec tests RLS multi-tenant et anti-régression.
5. Ajouter le stockage CV / KBIS seulement après validation de ses règles d'accès et de conservation.

## 8. Décision de ce lot

**Aucune modification applicative ou Supabase n'est effectuée dans cet audit.** Le backend reste en pause pendant la stabilisation du site, conformément au périmètre convenu. Les constats sont documentés pour éviter de présenter comme acquis des formulaires et un CRM qui ne sont pas encore opérationnels.

Le parcours Contact et le CTA de positionnement contextualisé sur les résultats BOAMP/BODACC sont maintenant présents en prévisualisation. La prochaine intervention doit poursuivre la séparation des intentions (candidature, partenariat, demande d'accompagnement) et préparer le contrat serveur. Toute collecte publique réelle attendra les garde-fous ci-dessus.

## 9. Mise en œuvre du lot 6A — page Contact (5 novembre 2026)

La branche de prévisualisation contient désormais une page dédiée `contact.html` et le lien « Contact » du pied de page d'accueil pointe vers cette page. Le CTA de `nous-rejoindre.html` ouvre le même parcours avec le motif « Rejoindre ou contribuer à MajestiOS » préselectionné ; il ne redirige plus vers la création d'un espace client.

La page conserve le moteur de recherche transversal via `rubric-search.js`. Elle distingue visuellement la prise de contact, l'espace client et la page « Nous rejoindre ».

**Limite volontaire :** le formulaire est en mode prévisualisation uniquement. Il contrôle les champs (prénom, nom, e-mail, téléphone, objet et message) puis affiche un état local ; il bloque toute soumission et ne transmet ni n'enregistre de donnée. Le backend et Supabase n'ont pas été modifiés. Il ne faut donc pas annoncer que le contact est désormais envoyé ou reçu par MajestiOS.

Un test navigateur dédié est ajouté : `tests/contact-form.browser.cjs`. Il vérifie la route depuis l'accueil, le contexte de collaboration, la présence du moteur partagé, la validation des champs et l'absence de requête de transmission. Le workflow du site exécute désormais ce test après le test de navigation.

**Critère de sortie de 6A :** destination Contact et parcours d'interface disponibles et vérifiables, mais envoi réel toujours bloqué en attente du contrat serveur sécurisé et de la recette backend.



## 10. Positionnement contextualisé depuis les résultats BOAMP et BODACC

Les cartes BOAMP et BODACC proposent désormais deux actions distinctes : consulter l'avis ou l'annonce officielle, et demander un accompagnement MajestiOS. Le second lien ouvre `contact.html` avec le type d'intention, la source, la référence de l'annonce et les critères de recherche d'origine (mot-clé, marché, catégorie et département) conservés dans l'URL.

La page Contact préremplit l'objet correspondant et affiche la source et la référence via du texte inséré avec `textContent`. Les valeurs de contexte ne sont pas envoyées ni enregistrées ; le formulaire reste en prévisualisation. Le lien officiel d'origine reste visible et inchangé sur chaque carte.

Le test navigateur des résultats vérifie les liens BOAMP et BODACC, leurs références et la conservation des filtres. Le test du formulaire vérifie également l'affichage du contexte et la restauration du mot-clé, du type de marché et du département.

**Limite inchangée :** aucun lead n'est transmis au CRM et aucun enregistrement backend n'a été activé.


## 11. Audit des destinations réelles et séparation des identités (5 novembre 2026)

Le contrôle des routes et des appels serveur après le lot 6A précise la portée réelle de chaque parcours :

| Parcours visible | Destination actuelle | Effet réellement vérifié | Qualification |
|---|---|---|---|
| Contact général | `contact.html` | Validation locale et prévisualisation ; aucune requête d'envoi ni sauvegarde | Demande de contact non transmise |
| Demander un accompagnement depuis BOAMP/BODACC | `contact.html` avec source, référence et filtres | Contexte restauré dans l'interface ; aucune création de lead | Prospect potentiel, non enregistré |
| Nous rejoindre / contribuer | `contact.html?objet=collaboration` | Motif de collaboration préselectionné ; aucun dossier de candidature transmis | Candidat ou contributeur potentiel, non enregistré |
| Créer un espace personnel | `espace-membre.html` puis Supabase Auth | Inscription/connexion Auth et provisionnement d'un espace client via fonction serveur | Compte authentifié + organisation cliente |
| Partenariat | Contact avec motif partenariat | Prévisualisation uniquement ; aucune qualification partenaire persistante | Partenaire potentiel, non enregistré |
| CRM | `crm.html` | Présentation du périmètre, sans gestion opérationnelle de fiches | Non opérationnel |

### Point de vigilance — l'inscription n'est pas une qualification commerciale

La fonction `provision-client-workspace` crée explicitement une ligne `organizations` avec `kind: "client"`, puis associe l'utilisateur avec le rôle `owner`. Lorsqu'un utilisateur se connecte, le code tente également le provisionnement de son espace si aucun espace client n'est déjà associé.

Il faut donc conserver trois notions indépendantes :

- **Identité / membre** : utilisateur authentifié et rôle d'accès dans une organisation (par exemple owner ou membre).
- **Type d'espace** : tenant interne, client ou partenaire, utilisé pour l'isolation et les autorisations.
- **Statut commercial** : prospect, client, partenaire, membre de réseau, candidat ou contact exclu / blacklisté, avec provenance, date, historique et règles de contact.

Le champ `organizations.kind` ne doit jamais devenir un substitut au statut commercial. Un compte authentifié n'est pas automatiquement un prospect qualifié ; une demande de partenariat n'est pas un compte client ; une candidature n'est pas une opportunité commerciale. La blacklist doit bloquer les actions de prospection même si une fiche ou une organisation existe.

### Décision de stabilisation

- Ne pas modifier la fonction Edge, les migrations, Auth, RLS ou les tables pendant la phase de stabilisation du site.
- Ne pas détourner l'inscription espace membre pour recueillir des prospects, partenaires ou candidatures.
- Avant toute activation des formulaires publics, spécifier des contrats d'entrée distincts (contact, positionnement, candidature, partenariat) et une file de qualification sécurisée.
- Prévoir une règle de priorité : une exclusion active bloque toute prospection ; les statuts client et partenaire doivent être explicitement confirmés et historisés ; le rôle de membre reste une autorisation d'accès, pas une qualification commerciale.
- Tester en environnement contrôlé le cycle inscription, confirmation e-mail, première connexion, provisionnement idempotent, connexion ultérieure, récupération et déconnexion avant de considérer l'espace client comme prêt à l'ouverture.

**État exact au contrôle :** le compte membre et le provisionnement d'un espace de type client existent dans le code ; les formulaires publics de contact, positionnement, candidature et partenariat ne transmettent rien ; le CRM et les statuts commerciaux différenciés ne sont pas encore opérationnels. Aucun changement backend n'est réalisé dans ce lot documentaire.


## 12. Revue complémentaire du cycle de connexion (5 novembre 2026)

La lecture croisée de `auth-espace-membre.js`, `espace-membre.html` et de la fonction `provision-client-workspace` met en évidence un point à traiter avant la recette réelle de l'espace membre.

### Constat vérifié

- En mode connexion, le champ « Entreprise ou nom de votre espace » devient facultatif dans l'interface.
- Après une connexion réussie, le navigateur appelle néanmoins systématiquement `provision-client-workspace`, en lui transmettant ce champ, même lorsqu'il est vide.
- La fonction Edge vérifie actuellement que le nom d'organisation contient au moins deux caractères **avant** de rechercher une appartenance client déjà existante.
- Par conséquent, un membre qui possède déjà un espace client et qui se connecte sans renseigner à nouveau le nom peut recevoir un message d'échec de finalisation de l'espace, alors que son authentification a réussi et que son appartenance peut être présente.
- Le statut affiché ensuite par `updateAuthStatus` peut confirmer la connexion à l'espace ; l'interface présente donc deux messages successifs qui peuvent sembler contradictoires.

### Qualification

**Anomalie de parcours / P2 — confirmation par test E2E nécessaire.** Le défaut est déductible de l'ordre des contrôles dans le code, mais il n'a pas été reproduit avec un compte Supabase réel dans cet audit. Il ne faut donc pas le présenter comme un incident de production confirmé.

### Correction recommandée — différée

Lors d'une prochaine phase autorisée sur l'authentification :
1. Ne pas relancer le provisionnement lors d'une connexion ordinaire si l'utilisateur dispose déjà d'un espace client.
2. Si aucun espace client n'existe, demander explicitement le nom de l'organisation avant de lancer le provisionnement, ou adapter le contrat serveur pour vérifier les appartenances existantes avant d'exiger ce nom.
3. Harmoniser le retour d'état : distinguer clairement « authentification réussie », « espace existant retrouvé » et « espace à créer ».
4. Ajouter des tests couvrant au minimum : connexion d'un client existant sans nom d'organisation, compte confirmé sans espace, compte avec appartenance non-client et échec serveur.

**Décision de ce contrôle :** aucune correction du JavaScript d'authentification, de la fonction Edge, d'Auth, des migrations, de RLS ou des données Supabase n'est appliquée. Supabase reste en pause conformément au périmètre convenu. Cette anomalie est consignée pour être traitée dans un lot dédié après autorisation et recette contrôlée.


## 13. Contrôle de cohérence documentaire et CI du HEAD (5 novembre 2026)

La revue complémentaire a rapproché le registre ci-dessus des parcours effectivement livrés dans les lots 6A/6B et de la dernière version du code contrôlée (`3e61cec83695dd3a4945405d63280242a2986fec`). Les anciennes descriptions F-01 à F-03 ont été rectifiées : elles décrivaient l'état antérieur à la page Contact et aux CTA contextualisés. Les états « interface corrigée » ne signifient pas « collecte active » ; les formulaires restent bloqués en prévisualisation.

Les deux workflows GitHub associés exactement à ce HEAD sont terminés avec succès :

- `Vérification anti-régression MajestiOS` — run `42082623667`, job `Tests ciblés, build et liens internes` : succès ; étapes de ciblage, qualification, suggestions APE/NAF, build, pages/liens et dix dossiers vérifiées.
- `Vérification du site MajestiOS` — run `42082623530`, job `verify-static-site` : succès ; syntaxe JavaScript, build, architecture/routes, liens/identifiants, appels de contrôle BOAMP/BODACC et tests navigateur de l'immeuble, recherche, navigation mobile/ordinateur et formulaire Contact réussis.

Ces résultats valident les contrôles automatisés sur le HEAD ; ils ne remplacent pas une recette réelle de compte Auth, d'envoi d'e-mail, de stockage CV, de collecte de contact ou de CRM. Aucune modification applicative, Supabase ou backend n'est effectuée dans cette revue.


## 14. Recherche transversale — cohérence du composant et taxonomie de repli

### F-11 — P2 — Formulaire commun dupliqué entre accueil et rubriques

**Constat vérifié :** l'accueil contient le balisage du formulaire directement dans `index.html`. Les rubriques le reconstruisent sous forme de chaîne HTML dans `rubric-search.js`. Les deux variantes réutilisent les mêmes identifiants de champs et les mêmes gestionnaires de `app.js`, mais elles ne proviennent pas d'un composant unique. La version des rubriques ajoute également la note `#search-source-note`, absente de l'accueil.

**Impact :** le comportement est partagé aujourd'hui, mais une évolution du formulaire peut être oubliée dans l'une des deux implémentations. Il s'agit d'un risque de divergence et de maintenance, pas d'une panne de recherche constatée.

**Traitement :** ouvert. À harmoniser dans un lot dédié, en conservant le placement et la présentation compacte de l'accueil. Le test de non-régression devra comparer les champs, identifiants, étapes progressives, catégories, paramètres transmis et comportement desktop/mobile sur l'accueil et plusieurs rubriques. Ne pas ajouter une note ou une section supplémentaire à l'accueil sans vérifier l'impact visuel.

### F-12 — P2 — Absence de catégorie de repli « Autre »

**Constat vérifié :** le catalogue partagé expose les catégories publiques actives et prévues, ainsi que cinq familles BODACC actives et les familles privées prévues (immobilier, emploi, offres et recherches de sous-traitance). Il n'expose pas de catégorie « Autre ». Le moteur refuse une catégorie inconnue au lieu de lui attribuer silencieusement des résultats non filtrés.

**Écart métier :** la règle de classement demandée pour les catégories non répertoriées prévoit un rattachement à « Autre ». Cette règle n'est pas représentée dans le catalogue actuel. Il ne faut pas la simuler en remplaçant une catégorie inconnue par « Toutes les catégories » : cela ferait croire à un filtrage qui n'a pas eu lieu.

**Impact :** une catégorie métier nouvelle ou non encore classée ne dispose pas d'une destination de repli explicite. Le comportement actuel est prudent (message de catégorie non reconnue), mais incomplet au regard de la taxonomie attendue.

**Traitement :** ouvert, à spécifier avant correction. Définir si « Autre » doit être une catégorie de classement, une recherche textuelle libre, ou une famille de résultats explicitement non classés ; préciser séparément le comportement public BOAMP et privé BODACC. Les familles privées sans source connectée doivent rester désactivées et ne jamais être présentées comme alimentées. Ajouter ensuite des tests catalogue, routage et résultats pour chaque marché.

### Contrôle complémentaire effectué

- `catalogue-majestios.js` centralise les catégories, les départements et les familles privées ; les familles sans source sont marquées `planned` et désactivées dans le formulaire.
- `opportunity-search.js` refuse les catégories privées inconnues et affiche un message explicite pour immobilier, emploi et sous-traitance tant que leurs sources ne sont pas connectées.
- Les résultats BOAMP et BODACC sont distincts ; le mode mixte présente les sources dans des blocs séparés et plafonne l'affichage à dix résultats au total.
- Les tests navigateur couvrent les parcours BOAMP/BODACC, les familles non connectées, les filtres et les CTA contextualisés. Le contrat d'identité du composant d'accueil et des rubriques n'est toutefois pas testé directement.
- Aucun fichier applicatif, catalogue, moteur, formulaire, source ou backend n'a été modifié dans ce lot d'audit. Ces deux constats sont inscrits au registre ; ils ne sont pas déclarés corrigés.


## 15. CI — dépendance Playwright non verrouillée (F-13, P2)

**Incident constaté sur le HEAD précédent :** les workflows « Vérification du site MajestiOS » des runs `42084560690` (événement pull_request) et `42084812786` (push du commit `cdcf34e`) échouent à l'étape d'installation Playwright, après réussite de la syntaxe JavaScript, des tests ciblés, du build, de la vérification d'architecture et des liens. Le journal npm indique `ETARGET` / `No matching version found for playwright-core@1.65.0`. Les tests navigateur suivants sont donc ignorés : ce n'est pas un échec de test applicatif, mais une dépendance flottante qui résout une version non disponible sous ce numéro exact.

**Cause :** le workflow installait `playwright` sans version explicite. Au 5 novembre 2026, la version stable publiée est `1.64.1` ; `1.65.0` apparaît comme version beta/préversion et n'est pas une version stable installable sous le numéro exact. Référence registre : [Playwright 1.64.1](https://www.npmjs.com/package/playwright/v/1.64.1).

**Correction appliquée :** `.github/workflows/verify-site.yml` installe désormais explicitement `playwright@1.64.1`. Le navigateur Chromium est installé avec le CLI correspondant à cette version. Aucun package applicatif ni fichier de production n'est ajouté.

**Validation :** sur le HEAD `bd59a4c8a7f253c85bf63d40736955b255bf4c74`, l'installation de Playwright/Chromium et toutes les étapes du workflow « Vérification du site MajestiOS » ont réussi sur le run PR `42086813743` : smoke tests BOAMP et BODACC, tests navigateur de l'immeuble interactif, du moteur de recherche, de la navigation mobile/ordinateur et du parcours Contact inclus. Le workflow anti-régression `42086813822` est également terminé avec succès.

**État :** F-13 corrigé et validé sur le HEAD indiqué. Le run déclenché par push `42086804940` était encore en cours lors de la dernière lecture ; le contrôle PR du même HEAD est, lui, entièrement vert. Cette validation ne signifie pas que les formulaires publics transmettent des données ni que le CRM est opérationnel.


## 16. Point de contrôle de la revue — HEAD bd59a4c

Au 5 novembre 2026, le HEAD de la branche de revue est `bd59a4c8a7f253c85bf63d40736955b255bf4c74`.

- Workflow PR « Vérification du site MajestiOS » — run `42086813743` : succès, toutes les étapes terminées, y compris Playwright/Chromium, smoke tests BOAMP/BODACC et quatre suites navigateur.
- Workflow PR « Vérification anti-régression MajestiOS » — run `42086813822` : succès, tests ciblés, build, liens et contrôle des dix dossiers.
- F-11 (formulaire d'accueil distinct du formulaire injecté dans les rubriques) est corrigé : le balisage est désormais défini une seule fois dans `rubric-search.js` et monté dans `#home-search-mount` à l'accueil comme dans les rubriques ; contrôles structurels et tests navigateur réussis.
- F-12 (catégorie de repli « Autre » absente) reste ouvert, car le sens du repli doit être défini sans afficher de résultats non filtrés comme s'ils étaient classés.
- F-13 (version Playwright non verrouillée) est corrigé et validé.
- F-01 à F-03 : interface corrigée, mais transmission/persistance des demandes encore absente.
- F-04 à F-09 et F-10 : restent soumis aux limites et vérifications décrites dans le registre, notamment CRM non opérationnel et parcours Auth réel non testé.

La PR #38 reste ouverte et en brouillon. Aucun merge, déploiement de production ni changement Supabase n'est effectué.


## 17. Réévaluation de F-11 — formulaire de recherche réellement commun

Le constat F-11 de la section 14 décrivait un état antérieur du code. La vérification du HEAD `7016db884e7d32da0436526c2189127ae723d460` confirme désormais :

- `index.html` ne contient plus de formulaire de recherche autonome ; il expose le point de montage `#home-search-mount`.
- `rubric-search.js` contient une seule définition `formMarkup` du formulaire `#advanced-search-form`, injectée dans le point de montage de l'accueil et dans les rubriques configurées.
- `verify-site.js` contrôle la présence du point de montage, le chargement du composant commun et ses identifiants/champs structurants.
- Le test navigateur du moteur de recherche vérifie le formulaire sur l'accueil et sur la page de résultats, ainsi que le parcours public/privé et les catégories privées.

**Statut F-11 : corrigé et vérifié.** Le risque de divergence du balisage entre accueil et rubriques est levé au niveau de la source HTML. Les textes d'introduction restent contextuels par page, ce qui est intentionnel. Aucun changement de style ni de placement de l'immeuble n'est impliqué.
