# Épuration éditoriale — troisième passe — Evolution-9

**Date :** 11 novembre 2026  
**Branche :** `Evolution-9`  
**Pages modifiées (15) :** `developpement-commercial.html`, `reputation-virtuelle.html`, `nous-rejoindre.html`, `prospection-active.html`, `faq.html`, `qualification-entreprises.html`, `facturation-electronique.html`, `vision-majestios.html`, `marches-publics.html`, `marches-prives.html`, `accompagnement-appels-offres.html`, `espace-membre.html`, `espace-prive.html`, `intelligence-economique.html`, `crm.html`

## Constat

La page conservait une mention « ÉTAGE 06 · ORCHESTRER », vestige de l'ancienne représentation du site en étages, qui ne correspond plus à l'orientation documentaire actuelle.

## Correction

- Suppression de la mention d'étage.
- Conservation du titre « Des pistes aux actions ».
- Réécriture du texte en une phrase courte : « Repérez les informations utiles, définissez vos priorités et organisez votre suivi commercial. »
- Suppression de la phrase redondante « Votre bénéfice ».
- Conservation de la section et de sa structure visuelle ; aucun lien, formulaire, script ou parcours n'a été retiré.

## Deuxième correction de la passe

Sur `reputation-virtuelle.html` :
- Titre et introduction raccourcis et recentrés sur l'image en ligne de l'entreprise.
- Textes des trois axes simplifiés : présence locale, avis et confiance, référencement naturel.
- La condition préalable d'accord de l'entreprise avant consultation des avis est explicitement conservée, ainsi que la validation humaine des réponses.
- Les avertissements sur l'absence de connexion Google active et la vérification des constats restent inchangés.

**Commits des pages :**
- `developpement-commercial.html` : `04d78d50e904c86c2d06e38152f7c6da49ba84e0`.
- `reputation-virtuelle.html` : `b911d0ee6f410bd79c4718b1830ffb2f54e601ab`.
- `nous-rejoindre.html` : `bd9ce119afdb856c492cd35a195de672ca6051c9`.
- `prospection-active.html` : `1e4ccb6964a5b5e8288623e15932b6cec8568bb4`.

## Troisième correction de la passe

Sur `nous-rejoindre.html` :
- Introduction et présentations des trois publics raccourcies.
- Les modalités non disponibles restent explicitement signalées : dépôt de CV et envoi des demandes non activés ; aucun CV n'est collecté.
- Les liens de contact et d'espace membre sont conservés.

## Quatrième correction de la passe

Sur `prospection-active.html` (rubrique affichée sous le libellé « Prospection ») :
- Accroche réécrite pour décrire la fonction réelle de recherche et de qualification, sans laisser entendre que MajestiOS réalise une prestation de prospection déléguée.
- Mention obsolète « ÉTAGE 05 · IDENTIFIER » supprimée.
- Bloc de présentation raccourci ; moteur de recherche, critères, résultats, avertissements et liens vers les autres rubriques conservés.
- Aucun intitulé de navigation modifié.

## Contrôles et limites

Les contenus sources ont été relus après modification. La validation automatisée du site doit être confirmée sur le HEAD final de cette passe par GitHub Actions. Aucun test navigateur n'est déclaré réussi avant lecture de ce résultat.

Aucune migration, donnée, configuration, permission, secret, intégration externe ou déploiement n'a été modifié.


## Cinquième correction de la passe

Sur `faq.html` :
- Le bloc de découverte évoquait encore un « schéma interactif », alors que l'orientation actuelle repose sur une navigation classique.
- Le texte et le lien ont été remplacés par une invitation à explorer les rubriques et les fonctionnalités présentées sur le site.
- Les questions, réponses, liens de navigation et contrôles d'accès décrits dans la FAQ sont conservés.
- Correction versionnée sur Evolution-9, commit `19f88757699c95a13b533ab114f4335f58072610`.


## Sixième correction de la passe

Sur `qualification-entreprises.html` :
- Présentation initiale raccourcie : recherche par codes APE/NAF et département, interrogation de l'annuaire public et résultats à vérifier.
- Les critères de recherche, les avertissements de qualification, la limite de non-enregistrement dans le CRM et les contrôles de l'opérateur restent inchangés.
- Correction versionnée sur Evolution-9, commit `c4d28bd9c5db9dfd20d418f3177abc802be96d4e`.


## Septième correction de la passe

Sur `facturation-electronique.html` :
- Le long paragraphe d'introduction isolé sous le titre a été supprimé de cette position.
- Son message essentiel a été déplacé dans la première carte et simplifié : « Vérifiez vos obligations et préparez vos outils. »
- Le rappel du périmètre des entreprises concernées reste dans cette carte ; les précisions réglementaires, le calendrier, les liens officiels et les limites de l'offre MajestiOS sont conservés.
- Aucun lien, script, parcours ou contenu réglementaire utile n'a été supprimé.
- Correction versionnée sur Evolution-9, commit `46d8c2c6f95d0dc4af614d602022258fe2dcc809`.


## Huitième correction de la passe

