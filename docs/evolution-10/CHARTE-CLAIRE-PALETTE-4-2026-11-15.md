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

## Ajustement final — fond d'écran net, défilement invisible (2026-11-15)

Décision propriétaire : « le fond d'écran doit être clairement visible, le scroll invisible et pas transparent ». Le voile blanc est supprimé : l'image est affichée nette, fixée sur tout l'écran derrière la page (CRM/Prospection, Réseau, Réputation virtuelle, Facturation électronique). Le contenu défile devant, sur des cartes crème pleines (opaques) ; la barre de défilement est masquée sur ces quatre pages. L'en-tête de page (rubrique, titre, texte d'introduction) est regroupé dans une carte (`mj-page-head`). Cette note remplace la précédente sur le voile blanc. Retour possible : supprimer le bloc « Fonds d'écran fournis » de `charte-majestios.css`.

## Dernier ajustement — cartes en verre transparent (2026-11-15)

Décision propriétaire : « les cartes doivent être transparentes de façon à ce que le fond d'écran soit entièrement visible ». Sur Prospection, Réseau, Réputation virtuelle et Facturation électronique, les cartes crème pleines sont remplacées par du verre fumé (fond sombre à 70 %, léger flou, bord clair) : le texte passe en blanc, les liens en or clair. Les formulaires et panneaux internes restent crème avec texte sombre pour garder leur lisibilité. Cette note remplace celle sur les cartes crème pleines. Correction au passage : une première version touchait aussi les pages Appels d'offres/Veille (classe partagée) ; la classe dédiée `page-wallpaper` limite maintenant ces règles aux quatre pages concernées. Retour possible : supprimer les blocs « Cartes en verre fumé » et « Éléments crème internes » de `charte-majestios.css`.

## Accueil — même traitement (2026-11-15)

Décision propriétaire : l'accueil reçoit le même traitement que les quatre rubriques. Le panorama `fond-panorama.webp` est affiché net (sans voile blanc), fixé derrière toute la page ; la barre de défilement est masquée. La barre de recherche, le texte d'introduction, l'accès à l'espace personnel et le titre « Explorez les quatre rubriques » sont sur du verre fumé transparent (70 %, léger flou) avec texte blanc. Le cube garde son verre fumé. Retour possible : supprimer le dernier bloc « Accueil : fond d'écran net et fixe » de `charte-majestios.css`.

## Nouveaux fonds d'écran sur toutes les rubriques (2026-11-16)

Décision propriétaire : les nouveaux fonds d'écran déposés dans le dépôt (back1, back3, back5, back6, back7, back8, back9 : 7 images différentes, plusieurs fichiers en double) sont mis en fond de **toutes** les rubriques ; l'accueil n'est pas touché ; **tous les anciens fonds sont supprimés**.
- Rendu commun à toutes les rubriques : image nette, fixe, sans voile ; barre de défilement masquée ; cartes en verre fumé transparent ; en-tête de page regroupé (`mj-page-head`).
- Attribution (7 images pour 14 pages, donc certaines servent deux fois ; modifiable en changeant le fichier du même nom dans `visuels/fonds/`) :
  - back1 (allée de parc) : Réseau, Intelligence économique
  - back3 (bassin et immeuble de verre) : Réputation virtuelle, Veille BODACC
  - back5 (atrium de verre) : Marchés publics, Accompagnement appels d'offres
  - back6 (tours de verre, soleil couchant) : Marchés privés, Veille des marchés
  - back7 (maison sur la falaise, image de petite taille 429×241) : Salons et séminaires
  - back8 (patio avec bonsaï) : Prospection, Suivi commercial
  - back9 (salon vitré) : Facturation électronique, Sous-traitance, Développement commercial
- Les images sont enregistrées sous les noms de rubrique existants (`visuels/fonds/<rubrique>.webp`) : les anciennes illustrations sont donc remplacées.
- Supprimés : `fond-crm.webp`, `fond-reseaux.webp`, `fond-ereputation.webp`, `fond-facturation.webp`, les anciens bandeaux d'image des pages Réputation et Facturation (HTML et CSS), les règles d'image CRM/Réseaux, et les 11 fichiers `back*.webp` de la racine (copiés sous leurs noms de rubrique). Seul `fond-panorama.webp` reste (accueil).
- La page Développement commercial reçoit une rubrique de fond (`data-fond`) et son visuel ; l'ancienne figure illustrée est masquée.

## Fonds d'écran haute qualité (2026-11-16, suite)

- Sélection : seules les images d'architecture/jardins/intérieurs de bureaux fournies par le propriétaire ont été retenues (photos médicales, mains et scènes d'interface avec texte intégré écartées). Les images composites ont été découpées en scènes uniques.
- Amélioration : agrandissement ×2 par réseau de neurones (FSRCNN) puis mise à l'échelle 1920 px, netteté légère, WebP qualité 84 (93 à 457 Ko par fond).
- Attribution : marches-publics (atrium), marches-prives (tours), veille-marches (salle de conseil), accompagnement-appels-offres (salon), bodacc-veille-entreprises (bassin), intelligence-economique (allée), salons-seminaires (terrasse), sous-traitance (villa montagne), suivi-commercial (hall bonsaï), developpement-commercial (salon lounge), prospection-crm (hall), facturation-electronique (bassin et bureaux), reputation-virtuelle (villa et bassin), reseau-synergies (villa falaise).
- Inchangés : accueil, cube, CSS. Seuls les 14 fichiers `visuels/fonds/*.webp` sont remplacés.

