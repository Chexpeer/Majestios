# Modèle commun de données CRM — MajestiOS

**Version :** 0.1 — 1er novembre 2026  
**Statut :** contrat conceptuel à valider avant implémentation du stockage et des connecteurs.  
**Références :** `schemas/opportunite.schema.json`, `company-fit.js`, `CARTOGRAPHIE-DONNEES-STATISTIQUES-MAJESTIOS.md` et `REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md`.

## 1. Objectif et règles structurantes

Le CRM doit relier les entreprises, opportunités, résultats de marchés, signaux stratégiques, indicateurs et actions commerciales sans confondre leurs statuts ni leurs preuves.

- Identifiants canoniques : SIREN pour l’unité légale, SIRET pour l’établissement ; conserver les identifiants natifs des sources.
- Une entité métier peut être étayée par plusieurs observations de source.
- Conserver les valeurs brutes séparément des valeurs normalisées, dans le respect des conditions de stockage.
- Distinguer date de publication, date de l’événement, date de collecte et période de référence.
- Documenter la méthode et la qualité de chaque rapprochement.
- Distinguer inconnu, absent, confidentiel, non applicable, erreur d’import et zéro observé.
- Séparer fait publié, calcul, estimation, hypothèse commerciale et validation humaine.
- Une source publique n’est pas automatiquement réutilisable pour toutes les finalités.
- Un signal ne déclenche pas automatiquement une prospection sans règles de conformité et contrôles préalables.

## 1.1 Contrat commun entre le moteur de recherche et le futur CRM

Le schéma partagé `schemas/opportunite.schema.json` est étendu pour représenter les résultats BOAMP et les signaux BODACC, puis les familles futures immobilier, emploi et sous-traitance sans les confondre. Les champs `recordType`, `marketType` et `category` portent la nature du résultat ; `source`, `sourceId`, `sourceUrl`, `publishedAt`, `provenance` et `firstSeenAt` assurent la traçabilité ; `deduplicationKey` prépare le rapprochement ; `qualification` isole l’analyse commerciale des faits publiés ; `crmLink` réserve les références vers les fiches métier futures.

Le parcours cible devient :

**Recherche à la demande → résultat normalisé → contrôle de provenance et fraîcheur → dédoublonnage → qualification humaine → enregistrement CRM autorisé → tâche/action suivie → historique du résultat.**

Cette évolution est un contrat de données, pas une déclaration que les résultats sont déjà enregistrés. Le moteur actuel affiche les résultats et interroge BOAMP/BODACC à la demande ; il ne dispose pas encore d’une persistance CRM. Avant tout enregistrement réel, il faudra construire l’adaptateur de normalisation de chaque source, valider les données contre le schéma, configurer le backend, l’authentification, l’isolation des comptes, les permissions, l’audit et les règles de conservation.

Règles impératives :
- conserver chaque source et son identifiant natif ; une même opportunité peut avoir plusieurs observations sources ;
- ne jamais dédupliquer uniquement sur le nom d’entreprise ;
- ne pas transformer une catégorie non connectée en résultat, ni inventer une date ou un identifiant ;
- ne pas confondre un signal BODACC, une offre d’emploi ou un indice immobilier avec une intention d’achat vérifiée ;
- enregistrer une hypothèse IA dans `qualification.commercialHypothesis`, séparément des données publiées, avec statut de revue ;
- préserver l’URL source et la date de collecte, et contrôler les droits de stockage/réutilisation avant ingestion persistante ;
- permettre à terme le passage d’un résultat qualifié vers une fiche entreprise/établissement, une opportunité, une tâche ou une interaction, sans créer automatiquement des actions externes.

## 2. Les six objets métier

### 2.1 Entreprise et établissement

Modéliser séparément l’unité légale et ses établissements.

Champs minimaux : identifiant interne stable ; SIREN/SIRET sous forme de chaînes ; dénomination publiée ; nom commercial si disponible ; code APE/NAF et version ; statut administratif et date d’effet ; adresse structurée et codes territoriaux ; statut de diffusion ; source et observation de référence ; dates de création et de mise à jour internes.

