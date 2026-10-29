"use client";

import Link from "next/link";

type ResourceCard = {
  label: string;
  title: string;
  description: string;
  action: string;
  href: string;
  kind: "GUIDE" | "BONNES PRATIQUES" | "OUTIL";
};

type ResourceScope = "accueil" | "opportunites" | "marches-publics" | "marches-prives" | "salons" | "emploi" | "business" | "reseaux" | "sources" | "prospection" | "general";

const resources: Record<ResourceScope, ResourceCard[]> = {
  accueil: [
    { label: "GUIDE", title: "Lire un signal commercial", description: "Comprendre comment un avis, une évolution d’entreprise ou un événement peut révéler une piste commerciale à vérifier.", action: "Comprendre la méthode", href: "/comprendre/concept", kind: "GUIDE" },
    { label: "BONNES PRATIQUES", title: "Qualifier avant de contacter", description: "Vérifier la source, la date et la pertinence d’une information avant de contacter une entreprise.", action: "Voir les repères", href: "/comprendre/faq", kind: "BONNES PRATIQUES" },
    { label: "OUTIL", title: "Trouver les sources utiles", description: "Retrouver les sources utiles et conserver l’origine des informations.", action: "Explorer les sources", href: "/developpement-commercial/etudes-de-marche/sources", kind: "OUTIL" },
  ],
  opportunites: [
    { label: "GUIDE", title: "Qualifier un appel d’offres", description: "Vérifier l’objet, les critères, le territoire et les échéances avant de décider de se positionner.", action: "Explorer les marchés publics", href: "/opportunites/marches-publics", kind: "GUIDE" },
    { label: "BONNES PRATIQUES", title: "Vérifier une opportunité privée", description: "Contrôler l’émetteur, l’autorisation de diffusion et les conditions de réponse.", action: "Explorer les marchés privés", href: "/opportunites/marches-prives", kind: "BONNES PRATIQUES" },
    { label: "OUTIL", title: "Repérer les signaux d’entreprise", description: "Relier les publications et événements à une hypothèse commerciale qui reste à vérifier.", action: "Ouvrir le radar entreprises", href: "/opportunites/radar-entreprises", kind: "OUTIL" },
  ],
  "marches-publics": [
    { label: "GUIDE", title: "Décrypter un avis de marché", description: "Repérer l’objet, l’acheteur, les critères, les pièces demandées et l’échéance à confirmer dans le dossier original.", action: "Consulter le guide", href: "/developpement-commercial/accompagnement-appels-offres/preparer", kind: "GUIDE" },
    { label: "BONNES PRATIQUES", title: "Vérifier avant de répondre", description: "Contrôler les conditions d’accès, les capacités exigées, les documents et la date limite auprès de la source officielle.", action: "Préparer une réponse conforme", href: "/developpement-commercial/accompagnement-appels-offres/preparer", kind: "BONNES PRATIQUES" },
    { label: "OUTIL", title: "Recherche ciblée", description: "Affiner les critères, documenter les sources et transformer un avis pertinent en prochaine action commerciale.", action: "Lancer la recherche", href: "/opportunites/marches-publics", kind: "OUTIL" },
  ],
  "marches-prives": [
    { label: "GUIDE", title: "Comprendre une consultation privée", description: "Identifier l’émetteur, le besoin, les conditions de réponse et les informations effectivement autorisées à la diffusion.", action: "Comprendre la démarche", href: "/opportunites/marches-prives/secteur", kind: "GUIDE" },
    { label: "BONNES PRATIQUES", title: "Publier avec autorisation", description: "Vérifier l’origine, l’actualité et les droits de diffusion avant de partager une opportunité privée.", action: "Lire les repères", href: "/opportunites/marches-prives/deposer", kind: "BONNES PRATIQUES" },
    { label: "OUTIL", title: "Préparer son positionnement", description: "Décrire son intérêt et préparer les informations nécessaires avant l’activation du parcours sécurisé.", action: "Préparer ma demande", href: "/creer-espace?intention=opportunite&source=opportunites-privees", kind: "OUTIL" },
  ],
  salons: [
    { label: "GUIDE", title: "Préparer un salon professionnel", description: "Définir les objectifs, les acteurs à rencontrer et les questions à poser avant l’événement.", action: "Consulter le calendrier", href: "/opportunites/salons/calendrier", kind: "GUIDE" },
    { label: "BONNES PRATIQUES", title: "Choisir les événements utiles", description: "Croiser le secteur, le territoire, le programme et le profil des participants attendus.", action: "Explorer par secteur", href: "/opportunites/salons/secteur", kind: "BONNES PRATIQUES" },
    { label: "OUTIL", title: "Suivre les événements utiles", description: "Vérifier les informations officielles et préparer un suivi après les rencontres.", action: "Explorer par région", href: "/opportunites/salons/region", kind: "OUTIL" },
  ],
  emploi: [
    { label: "GUIDE", title: "Présenter ses compétences", description: "Structurer un profil autour des compétences, expériences, secteurs et résultats utiles à une mission.", action: "Explorer les métiers", href: "/opportunites/emploi/metiers", kind: "GUIDE" },
    { label: "BONNES PRATIQUES", title: "Évaluer une mission", description: "Clarifier le périmètre, le statut, les livrables, les conditions et le niveau d’engagement avant de candidater.", action: "Consulter les conseils", href: "/opportunites/emploi/conseils", kind: "BONNES PRATIQUES" },
    { label: "OUTIL", title: "Filtrer les missions", description: "Croiser famille de métier, type de contrat, zone géographique et organisation du travail.", action: "Rechercher une mission", href: "/opportunites/emploi", kind: "OUTIL" },
  ],
  business: [
    { label: "GUIDE", title: "Lire un signal d’entreprise", description: "Distinguer une publication administrative d’un besoin commercial qui reste à confirmer.", action: "Consulter la méthode", href: "/business/radar-bodacc", kind: "GUIDE" },
    { label: "BONNES PRATIQUES", title: "Vérifier avant de prospecter", description: "Revenir à la source, vérifier la date et éviter de déduire une intention d’achat sans élément suffisant.", action: "Préparer un ciblage vérifiable", href: "/developpement-commercial/prospection/ciblage", kind: "BONNES PRATIQUES" },
    { label: "OUTIL", title: "Organiser ses sources", description: "Conserver les sources et distinguer les faits des pistes commerciales à vérifier.", action: "Explorer les sources", href: "/developpement-commercial/etudes-de-marche/sources", kind: "OUTIL" },
  ],
  reseaux: [
    { label: "GUIDE", title: "Préparer une mise en relation", description: "Formuler clairement la complémentarité recherchée et le bénéfice possible pour chaque partie.", action: "Comprendre le réseau", href: "/reseaux/annuaire", kind: "GUIDE" },
    { label: "BONNES PRATIQUES", title: "Définir les modalités de participation", description: "Clarifier les compétences proposées, les règles de mise en relation et les conditions de partage du profil.", action: "Découvrir comment rejoindre", href: "/reseaux/rejoindre", kind: "BONNES PRATIQUES" },
    { label: "OUTIL", title: "Identifier les bons relais", description: "Explorer les pôles du réseau pour trouver les compétences et ressources adaptées à une opportunité.", action: "Explorer les événements", href: "/reseaux/evenements", kind: "OUTIL" },
  ],
  sources: [
    { label: "GUIDE", title: "Construire une recherche fiable", description: "Définir une question, choisir des sources fiables et noter la date de chaque information.", action: "Voir la méthodologie", href: "/developpement-commercial/etudes-de-marche/methodologie", kind: "GUIDE" },
    { label: "BONNES PRATIQUES", title: "Vérifier plusieurs sources", description: "Privilégier les sources primaires et distinguer faits, estimations et hypothèses.", action: "Lire les repères", href: "/comprendre/faq", kind: "BONNES PRATIQUES" },
    { label: "OUTIL", title: "Répertoire de sources", description: "Retrouver les sources utilisées pour une étude de marché.", action: "Ouvrir les sources", href: "/developpement-commercial/etudes-de-marche/sources", kind: "OUTIL" },
  ],
  prospection: [
    { label: "GUIDE", title: "Construire un argumentaire pertinent", description: "Relier un fait vérifiable à une valeur concrète pour l’entreprise, sans supposer ses besoins internes.", action: "Préparer son argumentaire", href: "/developpement-commercial/prospection/argumentaires", kind: "GUIDE" },
    { label: "BONNES PRATIQUES", title: "Suivre sans sur-solliciter", description: "Consigner les échanges, interpréter prudemment les signaux et respecter les préférences de contact.", action: "Voir les repères", href: "/developpement-commercial/prospection/suivi", kind: "BONNES PRATIQUES" },
    { label: "OUTIL", title: "Étudier son marché", description: "Structurer une recherche à partir d’une question, d’un territoire, d’une cible et de sources croisées.", action: "Accéder à la méthodologie", href: "/developpement-commercial/etudes-de-marche/methodologie", kind: "OUTIL" },
  ],
  general: [
    { label: "GUIDE", title: "Comprendre la démarche MajestiOS", description: "Découvrir comment les informations, les entreprises et les contacts se relient pour développer son activité.", action: "Comprendre MajestiOS", href: "/comprendre/concept", kind: "GUIDE" },
    { label: "BONNES PRATIQUES", title: "Agir sur une information vérifiée", description: "Contrôler la source, la date et le contexte avant de prendre une décision ou de contacter un acteur.", action: "Consulter la FAQ", href: "/comprendre/faq", kind: "BONNES PRATIQUES" },
    { label: "OUTIL", title: "Explorer les rubriques", description: "Accéder aux espaces documentaires, aux opportunités et aux ressources de développement commercial.", action: "Voir les opportunités", href: "/opportunites", kind: "OUTIL" },
  ],
};

