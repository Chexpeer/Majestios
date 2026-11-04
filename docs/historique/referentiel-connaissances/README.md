# Référentiel de connaissances MajestiOS

**Rôle :** point d'entrée documentaire pour les personnes et assistants IA qui conçoivent, maintiennent ou exploitent MajestiOS.

Ce dossier constitue un **référentiel documentaire versionné**. Il ne constitue pas, à ce stade, une base de connaissances connectée au chatbot, un moteur RAG, un agent autonome ni un système de surveillance en arrière-plan.

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

Le référentiel est amorcé par cette structure et les documents existants du dépôt. **Aucune indexation automatique, synchronisation continue, recherche sémantique ou connexion du chatbot à ces documents n'est activée.** Toute automatisation de ce type fera l'objet d'un lot technique distinct, avec contrôle des accès, des versions et des sources.

## Index des documents de référence

| Sujet | Document principal | Compléments |
|---|---|---|
| Vision et périmètre produit | `../CAHIER-DES-CHARGES-MAITRE-MAJESTIOS.md` | `../SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md` |
| Dix dossiers et navigation | `../DOSSIERS-MAJESTIOS.md` | `../ARBORESCENCE-MAJESTIOS.md`, README de chaque dossier |
| État réel et reprise | `../DOCUMENTATION-REPRISE-IA-MAJESTIOS.md` | Code, tests, commits |
| Statut des exigences | `../MATRICE-TRAÇABILITE-EXIGENCES-MAJESTIOS.md` | Preuves de tests |
| Veille et signaux | `../CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md` | `../BODACC-TRAITEMENT-SIGNAUX-COMMERCIAUX.md`, `../TRAITEMENT-OPPORTUNITES-MAJESTIOS.md` |
| Parcours depuis une annonce | `../SPEC-PARCOURS-DEPUIS-ANNONCE-MAJESTIOS.md` | `../TRAITEMENT-OPPORTUNITES-MAJESTIOS.md` |
| CRM et données | `../MODELE-COMMUN-DONNEES-CRM-MAJESTIOS.md` | `../PLAN-CHANTIER-RECHERCHE-DONNEES-CRM.md`, `../REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md` |
| Statistiques et valorisation | `../CARTOGRAPHIE-DONNEES-STATISTIQUES-MAJESTIOS.md` | `../PLAN-PILOTE-STATISTIQUES-MAJESTIOS.md`, `../MODELE-VALORISATION-DONNEES-ET-ETUDES-COMMERCIALES-MAJESTIOS.md` |
| Suivi économique des entreprises | `../SPEC-SUIVI-DYNAMIQUE-ECONOMIQUE-ENTREPRISES-MAJESTIOS.md` | Registre des ressources |

### Règles d'arbitrage documentaire

- Le cahier des charges maître exprime la vision et le périmètre cible ; il est encore indiqué comme à valider par le Fondateur.
- Les spécifications décrivent le comportement attendu, pas la preuve d'une fonction livrée.
- La matrice de traçabilité et le code/tests/commits servent à établir l'état réellement constaté.
- Les modèles CRM, appels d'offres et statistiques ne prouvent pas l'existence d'une base ou d'un service opérationnel.
- BOAMP désigne les consultations publiques ; BODACC désigne des annonces légales et commerciales, à qualifier comme signaux.
- Les documents portant une ancienne branche dans leurs métadonnées conservent leur contexte historique tant que leur origine n'a pas été vérifiée.
- En cas de contradiction non tranchée par une décision datée et vérifiable, documenter l'écart et demander un arbitrage plutôt que choisir silencieusement.
