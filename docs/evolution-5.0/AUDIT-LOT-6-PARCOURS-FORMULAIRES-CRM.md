# Audit du lot 6 — parcours de conversion, formulaires et CRM

**Date de contrôle :** 5 novembre 2026  
**Commit examiné :** `fc21d09c20a2679eb78a9fb7f9745aabb1533952`  
**Branche :** `evolution-5.0-clean-preview`  
**Périmètre :** accueil, recherche et résultats, espace membre, page « Nous rejoindre », CRM et fonction serveur de provisionnement.  
**Méthode :** lecture du code réellement présent et rapprochement avec `ETAT-BACKEND-SUPABASE.md`. Les deux workflows GitHub de ce commit ont réussi ; ce succès ne vaut pas recette réelle des formulaires avec une boîte e-mail ni validation métier complète.

## 1. Synthèse exécutive

Le site possède un parcours d'inscription / connexion à l'espace membre raccordé à Supabase Auth et une fonction serveur de création d'espace client. En revanche, les parcours publics de contact, de candidature et de positionnement sur une opportunité ne sont pas encore des formulaires opérationnels. Le CRM reste une page de présentation.

**Conclusion :** la navigation et la recherche savent conduire un visiteur vers des pages de résultats et vers l'espace membre, mais le tunnel de conversion commercial n'est pas encore fermé. Il ne faut pas présenter les formulaires publics, le dépôt de CV, le CRM ou la prise en charge d'une opportunité comme des services déjà disponibles.

## 2. Constats vérifiés

| ID | Priorité | Constat | Preuve dans le dépôt | Conséquence |
|---|---|---|---|---|
| F-01 | P1 | Le lien « Contact » du pied de page d'accueil mène à `nous-rejoindre.html`, qui ne contient aucun formulaire de contact. | `index.html`, `nous-rejoindre.html` | Le visiteur ne peut pas transmettre une demande depuis le parcours annoncé « Contact ». |
| F-02 | P1 | « Nous rejoindre » présente les profils et collaborations envisagés, puis renvoie vers l'inscription à l'espace membre. La page précise que le parcours de candidature, le dépôt sécurisé de CV et l'envoi des demandes restent à connecter. | `nous-rejoindre.html` | Une candidature et la création d'un espace client sont deux intentions différentes ; elles ne doivent pas être confondues. Aucun CV n'est collecté dans cette version. |
| F-03 | P1 | Les cartes BOAMP et BODACC proposent actuellement un lien vers l'annonce officielle ; elles ne proposent pas de parcours MajestiOS « Me positionner », de demande d'accompagnement ou de préparation CRM. | `opportunity-search.js` | La vérification de la source est possible, mais la conversion commerciale depuis une annonce n'est pas encore assurée. Le lien officiel reste utile et doit être conservé. |
| F-04 | P1 | Le CRM est une page de périmètre fonctionnel, sans fiches actives, pipeline, enregistrement ni suivi opérationnel. | `crm.html` et `ETAT-BACKEND-SUPABASE.md` | Ne pas présenter le CRM comme utilisable pour gérer des prospects ou des clients. |
| F-05 | P1 | L'espace membre possède un formulaire d'inscription, de connexion et de récupération de mot de passe. Le code appelle Supabase Auth et la fonction `provision-client-workspace`. | `espace-membre.html`, `auth-espace-membre.js`, `supabase/functions/provision-client-workspace/index.ts` | Le raccordement technique existe, mais il ne prouve pas une recette complète du parcours réel. |
| F-06 | P1 | Le provisionnement exige un JWT et une adresse e-mail confirmée, crée une organisation de type client, son membre propriétaire et un accusé de prise de connaissance de la politique. | Fonction Edge `provision-client-workspace` | Le mécanisme concerne l'espace client authentifié ; ce n'est pas un endpoint public de réception de prospects ou de candidatures. |
| F-07 | P1 | La recette avec une véritable boîte e-mail, les redirections, les modèles d'e-mail, la récupération et les protections anti-abus n'est pas confirmée. Aucun compte Auth ni administrateur interne n'était provisionné au dernier contrôle backend documenté. | `ETAT-BACKEND-SUPABASE.md` | Ne pas ouvrir le parcours à une collecte réelle avant recette E2E et préparation de l'administration. |
| F-08 | P2 | Le bouton d'aide de l'accueil est un guide de visite à liens fixes, pas encore un chatbot ni un formulaire conversationnel. | `index.html` | La page l'indique honnêtement ; le contact assisté reste à construire. |
| F-09 | P2 | Le moteur de recherche est partagé sur les pages configurées et transmet les critères vers les pages de résultats ; il ne crée pas encore de fiche CRM ni de demande de positionnement. | `rubric-search.js`, `app.js`, `search-results.js`, `opportunity-search.js` | La recherche produit des pistes consultables, pas encore des dossiers commerciaux persistants. |

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
