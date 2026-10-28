import { notFound } from "next/navigation";
import SiteHub from "@/components/site-hub";
import { findSiteNode } from "@/data/site-tree";

type Props = { params: Promise<{ slug: string[] }> };

export default async function OpportunitySubpage({ params }: Props) {
  const { slug } = await params;
  const pathname = "/opportunites/" + slug.join("/");
  const found = findSiteNode(pathname);
  if (!found) notFound();
  const isDetail = slug.includes("[id]") || slug.some((part) => part === "repondre" || part === "candidater");
  return <SiteHub pathname={pathname} eyebrow={isDetail ? "FICHE ET PARCOURS" : "EXPLORER LES OPPORTUNITÉS"} intro={isDetail ? "Les fiches détaillées et les formulaires seront ouverts uniquement lorsqu’une annonce réelle aura été récupérée et vérifiée côté serveur. Aucune donnée ne doit être inventée à partir d’un identifiant fourni dans l’URL." : found.node.description} checklist={isDetail ? ["Vérifier l’identifiant et retrouver l’annonce dans la source serveur.", "Afficher la source d’origine et sa date lorsqu’elles sont disponibles.", "Ne proposer une réponse ou une candidature que si le dossier et le formulaire sont actifs."] : []} />;
}
