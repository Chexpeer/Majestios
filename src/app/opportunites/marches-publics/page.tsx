import PublicTendersSearch from "@/components/public-tenders-search";

export const metadata = {
  title: "Marchés publics — MajestiOS",
  description: "Rechercher les avis de marchés publics issus du BOAMP, filtrer par mots-clés, département, catégorie et disponibilité.",
};

export default function PublicTendersPage() {
  return <PublicTendersSearch />;
}
