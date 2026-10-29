import { redirect } from "next/navigation";

export const metadata = {
  title: "Intelligence entreprises — MajestiOS",
  description: "Relier les évolutions économiques vérifiées à des hypothèses de développement commercial."
};

export default function LegacyBusinessRadarPage() {
  redirect("/business/intelligence-entreprises");
}
