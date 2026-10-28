import { notFound } from "next/navigation";
import SiteHub from "@/components/site-hub";
import { findSiteNode } from "@/data/site-tree";

type Props = { params: Promise<{ slug: string[] }> };

export default async function OpportunityDepthPage({ params }: Props) {
  const { slug } = await params;
  const pathname = "/opportunites/" + slug.join("/");
  const found = findSiteNode(pathname);
  if (found) {
    const checklists: Record<string, string[]> = {
      "/opportunites/marches-publics/travaux": ["Consulter le dossier officiel et vérifier la date limite.", "Contrôler les qualifications, assurances et moyens exigés.", "Décider de se positionner uniquement après lecture des pièces."],
      "/opportunites/marches-publics/services": ["Vérifier le périmètre exact de la prestation.", "Repérer les critères d’attribution et les livrables demandés.", "Contrôler les délais et modalités de remise sur la source officielle."],
      "/opportunites/marches-publics/fournitures": ["Vérifier les spécifications techniques et quantités.", "Contrôler les conditions de livraison et les éventuels échantillons.", "Relire les critères et le calendrier du dossier original."],
      "/opportunites/marches-publics/departement": ["Le filtre géographique sera activé lorsque les données de localisation seront normalisées.", "Vérifier le département sur l’avis original.", "Ne pas déduire une zone d’exécution d’un seul champ incomplet."],
      "/opportunites/marches-prives/secteur": ["Les annonces seront classées après validation de leur source et du droit de diffusion.", "Un secteur affiché ne garantit pas que l’opportunité soit encore ouverte.", "Confirmer les conditions auprès du donneur d’ordre."],
      "/opportunites/marches-prives/deposer": ["Préparer l’identité de l’annonceur et la preuve de son autorisation de publication.", "Ne pas transmettre de données confidentielles dans une annonce publique.", "Chaque dépôt sera soumis à modération avant diffusion."],
      "/opportunites/salons/calendrier": ["Les dates seront affichées uniquement après vérification sur le site officiel de l’organisateur.", "Confirmer le lieu, les horaires et les conditions d’inscription.", "Préparer les objectifs commerciaux avant la visite."],
      "/opportunites/emploi/offres": ["Vérifier l’employeur, la date et la source de l’annonce.", "Lire les conditions du contrat et le lieu de travail.", "Aucune candidature ni aucun CV ne sont collectés tant que le parcours sécurisé n’est pas validé."],
      "/opportunites/emploi/missions": ["Clarifier le périmètre, les livrables et les échéances.", "Vérifier le statut contractuel et les modalités de rémunération.", "Confirmer les informations auprès de l’émetteur de la mission."]
    };
    return <SiteHub pathname={pathname} intro={found.node.description} checklist={checklists[pathname] ?? []} eyebrow="PARCOURS DÉTAILLÉ" />;
  }

  const publicId = slug[0] === "marches-publics" && slug.length === 2 && /^[A-Za-z0-9_-]{1,100}$/.test(slug[1]);
  const publicReply = slug[0] === "marches-publics" && slug.length === 3 && /^[A-Za-z0-9_-]{1,100}$/.test(slug[1]) && slug[2] === "repondre";
  const privateId = slug[0] === "marches-prives" && slug.length === 2 && /^[A-Za-z0-9_-]{1,100}$/.test(slug[1]);
  const privateReply = slug[0] === "marches-prives" && slug.length === 3 && /^[A-Za-z0-9_-]{1,100}$/.test(slug[1]) && slug[2] === "repondre";
  const jobId = slug[0] === "emploi" && slug[1] === "offres" && slug.length === 3 && /^[A-Za-z0-9_-]{1,100}$/.test(slug[2]);
  const jobApply = slug[0] === "emploi" && slug[1] === "offres" && slug.length === 4 && /^[A-Za-z0-9_-]{1,100}$/.test(slug[2]) && slug[3] === "candidater";
  if (!(publicId || publicReply || privateId || privateReply || jobId || jobApply)) notFound();

  const title = publicId ? "Fiche marché public" : publicReply ? "Se positionner sur un marché public" : privateId ? "Fiche opportunité privée" : privateReply ? "Prendre contact pour une opportunité privée" : jobId ? "Fiche offre d’emploi" : "Candidater à une offre";
  const description = publicId ? "Une fiche ne peut être affichée qu’après récupération et vérification de l’avis original." : publicReply ? "Le parcours de réponse sera activé lorsque le dossier officiel et les fonctionnalités de compte seront disponibles." : privateId ? "Les informations d’une opportunité privée ne seront affichées qu’après vérification de la source et de l’autorisation de diffusion." : privateReply ? "Les coordonnées et le formulaire de contact ne seront proposés qu’après contrôle de l’annonce et sécurisation du parcours." : jobId ? "Les détails d’une offre seront affichés uniquement à partir d’une source vérifiable." : "Le parcours de candidature est en préparation. Aucun CV n’est collecté à ce stade.";
  return <SiteHub pathname="/opportunites" eyebrow="FICHE ET PARCOURS" intro={description} checklist={["Aucune donnée fictive n’est affichée comme une annonce réelle.", "La source et l’actualité doivent être vérifiées avant toute décision.", "Ce parcours restera fermé tant que ses contrôles et sa protection des données ne seront pas définis."]} />;
}
