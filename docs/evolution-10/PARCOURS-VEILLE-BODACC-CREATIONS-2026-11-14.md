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

## 6. Données affichées et conformité

- Décision du porteur (14/11) : la liste affiche le **maximum d'éléments publiés** par le BODACC — nom, prénom ou raison sociale, forme juridique, SIREN, adresse, enseigne, activité, dates, greffe — y compris pour les entrepreneurs individuels.
- Réalisation : lecture seule, réservée aux comptes internes propriétaire ou administrateur ; **rien n'est enregistré ni envoyé**.
- La réglementation (prospection, droit d'opposition, durée de conservation, adresses de domicile des entrepreneurs individuels) sera examinée par le **service juridique avant le lancement de l'activité** (VEILLE-02). Aucun message de prospection ne part sans validation humaine.

## 7. Décisions ouvertes

| Réf. | Question | Statut |
|---|---|---|
| VEILLE-01 | Secteurs d'activité prioritaires | **Décidé le 14/11** : bâtiment (tous corps d'état), hôtellerie-restauration ; autres secteurs plus tard |
| VEILLE-02 | Prospection et conservation des données d'entrepreneurs individuels | Affichage complet décidé le 14/11 ; validation par le service juridique avant lancement |
| VEILLE-03 | Conservation des observations Google saisies | À décider, validation juridique |
| VEILLE-04 | Plafond mensuel global (100 ?) | Proposé, à confirmer |
| VEILLE-05 | Lien avec le système de missions Cheexpeer (veille planifiée, approbation) | Après la recette ; `readiness_probe` reste seul soumissible d'ici là |

## 7 bis. Offre associée (déjà cadrée ailleurs — pas de doublon)

La stratégie commerciale est déjà posée dans `VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md` (§7 « Stratégie d'entrée sur le marché ») et `evolution-7/PHASE-2-CRM-CLIENTS-ARTISANS-FACTURATION-ELECTRONIQUE-RESEAU.md` : la facturation électronique est l'accroche principale ; **MajestiOS n'est pas une plateforme agréée (PA)** ; la cible est une intégration avec une PA partenaire (aucun partenaire sélectionné) ; le module de facturation n'existe pas encore. Ce parcours de veille n'ajoute que le lien avec cette stratégie :

- Les entreprises récemment créées sont une **cible naturelle** de l'accroche « facturation électronique » (réception obligatoire depuis le 1er septembre 2026 ; émission des PME/TPE/micro-entreprises à partir du 1er septembre 2027, selon une source spécialisée — **à revérifier sur les sources officielles avant tout message commercial**).
- Adaptation par secteur à étudier : le bâtiment (flux B2B, sous-traitance) est plus directement concerné par la facturation entre entreprises que l'hôtellerie-restauration (surtout B2C) ; la note de priorité pourra en tenir compte.
- Le fichier des créations du bâtiment peut aussi servir les recherches de **sous-traitants** (deuxième usage, côté donneurs d'ordre).
- Aucun message ne doit promettre un service non disponible ni se présenter comme une PA ; voir `facturation-electronique.html` pour la formulation validée.

## 8. Avancement au 14 novembre 2026

- **Fait (branche de test, page `admin-recherches.html`, comptes internes propriétaire/administrateur)** : liste des créations des quatre régions, filtre secteur (bâtiment, hôtellerie-restauration), affichage complet des éléments publiés, **tri par note de priorité** (0–100, règles lisibles, raisons affichées : secteur +30, société +20 / entrepreneur individuel +10, immatriculation récente jusqu'à +20, adresse complète +10, activité décrite +5, activité liée au web +10 ; « Prioritaire » ≥ 70, « À considérer » ≥ 45). Règles dans `veille-creations.mjs`, testées par `tests/veille-creations.test.mjs`.
- **Non fait** : sélection « à auditer » persistante (nécessite une table sur la base du CRM, accord explicite requis), observations Google saisies, plafond mensuel, missions planifiées.

## 9. Ordre de réalisation proposé (sur MajestiOS-Test)

1. Liste des créations récentes des quatre régions, affichée à l'administrateur, sans aucune action automatique.
2. Note de priorité par règles et sélection manuelle.
3. Encadré « Ce que vous avez observé » sous les formulaires Google / Maps, branché sur l'audit.
4. Plafond mensuel global.
5. Intégration au système de missions, après la recette.
