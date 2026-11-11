# Audit de non-régression fonctionnelle — référence Evolution-7

Date : 11 novembre 2026  
Branche de travail : `Evolution-9`  
Référence fonctionnelle et visuelle : `Evolution-7`

## Décision de référence

Evolution-9 ne constitue pas une refonte libre de MajestiOS. La cible est la version Evolution-7 conservée, corrigée et améliorée, avec l'ajout de la thématique de facturation électronique. Aucune rubrique ou capacité historique ne doit disparaître au profit d'une nouvelle présentation ou d'une évolution documentaire.

## Comparaison Git

Comparaison des arbres de fichiers Evolution-7 et Evolution-9 au commit de contrôle :

- 307 fichiers de référence dans Evolution-7.
- 323 fichiers dans Evolution-9.
- 16 fichiers ajoutés, dont les spécifications et la page de facturation électronique.
- 19 fichiers modifiés.
- **Aucun fichier supprimé** dans Evolution-9 par rapport à Evolution-7.

L'absence de suppression de fichier ne suffit pas à prouver l'absence de régression : le contenu et l'accessibilité des fonctionnalités doivent aussi être contrôlés.

## Régression détectée et correction appliquée

| ID | Domaine | Constat | Correction | État |
|---|---|---|---|---|
| HOME-01 | Accueil | La page d'accueil Evolution-7, centrée sur le moteur de recherche, avait été remplacée par une présentation conceptuelle CRM. | Restauration de `index.html` depuis Evolution-7 : accroche, flux d'information, moteur de recherche avancé et parcours d'origine rétablis. | Corrigé ; CI et test navigateur réussis |
| NAV-01 | Navigation | Plusieurs pages publiques ne chargeaient pas de manière cohérente le composant de tiroirs ; le chargement partagé par `app.js` devait être préservé. | Conservation du chargeur commun ; correction du contrat de test et contrôle des menus sur mobile et ordinateur. | Test navigateur réussi |
| VIS-01 | Harmonisation visuelle | Les états, dimensions et espacements des menus devaient être normalisés sans modifier la structure fonctionnelle. | Ajout d'un socle commun dans `navigation-tiroirs.css` : typographie, hauteurs, espacements, sous-menus, survol, état actif, focus clavier, cibles tactiles et réduction des animations. | Socle commun appliqué ; validation navigateur réussie |

## Matrice fonctionnelle de non-régression

| Domaine de référence Evolution-7 | Exigence de conservation | État du contrôle |
|---|---|---|
| Accueil et moteur de recherche | Le moteur reste immédiatement accessible sur la page d'accueil ; les filtres publics/privés, catégories et départements restent disponibles. | Accueil restauré ; build, contrôles statiques et test navigateur du moteur réussis |
| Appels d'offres publics | Conserver la recherche, les catégories, la veille et les liens vers les sources. | Pages et routes présentes ; tests de connexion BOAMP réussis |
| Appels d'offres privés | Conserver la voie privée et ses pages de veille. | Pages et routes présentes ; contrôle statique réussi |
| Prospection | Conserver le ciblage, les critères APE/NAF, la qualification et les signaux. | Tests unitaires et parcours navigateur des critères réussis |
| Réputation virtuelle | Conserver la page, le registre, les consultations et le dossier d'audit. | Tests de contrat et du dossier/consultations réussis ; ne vaut pas validation d'une autonomie complète de Cheexpeer |
| Développement commercial et suivi | Conserver les pages de développement, suivi et qualification. | Pages, routes et liens contrôlés |
| Réseau et synergies | Conserver Réseau, salons et séminaires. | Pages et routes contrôlées |
| Intelligence économique et BODACC | Conserver les pages, filtres et sources. | Contrôles statiques et connexion BODACC réussis |
| Sous-traitance et accompagnement | Conserver les parcours et liens entre appels d'offres, qualification et prospection. | Pages et liens contrôlés |
| Espaces membre, privé et VIP | Conserver les accès et contrôles existants ; ne pas exposer les espaces internes. | Tests navigateur du parcours membre et du verrouillage sans session réussis |
| CRM interne | Conserver le poste interne, ses modules et ses règles d'accès. | Contrats et contrôles de sécurité CI réussis ; recette multi-identités Supabase toujours distincte et non exécutée |
| Administration et recherche interne | Conserver les pages privées et leurs restrictions. | Contrôles d'architecture et de sécurité réussis |
| Rubriques sectorielles | Conserver les huit pages sectorielles et leurs retours vers la recherche filtrée. | Routes, liens et identifiants contrôlés |
| Pages institutionnelles et légales | Conserver contact, FAQ, vision, mentions légales, confidentialité et recrutement. | Pages et liens locaux contrôlés |
| Facturation électronique | Ajouter une nouvelle thématique sans remplacer le moteur, la prospection, le CRM ou les autres rubriques. | Page et liens présents ; conception fonctionnelle cadrée ; module et connecteur PA non opérationnels |

