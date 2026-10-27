# Audit technique initial — MajestiOS

**Version :** 0.1  
**Date :** 27 octobre 2026  
**Branche examinée :** `architecture-v0-1`  
**Statut :** audit documentaire préliminaire ; aucune modification du code applicatif, de Supabase ou de Vercel.

## 1. Synthèse

Le dépôt contient une vitrine Next.js exploitable pour poursuivre le MVP, mais les éléments examinés ne démontrent pas encore l'existence d'un SaaS métier opérationnel. La priorité est de stabiliser le socle de développement, de clarifier les parcours réels et de préparer l'intégration de données sans figer prématurément le modèle métier.

## 2. Faits vérifiés dans les fichiers

- Le dépôt contient une application Next.js sous `src/app` et des fichiers historiques à la racine (`index.html`, `app.js`, `build.js`). Leur usage dans les différents projets Vercel reste à cartographier ; ne pas les supprimer sans cette vérification.
- `src/app/page.tsx` contient des jeux de données d'exemple pour les opportunités publiques et privées. Les filtres agissent sur les exemples locaux.
- Le formulaire de demande de démonstration utilise un état React local ; le code examiné ne démontre aucun envoi ni enregistrement persistant.
- `src/app/api/health/route.ts` renvoie explicitement `databaseConnected: false`.
- `package.json` déclare Next.js 16.4.3, React 19.1.1, React DOM 19.1.1, TypeScript 5.9.3 et ESLint 9.39.2.
- Aucun `package-lock.json` n'apparaît dans l'arborescence examinée. Le workflow CI exécute `npm install`, puis `npm run lint` et `npm run build`.
- `.env.example` ne contient que les variables publiques d'exemple pour Supabase, laissées vides ; aucune connexion active à une base n'est prouvée par ce fichier.
- Le workflow d'audit npm est présent, mais sa présence ne prouve pas qu'un audit récent a été exécuté ni qu'il est sans vulnérabilités.
- Les documents d'architecture dans le dépôt se déclarent documents de travail et ne remplacent pas les tomes maîtres.

## 3. Évaluation et décisions recommandées

### À conserver
- La base Next.js/TypeScript et la vitrine existante, sous réserve de tests.
- La branche de travail dédiée `architecture-v0-1`.
- Les documents de cadrage existants comme documents provisoires et traçables.
- L'espace « Nous rejoindre » comme prototype public, avec une mention claire tant que les offres et candidatures ne sont pas raccordées.

### À corriger ou vérifier en priorité
1. **Reproductibilité des dépendances :** produire un `package-lock.json` cohérent, vérifier lint/build à partir de celui-ci, puis faire évoluer la CI vers `npm ci`. Ne pas mettre à jour les versions de dépendances sans besoin établi et contrôle du diff.
2. **Cartographie des déploiements :** identifier quel projet Vercel utilise le Next.js et quels projets éventuels servent encore les fichiers statiques historiques. Ne changer aucune configuration avant cette cartographie.
3. **Parcours et formulaires :** recenser les boutons, liens et formulaires visibles et qualifier chacun : navigation fonctionnelle, démonstration locale, ou fonction connectée.
4. **Modèle métier :** confronter les exigences aux tomes de référence avant toute décision irréversible sur les tables et les relations.
5. **Environnement données :** identifier et confirmer le projet Supabase DEV avant toute connexion, migration ou test modifiant des données.
6. **Sécurité :** auditer les dépendances et définir les tests d'accès inter-tenant avant d'introduire des données client.

### À ne pas faire à ce stade
- Ne pas supprimer les fichiers historiques.
- Ne pas créer de migration de base de données sur la base des seuls documents provisoires.
- Ne pas connecter une base Supabase dont l'environnement n'a pas été explicitement vérifié.
- Ne pas modifier les projets, domaines ou réglages Vercel.
- Ne pas présenter les exemples d'opportunités ou les formulaires de démonstration comme des fonctions opérationnelles.

## 4. Séquence d'exécution retenue

1. Stabiliser l'installation et les contrôles automatisés (lockfile, lint, build).
2. Compléter l'inventaire des parcours de la vitrine et des liens/formulaires.
3. Établir la correspondance entre exigences métier, écrans et fonctions attendues.
4. Valider le modèle de données et les règles d'accès avec les documents faisant autorité.
5. Implémenter une première fonction métier persistante, limitée et testable, après confirmation de l'environnement DEV.
6. Vérifier les parcours de bout en bout avant tout déploiement.

## 5. Limites de cet audit

Cet audit est basé sur les fichiers lus dans la branche indiquée et sur les résultats de CI précédemment observés. Il ne constitue pas un test fonctionnel complet, un audit de sécurité exhaustif, une validation des projets Vercel ni une validation des tomes maîtres. Tout élément non directement vérifié reste signalé comme tel.