## Cube, allègement et contrôle des liens (2026-11-16)

- Cube de l'accueil (demande explicite du propriétaire) : taille portée de 330 à 470 px au maximum (250 px minimum sur mobile) ; le cube s'arrête dès que le pointeur le survole ou le touche ; la face touchée s'ouvre dès le premier clic ou toucher, même si le cube avait bougé entre l'appui et le relâchement (cause du clic manqué). Le glissement ne déclenche toujours pas d'ouverture. Clic avec Ctrl, Cmd ou Maj : nouvel onglet. Contenu de l'accueil inchangé.
- Allègement : fonds d'écran recompressés (WebP qualité 76, 2,5 Mo au total au lieu de 3,4 Mo, un seul fond chargé par page) ; en-têtes de cache d'un jour pour les images (vercel.json). Les scripts sont déjà en `defer`.
- Liens : exploration de 43 pages (89 cibles locales distinctes, aucune erreur 404, aucune erreur JavaScript). Une anomalie corrigée : le lien du menu « Créer mon espace personnel » (`espace-membre.html#creation`) ne faisait rien ; il ouvre maintenant le formulaire de création.
- À savoir : l'authentification charge Supabase depuis esm.sh (service externe) ; à internaliser avant la production si on veut supprimer cette dépendance.

## Cartes plus transparentes (2026-11-16, 10 h)

- Demande du propriétaire : toutes les cartes des rubriques transparentes pour une vue maximale sur les fonds d'écran.
- Cartes en verre fumé : opacité du noir ramenée de 70 % à 30 % (cartes imbriquées 22 %), flou réduit à 3 px. Pour garder les textes lisibles sur les images claires, le fond derrière chaque carte est assombri (filtre `brightness(.5)`) : l'image reste bien visible à travers, un peu plus sombre.
- Cartes restantes (rubriques liées de Salons, cartes de Facturation, appel final) et titres en pastille : même traitement. Petites cartes illustratives et panneaux crème de la Réputation : crème translucide (58 à 62 %), texte sombre conservé. Les boutons d'action de la Prospection restent presque opaques (93 %) pour la lisibilité.
- Accueil et cube : non modifiés par cette étape. Retour en arrière : supprimer les blocs « Cartes en verre fumé » et « Cartes restantes » de `charte-majestios.css`.

## Cartes entièrement transparentes (2026-11-16, 10 h 15)

