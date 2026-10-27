import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "FAQ — Questions fréquentes | MajestiOS",
  description: "Comprendre simplement MajestiOS, les appels d’offres, la prospection et les services en préparation.",
};

const sections = [
  {
    id: "decouvrir",
    title: "Découvrir MajestiOS",
    items: [
      ["À quoi sert MajestiOS ?", "MajestiOS a pour objectif d’aider les professionnels à repérer des occasions de développer leur activité : nouveaux clients, marchés, partenaires et projets."],
      ["À qui s’adresse la plateforme ?", "Elle est pensée pour les entreprises, indépendants, consultants et autres professionnels qui souhaitent trouver des opportunités et mieux organiser leur développement commercial."],
      ["Est-ce un réseau social ou un simple annuaire ?", "Non. L’ambition est de réunir plusieurs outils utiles au développement commercial, depuis la recherche d’opportunités jusqu’à la préparation des prochaines actions."],
    ],
  },
  {
    id: "appels-offres",
    title: "Appels d’offres publics et privés",
    items: [
      ["Où trouver les appels d’offres publics ?", "La rubrique Appels d’offres publics permet de consulter les opportunités issues de la source actuellement raccordée au site. Vérifiez toujours les informations et dates sur l’avis officiel."],
      ["Les appels d’offres privés sont-ils tous disponibles ?", "Pas nécessairement. La couverture dépend des sources accessibles et des autorisations de diffusion. Une opportunité ne doit pas être considérée comme exhaustive sans vérification."],
      ["MajestiOS dépose-t-il une candidature à ma place ?", "Non. La plateforme ne dépose pas automatiquement votre dossier. Vous restez responsable de votre candidature et du respect des consignes de l’acheteur."],
    ],
  },
  {
    id: "prospection",
    title: "Prospection commerciale",
    items: [
      ["À quoi sert la prospection commerciale ?", "Elle aide à mieux définir les entreprises à contacter, comprendre leurs besoins possibles et préparer une prise de contact pertinente."],
      ["MajestiOS fournit-il déjà une liste complète de prospects vérifiés ?", "La collecte et l’enrichissement automatisés font partie du périmètre envisagé. Ils ne sont pas présentés ici comme un service entièrement opérationnel. Les coordonnées doivent toujours être vérifiées."],
      ["L’intelligence artificielle peut-elle se tromper ?", "Oui. Une suggestion de l’IA est une aide, pas une garantie. Les informations importantes doivent être vérifiées avant toute décision ou prise de contact."],
    ],
  },
  {
    id: "etudes-de-marche",
    title: "Études de marché",
    items: [
      ["Que permet une étude de marché ?", "Elle aide à mieux comprendre les clients, les concurrents, les tendances et les possibilités dans un secteur ou une zone géographique."],
      ["Les études sont-elles générées automatiquement aujourd’hui ?", "La page décrit le fonctionnement visé. Un moteur d’étude complet n’est pas déclaré opérationnel à ce stade. Les conclusions futures devront être accompagnées de sources et de limites clairement expliquées."],
    ],
  },
  {
    id: "accompagnement-appels-offres",
    title: "Préparer une réponse à un appel d’offres",
    items: [
      ["Comment MajestiOS peut-il aider ?", "Le parcours prévu aide à comprendre la demande, vérifier si elle correspond à votre entreprise et préparer la liste des documents et des dates importantes."],
      ["Les documents générés suffisent-ils pour répondre ?", "Non. Vous devez contrôler les pièces demandées, les délais et les règles dans le dossier officiel. En cas de doute, demandez conseil à un professionnel compétent."],
    ],
  },
  {
    id: "reseaux",
    title: "Réseaux et partenaires",
    items: [
      ["Puis-je contacter directement tous les partenaires affichés ?", "La rubrique Réseaux présente les types de coopération recherchés. Elle ne constitue pas encore un annuaire de partenaires dont tous les profils auraient été vérifiés."],
      ["Comment proposer une collaboration ?", "Vous pouvez commencer par la rubrique Nous rejoindre. Les fonctions de mise en relation seront proposées à mesure que le parcours de contact et le suivi seront disponibles."],
    ],
  },
  {
    id: "compte",
    title: "Compte et espace professionnel",
    items: [
      ["Que faire si j’ai une question sur mon compte ?", "Consultez d’abord les informations de cette FAQ. Si votre question concerne un accès ou une difficulté précise, utilisez les moyens de contact affichés sur le site lorsqu’ils sont disponibles."],
      ["Toutes les fonctionnalités sont-elles déjà disponibles ?", "Non. Certaines pages présentent des services en préparation. Le site doit distinguer clairement les outils disponibles des fonctionnalités encore en cours de conception ou de raccordement."],
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
          <h1>La FAQ <em>MajestiOS.</em></h1>
          <p>Des réponses simples pour comprendre la plateforme, ses services et ce qui est déjà disponible. Si vous découvrez MajestiOS, commencez par les questions ci-dessous.</p>
        </div>
      </section>
      <section className="concept-principles">
        <h2>Choisissez votre sujet</h2>
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
        <h2>Vous souhaitez aller plus loin ?</h2>
        <p>Découvrez les services proposés par MajestiOS ou présentez-nous votre projet.</p>
        <div className="route-actions">
          <Link className="search-submit concept-cta" href="/developpement-commercial">Voir les services</Link>
          <Link className="search-submit concept-cta" href="/nous-rejoindre">Nous rejoindre</Link>
        </div>
      </section>
    </main>
  );
}
