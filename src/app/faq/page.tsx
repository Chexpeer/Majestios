import { redirect } from "next/navigation";

// URL historique : la FAQ officielle est centralisée dans « Comprendre MajestiOS ».
export default function LegacyFaqRedirect() {
  redirect("/comprendre/faq");
}