- Décision du propriétaire : plus aucun filigrane noir. Toutes les cartes des rubriques n'ont plus de fond, plus de flou et plus d'assombrissement ; seul un fin liseré blanc délimite chaque carte. Cette étape remplace les réglages de transparence partielle de l'étape précédente.
- Lisibilité : les textes restent blancs (liens et sur-titres en doré) avec un contour sombre. Compromis connu : sur les fonds très clairs (Réseau, Veille des marchés, Sous-traitance, Réputation), les petits textes sont moins confortables ; le contrôle automatique de contraste signale désormais ces pages. Si la lisibilité pose problème, la solution la moins intrusive est un voile très léger (10 à 15 %) derrière les cartes, à décider par le propriétaire.
- Restent opaques par nécessité : champs de saisie, boutons d'action (Rechercher, critères de la Prospection).
- Retour en arrière : supprimer le bloc « Cartes totalement transparentes » de `charte-majestios.css`.

## Accueil : titre réduit et cube visible dès l'ouverture (2026-11-16, 10 h 30)

- Demande explicite du propriétaire (elle lève, pour cette étape seulement, la consigne de ne pas toucher à l'accueil et au cube).
- Titre « Développez votre activité. Ouvrez de nouvelles perspectives. » réduit (34 px au maximum au lieu de 66 px), carte d'introduction compactée ; texte blanc et mot d'accroche en doré clair avec contour sombre pour rester lisible sur le fond d'écran.
- Ordre de la page : introduction, cube, puis recherche (la section de recherche est placée sous le cube), puis accès à l'espace personnel. Le cube est entièrement visible dès l'ouverture sur un écran de 1366 × 768 et sur mobile ; sa taille s'adapte à la hauteur de l'écran (jusqu'à 440 px). Le titre « Explorez les quatre rubriques » reste présent pour les lecteurs d'écran (masqué visuellement) ; la phrase d'aide reste affichée.
- Retour en arrière : supprimer le dernier bloc « Accueil (demande propriétaire 2026-11-16) » de `charte-majestios.css` et remettre la section recherche avant l'introduction dans `index.html`.

## Cartes invisibles partout, accueil recomposé, police adaptée par page (2026-11-16, 10 h 40)

- Cartes : plus aucun fond, plus de liseré, plus de flou, sur les 14 rubriques et sur l'accueil (introduction, recherche, accès personnel, phrase d'aide du cube). Seuls restent opaques les champs de saisie et les boutons d'action.
- Police adaptée à chaque page : variables `--mj-txt`, `--mj-link`, `--mj-halo`. Par défaut texte blanc à contour sombre et liens dorés clairs ; sur les deux fonds les plus clairs (Réseau et Veille des marchés), texte à encre sombre avec contour blanc et liens brun foncé. Mesure : luminosité moyenne des fonds (de 0,36 à 0,67). Pour changer une page, ajouter son `data-fond` dans la règle « adaptée à chaque page » de `charte-majestios.css`.
- Accueil : titre réduit à 21 px au maximum ; sur ordinateur (900 px et plus) la recherche, compacte, est à gauche du cube ; sur mobile l'ordre est introduction, cube, recherche.
- Limite connue : sans carte, le contrôle automatique de contraste signale presque toutes les pages (texte posé directement sur une photo). La lisibilité repose sur le contour du texte ; un voile très léger reste possible si le propriétaire le souhaite.
- Retour en arrière : supprimer les blocs « Cartes totalement transparentes » et « Accueil (demandes propriétaire 2026-11-16) » de `charte-majestios.css`, et remettre la section recherche avant l'introduction dans `index.html`.

## Accueil épuré et recherche visible sur mobile (2026-11-16, 10 h 50)

- Retrait, à la demande du propriétaire, du sur-titre « L'ÉCOSYSTÈME PROFESSIONNEL MAJESTIOS » et de la phrase « Réseau, opportunités commerciales… » (jugés inutiles). Seul le titre « Développez votre activité. Ouvrez de nouvelles perspectives. » reste. Les contrôles `verify-site.js` et `verify-architecture.js` vérifient désormais le titre et l'absence de ces deux textes.
- Mobile (moins de 900 px) : ordre titre, recherche, cube, accès personnel ; la recherche est visible dès l'ouverture, juste au-dessus du cube (taille du cube réduite à 330 px au plus pour tenir à l'écran).
- Ordinateur : recherche à gauche du cube, inchangée.