Sur `vision-majestios.html` :
- L'introduction de la vision a été raccourcie sans déplacer son emplacement, qui est cohérent dans le bloc d'ouverture de la page.
- Nouvelle formulation : « Les opportunités se repèrent, se comprennent et se construisent. MajestiOS aide à transformer les bons signaux en démarches commerciales. »
- La doctrine « L’IA propose, l’humain dispose », le cycle de développement et les limites de promesse restent inchangés.
- Correction versionnée sur Evolution-9, commit `468a191c2e9d87000e55cbf4cdf4bb12dffec000`.


## Neuvième correction de la passe

Sur `marches-publics.html`, `marches-prives.html`, `accompagnement-appels-offres.html` et `espace-membre.html` :
- Suppression des repères « ÉTAGE » qui maintenaient l'ancienne navigation conceptuelle.
- Sur l'accompagnement, remplacement de la scène de bâtiment et du faux parcours visuel par une carte textuelle courte, explicitement présentée comme un fonctionnement cible.
- Sur les marchés publics et privés, simplification des blocs de présentation sans retirer les précautions sur la vérification des annonces.
- Dans l'espace membre, suppression du bloc redondant sur le pilotage, déjà couvert par les contenus de la page.
- Les liens de navigation, les accès et les fonctionnalités existantes sont conservés.

Les quatre corrections sont versionnées sur `Evolution-9`. La CI doit être vérifiée sur le HEAD documentaire final de cette mise à jour.


## Dixième correction de la passe

Sur `intelligence-economique.html` : retrait du bâtiment illustratif et de la mention « parcours guidé interactif », qui suggéraient une interface non disponible et contredisaient la navigation classique retenue. Remplacement par une carte textuelle courte. Le statut « en préparation », la vérification des sources et la distinction entre faits et hypothèses sont conservés.


## Onzième correction de la passe

Sur `crm.html`, le bloc des relances ne prétend plus que le serveur « actualise » l'écran toutes les cinq minutes. Le titre devient « Relances persistantes ». Le texte distingue la conservation dans le CRM, la création automatique dépendante du traitement planifié effectivement activé sur l'environnement connecté, et le rechargement de la liste avec le CRM. Le code de `crm-page.js` charge la liste lors de l'appel à `refresh()` ; aucun rafraîchissement périodique du navigateur n'a été constaté dans cette fonction.


## Douzième correction de la passe

L'introduction de `crm.html` énumère désormais les modules effectivement présentés dans l'interface : entreprises, contacts, opportunités, activités et relances. Le terme générique « historique » a été remplacé par « activités et relances » afin de ne pas laisser entendre que toute modification de fiche est systématiquement historisée sur l'environnement principal : l'audit technique a relevé l'absence des triggers d'historisation attendus sur `majestios-crm`, et la migration corrective n'est pas appliquée à distance.


## Treizième correction de la passe — disponibilité de l'espace Membres

La lecture du code et la vérification en lecture seule des Edge Functions du projet `majestios-crm` ont montré que `auth-espace-membre.js` appelait `provision-client-workspace`, fonction absente de l'environnement connecté. Le parcours pouvait donc créer/vérifier un compte Auth sans terminer la création de son espace.

Corrections sur `espace-membre.html`, `espace-prive.html` et `auth-espace-membre.js` :
- l'interface présente désormais la connexion des membres existants ;
- la création de nouveaux espaces est explicitement annoncée comme temporairement suspendue ;
- le parcours OTP utilise `shouldCreateUser: false` et ne crée plus de compte orphelin ;
- si l'adresse est vérifiée mais qu'aucune appartenance n'existe, l'utilisateur reçoit un message explicite au lieu d'un appel à la fonction absente ;
- le test `tests/auth-espace-membre-otp.test.cjs` est adapté à ce contrat.

Aucune fonction Edge n'a été déployée et aucune configuration Supabase n'a été modifiée. La réactivation de l'inscription nécessitera le déploiement contrôlé et la recette de `provision-client-workspace`.


**Contrôle d'architecture associé :** le premier passage CI après suspension de l'inscription a révélé deux assertions qui exigeaient encore un parcours d'inscription immédiatement actif et un appel frontend au provisionnement. `verify-architecture.js` a été ajusté pour vérifier le contrat réellement retenu : connexion OTP seule, absence de création de compte et absence d'appel à la fonction Edge non déployée. Le code source de la fonction et sa migration restent contrôlés séparément comme fondation à activer ultérieurement.


## Onzième correction de la passe — suspension complète de l’inscription

Sur `espace-membre.html` et `auth-espace-membre.js` : suppression des champs et consentements réservés à l’inscription ainsi que de tout mode d’inscription dormant. Le formulaire ne propose plus que la connexion OTP des membres existants (`shouldCreateUser: false`). Le contrôle du rattachement à une organisation reste effectué après vérification du code. Le contrat de sécurité CRM a été aligné sur ce parcours : il ne doit plus exiger l’ancien flux de provisionnement depuis le navigateur. La fonction Edge et sa migration restent conservées pour une réactivation ultérieure après déploiement et recette, sans activation distante dans cette correction.


## Douzième correction de la passe — alignement du contrôle d’architecture

Le contrôle `verify-architecture.js` exigeait encore l’appel à `setMode("login")`, vestige du mode d’inscription supprimé. Il vérifie désormais directement que l’OTP reste disponible, que `shouldCreateUser: false` est imposé et qu’aucun mode ou champ d’inscription ne subsiste. Le test Auth OTP renforce aussi l’absence de champs et de logique d’inscription.
