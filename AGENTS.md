# Instructions de travail pour les agents IA — MajestiOS 4.0

Ce fichier est le point d'entrée canonique pour toute intervention sur la branche `evolution-4.0`.

## 1. Références obligatoires

Avant toute modification :
1. lire `README.md` et le présent fichier ;
2. lire `docs/evolution-4.0/README.md` ;
3. consulter `AUDIT-MAJESTIOS-3.0.md`, `VISION-ET-ARCHITECTURE-MAJESTIOS-4.0.md`, `ROADMAP-MAJESTIOS-BRAINIOS-4.0.md` et `REGISTRE-OBSERVATIONS-TECHNIQUES-4.0.md` ;
4. vérifier les fichiers réellement concernés, les PR ouvertes, leurs bases/têtes et les tests associés ;
5. consulter les documents 3.0/2.0 lorsqu'ils contiennent un contrat technique ou métier toujours pertinent.

Les décisions explicites les plus récentes du porteur du projet priment sur les anciens libellés, les tests obsolètes et les documents historiques. En cas de contradiction, la signaler et documenter la décision appliquée.

## 2. Branches et préservation

- `evolution-4.0` est la branche de développement active de cette évolution.
- `evolution-3.0` reste une référence historique et une source de code à préserver.
- `evolution-2.0` et `backup/evolution-3.0-pre-lot-1-2026-11-03` restent des références de sauvegarde ; ne pas les modifier.
- Ne jamais réécrire l'historique, supprimer ou écraser une branche de référence.
- Ne pas fusionner, promouvoir ou déployer sans autorisation explicite.
- Ne pas retargeter, fermer ou fusionner les PR héritées #23 à #34 sans cartographie et arbitrage.
- Les changements 4.0 doivent être regroupés en lots cohérents afin d'éviter les workflows annulés en cascade.

## 3. Méthode de livraison

Avant toute modification :
- établir l'état initial et le périmètre ;
- identifier dépendances, risques et fichiers concernés ;
- préserver une possibilité de retour arrière ;
- distinguer fait vérifié, hypothèse et décision.

Après chaque lot :
- exécuter les tests ciblés, le build, les vérifications d'architecture et de liens applicables ;
- vérifier les résultats CI ;
- comparer le résultat aux critères d'acceptation ;
- documenter les fichiers, commits, tests, limites et risques résiduels.

Ne jamais masquer un échec ni déclarer une fonctionnalité opérationnelle sans preuve d'exécution.

## 4. Doctrine produit et vocabulaire

- MajestiOS est une plateforme de **développement commercial**.
- La rubrique de prospection s'appelle **Prosp'active**.
- La rubrique de présence et réputation s'appelle **Réputation virtuelle**.
- Le parcours visuel principal est l'**immeuble interactif**.
- Le schéma doit refléter l'arborescence réelle ; chaque zone cliquable mène à un dossier ou à une destination réelle et vérifiable.
- Le moteur de recherche est transversal et cohérent sur les pages et rubriques.
- Chaîne de valeur : **Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser**.
- BrainIOS accompagne, analyse, recommande et prépare des évolutions ; ses permissions et son autonomie sont graduées et contrôlées.
- Ne pas réintroduire « prospection inversée », « Prospection active », « Salon virtuel », « Showroom virtuel » ou « e-Réputation » comme libellés cibles, sauf contexte historique ou compatibilité de route.
- Les slugs historiques peuvent être conservés temporairement pour éviter les ruptures de liens ; le texte visible doit employer le vocabulaire 4.0.

## 5. Architecture et vérité fonctionnelle

- Le prototype 3.0 est principalement statique ; ne pas annoncer backend, base, authentification, CRM persistant, assistant BrainIOS ou automatisation comme opérationnels sans preuve.
- Le CRM interne est distinct des espaces clients et des données publiques.
- Les permissions doivent être appliquées côté serveur dès qu'un backend existe ; masquer un bouton ne constitue pas une autorisation.
- Les codes APE/NAF et signaux administratifs ne prouvent ni compétence ni capacité à répondre à un marché.
- Les données importées conservent provenance, date, finalité, statut et limites.
- Toute action de contact ou d'envoi doit respecter les règles applicables, les préférences et les oppositions ; aucun envoi automatique par défaut.
- Les clés API privées et secrets ne doivent jamais être exposés dans le frontend.
- Google Maps/Places doit être intégré par des interfaces et conditions autorisées ; vérifier quotas, coûts, attribution, stockage et réutilisation avant implémentation.
- Les observations techniques externes sont des points de contrôle, pas des motifs automatiques de réduire la vision produit.

## 6. Recherche, sources et SEO

- BOAMP et BODACC doivent être traités par des adaptateurs et une taxonomie explicite/versionnée.
- Ne pas fusionner arbitrairement les catégories publiques et privées.
- Les familles BODACC et les catégories BOAMP doivent refléter les décisions produit les plus récentes, et non une ancienne règle recopiée dans un test ou une PR.
- Les résultats doivent être bornés, dédoublonnés, datés et rattachés à leur source.
- Le SEO de MajestiOS est un chantier transversal que BrainIOS doit pouvoir surveiller et améliorer : indexation, sitemap, robots, canonical, HTTP, redirections, contenu, métadonnées, liens internes, données structurées, mobile et performance.
- Les mesures SEO doivent distinguer les données des outils officiels, les estimations et les signaux de recherche générative.
- Aucune promesse de classement garanti ; toute modification sensible d'URL, canonical, redirection, contenu stratégique ou indexation nécessite revue humaine.

## 7. Confidentialité et sécurité du dépôt

- Ne jamais committer de secrets, jetons, clés privées, données clients ou données personnelles.
- Utiliser des variables d'environnement et des secrets de plateforme.
- Contrôler l'historique Git et les workflows avant toute ouverture de collecte ou intégration externe.
- Ne pas considérer `.gitignore` comme une protection rétroactive : un fichier déjà suivi reste suivi.
- Appliquer le principe du moindre privilège aux tokens GitHub, services externes et outils BrainIOS.
- Les rapports administrateur et données CRM sont privés et cloisonnés.

## 8. Documentation

La documentation active 4.0 se trouve dans `docs/evolution-4.0/`. Les documents 3.0 et 2.0 restent des références historiques, à utiliser après vérification de leur cohérence avec les décisions récentes.

Toute proposition d'architecture doit être clairement distinguée d'une fonctionnalité réellement implémentée. Mettre à jour la documentation dans le même lot que les changements structurants.