## Moins de répétitions dans les pages internes (2026-11-16, 11 h 40)

- Constat du propriétaire : titres et phrases répétés (exemple sur Prospection : phrase d'introduction, sur-titre « MOTEUR DE RECHERCHE · PROSPECTION », titre « Trouvez les entreprises… », phrase « Définissez votre cible… », puis « Entrez dans votre espace Prospection » et encore « Trouver les entreprises… »), ce qui éloigne le moteur de recherche du haut de page.
- Réglage (CSS seul, le texte reste dans le code des pages pour le référencement et la lecture d'écran) : sur les 14 rubriques, masquage du sur-titre « EXPLORER MAJESTIOS · RUBRIQUE » ; masquage des cartes récapitulatives « Votre parcours » qui répètent le titre (seulement celles sans identifiant ni formulaire : les cartes d’annonces et de dépôt restent affichées) ; sur les pages qui ont un moteur de recherche, masquage du bloc d'ambiance « Entrez dans votre espace… » ; sur Prospection, l'en-tête du moteur (sur-titre, titre, phrase) devient invisible mais reste lu par les lecteurs d'écran. Résultat : le moteur de recherche apparaît juste sous le titre de la page.
- Les pages sans moteur (Réseau, Salons, Suivi commercial, etc.) gardent leur bloc d'espace immersif.
- Retour en arrière : supprimer le bloc « Moins de répétitions dans les pages internes » et la dernière règle `.floating-route-card` de `charte-majestios.css`.

## Fond d'écran aléatoire des rubriques (2026-11-16, 12 h 30)

- Demande du propriétaire (option « un fond différent à chaque ouverture de page »). Nouveau fichier `fond-aleatoire.js`, chargé dans le `<head>` des 14 rubriques : il tire au hasard l'un des 14 fonds de `visuels/fonds/` (jamais deux fois de suite dans la même session de navigation) et remplace l'image par défaut avant l'affichage ; l'image par défaut n'est pas téléchargée (une seule image chargée par page, vérifié).
- Police : le script indique si l'image tirée est claire (Réseau, Veille des marchés) ; la page passe alors au texte sombre à contour blanc (`html[data-ton="clair"]`), sinon texte blanc à contour sombre. Si une image est remplacée ou ajoutée, mettre à jour la liste `fonds` et la liste `clairs` du script.
- Sans JavaScript, la page garde l'image fixe prévue dans `fonds-harmonises.css`. L'accueil n'est pas concerné.
- Retour en arrière : retirer la balise `<script src="fond-aleatoire.js">` des 14 pages (et le fichier du manifeste `site-files.json`).

## Nouveaux fonds ajoutés (2026-11-16)
Quatre images du propriétaire (back13, 14, 15, 16) ajoutées au tirage aléatoire : ville-crepuscule, falaise-phare, montagnes-aurore, salle-conseil-panorama (1920 px, WebP). Non retenues : back17 (texte « RIVERSIDE TOWER » incrusté), back18 et back19 (doublons basse résolution de back16/back17). Retour arrière : retirer ces 4 noms de `fond-aleatoire.js` et de `site-files.json`.

## Harmonisation des fonds (2026-11-16)
Luminosité des fonds uniformisée (zone de texte ramenée vers ~0,44 par une correction douce de type gamma ; images déjà sombres inchangées ; réseau-synergies un peu plus lumineuse pour garder du détail). Le mode « texte sombre » n'est plus utilisé (`clairs` vide dans `fond-aleatoire.js`) : police blanche et liens dorés identiques sur toutes les rubriques. Liens contrôlés : 43 pages, 90 liens locaux distincts, aucun cassé (l'ancre `#creation` est gérée par script). Retour arrière : restaurer les anciens WebP depuis l'historique Git.

## Espaces personnels et pages associées (2026-11-16)
Fond aléatoire et texte d'en-tête blanc/doré étendus à : espace-membre, contact, nous-rejoindre, 7 pages categorie-*. Formulaires et panneau de connexion gardent leur fond crème (lisibilité). Inchangées : pages d'administration (fond sombre), CRM, assistant, pages légales, FAQ, résultats de recherche. Retour arrière : retirer `data-fond` et le script `fond-aleatoire.js` de ces pages et supprimer le bloc « Espaces personnels… » de `charte-majestios.css`.

## Page d'invitation : session d'un autre compte (2026-11-16)
Constat : un lien d'invitation ouvert dans un navigateur déjà connecté avec une autre adresse affichait « Aucune invitation valide… » (l'acceptation se fait pour le compte connecté). `accepter-invitation.js` explique maintenant la situation (adresse connectée) et propose « Me déconnecter et utiliser l'adresse invitée ». Aucune modification de la base.

