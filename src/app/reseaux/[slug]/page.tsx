import { notFound } from "next/navigation";
import SiteHub from "@/components/site-hub";
import { findSiteNode } from "@/data/site-tree";
type Props = { params: Promise<{ slug: string }> };
export default async function NetworkSubpage({ params }: Props) {
  const { slug } = await params;
  const pathname = "/reseaux/" + slug;
  const found = findSiteNode(pathname);
  if (!found) notFound();
  return <SiteHub pathname={pathname} intro={found.node.description} checklist={["Préciser l’objectif de la mise en relation.", "Présenter les informations de manière vérifiable.", "Respecter le consentement et les préférences de contact."]} />;
}
