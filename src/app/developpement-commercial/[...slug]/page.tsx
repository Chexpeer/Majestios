import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHub from "@/components/site-hub";
import { findSiteNode } from "@/data/site-tree";
type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pathname = "/developpement-commercial/" + slug.join("/");
  const found = findSiteNode(pathname);
  const title = found?.node.label ?? "Rubrique";
  const description = found?.node.description ?? "Explorez les ressources et parcours MajestiOS.";
  return { title: `${title} — MajestiOS`, description };
}

export default async function CommercialSubpage({ params }: Props) {
  const { slug } = await params;
  const pathname = "/developpement-commercial/" + slug.join("/");
  const found = findSiteNode(pathname);
  if (!found) notFound();
  return <SiteHub pathname={pathname} intro={found.node.description} checklist={["Formuler l’objectif de la démarche et le résultat attendu.", "Documenter les sources, les hypothèses et les décisions.", "Prévoir une étape de suivi et de capitalisation."]} />;
}