## Annonces gratuites : espace personnel obligatoire, types élargis (2026-11-16)
Décision propriétaire documentée dans la spécification des annonces (§7). Appliqué sur MajestiOS-Test (migration `announcements_require_account_and_kinds`) : dépôt refusé aux visiteurs (droit retiré à `anon`, vérifié), accepté pour un compte confirmé rattaché à une organisation (essai annulé, 0 annonce restante) ; 8 types d'annonces. Site : formulaire masqué sans session avec invitation à créer son espace ; e-mail de contact pris sur le compte ; libellés mis à jour (liste publique, relecture, filtres). Non fait : page dédiée « Annonces » avant les appels d'offres, avis d'information juridique à adapter, scénarios SQL à rejouer en version connectée.

## Page « Appels d'offres privés » : message signature (2026-11-16)
Le nom « Appels d'offres privés » est **conservé** (aucun renommage). Message ajouté sous le titre, voulu par le propriétaire : « Chez MajestiOS, les appels d'offres privés n'ont de privés que le nom. » (les annonces y sont visibles de tous). Distinction de vocabulaire à respecter : appel d'offres **public** = procédure formelle d'un acheteur public (code de la commande publique, publicité officielle) ; appel d'offres **privé** MajestiOS = annonces publiées par les membres, visibles publiquement après relecture. Retour arrière : supprimer la ligne `.mj-signature` de `marches-prives.html` et le bloc CSS associé.

## Parcours client : un seul espace personnel pour quatre portes d'entrée (décision propriétaire, 2026-11-16)
Chaque rubrique est une porte d'entrée qui mène à la **création d'un espace personnel**, puis à une action :
1. Appels d'offres publics → espace personnel → accompagnement aux appels d'offres ;
2. Appels d'offres privés (annonces ; nom conservé, message « n'ont de privés que le nom ») → espace personnel → publication d'annonces ;
3. Réputation virtuelle → espace personnel → audit ;
4. Prospection → espace personnel → achat de fichiers de missions de prospection.

