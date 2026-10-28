import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHub from "@/components/site-hub";
import { findSiteNode } from "@/data/site-tree";

type Props = { params: Promise<{ slug: string[] }> };


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pathname = "/opportunites/" + slug.join("/");
  const found = findSiteNode(pathname);
  const title = found?.node.label ?? "Rubrique";
  const description = found?.node.description ?? "Explorez les ressources et parcours MajestiOS.";
  return { title: `${title} — MajestiOS`, description };
}

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

  const safe = (value?: string) => !!value && /^[A-Za-z0-9_-]{1,100}$/.test(value);
  const publicId = slug[0] === "marches-publics" && slug.length === 2 && safe(slug[1]);
  const publicReply = slug[0] === "marches-publics" && slug.length === 3 && safe(slug[1]) && slug[2] === "repondre";
  const publicDepartment = slug[0] === "marches-publics" && slug[1] === "departement" && slug.length === 3 && safe(slug[2]);
  const privateId = slug[0] === "marches-prives" && slug.length === 2 && safe(slug[1]);
  const privateReply = slug[0] === "marches-prives" && slug.length === 3 && safe(slug[1]) && slug[2] === "repondre";
  const privateSector = slug[0] === "marches-prives" && slug[1] === "secteur" && slug.length === 3 && safe(slug[2]);
  const salonSector = slug[0] === "salons" && slug[1] === "secteur" && slug.length === 3 && safe(slug[2]);
  const salonRegion = slug[0] === "salons" && slug[1] === "region" && slug.length === 3 && safe(slug[2]);
  const salonDetail = slug[0] === "salons" && slug.length === 2 && !["calendrier", "secteur", "region"].includes(slug[1]) && safe(slug[1]);
  const salonSubpage = slug[0] === "salons" && slug.length === 3 && safe(slug[1]) && ["programme", "preparer-sa-visite", "opportunites-liees", "accompagnement"].includes(slug[2]);
  const jobId = slug[0] === "emploi" && slug[1] === "offres" && slug.length === 3 && safe(slug[2]);
  const jobApply = slug[0] === "emploi" && slug[1] === "offres" && slug.length === 4 && safe(slug[2]) && slug[3] === "candidater";
  const jobTrade = slug[0] === "emploi" && slug[1] === "metiers" && slug.length === 3 && safe(slug[2]);
  if (!(publicId || publicReply || publicDepartment || privateId || privateReply || privateSector || salonSector || salonRegion || salonDetail || salonSubpage || jobId || jobApply || jobTrade)) notFound();

  const title = publicId ? "Fiche marché public" : publicReply ? "Se positionner sur un marché public" : publicDepartment ? "Marchés publics par département" : privateId ? "Fiche opportunité privée" : privateReply ? "Prendre contact pour une opportunité privée" : privateSector ? "Opportunités privées par secteur" : salonSector ? "Salons professionnels par secteur" : salonRegion ? "Salons professionnels par région" : salonDetail ? "Fiche salon professionnel" : salonSubpage ? ({ programme: "Programme du salon", "preparer-sa-visite": "Préparer sa visite", "opportunites-liees": "Opportunités liées au salon", accompagnement: "Accompagnement autour du salon" } as Record<string,string>)[slug[2]] : jobId ? "Fiche offre d’emploi" : jobApply ? "Candidater à une offre" : "Métiers et emploi";
  const description = publicId ? "Une fiche ne peut être affichée qu’après récupération et vérification de l’avis original." : publicReply ? "Le parcours de réponse sera activé lorsque le dossier officiel et les fonctionnalités de compte seront disponibles." : publicDepartment ? "Le filtre départemental sera alimenté uniquement avec des données de localisation vérifiées." : privateId ? "Les informations d’une opportunité privée ne seront affichées qu’après vérification de la source et de l’autorisation de diffusion." : privateReply ? "Les coordonnées et le formulaire de contact ne seront proposés qu’après contrôle de l’annonce et sécurisation du parcours." : privateSector ? "Les opportunités seront classées par secteur lorsque les annonces privées auront été validées pour publication." : salonSector ? "Les événements seront classés par secteur après validation auprès des organisateurs officiels." : salonRegion ? "Les événements seront classés par région à partir des lieux confirmés par les organisateurs." : salonDetail ? "La fiche événement sera publiée après validation du nom, des dates et de la source officielle." : salonSubpage ? "Cette rubrique sera alimentée après validation des informations de l’organisateur. Aucun programme ou service n’est inventé." : jobId ? "Les détails d’une offre seront affichés uniquement à partir d’une source vérifiable." : jobApply ? "Le parcours de candidature est en préparation. Aucun CV n’est collecté à ce stade." : "Les contenus métiers seront documentés à partir de sources vérifiables.";
  return <SiteHub pathname={pathname} title={title} eyebrow={title.toUpperCase()} intro={description} checklist={["Aucune donnée fictive n’est affichée comme une annonce réelle.", "La source et l’actualité doivent être vérifiées avant toute décision.", "Les filtres, fiches et formulaires ne seront activés qu’avec des données et des contrôles adaptés."]} />;
}
