import Link from "next/link";

export const metadata = {
  title: "FAQ — Comprendre MajestiOS et ses services",
  description:
    "Comprendre l’intelligence commerciale proactive de MajestiOS, les appels d’offres, la prospection inversée, la qualification des entreprises et les services en préparation.",
};

const sections = [
  {
    id: "majestion",
    number: "01",
    title: "Comprendre MajestiOS",
    intro: "Le principe, les utilisateurs concernés et la valeur recherchée.",
    items: [
      {
        q: "Qu’est-ce que MajestiOS, concrètement ?",
        a: "MajestiOS est conçu comme un outil d’intelligence commerciale proactive. Il doit rapprocher des informations dispersées — appels d’offres, actualités d’entreprises, besoins de recrutement, données sectorielles et contacts professionnels — pour aider une entreprise à repérer les occasions pertinentes et à décider quelle action commerciale engager.",
      },
      {
        q: "En quoi MajestiOS est-il différent d’un annuaire ou d’un tableau de bord ?",
        a: "Un annuaire donne des coordonnées et un tableau de bord affiche des indicateurs. MajestiOS vise un parcours plus opérationnel : détecter une opportunité, vérifier sa pertinence, identifier l’entreprise et les interlocuteurs utiles, préparer la prise de contact, puis capitaliser sur le résultat.",
      },
      {
        q: "À qui s’adresse le service ?",
        a: "Aux dirigeants de TPE et PME, indépendants et équipes commerciales qui veulent développer leur activité, trouver de nouveaux débouchés ou mieux exploiter les signaux présents sur leur marché.",
      },
      {
        q: "Que signifie la prospection inversée ?",
        a: "Au lieu de partir uniquement d’une liste de prospects pour leur proposer une offre, on part d’un signal concret : un marché publié, une entreprise qui évolue, un besoin qui apparaît ou un projet identifiable. On recherche ensuite quelles entreprises peuvent répondre à ce besoin et comment les contacter utilement.",
      },
      {
        q: "Quelle est la méthode MajestiOS ?",
        a: "Le parcours est structuré en six étapes complémentaires : Détecter, Qualifier, Identifier, Contacter, Transformer et Capitaliser. Ce cycle représente la logique du service ; il ne signifie pas que chaque automatisation est déjà active.",
      },
    ],
  },
  {
    id: "opportunites",
    number: "02",
    title: "Appels d’offres et opportunités",
    intro: "Comprendre les sources, les annonces et les vérifications nécessaires.",
    items: [
      {
        q: "Pourquoi commencer par les appels d’offres ?",
        a: "Un appel d’offres rend visible un besoin exprimé : prestation, fourniture, travaux ou service. Il peut constituer un point de départ concret pour identifier le marché concerné, vérifier si une entreprise est en mesure d’y répondre et repérer d’autres acteurs susceptibles de participer au projet.",
      },
      {
        q: "Quelle est la différence entre un marché public et un marché privé ?",
        a: "Un marché public relève d’un acheteur public et de règles de commande publique. Un marché privé est lancé par une entreprise ou un autre acheteur privé ; sa diffusion et ses modalités peuvent être différentes. Dans les deux cas, il faut contrôler les conditions, les pièces demandées et la date limite.",
      },
      {
        q: "Les annonces visibles couvrent-elles tous les marchés ?",
        a: "Non, aucune couverture exhaustive ne doit être présumée. Elle dépend des sources effectivement raccordées, de leurs données et de leurs conditions d’accès. Une recherche doit être complétée par une vérification auprès de l’acheteur ou de la source d’origine.",
      },
      {
        q: "Comment savoir si une annonce est toujours valable ?",
        a: "Vérifiez la date limite, le statut de la consultation, les éventuels avis rectificatifs et les documents officiels. En cas de divergence, la source de l’acheteur fait référence.",
      },
      {
        q: "MajestiOS peut-il repérer des entreprises autour d’un marché remporté ?",
        a: "C’est un axe important de l’intelligence commerciale envisagée : analyser les entreprises concernées par un marché pour rechercher des besoins connexes, des sous-traitants ou des fournisseurs potentiels. La disponibilité de cette analyse dépend des données et des fonctions réellement opérationnelles.",
      },
      {
        q: "MajestiOS dépose-t-il automatiquement une réponse à ma place ?",
        a: "Non. Ne considérez pas une candidature comme déposée ni un dossier comme validé par le seul fait d’utiliser le site. L’entreprise doit contrôler les exigences, valider les pièces et effectuer le dépôt selon la procédure de l’acheteur.",
      },
    ],
  },
  {
    id: "qualification",
    number: "03",
    title: "Qualification et ciblage commercial",
    intro: "Passer d’une information repérée à une cible réellement pertinente.",
    items: [
      {
        q: "Que signifie qualifier une opportunité ?",
        a: "C’est vérifier si l’occasion correspond à votre offre et si elle mérite une action. On peut notamment examiner le secteur, la zone géographique, le besoin, le calendrier, les conditions d’accès et les éléments qui restent à confirmer.",
      },
      {
        q: "Comment définir les entreprises que je souhaite prospecter ?",
        a: "Décrivez votre activité, les produits ou services que vous proposez, les secteurs visés, votre zone d’intervention et le type de client recherché. Plus ces critères sont précis, plus il devient possible de distinguer les cibles prioritaires des résultats peu pertinents.",
      },
      {
        q: "Comment identifier le bon interlocuteur ?",
        a: "Il faut rapprocher l’entreprise, son activité, le besoin repéré et la fonction susceptible de décider ou d’instruire le sujet. Les noms, fonctions et coordonnées obtenus à partir de données publiques ou d’outils d’IA doivent être vérifiés avant toute prise de contact.",
      },
      {
        q: "Une entreprise qui refuse une proposition doit-elle être écartée définitivement ?",
        a: "Pas nécessairement. Un refus peut concerner une offre, un moment ou un besoin précis. Il faut conserver un historique clair et respecter toute opposition à la prospection. Un refus ne doit jamais être interprété comme une autorisation de recontacter sans limite.",
      },
      {
        q: "Les scores ou recommandations garantissent-ils qu’un prospect achètera ?",
        a: "Non. Une qualification aide à hiérarchiser les efforts ; elle ne garantit ni un intérêt réel, ni une réponse, ni une vente. Les critères et les informations utilisés doivent rester compréhensibles et vérifiables.",
      },
    ],
  },
  {
    id: "prospection",
    number: "04",
    title: "Prise de contact et développement commercial",
    intro: "Transformer une cible pertinente en échange professionnel.",
    items: [
      {
        q: "Que doit apporter une prise de contact efficace ?",
        a: "Elle doit être liée au contexte de l’entreprise contactée : un besoin repéré, un projet, une activité ou une difficulté à laquelle votre offre peut répondre. Un message générique envoyé sans qualification est généralement moins utile qu’une approche documentée et ciblée.",
      },
      {
        q: "MajestiOS contacte-t-il déjà automatiquement les entreprises ?",
        a: "Ne présumez pas que l’envoi automatisé, le suivi des ouvertures ou la prise de contact téléphonique sont actifs. Ces fonctions nécessitent des outils connectés, des réglages, des contrôles et le respect des règles applicables. Seules les fonctions explicitement indiquées comme disponibles doivent être considérées comme opérationnelles.",
      },
      {
        q: "Qui reste responsable du message envoyé ?",
        a: "L’entreprise qui engage la démarche doit vérifier le destinataire, la pertinence du message, les informations utilisées et le respect des règles applicables. L’assistance logicielle ne remplace pas cette responsabilité.",
      },
      {
        q: "MajestiOS peut-il garantir de nouveaux clients ?",
        a: "Non. L’objectif est d’améliorer la détection, le ciblage et la préparation des démarches commerciales. Le résultat dépend notamment du marché, de l’offre, du prix, du calendrier et de la réponse des prospects.",
      },
    ],
  },
  {
    id: "donnees-ia",
    number: "05",
    title: "Données, intelligence artificielle et fiabilité",
    intro: "Savoir d’où viennent les informations et comment les utiliser.",
    items: [
      {
        q: "Les informations présentées sont-elles toutes vérifiées ?",
        a: "Le niveau de vérification dépend de la source et du traitement réalisé. Une annonce officielle, une donnée issue d’un registre, une information déclarative et une suggestion générée par IA n’ont pas le même statut. La source, la date et les incertitudes doivent être prises en compte avant une décision.",
      },
      {
        q: "L’intelligence artificielle peut-elle se tromper ?",
        a: "Oui. Elle peut résumer incorrectement un document, confondre deux entreprises ou proposer une information inexacte. Les données importantes — coordonnées, critères d’un marché, dates et obligations — doivent être contrôlées auprès de sources fiables.",
      },
      {
        q: "MajestiOS analyse-t-il déjà toutes les sources du Web ?",
        a: "Non. Il ne faut pas supposer que toutes les plateformes, tous les registres ou tous les réseaux sont raccordés. Le périmètre réel dépend des connecteurs disponibles, des autorisations d’accès et de l’état de développement de chaque fonction.",
      },
      {
        q: "Peut-on transmettre des documents confidentiels à un formulaire général ?",
        a: "Évitez d’envoyer des mots de passe, des coordonnées bancaires, des secrets commerciaux ou des pièces confidentielles dans un formulaire général. Avant de transmettre des documents d’entreprise, vérifiez que le parcours est prévu pour cela et que les conditions de traitement sont clairement indiquées.",
      },
      {
        q: "Quelles précautions prendre pour la prospection et les données personnelles ?",
        a: "Vérifiez la pertinence et l’exactitude des données, leur provenance, la base juridique du traitement et les obligations d’information applicables. Respectez les demandes d’opposition et les règles propres au canal utilisé. En cas de doute, consultez les recommandations de la CNIL ou un professionnel compétent.",
      },
    ],
  },
  {
    id: "disponibilite",
    number: "06",
    title: "Disponibilité des services et accompagnement",
    intro: "Faire la différence entre ce qui fonctionne et ce qui est en préparation.",
    items: [
      {
        q: "Toutes les rubriques du site sont-elles déjà opérationnelles ?",
        a: "Non. Certaines rubriques peuvent présenter une orientation ou un parcours prévu sans que toutes les fonctions sous-jacentes soient encore raccordées. Consultez l’état affiché sur la page concernée et ne prenez pas une présentation comme la preuve qu’un service est disponible.",
      },
      {
        q: "Que signifient les mentions d’état ?",
        a: "« Disponible » signifie que la fonction est présentée comme utilisable ; « En attente de données » signifie que le parcours dépend de données ou de sources qui ne sont pas encore disponibles ; « En préparation » indique que la fonction n’est pas encore prête à être utilisée. En cas d’incertitude, demandez confirmation avant de vous appuyer dessus.",
      },
      {
        q: "Où commencer sur le site ?",
        a: "Parcourez les appels d’offres si vous cherchez une consultation, la rubrique Développement commercial pour les démarches de prospection et d’étude de marché, ou Comprendre pour les explications de fond. Les rubriques de navigation doivent vous conduire vers des espaces dédiés, pas seulement vers une présentation générale.",
      },
      {
        q: "Comment proposer une collaboration ou rejoindre le projet ?",
        a: "Consultez la rubrique Emploi et le parcours « Nous rejoindre » pour les possibilités de contribution et de collaboration effectivement présentées.",
      },
      {
        q: "Que faire si une page ou un formulaire ne fonctionne pas ?",
        a: "Ne considérez pas votre demande comme envoyée si aucun accusé de réception ou retour explicite ne le confirme. Réessayez plus tard ou utilisez un moyen de contact clairement affiché et disponible.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="public-site concept-page faq-page">
      <header className="how-section concept-hero faq-hero">
        <div>
          <span className="section-label">CENTRE D’AIDE MAJESTIOS</span>
          <h1>Comprendre. Décider. <em>Agir.</em></h1>
          <p>
            Les réponses essentielles pour comprendre l’intelligence commerciale
            proactive, explorer les opportunités et savoir ce que MajestiOS peut
            réellement vous apporter.
          </p>
          <div className="route-actions faq-hero-actions">
            <Link className="search-submit concept-cta" href="/opportunites">
              Explorer les opportunités
            </Link>
            <Link className="search-submit concept-cta" href="/developpement-commercial">
              Découvrir le développement commercial
            </Link>
          </div>
        </div>
      </header>

      <section className="concept-principles faq-index" aria-labelledby="faq-index-title">
        <div className="faq-section-heading">
          <span className="section-label">ACCÈS RAPIDE</span>
          <h2 id="faq-index-title">Que souhaitez-vous comprendre ?</h2>
          <p>Choisissez un thème. Ouvrez uniquement les réponses qui vous intéressent.</p>
        </div>
        <nav className="faq-topic-grid" aria-label="Thèmes de la FAQ">
          {sections.map((section) => (
            <a className="faq-topic-card" key={section.id} href={`#${section.id}`}>
              <span className="faq-topic-number">{section.number}</span>
              <span className="faq-topic-copy">
                <strong>{section.title}</strong>
                <small>{section.intro}</small>
              </span>
              <span className="faq-topic-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </section>

      <div className="faq-content">
        {sections.map((section) => (
          <section className="concept-principles faq-section" id={section.id} key={section.id}>
            <div className="faq-section-heading">
              <span className="section-label">THÈME {section.number}</span>
              <h2>{section.title}</h2>
              <p>{section.intro}</p>
            </div>
            <div className="faq-questions">
              {section.items.map((item, index) => (
                <details className="faq-item" key={item.q}>
                  <summary>
                    <span className="faq-question-number">{String(index + 1).padStart(2, "0")}</span>
                    <span>{item.q}</span>
                    <span className="faq-toggle" aria-hidden="true">+</span>
                  </summary>
                  <div className="faq-answer"><p>{item.a}</p></div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="concept-principles faq-last-call">
        <span className="section-label">POUR ALLER PLUS LOIN</span>
        <h2>Une question liée à votre activité ?</h2>
        <p>
          Explorez les espaces correspondant à votre besoin. Les fonctions
          présentées comme en préparation ne doivent pas être confondues avec
          des services déjà disponibles.
        </p>
        <div className="route-actions">
          <Link className="search-submit concept-cta" href="/opportunites">
            Appels d’offres et opportunités
          </Link>
          <Link className="search-submit concept-cta" href="/developpement-commercial">
            Développement commercial
          </Link>
          <Link className="search-submit concept-cta" href="/nous-rejoindre">
            Nous rejoindre
          </Link>
        </div>
      </section>
    </main>
  );
}