**Règle :** l'espace personnel est **unique**. Quelle que soit la porte d'entrée, son titulaire doit pouvoir bénéficier des trois autres services (par exemple, qui a créé son espace pour publier une annonce peut demander un audit de réputation, se faire accompagner sur un appel d'offres ou acheter des fichiers de prospection).

**État au 2026-11-16 (Test) :** publication d'annonces → exige déjà un espace personnel (fait) ; audit de réputation → testé, via compte, 5 audits/jour/utilisateur ; accompagnement aux appels d'offres → page présente, accès par l'espace non branché ; achat de fichiers → **n'existe pas** (ni paiement, ni catalogue ; validation juridique à la charge du propriétaire). Aucune modification du site faite pour cette décision : à planifier rubrique par rubrique sur décision du propriétaire.

## « Mes services » dans l'espace personnel (2026-11-16)
Section `#mes-services` ajoutée à `espace-membre.html`, présentée comme le tableau de bord administrateur (panneaux sombres, kickers dorés, index 01–04, lien en pied de carte). Quatre services, un seul compte : 01 Annonces (→ `sous-traitance.html#deposer`), 02 Audit de réputation (→ `reputation-virtuelle.html`), 03 Accompagnement aux appels d'offres (→ `accompagnement-appels-offres.html`), 04 Fichiers de prospection (« Bientôt disponible », aucun achat n'existe). Chaque service applique lui-même son contrôle d'accès (le formulaire d'annonces exige déjà le compte). Les anciennes cartes d'objectifs produit restent dessous. Retour arrière : supprimer la section et le bloc CSS « Mes services ».

## Retour vers le service après création de l'espace (2026-11-16)
Depuis le dépôt d'annonces, « Créer mon espace personnel » / « Me connecter » ouvrent `espace-membre.html?retour=annonces`. Une fois l'espace activé (ou la connexion réussie avec un espace existant), la personne est ramenée à `sous-traitance.html#deposer` après un message de 1,2 s. La clé survit au lien reçu par e-mail dans le même navigateur (stockage de session). Seules des clés connues sont acceptées (`retour-service.mjs` : annonces, audit, accompagnement) : aucune adresse libre, donc pas de redirection ouverte. Tests : `tests/retour-service.test.mjs` (ajouté à la CI) et scénario 5 de `espace-membre-creation.browser.cjs`. Non fait : les portes « audit » et « accompagnement » n'utilisent pas encore ce retour (clés prêtes).

## 2026-11-18 — Bandeau défilant des annonces + cartes translucides

Demande du propriétaire : les annonces publiées apparaissent aussi dans un bandeau défilant au-dessus de la barre de navigation, et les cartes d'annonce ont un fond légèrement coloré et transparent.

- `bandeau-annonces.mjs` / `bandeau-annonces.css` : lit `list_published_announcements` (10 dernières), affiche le bandeau « ANNONCES » avant `.site-header`. Cache 5 min (sessionStorage `mj-bandeau`). Silencieux si échec ou aucune annonce.
- Chargé par `navigation-tiroirs.js` (import dynamique). Non affiché sur administration / CRM / invitation.
- Le bandeau de démonstration de l'accueil est masqué dès qu'il y a de vraies annonces.
- Cartes : bloc « annonce-card » en fin de `charte-majestios.css` (dégradé doré/bleu translucide, flou, texte blanc, bouton « Demander une mise en relation » lisible).
- Test : `tests/bandeau-annonces.test.mjs` (ajouté à la CI).
- **Retour arrière** : supprimer la ligne `import("./annonces-config.mjs")…` dans `navigation-tiroirs.js`, supprimer `bandeau-annonces.*` (et leurs entrées dans `site-files.json`), retirer les deux blocs « annonce-card » de `charte-majestios.css`, puis `node build.js`.

### 2026-11-18 (suite) — Flux de démonstration de l'accueil
Le premier bandeau (flux de démonstration) restait visible car une règle CSS d'affichage l'emportait sur l'attribut « hidden ». Correctif : règle `.homepage-ticker[hidden]{display:none}` dans `bandeau-annonces.css`. Retour arrière : supprimer cette règle.

### 2026-11-18 (suite 2) — CRM : retour au tableau de bord administrateur
Constat du propriétaire : depuis l'administration, on ouvre le CRM mais on ne peut pas revenir au tableau de bord. Cause : la barre `.admin-crm-header` de `crm.html` n'avait aucune mise en forme (les liens apparaissaient comme du texte brut sur le fond). Correctif : mise en forme de la barre dans `crm-workspace.css`, bouton doré « ← Tableau de bord administrateur » (visible pour les rôles propriétaire/administrateur, comme avant), « Accueil interne » et « Recherches ciblées ». Retour arrière : retirer le bloc « Barre de navigation interne du CRM » de `crm-workspace.css` et remettre le libellé « Administration générale ».

