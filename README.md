# MajestiOS — site public (prototype)

Site vitrine statique en français pour présenter MajestiOS aux visiteurs, prospects et clients. Le parcours public met en avant la prospection inversée et les opportunités commerciales, sans exposer le détail des documents de conception ni la feuille de route du produit.

## Parcours du site

- La page d’accueil présente la promesse et les bénéfices pour l’entreprise.
- Les rubriques Partenaires, Développement commercial, Devis et facturation, Prospection et secrétariat, et Business ouvrent un parcours de contact général.
- Le fil d’appels d’offres et la démonstration interactive utilisent uniquement des exemples fictifs. La démonstration détaillée est facultative et repliée par défaut.
- Les visiteurs peuvent découvrir MajestiOS, les prospects présenter un projet ou un besoin, et les clients contacter leur interlocuteur via le parcours général.
- Le formulaire permet de prévisualiser trois intentions : accompagnement pour répondre à un AO, réception d’AO selon son activité, ou demande générale. Aucune demande n’est envoyée ou enregistrée.

Le cahier des charges et les documents stratégiques servent de référence interne à la conception. Ils ne sont pas reproduits dans le contenu public : la vitrine explique l’intérêt pour le client, sans lui demander de connaître le fonctionnement détaillé du produit.

## Démarrer

Aucune installation ni aucun backend ne sont requis. Ouvrez `index.html` dans un navigateur. Pour servir les fichiers localement, exécutez `python -m http.server 8000` dans ce dossier puis ouvrez `http://localhost:8000`.

## Déploiement Vercel

Vercel exécute `node build.js`, qui place les trois fichiers du site dans `dist`, le répertoire publié. Le projet est configuré sans framework ni dépendance applicative.

## Limites du prototype

Le fil et les scénarios de démonstration sont fictifs. Le formulaire ne transmet rien. Aucun backend, compte ou portail client, connecteur de données, envoi externe ou service de facturation n’est implémenté. Les documents de spécification guident le positionnement, mais leur mention d’un module ou d’un parcours ne signifie pas que celui-ci est déjà opérationnel.
