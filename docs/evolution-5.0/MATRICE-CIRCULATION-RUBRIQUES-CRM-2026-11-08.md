# Matrice de circulation — Immeuble, rubriques, acquisition et CRM

**Date de l'inventaire :** 8 novembre 2026  
**Branche :** `feature/crm-atomic-integration`  
**Périmètre :** routes de l'immeuble, pages métier observées, liens inter-rubriques, accès CRM et capacités de transfert présentes dans le code.  
**Nature :** état vérifié du dépôt et cible fonctionnelle proposée. Ce document ne constitue pas une autorisation de modifier l'immeuble, les pages publiques, les données ou la production.

## 1. Règle d'architecture

L'immeuble interactif représente les neuf destinations de premier niveau. Le CRM, la recherche transversale, la Business Intelligence, l'administration et l'intelligence centrale sont des fonctions transversales : elles ne deviennent pas des étages supplémentaires.

Le parcours doit rester lisible dans les deux sens :

- **Immeuble → rubrique → dossier / page → résultat ou signal → qualification → transmission contrôlée → CRM.**
- **CRM → fiche entreprise / contact / opportunité / activité → contexte d'origine → rubrique ou résultat concerné.**

Le schéma reflète l'arborescence. Toute modification future de la structure doit être répercutée dans la navigation, les tests et cette matrice. Aucun déplacement, renommage ou redessin de l'immeuble n'est proposé ici.

## 2. Destinations de premier niveau — ordre actuel de l'immeuble

L'ordre ci-dessous reprend la référence d'arborescence V5 et les routes déclarées dans le dépôt.

| Niveau | Destination de l'immeuble | Route principale | Pages métier reliées observées | Relation actuelle avec le CRM |
|---|---|---|---|---|
| 08 | Espace privé | `espace-membre.html` | Authentification et provisionnement d'un espace client via `auth-espace-membre.js` | Espace client distinct du CRM interne. Pas de partage de fiches CRM internes démontré. |
| 07 | Réseau | `reseaux-synergies.html` | `sous-traitance.html`, `salons-seminaires.html` | Liens éditoriaux entre rubriques ; pas de transmission CRM depuis ces pages démontrée. |
| 06 | Développement commercial | `developpement-commercial.html` | `prospection-active.html`, `bodacc-veille-entreprises.html`, `suivi-commercial.html` | Page de coordination et de liens ; pas de bouton de transfert vers le CRM observé. |
| 05 | Prospection | `prospection-active.html` | Moteur de ciblage APE/NAF, résultats de candidats, suggestions lexicales | Le moteur public de Prospection affiche des candidats ; pas d'import direct vers le CRM depuis cette page n'est démontré. Un moteur de ciblage distinct existe dans le CRM interne. |
| 04 | Accompagnement appels d'offres | `accompagnement-appels-offres.html` | `qualification-entreprises.html`, `marches-publics.html`, `prospection-active.html` | Liens vers les rubriques métier ; pas de liaison CRM/opportunité ou transfert de dossier AO démontré. |
| 03 | Marchés publics | `marches-publics.html` | `veille-marches.html`, `accompagnement-appels-offres.html`, `sous-traitance.html` | Recherche et consultation ; pas de création d'opportunité CRM depuis le résultat démontrée. |
| 02 | Marchés privés | `marches-prives.html` | `bodacc-veille-entreprises.html`, `sous-traitance.html` | Recherche et consultation ; pas de création d'opportunité CRM depuis le résultat démontrée. |
| 01 | Réputation virtuelle | `reputation-virtuelle.html` | Diagnostic de présence et renvois vers espace privé / Réseau | Pas de fiche diagnostic reliée au CRM démontrée. |
| RDC | Accueil | `index.html` | Recherche transversale, navigation vers les neuf destinations | Le CRM n'est pas un étage ni un lien public de premier niveau ; accès interne séparé. |

**Constat de navigation :** les pages métier consultées partagent le menu principal et des liens « pour aller plus loin » vers d'autres rubriques. Les pages publiques inspectées ne proposent pas de lien direct vers `crm.html`. C'est cohérent avec le cloisonnement du CRM interne, mais le contexte de passage doit être conservé lorsqu'un collaborateur autorisé ouvre une fiche depuis une rubrique.

## 3. Pages et dossiers transversaux à rattacher

