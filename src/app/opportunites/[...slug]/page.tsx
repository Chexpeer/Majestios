import { notFound } from "next/navigation";
import SiteHub from "@/components/site-hub";
import { findSiteNode } from "@/data/site-tree";

type Props = { params: Promise<{ slug: string[] }> };

export default async function OpportunityDepthPage({ params }: Props) {
  const { slug } = await params;
  const pathname = "/opportunites/" + slug.join("/");
  const found = findSiteNode(pathname);

  if (!found) {
    // Une URL dynamique ne suffit pas à prouver qu’une annonce ou une fiche existe.
    // Sans enregistrement vérifié ni parcours opérationnel associé, afficher une vraie 404.
    notFound();
  }

  return (
    <SiteHub
      pathname={pathname}
      intro={found.node.description}
      eyebrow="PARCOURS DÉTAILLÉ"
    />
  );
}
