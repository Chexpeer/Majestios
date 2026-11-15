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

## Nettoyage des fichiers inutilisés (même jour, sur demande du propriétaire)
Mesure : les 43 pages ouvertes sur ordinateur et mobile, relevé de toutes les images réellement chargées, et recherche des fichiers cités par aucune page, feuille de style ou script.
**Supprimés (branche de test) :** `OFFRE PUBLIC.png` (2,8 Mo), `IMMEUBLE.jfif` (1 Mo), `immeuble-masque.png`, `homepage-evolution-8.css` et `navigation-majestios.css` (feuilles chargées par aucune page), trois schémas `assets/visuels/rubrique-{facturation,reputation,reseau}.svg`. Retirés aussi : leurs anciennes règles de style, l'en-tête dédié de `vercel.json`, leurs lignes du manifeste, et la règle de garde « trois visuels historiques » (devenue « visuel de l'accueil conservé »). Gain : environ 3,9 Mo. Restitution possible à tout moment par l'historique Git.
**Conservés volontairement :** les images encore affichées sur une page (dont `Designer (2).png`), `robots.txt`/`sitemap.xml`, `generate-sitemap.js` (outil de génération du plan du site), `schema-majestios.svg` et `schemas/opportunite.schema.json` (cités par les audits), `services/cheexpeer-worker` (service Cheexpeer), les migrations Supabase, la documentation, `CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md` (exigé par un garde-fou) et la page `assistant-majestios.html` (page publique du plan du site, couverte par des tests, mais qu'aucun lien n'atteint) : décision demandée au propriétaire.
**Ajouté à la CI :** trois tests qui existaient sans jamais être lancés (`annonces-formulaire.browser`, `bootstrap-admin-hardening`, `prospecting-signals`) ; ils passent.
**Reste à faire :** convertir les cinq grosses photos encore affichées (12,6 Mo) en WebP.

## Complément — photo « développement commercial » et contrastes (2026-11-15)

- La photo de poignée de main (`devellopement (2).jfif`) a été retirée à la demande du propriétaire (photo non appréciée). La page Développement commercial a désormais un fond blanc simple. Un autre visuel pourra être choisi plus tard (décision propriétaire).
- Le bandeau `rubrique-prospection.svg` a été recoloré (bleus remplacés par de l'anthracite).
- Or de texte sur fond clair renforcé : `#7A5200` (au lieu de `#8A5F00`) pour un contraste d'au moins 5,5:1.
- Méthode de contrôle : en plus de l'outil de contraste, un balayage au pixel (captures d'écran) a été utilisé, car l'outil ignore les textes posés sur des images. Ce balayage a révélé la page Développement commercial, oubliée au premier passage.
- Corrections associées : barre d'appel à l'action crème avec bouton anthracite, boutons d'accueil anthracite/or, faces du cube en verre fumé, libellés de formulaire de prospection.
- Les outils internes (administration, espace interne, CRM) restent en couleurs d'origine (phase 2 en attente de décision).

## Complément — images de fond converties en WebP (2026-11-15)

Décision propriétaire : la page assistant est conservée ; les 5 grandes images sont converties en WebP et restent utilisées comme fonds d'écran.
- `Designer (2).png` → `fond-panorama.webp` (fond de l'accueil et du bandeau commun)
- `CRM.png` → `fond-crm.webp`, `Réseaux .png` → `fond-reseaux.webp`
- `Ereputation.png` → `fond-ereputation.webp`, `Facture1.png` → `fond-facturation.webp`
Poids total : 12,6 Mo → environ 1,3 Mo, rendu inchangé. Les anciens PNG sont supprimés et le contrôle d'architecture vérifie qu'ils ne reviennent pas. Les documents des anciennes évolutions citent encore les anciens noms : ils restent tels quels (historique).

## Complément — visuel de la page Développement commercial (2026-11-15)

Décision propriétaire : « oui » au visuel proposé. La page reprend `visuels/fonds/suivi-commercial.webp` (courbe de croissance, sans personnes, sans bleu), très voilé de blanc (93 %/90 %) ; l'ancienne bande décorative du haut de page est masquée pour éviter une ligne de séparation visible. Retour possible : remettre `background-image:none` dans la règle `.page-development-commercial` de `charte-majestios.css`.
Remarque : les images Facturation et E-réputation sont, comme CRM et Réseaux, des bandeaux dans la page (titre inclus dans l'image), pas des fonds de page entière.

## Correction — vos images en fond d'écran de toute la page (2026-11-15)

Décision propriétaire (réitérée) : les images CRM, Réseaux, E-réputation et Facturation sont des fonds d'écran de page entière, pas des bandeaux. Elles couvrent maintenant toute la page (Prospection, Réseau, Réputation virtuelle, Facturation électronique), fixées derrière le contenu sur ordinateur. Un voile blanc dégradé (97 % à gauche, 64 % à droite) estompe le titre dessiné dans l'image et garde les textes lisibles ; l'image reste bien visible à droite. Les anciens bandeaux sont masqués. Retour possible : supprimer le dernier bloc « Fonds d'écran fournis » de `charte-majestios.css`.
Cette note remplace la remarque précédente selon laquelle ces images restaient des bandeaux.
