# MajestiOS — site public (prototype)

Site vitrine statique en français pour présenter MajestiOS comme une plateforme d’intelligence économique opérationnelle B2B. Le parcours public met au premier plan deux intentions d’acquisition liées aux appels d’offres :

- une organisation souhaite présenter un AO et demander un accompagnement pour y répondre ;
- une entreprise souhaite exprimer son intérêt à recevoir des AO correspondant à son activité.

Les appels d’offres sont présentés comme une source de signaux parmi d’autres, et non comme l’unique finalité de MajestiOS. Le site conserve aussi des chemins distincts pour les visiteurs qui découvrent la plateforme et les clients existants.

## Démarrer

Aucune installation ni aucun backend ne sont requis. Ouvrez `index.html` dans un navigateur. Pour servir les fichiers localement, exécutez `python -m http.server 8000` dans ce dossier puis ouvrez `http://localhost:8000`.

## Parcours de démonstration

- Les liens d’acquisition sélectionnent l’intention correspondante dans le formulaire : accompagnement pour répondre à un AO ou réception souhaitée d’AO.
- Le formulaire vérifie les champs obligatoires et affiche un aperçu du parcours. Il n’envoie, ne stocke et ne transmet aucune donnée.
- Le lien client explique que l’authentification et le portail ne sont pas configurés.
- Les exemples de signaux sont illustratifs ; aucun AO réel n’est publié et aucune alerte n’est diffusée.

## Limites et statut

Les PDF fournis (Doctrine MAJ-00, Vision & Stratégie MAJ-T1, Fonctionnel MAJ-T2, Parcours MAJ-T3, document stratégique et guide de lecture) indiquent que le référentiel est une proposition en attente de validation. Les offres, le Coach et le Double Dossier AO décrits ne sont donc pas présentés comme des services opérationnels ou approuvés. Le cahier des charges précise également que les tarifs, engagements, aspects juridiques et conformité sont hors du corpus.

Avant toute collecte réelle de prospects, il faudra définir et implémenter un traitement sécurisé du formulaire, son destinataire, les règles de conservation et les mentions appropriées. Avant toute diffusion d’AO, il faudra connecter et vérifier les sources ainsi que les règles de publication et d’envoi. Aucun backend, compte client, connecteur, envoi externe ou statut de conformité n’est implémenté ou revendiqué ici.
