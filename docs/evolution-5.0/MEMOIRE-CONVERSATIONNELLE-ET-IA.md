# Mémoire conversationnelle et continuité entre IA

## 1. Intention fondatrice

MajestiOS doit pouvoir enregistrer les discussions et permettre à une IA disposant d'une mémoire native limitée de retrouver le contexte utile en relisant les conversations pertinentes.

L'objectif n'est pas d'augmenter physiquement la mémoire interne d'un modèle, ni de modifier son entraînement. Il s'agit de lui fournir une **mémoire externe, durable, consultable et contrôlée**, au moyen d'un contexte récupéré à la demande.

## 2. Fonctions attendues

1. Enregistrer les conversations autorisées avec leur contexte, leur date et leur origine.
2. Indexer les échanges pour retrouver les passages pertinents.
3. Retrouver les décisions, consignes, faits, hypothèses, tâches et questions ouvertes.
4. Fournir à l'IA un dossier de contexte ciblé avant une réponse ou la reprise d'un travail.
5. Citer les conversations et passages sources pour permettre la vérification.
6. Détecter les contradictions et les changements de décision.
7. Proposer une mémoire synthétique structurée, mise à jour à partir des échanges.
8. Conserver l'historique et permettre de corriger, exporter ou supprimer les éléments selon les droits et règles applicables.

## 3. Trois couches de mémoire proposées

- **Mémoire conversationnelle** : échanges originaux, horodatés et attribués à leur source.
- **Mémoire opérationnelle** : décisions, tâches, projets, procédures, préférences de travail et état d'avancement.
- **Mémoire stratégique** : vision, objectifs, principes, contraintes durables et orientations validées.

La mémoire synthétique ne remplace jamais la conversation source. Chaque élément dérivé doit garder un lien vers son origine.

## 4. Cycle de rappel

1. Identifier l'intention et le projet concerné.
2. Rechercher dans l'index les conversations et documents pertinents.
3. Filtrer selon l'identité, le tenant, les permissions, la finalité et la fraîcheur.
4. Construire un contexte compact avec références aux sources.
5. Signaler les contradictions, informations périmées et incertitudes.
6. Fournir ce contexte à l'IA via l'interface ou l'API autorisée.
7. Enregistrer la réponse et, si pertinent, proposer une mise à jour de mémoire.
8. Faire valider les décisions structurantes ou sensibles par un humain.

## 5. Portabilité entre fournisseurs

Concevoir une couche d'orchestration indépendante du fournisseur de modèle. Elle doit pouvoir adapter le contexte à la fenêtre, au format, aux capacités et aux coûts du modèle utilisé.

Le système ne doit pas supposer que toutes les IA acceptent une mémoire externe ou un même protocole. Il faut distinguer :
- l'archive détenue par MajestiOS ;
- la recherche / récupération ;
- le contexte transmis à un fournisseur ;
- la mémoire native éventuelle de ce fournisseur.

Ne jamais envoyer toutes les conversations par défaut. Transmettre le minimum pertinent, avec contrôle des permissions et des données sensibles.

## 6. Gouvernance, confidentialité et sécurité

À spécifier avant toute collecte réelle :
- base légale et finalités ;
- information des personnes et transparence ;
- durée de conservation et règles d'archivage ;
- droit d'accès, rectification, export et suppression ;
- gestion des conversations contenant des données personnelles, confidentielles ou de tiers ;
- cloisonnement par compte, entreprise et tenant ;
- chiffrement en transit et au repos ;
- contrôle d'accès, journalisation et détection des accès anormaux ;
- politique de transfert vers des fournisseurs d'IA ;
- règles de rétention et d'utilisation des données par chaque fournisseur ;
- suppression des données dérivées et des index lors d'une demande valide ;
- stratégie de sauvegarde et de restauration.

Les conversations ne doivent jamais être utilisées pour entraîner un modèle ou partagées avec un tiers sans base juridique, information et autorisation appropriées. Le choix de l'opt-in et des paramètres de consentement reste à cadrer selon les finalités et les rôles des parties.

## 7. Qualité et protection contre les erreurs

Chaque mémoire dérivée doit inclure :
- extrait ou référence source ;
- date de la source et date de synthèse ;
- auteur / acteur lorsque pertinent ;
- type d'information ;
- statut de validation ;
- confiance ou incertitude ;
- liens vers les éléments contradictoires.

Une IA doit distinguer explicitement :
- ce qui a été dit ;
- ce qui a été décidé ;
- ce qui est une hypothèse ;
- ce qui est une recommandation ;
- ce qui a été réellement exécuté.

## 8. MVP recommandé

Avant l'automatisation avancée :
1. stockage contrôlé d'un corpus pilote ;
2. indexation de conversations de test non sensibles ;
3. recherche plein texte et sémantique ;
4. restitution avec références précises ;
5. synthèse de projet et détection de contradictions ;
6. vérification humaine des mises à jour ;
7. tests de cloisonnement et de suppression.

Ne pas commencer par un agent autonome qui lit indistinctement toutes les conversations ou les transmet à un modèle tiers.

## 9. Critères d'acceptation

- récupération de passages pertinents avec provenance ;
- aucun accès inter-compte ou inter-tenant ;
- distinction fiable entre fait, décision et hypothèse ;
- détection et signalement des contradictions ;
- capacité à retrouver le contexte après changement de fournisseur ou de session ;
- maîtrise des coûts et du volume de contexte transmis ;
- tests d'accès, de suppression, d'export et de rétention ;
- aucune transmission externe non autorisée.
