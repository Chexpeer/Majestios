# MajestiOS — modèle de données cible des consultations, lots et exigences

**Date :** 7 novembre 2026  
**Branche :** `evolution-5.0-admin-cockpit`  
**Statut :** conception conceptuelle — aucune migration, table ou politique RLS créée.  
**Références :**
- `ARCHITECTURE-REGISTRE-COMMERCIAL-ANNONCES-BESOINS-2026-11-06.md`
- `PARCOURS-APPEL-OFFRES-CHANTIER-RESEAU-2026-11-07.md`
- Migration existante `20261105163901_majestios_core_multitenant_foundation.sql`

## 1. Décision

Le modèle doit séparer la consultation officielle, ses lots, les pièces documentaires, les analyses IA, les exigences extraites et les rapprochements avec les entreprises.

Une consultation est le dossier parent. Un lot est une unité opérationnelle à laquelle une entreprise peut répondre seule ou avec des partenaires. Une exigence est une condition ou un critère sourcé. Une analyse est une exécution versionnée du traitement IA, jamais la vérité documentaire elle-même.

Le pipeline CRM `opportunities` reste un objet commercial distinct. Il peut pointer vers une consultation, mais ne doit pas absorber le détail documentaire, les lots ou les candidatures. La table `client_requests` reste réservée aux demandes adressées à MajestiOS.

## 2. Diagramme conceptuel

```text
SOURCE
  └── CONSULTATION
        ├── DOCUMENTS (versions / empreintes / stockage)
        ├── LOTS
        │     ├── EXIGENCES
        │     ├── MÉTIERS / COMPÉTENCES extraits
        │     └── CORRESPONDANCES ENTREPRISE ↔ LOT
        │              └── PREUVES DE CORRESPONDANCE
        ├── ANALYSES (versionnées)
        │     └── EXTRACTIONS / traductions / avertissements
        └── CANDIDATURES
              ├── LOTS CANDIDATÉS
              ├── CHECKLIST DES PIÈCES
              └── PARTAGES / transmissions consentis

ORGANISATION CLIENT
  ├── ENTREPRISE(S) représentée(s)
  ├── PROFIL RÉSEAU (visibilité choisie)
  └── DOSSIERS DE CANDIDATURE privés

CRM INTERNE
  └── OPPORTUNITÉ (lien externe facultatif vers CONSULTATION)
```

Le diagramme est logique, pas un ordre de création SQL. Les objets de candidature ne doivent pas être confondus avec les espaces de travail ou les fiches entreprise.

## 3. Entités proposées

Les noms ci-dessous sont des noms de travail. Ils ne constituent pas une décision de nommage SQL.

### 3.1 Consultation — `tenders`

Une ligne représente une consultation publiée par un acheteur.

Champs conceptuels :
- identifiant UUID ;
- source : BOAMP, profil acheteur, plateforme partenaire, saisie manuelle ou autre source autorisée ;
- identifiant externe et URL officielle ;
- acheteur, objet officiel, procédure, territoire ;
- date de publication, date limite, dates de visite et de questions si disponibles ;
- statut de collecte : détectée, à enrichir, active, clôturée, retirée, expirée, erreur ;
- dernière vérification de la source et fraîcheur ;
- empreinte/version de la fiche source ;
- métadonnées d'import minimales et non sensibles.

Contraintes :
- unicité idempotente sur source + identifiant externe lorsque cet identifiant existe ;
- une URL seule n'est pas une clé stable ;
- une consultation sans identifiant externe doit avoir une stratégie de déduplication revue, pas une unicité artificielle ;
- conserver les anciennes valeurs importantes dans un historique de révision si la source change.

### 3.2 Lots — `tender_lots`

Un lot appartient à une consultation et représente un périmètre de travaux distinct.

Champs :
- consultation parente ;
- numéro officiel, intitulé et description officielle ;
- traduction chantier validée / versionnée ;
- lieu(x) d'exécution, département(s), contraintes d'accès ;
- dates et échéances propres au lot ;
- statut du lot et éventuel montant estimé lorsque la source le fournit ;
- ordre d'affichage.

Contrainte : unicité du numéro de lot au sein d'une consultation uniquement si le numéro est réellement fourni et stable. Prévoir les consultations sans allotissement, avec un lot logique unique sans inventer de numéro officiel.

### 3.3 Documents — `tender_documents`

Chaque ligne représente une version précise d'une pièce ou d'une référence documentaire.