### 2026-11-18 (suite 3) — Indicateurs CRM cliquables
Constat (conversation avec Cheexpeer) : « pourquoi je ne peux pas accéder à mes contacts (4) ». Sur le tableau de bord administrateur, les indicateurs « Entreprises / Contacts / Opportunités CRM » n'étaient pas cliquables, et le CRM s'ouvrait sur « Vue générale » avec les listes masquées. Correctif : les trois indicateurs deviennent des liens vers `crm.html#businesses|contacts|opportunities` ; `crm-workspace-nav.js` ouvre directement l'onglet indiqué par l'ancre ; ids ajoutés sur les trois cartes de `crm.html` ; style dans `administration.css`. Retour arrière : remettre `<article class="instrument">` dans `administration.html`, retirer les 2 lignes `wanted` de `crm-workspace-nav.js`, les ids et le bloc CSS.

### 2026-11-18 (suite 4) — Équipe interne : rôles et retraits depuis l'administration
Demande du propriétaire : attribuer les rôles et supprimer qui il veut, depuis l'espace admin (et non par Claude).
- Migration `supabase/migrations/20261118140000_internal_team_management.sql` (appliquée sur Test seulement) : `list_internal_team`, `set_internal_member_role`, `remove_internal_member`, journal `private.team_events`. Règles côté serveur : seul un propriétaire modifie ou retire ; jamais sur soi-même ; il reste toujours un propriétaire ; l'administrateur ne peut que consulter ; anonyme refusé ; retrait = appartenance supprimée, compte conservé.
- Page `admin-utilisateurs.html` (section « Membres de l'équipe », ancre `#equipe`) ; lien depuis le tableau de bord (« Gérer l'équipe : rôles et retraits »).
- Test navigateur : scénario 6 de `tests/admin-utilisateurs.browser.cjs`. Contrôle serveur réel sur Test : admin, soi-même et anonyme refusés.
- Retour arrière : retirer la section « équipe » de la page et du JS, remettre l'ancien lien « À construire » ; côté base : `drop function public.list_internal_team(); drop function public.set_internal_member_role(uuid,text); drop function public.remove_internal_member(uuid);` (le journal peut rester).
- À reporter sur la base de production seulement après décision explicite du propriétaire.

