# Cheexpeer — état consolidé au 25/11/2026

Document de référence pour reprendre le travail sans reposer les questions déjà traitées.

## 1. Ce qui fonctionne (validé par le propriétaire le 25/11)
- **Page Cheexpeer** (`admin-cheexpeer.html`) : une seule zone, trois entrées : *Annonce* (numéro d'avis), *Marché attribué*, *Métier + département*. Un formulaire, un bouton, un résultat. Le test « Vérifier que Cheexpeer répond » est rangé en bas.
- **Un clic enchaîne tout** : demande → accord → exécution → lecture. Le clic du propriétaire vaut décision (trace : « Lancé d'un clic par un administrateur »). Ensuite les fiches contacts (dirigeants, téléphones, e-mails, site) sont lancées automatiquement.
- **Note /20 toujours calculée** (même sans lieu de chantier) et affichée en première colonne, meilleures en haut, présente aussi dans le fichier téléchargé (Excel / Google Sheets). Sans chantier connu, la proximité compte 2 points si même département, 1 si même région. Méthode : `supabase/functions/_shared/mission-score-core.mjs` (seuils provisoires).
- **Métier choisi par son nom** dans une liste de 18 métiers ; le code NAF se remplit seul.
- **Majestios Bot** : bulle flottante (compacte), lecture seule.
- Style en onglets colorés commun à Cheexpeer, CRM interne et Recherches ciblées.

## 2. Mis en production (Supabase `qxaghcifdhugfskuscoc`)
- `cheexpeer-mission-run` version 3 : note toujours calculée. Retour arrière possible (version précédente, bundle conservé hors dépôt).
- Autres fonctions Cheexpeer inchangées. Liste d'origines autorisées alignée dans le code (`cheexpeer-api.mjs`) : majestios.com, www.majestios.com, majestios.vercel.app, branches evolution-10 et evolution-12.
- `cheexpeer-chat` (Majestios Bot) : pas republié en production.

## 3. Limites connues (normales, pas des erreurs)
- Téléphone : lu sur Google Maps ; e-mail : lu sur le site de l'entreprise s'il le publie. Mesure du 25/11 sur 30 entreprises : téléphones 25–26, e-mails 8–15, sites 17–21. « non trouvé » = rien trouvé, rien n'est inventé.
- Le serveur d'analyse ne peut pas être testé depuis l'environnement de Claude (réseau fermé) : l'essai réel se fait depuis la page.
- Outils `analyse_marche` et `opportunite_attribution` désactivés dans le registre de production (à activer sur décision du propriétaire).

## 4. Vérifications
- 207 tests de logique + tests navigateur (dont `admin-cheexpeer` et `admin-cheexpeer-chaine`) : tous passent.
- Déploiement preview : branche `evolution-12`, commit `3f3b8ca`, état READY.

## 5. Reste à décider (par le propriétaire)
- Saisie libre d'un métier (« plombier ») en plus de la liste ?
- Envoi des entreprises retenues vers le CRM (brouillons de prospection, nettoyage CRM : en attente).
- Passage de la branche d'essai vers `main` : sur décision du propriétaire uniquement.