Champs :
- consultation et, facultativement, lot ;
- type documentaire : règlement de consultation, CCTP, CCAP, BPU, DQE, DPGF, acte d'engagement, plan, annexe, réponse acheteur, autre ;
- titre et URL source ;
- chemin de stockage privé si un fichier est effectivement conservé ;
- nom, type MIME, taille, empreinte cryptographique ;
- numéro/version/date du document lorsqu'identifiables ;
- date de collecte ;
- statut d'accès et de traitement : référencé, téléchargé, illisible, analysé, remplacé, indisponible ;
- restrictions d'accès / conservation.

Ne pas recopier un document protégé dans un espace public. L'URL source, les conditions d'accès et les droits de stockage doivent être vérifiés avant archivage.

### 3.4 Analyses — `tender_analyses`

Une ligne correspond à une exécution précise de l'analyse d'une consultation ou d'un lot.

Champs :
- consultation et portée (consultation complète ou lot) ;
- version du prompt, du modèle et du pipeline ;
- statut : queued, processing, completed, needs_review, failed ;
- documents effectivement pris en compte et leurs empreintes ;
- date de début/fin ;
- résumé structuré et avertissements ;
- limites connues : pages manquantes, OCR faible, pièce inaccessible, incohérence ;
- auteur du lancement et origine du traitement.

Une nouvelle exécution crée une nouvelle analyse. Elle ne remplace pas silencieusement les résultats antérieurs.

### 3.5 Exigences — `tender_requirements`

Une ligne représente une exigence, condition, pièce attendue ou critère de jugement.

Champs :
- consultation et lot facultatif ;
- catégorie : métier, compétence, qualification, certification, assurance, référence, effectif, moyen matériel, capacité économique/financière, pièce administrative, délai, visite, critère de jugement, autre ;
- nature : candidature obligatoire, exécution obligatoire, souhaitée, information, critère de notation, point à confirmer ;
- texte officiel / extrait court ;
- document source, page, section et ancre ;
- traduction en langage courant / langage de chantier ;
- niveau de certitude et statut de revue humaine ;
- validité temporelle éventuelle ;
- analyse ayant produit la première extraction.

Les formulations officielles et pédagogiques sont deux champs distincts. La traduction n'a pas de portée contractuelle et ne doit jamais remplacer le texte source.

### 3.6 Révisions et preuves — `tender_requirement_evidence`

Relie une exigence à une ou plusieurs preuves documentaires et à leur emplacement précis.

Champs :
- exigence ;
- document et version ;
- page / section / extrait / coordonnées si disponibles ;
- rôle de la preuve : source officielle, contexte, contradiction, précision ;
- statut de lecture et confiance d'extraction.

Cette relation évite de stocker une seule référence documentaire dans l'exigence alors qu'une exigence peut être corroborée ou contredite par plusieurs pièces.

### 3.7 Correspondances entreprise / lot — `tender_business_matches`

Une ligne représente une évaluation datée d'une entreprise pour un lot.

Champs :
- lot ;
- entreprise ;
- organisation propriétaire du dossier entreprise, selon le modèle d'accès validé ;
- analyse/version utilisée ;
- statut : semble correspondre, à compléter / vérifier, ne semble pas correspondre, revue humaine requise ;
- synthèse explicable ;
- critères satisfaits, manquants, contradictoires ;
- date d'évaluation et état de revue humaine.

Les raisons détaillées doivent être normalisées dans une table de preuves/critères associée, plutôt que masquées dans un score opaque. Un score global éventuel est secondaire et ne doit pas être affiché sans explication.

### 3.8 Preuves de correspondance — `tender_match_evidence`

Relie une correspondance à un critère et à la preuve d'entreprise ou à l'exigence correspondante.

Exemples :
- métier déclaré dans le profil ;
- qualification vérifiée avec organisme, domaine, numéro et validité ;
- assurance fournie et période couverte ;
- référence de chantier déclarée ou vérifiée ;
- département d'intervention ;
- effectif déclaré / source publique datée ;
- pièce manquante ou information contradictoire.

Chaque preuve porte son origine, sa date, son statut (déclaré, importé, vérifié, expiré, contradictoire) et sa visibilité. Le code APE/NAF peut aider à découvrir une entreprise, mais ne prouve jamais à lui seul sa capacité à exécuter le lot.

### 3.9 Candidatures — `tender_applications`

Une candidature est un dossier privé porté par une entreprise pour une consultation. Elle est distincte de l'espace utilisateur et de l'opportunité CRM.

Champs :
- consultation ;
- organisation/espace de travail candidat ;
- entreprise représentée ;
- auteur / responsable du dossier ;
- statut : brouillon, pré-diagnostic, à compléter, prêt pour revue, validé par l'entreprise, transmis, retiré, clôturé ;
- date limite et dates de validation/transmission ;
- historique de statut et métadonnées de suivi.