### 2026-11-18 (suite 5) — Publication directe d'une annonce par le propriétaire
Demande du propriétaire : republier lui-même une annonce d'une entreprise (par ex. vue sur LinkedIn), sans mention ni justificatif d'accord (la reprise implique l'accord).
- Page « Relecture des annonces » : bloc « ＋ Publier une annonce » (mêmes champs que le dépôt ; en plus, facultatifs : nom de l'entreprise affiché, lien d'origine visible par le seul propriétaire). Publication immédiate, visible dans la liste (ligne « Entreprise : … ») et dans le bandeau.
- Migration `supabase/migrations/20261118170000_admin_publish_announcement.sql` (Test seulement) : `publish_announcement_admin` (réservée au propriétaire), table privée `announcement_sources`, `list_published_announcements` renvoie en plus `company`. Mises en relation : adresse du propriétaire, rien n'est affiché publiquement.
- Tests : `tests/annonces-admin-publication.test.mjs` (CI), scénario ajouté à `tests/annonces-moderation.browser.cjs` ; contrôle serveur sur Test (publication visible, anonyme refusé, annulé ensuite).
- Retour arrière : retirer le bloc `#mod-publish` de la page et du JS, `drop function public.publish_announcement_admin(...)`, recréer l'ancienne `list_published_announcements` sans `company`.

## Suite 6 — 2026-11-18 : résultats des appels d'offres publics à nouveau visibles

Problème : sur les pages « categorie-* » les annonces des appels d'offres publics (BOAMP) n'apparaissaient pas.
Cause : une règle de mise en page (commit 5320ae6) masquait les blocs « floating-route-card » jugés redondants ; elle masquait aussi le bloc des résultats. Une fois visible, le texte était blanc sur fond crème (illisible).
Correction (charte-majestios.css) : la règle de masquage exclut désormais les blocs de résultats ; les textes du panneau de résultats sont forcés en couleur sombre.
Test ajouté : tests/resultats-categorie.browser.cjs (visibilité + lisibilité sur les pages de catégorie), ajouté à la CI.
Retour arrière : annuler le commit de cette étape (charte-majestios.css seul, aucune donnée touchée).

## Suite 7 — 2026-11-20 : connexion par le lien du courrier, plus de blocage

Constat (essai du propriétaire) : le lien reçu par e-mail connecte bien (journal Supabase : « Login »), mais la page restait sur « Compte connecté · espace personnel à finaliser », sans action possible, avec le bouton « Se déconnecter » affiché en plusieurs exemplaires. Aucun code dans le courrier : le modèle d'e-mail Supabase par défaut ne contient que le lien.
Correction (auth-espace-membre.js) : un compte connecté sans espace voit s'ouvrir son activation (encadré « Activer mon espace » et étape du mot de passe) ; l'arrivée par le lien mène directement à la création du mot de passe, même sans consentement mémorisé ; un seul bouton « Se déconnecter ». Tests : espace-membre-creation.browser.cjs (scénarios 3 ter et lien direct).
Reste à faire par le propriétaire dans Supabase Test (Authentication → Email Templates, modèles « Magic Link » et « Confirm signup ») : ajouter `{{ .Token }}` pour que le code à 6 chiffres figure dans le courrier ; vérifier que l'adresse du site de test figure dans Redirect URLs.
Retour arrière : annuler le commit de cette étape (auth-espace-membre.js et tests).

## Suite 8 — 2026-11-20 : lien du courrier renvoyé vers une autre page

Constat : après le clic sur le lien du courrier, la personne se retrouvait sur le formulaire qui redemandait un code. Le journal Supabase montre que le lien renvoyait vers la page d'accueil et non vers l'espace membre (adresse de retour `espace-membre.html` non autorisée dans « Redirect URLs », Supabase se rabat alors sur « Site URL »).
Correction (navigation-tiroirs.js, chargé par toutes les pages) : si une page reçoit la clé de connexion du lien, elle renvoie vers `espace-membre.html` en la conservant ; la page reprend alors l'activation (mot de passe). Test ajouté dans espace-membre-creation.browser.cjs.
Côté Supabase Test (propriétaire) : ajouter l'adresse du site de test suivie de `/**` dans Authentication → URL Configuration → Redirect URLs.
Retour arrière : annuler le commit de cette étape.

## Suite 9 — 2026-11-20 : boucle « recevoir un code » après le lien, limite d'envoi d'e-mails

Constat (journaux Supabase Test) : (1) la demande de lien indique bien l'adresse de retour `espace-membre.html` (la liste « Redirect URLs » est correcte) ; (2) une personne déjà connectée dont l'espace restait à activer retrouvait, en ouvrant le formulaire, la demande de code ; (3) la dernière demande d'e-mail a été refusée par Supabase : `over_email_send_rate_limit` (429) — l'envoi d'e-mails intégré est limité à quelques messages par heure.
Correction (auth-espace-membre.js) : ouvrir le formulaire d'une personne connectée à activer mène directement à la création du mot de passe, sans nouveau code ; un message clair s'affiche quand la limite d'envoi est atteinte. Test : espace-membre-creation.browser.cjs.
Côté propriétaire : éviter de redemander des e-mails en rafale ; pour des essais répétés, configurer un expéditeur dédié (SMTP personnalisé) dans Supabase.
Retour arrière : annuler le commit de cette étape.
