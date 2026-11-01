# Chantier prioritaire — recherche, données, dossiers et garde-fous MajestiOS

Version : 2026-11-01
Branche de travail : `chantier-recherche-donnees-gardes-fous-2026-11-01`
Référence de départ : commit validé de la zone `d21d4d8f7e72c70688d72b0e180d56a5bf59c0df`
Statut : audit initial réalisé ; corrections progressives à valider. Aucune publication en production n'est autorisée par ce document.

## 1. Principes de conduite

1. Travailler par lots limités, isolés et réversibles.
2. Une branche de chantier part de la version de référence validée ; la zone industrielle ne doit pas être refondue dans ce chantier.
3. Aucune fusion vers `main`, aucun déploiement de production et aucune activation de collecte ou de campagne externe sans autorisation distincte.
4. Une fonctionnalité n'est déclarée opérationnelle qu'après test réel adapté. La présence d'un formulaire ou d'un script n'est pas une preuve.
5. Ne jamais présenter une donnée d'exemple comme une annonce réelle ; toute donnée publiée conserve sa provenance.
6. Ne jamais confondre un fait de la source, une transformation automatique, une hypothèse commerciale et une décision humaine.
7. Toute modification doit passer les contrôles de syntaxe, de build, de liens et les tests fonctionnels concernés.

## 2. Audit initial — constats vérifiables

- Le dépôt possède un moteur partagé `opportunity-search.js`, une page générale `resultats-recherche.html`, huit pages de catégories, un catalogue de rubriques et un schéma JSON d'opportunité.
- Les tests existants prévoient une vérification statique, des tests de disponibilité des sources BOAMP/BODACC et un test navigateur avec réponses simulées.
- La recherche publique interroge BOAMP ; la recherche privée interroge le jeu OpenDataSoft des annonces commerciales BODACC. Ces résultats ne doivent jamais être fusionnés sans indiquer clairement leur nature et leur source.
- Le filtre de région est déjà envoyé par le formulaire public, mais le chemin BOAMP ne l'appliquait pas à la requête ni aux résultats. Les valeurs de zones « Nord/Ouest/Sud — exemple » ne correspondent pas à des régions administratives réelles.
- Plusieurs rubriques métiers décrivent encore des parcours envisagés sans moteur de recherche local intégré. BrainOS et le CRM affichent explicitement un périmètre futur, pas un service connecté.
- Le modèle prévoit provenance, identifiants, dates et statuts ; il reste à construire la persistance serveur, le contrôle qualité, la déduplication et la file interne de qualification.

## 3. Segmentation des lots

### Lot 0 — sécurité et gouvernance
- Référence de code et branche de chantier.
- Checklist anti-régression, critères d'acceptation et limites de déploiement.
- Inventaire des tests et des fonctions réellement connectées.

### Lot 1 — moteurs de recherche
- Accueil : recherche transversale, critères compatibles avec les sources.
- Marchés publics : recherche BOAMP, filtres cohérents, échéances et lien officiel.
- Marchés privés / veille BODACC : recherche de signaux légaux, distincte des appels d'offres.
- Pages de catégories : critères transmis, source réellement interrogée, états chargement/résultats/vide/erreur.
- Développement commercial, prospection inversée et veille : définir pour chacune si elle recherche des opportunités, des entreprises, des dossiers documentaires ou des données CRM. Ne pas dupliquer le même formulaire sans sémantique claire.
- Salon virtuel : recherche d'exposants et d'activités uniquement lorsque le catalogue d'exposants existe.

### Lot 2 — chaîne de données
Collecter → conserver la provenance → normaliser → valider les champs → dédupliquer → classer le statut → qualifier → rapprocher avec un profil d'entreprise autorisé → soumettre à validation humaine → publier / retirer → historiser les changements.

Chaque source doit exposer un état distinct : opérationnelle, retardée, en erreur ou non configurée. Les données incomplètes ou à échéance inconnue ne doivent pas être présentées comme pleinement vérifiées.

