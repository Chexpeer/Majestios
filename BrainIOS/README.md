# BrainIOS — référentiel de connaissances MajestiOS

**Rôle :** point d'entrée documentaire pour les personnes et assistants IA qui conçoivent, maintiennent ou exploitent MajestiOS.

BrainIOS est ici un **référentiel documentaire versionné**. Il ne constitue pas, à ce stade, une base de connaissances connectée au chatbot, un moteur RAG, un agent autonome ni un système de surveillance en arrière-plan.

## Sources de vérité

Lire les documents dans cet ordre :

1. `../DOCUMENTATION-REPRISE-IA-MAJESTIOS.md` — protocole de reprise et état de vérité.
2. `../CAHIER-DES-CHARGES-MAITRE-MAJESTIOS.md` — vision, périmètre et décisions produit.
3. `../SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md` — parcours et critères d'acceptation.
4. `../DOSSIERS-MAJESTIOS.md` et `../ARBORESCENCE-MAJESTIOS.md` — organisation fonctionnelle et pages.
5. `../MATRICE-TRAÇABILITE-EXIGENCES-MAJESTIOS.md` — statuts, preuves et lots.
6. `../REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md` — sources externes et conditions d'utilisation.
7. Les README des dix dossiers dans `../dossiers/` — périmètres métier locaux.

En cas de contradiction, ne pas choisir silencieusement : identifier les deux passages, rechercher la décision la plus récente vérifiable et consigner la correction dans les documents concernés.

## Organisation cible

- `procedures/` : procédures opératoires et checklists reproductibles.
- `prompts/` : instructions spécialisées pour les assistants IA.
- `modeles/` : modèles de fiches, comptes rendus et contrôles.
- `archives/` : décisions et documents remplacés conservés pour traçabilité, jamais utilisés comme source courante sans vérification.

Créer ces sous-dossiers seulement lorsqu'un premier document réel les justifie. Ne pas dupliquer les documents maîtres : les référencer.

## Règles de qualité

- Distinguer **constaté dans le code**, **testé**, **documenté**, **prévu**, **hypothèse** et **bloqué**.
- Toute affirmation technique importante doit pointer vers un fichier, un commit, une source ou une preuve de test.
- Pour une source externe, conserver organisme, URL, date de consultation, licence/conditions, champs exploités et date de prochaine vérification.
- Toute donnée commerciale dérivée d'un signal reste une hypothèse à qualifier par un humain.
- Ne jamais présenter une donnée de démonstration comme une annonce réelle.
- Ne jamais affirmer qu'un formulaire a été transmis, qu'un compte existe, qu'un CRM enregistre ou qu'une campagne est envoyée sans preuve technique.
- Ne pas lancer de campagne, modifier la production, fusionner une branche ou connecter un service sans autorisation explicite.
- Mettre à jour la matrice de traçabilité lorsqu'une exigence change de statut.

## Cycle de mise à jour

1. Identifier la question ou le changement et son périmètre.
2. Lire les sources de vérité concernées.
3. Vérifier le dépôt et les preuves actuelles.
4. Rédiger ou corriger au plus près du document maître.
5. Contrôler les liens relatifs et les contradictions introduites.
6. Mettre à jour la matrice si le statut ou la preuve évolue.
7. Consigner le commit et les tests réellement exécutés.

## État actuel

Le référentiel est amorcé par cette structure et les documents existants du dépôt. **Aucune indexation automatique, synchronisation continue, recherche sémantique ou connexion du chatbot à BrainIOS n'est activée.** Toute automatisation de ce type fera l'objet d'un lot technique distinct, avec contrôle des accès, des versions et des sources.
