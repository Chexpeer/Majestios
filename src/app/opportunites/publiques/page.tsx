import { redirect } from "next/navigation";

export const metadata = {
  title: "Marchés publics — MajestiOS",
  description: "Accéder aux marchés publics, aux appels d’offres et à la recherche par catégorie ou territoire."
};

export default function LegacyPublicOpportunitiesPage() {
  redirect("/opportunites/marches-publics");
}
