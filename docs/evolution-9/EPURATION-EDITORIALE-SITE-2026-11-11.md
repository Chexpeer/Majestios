# Épuration éditoriale du site — Evolution-9

**Date :** 11 novembre 2026  
**Branche :** `Evolution-9`  
**Périmètre :** textes visibles des pages publiques ; aucune suppression de fonctionnalité.

## 1. Ligne éditoriale

Les textes doivent être clairs, courts, courtois et concis. Une phrase porte une idée. Les formulations techniques, les répétitions et les promesses non démontrées sont réduites ou explicitées.

La simplification ne doit jamais supprimer une information utile à la décision, une limite de service, une précision réglementaire ou une mention de confidentialité.

## 2. Modifications effectuées

| Page | Évolution éditoriale |
|---|---|
| `index.html` | Accroche orientée bénéfice : « Détecter les opportunités. Développer votre activité. » ; positionnement clarifié comme CRM en évolution. |
| `developpement-commercial.html` | Promesse, titre de section et bénéfices raccourcis ; vocabulaire plus direct. |
| `marches-publics.html` | Présentation centrée sur les appels d’offres adaptés, les critères, les délais et les moyens de l’entreprise. |
| `marches-prives.html` | Présentation raccourcie ; maintien de la distinction entre signal commercial et commande confirmée. |
| `accompagnement-appels-offres.html` | Suppression de la répétition de l’accroche ; formulation plus directe sur la préparation du dossier. |
| `contact.html` | Simplification de l’introduction et regroupement des avertissements du formulaire. L'absence d'envoi et d'enregistrement reste explicite. |
| `faq.html` | Réponses raccourcies sur MajestiOS, la prospection, les marchés et l'état de l'espace client. |

## 3. Informations volontairement conservées

- Les exemples de l'accueil restent identifiés comme fictifs.
- Les résultats privés restent des pistes à vérifier, pas des marchés garantis.
- Le formulaire de contact reste en prévisualisation : aucune donnée n'est envoyée ni enregistrée.
- L'espace client et certaines fonctions restent présentés comme en cours de validation ou de préparation.
- Les pages réglementaires, notamment la facturation électronique, n'ont pas été réécrites dans cette passe afin de ne pas altérer des informations de calendrier ou de conformité sans vérification dédiée.

## 4. Contrôle de non-régression

La modification de l'accroche a rendu obsolète une assertion de `verify-architecture.js`. Les contrôles `verify-architecture.js` et `verify-site.js` ont été adaptés pour vérifier le nouveau positionnement et la mention explicite des fonctions encore en préparation, sans affaiblir les autres assertions.

- Échec initial identifié : le contrôle d'architecture attendait encore l'ancienne accroche.
- Correction : assertion mise à jour pour le nouveau texte.
- Build : succès, 86 ressources copiées depuis le manifeste.
- Vérifications d'architecture, de site et de liens documentaires : succès.
- Tests navigateur : navigation classique/chatbot, moteur de recherche, Réputation virtuelle, menus desktop/mobile, formulaire de contact et verrouillage du poste de commande : succès.
- CI complète : succès sur le HEAD `65e4aaaebe2762417d3823319c1df6e5d43dc30b`, workflow [43101656463](https://github.com/Chexpeer/Majestios/actions/runs/43101656463).

## 5. Commits applicatifs

- Accueil : `63ca88a0b371708a04735daab5db1b0fd4ea70c3`, puis `f07aed2dc483e0e8233ca9e9b01e54d69bb677b3).
- Développement commercial : `17108578dd2590c99ef009d07dd3a6d74ead1f3a`.
- Marchés publics : `c833c1f2412dbd7ea810d30c1c2e15b64d3a2cb6`.
- Marchés privés : `1f9285b5587709c6adba95385b7fdb6de21752ef`.
- Accompagnement : `59847cae62e72c757fc11f176eb26ac1cefd8021`.
- Contact : `f47588d5f6fa4bf71caa5ccfaf941578620cee0b`.
- FAQ : `7f32f5a45f21c93535722b4e2b875645df9eb52e`.
- Contrat d'architecture : `0cbc3059813c5bdaef74a647be6cddfe6615dd83` ; contrôle de site : `65e4aaaebe2762417d3823319c1df6e5d43dc30b`.

## 6. Limites et suite

Cette passe est une première tranche éditoriale, pas une réécriture exhaustive des 39 pages. Les prochaines pages à traiter seront les rubriques de réputation, réseau, veille, sous-traitance, suivi commercial et les espaces de présentation. Les textes légaux et réglementaires feront l'objet d'une revue séparée.

Aucune page, route, fonctionnalité, donnée Supabase, migration, configuration, secret ou déploiement n'a été supprimé ou modifié dans cette passe.