Ne pas utiliser le seul nom comme clé de fusion. Conserver l’historique des changements. Un siège hors zone ciblée ne suffit pas à exclure une entreprise sans vérifier les établissements pertinents.

### 2.2 Opportunité

Le schéma existant `schemas/opportunite.schema.json` reste le contrat de départ : ne pas créer de modèle concurrent. Préserver notamment les identifiants internes et source, titre, catégorie, type de marché, acheteur publié, localisation, dates, source, URL, statut, vérification et dernière observation.

Une consultation, un lot, une attribution et un contrat exécuté sont des objets différents. Un lien vers un document n’autorise pas à lui seul son téléchargement, stockage ou republication.

### 2.3 Attribution de marché

Objet distinct de l’opportunité. Champs minimaux : identifiant interne et source ; référence de procédure et de lot ; opportunité liée si identifiable ; acheteur et titulaire reliés à des fiches entreprise quand le rapprochement est fiable ; dates de publication et d’attribution ; montant, devise, unité et nature du montant ; statut de résultat ; statut de rapprochement ; observation source.

Un montant attribué ne prouve pas le chiffre d’affaires effectivement réalisé ni la marge. Les titulaires publiés ne représentent pas nécessairement tous les candidats. L’absence d’attribution retrouvée ne prouve pas qu’une entreprise n’a jamais remporté de marché.

### 2.4 Signal stratégique

Objet distinct pour événements d’entreprise, emploi, immobilier et autres signaux autorisés. Champs minimaux : type de signal ; identifiant source et URL ; entreprise/établissement lié si connu ; date de publication, date d’événement, collecte et dernière observation ; localisation ; résumé factuel ; statut de vérification ; hypothèse commerciale séparée ; date et auteur de revue humaine si pertinent.

Emploi et immobilier conservent leurs attributs spécifiques dans des extensions ou tables dédiées. Un événement de cessation ne prouve pas qu’un local est à vendre ; une offre d’emploi ne prouve pas une intention d’achat.

### 2.5 Indicateur statistique

Champs minimaux : identifiant et nom de l’indicateur ; définition métier ; version de formule ; période ; périmètre géographique et sectoriel ; valeur et unité ; numérateur, dénominateur et effectif si applicables ; date de calcul et date des données ; références aux instantanés sources ; effectifs inclus, exclus, non rapprochés et manquants ; statut qualité ; type d’interprétation ; limites et avertissement visible.

Tout indicateur doit être reproductible depuis des données datées et une formule versionnée. Bloquer ou retirer sa publication si la couverture et la qualité sont insuffisantes.

### 2.6 Action CRM

Champs minimaux : identifiant ; entreprise/établissement lié ; opportunité ou signal associé ; type d’action et finalité ; responsable éventuel ; statut (proposée, à vérifier, approuvée, en cours, terminée, annulée) ; échéance et date de clôture ; motif et références factuelles ; état de conformité ; historique des changements et résultat observé.

Une suggestion de l’IA reste une proposition tant qu’elle n’est pas validée. Ne pas stocker de coordonnées personnelles sans nécessité, provenance et base juridique documentées.

## 3. Objets transversaux obligatoires

### Observation de source

Chaque ingestion doit conserver, selon les droits applicables : identifiant source et enregistrement source ; URL ; dates de récupération, publication et événement si connues ; version du jeu ; référence de licence/conditions ; empreinte du contenu brut ; version de normalisation ; méthode d’ingestion ; statut et code d’erreur ; règle de conservation. Le contenu brut complet ne sera conservé que si les conditions l’autorisent.

### Registre des sources et conditions d’usage

Pour chaque source, documenter producteur, URL officielle, jeu de données, champs et schéma, méthode d’accès, fréquence et quotas, licence/conditions, finalités autorisées, limites liées aux données personnelles et à la prospection, responsable et date de dernière vérification.

États d’intégration recommandés : candidate, access_configured, sample_tested, mapped, validated, paused, retired. La lecture de la documentation ne suffit pas à marquer une source comme validée.

