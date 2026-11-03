# MajestiOS — spécification fonctionnelle détaillée

Version : 2026-11-01  
Statut : consolidation des exigences connues ; base de travail à valider par le Fondateur avant implémentation des lots concernés.  
Référentiel de reprise : `DOCUMENTATION-REPRISE-IA-MAJESTIOS.md`.

## 1. Objectif et limites

MajestiOS est un outil de développement commercial assisté par IA. Il détecte et qualifie des informations publiques ou autorisées, rapproche les signaux utiles, identifie des entreprises potentiellement concernées et aide à préparer des actions commerciales. Il ne doit ni inventer des données ni transformer une hypothèse en fait.

Les fonctions décrites ci-dessous sont des exigences du produit. Leur présence dans cette spécification ne signifie pas qu'elles sont déjà implémentées ou connectées.

## 2. Acteurs et besoins

- **Artisan / TPE / PME** : trouver des marchés pertinents, comprendre les exigences, préparer une réponse et bénéficier d'un accompagnement.
- **Responsable commercial** : surveiller les opportunités, cibler les entreprises, organiser la prospection et suivre les retours.
- **Agent commercial** : détecter les événements économiques et les pistes d'affaires correspondant à son portefeuille.
- **Professionnel de l'immobilier d'entreprise** : repérer des signaux liés à des changements d'activité, cessions, procédures ou implantations, puis vérifier les pistes.
- **Équipe MajestiOS / analyste** : contrôler la provenance, enrichir les dossiers, qualifier les signaux et préparer des actions.
- **Administrateur / responsable produit** : gérer sources, permissions, règles de traitement, modèles et contrôles.
- **Candidat ou personne souhaitant rejoindre MajestiOS** : accéder au parcours Nous rejoindre sans confondre ce parcours avec la veille commerciale emploi.

## 3. Parcours A — recherche et qualification des marchés

### Entrées
Mots-clés, catégorie d'activité, type de marché (public/privé), zone géographique et filtres disponibles sur l'interface.

### Traitement attendu
1. Valider les critères et les transmettre sans perte.
2. Interroger séparément les sources adaptées à la nature de la recherche.
3. Pour le BOAMP, ne retenir que les avis correspondant à la nature d'appel d'offres définie par le connecteur.
4. Écarter les annonces dont la date limite valide est passée ; une date absente ou invalide doit être signalée, pas transformée en date inventée.
5. Appliquer les filtres géographiques selon les champs réels de chaque source.
6. Dédupliquer les résultats et éviter l'empilement des cartes lors d'une nouvelle recherche.
7. Afficher source, date, zone, critères essentiels, date limite quand elle est fournie, et lien officiel.
8. Afficher clairement les états chargement, zéro résultat, source indisponible et erreur.
9. Conserver les critères dans l'URL et permettre le retour vers la recherche sans perte.

### Critères d'acceptation
- Une recherche ne retourne pas des catégories sans rapport avec les critères.
- Une recherche « services numériques » ne doit pas faire remonter une prestation de plomberie simplement parce que le texte contient « service ».
- Une offre expirée avec date limite valide n'est pas affichée comme active.
- Une erreur de source est distinguée d'une recherche sans résultat.
- Les liens source renvoient à une destination officielle validée ou à une page de recherche officielle.
- Plusieurs recherches successives remplacent les résultats précédents au lieu de les empiler.

## 4. Parcours B — accompagnement humain et technique aux appels d'offres

Cette fonction est déjà prévue dans le périmètre de MajestiOS.

### Étapes
1. Importer ou consulter l'avis et le dossier de consultation (DCE) obtenus par une voie autorisée.
2. Extraire l'objet, les lots, le lieu, les dates, les conditions de participation, les pièces attendues, les critères d'attribution et les exigences techniques.
3. Produire une synthèse sourcée et signaler les éléments ambigus ou absents.
4. Établir une liste de contrôle de candidature et d'offre, avec statut (à préparer, reçu, à vérifier, validé par l'entreprise, manquant).
5. Aider à vérifier les capacités de l'entreprise au regard des exigences, sans promettre qu'elle est éligible si des preuves manquent.
6. Préparer une trame de réponse et une structure de mémoire technique adaptées au marché ; ne pas fabriquer de références, qualifications, effectifs, moyens ou engagements.
7. Prévoir une relecture humaine/technique selon le service souscrit et le niveau de risque.
8. Générer un calendrier rétroactif à partir de la date limite, avec tâches et responsables.
9. Guider l'entreprise vers la plateforme de dépôt et la procédure officielle. Ne pas simuler un dépôt réussi sans preuve.
10. Enregistrer l'état du dossier et, quand il est connu, le résultat de la candidature.