| Page / fonction | Rattachement fonctionnel | Usage observé | Point de circulation à concevoir |
|---|---|---|---|
| `crm.html` | CRM interne transversal | Poste authentifié : entreprises, contacts, opportunités, activités, relances et ciblage interne | Point d'arrivée des transmissions validées ; chaque fiche doit pouvoir retrouver son origine. |
| `suivi-commercial.html` | Développement commercial / CRM | Page éditoriale de suivi et capitalisation, avec renvois vers développement commercial, intelligence économique et réseau | Clarifier la frontière entre page explicative et poste CRM opérationnel. |
| `bodacc-veille-entreprises.html` | Marchés privés / Développement commercial | Veille des événements publiés et liens vers intelligence économique, développement commercial et réseau | Transformer un signal vérifié en piste candidate, puis proposer une revue avant CRM. |
| `veille-marches.html` | Marchés publics | Page de veille des marchés | Relier un avis à une opportunité CRM sans perdre l'identifiant, l'URL et les dates de publication/échéance. |
| `qualification-entreprises.html` | Prospection / Accompagnement AO | Qualification des entreprises | Retourner vers la fiche entreprise CRM si l'identité est confirmée ; ne pas confondre score indicatif et qualification métier validée. |
| `sous-traitance.html` | Réseau / Marchés | Exploration des coopérations et besoins de sous-traitance | Relier demande, entreprise, partenaire potentiel et opportunité ; validation humaine avant mise en relation. |
| `salons-seminaires.html` | Réseau | Parcours de rencontres professionnelles | Préparer un contact ou une activité CRM après collecte légitime et validation ; aucune création automatique. |
| `intelligence-economique.html` | Business Intelligence / Développement commercial | Mise en contexte de signaux et informations | Attacher les analyses à l'entreprise ou l'opportunité concernée, avec source, date et niveau de confiance. |
| `resultats-recherche.html` | Recherche transversale | Affichage des résultats et des critères actifs ; retour vers la recherche | Conserver le contexte de recherche et prévoir une action de préparation CRM lorsque le résultat est éligible. |
| `espace-interne.html`, `administration.html`, `admin-recherches.html` | Gouvernance et administration | Accès interne et fonctions réservées | Ne pas les confondre avec les parcours clients ni exposer leurs liens aux visiteurs non authentifiés. |

## 4. État réel du raccordement au CRM

### 4.1 Capacités présentes dans le code

Le poste `crm.html` charge le client CRM et les scripts de page. Le client CRM :

- exige une session Supabase valide ;
- reconfirme l'identité de l'utilisateur ;
- vérifie une appartenance à une organisation interne unique ;
- limite les requêtes à l'organisation interne autorisée ;
- expose les opérations de lecture, création et mise à jour des entreprises, contacts, opportunités et activités ;
- propose des recherches paginées et des relations entre les fiches ;
- conserve des champs de provenance tels que `source_label`, `source_url`, `source_type` et `source_external_id` selon le type d'objet.

Le CRM dispose également d'un moteur de ciblage interne : recherche d'entreprises par APE/NAF et département, comparaison des identifiants SIREN/SIRET avec les fiches accessibles, sélection explicite par l'utilisateur, nouvelle vérification des doublons puis création des entreprises sélectionnées au statut `to_review` (« à examiner »). Les données sources et critères sont consignés dans les notes de qualification. Cette capacité constitue un pont **à l'intérieur du CRM** entre le ciblage et les fiches entreprises.

### 4.2 Capacités non démontrées à ce stade

- Aucun transfert direct depuis les résultats de `prospection-active.html` vers `crm.html` n'a été identifié dans les fichiers consultés.
- Aucun transfert direct d'un résultat BOAMP ou BODACC vers une opportunité CRM n'a été identifié dans les fichiers consultés.
- Aucun lien de retour depuis une fiche CRM vers la route métier, les paramètres de recherche et l'identifiant du résultat d'origine n'a été identifié dans les fichiers consultés.
- Aucun registre transversal de transmissions entre rubriques et CRM n'a été identifié dans le périmètre de code examiné.
- Les formulaires publics de contact, d'inscription ou de candidature ne doivent pas être considérés comme reliés au CRM tant que la réception, la persistance, les droits et les notifications n'ont pas été testés de bout en bout.

**Conclusion :** le CRM possède une fondation de gestion de données et un ciblage interne, mais la circulation bidirectionnelle entre les moteurs métier publics et les fiches CRM reste à construire et à tester. Il ne faut pas présenter cette intégration comme déjà achevée.

## 5. Contrat de passage proposé — rubrique vers CRM

Chaque résultat éligible doit passer par un objet de transmission temporaire et explicable. Le bouton peut s'intituler provisoirement « Préparer dans le CRM » ; il ne doit pas écrire immédiatement dans la base.