### Preuve et contrôle humain

Pour toute décision nécessitant une revue, enregistrer l’entité et l’affirmation contrôlées, le statut, la méthode, la référence de preuve, la date, l’auteur et la date de révision éventuelle. Ne pas conclure à la solvabilité, à la capacité ou à l’éligibilité depuis un code APE, un événement isolé ou un chiffre d’affaires.

## 4. Relations conceptuelles

- Une unité légale possède un ou plusieurs établissements.
- Une opportunité peut comporter plusieurs lots.
- Une attribution concerne une procédure/lot et peut référencer un acheteur et un titulaire.
- Un signal peut être lié à une entreprise ou un établissement, ou rester non rapproché.
- Une action CRM se rapporte à une entreprise, une opportunité ou un signal.
- Toute entité peut être étayée par plusieurs observations de sources.
- Un indicateur référence les instantanés de données et versions de formule utilisés.

Privilégier les clés étrangères aux duplications de noms. Conserver les libellés publiés nécessaires à la compréhension historique des rapports.

## 5. États de données à normaliser

Distinguer au minimum : known, unknown, not_found_in_source, not_applicable, confidential, restricted, to_verify et invalid. Le statut `not_found_in_source` signifie uniquement qu’aucun résultat n’a été trouvé dans une source et un périmètre déterminés ; il ne signifie pas que le fait n’existe pas.

## 6. Stratégie de réalisation

### Lot 1 — Contrats et compatibilité
- Inventorier les champs réellement utilisés dans le prototype.
- Préserver le schéma d’opportunité existant.
- Définir les identifiants, états, dates et champs de provenance communs.
- Ajouter des tests de validation sur des exemples contrôlés.
- Ne pas migrer de stockage avant validation du modèle.

### Lot 2 — Échantillon et mapping
- Choisir une source et un périmètre pilote.
- Obtenir un petit échantillon dans les conditions autorisées.
- Mapper les champs réels vers les objets canoniques.
- Documenter pertes, ambiguïtés, doublons et taux de rapprochement.
- Vérifier manuellement un échantillon représentatif.

### Lot 3 — Premier rapport reproductible
- Calculer uniquement des indicateurs soutenus par l’échantillon.
- Afficher période, périmètre, couverture et limites.
- Comparer deux exécutions pour vérifier la reproductibilité.
- Bloquer la publication si la qualité minimale n’est pas atteinte.

### Lot 4 — CRM opérationnel
- Choisir le stockage après décision d’architecture.
- Définir authentification, rôles, journalisation, rétention et droits d’accès.
- Intégrer les sources une par une avec tests d’import, mise à jour et retrait.
- N’activer les actions commerciales qu’après validation des règles de conformité.

## 7. Critères d’acceptation

- [ ] SIREN/SIRET sont conservés comme chaînes, sans troncature.
- [ ] Les dates de publication, d’événement, de collecte et de période sont distinctes.
- [ ] Absence, confidentialité, non-applicabilité et zéro restent distincts.
- [ ] Les doublons sont détectés sans fusion automatique sur le seul nom.
- [ ] Chaque fait importé renvoie à une observation source autorisée.
- [ ] Les rapprochements incertains sont signalés et révisables.
- [ ] Consultation, lot, attribution et contrat exécuté restent distincts.
- [ ] Chaque indicateur est lié à une formule versionnée et à des données datées.
- [ ] Une hypothèse commerciale n’est jamais présentée comme un fait source.
- [ ] Les tests couvrent données mal formées, champs manquants, doublons, corrections et retrait de source.
- [ ] Aucun connecteur ou stockage n’est annoncé opérationnel sans test réel concluant.

## 8. Décisions ouvertes

- Stockage final et architecture du CRM.
- Politique de conservation des données brutes et documents sources.
- Premier territoire et secteur pilote.
- Seuils de qualité et d’effectif requis pour publier chaque statistique.
- Règles de validation humaine, droits d’accès et journalisation.
- Finalités et durées de conservation par catégorie de données.

Ces décisions doivent être consignées avant l’implémentation de la base métier et des automatisations.