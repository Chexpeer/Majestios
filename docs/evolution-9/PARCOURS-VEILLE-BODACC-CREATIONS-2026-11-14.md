# Parcours « veille BODACC → tri → audit de communication » — 14 novembre 2026

Statut : **conception, rien n'est déployé.** Branche `test-ecriture-claude`, projet Supabase MajestiOS-Test uniquement. `majestios-crm` n'est pas concerné.

## 1. Mission visée (énoncée par le porteur le 14/11)

Parmi ses missions, Cheexpeer repère les entreprises **récemment créées** dans le BODACC et évalue **la façon dont elles communiquent**, pour alimenter la prospection dans le CRM.

Périmètre géographique de départ (décision du porteur, 14/11) : **Île-de-France, Normandie, Pays de la Loire, Bretagne.**

Secteurs prioritaires (décision du porteur, 14/11) : **bâtiment (tous corps d'état)** et **hôtellerie-restauration** ; d'autres secteurs seront ajoutés plus tard.

Note technique : l'annonce BODACC ne porte pas de code d'activité normalisé (NAF) ; le secteur est repéré par **mots-clés dans la description de l'activité** (ex. maçonnerie, plomberie, électricité, peinture, restaurant, hôtel, traiteur). Le tri est donc approximatif et sera affiné à l'usage.

## 2. Ce que le BODACC fournit (test en lecture seule du 14/11)

Jeu de données public `annonces-commerciales` (opendatasoft, BODACC A/B/C), déjà utilisé par l'audit.

- Les créations apparaissent sous **deux familles d'annonces** : `Créations` et `Immatriculations`.
- Volumes constatés du 1er au 14 novembre 2026 : environ **21 600** annonces `Créations` et **1 800** `Immatriculations`, soit de l'ordre de **10 000 créations par semaine** au niveau national.
- Filtrage possible par date de parution, famille d'avis et région (`region_nom_officiel`).
- Contenu utile d'une annonce : activité décrite en clair, adresse, commune, greffe, numéro d'immatriculation (SIREN), type de personne (physique ou société), date d'immatriculation, date de début d'activité, lien vers l'annonce officielle.
- **Absent** : site web, e-mail, téléphone, réseaux sociaux.
- Décalage de publication : l'activité a souvent commencé un à deux mois avant la parution.

## 3. Principe : un entonnoir à trois étages, l'IA n'intervient qu'au dernier

1. **Collecte (sans IA, gratuite).** Récupération quotidienne des créations récentes des quatre régions. Aucune analyse, aucun coût de modèle.
2. **Tri (sans IA).** Note de priorité calculée par règles simples (zone, secteur, société plutôt qu'entrepreneur individuel, activité en ligne, ancienneté du démarrage). L'administrateur voit une liste classée et **choisit** les entreprises à auditer.
3. **Audit (Claude).** Uniquement sur les entreprises choisies, dans la limite d'un plafond mensuel (§5).

## 4. Vérification Google / Google Maps

- Aucune collecte automatique de Google Maps (conditions de Google Maps Platform, voir `CADRAGE-STRATEGIQUE-CRM-SOURCES-CIBLAGE-REPUTATION-VIRTUELLE-2026-11-06.md`, §13.4).
- Le visiteur ou l'administrateur effectue la recherche dans les formulaires intégrés de « Réputation virtuelle », puis **saisit ce qu'il a observé** (nom de la fiche, note, nombre d'avis, remarques).
- Technique : le contenu du cadre Google n'est pas lisible par le site (isolation du navigateur) ; la saisie est donc indispensable.
- Ces observations entrent dans l'audit comme preuves de type **« observation déclarée par l'utilisateur »**, avec un niveau de confiance volontairement limité, et ne sont jamais présentées comme vérifiées.
- Conservation : durée courte, à fixer ; pas d'historisation de contenus Maps. **À faire valider juridiquement avant ouverture au public.**
- Voie ultérieure, si budget : API officielle Google Places (coût à l'usage, règles de stockage strictes) ou Google Business Profile avec consentement de l'entreprise.

## 5. Plafonds

- Existant : 5 audits par jour et par utilisateur.
- À ajouter : **plafond mensuel global** (cible : 100 audits par mois), compteur côté base de données.
- Le coût réel d'un audit en jetons sera mesuré sur MajestiOS-Test avant tout achat de crédits.

## 6. Protection des données

- Les annonces BODACC concernant des **personnes physiques** contiennent des données personnelles ; l'adresse d'un entrepreneur individuel peut être son domicile.
- Règles proposées : commencer par les **sociétés** ; pour les entrepreneurs individuels, ne pas conserver l'adresse, ne reprendre que le nécessaire, respecter le droit d'opposition, fixer une durée de conservation.
- Aucun envoi de message de prospection sans validation humaine et sans base légale documentée.
- Point à **faire valider par un juriste** avant toute prospection réelle.

## 7. Décisions ouvertes

| Réf. | Question | Statut |
|---|---|---|
| VEILLE-01 | Secteurs d'activité prioritaires | **Décidé le 14/11** : bâtiment (tous corps d'état), hôtellerie-restauration ; autres secteurs plus tard |
| VEILLE-02 | Conservation des données d'entrepreneurs individuels | À décider, validation juridique |
| VEILLE-03 | Conservation des observations Google saisies | À décider, validation juridique |
| VEILLE-04 | Plafond mensuel global (100 ?) | Proposé, à confirmer |
| VEILLE-05 | Lien avec le système de missions Cheexpeer (veille planifiée, approbation) | Après la recette ; `readiness_probe` reste seul soumissible d'ici là |

## 8. Ordre de réalisation proposé (sur MajestiOS-Test)

1. Liste des créations récentes des quatre régions, affichée à l'administrateur, sans aucune action automatique.
2. Note de priorité par règles et sélection manuelle.
3. Encadré « Ce que vous avez observé » sous les formulaires Google / Maps, branché sur l'audit.
4. Plafond mensuel global.
5. Intégration au système de missions, après la recette.