| Étape | Action utilisateur / système | Contrôle obligatoire | Résultat |
|---|---|---|---|
| 1. Sélection | Le collaborateur choisit un résultat précis | Aucun transfert de lot entier par défaut | Résultat source sélectionné |
| 2. Normalisation | Le système prépare les champs communs | Schéma validé ; champs inconnus laissés vides | Aperçu normalisé |
| 3. Provenance | Le système joint les références de l'origine | Source, identifiant externe, URL, date de publication, date de collecte, route et critères | Origine traçable |
| 4. Identité | Le système recherche les correspondances entreprise / établissement | SIREN/SIRET en priorité ; aucune fusion sur le seul nom ou l'adresse | Nouveau, déjà connu ou ambigu |
| 5. Qualification | Le collaborateur examine faits, inférences et lacunes | Distinguer fait publié, donnée déclarée, calcul, hypothèse et avis IA | Décision humaine documentée |
| 6. Confirmation | Le collaborateur confirme la création ou le rattachement | Permissions serveur et statut autorisé | Écriture CRM ou annulation |
| 7. Retour | Le CRM conserve le contexte de la rubrique d'origine | Lien source vérifié et autorisé | Retour possible vers la page et le résultat |
| 8. Audit | L'opération est journalisée | Auteur, horodatage, organisation, champs transférés, décision et résultat | Historique consultable |

### Objets à créer ou relier

- **Entreprise / établissement :** identité normalisée et identifiants officiels disponibles.
- **Opportunité :** avis de marché, besoin, signal commercial ou piste, selon la nature réelle du résultat.
- **Contact :** uniquement lorsqu'une personne et des coordonnées peuvent être traitées pour une finalité déterminée ; statut de consentement/opposition à contrôler.
- **Activité :** recherche, revue, appel, rendez-vous ou décision effectivement réalisée.
- **Transmission :** trace de la circulation entre la rubrique et le CRM, avec son résultat.

Ne pas créer artificiellement un contact à partir d'une annonce. Ne pas convertir automatiquement un signal en opportunité qualifiée. Ne jamais envoyer un message ou contacter un tiers par le seul fait d'une transmission CRM.

## 6. Contrat de retour — CRM vers rubrique

Chaque fiche CRM issue d'une rubrique doit pouvoir exposer, sous réserve des droits :

1. **Origine :** nom fonctionnel de la rubrique, route interne et identifiant du résultat.
2. **Recherche :** critères pertinents et horodatage, sans exposer de secrets ni de paramètres personnels non nécessaires.
3. **Source :** référence officielle, URL et date de publication/collecte.
4. **État du résultat :** disponible, expiré, supprimé ou source inaccessible.
5. **Action de retour :** ouvrir le dossier d'origine ou afficher une page de contexte si le résultat n'est plus disponible.

Le retour ne doit pas dépendre uniquement du titre de l'entreprise, qui peut changer ou être partagé. Il doit s'appuyer sur des identifiants stables et une route contrôlée.

## 7. Matrice des parcours à implémenter et à tester

| ID | Parcours | Point de départ | Destination | Retour attendu | Priorité |
|---|---|---|---|---|---|
| CIRC-01 | Prospection entreprise | Candidat du moteur de Prospection | Aperçu de transmission puis fiche entreprise CRM | Fiche → résultat / critères de prospection | P1 |
| CIRC-02 | Avis de marché public | Résultat BOAMP | Opportunité CRM reliée à un acheteur et, si confirmé, à une entreprise | Opportunité → avis BOAMP d'origine | P1 |
| CIRC-03 | Signal marché privé | Résultat BODACC | Signal conservé puis opportunité à examiner si pertinente | Opportunité → annonce BODACC d'origine | P1 |
| CIRC-04 | Qualification entreprise | Dossier de qualification | Fiche entreprise CRM existante ou à créer après contrôle | Fiche → diagnostic et éléments de qualification | P1 |
| CIRC-05 | Accompagnement AO | Dossier / consultation | Opportunité et activités liées | Fiche → consultation, lots et exigences d'origine | P2 |
| CIRC-06 | Sous-traitance | Besoin ou offre de coopération | Opportunité et entreprises candidates | Fiche → besoin et contexte réseau | P2 |
| CIRC-07 | Réseau / salons | Rencontre ou relation identifiée | Contact et activité CRM après validation | Contact → événement / contexte de rencontre | P2 |
| CIRC-08 | Réputation virtuelle | Diagnostic d'une entreprise / d'un établissement | Fiche entreprise et activité de diagnostic | Fiche → diagnostic, date et éléments vérifiables | P2 |
| CIRC-09 | Suivi commercial | Action réalisée dans le CRM | Activité CRM liée à une fiche et une rubrique | Activité → contexte métier | P1 |
| CIRC-10 | Résultats recherche transversale | Résultat éligible | Préparation de transmission contextualisée | CRM → résultat et filtres d'origine | P2 |