### Lot 3 — contenu des dossiers
Chaque dossier doit contenir, selon son objet : présentation utile, moteur pertinent, critères, résultats ou état d'indisponibilité, explication de la provenance, méthode de qualification, actions disponibles avec leur état réel, ressources et liens internes cohérents.

### Lot 4 — fondations futures
- Personnalisation des pages : préférences de l'utilisateur, configuration versionnée, valeurs par défaut sûres, validation des entrées et possibilité de revenir à une configuration standard.
- Formulaires : validation client ET serveur, champs minimaux, états de soumission explicites, protection anti-abus, consentements pertinents et aucun faux message de confirmation.
- Outils d'analyse : indicateurs calculés sur des données traçables, définition documentée des métriques, date de calcul, limites et possibilité d'audit.
- CRM : entreprises, contacts, opportunités, tâches, interactions et pipeline ; isolation par compte, rôles et autorisations côté serveur ; journal d'audit ; politique de conservation et gestion des demandes d'opposition/suppression selon les règles applicables.
- Backend et base : décider à partir de l'architecture validée ; ne pas ajouter de stockage persistant au navigateur pour des données client sensibles ou partagées.

## 4. Garde-fous anti-régression

Avant chaque lot :
- relever la branche, le commit de départ et la liste exacte des fichiers touchés ;
- vérifier que la zone et son fichier de configuration restent inchangés sauf nécessité explicitement validée ;
- préciser les critères d'acceptation et les scénarios de test.

À chaque lot :
- `node --check` pour chaque script modifié ;
- `node build.js` ;
- `node verify-site.js` ;
- tests navigateur des parcours concernés ;
- tests de réponse vide, erreur HTTP, données malformées, doublons, échéance passée/manquante, filtre combiné et liens officiels ;
- vérifier qu'aucune action externe (email, candidature, campagne) n'est déclenchée automatiquement.

Avant fusion :
- comparer le diff avec la branche cible réelle ;
- confirmer les checks verts et examiner les fichiers générés/manifestes ;
- vérifier les parcours mobiles et l'accessibilité des libellés/états ;
- demander validation explicite pour toute fusion et, séparément, pour la production.

## 5. Échéances de pilotage

Les échéances sont des jalons de chantier, pas des promesses de livraison irréalistes :
- J0 — audit initial, segmentation, branche et garde-fous.
- J1 — correction des écarts critiques des moteurs existants et tests de régression.
- J2 — matrice des moteurs par rubrique et harmonisation des formulaires.
- J3 — contrat de données, qualité, statuts, déduplication et file de qualification spécifiés.
- J4 — priorisation des contenus de dossiers et maquettes fonctionnelles.
- J5 — architecture cible des formulaires, de la personnalisation, des analyses et du CRM.
- À chaque jalon : bilan, écarts, risques, fichiers modifiés, tests exécutés et décision de poursuivre / corriger / revenir en arrière.

Ne pas annoncer un lot « terminé » tant que les tests prévus n'ont pas été exécutés et que les fonctions dépendantes ne sont pas vérifiées.

## 6. Ordre de priorité fonctionnel

P0 : fiabilité de la recherche BOAMP/BODACC, provenance, filtres annoncés, états d'erreur, absence de résultats fictifs.
P1 : recherche présente et cohérente dans les principales rubriques qui disposent réellement d'un corpus.
P2 : traitement serveur, normalisation, déduplication, statuts, journalisation et persistance.
P3 : dossiers métier enrichis et processus interne de qualification.
P4 : personnalisation, formulaires robustes, analyses et CRM.
P5 : enrichissements immersifs de la zone industrielle, après stabilisation du reste du site.

## 7. Critère de réussite

MajestiOS doit permettre de rechercher, comprendre, qualifier et suivre des informations dont la provenance et l'état sont explicites. L'interface ne doit jamais laisser croire qu'une recherche est connectée, qu'une donnée est vérifiée, qu'un formulaire est enregistré ou qu'un CRM fonctionne si cela n'a pas été réellement implémenté et testé.
