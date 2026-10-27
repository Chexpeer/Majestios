# MajestiOS — vitrine publique et application professionnelle en construction

**Branche de travail :** `architecture-v0-1`  
**Statut :** prototype d’interface ; le SaaS métier n’est pas encore opérationnel.

## 1. État du dépôt

Le dépôt contient actuellement deux ensembles de fichiers :

- **Application Next.js** sous `src/app`, en TypeScript/React.
- **Fichiers du site statique historique** à la racine, notamment `index.html`, `app.js`, `build.js` et `styles.css`.

La coexistence de ces deux ensembles ne signifie pas qu’ils sont tous deux utilisés par le même déploiement. Ne supprimer ni déplacer les fichiers historiques avant d’avoir confirmé leur usage et la stratégie de déploiement de chaque projet Vercel.

## 2. Fonctions présentes et limites connues

La page d’accueil Next.js présente une recherche d’exemples d’appels d’offres, un bandeau d’opportunités privées et un formulaire de demande de démonstration.

- Les résultats visibles sont des **données d’exemple** ; aucune source d’opportunités n’est encore raccordée.
- Les filtres agissent sur les exemples de l’interface, pas sur une base de données ou sur des sources externes.
- Le formulaire de demande est une démonstration : il ne prouve ni envoi ni enregistrement de la demande.
- Aucun parcours complet de compte client, CRM persistant, connecteur métier ou facturation n’est attesté par ces écrans.
- La route `/api/health` est un contrôle de prototype ; elle indique `databaseConnected: false`.

Ne présenter aucune de ces fonctions comme opérationnelle tant qu’un test fonctionnel de bout en bout ne l’a pas démontré.

## 3. Développement local

Prérequis : Node.js 20 ou version compatible avec les dépendances.

```bash
npm install
npm run dev
```

Ouvrir ensuite `http://localhost:3000`.

Commandes de contrôle :

```bash
npm run lint
npm run build
npm run start
```

Le workflow GitHub Actions exécute ESLint et `next build`. Le dernier contrôle inspecté pour cette branche a réussi, mais cela ne remplace pas des tests fonctionnels, de sécurité ou de connexion aux données.

**Point à corriger :** aucun fichier de verrouillage npm (`package-lock.json`) n’est présent dans la branche inspectée. L’installation n’est donc pas figée et le workflow utilise `npm install`, pas `npm ci`. Ne pas annoncer la chaîne de dépendances comme reproductible avant d’avoir ajouté un verrouillage cohérent et vérifié les builds.

## 4. Déploiement Vercel — décision encore ouverte

Le fichier `vercel.json` actuel déclare `"framework": "nextjs"`. Un aperçu Vercel lié à la branche `architecture-v0-1` a été indiqué comme prêt et sa page d’accueil a répondu en HTTP 200 lors du contrôle. Cela ne valide pas tous les projets Vercel liés au dépôt, ni la production, ni les fonctions métier.

Plusieurs projets Vercel existent dans l’espace du compte et certains déploiements récents sont en erreur. Il faut identifier quel projet correspond à la vitrine publique et lequel doit héberger l’application avant toute modification de configuration.

**Garde-fou :** ne pas modifier les domaines, les projets Vercel historiques ou la production sans stratégie explicitement validée et plan de retour arrière.

## 5. Documentation et autorité des spécifications

Les fichiers sous `docs/architecture` sont des documents de travail. Ils ne remplacent pas les tomes de référence et ne permettent pas, seuls, d’arbitrer le modèle métier.

- `ARCHITECTURE_CIBLE_V0.1.md` — proposition d’architecture.
- `BACK_OFFICE_CRM_ADMIN_V0.1.md` — cadrage du back-office, du CRM et des intégrations.
- `FEUILLE_DE_ROUTE_MVP_V0.1.md` — jalons proposés.
- `MATRICE_CORRESPONDANCE_MODELE_V0.1.md` — correspondance préliminaire.
- `REGISTRE_ECARTS_ET_DECISIONS_V0.1.md` — écarts et décisions ouvertes.
- `docs/veille-appels-offres.md` — cadrage documentaire des sources à étudier, pas preuve de raccordement technique.

Les tomes de référence n’ont pas été identifiés dans l’arborescence inspectée de cette branche. Avant de créer des migrations ou de figer les objets métier, retrouver et confronter les versions faisant autorité.

## 6. Ordre de travail et sécurité

1. Confirmer les tomes de référence et les parcours MVP.
2. Identifier le projet Vercel d’aperçu et celui de production, sans les modifier.
3. Ajouter un fichier de verrouillage des dépendances et examiner l’audit de sécurité.
4. Valider le modèle métier et sa correspondance avec les exigences.
5. Confirmer l’environnement Supabase DEV et son identité avant toute action sur la base.
6. Concevoir puis tester les règles d’accès, notamment les refus d’accès inter-tenant.
7. Ne créer aucune migration définitive et ne déployer aucune modification de production avant validation explicite.

Principes permanents : pas de secret dans le navigateur ou le dépôt ; distinguer les faits, les exemples et les inférences IA ; privilégier les intégrations officiellement autorisées ; auditer les actions d’administration.

---