La création d'une candidature ou d'un espace ne vaut jamais transmission. L'entreprise doit valider explicitement le destinataire, le contenu et l'acte de transmission.

### 3.10 Lots de candidature — `tender_application_lots`

Relation plusieurs-à-plusieurs entre candidature et lots sélectionnés. Elle permet à une entreprise de se positionner sur un lot sans prétendre répondre à toute la consultation.

Conserver le rôle envisagé : candidat principal, cotraitant, sous-traitant pressenti ou autre rôle explicitement défini. Les rôles contractuels finaux doivent être confirmés par l'entreprise et les documents applicables.

### 3.11 Checklist — `tender_application_items`

Une ligne correspond à un élément attendu dans un dossier de candidature.

Champs :
- candidature et lot éventuel ;
- exigence d'origine ;
- libellé de la pièce / donnée attendue ;
- document privé associé, si fourni ;
- statut : à fournir, fourni, à vérifier, accepté par l'entreprise, expiré, non applicable ;
- responsable et échéance ;
- note de contrôle et date de mise à jour.

Une pièce déjà présente dans le profil ne doit pas être jointe automatiquement : l'entreprise choisit explicitement de l'utiliser pour ce dossier.

### 3.12 Historique des décisions et transmissions

Les décisions humaines importantes et les transmissions externes doivent être auditables : acteur, date, objet, action, destinataire, finalité, version des pièces et résultat. Éviter de dupliquer tout le contenu documentaire dans les journaux ; enregistrer des références et empreintes.

## 4. Relations et cardinalités

- une consultation possède 0..n lots ;
- une consultation possède 0..n documents, chaque document pouvant être rattaché à 0..1 lot ;
- une consultation possède 0..n analyses ;
- une analyse produit 0..n exigences extraites ;
- une exigence peut concerner une consultation entière ou un lot ;
- une exigence peut être justifiée par 1..n preuves documentaires ;
- un lot peut être rapproché de 0..n entreprises ;
- une entreprise peut être rapprochée de 0..n lots ;
- une candidature concerne une consultation et sélectionne 1..n lots ;
- une candidature possède 0..n éléments de checklist ;
- une opportunité CRM peut référencer 0..1 consultation, sans devenir le dossier documentaire.

Les relations entre organisations, entreprises et utilisateurs doivent réutiliser le modèle multi-tenant après vérification de la propriété des fiches. Ne pas ajouter un second système d'adhésion parallèle.

## 5. Frontières de données et matrice d'accès préliminaire

Cette matrice exprime des intentions d'accès ; elle ne constitue pas une politique RLS prête à exécuter.

| Objet | Visiteur | Membre de l'espace candidat | Équipe interne habilitée | Autre entreprise |
|---|---|---|---|---|
| Métadonnées publiques de consultation | lecture selon source | lecture | lecture | lecture |
| Documents de consultation | selon droits de la source | selon droits de la source | selon droits de la source | selon droits de la source |
| Analyse/traduction publiée | lecture des parties validées | lecture | lecture/validation | lecture des parties publiées |
| Exigences et lots | lecture des données publiées | lecture | lecture/validation | lecture des données publiées |
| Profil réseau public | champs explicitement publics | champs autorisés | selon rôle/finalité | champs explicitement publics |
| Profil entreprise privé | aucun | membres autorisés | accès strictement habilité et tracé | aucun |
| Correspondance entreprise/lot | aucune donnée personnelle | résultat de sa propre entreprise | accès métier autorisé et tracé | aucune |
| Candidature et checklist | aucun | membres habilités du candidat | accès limité au support autorisé | aucun |
| Pièces privées | aucun | membres habilités et autorisés | accès exceptionnel, finalisé et journalisé | aucun |
| Transmission externe | aucune | validation explicite du représentant habilité | exécution technique autorisée après validation | uniquement contenu transmis |

### Principes non négociables

- Le tenant CRM interne ne devient pas le tenant des entreprises candidates.
- Un utilisateur authentifié n'est pas automatiquement membre de l'espace candidat.
- Les rôles ne sont jamais tirés de `user_metadata` modifiable par l'utilisateur.
- Les écritures sensibles passent par un endpoint serveur de confiance qui vérifie l'identité, l'appartenance et le droit de représentation.
- RLS doit protéger chaque table exposée ; les contrôles serveur complètent RLS et ne la remplacent pas.
- Les vues doivent être conçues pour ne pas contourner RLS.
- Les pièces privées sont stockées dans un bucket privé, avec règles Storage alignées sur les relations et autorisations métier.
- Une prise de connaissance de notice n'est pas un consentement marketing ni une autorisation de partage.
- L'accès interne aux documents privés doit être limité au besoin d'en connaître et journalisé.
- Les données de réseau visibles par d'autres entreprises sont un sous-ensemble choisi, distinct du dossier complet.

