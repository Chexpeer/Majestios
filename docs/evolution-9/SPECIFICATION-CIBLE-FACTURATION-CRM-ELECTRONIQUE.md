# Spécification cible — CRM, facturation et facturation électronique

**Branche :** Evolution-9  
**Date :** 11 novembre 2026  
**Statut :** cadrage stratégique et fonctionnel à valider avant développement de la phase 2.  
**Règle de vérité :** ce document décrit une cible. Le CRM client, le module MajestiOS Facturation et les connecteurs vers plateformes agréées ne sont pas démontrés comme opérationnels.

## 1. Décision de conception

La facturation n'est pas un simple lien externe ajouté au CRM après coup. Elle constitue un domaine métier intégré à l'expérience CRM, préparé dès la conception du modèle de données et des parcours.

Le CRM doit pouvoir accompagner le cycle commercial et opérationnel jusqu'au règlement :

**Entreprise → Contact → Besoin / opportunité → Devis → Commande ou accord → Chantier / intervention / prestation → Facture → Transmission électronique → Statuts et rejets → Règlement → Archivage et historique.**

Le périmètre doit rester modulaire : un client peut utiliser le CRM MajestiOS, conserver son CRM/logiciel métier actuel, ou adopter une organisation hybride.

## 2. Trois domaines à distinguer

### 2.1 CRM commercial et opérationnel

Responsable des entreprises, contacts, opportunités, tâches, devis, commandes, interventions, documents et événements de la relation client.

### 2.2 MajestiOS Facturation

Domaine métier indépendant de l'interface CRM, responsable notamment de :
- référentiel des clients facturés et adresses de facturation ;
- devis, versions, acceptations et conversion en facture ;
- factures, lignes, unités, quantités, prix, remises, taxes et totaux ;
- échéances, acomptes, factures de solde et avoirs ;
- règlements, rapprochements et restes à payer ;
- statuts métier, corrections, annulations autorisées et historique ;
- documents lisibles, données structurées, pièces jointes et exports ;
- factures émises et, selon le périmètre partenaire, factures reçues.

Le moteur de facturation ne doit pas dépendre de l'écran CRM. Il doit exposer un contrat stable que le CRM natif et les connecteurs externes peuvent utiliser.

### 2.3 MajestiOS Connect et plateforme agréée

Connect assure les échanges entre le noyau de facturation, le CRM ou logiciel externe du client, et la plateforme agréée (PA) sélectionnée.

**MajestiOS n'est pas une PA.** Le partenaire PA réalise les opérations réglementaires qui relèvent de son agrément et du contrat. MajestiOS prépare les données, orchestre les demandes autorisées, restitue les statuts et assure la traçabilité de son propre périmètre.

## 3. Trois modes d'utilisation à prendre en charge

1. **Natif :** le client utilise le CRM MajestiOS et MajestiOS Facturation. Le CRM et la facturation partagent les références client et les liens entre devis, prestations et factures.
2. **Connecté :** le client conserve son CRM ou logiciel métier. MajestiOS fournit seulement les services convenus (par exemple accompagnement, connecteur ou accès à la facturation) sans imposer une migration.
3. **Hybride :** certains objets sont gérés dans MajestiOS et d'autres dans le logiciel du client. La répartition est explicitement définie et documentée.

Pour chaque catégorie de données, il faut désigner une **source de référence**. Une même facture ne doit jamais être créée indépendamment dans deux systèmes. Les synchronisations doivent utiliser des identifiants externes stables, des clés d'idempotence, des versions et un journal de rapprochement.

## 4. Contrats de données à prévoir

Le modèle cible devra au minimum relier, sans les confondre :
- organisation émettrice et établissement concerné ;
- client facturé, destinataire, adresses et identifiants nécessaires ;
- devis et versions, commande ou référence d'engagement ;
- prestation, chantier, intervention ou période facturée ;
- facture, lignes, taxes, totaux, échéances et conditions de paiement ;
- avoir et référence à la facture d'origine ;
- règlement, allocation et solde ;
- transmission PA, identifiant externe, horodatage et statut ;
- événements, rejets, corrections, pièces justificatives et preuves ;
- acteur humain ou système, mission éventuelle et piste d'audit.

Les données fiscales et réglementaires doivent être versionnées et validées par expertise compétente avant implémentation. Les règles de numérotation, d'inaltérabilité, de conservation, d'accès et d'archivage devront faire l'objet d'une spécification dédiée.

## 5. Cycle de vie et intégration PA

Le cycle cible doit permettre de suivre distinctement :
- préparation et validation interne ;
- émission de la facture dans le système de référence ;
- demande de transmission à la PA ;
- accusé de réception technique ;
- statuts de traitement métier restitués par la PA ;
- rejet, motif, correction et nouvelle tentative contrôlée ;
- mise à jour du statut de paiement et rapprochement ;
- clôture et conservation de la preuve.

Ne pas confondre le statut métier de la facture, le statut de transport/API, le statut réglementaire renvoyé par la PA et le statut de règlement.

Les appels API, webhooks et reprises doivent être authentifiés, idempotents, horodatés et journalisés. Une panne ou un timeout ne doit pas déclencher une seconde facture ni une double transmission. Prévoir une file de reprise, un rapprochement périodique et une procédure d'intervention manuelle.

La couverture des flux d'émission, de réception, d'e-reporting et des cas particuliers dépendra des obligations applicables, du partenaire et du contrat. Elle devra être vérifiée à la date de mise en service, sans présumer qu'un PDF est une facture électronique réglementaire.

## 6. Parcours utilisateur cible

