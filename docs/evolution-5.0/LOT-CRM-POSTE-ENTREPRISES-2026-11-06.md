# Lot CRM — poste de travail Entreprises

**Date :** 6 novembre 2026  
**Branche :** `evolution-5.0-admin-cockpit`  
**Nature :** amélioration ciblée de l'interface existante, sans évolution du schéma Supabase.

## Objectif

Faire du module Entreprises un véritable poste de travail opérationnel : retrouver rapidement une fiche, la filtrer selon sa qualification et son département, puis préparer progressivement les opérations de ciblage commercial.

## Réalisation de ce lot

- Recherche locale dans les entreprises déjà chargées par le CRM : raison sociale, nom commercial, SIREN, SIRET, APE/NAF, ville, département et notes de qualification.
- Filtre par statut de qualification : à examiner, en cours, qualifiée, non qualifiée, ne pas contacter.
- Filtre par département.
- Compteur de résultats affichés, mis à jour à chaque modification des critères.
- Affichage des principaux identifiants disponibles sous le nom de l'entreprise.
- Réapplication automatique des filtres après actualisation de la liste.
- Normalisation des accents pour rendre la recherche plus tolérante.

## Limites explicites

Cette recherche est un filtrage navigateur des fiches déjà présentes dans le CRM ; elle ne consulte aucun annuaire externe et ne lance aucune recherche SIRENE, RNE, BODACC ou BOAMP. La liste chargée par le client Supabase reste limitée à 100 enregistrements : pagination serveur et recherche sur l'ensemble du référentiel restent à construire avant d'utiliser ce module à grande échelle.

Aucun enregistrement n'est créé, modifié ou supprimé par les filtres. Aucun e-mail n'est collecté ou envoyé. Les filtres ne changent pas les droits RLS et ne remplacent pas les contrôles Supabase.

## Prochaines briques logiques

1. Fiche entreprise détaillée avec ses établissements SIRET, ses contacts, ses opportunités et son historique associé.
2. Pagination et recherche serveur, avec tri explicite et indicateur du volume total.
3. Qualification enrichie : source, date de collecte, provenance des champs, niveau de confiance et justification humaine.
4. Ciblage depuis un appel d'offres : compétences requises → proposition APE/NAF → départements → entreprises candidates, avec validation humaine.
5. Préparation d'une campagne : sélection, exclusions, provenance des coordonnées, base légale, opposition et validation avant tout envoi.

## Protection du patrimoine

Le CRM Supabase existant est conservé. Aucune migration, table, colonne, politique RLS, fonction SQL/Edge, donnée, compte ou rôle n'a été modifié. Aucun déploiement, merge vers `main` ou promotion en production n'est effectué dans ce lot. L'immeuble interactif et tous ses composants restent strictement hors périmètre.

## Extension du lot — dossier entreprise détaillé

Le dossier dépliable d'une entreprise rassemble désormais, à partir des champs déjà présents dans la fiche : identité juridique et commerciale, SIREN/SIRET, TVA, APE/NAF, adresse, coordonnées territoriales, site web, source et lien source, responsable interne, qualification et notes. Il rapproche également les contacts, opportunités et activités dont le `business_id` correspond à l'entreprise.

Les liens externes sont rendus comme liens uniquement pour les protocoles HTTP/HTTPS et s'ouvrent dans un nouvel onglet avec les protections `noopener noreferrer`. Les contenus issus des fiches sont insérés comme texte, pas comme HTML.

**Limite de couverture importante :** chaque rubrique est actuellement chargée avec une limite de 100 enregistrements. Le dossier rapproche uniquement les relations présentes dans ces listes chargées. Un message explicite évite de confondre absence d'élément affiché et absence réelle de relation dans la base. Ce lot ne met pas en place de pagination, de recherche serveur ni de nouvelles requêtes relationnelles.

Aucun changement de schéma Supabase, aucune migration et aucune écriture de données n'ont été nécessaires.


## Extension — analyse lexicale du contenu d'un marché

Le prototype de préqualification accepte désormais, en plus de l'intitulé, un texte descriptif pouvant contenir les prestations, le contenu d'un lot et les compétences attendues. Le moteur de suggestions APE/NAF analyse conjointement ces éléments et restitue les mots-clés qui motivent chaque proposition.

