# Nettoyage documentaire — inventaire et règles de conservation

**Mise à jour : 5 novembre 2026 — périmètre documentaire uniquement.**

## 1. Objectif

La documentation V5 est un référentiel autonome. Le nettoyage supprime les copies locales de dossiers de versions antérieures afin d'éviter les confusions de version, sans supprimer les branches sources ni les exigences métier encore utiles.

## 2. Répartition canonique des sources

- `docs/evolution-5.0/` : référentiel actif et documents propres à la V5.
- Branche `evolution-2.0` : sources documentaires V2 ; ne pas recopier son dossier dans V5.
- Branche `evolution-3.0` : sources documentaires V3 ; ne pas recopier son dossier dans V5.
- Branche `evolution-4.0` : sept documents sources V4 ; ne pas recopier son dossier dans V5.
- `docs/historique/` : archives sélectives ; les copies strictement identiques aux branches sources ont été retirées le 5 novembre 2026. Huit documents restent isolés comme archives à rapprocher de V5.

Le document [Filiation documentaire V2 → V5](FILIATION-DOCUMENTAIRE-V2-A-V5.md) identifie les commits, les corpus et les principaux changements.

## 3. Nettoyage réalisé dans V5

- Retrait du dossier local `docs/evolution-2.0/` (quatre copies documentaires).
- Retrait du dossier local `docs/evolution-3.0/` (neuf copies documentaires).
- Aucun dossier `docs/evolution-4.0/` n'était présent dans l'arbre V5 ; le corpus V4 a été retrouvé sur sa branche source et n'a pas été copié.
- Les branches sources `evolution-2.0`, `evolution-3.0` et `evolution-4.0` ne sont pas modifiées.
- Le tri des archives historiques est détaillé dans [Nettoyage des archives historiques](NETTOYAGE-ARCHIVES-HISTORIQUES-2026-11-05.md) : 27 copies exactes retirées, 6 versions modifiées et 2 ressources uniques conservées.
- Les documents actifs du dossier `docs/evolution-5.0/` et les fichiers du site ne sont pas déplacés par cette opération.

## 4. Règles de tri

| Classe | Traitement |
|---|---|
| Référence V5 actuelle, exacte et utile | Conserver comme source canonique |
| Fonction ou exigence métier utile, même non développée | Préserver et rattacher à la référence ou à la roadmap V5 |
| Contenu utile mais daté | Citer sa source historique et extraire uniquement les éléments encore valides |
| Copie d'une version antérieure | Retirer du dossier V5 ; conserver la source sur sa branche |
| Copie historique strictement identique à une source de branche | Retirer la copie V5 ; préserver la source sur sa branche historique |
| Version historique modifiée ou ressource sans équivalent | Conserver provisoirement, marquer comme archive et rapprocher de V5 avant réutilisation |
| Contradiction | Ouvrir un arbitrage, ne pas choisir silencieusement |
| Proposition non validée | Garder dans un registre d'hypothèses |
| Information non vérifiée | Marquer « à vérifier » et définir la preuve attendue |
| Contenu réellement abandonné | Proposer le retrait après recherche des dépendances et validation |

## 5. Principes de contrôle

- vérifier les liens Markdown et chemins relatifs après retrait des copies ;
- harmoniser titres, versions, dates, branches et références de commits ;
- comparer les documents avant toute fusion ;
- distinguer code présent, prototype, fonction testée et fonction opérationnelle ;
- corriger les termes obsolètes dans l'interface active sans réécrire les archives sources ;
- maintenir la traçabilité destination → dossier → sous-dossier → page → fonction ;
- inventorier les dépendances HTML/CSS/JS, scripts de build, tests, workflows et ressources avant toute intervention sur le site ;
- ne jamais modifier le site dans le cadre d'un nettoyage strictement documentaire.

## 6. Points de vigilance stratégiques

- Les documents historiques peuvent contenir des noms ou concepts remplacés ; ils servent à retrouver les intentions d'origine, pas à définir seuls la doctrine actuelle.
- MajestiOS V.5 est l'intelligence centrale du site. Les capacités décrites dans les documents sont des cibles tant que leur réalisation n'est pas prouvée.
- « Réputation virtuelle » est le terme cible.
- « Prospection » est l'intitulé officiel du dossier et le terme à employer dans toute l’interface.
- Les pages salons et séminaires restent des contenus du Réseau.
- CRM, Business Intelligence, mémoire, orchestration, administration et SEO sont des capacités transversales, même si elles ne constituent pas des étages.
- Le SEO continu, la veille des moteurs et les recommandations de maintien à la pointe font partie du périmètre stratégique de l'administration de MajestiOS V.5.

## 7. État des éléments du site — hors périmètre de ce nettoyage

Les audits précédents ont recensé des ressources visuelles, des pages, des scripts et des parcours. Le présent nettoyage ne les modifie pas. Toute intervention future sur ces éléments exige une demande distincte, un audit de dépendances et les validations habituelles.

## 8. Livrables documentaires

- inventaire des sources versionnées ;
- matrice de filiation et de continuité ;
- corrections des références erronées ;
- index V5 sans copies des versions antérieures ;
- vérification des liens documentaires internes ;
- compte rendu exact des fichiers modifiés et des contrôles exécutés.
