# Doctrine de navigation et d’identité des dossiers MajestiOS
Version 1.0 — 30 octobre 2026

## Principe directeur
MajestiOS est un système de dossiers interconnectés, pas une suite de pages interchangeables. La navigation doit toujours produire une progression utile : ouvrir un dossier distinct, approfondir une question, relier deux domaines ou déclencher une action clairement identifiée.

> Un lien est un trajet : il ne doit jamais ramener à la gare de départ.

## 1. Identité visuelle propre à chaque dossier
- Chaque page ou dossier possède un sujet, un titre, une fonction et une identité visuelle identifiables.
- Un symbole associé à la rubrique apparaît en filigrane dans la zone d’introduction du dossier. Le filigrane est décoratif, non intrusif, accessible (masqué aux technologies d’assistance) et ne nuit jamais à la lisibilité.
- Les symboles et accents colorés différencient les familles sans rompre la cohérence de la charte MajestiOS.
- Une page ne doit pas être différenciée uniquement par son titre : son contenu, ses liens utiles et sa prochaine étape doivent lui être propres.

## 2. Contrat obligatoire de chaque lien
Avant d’ajouter ou de modifier un lien interne, vérifier :
1. **Destination distincte** : le href ne correspond pas à la route courante. Aucun lien interne ne pointe vers la page qui le contient, y compris dans les cartes, boutons, breadcrumbs, actions principales et accès rapides.
2. **Destination réelle** : la route existe et affiche un contenu adapté à l’intention annoncée. Une page générique ou un alias de redirection ne doit pas masquer l’absence du dossier attendu.
3. **Promesse cohérente** : le libellé décrit ce qui sera réellement ouvert ou effectué.
4. **Progression utile** : le lien apporte un approfondissement, un changement de domaine pertinent, un retour vers un parent explicitement présenté comme tel, ou une action. Pas de navigation circulaire déguisée.
5. **État transparent** : si une fonctionnalité est en préparation, l’indiquer au lieu de simuler une action terminée.

Le fil d’Ariane peut pointer vers les ancêtres, mais jamais vers la page courante comme lien cliquable : le niveau courant est affiché comme texte.

## 3. Profondeur verticale et interconnexions horizontales
L’arborescence exprime la profondeur (domaine → rubrique → dossier spécialisé). Elle ne doit pas devenir un tunnel obligatoire. Les dossiers peuvent être reliés horizontalement lorsque la relation métier est utile : par exemple Radar des entreprises ↔ Signaux économiques ↔ Intelligence entreprises ↔ Marchés privés ↔ Développement commercial.

Ces relations doivent être explicites, contextualisées et sélectives. Elles ne doivent pas être remplacées par une accumulation de liens sans hiérarchie.

## 4. Tests et contrôle de qualité
Pour chaque lot de navigation :
- contrôler l’unicité des destinations dans l’arborescence ;
- vérifier que les routes déclarées correspondent à des pages Next.js ;
- tester les routes canoniques et éviter les alias historiques ;
- ajouter des tests ciblés sur les dossiers nouvellement créés ;
- rechercher les liens internes qui pointent vers la route courante ;
- vérifier manuellement ou par test navigateur les liens dont la destination dépend d’un état dynamique.

Les tests statiques ne prouvent pas à eux seuls que le parcours est bon dans un navigateur. Ne pas présenter le contrôle de compilation comme une recette fonctionnelle complète.

## 5. Ordre de mise en œuvre
1. Stabiliser la carte des rubriques et leurs destinations canoniques.
2. Éliminer les auto-liens et destinations fictives.
3. Donner à chaque dossier une structure et une identité visuelle propres.
4. Construire les interconnexions horizontales justifiées par le métier.
5. Contrôler l’ensemble par tests automatisés, puis par parcours navigateur.

## 6. Règles éditoriales
Distinguer systématiquement les faits sourcés, les interprétations et les hypothèses commerciales. Une page explicative ne doit pas laisser croire qu’un flux, un formulaire, un CRM ou une automatisation est opérationnel si ce n’est pas le cas.