### Livrables possibles
- fiche de synthèse du marché ;
- tableau des exigences et pièces ;
- matrice de conformité apparente ;
- calendrier ;
- trame de mémoire technique ;
- liste de points à faire valider par l'entreprise ;
- rapport de relecture ;
- historique des échanges et actions.

### Garde-fous
L'entreprise reste responsable de l'exactitude de sa réponse et du dépôt final. Les conseils juridiques ou techniques spécialisés doivent être délivrés par des personnes compétentes. Aucun résultat commercial ne peut être garanti. Les DCE, prix, références, documents d'identité et données confidentielles doivent être protégés par des droits d'accès et des règles de conservation.

## 5. Parcours C — ciblage d'entreprises par APE/NAF et département

### Objectif
À partir d'un appel d'offres qualifié, identifier et contacter de manière ciblée des entreprises susceptibles d'y répondre, avec une proposition simultanée d'accompagnement MajestiOS.

### Entrées
- appel d'offres et lots pertinents ;
- codes APE/NAF candidats et description métier normalisée ;
- département(s) d'exécution et périmètre géographique justifié ;
- critères obligatoires ou souhaitables du marché ;
- sources d'entreprises dont la réutilisation est autorisée.

### Étapes fonctionnelles
1. Extraire les métiers, spécialités, lots, exigences et lieux du marché.
2. Établir une liste initiale de codes APE/NAF associés aux activités pertinentes, avec niveau de correspondance et justification.
3. Chercher les entreprises actives dans les départements visés via des sources autorisées.
4. Enrichir, si disponible et licite, avec spécialités, effectif/structure, références, certifications, implantation et coordonnées professionnelles.
5. Distinguer les données déclaratives, les données sourcées et les inférences.
6. Dédupliquer sur les identifiants d'entreprise appropriés et éviter les doubles envois.
7. Calculer un score de pertinence explicable (adéquation activité/marché, territoire, capacités documentées, contraintes et fraîcheur).
8. Sélectionner comme cible **environ dix entreprises par département pour chaque opportunité**, si le nombre et la qualité des candidats le permettent. Ne pas compléter artificiellement le quota ; indiquer le nombre réel et la raison si la sélection est plus petite.
9. Faire valider la liste et le message par un opérateur habilité avant une campagne réelle, au moins durant la phase initiale.
10. Envoyer ou préparer une diffusion selon le canal et la base légale applicables, avec mécanisme d'opposition/désinscription adapté.
11. Présenter dans le même message l'appel d'offres et une proposition claire d'accompagnement (analyse du DCE, pièces, mémoire technique, relecture, calendrier).
12. Enregistrer la campagne et ses événements dans le CRM : sélection, validation, envoi, échec, réponse, intérêt, opposition, demande d'accompagnement, rendez-vous, résultat.

### Champs minimaux de la fiche entreprise ciblée
Identifiant d'entreprise si disponible ; dénomination ; activité et code APE/NAF avec date/source ; département/zone ; adresse ou coordonnées professionnelles si autorisées ; source de chaque champ ; adéquation estimée et explication ; vérifications manquantes ; historique de contact ; préférence/opposition ; date de dernière mise à jour.

### Critères d'acceptation
- Le code APE/NAF n'est jamais utilisé seul comme preuve de capacité.
- La sélection peut être expliquée et reproduite.
- Les entreprises sont dédoublonnées.
- Le système ne prétend pas avoir dix cibles quand il y en a moins.
- Chaque envoi est rattaché à une source, une version du marché, une date et un destinataire.
- Les oppositions et désinscriptions empêchent les envois ultérieurs concernés.
- Une erreur d'envoi ne se transforme pas en statut « envoyé ».
- Le message ne promet ni attribution du marché ni résultat garanti.
- Aucune campagne réelle n'est activée sans autorisation explicite et validation des sources, destinataires, contenu et conformité.

## 6. Parcours D — veille stratégique sur les entreprises

### Signaux candidats
Création, cession, modification, cessation, procédure collective, redressement/liquidation, changement d'établissement, publication légale, recrutement et autres événements issus de sources autorisées.

### Règles
- BODACC = annonces et événements d'entreprises ; ne pas le présenter comme un flux d'appels d'offres.
- Un événement est un signal, pas une preuve automatique d'un besoin d'achat, d'une intention de vente ou de disponibilité d'un actif.
- Conserver la source, l'identifiant et les dates.
- Présenter la prochaine vérification recommandée et les hypothèses comme telles.
- Toute action commerciale sensible ou interprétation importante peut exiger une validation humaine.

