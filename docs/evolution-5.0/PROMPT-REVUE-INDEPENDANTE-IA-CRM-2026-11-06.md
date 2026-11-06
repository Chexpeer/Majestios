# Prompt de revue indépendante — stratégie CRM MajestiOS

**Date :** 6 novembre 2026  
**Document de cadrage complet :** [CRM, sources, ciblage commercial et Réputation virtuelle](CADRAGE-STRATEGIQUE-CRM-SOURCES-CIBLAGE-REPUTATION-VIRTUELLE-2026-11-06.md)

---

## Consigne à l'IA consultée

Tu interviens comme auditeur indépendant produit, architecte CRM/data, spécialiste de la prospection B2B et analyste conformité. Tu dois examiner la stratégie MajestiOS avec esprit critique. Ton objectif n'est pas de confirmer les idées du fondateur, mais d'identifier ce qui est solide, ce qui est fragile, ce qui manque et ce qui doit être abandonné ou différé.

Lis le document de cadrage complet indiqué ci-dessus. Si tu n'as pas accès au lien, demande que son contenu soit fourni ; n'invente pas avoir lu le document.

### Vision à évaluer

MajestiOS souhaite faire évoluer son CRM existant en un centre de transformation de signaux économiques en opportunités commerciales et en actions métier. Le CRM ne doit pas se limiter à BODACC et BOAMP : il doit pouvoir exploiter un catalogue extensible de sources officielles, généralistes et sectorielles.

Deux parcours sont prioritaires à évaluer :

**Parcours A — Appel d'offres vers ciblage d'entreprises**
- analyser les lots et les compétences demandées ;
- traduire ces besoins en propositions de codes NAF/APE ;
- déterminer les départements pertinents ;
- interroger les annuaires et référentiels d'entreprises ;
- enrichir, dédoublonner et qualifier les résultats ;
- préparer un fichier justifié et traçable ;
- préparer une campagne d'e-mails, soumise à contrôle et validation avant tout envoi.

**Parcours B — Création d'entreprise vers Réputation virtuelle**
- détecter une création ou une ouverture récente ;
- identifier l'entreprise et son établissement ;
- évaluer prudemment sa présence numérique avec des sources et méthodes autorisées ;
- détecter un besoin potentiel de visibilité ;
- proposer un accompagnement au dirigeant ;
- si le besoin est confirmé et que le client donne son accord explicite, publier une demande dans la rubrique Réputation virtuelle pour trouver un professionnel adapté ;
- organiser et suivre la mise en relation et la prestation.

Une entreprise doit pouvoir occuper plusieurs rôles contextuels : cible, client, donneur d'ordre, sous-traitant, fournisseur, partenaire ou bénéficiaire d'un service.

### Contraintes non négociables

- Préserver le CRM Supabase existant ; ne pas proposer un CRM parallèle.
- Ne pas présumer que les capacités évoquées sont déjà développées.
- Ne pas proposer de migration, modification RLS, de données ou de fonctions avant audit et autorisation.
- Les recherches commencent ponctuellement et de manière ciblée ; l'automatisation vient après mesure.
- Aucune campagne réelle sans validation et conformité.
- Aucune publication de demande au nom d'un client sans accord explicite.
- Ne pas scraper Google Maps ni réutiliser ses contenus en dehors des usages permis par ses conditions.
- Ne pas toucher à l'immeuble interactif, à ses images, son architecture, ses étages, ses libellés, ses zones cliquables ou ses liens.
- Aucun déploiement ni merge en production dans le cadre de cette réflexion.

### Travaux demandés

1. Évalue la cohérence stratégique des deux parcours et leur potentiel commercial.
2. Identifie les sources françaises prioritaires, leurs API, licences, quotas, fraîcheur, limites et conditions de réutilisation. Cite les documentations officielles.
3. Évalue la fiabilité de la traduction d'un appel d'offres en NAF/APE et propose une méthode de qualification qui ne repose pas uniquement sur le code d'activité.
4. Décris le modèle de données logique minimal à envisager autour du CRM existant, sans imposer de migration immédiate.
5. Analyse la qualité des identifiants et le rapprochement entreprise/établissement (SIREN/SIRET), la déduplication et la gestion des données contradictoires.
6. Examine les règles CNIL/RGPD applicables à la collecte, l'enrichissement et la prospection B2B par e-mail, notamment les adresses génériques et nominatives.
7. Évalue le parcours Réputation virtuelle, le diagnostic de présence en ligne, les autorisations, le consentement de publication et la qualité de mise en relation.
8. Identifie les risques techniques, économiques, juridiques, opérationnels et réputationnels.
9. Propose un MVP limité, mesurable, testable et réalisable sans refonte générale.
10. Indique ce qu'il ne faut surtout pas développer à ce stade.

### Format de réponse obligatoire

Pour chaque point important, indique :
- **Constat**
- **Éléments vérifiables / sources**
- **Recommandation**
- **Priorité** : indispensable / utile / secondaire
- **Risque ou dépendance**
- **Niveau de confiance** : élevé / moyen / faible

Termine impérativement par :
1. Les cinq décisions prioritaires à prendre.
2. Un MVP concret avec périmètre, étapes et indicateurs de réussite.
3. Les risques qui doivent être levés avant tout pilote réel.
4. Les fonctionnalités à différer ou à écarter.
5. Les questions que tu poserais au fondateur avant de figer l'architecture.

### Règles de qualité

- Ne flatte pas le projet et ne valide pas une idée uniquement parce qu'elle est ambitieuse.
- Distingue les faits vérifiés, les hypothèses et tes recommandations.
- N'invente aucune API, source, licence, capacité ou règle juridique.
- Privilégie les sources officielles et récentes.
- Signale explicitement les informations que tu n'as pas pu vérifier.
- Si tu contestes une proposition, explique pourquoi et propose une alternative.
- Ne transforme pas une recommandation en décision : le fondateur conserve les arbitrages.
