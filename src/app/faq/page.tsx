import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "FAQ — Questions fréquentes | MajestiOS",
  description: "Réponses simples sur MajestiOS, les appels d’offres, la prospection, les études de marché, les données et les fonctionnalités en préparation.",
};

const sections = [
  {
    id: "decouvrir",
    title: "1. Comprendre MajestiOS",
    items: [
      ["À quoi sert MajestiOS ?", "MajestiOS est une plateforme professionnelle en développement. Son objectif est d’aider les entreprises à repérer des occasions de faire des affaires, trouver les bons contacts et mieux organiser leurs actions commerciales."],
      ["À qui s’adresse MajestiOS ?", "Aux entreprises, indépendants, consultants et équipes commerciales qui veulent trouver des clients, explorer de nouveaux marchés ou développer des partenariats."],
      ["Quel problème la plateforme cherche-t-elle à résoudre ?", "Les informations utiles sont souvent dispersées. MajestiOS veut aider à les réunir, à comprendre ce qu’elles signifient et à décider quoi faire ensuite."],
      ["MajestiOS est-il un réseau social ou un annuaire ?", "Non. Les annonces et les contacts peuvent faire partie des sources, mais l’objectif est plus large : aider à repérer une occasion, la comprendre et préparer une action commerciale."],
      ["Que signifie « opportunité commerciale » ?", "Cela peut être un nouveau client, un appel d’offres, une mission, un fournisseur, un partenaire ou un marché à explorer."],
      ["Toutes les fonctions sont-elles déjà disponibles ?", "Non. Le site présente à la fois les fonctions déjà reliées et celles qui sont prévues. Les pages précisent leur état lorsqu’un service n’est pas encore opérationnel."],
    ],
  },
  {
    id: "appels-offres",
    title: "2. Appels d’offres publics et privés",
    items: [
      ["Où consulter les appels d’offres publics ?", "Ouvrez la rubrique « Appels d’offres publics ». Le site utilise actuellement une source reliée au BOAMP. Pour chaque annonce, vérifiez toujours l’avis officiel et ses éventuelles mises à jour."],
      ["Les annonces publiques sont-elles toutes présentes ?", "Nous ne pouvons pas garantir une couverture complète. Les résultats dépendent de la source reliée et des informations qu’elle publie."],
      ["Les appels d’offres privés sont-ils tous recensés ?", "Non. La couverture des appels d’offres privés dépend des sources disponibles et des autorisations nécessaires. Les exemples de présentation ne doivent pas être pris pour de véritables offres."],
      ["Comment vérifier une annonce ?", "Consultez le lien vers la source d’origine, vérifiez la date limite, les documents demandés et les coordonnées de l’acheteur. En cas de différence, le document officiel fait foi."],
      ["MajestiOS répond-il automatiquement à ma place ?", "Non. Le site ne dépose pas automatiquement une candidature. L’entreprise reste responsable de son dossier, de ses pièces et de son envoi dans les délais."],
      ["Que faire si une annonce semble ancienne ou incorrecte ?", "Vérifiez-la auprès de la source officielle avant d’agir. Une annonce peut être modifiée, annulée ou clôturée après sa première publication."],
    ],
  },
  {
    id: "prospection",
    title: "3. Prospection commerciale",
    items: [
      ["À quoi sert la prospection ?", "Elle consiste à rechercher les entreprises susceptibles d’avoir besoin de vos services, puis à préparer une prise de contact utile et adaptée."],
      ["Comment définir ma cible ?", "Commencez par préciser votre activité, les types d’entreprises recherchées, leur secteur, leur zone géographique et le besoin auquel vous répondez."],
      ["MajestiOS fournit-il déjà une liste complète de prospects vérifiés ?", "Pas à ce stade. La recherche et l’enrichissement automatisés font partie des fonctions prévues, mais ne sont pas présentés ici comme un service complet déjà disponible."],
      ["L’IA peut-elle trouver le bon décideur ?", "L’IA pourra aider à rechercher et organiser les informations. Son résultat devra être vérifié : un nom, un poste ou une coordonnée ne doit jamais être considéré comme exact sans contrôle."],
      ["La prospection téléphonique est-elle déjà intégrée ?", "La prospection assistée par téléphone fait partie des pistes importantes du projet, mais il ne faut pas la considérer comme opérationnelle tant que les outils et les services nécessaires ne sont pas raccordés et testés."],
      ["Puis-je utiliser les informations trouvées pour contacter quelqu’un ?", "Vous devez vérifier l’exactitude des informations et respecter les règles applicables à la prospection, à la protection des données et aux oppositions des personnes contactées."],
    ],
  },
  {
    id: "etudes-de-marche",
    title: "4. Études de marché",
    items: [
      ["À quoi sert une étude de marché ?", "Elle aide à comprendre les clients possibles, les concurrents, les tendances et les occasions de développement dans un secteur ou une région."],
      ["Que faut-il préciser avant de commencer ?", "Le secteur étudié, la zone géographique, le type de client recherché, la période et la décision que vous souhaitez préparer."],
      ["MajestiOS génère-t-il déjà une étude complète automatiquement ?", "Non. La page présente le fonctionnement envisagé. Le moteur complet d’étude de marché n’est pas déclaré opérationnel à ce stade."],
      ["Comment vérifier une conclusion ou un chiffre ?", "Il faut pouvoir retrouver la source, sa date et le contexte. Une estimation ou une hypothèse doit être clairement distinguée d’un chiffre confirmé."],
      ["Une étude peut-elle garantir le succès commercial ?", "Non. Elle peut aider à prendre une décision mieux informée, mais elle ne garantit ni la demande, ni les ventes, ni les résultats futurs."],
    ],
  },
  {
    id: "accompagnement-appels-offres",
    title: "5. Préparer une réponse à un appel d’offres",
    items: [
      ["Comment MajestiOS prévoit-il d’aider ?", "Le parcours envisagé doit aider à comprendre la demande, vérifier si elle correspond à votre entreprise et préparer la liste des documents et des dates importantes."],
      ["Que faut-il vérifier avant de répondre ?", "Les conditions de participation, les pièces demandées, les critères de choix, les questions éventuelles à poser et la date limite de dépôt."],
      ["Puis-je envoyer le dossier préparé par MajestiOS sans le relire ?", "Non. Chaque document doit être relu et validé par votre entreprise. Les consignes de l’acheteur et le dossier officiel restent la référence."],
      ["MajestiOS assure-t-il le dépôt officiel de la candidature ?", "Non. Aucun dépôt automatique de candidature n’est annoncé comme disponible."],
    ],
  },
  {
    id: "reseaux",
    title: "6. Réseaux et partenaires",
    items: [
      ["À quoi sert la rubrique Réseaux ?", "Elle présente les types de professionnels et d’organisations avec lesquels des collaborations pourraient être utiles : experts, prestataires, partenaires technologiques ou opérateurs."],
      ["Les partenaires affichés sont-ils déjà tous vérifiés ?", "Non. Cette rubrique décrit les catégories de coopération recherchées ; elle ne constitue pas encore un annuaire complet de partenaires validés."],
      ["Comment proposer une collaboration ?", "Vous pouvez consulter la page « Nous rejoindre » pour découvrir le parcours de contact actuellement proposé."],
      ["Une mise en relation est-elle garantie ?", "Non. Une mise en relation future dépendra de la disponibilité des profils, de la vérification des informations et de l’accord des personnes concernées."],
    ],
  },
  {
    id: "compte",
    title: "7. Compte, demandes et confidentialité",
    items: [
      ["Comment demander des informations à MajestiOS ?", "Consultez la page « Nous rejoindre » ou les moyens de contact affichés sur le site. Si un formulaire est proposé, remplissez uniquement les champs nécessaires."],
      ["Les formulaires peuvent-ils demander des informations confidentielles ?", "N’envoyez pas de mots de passe, de données bancaires, de secrets commerciaux ni de documents confidentiels dans un formulaire général."],
      ["Que devient une demande envoyée depuis un formulaire ?", "Le formulaire concerné indique, lorsqu’elle est disponible, la destination de la demande. Vérifiez cette information avant l’envoi et évitez d’inclure des données inutiles."],
      ["Que faire si un formulaire ne fonctionne pas ?", "Vérifiez les champs obligatoires et réessayez. Si le problème continue, utilisez un autre moyen de contact affiché sur le site, s’il est disponible."],
    ],
  },
  {
    id: "ia-fiabilite",
    title: "8. Intelligence artificielle, sources et fiabilité",
    items: [
      ["L’IA de MajestiOS peut-elle se tromper ?", "Oui. Elle peut mal interpréter une information, manquer un élément ou produire une réponse inexacte. Les décisions importantes doivent reposer sur des informations vérifiées."],
      ["Comment distinguer un fait d’une hypothèse ?", "Un fait doit pouvoir être relié à une source consultable. Une estimation, une suggestion ou une hypothèse doit être présentée comme telle."],
      ["MajestiOS recherche-t-il des opportunités sur tout le Web ?", "La recherche à partir de plusieurs sources fait partie de l’évolution envisagée. Il ne faut pas supposer que toutes les sources du Web sont déjà couvertes."],
      ["Les résultats seront-ils disponibles en plusieurs langues ?", "Le projet prévoit une approche bilingue et une ouverture internationale progressive. La couverture réelle dépendra des sources, des langues et des fonctions effectivement raccordées."],
      ["Comment savoir si une fonction est disponible ?", "Lisez la mention d’état sur la page concernée. En cas de doute, considérez la fonction comme en préparation jusqu’à confirmation explicite de sa disponibilité."],
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="public-site concept-page">
      <PublicHeader />
      <section className="how-section concept-hero">
        <div>
          <span className="section-label">AIDE ET INFORMATIONS</span>
          <h1>Vos questions, <em>nos réponses.</em></h1>
          <p>Cette FAQ explique MajestiOS avec des mots simples : à quoi sert la plateforme, comment les services doivent fonctionner et quelles fonctions restent à construire. Nous indiquons clairement ce qui est disponible et ce qui est encore prévu.</p>
        </div>
      </section>
      <section className="concept-principles">
        <h2>Choisissez votre sujet</h2>
        <p>Vous pouvez accéder directement à la rubrique qui vous intéresse.</p>
        <div className="route-actions">
          {sections.map((section) => <a className="search-submit concept-cta" key={section.id} href={`#${section.id}`}>{section.title}</a>)}
        </div>
      </section>
      {sections.map((section) => (
        <section className="concept-principles" id={section.id} key={section.id}>
          <h2>{section.title}</h2>
          {section.items.map(([question, answer]) => (
            <article className="faq-item" key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </section>
      ))}
      <section className="concept-principles">
        <h2>Vous ne trouvez pas votre réponse ?</h2>
        <p>Parcourez les services présentés ou contactez-nous par le parcours disponible sur le site. Si une fonction est encore en préparation, nous préférons vous le dire clairement plutôt que de vous promettre un service qui n’est pas prêt.</p>
        <div className="route-actions">
          <Link className="search-submit concept-cta" href="/developpement-commercial">Découvrir les services</Link>
          <Link className="search-submit concept-cta" href="/nous-rejoindre">Nous rejoindre</Link>
        </div>
      </section>
    </main>
  );
}