### Exemple immobilier
Une cessation ou une procédure peut justifier de rechercher d'autres informations sur l'entreprise, ses établissements ou ses locaux. Elle ne prouve pas qu'un local est libre ou à vendre. Le résultat doit rester une piste à confirmer.

## 7. Parcours E — veille emploi discrète

La veille emploi sert à observer les tendances et signaux d'entreprises en interne ; elle n'est pas un moteur public sur l'accueil ni une catégorie du moteur principal de marchés.

Sources candidates à examiner : France Travail, APEC, Cadremploi, agentCo, HelloWork, Indeed, Welcome to the Jungle, LinkedIn, Meteojob, Choisir le service public, APECITA, La Bonne Alternance et sources sectorielles pertinentes.

Pour chaque source, documenter URL officielle, accès autorisé, API/flux, authentification, licence, fréquence, données, attribution, limites, données personnelles, conservation, erreurs et statut de validation. Aucun connecteur ne doit être présumé disponible. Un recrutement ne prouve pas à lui seul une croissance ou un besoin commercial.

## 8. Parcours F — chatbot, espace membre et formulaires

- Le chatbot est un point d'entrée discret, orientant vers des pages/dossiers exacts ; si l'information manque, il doit l'indiquer et proposer un contact plutôt que d'inventer.
- Les formulaires doivent valider les champs, annoncer clairement ce qui est envoyé/enregistré et fournir un état de résultat fiable.
- Tant que le backend n'est pas connecté, l'interface doit préciser qu'il s'agit d'une prévisualisation et qu'aucune donnée n'a été transmise.
- Les profils et droits d'accès doivent séparer les données publiques, privées, confidentielles et les dossiers propres à un client.
- L'historique CRM doit conserver les actions utiles, les sources et les statuts, avec contrôle des accès et durée de conservation.

## 9. Parcours G — salon virtuel et immeuble interactif

- L’immeuble interactif à dix étages est l’interface de navigation visuelle de l’accueil et doit être préservé.
- Le Salon virtuel/showroom est une rubrique distincte, prévue pour des présentations professionnelles et extensions futures.
- Les deux concepts ne doivent pas être confondus dans l'interface ou l'arborescence.
- Toute modification de la scène de l'accueil doit être isolée et couverte par des tests anti-régression.

## 10. Modèle de données conceptuel

Entités fonctionnelles à prévoir, sans imposer un choix technologique avant décision :
- Source ;
- Signal/événement ;
- Opportunité/marché ;
- Entreprise ;
- Établissement ;
- Interlocuteur/décideur ;
- Code d'activité APE/NAF ;
- Territoire/département ;
- Dossier de réponse ;
- Pièce/document ;
- Campagne de diffusion ;
- Contact/interaction ;
- Demande d'accompagnement ;
- Tâche/échéance ;
- Compte utilisateur/rôle ;
- Préférence/opposition ;
- Historique de qualification ;
- Résultat/retour commercial.

Relations clés : une opportunité provient d'une ou plusieurs sources ; un marché peut avoir plusieurs lots ; une entreprise peut correspondre à plusieurs activités et territoires ; une entreprise peut être sélectionnée pour plusieurs opportunités ; une campagne regroupe des destinataires et événements ; une demande d'accompagnement peut être rattachée à un marché, une entreprise et un dossier de réponse. Toute donnée dérivée doit conserver sa provenance.

## 11. Exigences transverses de qualité

- provenance et horodatage ;
- validation des entrées et gestion des erreurs ;
- normalisation et déduplication ;
- dates explicites et gestion des données manquantes ;
- contrôle de pertinence des catégories ;
- journalisation des opérations importantes ;
- droits d'accès, confidentialité, minimisation et conservation ;
- consentements/préférences/oppositions selon le contexte applicable ;
- séparation fait/hypothèse/recommandation ;
- tests unitaires, statiques et navigateur proportionnés au lot ;
- messages utilisateur honnêtes sur les limites et l'état des connexions ;
- pas de déploiement ou de campagne sans autorisation explicite.

## 12. Critères de réussite produit

1. Un utilisateur retrouve des opportunités pertinentes sans confusion entre BOAMP et BODACC.
2. Les résultats indiquent la source et les échéances disponibles.
3. Une entreprise peut être accompagnée depuis l'analyse du DCE jusqu'à la préparation et au contrôle de sa réponse.
4. Pour une opportunité donnée, MajestiOS peut établir une liste explicable d'entreprises pertinentes par département à partir de codes APE/NAF et de critères complémentaires.
5. La diffusion d'un appel d'offres peut être associée à une proposition d'accompagnement et suivie dans le CRM.
6. Les signaux emploi et immobilier sont traités comme veille distincte, qualifiée et non trompeuse.
7. Les formulaires et connecteurs n'annoncent jamais une opération réussie sans preuve.
8. L'accueil reste épuré et la zone virtuelle ne régresse pas.
9. Toute nouvelle IA peut reprendre le travail à partir du guide de reprise et des documents liés, sans dépendre du contexte de conversation.

