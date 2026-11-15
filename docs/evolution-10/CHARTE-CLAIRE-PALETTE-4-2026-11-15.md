# Charte claire — palette « 4 · Mixte clair + anthracite » (15 novembre 2026)

**Décision du propriétaire :** le site est trop sombre, trop bleu et manque de contrastes ; palette 4 retenue après comparaison visuelle de quatre ambiances.
**Périmètre :** branche `evolution-10`, MajestiOS-Test uniquement. Rien promu vers MajestiOS-CRM. L'ancienne charte « bleu nuit, or et chrome » (documentée comme référence) est remplacée sur le site public ; elle peut être rétablie en retirant le bloc « PALETTE CLAIRE » à la fin de `charte-majestios.css`.

## Palette
| Rôle | Valeur |
|---|---|
| Fond des pages | blanc `#FFFFFF` |
| Cartes et panneaux | crème `#F6F3EC`, filet `#D4CDBE` |
| Structure (bandeau, pied de page, boutons) | anthracite `#2A2926` |
| Signature | or `#E8C766` sur anthracite ; `#8A5F00` pour le texte doré sur fond clair |
| Texte courant | `#2A2926` (titres) et `#55514A` (paragraphes) |

Contrastes mesurés : texte courant 14,5:1 ; paragraphes ≥ 7:1 ; liens dorés 5,6:1 ; bouton or sur anthracite 8,9:1. Contrôle automatique sur toutes les pages publiques : aucun texte sous 4,5:1 hors images.

## Ce qui change
- Pages publiques : fond blanc, les visuels de rubrique et le panorama de l'accueil restent, sous un voile blanc (filigrane) ; cartes crème ; titres anthracite ; surtitres et liens or foncé.
- En-tête et pied de page anthracite et or. Les boutons de rubrique ont le même gabarit ; la couleur propre à chaque rubrique ne subsiste qu'en filet sous le bouton.
- Boutons principaux anthracite avec texte or ; secondaires en contour anthracite.
- Formulaires : champs blancs, filet net, libellés lisibles.
- Les reflets de la « vitre » sont retirés (ils n'avaient de sens que sur fond sombre).

## Ce qui n'a PAS changé (phase 2, sur décision du propriétaire)
Les outils internes gardent leurs couleurs d'origine, par choix de prudence (ils n'ont pu être vérifiés connectés ici) : administration, relecture des annonces, utilisateurs, recherches, Cheexpeer, acceptation d'invitation, espace collaborateurs, CRM. Leurs variables de couleur d'origine sont rétablies dans le bloc (`body.admin-shell`, `body.internal-shell`, `body.crm-shell`), donc **aucune régression** : ils sont identiques à avant. Restent aussi sombres par conception : le bandeau défilant de l'accueil, le bouton de discussion, les images.

## Vérifications
Gardes `verify-site`, `verify-architecture`, `verify-liens-site` et toute la CI rejouée (seuls les tests d'API publiques BOAMP/BODACC en ligne échouent hors réseau) ; captures ordinateur (1280 px) et mobile (390 px) ; relevé automatique des surfaces sombres et des contrastes.

## Pour la production
Décider de la phase 2 (outils internes), puis promotion groupée vers MajestiOS-CRM uniquement sur décision explicite du propriétaire.
