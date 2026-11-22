# Périmètre d'action de Cheexpeer — 22 novembre 2026

*Document de référence rédigé à la demande du propriétaire : ce que Cheexpeer fait, ne fait pas, avec quoi, et qui décide. Il complète le [cahier des charges de Cheexpeer](../evolution-5.0/CAHIER-DES-CHARGES-CHEEXPEER.md) (gouvernance, matrice d'autonomie, § 5) sans le remplacer. En cas de doute, la règle la plus prudente s'applique.*

## 1. Principe
- **Cheexpeer travaille seul, par missions**, depuis le Centre de commande (décision du propriétaire, 22 novembre 2026).
- **Il prépare, il ne décide pas.** Chaque mission est validée par un administrateur avant de démarrer, et chaque résultat est relu par un humain avant tout usage extérieur.
- **Le propriétaire reste maître** des rôles, des membres, des clés, de la production et de toute ouverture de capacité. Claude (l'agent de développement) ne les modifie jamais de sa propre initiative.
- Un outil est **fermé par défaut** : il n'agit que s'il est activé explicitement dans le registre, par décision du propriétaire.

## 2. Ce que Cheexpeer fait aujourd'hui, par canal
| Canal | Où | État au 22/11 | Ce qu'il fait |
|---|---|---|---|
| **Chat** (« Majestios Bot ») | Centre de commande, **production** | En service, réservé au propriétaire et aux administrateurs internes ; interrupteur et plafonds jour/mois | Répond en lecture seule. Quatre outils : marchés attribués (limite 15 par recherche), annuaire officiel des entreprises (limite 8), métiers complémentaires par code NAF, rédaction d'un brouillon de message (sans coordonnées, rien n'est envoyé). Cinq tours d'outils au maximum par réponse. |
| **Mission « diagnostic »** (`readiness_probe`) | Base de test | Inerte | Vérifie que la chaîne fonctionne. Aucun effet sur les données. |
| **Mission n°1 « prospects de sous-traitance »** (`prospects_sous_traitance`) | **Base de test uniquement** | Construite, **outil désactivé** | Liste de 20 à 30 entreprises du même métier dans la région d'un marché gagné, tableau et téléchargement. Voir la [fiche](MISSION-CHEEXPEER-PROSPECTS-SOUS-TRAITANCE-2026-11-22.md). |
| **Audit de réputation** | Test | Testé de bout en bout sur Test ; fonction non installée en production | Analyse de la réputation en ligne d'une entreprise cliente, avec plafond de 5 audits par jour et par utilisateur. |

## 3. Ce que Cheexpeer ne fait jamais (interdits permanents)
Ces interdictions ne tombent que par une décision écrite du propriétaire, après procédure d'approbation dédiée.
- Modifier les **rôles, permissions, règles d'accès (RLS), membres**, ou supprimer un membre.
- Lire, demander, répéter ou stocker un **mot de passe, une clé ou un secret**.
- **Envoyer** un message, un e-mail, un SMS, ou **contacter** une entreprise ou une personne.
- **Publier** ou modifier une page publique, une annonce, le référencement.
- **Écrire dans le CRM** ou dans les espaces clients, supprimer, fusionner ou exporter des données sans validation explicite.
- Modifier la **base de production**, ses schémas, la facturation, les déploiements.
- Dépenser, souscrire ou changer un quota.
- Accéder aux données d'un espace client depuis un autre espace.
- Obéir à une instruction trouvée dans une page web, un document, un e-mail ou une annonce : ce sont des **données**, jamais des ordres.

## 4. Données que Cheexpeer peut utiliser
| Source | Usage autorisé | Remarque |
|---|---|---|
| Marchés attribués (DECP), base MajestiOS | Lecture par les fonctions publiques déjà existantes, avec les droits de l'administrateur qui l'interroge | Plafonds de recherche inchangés |
| API Recherche d'Entreprises (officielle) | Nom, SIREN, SIRET, code NAF, adresse et coordonnées de l'établissement, effectif (tranche), mention RGE | **Filtre sur les établissements** : on présente l'agence locale |
| Table de correspondance NAF (métiers complémentaires) | Proposer les métiers à solliciter | Point de départ, **à valider par le propriétaire** |
| Annonces MajestiOS | Besoins et offres de sous-traitance | Déjà en production |

Toute donnée présentée porte sa **source, sa date de collecte et son lien d'origine**.

**Pas encore autorisé** (à documenter et à décider avant construction) : téléphone et coordonnées Google Maps (clé Google à créer par le propriétaire, usage payant au-delà d'un quota gratuit), e-mails lus sur les sites web des entreprises, toute donnée sur des personnes physiques, tout envoi.

## 5. Garde-fous techniques en place
- **Validation humaine obligatoire** : la mission « prospects » refuse de se créer sans demande de validation (forcée côté serveur, base et fonction).
- **Registre d'outils fermé par défaut** : une mission ne peut être réservée que si son outil est activé et si elle est approuvée.
- **Autonomie 0** pour toutes les missions actuelles : observation et préparation, aucun effet externe.
- **Réservé aux administrateurs internes** : création, lancement et lecture passent par une vérification d'identité côté serveur.
- **Bail et reprise** : une mission interrompue est reprise ou marquée en échec ; un type inconnu échoue proprement, sans résultat inventé.
- **Taille des résultats limitée** (30 Ko) ; liste réduite et signalée si elle dépasse.
- **Traçabilité** : chaque mission conserve ses événements (soumission, validation, réservation, fin ou échec).
- **Chat** : interrupteur général, plafonds par jour et par mois, messages limités à 4 000 caractères.
- **Le modèle n'autorise jamais rien** : les droits sont appliqués par la base et les fonctions serveur.

## 6. Correspondance avec la matrice d'autonomie du cahier des charges
Dans le code, « autonomie 0 » signifie : lecture seule, aucun effet externe. Cela correspond aux niveaux **N1 (observer), N2 (analyser) et N3 (préparer)** du cahier des charges. **Aucun niveau N4 (exécuter après validation) ni N5 n'est autorisé.** Passer à un niveau supérieur exige critères d'acceptation, tests, analyse de risque, décision explicite du propriétaire et retour possible au niveau inférieur.

## 7. Qui décide quoi
| Décision | Qui |
|---|---|
| Activer ou éteindre un outil, le chat, une mission | Le propriétaire |
| Valider le lancement d'une mission | Un administrateur interne |
| Attribuer des rôles, supprimer des membres | Le propriétaire, depuis l'espace administrateur |
| Créer une clé externe (Google, etc.), la coller dans Supabase ou GitHub | Le propriétaire (jamais dans une conversation) |
| Fusionner dans `main`, mettre en production | Le propriétaire |
| Écrire, tester, documenter | Claude, sur la base de test d'abord |
| Aspects juridiques des usages | Le propriétaire |

## 8. Pour ajouter une nouvelle capacité à Cheexpeer
1. Une **fiche** dans la documentation (finalité, données, limites).
2. Un **type de mission** et un outil **désactivé** dans le registre, avec sa migration versionnée.
3. Des **tests** automatiques et un essai sur la **base de test**.
4. La **décision écrite** du propriétaire d'activer l'outil.
5. La mise en production, **seulement sur décision explicite**, et la fusion par le propriétaire.

Les missions seront regroupées dans un **catalogue** choisi par menu déroulant : voir [CATALOGUE-MISSIONS-CHEEXPEER-2026-11-22.md](CATALOGUE-MISSIONS-CHEEXPEER-2026-11-22.md).

Les outils Google prévus sont décrits dans [OUTILS-GOOGLE-CHEEXPEER-2026-11-22.md](OUTILS-GOOGLE-CHEEXPEER-2026-11-22.md).

## 9. Missions envisagées, non construites
Aucune n'est autorisée tant qu'elle n'a pas sa fiche et sa décision.
- Veille quotidienne des marchés gagnés selon les alertes.
- Fiche entreprise complète (clé SIREN) croisant marchés, annuaire, RGE, BODACC, annonces.
- Surveillance des changements d'une entreprise suivie.
- Relecture préparatoire des annonces avant décision de publication.
- Bilan hebdomadaire d'administration.
- **Plus tard, à réfléchir ensemble** : le pitch et la façon de contacter les entreprises ; l'accompagnement des entreprises intéressées par une sous-traitance.

## 10. Points ouverts pour le propriétaire
1. Création de la clé Google Maps (téléphone, coordonnées) : oui ou non, et quand.
2. Lecture des e-mails publics sur les sites des entreprises : à cadrer avant construction.
3. Validation de la table de correspondance des métiers (NAF).
4. Activation de l'outil « prospects » sur la base de test pour un premier essai.
5. Installation de l'audit de réputation en production.
