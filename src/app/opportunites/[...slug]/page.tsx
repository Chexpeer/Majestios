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

  // Une URL dynamique ne suffit pas à prouver qu’une annonce ou une fiche existe.
  // Sans enregistrement vérifié ni parcours opérationnel associé, afficher une vraie 404.
  notFound();
}