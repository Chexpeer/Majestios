import { notFound } from "next/navigation";
import SiteHub from "@/components/site-hub";
import { findSiteNode } from "@/data/site-tree";

type Props = { params: Promise<{ slug: string[] }> };

export default async function EmploymentSubpage({ params }: Props) {
  const { slug } = await params;
  const pathname = "/emploi/" + slug.join("/");
  const found = findSiteNode(pathname);
  if (!found) notFound();
  return <SiteHub
    pathname={pathname}
    intro={found.node.description}
    eyebrow="MAJESTIOS · PARCOURS EMPLOI"
    checklist={[
      "Vérifier l’émetteur, la date et la source de toute information publiée.",
      "Distinguer les informations confirmées des éléments qui restent à préciser.",
      "Ne transmettre aucun CV ni donnée personnelle par un formulaire qui n’a pas été sécurisé et activé."
    ]}
  />;
}
