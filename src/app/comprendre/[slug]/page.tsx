import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHub from "@/components/site-hub";
import { findSiteNode } from "@/data/site-tree";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pathname = "/comprendre/" + slug;
  const found = findSiteNode(pathname);
  const title = found?.node.label ?? "Rubrique";
  const description = found?.node.description ?? "Explorez les ressources et parcours MajestiOS.";
  return { title: `${title} — MajestiOS`, description };
}

export default async function UnderstandingSubpage({ params }: Props) {
  const { slug } = await params;
  const pathname = "/comprendre/" + slug;
  const found = findSiteNode(pathname);
  if (!found) notFound();
  return <SiteHub pathname={pathname} intro={found.node.description} eyebrow="GUIDE MAJESTIOS" checklist={["Les fonctionnalités sont décrites selon leur état réel.", "Les sources externes et les points réglementaires doivent être vérifiés.", "Les fonctions non validées restent signalées comme étant en préparation."]} />;
}