const scopeTitles: Record<ResourceScope, string> = {
  accueil: "Des ressources utiles pour passer à l’action",
  opportunites: "Des repères pour examiner les offres",
  "marches-publics": "Mieux comprendre et qualifier les marchés publics",
  "marches-prives": "Les bons repères pour les opportunités privées",
  salons: "Préparer ses visites de salons professionnels",
  emploi: "Des ressources pour préparer votre prochaine mission",
  business: "Des repères pour comprendre les informations sur les entreprises",
  reseaux: "Les clés d’un réseautage professionnel utile",
  sources: "Méthodes et outils pour vérifier les informations",
  prospection: "Des outils pour une prospection plus pertinente",
  general: "Ressources documentaires et bonnes pratiques",
};

export default function ResourceCards({ scope = "general" }: { scope?: ResourceScope }) {
  const cards = resources[scope] ?? resources.general;
  return (
    <section className="maj-resource-section" aria-labelledby={`maj-resource-title-${scope}`}>
      <div className="maj-resource-heading">
        <div>
          <span className="eyebrow">BIBLIOTHÈQUE MAJESTIOS · SÉLECTION THÉMATIQUE</span>
          <h2 id={`maj-resource-title-${scope}`}>{scopeTitles[scope]}</h2>
          <p>Ces cartes indiquent les contenus prévus. Les articles seront rédigés, vérifiés et publiés progressivement.</p>
        </div>
        <span className="maj-resource-status">Articles en construction</span>
      </div>
      <div className="maj-resource-grid">
        {cards.map((card, index) => (
          <article className="maj-resource-card" key={card.title}>
            <div className="maj-resource-card-top"><span>{String(index + 1).padStart(2, "0")}</span><small>{card.kind}</small></div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <Link href={"/article-en-construction?" + new URLSearchParams({ rubrique: scope, titre: card.title, retour: scope }).toString()}>Article en construction <span aria-hidden="true"> ↗</span></Link>
          </article>
        ))}
      </div>
      <p className="maj-resource-note">Le contenu de ces articles est à définir. Les pages sont conservées dans l’arborescence pour préparer les prochaines contributions.</p>
    </section>
  );
}
