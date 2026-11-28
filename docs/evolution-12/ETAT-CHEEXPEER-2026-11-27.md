# Cheexpeer — état consolidé au 27/11/2026

Document de référence pour reprendre le travail sans reposer les questions déjà traitées.

## 1. Ce qui fonctionne (validé par le propriétaire le 25/11)
- **Page Cheexpeer** (`admin-cheexpeer.html`) : une seule zone, trois entrées : *Annonce* (numéro d'avis), *Marché attribué*, *Métier + département*. Un formulaire, un bouton, un résultat. Le test « Vérifier que Cheexpeer répond » est rangé en bas.
- **Un clic enchaîne tout** : demande → accord → exécution → lecture. Le clic du propriétaire vaut décision (trace : « Lancé d'un clic par un administrateur »). Ensuite les fiches contacts (dirigeants, téléphones, e-mails, site) sont lancées automatiquement.
- **Note /20 toujours calculée** (même sans lieu de chantier) et affichée en première colonne, meilleures en haut, présente aussi dans le fichier téléchargé (Excel / Google Sheets). Sans chantier connu, la proximité compte 2 points si même département, 1 si même région. Méthode : `supabase/functions/_shared/mission-score-core.mjs` (seuils provisoires).
- **Métier choisi par son nom** dans une liste de 18 métiers ; le code NAF se remplit seul.
- **Majestios Bot** : bulle flottante (compacte), lecture seule.
- Style en onglets colorés commun à Cheexpeer, CRM interne et Recherches ciblées.

### Ajouts du 27/11/2026
- **Détail de la note** : un clic sur une note /20 affiche les critères (métier, qualifications, références, situation financière, capacité sur le chantier, proximité) avec points et statut. Le serveur envoie ce détail sous forme compacte `[points, état]` (états : c confirmé, p en partie, n non prouvé, x contradictoire, a non applicable).
- **Présélection** : bouton « Télécharger la présélection (10 meilleures) » après la liste (notes + dirigeants, téléphones, e-mails).
- **Mes chantiers à reprendre** (premier onglet) : pour une entreprise qui cherche des chantiers en sous-traitance. Un seul renseignement : le SIREN. Cheexpeer lit métier (NAF), département et effectif dans l'annuaire officiel, cherche les marchés attribués des 12 derniers mois (fonction existante `list_awarded_contracts`, aucun changement de base), puis note chaque chantier /20 : métier (5), proximité (5 : même département / 3 : même région / 1 : hors région), taille du marché par salarié (5), sous-traitance déjà déclarée (3), fraîcheur (2). Critères non évaluables exclus du calcul. Zone au choix : région (par défaut) ou département. Le bouton « Analyser » lance la recherche existante (gagnant, entreprises voisines, contacts). Code : `cheexpeer-command.mjs` (`noteChantier`, `classerChantiers`), test navigateur `admin-cheexpeer-chantiers`.
- 18 métiers pris en charge (liste `METIERS_CHANTIER`).
- **Alertes** : bouton « Me prévenir des nouveaux chantiers » : crée jusqu'à 2 alertes (une par mot-clé du métier, dans le département de l'entreprise) dans la table existante `contract_alerts` (5 alertes max par membre, droits par membre, aucun changement de base). La liste « Mes alertes » indique les nouveaux chantiers depuis la dernière consultation (Voir / Marquer comme vu / Supprimer). Les alertes se consultent à l'ouverture de la page ; **aucun e-mail n'est envoyé** (à décider).
- Limite : note provisoire ; les appels d'offres privés ne sont pas dans les données.

### Veille concurrence (27/11/2026)
Aucun concurrent identifié ne note des entreprises pour la sous-traitance après attribution. Tendios : évaluation d'offres pour acheteurs ; Saqara (Chantier Privé), BTP Connect : appels d'offres privés ; Remporte : analyse de DCE avec score. Pistes retenues pour les appels d'offres : présélection, chances de réussite, alertes métier + département, résumé d'annonce, équipes de groupement. Décision du propriétaire : l'utilisateur cible est l'entreprise qui cherche des chantiers en sous-traitance.

## 2. Mis en production (Supabase `qxaghcifdhugfskuscoc`)
- `cheexpeer-mission-run` version 3 : note toujours calculée. Retour arrière possible (version précédente, bundle conservé hors dépôt).
- Autres fonctions Cheexpeer inchangées. Liste d'origines autorisées alignée dans le code (`cheexpeer-api.mjs`) : majestios.com, www.majestios.com, majestios.vercel.app, branches evolution-10 et evolution-12.
- `cheexpeer-chat` (Majestios Bot) : pas republié en production.

## 3. Limites connues (normales, pas des erreurs)
- Téléphone : lu sur Google Maps ; e-mail : lu sur le site de l'entreprise s'il le publie. Mesure du 25/11 sur 30 entreprises : téléphones 25–26, e-mails 8–15, sites 17–21. « non trouvé » = rien trouvé, rien n'est inventé.
- Le serveur d'analyse ne peut pas être testé depuis l'environnement de Claude (réseau fermé) : l'essai réel se fait depuis la page.
- Outils `analyse_marche` et `opportunite_attribution` désactivés dans le registre de production (à activer sur décision du propriétaire).

## 4. Vérifications
- 209 tests de logique + tests navigateur (dont `admin-cheexpeer` et `admin-cheexpeer-chaine`) : tous passent.
- Déploiement preview : branche `evolution-12`, commit `1687bbc`, état READY. `cheexpeer-mission-run` version 4 en production.

## 5. Reste à décider (par le propriétaire)
- Saisie libre d'un métier (« plombier ») en plus de la liste ?
- Envoi des alertes par e-mail (nécessite un expéditeur et l'accord du propriétaire).
- Envoi des entreprises retenues vers le CRM (brouillons de prospection, nettoyage CRM : en attente).
- Passage de la branche d'essai vers `main` : sur décision du propriétaire uniquement.


## Accueil : démonstration en un champ
- Page d'accueil (index.html) : section « Essayez, c'est gratuit » (demo-chantiers.mjs/.css). Le visiteur saisit un SIREN, sans inscription ; le site lit métier et département (annuaire des entreprises) et affiche les 3 meilleurs chantiers notés avec le détail de la note, puis invite à créer l'espace. Rien n'est enregistré.
- Test : tests/demo-chantiers.browser.cjs (branché dans la CI).
- Démo d'accueil, mise à jour 28/11 : le champ accepte un SIREN, ou un métier (mots libres ou code NAF/APE) avec un département. Si l'activité d'un SIREN n'est pas dans la liste (METIERS_CHANTIER, 25 activités dont 33.20A–D), un champ « votre métier » apparaît. Phrase claire et 3 étapes ajoutées au-dessus de la démo.
- 28/11 : le moteur de recherche d'appels d'offres a été retiré de la page d'accueil (il reste dans les rubriques Marchés publics, Marchés privés, etc.). Les liens « Modifier les critères » et le retour des résultats pointent vers marches-publics.html / marches-prives.html. La démo d'accueil est compacte et translucide.
- 28/11 : cube d'accueil centré (la colonne de l'ancien moteur est supprimée), une couleur par rubrique, face du dessus = logo + phrase, face du dessous = explication du concept.