**Nature du résultat :** suggestion lexicale explicable uniquement. Ce mécanisme n'extrait pas encore automatiquement les lots d'un avis BOAMP, ne lit pas les pièces PDF du dossier de consultation, ne comprend pas les exigences juridiques ou techniques et ne valide aucune compétence. Le code proposé doit être contrôlé par un opérateur avant recherche d'entreprises.

**Périmètre technique de ce sous-lot :** évolution du prototype `qualification-entreprises.html` et de ses modules JavaScript/tests. Il ne raccorde pas encore le parcours au poste CRM authentifié et ne crée aucune fiche dans Supabase. Il ne modifie ni schéma, ni données, ni habilitations. L'immeuble interactif reste hors périmètre.


## Extension — ciblage marché intégré au CRM authentifié

Le parcours de ciblage est proposé dans le poste Entreprises du CRM, derrière la session et l'appartenance interne déjà exigées par le client Supabase existant. Il réutilise le moteur DINUM et les suggestions lexicales APE/NAF déjà présents, sans créer de second référentiel.

L'opérateur saisit l'intitulé et le descriptif du marché, vérifie les codes APE/NAF suggérés, définit les départements, lance une recherche, examine les candidats et coche ceux qu'il souhaite intégrer. Les fiches choisies sont créées dans la table businesses existante via MajestiosCRM.createBusiness, avec le statut « à examiner », la provenance et les motifs de rapprochement dans les notes.

**Droits et limites :** le rôle viewer ne peut pas lancer le ciblage ni intégrer de fiches ; les autres rôles restent soumis aux contrôles du client et de Supabase RLS. La recherche ne crée aucune fiche automatiquement. Le dédoublonnage côté interface ne couvre que les 100 entreprises actuellement chargées ; il ne remplace pas une contrainte d'unicité globale. Les erreurs individuelles d'insertion sont comptabilisées.

Aucune table, colonne, migration, politique RLS, fonction SQL/Edge, donnée préexistante, identité ou rôle n'a été modifié. Aucun courriel n'est envoyé. Aucun déploiement, merge vers main ou promotion en production n'est effectué. L'immeuble interactif reste strictement hors périmètre.

## Extension — indicateurs de structure, provenance et contrôle des doublons

Le parcours de ciblage affiche désormais, lorsqu'ils sont présents dans la réponse de l'API Recherche d’Entreprises, la tranche d’effectif et son année de référence, le nombre d’établissements, le statut administratif et la date de création. Ces valeurs sont présentées comme des déclarations de source, jamais comme une preuve de capacité à exécuter un marché. Une donnée absente reste explicitement « non renseignée ».

Le rapprochement préalable compare les SIREN et SIRET des candidats aux 100 entreprises actuellement chargées dans le CRM. Le nombre de candidats déjà connus est signalé ; ils ne sont pas proposés à l'import. Un second contrôle est exécuté juste avant chaque insertion. La contrainte d’unicité existante sur (organization_id, siren) protège également contre un doublon non visible dans les 100 fiches chargées. Les erreurs retournées par Supabase sont désormais restituées dans le bilan d'import au lieu d'être silencieusement comptabilisées.

Les fiches nouvelles conservent dans qualification_notes les indicateurs disponibles, l'identifiant source, la date de collecte, les critères APE/NAF et départementaux, le score indicatif et les motifs de rapprochement. Elles sont créées au statut « à examiner ». Aucune mise à jour, fusion ou écrasement automatique d'une fiche existante n'est autorisé.

**Limites non levées :** le contrôle visuel reste borné aux 100 fiches chargées ; il ne constitue pas une recherche globale dans le CRM. La source publique ne garantit pas que chaque fiche comporte effectif, nombre d'établissements ou toutes les données de structure. Les informations sont conservées dans les notes faute de colonnes dédiées déjà présentes dans le schéma ; aucune colonne, table, migration, politique RLS ou donnée Supabase n'a été modifiée. La pagination serveur et une procédure de rapprochement contrôlée restent des lots distincts.