## 8. Exigences communes de recette

Chaque parcours doit être testé en desktop et mobile, avec un utilisateur autorisé et un utilisateur sans droit. Les cas minimaux sont :

- navigation directe depuis l'immeuble et depuis les liens contextuels ;
- conservation de l'URL, du résultat et des critères pertinents ;
- absence de fuite des pages internes ou données CRM ;
- résultat déjà présent par SIREN/SIRET ;
- résultat ambigu ou sans identifiant robuste ;
- source inaccessible ou résultat expiré ;
- données partielles et champs manquants ;
- refus d'autorisation, session expirée et erreur réseau ;
- annulation avant écriture ;
- création confirmée et retour vers l'origine ;
- absence d'envoi externe non demandé ;
- vérification du journal d'audit et de l'organisation propriétaire.

Les tests doivent couvrir les permissions côté serveur / RLS, et pas seulement masquer des boutons dans le navigateur.

## 9. Ordre d'exécution recommandé

### Lot A — Cartographie et contrat (sans changement d'interface)
1. Valider cette matrice avec le fondateur.
2. Définir le contrat commun de transmission et le modèle d'origine.
3. Vérifier le schéma Supabase actuellement déployé et les politiques RLS avant de proposer une migration.
4. Fixer les règles de provenance, de dédoublonnage, de statut et de rétention.

### Lot B — Premier parcours de bout en bout
1. Commencer par **CIRC-01 Prospection → CRM**, car un moteur de ciblage et une insertion CRM existent déjà dans le poste interne.
2. Examiner ensuite si le moteur public de Prospection peut réutiliser ce service de préparation sans dupliquer la logique.
3. Tester les doublons, les identifiants manquants, les rôles et le retour vers l'origine.
4. Ne pas exposer les noms de fournisseurs ou les catalogues de sources dans le moteur de Prospection.

### Lot C — Opportunités publiques et privées
1. Ajouter une transmission BOAMP puis BODACC avec leurs contrats de données distincts.
2. Préserver les identifiants et URLs officiels.
3. Séparer signal, opportunité et qualification.
4. Ajouter les retours vers les annonces d'origine.

### Lot D — Réseau, accompagnement et réputation
1. Relier les dossiers et activités aux fiches CRM.
2. Ajouter les liens de contexte réciproques.
3. Valider les règles de confidentialité et de contact avant toute action externe.

### Lot E — Intelligence assistée
1. Lecture et synthèse sourcées en premier.
2. Préparation d'une transmission en second.
3. Confirmation humaine avant écriture.
4. Actions externes uniquement dans un périmètre autorisé, après gouvernance et recette.

## 10. Garde-fous non négociables

- Ne pas modifier l'image, les zones cliquables, les étages, les intitulés ou l'arborescence de l'immeuble dans le cadre de cette cartographie.
- Ne pas transformer le CRM en étage de premier niveau.
- Ne pas créer de doublon entre le moteur transversal de l'accueil et le moteur métier de Prospection.
- Ne pas rendre visibles les fournisseurs du moteur de Prospection.
- Ne pas confondre CRM interne et espace client.
- Ne pas importer automatiquement un lot de résultats.
- Ne pas fusionner automatiquement des entreprises sur un rapprochement approximatif.
- Ne pas déclencher d'e-mail, de publipostage, de message ou de contact externe sans approbation et contrôle de finalité.
- Ne pas effectuer de migration Supabase, de changement RLS, de déploiement production ou de fusion de branche sans autorisation explicite.
- Conserver des tests anti-régression pour les routes, les droits, le moteur unique de Prospection et les parcours de retour.

## 11. Décisions restant à prendre

1. Le premier parcours pilote sera-t-il Prospection → CRM, ou souhaites-tu prioriser une autre circulation ?
2. Les fiches CRM doivent-elles afficher un panneau « Origine et contexte » commun, ou une section dédiée à chaque famille de rubrique ?
3. Quel rôle interne peut confirmer une transmission et quels rôles peuvent seulement la préparer ?
4. Quelles informations de recherche doivent être conservées durablement et pendant combien de temps ?
5. Comment articuler le futur rôle de l'intelligence centrale avec la préparation, la validation et la traçabilité des transmissions ?

