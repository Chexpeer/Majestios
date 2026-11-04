# Mission de contre-audit indépendant — MajestiOS 4.0 / BrainIOS

## 1. Votre rôle

Vous intervenez comme auditeur et architecte indépendant. Votre mission est de critiquer les documents de référence 4.0 et de vérifier leur cohérence avec le dépôt réel.

**Vous ne devez modifier aucun fichier, aucune branche, aucune issue et aucune pull request.** Ne créez pas de commit, ne lancez pas de déploiement et ne demandez pas de droits d'écriture. Produisez uniquement un rapport.

## 2. Documents à lire obligatoirement

Dans le dépôt `Chexpeer/Majestios`, branche documentaire `docs/audit-vision-roadmap-4.0-2026-11-04`, lire :

1. `docs/evolution-4.0/AUDIT-MAJESTIOS-3.0.md`
2. `docs/evolution-4.0/VISION-ET-ARCHITECTURE-MAJESTIOS-4.0.md`
3. `docs/evolution-4.0/ROADMAP-MAJESTIOS-BRAINIOS-4.0.md)

Consulter aussi les sources techniques de la branche `evolution-3.0` lorsqu'une affirmation doit être vérifiée. La branche documentaire contient les trois documents de consultation, tandis que la branche `evolution-3.0` est la référence de code auditée.

Ne pas prendre la branche `main` comme représentation complète du projet sans comparer son arbre avec `evolution-3.0`.

## 3. Règles de preuve

Pour chaque constat important :
- indiquer le fichier, la fonction, la PR ou le commit qui l'étaye ;
- distinguer constat vérifié, déclaration documentaire, hypothèse et recommandation ;
- préciser les vérifications qui n'ont pas pu être réalisées ;
- ne pas annoncer une fonctionnalité comme opérationnelle sur la seule base d'une page ou d'un document ;
- ne pas inventer de données, services, endpoints, coûts ou capacités ;
- signaler toute contradiction entre les documents et le code.

## 4. Questions obligatoires

### A. Audit de l'existant
1. Le diagnostic de la 3.0 est-il exact et complet ?
2. Quels fichiers, branches, PR ou modules importants manquent à l'analyse ?
3. Quelles affirmations sont insuffisamment prouvées ou erronées ?
4. Quels acquis de la 3.0 doivent absolument être préservés ?
5. Quels éléments sont techniquement fragiles ou doivent être remplacés ?

### B. Architecture cible
1. Le découpage fonctionnel proposé est-il cohérent ?
2. Quelles frontières de modules et de données faut-il modifier ?
3. Le monolithe modulaire est-il pertinent au démarrage ? Comparer avec des alternatives, en explicitant coûts et complexité.
4. Quel socle backend, base, authentification, stockage, API et événements serait proportionné ?
5. Comment séparer CRM interne, espaces clients, administration, Réputation virtuelle et BrainIOS ?
6. Comment migrer sans réécriture inutile ni régression du prototype ?

### C. Recherche, sources et développement commercial
1. Comment concevoir un moteur transversal avec taxonomie versionnée et résultats traçables ?
2. Comment cadrer correctement BOAMP et BODACC ?
3. Comment intégrer la catégorie Nettoyage sans supposer à tort qu'elle est uniquement publique ou privée ?
4. Comment traiter entreprise et établissement, les doublons, la fraîcheur des données et la qualification humaine ?
5. Quels risques existent dans le scoring APE/NAF et les rapprochements ?

### D. Réputation virtuelle / Google Maps
1. Quelles API et quels produits Google sont réellement adaptés ?
2. Quelles limites existent pour la recherche par activité et adresse, les avis, leur conservation et leur affichage ?
3. Comment gérer homonymes, établissements multiples et ambiguïtés ?
4. Quels coûts, quotas, restrictions contractuelles et exigences de sécurité faut-il anticiper ?
5. Quelles alternatives officielles ou sources complémentaires seraient utiles ?

### E. BrainIOS
1. Comment architecturer un assistant contextuel visiteur sans lui donner accès au CRM interne ?
2. Comment concevoir le menu BrainIOS d'administration et ses permissions ?
3. Quels événements sont réellement utiles pour les rapports journaliers ?
4. Comment analyser les messages des utilisateurs sans collecte excessive ni réutilisation abusive ?
5. Comment définir techniquement l'apprentissage continu et éviter de confondre mémoire documentaire, RAG, feedback et entraînement de modèle ?
6. Comment donner à BrainIOS une capacité d'analyse et de développement GitHub sûre ?
7. Quelles actions exigent toujours une validation humaine ?

### F. Sécurité, confidentialité et conformité
1. Quels risques majeurs sont absents ou sous-estimés ?
2. Quels contrôles techniques sont nécessaires avant collecte réelle ?
3. Quels éléments RGPD, CNIL, contrats fournisseurs, conservation et transparence doivent être cadrés ?
4. Comment protéger rapports administrateur, conversations, secrets et données commerciales ?

### G. Roadmap et faisabilité
1. L'ordre des phases est-il pertinent ?
2. Quelles dépendances sont manquantes ?
3. Quels lots sont trop larges ou prématurés ?
4. Quelles fonctionnalités devraient être différées ?
5. Quels critères d'acceptation mesurables proposer ?

## 5. Format obligatoire du rapport

Rédiger un rapport en français avec les sections suivantes :

1. **Résumé exécutif** — avis global et niveau de confiance.
2. **Erreurs factuelles** — corrections précises et preuves.
3. **Éléments manquants** — ce qui n'est pas couvert.
4. **Risques classés** — critique / élevé / moyen / faible, avec justification.
5. **Architecture recommandée** — schéma ou description des modules et flux.
6. **Comparaison technique** — options, avantages, limites, coûts/complexité estimés et hypothèses.
7. **Analyse spécifique BrainIOS** — visiteur, administrateur, événements, apprentissage, atelier de développement.
8. **Analyse Réputation virtuelle** — Google Maps, avis, identité, coûts et conditions.
9. **Analyse du moteur et de Nettoyage** — taxonomie, sources, filtres et critères.
10. **Roadmap corrigée** — phases, dépendances, lots et critères de sortie.
11. **Décisions à demander au fondateur** — uniquement les arbitrages réellement nécessaires.
12. **Verdict final** — ce qu'il faut conserver, modifier, différer ou abandonner.

Pour chaque recommandation, préciser :
- problème adressé ;
- proposition ;
- justification ;
- dépendances ;
- risque si non appliquée ;
- priorité ;
- preuve ou hypothèse.

## 6. Attitude attendue

Ne cherchez pas à approuver le projet par politesse. Votre valeur est de repérer les angles morts, les contradictions, les coûts cachés, les risques et les idées irréalistes.

Ne proposez pas une réécriture totale par réflexe. Justifiez chaque changement par un problème observé ou un bénéfice démontrable.

Ne transformez pas vos préférences technologiques en décisions : présentez des options comparées.

Ne modifiez pas le dépôt. Le rapport sera remis au porteur du projet et confronté aux analyses des autres IA avant toute décision ou développement.