## 13. Alimentation du CRM par des ressources externes et internes

Le CRM doit être alimenté par des sources externes autorisées et par les interactions MajestiOS une fois le backend développé. Le registre `REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md` constitue l’inventaire initial de référence ; il doit être actualisé à chaque validation, intégration, changement de licence ou indisponibilité.

Exigences minimales :
1. Chaque source possède un identifiant, un producteur, une URL officielle, un mode d’accès, un statut, une date de vérification et des conditions de réutilisation documentées.
2. Chaque enregistrement conserve son identifiant source, son URL d’origine, ses dates de publication/collecte et la provenance des champs enrichis.
3. Les entreprises et établissements sont dédoublonnés prioritairement par SIREN/SIRET lorsqu’ils sont disponibles ; un nom ressemblant ne suffit pas à fusionner des fiches.
4. Le CRM distingue fait publié, donnée normalisée, inférence algorithmique et validation humaine.
5. Les imports sont idempotents, limités, journalisés et surveillés ; les erreurs, retards, changements de schéma et doublons sont visibles.
6. Les formulaires, demandes d’accompagnement, interactions, préférences et oppositions n’alimentent le CRM qu’après connexion réelle et contrôle des droits d’accès.
7. Aucune campagne externe ne part automatiquement du seul fait qu’un signal a été détecté ; la validation humaine et les contrôles de conformité restent requis.
8. Une source mentionnée dans un cahier des charges n’est jamais considérée comme disponible ou connectée sans test réel documenté.

Le registre recense notamment l’API Recherche d’Entreprises, Sirene, BODACC, BOAMP, RNE/Data INPI, les statistiques de marché du travail, les référentiels métiers, les sources immobilières et les portails professionnels à instruire. Il signale que l’API Offres d’emploi France Travail n’est pas à présumer accessible actuellement.

## 14. Décisions à ne pas inventer

Les technologies backend, les sources exactes d'annuaires d'entreprises, le canal et la fréquence des campagnes, le financement, les tarifs, les rôles humains, les délais de conservation et les niveaux de service détaillés doivent être décidés ou validés avant leur implémentation. Les proposer comme points d'arbitrage, pas comme faits établis.

## 15. Historique de mise à jour

Cette spécification rassemble les exigences de produit discutées et documentées à la date du 1er novembre 2026. Toute modification ultérieure doit préciser : décision nouvelle ou clarification d'une exigence existante, documents impactés, critères d'acceptation et état d'implémentation.

## 16. Traçabilité et réalisation
Chaque exigence de cette spécification doit être suivie dans `MATRICE-TRAÇABILITE-EXIGENCES-MAJESTIOS.md`, avec statut, fichiers concernés, preuve de validation attendue et lot de réalisation. La matrice doit être mise à jour au fil des commits et ne doit jamais présenter une fonction simplement documentée comme opérationnelle.


## 17. État d'implémentation et preuves — actualisation du 2 novembre 2026

Les parcours A à G ci-dessus constituent la spécification cible. Ils ne doivent pas être lus comme un inventaire des fonctionnalités livrées. Au vu du prototype et des contrôles disponibles :

- la recherche, les pages de rubriques, les connecteurs BOAMP/BODACC et l'immeuble interactif disposent de composants de prototype ; leur validation dépend des tests de chaque parcours et du commit concerné ;
- le test navigateur de recherche a échoué dans l'exécution GitHub Actions du 2 novembre, après réussite du build, des contrôles d'architecture, des connexions BOAMP/BODACC et du test de l'immeuble interactif ;
- la persistance CRM, les comptes professionnels, les rôles, l'historique durable, les campagnes réelles, les automatisations planifiées et le moteur BrainIOS autonome restent à développer ou à connecter ;
- les parcours d'accompagnement aux appels d'offres, de ciblage APE/NAF et de prospection sont des exigences produit déjà définies, mais ne sont pas à présenter comme des services intégralement opérationnels.

La matrice de traçabilité demeure le document de référence pour le statut de chaque exigence. Un statut ne peut évoluer qu'avec une preuve liée à un commit et à un test adapté. Résultat CI consulté : [exécution du 2 novembre 2026](https://github.com/Chexpeer/Majestios/actions/runs/41460016382).