## Harmonisation graphique des menus

Le composant de navigation partagé doit donner le même langage visuel à chaque menu public :

- mêmes hauteurs, espacements, typographie et rayons ;
- mêmes états normal, survol, ouvert, actif et focus ;
- mêmes comportements clavier et tactile ;
- tiroirs lisibles et compacts sur ordinateur ;
- menu mobile avec cibles tactiles adaptées ;
- palette MajestiOS bleu nuit / accents de rubrique / or discret ;
- respect de `prefers-reduced-motion`.

La couleur d'accent peut différencier les familles de rubriques ; elle ne doit pas modifier leur géométrie ni leur comportement.

## Contrôles CI réalisés

Sur le commit `96bf0a1876f6947821ffdbc9c767df35321175cf` :

- construction du site statique : succès ;
- vérification de l'architecture, des routes, liens et identifiants : succès ;
- contrôles du moteur de recherche et de Prospection : succès ;
- contrôles BOAMP et BODACC : succès ;
- tests navigateur du moteur de recherche : succès ;
- tests navigateur Réputation virtuelle : succès ;
- tests navigateur des menus sur mobile et ordinateur : succès ;
- contrôles de contact et de verrouillage de l'espace interne : succès ;
- contrat de sécurité CRM : succès.

Workflow : [Vérification du site MajestiOS — run 43023792977](https://github.com/Chexpeer/Majestios/actions/runs/43023792977).

## Limites et suites obligatoires

1. Effectuer une revue visuelle page par page sur ordinateur et mobile ; la réussite CI ne remplace pas l'examen de chaque écran.
2. Contrôler les liens réels depuis chaque menu, notamment les pages internes et les retours contextuels.
3. Vérifier les parcours métier complets des moteurs publics et privés avec des données représentatives.
4. Terminer la recette multi-identités du CRM sur `MajestiOS-Test), après provisionnement synthétique autorisé.
5. Ne jamais modifier le projet Supabase de test ou le projet principal pendant cette recette sans plan explicite et validation.
6. Ne pas promouvoir Evolution-9 en production avant validation fonctionnelle, visuelle et métier complète.

**Règle de clôture :** chaque fonctionnalité Evolution-7 doit être marquée conservée, corrigée, améliorée ou manquante, avec une preuve. Toute fonctionnalité manquante bloque la livraison.


## Espace Assistant MajestiOS

Un guide conversationnel de première génération est déjà intégré dans `app.js`. Il s'agit d'une orientation locale par mots-clés, et non d'un moteur IA connecté. Evolution-9 lui réserve désormais une page dédiée (`assistant-majestios.html`) et charge ses styles depuis une feuille isolée (`majestios-chat.css`) sur les pages qui utilisent le contrôleur partagé. Le raccordement d'un fournisseur IA, les droits, le contexte utilisateur, les journaux et le transfert humain restent à construire et à recetter. Cette capacité ne doit pas être confondue avec Cheexpeer.