## 6. États et règles de cycle de vie

### Consultation
Détectée → enrichissement → active → clôturée / retirée / expirée / erreur.

### Document
Référencé → disponible → traité / illisible / inaccessible → remplacé ou archivé.

### Analyse
En attente → en cours → terminée / à revoir / échouée.

### Exigence
Extraite → à confirmer → revue → validée / invalidée / remplacée par une nouvelle révision.

### Correspondance
Calculée → à revoir → confirmée / corrigée / rejetée / obsolète.

### Candidature
Brouillon → pré-diagnostic → à compléter → prête pour revue → validée par l'entreprise → transmise / retirée / clôturée.

Les transitions sensibles (validation, partage, transmission, retrait) doivent identifier l'acteur autorisé et conserver une trace immuable de la décision.

## 7. Contraintes techniques à intégrer au futur schéma

- Clés étrangères et cohérence des rattachements : empêcher qu'un lot d'une consultation soit utilisé dans une autre candidature.
- Index sur source/identifiant externe, consultation/date limite, lots/consultation, exigences/lot/catégorie, correspondances/lot/entreprise, candidatures/organisation/statut.
- Indexation textuelle à dimensionner sur les intitulés, objets, traductions et compétences ; ne pas ajouter de recherche vectorielle avant de démontrer le besoin et la stratégie de mise à jour.
- Pagination serveur systématique sur les listes.
- Idempotence des imports et traitements relancés.
- Versionnement des documents et analyses.
- Journal d'audit séparé des notes métier modifiables.
- Suppression logique ou archivage selon les obligations de conservation ; politique de purge à définir par catégorie de données.
- Horodatages UTC, dates limites interprétées dans le fuseau de la consultation.
- Données financières avec source, période, date de collecte et niveau de disponibilité ; aucune pénalité automatique pour une donnée absente.

## 8. Découpage de construction

1. **Contrat consultation / lot / document** : schéma relationnel et tests d'idempotence.
2. **Import documentaire** : stockage, versions, empreintes, droits et états d'erreur.
3. **Analyse versionnée** : contrat JSON, références de pages, avertissements et relecture humaine.
4. **Exigences** : séparation texte officiel / traduction / interprétation.
5. **Dictionnaire métiers et compétences** : référentiel contrôlé, synonymes et liens APE/NAF indicatifs.
6. **Correspondances** : critères, preuves, explications et validation.
7. **Candidature et checklist** : espace privé, sélection de lots et contrôle des partages.
8. **Intégration réseau/CRM** : liens explicites et événements autorisés, sans fusion des tenants.

## 9. Critères d'acceptation du modèle

- Une consultation avec plusieurs lots conserve les différences propres à chaque lot.
- Une consultation sans lot officiel reste représentable sans fabriquer un numéro.
- Toute exigence affichée renvoie à une pièce et à un emplacement source, ou porte explicitement le statut « à confirmer ».
- Une traduction IA ne remplace jamais le texte officiel.
- Une nouvelle analyse conserve l'historique et ne détruit pas les corrections humaines.
- Une entreprise peut être pertinente pour un lot et non pertinente pour un autre.
- Chaque correspondance expose ses preuves, ses inconnues et sa date.
- Une donnée déclarée n'est jamais présentée comme vérifiée.
- Une entreprise candidate ne peut lire ni modifier le dossier d'une autre entreprise.
- Un membre ne peut pas s'ajouter lui-même à un tenant ni revendiquer une entreprise sans contrôle serveur.
- Un document privé ne peut être téléchargé sans autorisation explicite et vérifiée.
- Aucun partage ou dépôt externe ne part sans validation explicite de l'entreprise.
- Le CRM interne reste cloisonné du réseau candidat.
- Les imports répétés ne créent pas de doublons ni n'écrasent des données validées sans historique.

## 10. Hors périmètre de ce lot

Aucune table, migration, politique RLS, bucket Storage, endpoint, traitement IA, recherche d'entreprise, interface ou donnée réelle n'a été créé ou modifié. Aucun déploiement, merge ou changement de l'immeuble interactif n'est inclus.

**Décision attendue avant implémentation :** valider ce modèle conceptuel, puis produire une matrice RLS détaillée table par table et les tests d'isolation. Ce n'est qu'après cette revue que le premier lot SQL pourra être préparé.
