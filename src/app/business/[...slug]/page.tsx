import { notFound, redirect } from "next/navigation";
import SiteHub from "@/components/site-hub";
import { findSiteNode } from "@/data/site-tree";
type Props = { params: Promise<{ slug: string[] }> };
export default async function BusinessSubpage({ params }: Props) {
  const { slug } = await params;
  const pathname = "/business/" + slug.join("/");
  if (pathname === "/business/radar-bodacc") redirect("/business/veille-bodacc");
  const found = findSiteNode(pathname);
  if (!found) notFound();
  return <SiteHub pathname={pathname} intro={found.node.description} checklist={["Identifier la source initiale et la date de l’information.", "Distinguer les faits publiés des hypothèses de prospection.", "Vérifier tout point réglementaire sur une source officielle avant décision."]} />;
}
