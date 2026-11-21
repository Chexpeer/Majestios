// Diagnostic d'orientation « facturation électronique » — règles pures, sans réseau et sans stockage.
// Il oriente, il ne certifie rien : les formulations restent celles de la page publique et renvoient aux sources officielles.

export const OPTIONS = Object.freeze({
  tva: Object.freeze([
    ["assujetti", "Assujetti à la TVA"],
    ["franchise", "En franchise en base de TVA"],
    ["non", "Non assujetti ou activité exonérée"],
    ["inconnu", "Je ne sais pas"]
  ]),
  taille: Object.freeze([
    ["micro", "Micro-entreprise"],
    ["pme", "TPE ou PME"],
    ["eti", "Entreprise de taille intermédiaire"],
    ["ge", "Grande entreprise"]
  ]),
  clients: Object.freeze([
    ["entreprises", "Surtout des entreprises en France"],
    ["particuliers", "Surtout des particuliers"],
    ["mixte", "Les deux"],
    ["etranger", "Des clients à l'étranger"]
  ]),
  outil: Object.freeze([
    ["aucun", "Aucun outil, je fais à la main"],
    ["bureautique", "Un modèle Word, Excel ou PDF"],
    ["logiciel", "Un logiciel de facturation ou de gestion"],
    ["expert", "Mon expert-comptable s'en charge"]
  ])
});

export const DISCLAIMER =
  "Cette orientation est générale et ne remplace ni le simulateur officiel ni l'avis d'un expert-comptable. " +
  "MajestiOS n'est pas une plateforme agréée et le module MajestiOS Facturation n'est pas encore disponible.";

const NEXT_STEPS = Object.freeze([
  "Faire le point : vos flux de facturation, vos clients, vos fournisseurs et vos logiciels actuels.",
  "Choisir l'organisation : un outil compatible, relié à une plateforme agréée adaptée à vos flux.",
  "Préparer la transition : données fiables, circuits de validation, suivi des statuts et des rejets."
]);

function isValid(group, value) {
  return OPTIONS[group].some(([key]) => key === value);
}

/** Retourne `{ ok:false }` si une réponse manque ou est inconnue ; sinon les lignes à afficher. */
export function diagnose(answers = {}) {
  const { tva, taille, clients, outil } = answers;
  if (![["tva", tva], ["taille", taille], ["clients", clients], ["outil", outil]].every(([group, value]) => isValid(group, value))) {
    return { ok: false };
  }

  const lines = [];
  const outOfScope = tva === "non" || tva === "inconnu";

  if (tva === "assujetti") lines.push(["Votre situation", "Vous êtes assujetti à la TVA : la réforme vous concerne, selon vos opérations."]);
  if (tva === "franchise") lines.push(["Votre situation", "Vous êtes en franchise en base de TVA : vous restez concerné selon votre activité et vos opérations. Vérifiez votre cas avec le simulateur officiel."]);
  if (tva === "non") lines.push(["Votre situation", "La réforme vise les entreprises assujetties à la TVA. Si votre activité est hors champ ou exonérée, vérifiez votre cas avec le simulateur officiel avant toute décision."]);
  if (tva === "inconnu") lines.push(["Votre situation", "Confirmez d'abord votre situation au regard de la TVA auprès de votre expert-comptable ou de votre service des impôts."]);

  if (outOfScope) {
    lines.push(["Réception et émission", "À déterminer une fois votre situation TVA confirmée."]);
  } else {
    lines.push(["Réception", "Applicable depuis le 1er septembre 2026 : vous devez pouvoir recevoir les factures électroniques de vos fournisseurs soumis à l'obligation d'émission."]);
    lines.push(["Émission", taille === "micro" || taille === "pme"
      ? "À partir du 1er septembre 2027, avec les obligations d'e-reporting correspondantes."
      : "Déjà applicable depuis le 1er septembre 2026, avec les obligations d'e-reporting applicables."]);

    if (clients === "entreprises" || clients === "mixte") lines.push(["Clients entreprises", "Vos factures aux entreprises établies en France relèvent de la facture électronique, via une plateforme agréée."]);
    if (clients === "particuliers" || clients === "mixte") lines.push(["Clients particuliers", "Les ventes aux particuliers relèvent en général de l'e-reporting (transmission de données) plutôt que de la facture électronique : à vérifier pour votre cas."]);
    if (clients === "etranger") lines.push(["Clients à l'étranger", "Les opérations avec l'étranger relèvent en général de l'e-reporting : à vérifier pour votre cas."]);
  }

  if (outil === "aucun" || outil === "bureautique") lines.push(["Votre outil actuel", "Un PDF ou un tableur ne suffit pas pour émettre une facture électronique réglementaire : il faudra un outil relié à une plateforme agréée."]);
  if (outil === "logiciel") lines.push(["Votre outil actuel", "Demandez à votre éditeur s'il est relié à une plateforme agréée et à quelle échéance : un logiciel de facturation seul ne garantit pas la conformité."]);
  if (outil === "expert") lines.push(["Votre outil actuel", "Demandez à votre expert-comptable quel outil et quelle plateforme agréée il prévoit pour votre dossier."]);

  return { ok: true, lines, nextSteps: [...NEXT_STEPS], disclaimer: DISCLAIMER };
}