Depuis une fiche client :
1. consulter les informations de facturation et le logiciel source ;
2. créer ou retrouver un devis ;
3. transformer le devis accepté en commande ou prestation selon le métier ;
4. préparer la facture à partir des données validées, sans ressaisie inutile ;
5. vérifier les mentions, lignes, taxes et totaux ;
6. faire valider l'émission par un utilisateur habilité ;
7. transmettre via la PA configurée ;
8. suivre les statuts, rejets et demandes de correction ;
9. enregistrer ou rapprocher le règlement ;
10. retrouver l'ensemble des pièces et événements depuis la fiche client.

Le parcours doit être compréhensible pour un artisan sur mobile, avec des libellés simples, des contrôles explicites et des erreurs actionnables.

## 7. Cheexpeer et automatisation

Cheexpeer pourra assister l'utilisateur pour préparer un devis, repérer une échéance, expliquer un rejet, résumer une situation client ou préparer une relance.

Il ne doit pas, par défaut, émettre une facture, modifier un montant, créer un avoir, choisir un traitement fiscal, transmettre une facture à la PA ou déclencher une action engageante sans habilitation explicite et validation prévue. Toute action devra conserver l'identité de l'acteur humain ou système, la mission, les données utilisées et le résultat.

## 8. Sécurité, séparation et réversibilité

- Séparation stricte du CRM interne MajestiOS et des espaces CRM clients.
- Isolation par organisation sur toutes les données et tous les documents.
- Contrôle serveur des rôles et permissions, pas seulement dans l'interface.
- Secrets PA isolés par environnement et partenaire ; jamais dans le navigateur.
- Journalisation des consultations et opérations sensibles selon une politique définie.
- Exports complets et documentés, pièces jointes comprises.
- Capacité de changer de PA ou de CRM externe sans perdre l'historique ni les références.
- Politique de conservation, archivage et suppression validée juridiquement.
- Aucune donnée de facturation réelle dans les tests ; utiliser des organisations, identités et documents synthétiques.

## 9. Préparation dès la phase CRM actuelle

Même si le module est développé en phase 2, le CRM en cours doit préserver les prérequis suivants :
- identifiants organisation, entreprise et contact stables ;
- adresses et coordonnées de facturation distinctes des coordonnées commerciales ;
- capacité à enregistrer les identifiants légaux nécessaires et leur provenance ;
- lien entre opportunité, devis, commande, prestation et document ;
- gestion des pièces et références externes ;
- événements historisés avec acteur humain ou système ;
- modèle de permissions extensible sans ouvrir le CRM interne ;
- contrats d'API et de synchronisation conçus sans dépendance à une PA particulière.

Ne pas créer prématurément un schéma de facturation partiel dans le CRM actuel si les règles métier, les obligations et le partenaire ne sont pas encore validés. Préparer les interfaces et les identifiants, puis concevoir le domaine de facturation comme un lot cohérent.

## 10. Lots de réalisation phase 2

| Lot | Objet | Critère de sortie |
|---|---|---|
| F2-01 | Entretiens et parcours artisans | Cas d'usage priorisés et validés |
| F2-02 | Architecture CRM natif / externe / hybride | Source de référence par objet, règles anti-doublon et contrats documentés |
| F2-03 | Modèle métier Facturation | Devis, factures, avoirs, taxes, règlements, événements et états validés |
| F2-04 | Étude PA et modèle contractuel | Statut officiel vérifié, API/sandbox, coûts, responsabilités et réversibilité |
| F2-05 | Prototype Facturation sur données synthétiques | Parcours devis → facture → règlement testé sans flux réglementaire réel |
| F2-06 | Connecteur PA en sandbox | Émission/réception et statuts/rejets testés, idempotence démontrée |
| F2-07 | Connecteurs CRM externes prioritaires | Synchronisation contrôlée, reprise et absence de doublons prouvées |
| F2-08 | Accompagnement dématérialisation | Diagnostic, contenus pédagogiques et parcours d'orientation |
| F2-09 | Réseau partenaires | Statut de chaque partenaire vérifié et affiché sans ambiguïté |
| F2-10 | Pilote contrôlé | Sécurité, conformité, support, coûts et recette globale validés |

## 11. Critères d'acceptation avant ouverture

- Un devis accepté peut devenir une facture sans ressaisie incohérente.
- Une facture ne peut pas être créée deux fois par répétition d'une requête ou d'un webhook.
- Les états de facture, de transmission et de règlement sont distingués.
- Les rejets sont expliqués, historisés et corrigibles sans effacer la preuve initiale.
- Les accès d'une organisation ne révèlent aucune donnée d'une autre.
- Le CRM externe reste utilisable selon le contrat d'intégration choisi.
- L'export permet de récupérer les factures, pièces et événements dans un format documenté.
- Les tests sandbox PA sont reproductibles et les limites contractuelles connues.
- Les validations humaines et permissions sont appliquées aux actions engageantes.
- Aucune promesse réglementaire ou commerciale ne dépasse les capacités réellement déployées et recettées.

## 12. Décisions encore ouvertes

- Périmètre fonctionnel du premier CRM client et du premier noyau de facturation.
- CRM/logiciels externes prioritaires et stratégie de synchronisation par objet.
- PA partenaire, contrat, tarification, périmètre des flux et support.
- Règles détaillées de numérotation, conservation, archivage et réversibilité.
- Modèle économique, quotas et répartition des coûts tiers.
- Niveau d'automatisation Cheexpeer et validations requises.
- Répartition exacte des responsabilités entre MajestiOS, le client, le logiciel externe et la PA.

**Principe directeur :** MajestiOS doit permettre à une entreprise de développer son activité, gérer ses clients et aller jusqu'à la facturation électronique dans un parcours cohérent, sans l'obliger à abandonner son CRM existant et sans jamais créer de double source de vérité.