**État final de cet inventaire :** l'arborescence de premier niveau et plusieurs liens inter-rubriques sont déjà présents ; le CRM interne et son ciblage sont opérationnels dans le code avec des contrôles d'accès ; la circulation bidirectionnelle rubrique ↔ fiche CRM n'est pas encore démontrée. La prochaine implémentation doit commencer par le contrat de transmission et un parcours pilote, pas par une refonte visuelle.


## 12. Arbitrage fondateur — circulation des données, validation Administration et attribution

**Décision fonctionnelle confirmée le 8 novembre 2026 :**

- Toutes les données métier pertinentes peuvent circuler entre les rubriques, les moteurs, les dossiers et le CRM, sous réserve de contrôles et de validation par l'Administration.
- La validation administrative constitue le point de contrôle avant diffusion, partage ou attribution. Elle ne signifie pas que toutes les données doivent être visibles par tous les membres.
- Après validation, les données et résultats sont renvoyés au membre qui en a fait la demande ou au collaborateur auquel ils ont été affectés.
- Le système doit donc conserver l'identité du demandeur, le bénéficiaire final, l'éventuel collaborateur affecté, le motif de la demande, le périmètre d'accès, le statut de validation et l'historique des transmissions.
- À terme, une partie des tâches aujourd'hui préparées ou réalisées par les utilisateurs pourra être déléguée à **Cheexpeer**, l'IA intégrée à MajestiOS. Cette délégation sera progressive et encadrée par les droits, les validations et la traçabilité définis par l'Administration.

### Cycle de circulation cible

1. **Demande ou collecte :** un membre ou un collaborateur déclenche une recherche, demande une donnée ou produit un résultat dans une rubrique.
2. **Préparation :** MajestiOS rassemble les éléments utiles, leur provenance et le contexte de la demande.
3. **Contrôles :** contrôle de qualité, cohérence, doublons, provenance, confidentialité, droits d'accès et finalité.
4. **Validation Administration :** un administrateur habilité approuve, refuse ou demande une correction. La décision est horodatée et attribuée à son auteur.
5. **Affectation :** le résultat validé est adressé au demandeur ou affecté à un collaborateur désigné. Une réaffectation doit rester traçable.
6. **Restitution :** le bénéficiaire retrouve les éléments dans son espace autorisé, avec le lien vers la rubrique, le dossier et le contexte d'origine.
7. **Suivi et capitalisation :** les actions et décisions effectivement réalisées sont consignées dans le CRM selon les droits applicables.

### Séparation des responsabilités

| Acteur | Responsabilité cible | Limite |
|---|---|---|
| Membre demandeur | Formuler une demande, consulter les éléments qui lui sont restitués et suivre son traitement | Ne valide pas administrativement les données ni les droits d'autrui |
| Collaborateur affecté | Traiter la tâche ou exploiter les données dans le périmètre attribué | N'accède qu'aux dossiers et données autorisés |
| Administrateur | Contrôler, valider, refuser, demander une correction, attribuer ou réattribuer | Les actions doivent être journalisées ; les accès restent soumis aux règles de sécurité |
| Cheexpeer | À terme, préparer, analyser, classer, rapprocher, proposer une affectation et exécuter certaines tâches déléguées | N'obtient pas de pouvoir d'approbation administrative implicite et respecte les permissions et validations configurées |

### Registre de circulation à prévoir

Chaque transmission doit conserver au minimum : identifiant de demande, rubrique et dossier d'origine, identifiant du résultat, provenance et date, demandeur, organisation, bénéficiaire, collaborateur affecté le cas échéant, statut de contrôle, décision et auteur de validation, horodatages, droits appliqués, destination, historique des changements et lien de retour.

Les données personnelles, confidentielles ou contractuellement limitées doivent faire l'objet de règles de visibilité adaptées. Une validation d'Administration ne remplace ni la base légale du traitement, ni les permissions serveur, ni les politiques RLS.

### Place de Cheexpeer dans la trajectoire

Cheexpeer est le nom retenu par le fondateur pour l'IA intégrée à MajestiOS. Son périmètre fonctionnel sera défini progressivement. La première étape consiste à lui faire préparer des tâches et des propositions explicables ; les étapes ultérieures pourront inclure des traitements délégués, uniquement dans les limites expressément autorisées. La validation Administration reste distincte de l'exécution par l'IA.

**Cet arbitrage remplace l'hypothèse précédente d'une simple transmission individuelle vers le CRM : la cible est une circulation gouvernée à l'échelle de MajestiOS, avec restitution au demandeur ou au collaborateur affecté.**
